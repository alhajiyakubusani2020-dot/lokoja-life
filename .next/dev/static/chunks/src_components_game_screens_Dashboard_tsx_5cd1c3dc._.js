(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/screens/Dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dashboard",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — Dashboard (R1 visual overhaul + Stage 5 tabs)
 * The in-game shell: a compact HUD header, the living-world hero on the
 * Home tab (driven by the real world clock + weather), needs/skills/rest,
 * and the 7-tab bottom navigation (Stage 5 adds the Phone).
 * Tabs that arrive in later stages show honest "coming soon" panels with
 * real data teasers where available.
 *
 * R1 is presentation-only: every store action, guard and data source below
 * is untouched — only the visual layer was redesigned.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$NeedsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/NeedsBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/BottomNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LivingScene$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/LivingScene.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ChaosBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ChaosBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FestivalBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/FestivalBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$RiversBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/RiversBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/LadderBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$PulseBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/PulseBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$CasualShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/CasualShell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GuestGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/GuestGate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Juice$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/Juice.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$MapScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/MapScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$WorkScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/WorkScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/PhoneScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$WorldPhoneLayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/WorldPhoneLayer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$diegetic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/diegetic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/story.ts [app-client] (ecmascript)"); // M19 — the story's live task
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$GraphicsPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/GraphicsPicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/skills.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$foods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/foods.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$world$2d$chunk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/world-chunk.ts [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
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
;
;
;
;
;
;
;
;
;
/* SILK II — THE WORLD RIDES ITS OWN CHUNK: three.js + the OSM geo stack
 * (formerly ~490KB gz welded into the dashboard chunk) now load when the
 * player first opens the world — idle-preloaded right after boot, so
 * map-first / phone-first sessions never pay for the 3D stack.
 * THE GEO GATE: the geo data itself moved to /world/geo-v1.bin (60KB
 * binary, element-exact round-trip proven) — the loader awaits the gate
 * (fetch + decode + fill) BEFORE the WorldTab chunk evaluates, because
 * layout.ts derives module-scope structures from the filled arrays. */ const WorldTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/game/world3d/geo-gate.ts [app-client] (ecmascript, next/dynamic entry, async loader)").then((g)=>g.openWorldGeo()).then(()=>__turbopack_context__.A("[project]/src/components/game/world/WorldTab.tsx [app-client] (ecmascript, next/dynamic entry, async loader)")).then((m)=>m.WorldTab), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/game/world/WorldTab.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
_c = WorldTab;
/* --------------------------- small HUD helpers ----------------------------- */ function Chip({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c1 = Chip;
/** Section heading with the shared icon language (replaces emoji prefixes). */ function SectionTitle({ icon, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: "mb-2.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[var(--lko-gold-deep)]",
                "aria-hidden": true,
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c2 = SectionTitle;
/* --------------------------------- home tab -------------------------------- */ function HomeTab({ onExploreWorld, onOpenPhone }) {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HomeTab.useGameStore[player]": (s)=>s.player
    }["HomeTab.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HomeTab.useGameStore[world]": (s)=>s.world
    }["HomeTab.useGameStore[world]"]);
    const isTravelling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HomeTab.useGameStore[isTravelling]": (s)=>s.isTravelling
    }["HomeTab.useGameStore[isTravelling]"]);
    const rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HomeTab.useGameStore[rest]": (s)=>s.rest
    }["HomeTab.useGameStore[rest]"]);
    const condition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["conditionSummary"])(player.needs);
    const location = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
    const xpNeeded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xpToNextLevel"])(player.level);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pt-3 sm:px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ChaosBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChaosBanner"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FestivalBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FestivalBanner"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$RiversBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RiversBanner"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LadderBanner"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$PulseBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PulseBanner"], {
                onOpenPhone: onOpenPhone
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$CasualShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingCard"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$CasualShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoalsCard"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-fade relative h-44 overflow-hidden rounded-3xl border border-black/[0.07] shadow-[var(--lko-shadow-md)] sm:h-52",
                "aria-label": `You are at ${location.name}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LivingScene$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LivingScene"], {
                        timeOfDay: world.timeOfDay,
                        weather: world.weather,
                        className: "absolute inset-0 h-full w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/25",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/85",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PinIcon"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this),
                                        "You are here"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                isTravelling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "lko-display mt-0.5 flex items-center gap-1.5 text-xl text-white animate-pulse",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KekeIcon"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 161,
                                            columnNumber: 17
                                        }, this),
                                        " Travelling…"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "lko-display mt-0.5 flex items-center gap-2 text-xl leading-tight text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                            id: location.id,
                                            size: 20,
                                            className: "shrink-0 text-[#ffd88a]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: location.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 166,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this),
                                !isTravelling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 truncate text-[11.5px] font-semibold italic text-white/80",
                                    children: [
                                        "“",
                                        location.tagline,
                                        "”"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-3 top-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                onExploreWorld();
                            },
                            className: "lko-press flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorldIcon"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                "Explore in 3D"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-3 top-12 flex flex-col items-end gap-1.5 sm:top-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Chip, {
                                className: "bg-black/30 text-white backdrop-blur-sm",
                                children: [
                                    "Day ",
                                    world.day
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Chip, {
                                className: "bg-black/30 text-white backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimeIcon"], {
                                        name: world.timeOfDay,
                                        size: 13,
                                        className: "text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "capitalize",
                                        children: world.timeOfDay
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Chip, {
                                className: "bg-black/30 text-white backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeatherIcon"], {
                                        name: world.weather,
                                        size: 13,
                                        className: "text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEATHER_META"][world.weather]?.label ?? world.weather
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `lko-fade mt-3 flex items-center gap-2 rounded-2xl px-4 py-2.5 ${condition.tone === 'bad' ? 'border border-red-200 bg-red-50' : 'lko-card'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[var(--lko-terra)]",
                        "aria-hidden": true,
                        children: condition.tone === 'good' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FireIcon"], {
                            size: 17
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 213,
                            columnNumber: 40
                        }, this) : condition.tone === 'bad' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertIcon"], {
                            size: 17
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 213,
                            columnNumber: 92
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThumbsUpIcon"], {
                            size: 17
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 213,
                            columnNumber: 118
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13px] font-semibold text-[var(--lko-ink)]",
                        children: condition.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "lko-card p-4",
                        "aria-label": "Player needs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FireIcon"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 221,
                                    columnNumber: 31
                                }, void 0),
                                children: "Condition"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$NeedsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeedsBar"], {
                                        need: "health",
                                        value: player.needs.health
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$NeedsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeedsBar"], {
                                        need: "energy",
                                        value: player.needs.energy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$NeedsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeedsBar"], {
                                        need: "hunger",
                                        value: player.needs.hunger
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 225,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$NeedsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NeedsBar"], {
                                        need: "mood",
                                        value: player.needs.mood
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "lko-card p-4",
                        "aria-label": "Skills",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendUpIcon"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 231,
                                    columnNumber: 31
                                }, void 0),
                                children: "Skills"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-2",
                                children: [
                                    'hustle',
                                    'smart',
                                    'social'
                                ].map((key)=>{
                                    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKILL_META"][key];
                                    const cap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skillCap"])(player.level);
                                    const capped = player.skills[key] >= cap;
                                    const toNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skillXpToNext"])();
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center rounded-xl border border-black/[0.05] bg-[var(--lko-cream)] py-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `flex h-8 w-8 items-center justify-center rounded-full ${key === 'hustle' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : key === 'smart' ? 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]' : 'bg-[var(--lko-green-soft)] text-[var(--lko-green)]'}`,
                                                "aria-hidden": true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SkillIcon"], {
                                                    name: key,
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 245,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-1 text-[11px] font-bold text-[var(--lko-ink-soft)]",
                                                children: meta.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 257,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-display lko-num text-lg text-[var(--lko-green-deep)]",
                                                children: player.skills[key]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 258,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-1 h-1.5 w-3/4 overflow-hidden rounded-full bg-black/[0.08]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-full rounded-full bg-[var(--lko-gold)] transition-[width] duration-500",
                                                    style: {
                                                        width: capped ? '100%' : `${Math.min(100, player.skillXp[key] / toNext * 100)}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 260,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-num mt-0.5 text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                                children: capped ? 'MAX' : `${player.skillXp[key]}/${toNext}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 241,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 p-4",
                "aria-label": "Time and rest",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MoonIcon"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 278,
                            columnNumber: 29
                        }, void 0),
                        children: "Rest at home"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    world.currentLocation === 'home' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    rest('nap');
                                },
                                className: "lko-press flex min-h-[56px] items-center gap-2.5 rounded-xl bg-[var(--lko-gold)] px-3 py-2 text-left text-sm font-extrabold text-[#3d2a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.14)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClockIcon"], {
                                        size: 19,
                                        className: "shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Nap",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-0.5 block text-[10px] font-bold opacity-80",
                                                children: "+22 Energy • 1 slot"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 291,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    rest('sleep');
                                },
                                className: "lko-press flex min-h-[56px] items-center gap-2.5 rounded-xl bg-[var(--lko-green)] px-3 py-2 text-left text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MoonIcon"], {
                                        size: 19,
                                        className: "shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 301,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Sleep",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-0.5 block text-[10px] font-bold opacity-80",
                                                children: "Full rest • next morning"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 304,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 302,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-xl bg-black/[0.03] px-4 py-3 text-center text-xs font-semibold text-[var(--lko-ink-soft)]",
                        children: "Rest is only possible at your place. Open the Map to head home."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-num mt-2.5 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: [
                            Math.max(0, xpNeeded - player.xp),
                            " XP to Level ",
                            player.level + 1
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
_s(HomeTab, "zEV9mK8iPZxhsqjaMQjja929Fik=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c3 = HomeTab;
/* --------------------------------- map tab --------------------------------- */ /** Stage 2: the map is live — see MapScreen. */ function MapTab({ focusLocationId, onFocusHandled, onOpenWork }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$MapScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapScreen"], {
        focusLocationId: focusLocationId,
        onFocusHandled: onFocusHandled,
        onOpenWork: onOpenWork
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 335,
        columnNumber: 5
    }, this);
}
_c4 = MapTab;
/* --------------------------------- work tab -------------------------------- */ /** Stage 3: the economy is live — see WorkScreen. */ function WorkTab({ onGoToMap }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$WorkScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkScreen"], {
        onGoToMap: onGoToMap
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 347,
        columnNumber: 10
    }, this);
}
_c5 = WorkTab;
/* -------------------------------- phone tab -------------------------------- */ /** Stage 5: the handset — chats, bank, hustle shortcut, settings (see PhoneScreen). */ function PhoneTab({ onOpenWork }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PhoneScreen"], {
        onOpenWork: onOpenWork
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 354,
        columnNumber: 10
    }, this);
}
_c6 = PhoneTab;
/* ---------------------------------- bag tab --------------------------------- */ function BagTab() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComingSoon"], {
                icon: "bag",
                title: "Inventory & Shops",
                stage: "Stage 4",
                description: "Buy food, drinks and tools; keep your pace meals and fishing gear close. A hungry hustler cannot hustle."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 362,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "px-4 sm:px-6",
                "aria-label": "Coming food menu",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: "The menu is getting ready"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 370,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "flex flex-col gap-2",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$foods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOODS"].slice(0, 6).map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "lko-card flex items-center gap-3 p-3 opacity-80",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-lg",
                                        "aria-hidden": true,
                                        children: f.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold leading-tight",
                                                children: f.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 380,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-[11px] text-[var(--lko-ink-soft)]",
                                                children: f.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 381,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num text-xs font-extrabold text-[var(--lko-terra)]",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(f.price)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 383,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, f.id, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 375,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 373,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 361,
        columnNumber: 5
    }, this);
}
_c7 = BagTab;
/* -------------------------------- profile tab ------------------------------- */ function ProfileTab() {
    _s1();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[player]": (s)=>s.player
    }["ProfileTab.useGameStore[player]"]);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[settings]": (s)=>s.settings
    }["ProfileTab.useGameStore[settings]"]);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[account]": (s)=>s.account
    }["ProfileTab.useGameStore[account]"]);
    const fortress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[fortress]": (s)=>s.fortress
    }["ProfileTab.useGameStore[fortress]"]);
    const toggleSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[toggleSound]": (s)=>s.toggleSound
    }["ProfileTab.useGameStore[toggleSound]"]);
    const setChill = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[setChill]": (s)=>s.setChill
    }["ProfileTab.useGameStore[setChill]"]);
    const setMusic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[setMusic]": (s)=>s.setMusic
    }["ProfileTab.useGameStore[setMusic]"]);
    const setHaptics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[setHaptics]": (s)=>s.setHaptics
    }["ProfileTab.useGameStore[setHaptics]"]);
    const saveNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[saveNow]": (s)=>s.saveNow
    }["ProfileTab.useGameStore[saveNow]"]);
    const returnToMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[returnToMenu]": (s)=>s.returnToMenu
    }["ProfileTab.useGameStore[returnToMenu]"]);
    // M19 — the story's live task + the wardrobe's equipped walk
    const story = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[story]": (s)=>s.story
    }["ProfileTab.useGameStore[story]"]);
    const storyTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[storyTask]": (s)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentTask"])(s.story, {
                day: s.world?.day ?? 0,
                level: s.player?.level ?? 1,
                cash: s.player?.cash ?? 0
            })
    }["ProfileTab.useGameStore[storyTask]"]);
    const wardrobeActiveWalk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[wardrobeActiveWalk]": (s)=>s.wardrobe.activeWalk
    }["ProfileTab.useGameStore[wardrobeActiveWalk]"]);
    const pattiFound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileTab.useGameStore[pattiFound]": (s)=>Object.keys(s.patti.found).length
    }["ProfileTab.useGameStore[pattiFound]"]);
    // M14 — the fortress honesty row: the ledger's chain walks the live entries
    const chainOk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyChain"])([
        ...player.transactions
    ].reverse()).ok;
    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reputationTier"])(player.reputation);
    const nextTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextReputationTier"])(player.reputation);
    const xpNeeded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xpToNextLevel"])(player.level);
    const unlocked = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_UNLOCKS"]).filter(([lvl])=>Number(lvl) <= player.level).flatMap(([, items])=>items);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pt-3 sm:px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card flex items-center gap-4 p-4",
                "aria-label": "Identity",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                        config: player.avatar,
                        gender: player.gender,
                        withBackdrop: true,
                        className: "h-24 w-24 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 425,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "lko-display truncate text-xl",
                                children: player.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold capitalize text-[var(--lko-ink-soft)]",
                                children: [
                                    "Hustler • ",
                                    tier.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 428,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[11px] italic leading-snug text-[var(--lko-ink-soft)]",
                                children: [
                                    "“",
                                    tier.title,
                                    "”"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            account.linked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                "data-testid": "account-line",
                                className: "mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                children: [
                                    "🪪 ",
                                    account.handle,
                                    " — cloud on"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 435,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "claim-open",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].setState({
                                        gateOpen: true
                                    });
                                },
                                className: "lko-press mt-1.5 rounded-full bg-[var(--lko-gold)] px-2.5 py-1 text-[10px] font-extrabold text-[#33230a]",
                                children: "🪪 Guest mode — claim your name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 426,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 424,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 flex items-center justify-between gap-3 p-4",
                "aria-label": "Chill mode",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[12px] font-extrabold",
                                children: "🍃 Chill Mode"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 453,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                children: "A gentler Lokoja: half the drain, kinder taxman, softer disco. Every law still runs."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 454,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "chill-toggle",
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            setChill(!settings.chill);
                        },
                        className: `lko-press relative h-8 w-14 shrink-0 rounded-full transition-colors ${settings.chill ? 'bg-[var(--lko-green)]' : 'bg-black/[0.12]'}`,
                        "aria-pressed": settings.chill,
                        "aria-label": "Toggle Chill Mode",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform",
                            style: {
                                left: settings.chill ? 30 : 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 465,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 451,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2",
                "aria-label": "Music and haptics",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[12px] font-extrabold",
                                        children: "🎵 Afro-Fusion Soundtrack"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 476,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                        children: "Procedural highlife — zero download, the city plays it live."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 477,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "music-toggle",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    setMusic(!settings.music);
                                },
                                className: `lko-press relative h-8 w-14 shrink-0 rounded-full transition-colors ${settings.music ? 'bg-[var(--lko-green)]' : 'bg-black/[0.12]'}`,
                                "aria-pressed": settings.music,
                                "aria-label": "Toggle soundtrack",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform",
                                    style: {
                                        left: settings.music ? 30 : 4
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 488,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[12px] font-extrabold",
                                        children: "📳 Haptics"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 493,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                        children: "A small pulse when money lands, a postcard arrives, a secret opens."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 494,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "haptics-toggle",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    setHaptics(!settings.haptics);
                                },
                                className: `lko-press relative h-8 w-14 shrink-0 rounded-full transition-colors ${settings.haptics ? 'bg-[var(--lko-green)]' : 'bg-black/[0.12]'}`,
                                "aria-pressed": settings.haptics,
                                "aria-label": "Toggle haptics",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform",
                                    style: {
                                        left: settings.haptics ? 30 : 4
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 505,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 498,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 473,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 p-4",
                "aria-label": "Story quest",
                "data-testid": "story-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[12px] font-extrabold",
                                children: "🌅 THE CONFLUENCE PATH"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-testid": "story-chapter",
                                className: "rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                children: [
                                    "Chapter ",
                                    story.chapter,
                                    "/5"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 514,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 512,
                        columnNumber: 9
                    }, this),
                    story.doctorDay > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                        children: "Dr. Musa dey FTH — the boy wey you meet for Patti base don turn doctor. Your name dey inside that story."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 519,
                        columnNumber: 11
                    }, this) : storyTask ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-[11.5px] font-extrabold leading-snug",
                                children: storyTask.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 524,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                children: storyTask.hint
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            storyTask.kind === 'carry' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "story-act",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().storyCarrySand();
                                },
                                className: "lko-press mt-2.5 min-h-[42px] w-full rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white",
                                children: "⛏️ Carry sand (14 energy · ₦400)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 527,
                                columnNumber: 15
                            }, this),
                            storyTask.kind === 'pay' && storyTask.id === 'notebook' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "story-act",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().storyPayNotebook();
                                },
                                className: "lko-press mt-2.5 min-h-[42px] w-full rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white",
                                children: [
                                    "📒 Pay the levy (",
                                    storyTask.cost ? `₦${storyTask.cost.toLocaleString('en-NG')}` : 'your word — level 5',
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, this),
                            storyTask.kind === 'pay' && storyTask.id === 'fever' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "story-act",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().storyPayFever();
                                },
                                className: "lko-press mt-2.5 min-h-[42px] w-full rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white",
                                children: "🏥 Settle the fever night (₦2,000)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 547,
                                columnNumber: 15
                            }, this),
                            storyTask.kind === 'pay' && storyTask.id === 'sponsor' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "story-act",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().storySponsor();
                                },
                                className: "lko-press mt-2.5 min-h-[42px] w-full rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white",
                                children: [
                                    "🪑 Sponsor the desk (₦500 · ",
                                    story.sponsoredDays,
                                    "/6)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 557,
                                columnNumber: 15
                            }, this),
                            storyTask.kind === 'wait' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "story-act",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().storyGraduate();
                                },
                                className: "lko-press mt-2.5 min-h-[42px] w-full rounded-xl bg-[var(--lko-gold)] text-[12px] font-extrabold text-[#33230a]",
                                children: "🎓 Attend the graduation — FTH"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 567,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                        children: "Day 3 — find the crusher boy at the Patti trail base. A story dey wait for the hill."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 578,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 511,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 flex items-center justify-between gap-3 p-4",
                "aria-label": "Patti secrets",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[12px] font-extrabold",
                                children: "🗿 Mt Patti Secrets"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 587,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                children: "Five dey hide for the hill. Walk near one — e go open."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 588,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 586,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "patti-count",
                        className: "shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                        children: [
                            pattiFound,
                            "/5"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 592,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 flex items-center justify-between gap-3 p-4",
                "aria-label": "Walk style",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-[12px] font-extrabold",
                            children: "🕺 Walk Style"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 600,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                            children: [
                                "Now walking: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    children: wardrobeActiveWalk
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 602,
                                    columnNumber: 26
                                }, this),
                                ". The Bend-Down Select dey inside the wardrobe (your room)."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 601,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                    lineNumber: 599,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 598,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 flex items-center justify-between gap-3 p-4",
                "aria-label": "Fortress status",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-[12px] font-extrabold",
                                children: "🛡️ Fortress"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 610,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                children: [
                                    "Save signed · ledger chained · income guarded. Anomalies: ",
                                    fortress.anomalies,
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "fortress-status",
                        className: `shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${chainOk ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'bg-[#fdecea] text-[#8a2a20]'}`,
                        children: chainOk ? '🔒 SECURE' : '⚠️ CHAIN'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 615,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 608,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 p-4",
                "aria-label": "Reputation",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarIcon"], {
                                        size: 13,
                                        className: "text-[var(--lko-gold-deep)]",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 629,
                                        columnNumber: 13
                                    }, this),
                                    "Reputation"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 628,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-display lko-num text-lg text-[var(--lko-terra)]",
                                children: player.reputation
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 632,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 627,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2.5 overflow-hidden rounded-full bg-black/[0.07]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-[var(--lko-terra)] transition-[width] duration-500",
                            style: {
                                width: nextTier ? `${Math.min(100, player.reputation / nextTier.tier.threshold * 100)}%` : '100%'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 635,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 634,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs font-semibold text-[var(--lko-ink-soft)]",
                        children: nextTier ? `${nextTier.remaining} rep to “${nextTier.tier.name}”` : 'You are a certified Big Player 🏆'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 644,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 626,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 p-4",
                "aria-label": "Life stats",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoinsIcon"], {
                                size: 13,
                                className: "text-[var(--lko-gold-deep)]",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 654,
                                columnNumber: 11
                            }, this),
                            "Life so far"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 653,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                        children: "Shifts worked"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 659,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-display lko-num text-lg text-[var(--lko-green-deep)]",
                                        children: player.stats.jobsCompleted
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 660,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 658,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                        children: "Hustles done"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 663,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-display lko-num text-lg text-[var(--lko-green-deep)]",
                                        children: player.stats.hustlesCompleted
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 664,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 662,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl bg-[var(--lko-green-soft)] px-3 py-2 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-green-deep)]",
                                        children: "Total earned"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 667,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-display lko-num text-base text-[var(--lko-green-deep)]",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(player.stats.totalEarned)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 668,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 666,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl bg-red-50 px-3 py-2 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-extrabold uppercase tracking-wider text-red-700",
                                        children: "Total spent"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 671,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-display lko-num text-base text-red-700",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(player.stats.totalSpent)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 672,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 670,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 657,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 652,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 p-4",
                "aria-label": "Your path",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendUpIcon"], {
                                size: 13,
                                className: "text-[var(--lko-gold-deep)]",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 680,
                                columnNumber: 11
                            }, this),
                            "Your path so far"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 679,
                        columnNumber: 9
                    }, this),
                    unlocked.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-[var(--lko-ink-soft)]",
                        children: "Level up to unlock new jobs, places and businesses."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 684,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "flex flex-wrap gap-1.5",
                        children: unlocked.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-green-deep)]",
                                children: u
                            }, u, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 690,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 688,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-num mt-2 text-[11px] text-[var(--lko-ink-soft)]",
                        children: [
                            "XP to Level ",
                            player.level + 1,
                            ": ",
                            Math.max(0, xpNeeded - player.xp)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 699,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 678,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "lko-card mt-3 mb-4 p-4",
                "aria-label": "Settings",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsIcon"], {
                                size: 13,
                                className: "text-[var(--lko-gold-deep)]",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 707,
                                columnNumber: 11
                            }, this),
                            "Settings"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 706,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-2 text-sm font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SoundIcon"], {
                                                size: 16,
                                                className: "text-[var(--lko-ink-soft)]",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 713,
                                                columnNumber: 15
                                            }, this),
                                            "Sound"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 712,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        role: "switch",
                                        "aria-checked": settings.sound,
                                        "aria-label": "Toggle sound",
                                        onClick: toggleSound,
                                        className: `lko-press h-8 w-14 rounded-full transition-colors ${settings.sound ? 'bg-[var(--lko-green)]' : 'bg-black/15'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `block h-6 w-6 rounded-full bg-white shadow transition-transform ${settings.sound ? 'translate-x-7' : 'translate-x-1'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 725,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 716,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 711,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$GraphicsPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphicsPicker"], {}, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 733,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                                    saveNow();
                                },
                                className: "lko-press flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] py-3 text-sm font-extrabold text-[var(--lko-green-deep)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveIcon"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 741,
                                        columnNumber: 13
                                    }, this),
                                    "Save now"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 734,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    returnToMenu();
                                },
                                className: "lko-press flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white py-3 text-sm font-bold text-[var(--lko-ink)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExitIcon"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                        lineNumber: 751,
                                        columnNumber: 13
                                    }, this),
                                    "Main menu (auto-saves)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 744,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 705,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 422,
        columnNumber: 5
    }, this);
}
_s1(ProfileTab, "qO18myUYTrgSa5itsk3UnvdGuHo=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c8 = ProfileTab;
/* ------------------------ the world overlay sheet (W3) ---------------------- */ /**
 * W3 THE WORLD NEVER BLINKS — the sheet that carries the dashboard's own
 * tabs ABOVE the living street. The canvas is NEVER touched: a translucent
 * scrim (black/40 — NO backdrop blur: a software blur over the animating
 * canvas re-rasterizes the whole viewport every frame, the N11 gate's
 * worst enemy), a cream panel, and one honest close. The street keeps
 * living behind it (the no-pause law).
 *
 * THE MEMO WALL (the N11 gate taught this): the Dashboard re-renders every
 * second (the needs rail's heartbeat). WITHOUT the boundary, that cascade
 * re-rendered the whole MapScreen SVG every second — +91.7ms/frame at the
 * witness. The sheet is memoized and renders its own content from the
 * `tab` prop: a Dashboard tick NEVER touches the sheet's subtree, and the
 * faces inside read the store directly (they stay live on their own).
 */ function WorldOverlaySheetImpl({ tab, label, focusLocationId, onClose, onOpenWork, onGoToMap, onFocusHandled, onBackToStreet, onOpenPhone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[44] flex items-end justify-center bg-black/40 [transform:translateZ(0)] sm:items-center",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": label,
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-testid": "world-overlay-sheet",
            className: "lko-fade flex max-h-[86dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-black/[0.08] bg-[var(--lko-surface)] shadow-[0_-10px_28px_-12px_rgba(27,34,24,0.45)] [transform:translateZ(0)] sm:rounded-3xl",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex shrink-0 items-center gap-2 border-b border-black/[0.06] bg-[var(--lko-surface)] px-4 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lko-display flex-1 truncate text-[15px] leading-tight",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 812,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": "overlay-close",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                onClose();
                            },
                            className: "lko-press flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full bg-[var(--lko-green)] px-3.5 text-[12px] font-extrabold text-white",
                            children: "Back to the street"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 813,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                    lineNumber: 811,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-y-auto overscroll-contain [contain:layout_paint]",
                    children: [
                        tab === 'home' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeTab, {
                            onExploreWorld: onBackToStreet,
                            onOpenPhone: onOpenPhone
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 825,
                            columnNumber: 30
                        }, this),
                        tab === 'map' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapTab, {
                            focusLocationId: focusLocationId,
                            onFocusHandled: onFocusHandled,
                            onOpenWork: onOpenWork
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 827,
                            columnNumber: 13
                        }, this),
                        tab === 'work' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkTab, {
                            onGoToMap: onGoToMap
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 833,
                            columnNumber: 30
                        }, this),
                        tab === 'phone' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PhoneScreen"], {
                            variant: "overlay",
                            onOpenWork: onOpenWork
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 834,
                            columnNumber: 31
                        }, this),
                        tab === 'bag' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BagTab, {}, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 835,
                            columnNumber: 29
                        }, this),
                        tab === 'profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileTab, {}, void 0, false, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 836,
                            columnNumber: 33
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                    lineNumber: 824,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
            lineNumber: 806,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 799,
        columnNumber: 5
    }, this);
}
_c9 = WorldOverlaySheetImpl;
const WorldOverlaySheet = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(WorldOverlaySheetImpl);
_c10 = WorldOverlaySheet;
function Dashboard() {
    _s2();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "Dashboard.useGameStore[player]": (s)=>s.player
    }["Dashboard.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "Dashboard.useGameStore[world]": (s)=>s.world
    }["Dashboard.useGameStore[world]"]);
    const notifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "Dashboard.useGameStore[notifications]": (s)=>s.notifications
    }["Dashboard.useGameStore[notifications]"]);
    const hasActiveOpportunities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "Dashboard.useGameStore[hasActiveOpportunities]": (s)=>(s.player?.activeOpportunities.length ?? 0) > 0
    }["Dashboard.useGameStore[hasActiveOpportunities]"]);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    /** map deep-link: which location the map should open (from work screen links) */ const [focusLoc, setFocusLoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /** remount key so tab switches replay the gentle fade */ const [tabTick, setTabTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    /** W3 — THE WORLD NEVER BLINKS: entered once, mounted until the Main menu */ const [worldEntered, setWorldEntered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /** W3 — the overlay sheet above the living street (null = the street itself) */ const [overlay, setOverlay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /* SILK II — the world chunk warms in the first idle window after the
   * dashboard paints (never fights first paint; on-demand if the player
   * beats the idle callback to the World tab). */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$world$2d$chunk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preloadWorldChunk"])();
        }
    }["Dashboard.useEffect"], []);
    const xpNeeded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xpToNextLevel"])(player.level);
    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reputationTier"])(player.reputation);
    /* W3 — THE DIEGETIC MACHINE: one verdict (systems/diegetic.ts) rules both
   * worlds. Pre-entry: the legacy tab machine (cheap dashboard first, the
   * heavy 3D on demand — the SILK gates' knowledge). After entry: the street
   * NEVER unmounts — every tab is a sheet above the living world, and only
   * the Main menu (returnToMenu, via the Profile tab) ends the session.
   * Stable via useCallback — the sheet's memo wall depends on it. */ const switchTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[switchTab]": (next)=>{
            const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$diegetic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["overlayVerdict"])(next, worldEntered);
            if (verdict.fullscreen) {
                setTab(next);
                if (next === 'world') setWorldEntered(true);
                setTabTick({
                    "Dashboard.useCallback[switchTab]": (t)=>t + 1
                }["Dashboard.useCallback[switchTab]"]);
                return;
            }
            // in-world: the sheet is the only change — the street keeps living
            setOverlay(verdict.overlay);
        }
    }["Dashboard.useCallback[switchTab]"], [
        worldEntered
    ]);
    /* W3 — the phone stays THE phone: in-world, the Home sheet's phone button
   * wakes the diegetic handset (WorldPhoneLayer's own sheet), never a copy.
   * EVERY handler is stable (useCallback) — the memo wall only works if the
   * sheet's props never change when a Dashboard tick fires. */ const closeOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[closeOverlay]": ()=>setOverlay(null)
    }["Dashboard.useCallback[closeOverlay]"], []);
    const openPhoneInWorld = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[openPhoneInWorld]": ()=>{
            setOverlay(null);
            window.dispatchEvent(new CustomEvent('lko:phone-open'));
        }
    }["Dashboard.useCallback[openPhoneInWorld]"], []);
    const backToStreet = closeOverlay;
    const focusHandled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[focusHandled]": ()=>setFocusLoc(null)
    }["Dashboard.useCallback[focusHandled]"], []);
    const overlayOpenWork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[overlayOpenWork]": ()=>switchTab('work')
    }["Dashboard.useCallback[overlayOpenWork]"], [
        switchTab
    ]);
    const overlayGoToMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[overlayGoToMap]": (locId)=>{
            setFocusLoc(locId);
            switchTab('map');
        }
    }["Dashboard.useCallback[overlayGoToMap]"], [
        switchTab
    ]);
    /* W3 — the witness hook (the forceDrive precedent): behind ?e2e=1 the REAL
   * switchTab is reachable by the e2e script. No new UI path — the same code
   * the thumb runs. Rebound every render so the closures stay fresh. */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            if (!new URLSearchParams(window.location.search).has('e2e')) return;
            window.__lkoDash = {
                open: ({
                    "Dashboard.useEffect": (t)=>switchTab(t)
                })["Dashboard.useEffect"],
                state: ({
                    "Dashboard.useEffect": ()=>({
                            tab,
                            worldEntered,
                            overlay
                        })
                })["Dashboard.useEffect"]
            };
        }
    }["Dashboard.useEffect"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "lko-root min-h-dvh",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed inset-x-0 top-2 z-50 mx-auto flex w-full max-w-xl flex-col items-center gap-1.5 px-4",
                children: notifications.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `lko-toast flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold shadow-[var(--lko-shadow-lg)] backdrop-blur-sm ${n.tone === 'good' ? 'border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)]/95 text-[var(--lko-green-deep)]' : n.tone === 'bad' ? 'border-red-200 bg-red-50/95 text-red-700' : 'border-black/10 bg-white/95 text-[var(--lko-ink)]'}`,
                        role: "status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                children: n.icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                lineNumber: 940,
                                columnNumber: 13
                            }, this),
                            n.text
                        ]
                    }, n.id, true, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 929,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 927,
                columnNumber: 7
            }, this),
            worldEntered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorldTab, {
                onExit: ()=>switchTab('home'),
                onOpenWork: ()=>switchTab('work'),
                onOpenMap: (locId)=>{
                    setFocusLoc(locId);
                    switchTab('map');
                }
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 949,
                columnNumber: 9
            }, this),
            worldEntered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$WorldPhoneLayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorldPhoneLayer"], {
                onOpenWork: ()=>switchTab('work')
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 961,
                columnNumber: 24
            }, this),
            worldEntered && overlay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorldOverlaySheet, {
                tab: overlay,
                label: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$diegetic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OVERLAY_LABELS"][overlay],
                focusLocationId: focusLoc,
                onClose: closeOverlay,
                onOpenWork: overlayOpenWork,
                onGoToMap: overlayGoToMap,
                onFocusHandled: focusHandled,
                onBackToStreet: backToStreet,
                onOpenPhone: openPhoneInWorld
            }, overlay, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 965,
                columnNumber: 9
            }, this),
            !worldEntered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "mx-auto w-full max-w-md px-4 pt-3 sm:max-w-3xl sm:px-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lko-card flex items-center gap-3 px-3.5 py-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                    config: player.avatar,
                                    gender: player.gender,
                                    withBackdrop: true,
                                    className: "h-11 w-11 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 984,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "lko-display truncate text-[15px] leading-tight",
                                                    children: player.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                    lineNumber: 987,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex h-[18px] shrink-0 items-center rounded-full bg-[var(--lko-green)] px-1.5 text-[10px] font-extrabold text-white",
                                                    children: [
                                                        "LV ",
                                                        player.level
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                    lineNumber: 988,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 986,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full rounded-full bg-[var(--lko-gold)] transition-[width] duration-500",
                                                style: {
                                                    width: `${Math.min(100, player.xp / xpNeeded * 100)}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                lineNumber: 994,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 993,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 985,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex shrink-0 flex-col items-end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "lko-display lko-num text-[17px] leading-tight text-[var(--lko-green-deep)]",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(player.cash)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 1001,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Chip, {
                                            className: "mt-0.5 bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarIcon"], {
                                                    size: 11
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                                    lineNumber: 1005,
                                                    columnNumber: 19
                                                }, this),
                                                tier.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                            lineNumber: 1004,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1000,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 983,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 982,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "mx-auto w-full max-w-md pb-28 sm:max-w-3xl",
                        role: "tabpanel",
                        "aria-label": tab,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lko-fade",
                            children: [
                                tab === 'home' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeTab, {
                                    onExploreWorld: ()=>switchTab('world'),
                                    onOpenPhone: ()=>switchTab('phone')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1019,
                                    columnNumber: 34
                                }, this),
                                tab === 'map' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapTab, {
                                    focusLocationId: focusLoc,
                                    onFocusHandled: ()=>setFocusLoc(null),
                                    onOpenWork: ()=>switchTab('work')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1021,
                                    columnNumber: 17
                                }, this),
                                tab === 'work' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkTab, {
                                    onGoToMap: (locId)=>{
                                        setFocusLoc(locId);
                                        switchTab('map');
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1028,
                                    columnNumber: 17
                                }, this),
                                tab === 'phone' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PhoneTab, {
                                    onOpenWork: ()=>switchTab('work')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1035,
                                    columnNumber: 35
                                }, this),
                                tab === 'bag' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BagTab, {}, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1036,
                                    columnNumber: 33
                                }, this),
                                tab === 'profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileTab, {}, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                                    lineNumber: 1037,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, tabTick, true, {
                            fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                            lineNumber: 1018,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 1013,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BottomNav"], {
                        active: tab,
                        onChange: switchTab,
                        badge: {
                            work: hasActiveOpportunities
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                        lineNumber: 1041,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Juice$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MoneyPop"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 1046,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Juice$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shockwave"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 1047,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GuestGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GuestGate"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/Dashboard.tsx",
                lineNumber: 1048,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/Dashboard.tsx",
        lineNumber: 925,
        columnNumber: 5
    }, this);
}
_s2(Dashboard, "uCKjxXshy6L1IRECmt2i3D9440s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c11 = Dashboard;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "WorldTab");
__turbopack_context__.k.register(_c1, "Chip");
__turbopack_context__.k.register(_c2, "SectionTitle");
__turbopack_context__.k.register(_c3, "HomeTab");
__turbopack_context__.k.register(_c4, "MapTab");
__turbopack_context__.k.register(_c5, "WorkTab");
__turbopack_context__.k.register(_c6, "PhoneTab");
__turbopack_context__.k.register(_c7, "BagTab");
__turbopack_context__.k.register(_c8, "ProfileTab");
__turbopack_context__.k.register(_c9, "WorldOverlaySheetImpl");
__turbopack_context__.k.register(_c10, "WorldOverlaySheet");
__turbopack_context__.k.register(_c11, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_game_screens_Dashboard_tsx_5cd1c3dc._.js.map