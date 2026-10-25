module.exports = [
"[project]/src/components/game/screens/PhoneScreen.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PhoneScreen",
    ()=>PhoneScreen,
    "openPhoneApp",
    ()=>openPhoneApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — PhoneScreen (Stage 5-c)
 * -------------------------------------
 * The in-game handset. A phone works anywhere in Lokoja — this tab is
 * NOT location-bound — but it waits politely while you travel or work
 * (honest overlay, no half-states underneath).
 *
 * Home screen = 2×2 app grid:
 *   💬 Chats        — NPC contacts, one chat per NPC per in-game day
 *                     (store's chatNpc enforces; threads are component
 *                     state, see phone/ChatThread.tsx)
 *   🏦 Bank         — pocket cash ↔ bank balance via store actions only
 *   📋 Hustle Board — read-only shortcut view of accepted opportunities
 *                     + a jump into the real Work tab
 *   ⚙️ Settings     — sound toggle, autosave note, version
 *
 * Every naira moves through store actions (bankDeposit/bankWithdraw);
 * this UI never mutates player state directly. No new economy constants.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/social.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/opportunities.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/biz.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$ChatThread$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/ChatThread.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$PulseApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/PulseApp.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$wardrobe$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$garage$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/garage-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$houses$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/houses-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$health$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/health-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$school$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/school-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$career$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/career-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$contacts$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/contacts-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$patti$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/patti-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$story$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/story-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/whot-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$LiveApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/LiveApp.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$messages$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/messages-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$calls$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/calls-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$connect$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/connect-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$wallet$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/wallet-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$profile$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/profile-app.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/social-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$ForgeApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/ForgeApp.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$NationApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/NationApp.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$GraphicsPicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/GraphicsPicker.tsx [app-ssr] (ecmascript)");
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
/** M15 — a banner can deep-link the handset straight into an app (one-shot). */ let phoneDeepLink = null;
function openPhoneApp(app) {
    phoneDeepLink = app;
}
const APP_VERSION = 'Lokoja Life • Stage 5';
/* ------------------------------ tiny pieces ------------------------------- */ /** Battery flourish in the status bar — honestly tied to player energy. */ function Battery({ energy }) {
    const level = Math.max(5, Math.min(100, energy));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex items-center",
        title: `Energy ${Math.round(energy)}%`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex h-[11px] w-[21px] items-center rounded-[3.5px] border border-black/40 p-[1.5px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `h-full rounded-[2px] ${energy < 20 ? 'bg-red-500' : energy < 45 ? 'bg-[var(--lko-gold)]' : 'bg-[var(--lko-green)]'}`,
                    style: {
                        width: `${level}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-px h-[4px] w-[2px] rounded-r bg-black/40",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
function AppTile({ app, onOpen }) {
    const IconCmp = app.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onOpen,
        className: "lko-press flex min-h-[100px] flex-col items-start gap-2 rounded-3xl border border-black/[0.05] bg-white p-3.5 text-left shadow-[var(--lko-shadow-sm)]",
        "aria-label": `Open ${app.label} app`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `flex h-11 w-11 items-center justify-center rounded-2xl ${app.tint}`,
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconCmp, {
                    size: 21
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-[13.5px] font-extrabold leading-tight",
                        children: app.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num block truncate text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: app.sub
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
/** Shared in-phone app header (back chevron + title). */ function AppHeader({ title, onBack }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 px-2 pt-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onBack,
                "aria-label": "Back to apps",
                className: "lko-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--lko-ink-soft)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArrowLeftIcon"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "lko-display flex-1 truncate text-lg",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
/* -------------------------------- chats app ------------------------------- */ function ChatsApp({ onOpenThread }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 pb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 pb-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: "One chat per paddy per day — small small na im friendship dey grow."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPCS"].map((npc)=>{
                const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npc.id);
                const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tierFor"])(rel.familiarity);
                const today = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canChat"])(rel, world.day);
                const fresh = rel.familiarity === 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        onOpenThread(npc.id);
                    },
                    className: "lko-press flex min-h-[68px] items-center gap-3 rounded-2xl border border-black/[0.05] bg-white p-3 text-left shadow-[var(--lko-shadow-sm)]",
                    "aria-label": `Chat with ${npc.name}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-[var(--lko-cream)] text-xl",
                            "aria-hidden": true,
                            children: npc.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 176,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-sm font-extrabold leading-tight",
                                    children: npc.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-1 flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$ChatThread$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tierChipClass"])(tier)}`,
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIER_META"][tier].label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][npc.homeLocationId]?.name ?? 'Lokoja'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 188,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 184,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, this),
                        today ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex shrink-0 items-center gap-1 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[var(--lko-green-deep)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                    size: 12,
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 195,
                                    columnNumber: 17
                                }, this),
                                "Today"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 194,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `flex shrink-0 items-center gap-0.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-extrabold ${fresh ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : 'bg-[var(--lko-green)] text-white'}`,
                            children: [
                                fresh ? 'Say hi' : 'Chat',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChevronRightIcon"], {
                                    size: 12,
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 205,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 199,
                            columnNumber: 15
                        }, this)
                    ]
                }, npc.id, true, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 167,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
