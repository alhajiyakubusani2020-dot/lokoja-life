module.exports = [
"[project]/src/components/game/screens/MapScreen.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapScreen",
    ()=>MapScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — MapScreen (Stage 2, R1 presentation pass)
 * -------------------------------------------------------
 * The functional Lokoja map: stylised canvas + tappable location markers
 * (current / available / locked states) + a bottom-sheet location panel
 * with the travel confirmation built from the pure travel system.
 *
 * R1 changes are presentation-only: SVG place icons on the markers, an
 * honest lock treatment without "Coming Soon" noise, slide-up sheet motion,
 * transport rows with the shared icon language. All fares, times and energy
 * costs still come from calculateTravel() — nothing is hard-coded here.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$MapCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/MapCanvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/biz.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BizBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/BizBlock.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FleetBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/FleetBlock.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FestivalPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/FestivalPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$RiversPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/RiversPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/LadderPanels.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LocationSheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/LocationSheet.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
;
;
// M6 — one dictionary for every weather word. Tips come straight from
// WEATHER_META, so a new sky can never ship with a silent HUD.
const WEATHER_HINT = Object.fromEntries(Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEATHER_META"]).map(([k, v])=>[
        k,
        v.tip
    ]));
/* ------------------------------- marker -------------------------------- */ function Marker({ location, isCurrent, isLocked, bizDot, civicAlert, garageDot, darkZone, festivalDot, riverDot, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onSelect,
        "aria-label": `${location.name}${isCurrent ? ' (you are here)' : isLocked ? ' (locked)' : ''}`,
        className: "lko-press absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
        style: {
            left: `${location.mapX}%`,
            top: `${location.mapY}%`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-md transition-transform ${isCurrent ? 'border-[var(--lko-green)] ring-4 ring-[var(--lko-green)]/25' : 'border-white/95'} ${isLocked ? 'opacity-45 grayscale' : ''}`,
                style: {
                    background: location.color
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                        id: location.id,
                        size: 17,
                        className: "text-white"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    isCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -bottom-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-[var(--lko-green)]",
                        style: {
                            width: 18,
                            height: 18
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckIcon"], {
                            size: 9,
                            className: "text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -bottom-1.5 -right-1.5 flex items-center justify-center rounded-full border-2 border-white bg-[#5a5a52]",
                        style: {
                            width: 18,
                            height: 18
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LockIcon"], {
                            size: 9,
                            className: "text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    bizDot && !isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1.5 -left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-[var(--lko-gold)] text-[8px] font-black text-[#3d2a00]",
                        style: {
                            width: 18,
                            height: 18
                        },
                        "aria-hidden": true,
                        children: "₦"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    civicAlert && !isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1.5 -right-1.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-[#c0392b]",
                        style: {
                            width: 14,
                            height: 14
                        },
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    garageDot && !isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "map-garage-dot",
                        className: "absolute -bottom-1.5 -left-1.5 flex items-center justify-center rounded-full border-2 border-white bg-[#3f6b4f] text-[8px]",
                        style: {
                            width: 18,
                            height: 18
                        },
                        "aria-hidden": true,
                        children: "🔧"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this),
                    darkZone && !isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "map-dark-zone",
                        className: "absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse rounded-full border-2 border-white bg-[#2b1a16] px-1 text-[8px]",
                        style: {
                            height: 18,
                            minWidth: 18
                        },
                        "aria-hidden": true,
                        children: "⚡"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    festivalDot && !isLocked && !darkZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "map-festival-dot",
                        className: "absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse rounded-full border-2 border-white bg-[#ffd166] px-1 text-[8px]",
                        style: {
                            height: 18,
                            minWidth: 18
                        },
                        "aria-hidden": true,
                        children: "🎉"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this),
                    riverDot && !isLocked && !darkZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "map-river-dot",
                        className: "absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse rounded-full border-2 border-white bg-[#0369a1] px-1 text-[8px]",
                        style: {
                            height: 18,
                            minWidth: 18
                        },
                        "aria-hidden": true,
                        children: "🌊"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `mt-1 rounded-md px-1.5 py-px text-[9px] font-extrabold leading-tight shadow-sm ${isCurrent ? 'bg-[var(--lko-green)] text-white' : 'bg-white/95 text-[var(--lko-ink)]'}`,
                children: location.shortName
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
/* ---------------------------- travel option ----------------------------- */ function TravelOptionRow({ plan, label, transport, personal, emoji, disabled, disabledReason, onConfirm }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onConfirm,
        disabled: disabled,
        className: `lko-press flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left ${disabled ? 'cursor-not-allowed border-black/[0.05] bg-black/[0.03] opacity-60' : personal ? 'border-[var(--lko-gold)]/50 bg-[var(--lko-gold-soft)]/40 hover:border-[var(--lko-gold)]' : 'border-black/[0.07] bg-white hover:border-[var(--lko-green)]/50'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${disabled ? 'bg-black/[0.05] text-[var(--lko-ink-soft)]' : 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'}`,
                "aria-hidden": true,
                children: personal && emoji ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[19px] leading-none",
                    children: emoji
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                    lineNumber: 216,
                    columnNumber: 30
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransportIcon"], {
                    name: transport,
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                    lineNumber: 216,
                    columnNumber: 90
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-sm font-extrabold text-[var(--lko-ink)]",
                        children: [
                            label,
                            personal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1.5 rounded-full bg-[var(--lko-gold)]/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]",
                                children: "fuel · no fare"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: disabled ? disabledReason : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClockIcon"], {
                                    size: 11
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this),
                                plan.minutes,
                                " min trip"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num block text-sm font-extrabold text-[var(--lko-terra)]",
                        children: plan.cost === 0 ? 'Free' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(plan.cost)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num flex items-center justify-end gap-0.5 text-[11px] font-bold text-[#b57d0a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EnergyIcon"], {
                                size: 11
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            "−",
                            plan.energyCost
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
function MapScreen({ focusLocationId, onFocusHandled, onOpenWork }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.chaos);
    const calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.calendar);
    const isTravelling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.isTravelling);
    const travel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.travel);
    const eatMeal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.eatMeal);
    const mealPriceAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.mealPriceAt);
    const [userSelectedId, setUserSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(focusLocationId ?? null);
    /* ---------------- exploration progress (session-spanning, not in the save) ---------------- */ const [discovered, setDiscovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        try {
            const raw = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].discoveryKey);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch  {
            return new Set();
        }
    });
    const [recordedLoc, setRecordedLoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(world.currentLocation);
    // visiting a place counts too — travelling IS discovering
    // (adjust-state-during-render: syncs discovery to the live location)
    if (recordedLoc !== world.currentLocation) {
        setRecordedLoc(world.currentLocation);
        setDiscovered((prev)=>{
            if (prev.has(world.currentLocation)) return prev;
            const next = new Set(prev);
            next.add(world.currentLocation);
            try {
                localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].discoveryKey, JSON.stringify([
                    ...next
                ]));
            } catch  {
            /* ignore */ }
            return next;
        });
    }
    const undiscovered = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].filter((l)=>!discovered.has(l.id));
    // consume the focus request (parent clears it) — the selection itself was
    // already captured in the state initializer above
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (focusLocationId) onFocusHandled?.();
    }, [
        focusLocationId,
        onFocusHandled
    ]);
    const origin = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
    const selected = userSelectedId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][userSelectedId] : null;
    const isSelectedCurrent = selected?.id === origin.id;
    const isSelectedLocked = !!selected && player.level < selected.unlockLevel;
    // travel options for the selected destination — public modes + YOUR rides (M4)
    // M6 — a flood day closes the riverfront: the Confluence simply has no
    // travel rows today, and the sheet says why.
    const flooded = !!selected && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weatherBlocksLocation"])(world.weather, selected.id);
    const plans = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!selected || isSelectedCurrent || isSelectedLocked) return [];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weatherBlocksLocation"])(world.weather, selected.id)) return [];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["allTravelOptions"])(origin, selected, world.weather, world.timeOfDay, player.vehicles, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fuelMultFor"])(world.day), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pavedMinutesMult"])(calendar, world.day, selected.id));
    }, [
        selected,
        origin,
        isSelectedCurrent,
        isSelectedLocked,
        world.weather,
        world.timeOfDay,
        player.vehicles,
        world.day,
        calendar
    ]);
    const openLocation = (id)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        setUserSelectedId(id);
    };
    const confirmTravel = (transport)=>{
        if (!selected) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        travel(selected.id, transport);
        setUserSelectedId(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pt-3 sm:px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-card mb-3 flex items-center gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-river-soft)] text-[var(--lko-river)]",
                        "aria-hidden": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PinIcon"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 348,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                                children: "Current location"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            isTravelling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display flex animate-pulse items-center gap-1.5 text-base text-[var(--lko-gold-deep)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KekeIcon"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                        lineNumber: 356,
                                        columnNumber: 15
                                    }, this),
                                    " Travelling…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display flex items-center gap-1.5 truncate text-base",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                        id: origin.id,
                                        size: 16,
                                        className: "shrink-0 text-[var(--lko-terra)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this),
                                    origin.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-green-deep)]",
                        children: [
                            "Day ",
                            world.day
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            player.vehicles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                "data-testid": "map-rides",
                className: "mb-2 flex flex-wrap items-center gap-1.5 px-1 text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-extrabold uppercase tracking-wide",
                        children: "Your rides:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, this),
                    player.vehicles.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center gap-1 rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[10.5px] font-extrabold text-[#8a5a00]",
                            children: [
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][v.model].emoji,
                                " ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][v.model].short,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lko-num font-bold opacity-70",
                                    children: v.plate
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 382,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, v.id, true, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 377,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, this),
            WEATHER_HINT[world.weather] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WeatherIcon"], {
                        name: world.weather,
                        size: 13
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 389,
                        columnNumber: 11
                    }, this),
                    WEATHER_HINT[world.weather]
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 388,
                columnNumber: 9
            }, this),
            world.weather === 'flood' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-2 flex items-center gap-1.5 rounded-xl border border-[var(--lko-river)]/30 bg-[var(--lko-river-soft)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--lko-river)]",
                children: "🌊 Flood watch: the Confluence riverfront is CLOSED today — journeys crawl, food prices climb."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 394,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "-mx-2 sm:mx-auto w-auto sm:w-full sm:max-w-[620px] lg:max-w-[640px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-card relative aspect-square w-full overflow-hidden p-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$MapCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapCanvas"], {}, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 403,
                            columnNumber: 11
                        }, this),
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].map((l)=>{
                            // M3/M2 map layer — the city tells you where business & civic business waits
                            const host = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizAtLocation"])(l.id);
                            const owned = host ? player.businesses.find((b)=>b.typeId === host.typeId) : undefined;
                            const bizDot = !!owned && owned.accrued > 0;
                            const civicAlert = l.id === 'government-area' && !!civic && (civic.nepa.owed > 0 || civic.kgirs.assessed > 0 || civic.kgirs.warrant);
                            // M8 — the dark zone wears the boom badge on the map
                            const darkZone = !!chaos.active && chaos.active.zoneId === l.id;
                            // M10 — the calendar wears the party badge on the map
                            const f = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["festivalForDay"])(world.day);
                            const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weddingForCycle"])(world.day);
                            const festivalDot = f?.venueId === l.id || wedding.isToday && wedding.venueId === l.id || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ramMarketDayIndex"])(world.day) > 0 && l.id === 'kpata-market' || !!calendar.paving && calendar.paving.zoneId === l.id;
                            // M11 — the water wears the 🌊 badge on the map
                            const riverDot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, l.id);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Marker, {
                                location: l,
                                isCurrent: l.id === origin.id && !isTravelling,
                                isLocked: player.level < l.unlockLevel,
                                bizDot: bizDot,
                                civicAlert: civicAlert,
                                garageDot: l.id === 'transport-area',
                                darkZone: darkZone,
                                festivalDot: festivalDot,
                                riverDot: riverDot,
                                onSelect: ()=>openLocation(l.id)
                            }, l.id, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 425,
                                columnNumber: 15
                            }, this);
                        }),
                        isTravelling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lko-scrim absolute inset-0 z-20 flex items-center justify-center bg-[var(--lko-cream)]/40 backdrop-blur-[1px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-display flex items-center gap-2 rounded-full border border-[var(--lko-gold)]/40 bg-white/95 px-4 py-2 text-sm shadow-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KekeIcon"], {
                                        size: 17,
                                        className: "animate-pulse text-[var(--lko-gold-deep)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                        lineNumber: 443,
                                        columnNumber: 17
                                    }, this),
                                    "Travelling…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 442,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 441,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                    lineNumber: 402,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-card mt-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                                children: "Lokoja atlas"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 454,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-num rounded-full bg-[var(--lko-river-soft)] px-2.5 py-0.5 text-[11px] font-extrabold text-[var(--lko-river)]",
                                children: [
                                    discovered.size,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].length,
                                    " explored"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 457,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 453,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 h-2 w-full overflow-hidden rounded-full bg-black/[0.06]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-[var(--lko-green)] transition-[width] duration-500",
                            style: {
                                width: `${discovered.size / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].length * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 461,
                        columnNumber: 9
                    }, this),
                    undiscovered.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[11.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                        children: [
                            "Still out there: ",
                            undiscovered.map((l)=>l.name).join(', '),
                            ". Walk there in the 3D city to discover it."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 468,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[11.5px] font-semibold leading-snug text-[var(--lko-green-deep)]",
                        children: "You don find every corner of Lokoja. The whole city sabi your face. 🏙️"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 472,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 452,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransportIcon"], {
                                name: "walk",
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 480,
                                columnNumber: 58
                            }, this),
                            " Walk is free but tiring"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 480,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransportIcon"], {
                                name: "keke",
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 481,
                                columnNumber: 58
                            }, this),
                            " Keke is cheap"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 481,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransportIcon"], {
                                name: "taxi",
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 482,
                                columnNumber: 58
                            }, this),
                            " Taxi is fastest"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 482,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 479,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3f6b4f] text-[7px]",
                                children: "🔧"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 486,
                                columnNumber: 58
                            }, this),
                            " Motor Park garage sells rides"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 486,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: "🏍️ Your rides sip fuel — no fare"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 487,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: "🛵 Own a ride? Driver gigs wait at the park"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 488,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--lko-gold)] text-[7px] font-black text-[#3d2a00]",
                                children: "₦"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 492,
                                columnNumber: 58
                            }, this),
                            " Your shop has money"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 492,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2.5 w-2.5 rounded-full bg-[#c0392b]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                lineNumber: 493,
                                columnNumber: 58
                            }, this),
                            " Government wan see you"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 493,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 491,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50",
                role: "dialog",
                "aria-label": `${selected.name} details`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Close panel",
                        onClick: ()=>setUserSelectedId(null),
                        className: "lko-scrim absolute inset-0 bg-black/45"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 500,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lko-sheet absolute inset-x-0 bottom-0 mx-auto w-full max-w-md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-h-[86dvh] overflow-y-auto rounded-t-3xl border-t border-black/[0.06] bg-[var(--lko-surface)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-[var(--lko-shadow-lg)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                                            style: {
                                                background: `${selected.color}1e`,
                                                color: selected.accent
                                            },
                                            "aria-hidden": true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                                id: selected.id,
                                                size: 28
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                lineNumber: 517,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "lko-display text-lg leading-tight",
                                                    children: selected.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-0.5 text-xs font-semibold italic text-[var(--lko-ink-soft)]",
                                                    children: [
                                                        "“",
                                                        selected.tagline,
                                                        "”"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 519,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 511,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]",
                                    children: selected.description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 526,
                                    columnNumber: 15
                                }, this),
                                !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LocationSheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocVibeLine"], {
                                    locationId: selected.id
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 531,
                                    columnNumber: 37
                                }, this),
                                isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 rounded-xl border border-black/[0.06] bg-black/[0.03] p-4 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "flex items-center justify-center gap-1.5 text-sm font-extrabold",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LockIcon"], {
                                                    size: 15,
                                                    className: "text-[var(--lko-ink-soft)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 21
                                                }, this),
                                                "Not open to you yet"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 536,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-[var(--lko-ink-soft)]",
                                            children: [
                                                "Reach ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: [
                                                        "Level ",
                                                        selected.unlockLevel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 27
                                                }, this),
                                                " to unlock this part of Lokoja. You are Level ",
                                                player.level,
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 540,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 535,
                                    columnNumber: 17
                                }, this),
                                !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        (selected.id === 'food-area' || selected.id === 'kpata-market') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 rounded-xl border border-black/[0.06] bg-[var(--lko-gold-soft)]/40 p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]",
                                                    children: [
                                                        selected.id === 'food-area' ? '🍲 Eat a proper meal' : '🧺 Market fresh',
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold normal-case text-[var(--lko-ink-soft)]",
                                                            children: [
                                                                "hunger ",
                                                                Math.round(player.needs.hunger),
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                            lineNumber: 555,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FOOD"].meals.map((m)=>{
                                                            // M6 — night dishes wake only at the night market
                                                            if (m.night) return null;
                                                            const price = mealPriceAt(m.key, selected.id);
                                                            const afford = player.cash >= price;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                disabled: !afford || isTravelling,
                                                                onClick: ()=>{
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                                    eatMeal(m.key, selected.id);
                                                                },
                                                                className: `lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-left ${afford ? '' : 'cursor-not-allowed opacity-55'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "min-w-0 flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "block truncate text-[12.5px] font-extrabold leading-tight",
                                                                                children: m.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                lineNumber: 578,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                                                children: m.detail
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                lineNumber: 579,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                        lineNumber: 577,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex shrink-0 flex-col items-end",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "lko-num text-[12px] font-extrabold text-[var(--lko-green)]",
                                                                                children: [
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(price),
                                                                                    price !== m.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "ml-0.5 text-[9px] font-bold text-[var(--lko-gold-deep)]",
                                                                                        children: "today"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                        lineNumber: 582,
                                                                                        columnNumber: 152
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                lineNumber: 582,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                                                                children: [
                                                                                    "+",
                                                                                    m.hunger,
                                                                                    " hunger"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                lineNumber: 583,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                        lineNumber: 581,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, m.key, true, {
                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                lineNumber: 566,
                                                                columnNumber: 29
                                                            }, this);
                                                        }),
                                                        selected.id === 'food-area' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNightMarketOpen"])(world.timeOfDay) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1.5 flex items-center justify-between rounded-lg bg-[#0a1230] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[#ffd88a]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "🌙 Night market dey open"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                            lineNumber: 592,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold opacity-80",
                                                                            children: "late plates, fair price"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                            lineNumber: 593,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                    lineNumber: 591,
                                                                    columnNumber: 29
                                                                }, this),
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FOOD"].meals.filter((m)=>m.night).map((m)=>{
                                                                    const price = mealPriceAt(m.key, selected.id);
                                                                    const afford = player.cash >= price;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        disabled: !afford || isTravelling,
                                                                        onClick: ()=>{
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                                            eatMeal(m.key, selected.id);
                                                                        },
                                                                        className: `lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg border border-[#0a1230]/15 bg-[#0a1230]/[0.04] px-2.5 py-1.5 text-left ${afford ? '' : 'cursor-not-allowed opacity-55'}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "min-w-0 flex-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "block truncate text-[12.5px] font-extrabold leading-tight",
                                                                                        children: [
                                                                                            "🌙 ",
                                                                                            m.label
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                        lineNumber: 611,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                                                        children: m.detail
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                        lineNumber: 612,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                lineNumber: 610,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "flex shrink-0 flex-col items-end",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "lko-num text-[12px] font-extrabold text-[var(--lko-green)]",
                                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(price)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                        lineNumber: 615,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                                                                        children: [
                                                                                            "+",
                                                                                            m.hunger,
                                                                                            " hunger"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                        lineNumber: 616,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                                lineNumber: 614,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, m.key, true, {
                                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                        lineNumber: 599,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 552,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-1.5 mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                                            children: "Activities here"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 627,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1.5",
                                            children: selected.activities.map((a)=>{
                                                // eat / shop-food render as the meal menu above
                                                if ((a.key === 'eat' || a.key === 'shop-food') && (selected.id === 'food-area' || selected.id === 'kpata-market')) return null;
                                                // Stage 3: work content is live — chips deep-link to the Work tab
                                                const isLive = a.stage <= 3;
                                                const isWork = a.key.startsWith('job-') || a.key === 'hustle';
                                                if (isLive && isWork && onOpenWork) {
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                            setUserSelectedId(null);
                                                            onOpenWork();
                                                        },
                                                        className: "lko-press inline-flex items-center gap-0.5 rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-gold-deep)]",
                                                        children: [
                                                            a.label,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArrowRightIcon"], {
                                                                size: 11
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                                lineNumber: 649,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, a.key, true, {
                                                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                        lineNumber: 639,
                                                        columnNumber: 27
                                                    }, this);
                                                }
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${isLive ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                                                    children: [
                                                        !isLive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LockIcon"], {
                                                            size: 10
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 39
                                                        }, this),
                                                        a.label,
                                                        !isLive && ` (Stage ${a.stage})`
                                                    ]
                                                }, a.key, true, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 630,
                                            columnNumber: 19
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BizBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BizBlock"], {
                                            locationId: selected.id
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 670,
                                            columnNumber: 41
                                        }, this),
                                        !isSelectedLocked && selected.id === 'transport-area' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FleetBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FleetBlock"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 673,
                                            columnNumber: 77
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FestivalPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FestivalPanel"], {
                                            location: selected
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 676,
                                            columnNumber: 41
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$RiversPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RiversPanel"], {
                                            location: selected
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 679,
                                            columnNumber: 41
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EducationPanel"], {
                                            location: selected
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 682,
                                            columnNumber: 41
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HousingPanel"], {
                                            location: selected
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 683,
                                            columnNumber: 41
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JapaPanel"], {
                                            location: selected
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 684,
                                            columnNumber: 41
                                        }, this),
                                        !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LocationSheet$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocActionBoard"], {
                                            locationId: selected.id,
                                            isCurrent: isSelectedCurrent,
                                            onOpenWork: onOpenWork,
                                            onClose: ()=>setUserSelectedId(null)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 688,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true),
                                !isSelectedCurrent && !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "lko-num mb-1.5 mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                                            children: [
                                                "Travel to ",
                                                selected.name,
                                                "? (",
                                                plans[0]?.plan.distanceKm.toFixed(1),
                                                " km from ",
                                                origin.shortName,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 701,
                                            columnNumber: 19
                                        }, this),
                                        flooded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 flex items-center gap-1.5 rounded-xl border border-[var(--lko-river)]/30 bg-[var(--lko-river-soft)] px-3 py-2.5 text-[12px] font-bold text-[var(--lko-river)]",
                                            children: "🌊 Flood don block the road — the riverfront is closed today. Come back when the water drop."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 705,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-2",
                                            children: plans.map((option)=>{
                                                const tooPoor = player.cash < option.plan.cost;
                                                const tooTired = player.needs.energy < option.plan.energyCost;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TravelOptionRow, {
                                                    plan: option.plan,
                                                    label: option.label,
                                                    transport: option.transport,
                                                    personal: option.personal,
                                                    emoji: option.emoji,
                                                    disabled: tooPoor || tooTired,
                                                    disabledReason: tooPoor ? `You need ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(option.plan.cost)} for this ${option.personal ? 'fuel' : 'fare'}` : 'You are too tired for this trip',
                                                    onConfirm: ()=>confirmTravel(option.transport)
                                                }, option.transport, false, {
                                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                                    lineNumber: 714,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 709,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true),
                                isSelectedCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--lko-green-soft)] p-3 text-center text-sm font-bold text-[var(--lko-green-deep)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                            lineNumber: 739,
                                            columnNumber: 19
                                        }, this),
                                        "You are already here."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 738,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        setUserSelectedId(null);
                                    },
                                    className: "lko-press mt-3 min-h-[48px] w-full rounded-xl border border-black/[0.08] bg-white py-3 text-sm font-extrabold text-[var(--lko-ink)]",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                                    lineNumber: 744,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                            lineNumber: 507,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                        lineNumber: 506,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MapScreen.tsx",
                lineNumber: 498,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MapScreen.tsx",
        lineNumber: 344,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_game_screens_MapScreen_tsx_ec89877d._.js.map