function BankApp() {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const deposit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.bankDeposit);
    const withdraw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.bankWithdraw);
    const [pick, setPick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const chips = [
        {
            key: '1k',
            label: '₦1k',
            value: 1000
        },
        {
            key: '5k',
            label: '₦5k',
            value: 5000
        },
        {
            key: '25k',
            label: '₦25k',
            value: 25000
        },
        {
            key: 'all',
            label: 'All',
            value: 'all'
        }
    ];
    const depAmt = pick === 'all' ? player.cash : pick ?? 0;
    const wdrAmt = pick === 'all' ? player.bankBalance : pick ?? 0;
    const canDep = depAmt > 0 && player.cash >= depAmt;
    const canWdr = wdrAmt > 0 && player.bankBalance >= wdrAmt;
    const bankRows = player.transactions.filter((t)=>t.category === 'bank').slice(0, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 pb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.05] bg-[var(--lko-gold-soft)] p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-gold-deep)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoinsIcon"], {
                                        size: 13,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, this),
                                    "Pocket cash"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display lko-num mt-1 text-[19px] leading-tight text-[var(--lko-gold-deep)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(player.cash)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.05] bg-[var(--lko-green-soft)] p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-green-deep)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BankIcon"], {
                                        size: 13,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this),
                                    "Bank balance"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display lko-num mt-1 text-[19px] leading-tight text-[var(--lko-green-deep)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(player.bankBalance)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "-mt-1.5 px-1 text-center text-[11px] font-semibold italic text-[var(--lko-ink-soft)]",
                children: "“Money wey dey bank dey safe.”"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: "Amount"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-1.5",
                        children: chips.map((c)=>{
                            const active = pick === c.value;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    setPick(active ? null : c.value);
                                },
                                "aria-pressed": active,
                                className: `lko-press min-h-[44px] rounded-xl border text-[13px] font-extrabold ${active ? 'border-[var(--lko-green)] bg-[var(--lko-green)] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]' : 'border-black/[0.08] bg-white text-[var(--lko-ink)]'}`,
                                children: c.label
                            }, c.key, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>deposit(depAmt),
                        disabled: !canDep,
                        className: "lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--lko-green)] px-2 text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] disabled:bg-black/10 disabled:text-white/60 disabled:shadow-none",
                        children: [
                            "Deposit",
                            pick !== null && canDep ? ` ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(depAmt)}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>withdraw(wdrAmt),
                        disabled: !canWdr,
                        className: "lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--lko-gold)] px-2 text-sm font-extrabold text-[#3d2a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.14)] disabled:bg-black/10 disabled:text-white/60 disabled:shadow-none",
                        children: [
                            "Withdraw",
                            pick !== null && canWdr ? ` ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(wdrAmt)}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: "Last movements"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 314,
                        columnNumber: 9
                    }, this),
                    bankRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-2xl border border-black/[0.05] bg-white px-3.5 py-3 text-center text-[12px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "No bank movement yet — your money dey wait for pocket."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "flex flex-col gap-1.5",
                        children: bankRows.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center justify-between gap-2 rounded-xl border border-black/[0.05] bg-white px-3.5 py-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-[12.5px] font-bold",
                                                children: t.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                lineNumber: 329,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-num block text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    "Day ",
                                                    t.day
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                lineNumber: 330,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 328,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `lko-num shrink-0 text-[12.5px] font-extrabold ${t.amount < 0 ? 'text-[var(--lko-terra)]' : 'text-[var(--lko-green-deep)]'}`,
                                        children: [
                                            t.amount < 0 ? '−' : '+',
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(Math.abs(t.amount))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 332,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, t.id, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 324,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 322,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
/* ------------------------------- hustle app ------------------------------- */ function HustleApp({ onOpenWork }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const abs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
    const rows = player.activeOpportunities;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 pb-2",
        children: [
            rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center px-4 py-8 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[var(--lko-terra)]",
                        "aria-hidden": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"], {
                            size: 26
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 365,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 361,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-display mt-3 text-[15px]",
                        children: "No hustle dey wait for you now."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 367,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                        children: "Gist dey cold fast — check the Work board make you see wetin dey hot."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 368,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 360,
                columnNumber: 9
            }, this) : rows.map((opp)=>{
                const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hustleDefFor"])(opp);
                if (!def) return null;
                const slotsLeft = opp.expiresAtSlot - abs;
                const urgent = slotsLeft <= 2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.05] bg-white p-3 shadow-[var(--lko-shadow-sm)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13.5px] font-extrabold leading-tight",
                            children: def.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 380,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                    id: opp.locationId,
                                    size: 11,
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 382,
                                    columnNumber: 17
                                }, this),
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][opp.locationId]?.name ?? 'Somewhere',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-black/25",
                                    children: "•"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 384,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                    size: 11,
                                    className: urgent ? 'text-[var(--lko-terra)]' : '',
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 385,
                                    columnNumber: 17
                                }, this),
                                slotsLeft <= 0 ? 'going cold!' : `${slotsLeft} slot${slotsLeft === 1 ? '' : 's'} left`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 381,
                            columnNumber: 15
                        }, this)
                    ]
                }, opp.instanceId, true, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 379,
                    columnNumber: 13
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                    onOpenWork();
                },
                className: "lko-press mt-1 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[var(--lko-green)] text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"], {
                        size: 16,
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 400,
                        columnNumber: 9
                    }, this),
                    "Open the Work tab"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 393,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                children: "Accepting and doing hustles happen inside Work — this na quick look."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 403,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 358,
        columnNumber: 5
    }, this);
}
/* ------------------------------ settings app ------------------------------ */ function SettingsApp() {
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settings);
    const toggleSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.toggleSound);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2.5 pb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-2 text-sm font-bold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SoundIcon"], {
                                size: 16,
                                className: "text-[var(--lko-ink-soft)]",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            "Sound"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        role: "switch",
                        "aria-checked": settings.sound,
                        "aria-label": "Toggle sound",
                        onClick: toggleSound,
                        className: `lko-press h-8 w-14 rounded-full transition-colors ${settings.sound ? 'bg-[var(--lko-green)]' : 'bg-black/15'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `block h-6 w-6 rounded-full bg-white shadow transition-transform ${settings.sound ? 'translate-x-7' : 'translate-x-1'}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 432,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 423,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 418,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$GraphicsPicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphicsPicker"], {}, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 441,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-2.5 rounded-2xl border border-black/[0.05] bg-white px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveIcon"], {
                        size: 16,
                        className: "mt-0.5 shrink-0 text-[var(--lko-ink-soft)]",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 444,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12.5px] font-semibold leading-relaxed text-[var(--lko-ink)]",
                        children: [
                            "Game dey save imself every small time.",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-0.5 block text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "Relationships, bank balance and your progress all dey inside the save. Chat gist na per-session."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 443,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lko-num pt-1 text-center text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                children: APP_VERSION
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 453,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 417,
        columnNumber: 5
    }, this);
}
/* -------------------------------- civic app -------------------------------- */ /**
 * M2 — the civic mesh in your pocket: what you owe, what the state owes
 * you, today's market truth. Payments from the phone carry the convenience
 * fee; warrants refuse the phone entirely — some things demand a presence.
 */ function CivicApp() {
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const payNepa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.payNepa);
    const payKgirs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.payKgirs);
    const mealPriceAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.mealPriceAt);
    const day = world.day;
    if (!civic) return null;
    const m = civic.market;
    const nepaCost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nepaSettleCost"])(civic) + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee;
    const taxCost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["kgirsSettleCost"])(civic) + (civic.kgirs.warrant ? 0 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 pb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.05] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex items-center gap-1.5 text-[12.5px] font-extrabold",
                        children: [
                            "💡 NEPA",
                            civic.nepa.shedding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto rounded-full bg-red-50 px-2 py-0.5 text-[9.5px] font-extrabold text-red-600",
                                children: "LIGHT CUT"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 485,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 482,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-center justify-between text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: civic.nepa.owed > 0 || civic.nepa.shedding ? 'Bill due' : 'You dey current'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 489,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-num font-extrabold text-[var(--lko-ink)]",
                                children: civic.nepa.owed > 0 || civic.nepa.shedding ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(nepaCost) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 490,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 488,
                        columnNumber: 9
                    }, this),
                    (civic.nepa.owed > 0 || civic.nepa.shedding) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            payNepa('phone');
                        },
                        className: "lko-press mt-2 min-h-[42px] w-full rounded-xl bg-[var(--lko-gold)] text-[12.5px] font-extrabold text-[#33230a]",
                        children: [
                            "Pay online (+",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee),
                            " fee)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 495,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 481,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.05] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex items-center gap-1.5 text-[12.5px] font-extrabold",
                        children: [
                            "🧮 KGIRS Tax",
                            civic.kgirs.warrant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto rounded-full bg-red-50 px-2 py-0.5 text-[9.5px] font-extrabold text-red-600",
                                children: "WARRANT"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 509,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 506,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-center justify-between text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: civic.kgirs.assessed > 0 ? `Assessment (day ${civic.kgirs.dueDay})` : 'No assessment dey wait'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-num font-extrabold text-[var(--lko-ink)]",
                                children: civic.kgirs.assessed > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(taxCost) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 514,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 512,
                        columnNumber: 9
                    }, this),
                    civic.kgirs.warrant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10.5px] font-semibold leading-relaxed text-red-600",
                        children: "Warrants no fit clear by phone — walk to the police station for GRA."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 519,
                        columnNumber: 11
                    }, this),
                    civic.kgirs.assessed > 0 && !civic.kgirs.warrant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            payKgirs('phone');
                        },
                        className: "lko-press mt-2 min-h-[42px] w-full rounded-xl bg-[var(--lko-gold)] text-[12.5px] font-extrabold text-[#33230a]",
                        children: [
                            "Pay online (+",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee),
                            " fee)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 524,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 505,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.05] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12.5px] font-extrabold",
                        children: "🕵️ EFCC Whistleblower"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 535,
                        columnNumber: 9
                    }, this),
                    civic.efcc.pending.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[11px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                        children: "No tip dey investigate. File one at the zonal command for GRA — your cut na 5% of any recovery."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 537,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex flex-col gap-1",
                        children: civic.efcc.pending.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between rounded-lg bg-black/[0.03] px-2.5 py-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate text-[11px] font-bold",
                                        children: t.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 544,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num shrink-0 text-[10.5px] font-extrabold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "day ",
                                            t.filedDay + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].efcc.resolveDays
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 545,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, t.id, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 543,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 541,
                        columnNumber: 11
                    }, this),
                    civic.efcc.rewardsTotal > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[11px] font-bold text-[var(--lko-green)]",
                        children: [
                            "Rewards so far: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-num",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(civic.efcc.rewardsTotal)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 554,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 553,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 534,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.05] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex items-center gap-1.5 text-[12.5px] font-extrabold",
                        children: [
                            "🛒 Market Board",
                            m.marketDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9.5px] font-extrabold text-[var(--lko-green-deep)]",
                                children: "MARKET DAY"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 564,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 561,
                        columnNumber: 9
                    }, this),
                    m.event && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 rounded-lg bg-[var(--lko-gold-soft)]/50 px-2.5 py-1.5 text-[11px] font-semibold leading-relaxed",
                        children: [
                            m.event.icon,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: m.event.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 571,
                                columnNumber: 28
                            }, this),
                            " — ",
                            m.event.note
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 570,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex flex-col gap-1",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.markets.map((mk)=>{
                            const mult = m.prices[mk] ?? 1;
                            const sample = mealPriceAt('amala', mk);
                            const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][mk];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between rounded-lg bg-black/[0.03] px-2.5 py-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-bold",
                                        children: loc?.shortName ?? mk
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 581,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num text-[10.5px] font-extrabold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "×",
                                            mult.toFixed(2),
                                            " · amala ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(sample)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 582,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, mk, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 580,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 574,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                        children: [
                            "Day ",
                            day,
                            " — every ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayEvery,
                            "rd day na market day: prices soft small everywhere."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 560,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 479,
        columnNumber: 5
    }, this);
}
/* ------------------------------- PhoneScreen ------------------------------ */ /* --------------------- M13 — the FAMILY SHIELD app ------------------------ */ const BAND_LABEL = {
    kid: '🛡️ Pikin (6–12)',
    teen: '🛡️ Teen (13–17)',
    adult: '🪪 Adult (18+)'
};
function ShieldApp() {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const shield = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.shield);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settings);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.account);
    const playScammer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.playScammer);
    const setElder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.setElder);
    const setLocalParentPin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.setLocalParentPin);
    const unlockTierLocal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.unlockTierLocal);
    const band = player.ageBand;
    const law = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_LAW"][band];
    const playedToday = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPlayScammer"])(shield.scammerDay, world.day);
    const round = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scamRound"])(world.day);
    const [picked, setPicked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pinInput, setPinInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [pinMode, setPinMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    const nextBand = band === 'kid' ? 'teen' : band === 'teen' ? 'adult' : null;
    const pick = (i)=>{
        if (playedToday) return;
        setPicked(i);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        // the store rolls the SAME deterministic round and commits the verdict
        setTimeout(()=>playScammer(i), 420);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2.5 px-1 pb-2",
        "aria-label": "Family Shield app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[13px] font-extrabold",
                                        children: BAND_LABEL[band]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 641,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                        children: [
                                            band === 'kid' && 'Safe streets: light hustles, emote greetings, no crime road.',
                                            band === 'teen' && 'Hustle dey flow, school pays ×1.25 — the crime road stay locked.',
                                            band === 'adult' && 'The whole Lokoja dey open — every road, every desk.'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 642,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 640,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-num text-lg font-extrabold text-[var(--lko-green-deep)]",
                                        children: shield.scammerCorrect
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[9px] font-extrabold uppercase text-[var(--lko-ink-soft)]",
                                        children: "scams caught"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                        lineNumber: 650,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 639,
                        columnNumber: 9
                    }, this),
                    account.linked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 rounded-lg bg-[var(--lko-green-soft)] px-2 py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                        children: [
                            "🪪 Cloud account tier: ",
                            account.ageBand?.toUpperCase() ?? 'ADULT',
                            " — climbs go through the register (parent PIN)."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 654,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 638,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border-2 border-[var(--lko-gold)]/50 bg-[var(--lko-gold-soft)]/40 p-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] font-extrabold text-[var(--lko-gold-deep)]",
                                children: "🛡️ Spot the Scammer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 663,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-gold-deep)]",
                                children: [
                                    "streak ",
                                    shield.scammerStreak,
                                    " 🔥"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 664,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 662,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                        children: law.scammerFeatured ? 'Your daily literacy drill — one card na 419. Catch am.' : 'The street teaches once a day — sharp eyes earn honest money.'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 668,
                        columnNumber: 9
                    }, this),
                    !playedToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 space-y-1.5",
                        children: round.options.map((o, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `scam-card-${i}`,
                                disabled: picked !== null,
                                onClick: ()=>pick(i),
                                className: `lko-press w-full rounded-xl border bg-white px-3 py-2.5 text-left text-[12px] font-semibold leading-snug ${picked === null ? 'border-black/[0.08]' : picked === i ? 'border-[var(--lko-green)]' : 'border-black/[0.08] opacity-60'}`,
                                children: [
                                    "“",
                                    o.text,
                                    "”"
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 674,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 672,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-testid": "scam-done",
                        className: "mt-2 rounded-xl bg-white px-3 py-2.5 text-[11.5px] font-bold leading-snug text-[var(--lko-ink-soft)]",
                        children: picked !== null && round.options[picked].scam ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[var(--lko-green-deep)]",
                            children: [
                                "✅ Caught! ",
                                round.options[picked].why,
                                " Next round lands tomorrow (+",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scamReward"])(Math.max(0, shield.scammerStreak - 1)).cash),
                                " banked)."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 690,
                            columnNumber: 15
                        }, this) : picked !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "📚 The card you pick na honest talk. The 419 na: “",
                                round.options[round.scamIndex].text,
                                "” — ",
                                round.options[round.scamIndex].why
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 694,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "You don play today — come back tomoro for the next round."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 696,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 688,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 661,
                columnNumber: 7
            }, this),
            !account.linked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13px] font-extrabold",
                        children: "🔒 The Tier Ladder"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 705,
                        columnNumber: 11
                    }, this),
                    nextBand ? shield.parentPinHash === null ? pinMode !== 'set' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    "Climbing to ",
                                    nextBand.toUpperCase(),
                                    " needs a parent's yes. Set the Parent PIN first."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 710,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "tier-set-pin",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    setPinMode('set');
                                },
                                className: "lko-press mt-2 min-h-[40px] w-full rounded-xl bg-[var(--lko-gold)] text-[12px] font-extrabold text-[#33230a]",
                                children: "Set the Parent PIN"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 713,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                "data-testid": "tier-pin-input",
                                className: "mt-2 w-full rounded-xl border-2 border-[var(--lko-gold)] bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.3em] outline-none",
                                placeholder: "6 digits",
                                value: pinInput,
                                maxLength: 6,
                                inputMode: "numeric",
                                onChange: (e)=>setPinInput(e.target.value.replace(/\D/g, ''))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 723,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (setLocalParentPin(pinInput)) {
                                        setPinMode('none');
                                        setPinInput('');
                                    }
                                },
                                className: "lko-press mt-2 min-h-[40px] w-full rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white",
                                children: "Save the PIN"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 732,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    "Parent PIN dey guard the ladder. Enter am to climb to ",
                                    nextBand.toUpperCase(),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 744,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                "data-testid": "tier-pin-input",
                                className: "mt-2 w-full rounded-xl border border-black/[0.1] bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.3em] outline-none",
                                placeholder: "Parent PIN",
                                value: pinInput,
                                maxLength: 6,
                                inputMode: "numeric",
                                onChange: (e)=>setPinInput(e.target.value.replace(/\D/g, ''))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 747,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "tier-unlock",
                                onClick: ()=>{
                                    if (unlockTierLocal(nextBand, pinInput)) {
                                        setPinInput('');
                                    }
                                },
                                className: "lko-press mt-2 min-h-[40px] w-full rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white",
                                children: [
                                    "Climb to ",
                                    nextBand.toUpperCase()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 756,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "You don reach the top rung — the whole city don open."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 768,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 704,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white p-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] font-extrabold",
                                children: "🔍 Elder Mode"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 778,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                children: "Large text, high contrast, no motion, body drains 25% slower."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 779,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 777,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "elder-toggle",
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            setElder(!settings.elder);
                        },
                        className: `lko-press relative h-8 w-14 shrink-0 rounded-full transition-colors ${settings.elder ? 'bg-[var(--lko-green)]' : 'bg-black/[0.12]'}`,
                        "aria-pressed": settings.elder,
                        "aria-label": "Toggle Elder Mode",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform",
                            style: {
                                left: settings.elder ? 30 : 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 790,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                        lineNumber: 783,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 776,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 636,
        columnNumber: 5
    }, this);
}
function PhoneScreen({ onOpenWork, variant = 'tab' }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settings);
    const isTravelling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.isTravelling);
    const isWorking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.isWorking);
    const [app, setApp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        const deep = phoneDeepLink;
        phoneDeepLink = null;
        return deep ?? 'grid';
    });
    const [openNpc, setOpenNpc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const busy = isTravelling || isWorking;
    const go = (next)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        setOpenNpc(null);
        setApp(next);
    };
    const backToGrid = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        setOpenNpc(null);
        setApp('grid');
    };
    /* M24-UI — the social faces' live sub-labels + the Connect→DM deep link */ const dmUnread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocialStore"])((s)=>Object.values(s.unread).reduce((a, b)=>a + b, 0));
    const callPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocialStore"])((s)=>s.call.phase);
    const socialFriends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocialStore"])((s)=>s.friends);
    const [openDmHandle, setOpenDmHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const openDmWith = (handle)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        setOpenDmHandle(handle);
        setOpenNpc(null);
        setApp('messages');
    };
    const paddyCount = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPCS"].filter((n)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tierFor"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, n.id).familiarity) !== 'stranger').length;
    const apps = [
        {
            key: 'chats',
            label: 'Chats',
            sub: `${paddyCount} paddy dem`,
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocialIcon"]
        },
        {
            key: 'pulse',
            label: 'City Pulse',
            sub: 'The city talk wetin e see',
            tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"]
        },
        {
            key: 'live',
            label: 'Live',
            sub: 'Roster · Live · Union · Ajo',
            tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocialIcon"]
        },
        // ---- M24-UI: the social faces (messages / calls / connect / wallet / profile) ----
        {
            key: 'messages',
            label: 'Messages',
            sub: dmUnread > 0 ? `${dmUnread} unread DM${dmUnread === 1 ? '' : 's'}` : 'Nation wire + DMs',
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocialIcon"]
        },
        {
            key: 'calls',
            label: 'Calls',
            sub: callPhase !== 'idle' ? 'Call dey go…' : 'Voice · video faces',
            tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SmartIcon"]
        },
        {
            key: 'connect',
            label: 'Connect',
            sub: `${socialFriends.length} paddy${socialFriends.length === 1 ? '' : 's'} · requests`,
            tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocialIcon"]
        },
        {
            key: 'wallet',
            label: 'Wallet',
            sub: 'Send am — real ledger out',
            tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BankIcon"]
        },
        {
            key: 'profile',
            label: 'Profile',
            sub: 'The face the street go see',
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProfileIcon"]
        },
        {
            key: 'forge',
            label: 'Forge',
            sub: 'A city na data — 3-hour SLA',
            tint: 'bg-amber-50 text-amber-700',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"]
        },
        {
            key: 'nation',
            label: 'Nation',
            sub: '10k souls · ops · the honest mirror',
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoinsIcon"]
        },
        {
            key: 'shield',
            label: 'Family Shield',
            sub: player.ageBand === 'adult' ? 'Scam drill + elder mode' : `🛡️ ${player.ageBand.toUpperCase()} — scam drill`,
            tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShieldIcon"]
        },
        {
            key: 'bank',
            label: 'Bank',
            sub: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(player.bankBalance),
            tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BankIcon"]
        },
        {
            key: 'hustle',
            label: 'Hustle Board',
            sub: `${player.activeOpportunities.length} dey wait`,
            tint: 'bg-orange-50 text-[var(--lko-terra)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"]
        },
        {
            key: 'civic',
            label: 'Civic',
            sub: civic?.nepa.shedding ? 'NEPA don cut light' : civic && (civic.nepa.owed > 0 || civic.kgirs.assessed > 0) ? 'Bills dey wait' : 'Everything dey calm',
            tint: 'bg-emerald-50 text-emerald-700',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoinsIcon"]
        },
        {
            key: 'biz',
            label: 'My Biz',
            sub: bizTileSub(player.businesses),
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"]
        },
        {
            key: 'settings',
            label: 'Settings',
            sub: settings.sound ? 'Sound dey on' : 'Sound dey off',
            tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsIcon"]
        },
        // ---- M21 gate 1: the ten honest readers + the Whot! table ----
        {
            key: 'whot',
            label: 'Whot!',
            sub: 'The 54-card table · play Emeka',
            tint: 'bg-amber-50 text-amber-700',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"]
        },
        {
            key: 'story',
            label: 'Confluence Path',
            sub: 'The five chapters book',
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapIcon"]
        },
        {
            key: 'career',
            label: 'Career',
            sub: 'The ladder, rung by rung',
            tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoinsIcon"]
        },
        {
            key: 'school',
            label: 'School',
            sub: 'Books before beta',
            tint: 'bg-emerald-50 text-emerald-700',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SmartIcon"]
        },
        {
            key: 'houses',
            label: 'Houses',
            sub: 'Rent, keys, wahala',
            tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BankIcon"]
        },
        {
            key: 'health',
            label: 'Health',
            sub: 'The body book',
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShieldIcon"]
        },
        {
            key: 'garage',
            label: 'Garage',
            sub: 'Your wheels, loud and clear',
            tint: 'bg-orange-50 text-[var(--lko-terra)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TargetIcon"]
        },
        {
            key: 'wardrobe',
            label: 'Wardrobe',
            sub: 'Strut + stitch',
            tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocialIcon"]
        },
        {
            key: 'contacts',
            label: 'Contacts',
            sub: 'Who you know for Lokoja',
            tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocialIcon"]
        },
        {
            key: 'patti',
            label: 'Mt Patti',
            sub: 'The summit book',
            tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SunriseIcon"]
        }
    ];
    const titles = {
        chats: 'Chats',
        bank: 'Bank',
        hustle: 'Hustle Board',
        civic: 'Civic',
        biz: 'My Biz',
        settings: 'Settings',
        shield: 'Family Shield',
        pulse: 'City Pulse',
        live: 'Live Nation',
        forge: 'City Forge',
        nation: 'Nation Dashboard',
        wardrobe: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$wardrobe$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["APP_TITLE"],
        garage: 'Garage',
        houses: 'Houses',
        health: 'Health',
        school: 'School',
        career: 'Career',
        contacts: 'Contacts',
        patti: 'Mt Patti',
        story: 'Confluence Path',
        whot: 'Whot!',
        messages: 'Messages',
        calls: 'Calls',
        connect: 'Connect',
        wallet: 'Wallet',
        profile: 'Profile'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: variant === 'overlay' ? 'flex justify-center' : 'flex justify-center px-4 pt-3 sm:pt-4',
        "aria-label": "Your phone",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[380px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-[2.7rem] bg-[#1a1e18] p-[7px] shadow-[var(--lko-shadow-lg)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex h-[clamp(540px,calc(100dvh-11rem),740px)] flex-col overflow-hidden rounded-[2.25rem] bg-[var(--lko-cream)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 flex shrink-0 items-center justify-between px-5 pb-1 pt-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lko-num text-[11px] font-extrabold text-[var(--lko-ink)]",
                                    children: [
                                        "Day ",
                                        world.day,
                                        " · ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "capitalize",
                                            children: world.timeOfDay
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1068,
                                            columnNumber: 35
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1067,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute left-1/2 top-1.5 h-[20px] w-[88px] -translate-x-1/2 rounded-full bg-[#1a1e18]",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1070,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "lko-num text-[11px] font-extrabold text-[var(--lko-green-deep)]",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(player.cash)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1075,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Battery, {
                                            energy: player.needs.energy
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1078,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1074,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 1066,
                            columnNumber: 13
                        }, this),
                        app === 'chats' && openNpc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-h-0 flex-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$ChatThread$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatThread"], {
                                npcId: openNpc,
                                onBack: ()=>setOpenNpc(null)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 1085,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 1084,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                app !== 'grid' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppHeader, {
                                    title: titles[app],
                                    onBack: backToGrid
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1089,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-0 flex-1 overflow-y-auto px-3.5 pb-3 pt-1.5",
                                    children: [
                                        app === 'grid' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-1 pb-3 pt-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "lko-display text-[21px] leading-tight",
                                                            children: "Wetin dey happen,"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                            lineNumber: 1094,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "lko-display text-[21px] leading-tight text-[var(--lko-green-deep)]",
                                                            children: player.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                            lineNumber: 1095,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                    lineNumber: 1093,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-3",
                                                    children: apps.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppTile, {
                                                            app: a,
                                                            onOpen: ()=>go(a.key)
                                                        }, a.key, false, {
                                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                            lineNumber: 1101,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                    lineNumber: 1099,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "px-1 pb-1 pt-3 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                    children: "Phone dey work anywhere for Lokoja — even for keke."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                                    lineNumber: 1104,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1092,
                                            columnNumber: 21
                                        }, this),
                                        app === 'chats' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatsApp, {
                                            onOpenThread: (npcId)=>setOpenNpc(npcId)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1109,
                                            columnNumber: 39
                                        }, this),
                                        app === 'bank' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BankApp, {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1110,
                                            columnNumber: 38
                                        }, this),
                                        app === 'hustle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HustleApp, {
                                            onOpenWork: ()=>onOpenWork?.()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1111,
                                            columnNumber: 40
                                        }, this),
                                        app === 'civic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CivicApp, {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1112,
                                            columnNumber: 39
                                        }, this),
                                        app === 'biz' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BizApp, {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1113,
                                            columnNumber: 37
                                        }, this),
                                        app === 'shield' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ShieldApp, {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1114,
                                            columnNumber: 40
                                        }, this),
                                        app === 'pulse' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$PulseApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PulseApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1115,
                                            columnNumber: 39
                                        }, this),
                                        app === 'wardrobe' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$wardrobe$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1116,
                                            columnNumber: 42
                                        }, this),
                                        app === 'garage' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$garage$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1117,
                                            columnNumber: 40
                                        }, this),
                                        app === 'houses' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$houses$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1118,
                                            columnNumber: 40
                                        }, this),
                                        app === 'health' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$health$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1119,
                                            columnNumber: 40
                                        }, this),
                                        app === 'school' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$school$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1120,
                                            columnNumber: 40
                                        }, this),
                                        app === 'career' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$career$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1121,
                                            columnNumber: 40
                                        }, this),
                                        app === 'contacts' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$contacts$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1122,
                                            columnNumber: 42
                                        }, this),
                                        app === 'patti' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$patti$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1123,
                                            columnNumber: 39
                                        }, this),
                                        app === 'story' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$story$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1124,
                                            columnNumber: 39
                                        }, this),
                                        app === 'whot' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1125,
                                            columnNumber: 38
                                        }, this),
                                        app === 'live' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$LiveApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LiveApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1126,
                                            columnNumber: 38
                                        }, this),
                                        app === 'messages' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$messages$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagesApp"], {
                                            openDm: openDmHandle,
                                            onOpenDmChange: setOpenDmHandle
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1127,
                                            columnNumber: 42
                                        }, this),
                                        app === 'calls' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$calls$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CallsApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1128,
                                            columnNumber: 39
                                        }, this),
                                        app === 'connect' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$connect$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConnectApp"], {
                                            onOpenDm: openDmWith
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1129,
                                            columnNumber: 41
                                        }, this),
                                        app === 'wallet' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$wallet$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WalletApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1130,
                                            columnNumber: 40
                                        }, this),
                                        app === 'profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$profile$2d$app$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProfileApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1131,
                                            columnNumber: 41
                                        }, this),
                                        app === 'forge' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$ForgeApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ForgeApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1132,
                                            columnNumber: 39
                                        }, this),
                                        app === 'nation' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$NationApp$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NationApp"], {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1133,
                                            columnNumber: 40
                                        }, this),
                                        app === 'settings' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsApp, {}, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1134,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1090,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-none mx-auto mb-1.5 h-1 w-24 shrink-0 rounded-full bg-black/15",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 1140,
                            columnNumber: 13
                        }, this),
                        busy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 z-20 flex items-center justify-center bg-[rgba(14,20,15,0.38)] backdrop-blur-[2px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-pop mx-6 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[13px] font-extrabold text-[var(--lko-ink)] shadow-[var(--lko-shadow-md)]",
                                children: isTravelling ? 'Keke dey move — phone go wait.' : 'You dey work now — phone go wait.'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                lineNumber: 1145,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 1144,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 1064,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 1062,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
            lineNumber: 1060,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 1056,
        columnNumber: 5
    }, this);
}
/* --------------------------------- biz app --------------------------------- */ /** tile subtitle: shops owned + the total waiting in their tills */ function bizTileSub(list) {
    if (!list.length) return 'Own a shop for Lokoja';
    const till = list.reduce((s, b)=>s + b.accrued, 0);
    return till > 0 ? `${list.length} shop${list.length > 1 ? 's' : ''} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(till)} inside` : `${list.length} shop${list.length > 1 ? 's' : ''} · tills empty`;
}
/**
 * M3 — My Biz: every Lokoja shopfront, owned or not. Owned shops collect
 * by phone (the same ₦50 convenience fee every remote civic payment pays)
 * or in person at the shop for free; upgrades land right here too.
 */ function BizApp() {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const collectBiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.collectBiz);
    const upgradeBiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.upgradeBiz);
    const hireStaff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.hireStaff);
    const fireStaff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.fireStaff);
    const installBizUpgrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.installBizUpgrade);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 pb-2",
        children: [
            Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ_TYPES"]).map(([typeId, def])=>{
                const shop = player.businesses.find((b)=>b.typeId === typeId);
                const where = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][def.locationId]?.shortName ?? def.locationId;
                const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizIncomeFor"])(typeId, shop?.level ?? 1, world.day, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["marketForDay"])(civic, world.day), player.reputation, shop ? {
                    staff: shop.staff,
                    upgrades: shop.upgrades
                } : undefined);
                const cost = shop ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizUpgradeCost"])(typeId, shop.level) : null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.05] bg-white p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "flex items-center gap-1.5 text-[12.5px] font-extrabold",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": true,
                                    children: def.emoji
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1198,
                                    columnNumber: 15
                                }, this),
                                " ",
                                def.name,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-auto rounded-full bg-[var(--lko-cream)] px-2 py-0.5 text-[9.5px] font-extrabold text-[var(--lko-ink-soft)]",
                                    children: where
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1199,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 1197,
                            columnNumber: 13
                        }, this),
                        !shop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1.5 text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                            children: player.level < def.unlockLevel ? `Opens at Level ${def.unlockLevel} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(def.buyCost)}` : `For sale at ${where} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(def.buyCost)} — go there buy am`
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                            lineNumber: 1204,
                            columnNumber: 15
                        }, this),
                        shop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1.5 flex items-center justify-between text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "L",
                                                shop.level,
                                                "/",
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].maxLevel,
                                                " · ~",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(today),
                                                "/day"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "lko-num font-extrabold text-[var(--lko-ink)]",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(shop.accrued)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1214,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1212,
                                    columnNumber: 17
                                }, this),
                                civic.nepa.shedding && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPowerBackup"])(shop.upgrades) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 rounded-lg bg-[#c0392b]/10 px-2 py-1 text-[10.5px] font-bold text-[#8a2a20]",
                                    children: [
                                        "🔌 Shop dey run dark today — shedding take −",
                                        Math.round((1 - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].sheddingIncomeFactor) * 100),
                                        "%."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1217,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex flex-wrap items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: [
                                                "👥 ",
                                                shop.staff,
                                                "/",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffCapFor"])(shop.level),
                                                " · wage ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffWagePerDay),
                                                "/day"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1223,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": "phone-biz-hire",
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                hireStaff(typeId);
                                            },
                                            disabled: shop.staff >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffCapFor"])(shop.level) || player.cash < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffHireFee,
                                            className: "lko-press min-h-[34px] rounded-lg bg-[var(--lko-green)] px-2.5 text-[10.5px] font-extrabold text-white disabled:opacity-40",
                                            children: [
                                                "Hire · ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffHireFee)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1226,
                                            columnNumber: 19
                                        }, this),
                                        shop.staff > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                fireStaff(typeId);
                                            },
                                            className: "lko-press min-h-[34px] rounded-lg border border-black/10 bg-white px-2.5 text-[10.5px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: "Let go"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1235,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1222,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1.5 flex flex-wrap items-center gap-1.5",
                                    children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].upgrades).map(([id, up])=>shop.upgrades.includes(id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full bg-[var(--lko-green)]/15 px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                            children: [
                                                up.emoji,
                                                " ",
                                                up.label,
                                                " fitted"
                                            ]
                                        }, id, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1246,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `phone-biz-install-${id}`,
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                installBizUpgrade(typeId, id);
                                            },
                                            disabled: player.cash < up.cost,
                                            className: "lko-press min-h-[34px] rounded-lg border border-[var(--lko-green)]/40 bg-white px-2.5 text-[10.5px] font-extrabold text-[var(--lko-green-deep)] disabled:opacity-40",
                                            children: [
                                                up.emoji,
                                                " ",
                                                up.label,
                                                " · ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(up.cost)
                                            ]
                                        }, id, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1250,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1243,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                collectBiz(typeId, 'phone');
                                            },
                                            disabled: shop.accrued <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee,
                                            className: "lko-press min-h-[40px] flex-1 rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white disabled:opacity-45",
                                            children: [
                                                "Collect (+",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee),
                                                " fee)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1263,
                                            columnNumber: 19
                                        }, this),
                                        cost !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                upgradeBiz(typeId);
                                            },
                                            disabled: player.cash < cost,
                                            className: "lko-press min-h-[40px] flex-1 rounded-xl border border-[var(--lko-green)]/40 bg-white text-[12px] font-extrabold text-[var(--lko-green-deep)] disabled:opacity-45",
                                            children: [
                                                "Upgrade · ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cost)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                            lineNumber: 1271,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                                    lineNumber: 1262,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, typeId, true, {
                    fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                    lineNumber: 1196,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1.5 pt-1 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                children: "Collecting in person at the shop is always free — the fee na for phone transfer."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
                lineNumber: 1285,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/PhoneScreen.tsx",
        lineNumber: 1182,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_game_screens_PhoneScreen_tsx_b398195b._.js.map