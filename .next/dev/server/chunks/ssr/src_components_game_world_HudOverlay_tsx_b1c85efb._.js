module.exports = [
"[project]/src/components/game/world/HudOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HudOverlay",
    ()=>HudOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — World HUD (Stage 3D)
 * -----------------------------------
 * The DOM layer floating over the 3D canvas: R1-styled status chips,
 * the virtual joystick + sprint + interact controls (touch), drag-look
 * surface, the contextual interact prompt, and the two bottom sheets —
 * the location activities panel (real actions) and the travel sheet
 * (real fares from the EXISTING travel system).
 *
 * No economy logic lives here: sheets call store.travel / store.rest and
 * display values computed by systems/travel.calculateTravel.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/hustles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$interiors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/interiors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/liveRoom.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ambience$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/ambience.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)"); // W10-b/W10-c — the boarding chips + the tank read the net's own truth
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/systems/wheels.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$GaragePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/GaragePanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$PerfChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/PerfChip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/plates.ts [app-ssr] (ecmascript)"); // W4 — the banner law
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
const TRANSPORT_ICON = {
    walk: (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WalkIcon"], {
            ...p
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 56,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    keke: (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KekeIcon"], {
            ...p
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 57,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    taxi: (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaxiIcon"], {
            ...p
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 58,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    // M4 — personal rides ride their vehicle emoji (the garage is the icon source)
    'own-okada': (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                fontSize: (p.size ?? 20) * 0.95,
                lineHeight: 1
            },
            "aria-hidden": true,
            children: "🏍️"
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 60,
            columnNumber: 23
        }, ("TURBOPACK compile-time value", void 0)),
    'own-keke': (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                fontSize: (p.size ?? 20) * 0.95,
                lineHeight: 1
            },
            "aria-hidden": true,
            children: "🛺"
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 61,
            columnNumber: 22
        }, ("TURBOPACK compile-time value", void 0)),
    'own-taxi': (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                fontSize: (p.size ?? 20) * 0.95,
                lineHeight: 1
            },
            "aria-hidden": true,
            children: "🚕"
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 62,
            columnNumber: 22
        }, ("TURBOPACK compile-time value", void 0)),
    'own-danfo': (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                fontSize: (p.size ?? 20) * 0.95,
                lineHeight: 1
            },
            "aria-hidden": true,
            children: "🚐"
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 63,
            columnNumber: 23
        }, ("TURBOPACK compile-time value", void 0))
};
/** anchors AND physical props (job boards) resolve to a real location panel */ function resolveAnchorLoc(id) {
    if (id.startsWith('poi:')) {
        const poi = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POINTS_OF_INTEREST"].find((p)=>p.id === id.slice(4));
        return poi ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][poi.locationId] ?? null : null;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][id] ?? null;
}
/* --------------------------------- joystick --------------------------------- */ function Joystick() {
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const knob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const setKnob = (dx, dy)=>{
        if (knob.current) knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const handle = (e)=>{
        const el = base.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        const max = r.width / 2 - 14;
        const len = Math.hypot(dx, dy);
        if (len > max) {
            dx = dx / len * max;
            dy = dy / len * max;
        }
        setKnob(dx, dy);
        // screen up = forward
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setJoystick"])(dx / max, -dy / max);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: base,
        className: "pointer-events-auto absolute bottom-5 left-4 h-[118px] w-[118px] touch-none rounded-full border border-white/25 bg-black/25 backdrop-blur-sm",
        style: {
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.35)'
        },
        role: "application",
        "aria-label": "Movement joystick",
        onPointerDown: (e)=>{
            try {
                e.currentTarget.setPointerCapture(e.pointerId);
            } catch  {
            /* synthetic/test pointers have no active capture target */ }
            active.current = true;
            handle(e);
        },
        onPointerMove: (e)=>{
            if (active.current) handle(e);
        },
        onPointerUp: ()=>{
            active.current = false;
            setKnob(0, 0);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setJoystick"])(0, 0);
        },
        onPointerCancel: ()=>{
            active.current = false;
            setKnob(0, 0);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setJoystick"])(0, 0);
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: knob,
                className: "h-12 w-12 rounded-full border border-white/40 bg-white/85 shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-75"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
/* --------------------------------- minimap --------------------------------- */ /**
 * North-up live minimap: every location anchor as a tinted dot, the player
 * as a heading arrow, the rivers as faint strokes. Polls the input layer's
 * playerPos at ~8 Hz (zero React work in the 3D frame loop).
 */ function MiniMap({ discovered }) {
    const [tick, setTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const iv = setInterval(()=>setTick((t)=>t + 1), 125);
        return ()=>clearInterval(iv);
    }, []);
    void tick;
    // world (±WORLD_HALF) → minimap viewbox (0..44)
    const B = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_HALF"];
    const toMap = (v)=>22 + v / B * 21;
    const px = toMap(Math.max(-B, Math.min(B, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x)));
    const pz = toMap(Math.max(-B, Math.min(B, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z)));
    // heading: world yaw 0 faces +z (south) — minimap up is north (-z)
    const headingDeg = Math.atan2(Math.sin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].heading), -Math.cos(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].heading)) * 180 / Math.PI;
    // the REAL rivers, traced from the same data as the 3D world
    const riverPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].map((r)=>{
            const step = Math.max(1, Math.floor(r.points.length / 14));
            const pts = r.points.filter((_, i)=>i % step === 0 || i === r.points.length - 1);
            const d = pts.map((p, i)=>`${i === 0 ? 'M' : 'L'} ${toMap(p[0]).toFixed(1)} ${toMap(p[1]).toFixed(1)}`).join(' ');
            return {
                id: r.id,
                d,
                w: Math.max(1.3, r.width / B * 21 * 0.55)
            };
        }), []);
    const patti = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['mount-patti'];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none rounded-full border border-white/25 bg-black/40 shadow-[var(--lko-shadow-md)] backdrop-blur-md",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 44 44",
            className: "h-[74px] w-[74px] sm:h-[92px] sm:w-[92px]",
            role: "img",
            "aria-label": "Live minimap of Lokoja",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "lkoMiniLand",
                        cx: "0.5",
                        cy: "0.55",
                        r: "0.72",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: "#8a9a5e",
                                stopOpacity: "0.9"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#6d7d47",
                                stopOpacity: "0.9"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "22",
                    cy: "22",
                    r: "21",
                    fill: "url(#lkoMiniLand)"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this),
                riverPaths.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: r.d,
                        stroke: r.id === 'niger' ? '#2f8fa0' : '#3d9481',
                        strokeWidth: r.w,
                        fill: "none",
                        opacity: "0.85",
                        strokeLinecap: "round"
                    }, r.id, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: toMap(patti.x),
                    cy: toMap(patti.z),
                    rx: "7.5",
                    ry: "6.2",
                    fill: "#4C7A2E",
                    opacity: "0.8"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"].map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: toMap(a.x),
                        cy: toMap(a.z),
                        r: a.id === 'mount-patti' || a.id === 'confluence' ? 1.5 : 1.3,
                        fill: discovered.has(a.id) ? a.location.color : 'rgba(255,255,255,0.55)',
                        stroke: "rgba(0,0,0,0.45)",
                        strokeWidth: "0.3"
                    }, a.id, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    transform: `translate(${px} ${pz}) rotate(${headingDeg})`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 0 -2.6 L 1.7 2 L 0 0.9 L -1.7 2 Z",
                        fill: "#ffd88a",
                        stroke: "rgba(0,0,0,0.5)",
                        strokeWidth: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: "21",
                    y: "3.4",
                    fontSize: "3",
                    fontWeight: "800",
                    fill: "rgba(255,255,255,0.9)",
                    textAnchor: "middle",
                    children: "N"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
/* ------------------------------ district discovery ------------------------------ */ /** load discovered districts (session-spanning, NOT part of the save) */ function loadDiscovered() {
    try {
        const raw = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].discoveryKey);
        if (raw) return new Set(JSON.parse(raw));
    } catch  {
    /* storage unavailable — discovery just resets */ }
    return new Set();
}
function persistDiscovered(set) {
    try {
        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].discoveryKey, JSON.stringify([
            ...set
        ]));
    } catch  {
    /* ignore */ }
}
const DRIVE_UI_IDLE = {
    driving: false,
    model: null,
    near: null,
    hints: false,
    riding: false,
    boardable: null,
    seatsOpen: null,
    nearPump: false,
    fuel: null
};
/** the motor park — the Vehicle Shop button lives within this radius */ const SHOP_RADIUS = 28;
function HudOverlay({ nearestAnchor, district, gistNpc, interior, hotspot, onExit, onOpenWork, onOpenMap, onEnterInterior, onExitInterior }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const liveWire = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveWire);
    const isTravelling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.isTravelling);
    const travelAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.travel);
    const restAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.rest);
    const settleWalk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settleWorldWalk);
    const eatAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.eatMeal);
    const relaxAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.relaxIndoors);
    const surfaceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const nearestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [panel, setPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        kind: 'none'
    });
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(panel);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        panelRef.current = panel;
    }, [
        panel
    ]);
    /* Stage 5 — drive chrome state (polled, cheap) */ const [driveUi, setDriveUi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DRIVE_UI_IDLE);
    const driveUiRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(DRIVE_UI_IDLE);
    const [nearShop, setNearShop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const nearShopRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    /* W10-c — the tank's gauge lives in the speedo's DOM block (ref-driven) */ const speedoFuelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* W4 — THE SPEEDOMETER: ref-driven (the poll law forbids a setState per
   * frame) — the km/h text, needle transform and gear chip write straight
   * to the DOM only when the rounded value changes. */ const speedoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const speedoNumRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const speedoNeedleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const speedoGearRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastKmhRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(-999);
    /* W4 — THE JUNCTION BANNERS: entering a real OSM-named street (the W1
   * plates) raises a banner — once per crossing, deduped 24s per name. */ const [banner, setBanner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const bannerShownAtRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const lastPlateNameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // INC 4 — interior mode: refs so the rAF poll can read them without re-subscribing
    const travellingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(isTravelling);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        travellingRef.current = isTravelling;
    }, [
        isTravelling
    ]);
    const interiorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(interior);
    const hotspotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(hotspot);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        interiorRef.current = interior;
    }, [
        interior
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        hotspotRef.current = hotspot;
    }, [
        hotspot
    ]);
    // keep the poll's copies of the callbacks fresh too
    const enterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onEnterInterior);
    const exitInteriorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onExitInterior);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        enterRef.current = onEnterInterior;
    }, [
        onEnterInterior
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        exitInteriorRef.current = onExitInterior;
    }, [
        onExitInterior
    ]);
    /* ----------------------- views: camera modes + photo mode ----------------------- */ const [camMode, setCamModeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCamMode"])());
    const [photo, setPhoto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const togglePhoto = ()=>{
        const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["togglePhotoMode"])() // the input layer owns the flag
        ;
        setPhoto(next);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play(next ? 'click' : 'chime');
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKey = (e)=>{
            if (e.code === 'KeyV' && !e.repeat) {
                const tag = e.target?.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;
                togglePhoto();
            }
        };
        window.addEventListener('keydown', onKey);
        return ()=>window.removeEventListener('keydown', onKey);
    }, []);
    // keep the polling loop's view of the nearest anchor fresh (ref write in effect)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        nearestRef.current = nearestAnchor;
    }, [
        nearestAnchor
    ]);
    /* --------------------------- one-time onboarding --------------------------- */ // lazy init — the tour shows on every first visit (per device, not in the save)
    const [tutStep, setTutStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetTutProgress"])();
        if (typeof document === 'undefined') return null;
        try {
            return localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].onboardingKey) === '1' ? null : 0;
        } catch  {
            return 0;
        }
    });
    const tutStepRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        tutStepRef.current = tutStep;
    }, [
        tutStep
    ]);
    const finishTut = ()=>{
        try {
            localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].onboardingKey, '1');
        } catch  {
        /* storage unavailable — the tour just shows again next visit */ }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('chime');
        setTutStep(null);
    };
    /* ---------------------------- arrival toasts + discovery ----------------------------- */ const [arrival, setArrival] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [discovered, setDiscovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadDiscovered());
    const discoveredRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(discovered);
    const seenDistricts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const arrivalTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const districtRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastDistrictRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        districtRef.current = district;
    }, [
        district
    ]);
    /** record a newly visited district into session-spanning discovery */ const discover = (id)=>{
        if (discoveredRef.current.has(id)) return false;
        const next = new Set(discoveredRef.current);
        next.add(id);
        discoveredRef.current = next;
        setDiscovered(next);
        persistDiscovered(next);
        return true;
    };
    /* ------------------------------- gist chip ------------------------------- */ const [dismissedGists, setDismissedGists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Set());
    const npcDef = gistNpc ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPCS"].find((n)=>n.id === gistNpc) ?? null : null;
    const npcHustle = gistNpc ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLES"].find((h)=>h.npcId === gistNpc) ?? null : null;
    const gistVisible = npcDef !== null && npcHustle !== null && !dismissedGists.has(npcDef.id) && panel.kind === 'none' && !isTravelling && !interior;
    const isTouchDevice = ()=>("TURBOPACK compile-time value", "undefined") !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);
    const [touchMode, setTouchMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(isTouchDevice);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // pointer capability can change (detachable keyboards); keep it fresh
        const mq = window.matchMedia('(pointer: coarse)');
        const onChange = ()=>{
            if (mq.matches) setTouchMode(true);
        };
        mq.addEventListener?.('change', onChange);
        // some WebViews/hybrids never report coarse — the first real touch proves it
        const onTouch = ()=>setTouchMode(true);
        window.addEventListener('touchstart', onTouch, {
            once: true,
            passive: true
        });
        return ()=>{
            mq.removeEventListener?.('change', onChange);
            window.removeEventListener('touchstart', onTouch);
        };
    }, []);
    // look-drag + keyboard wiring on the full-screen surface
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const el = surfaceRef.current;
        if (!el) return;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["attachControls"])(el);
    }, []);
    // interact polling (E / Enter / HUD button) + Escape closes sheets + tour steps
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let raf = 0;
        let lastAmbience = 0;
        const tick = ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["consumeInteract"])()) {
                // INC 4 — inside: the nearest hotspot drives the panel
                const hot = hotspotRef.current;
                const inside = interiorRef.current;
                if (hot && inside) {
                    const h = inside.hotspots.find((x)=>x.id === hot);
                    if (h) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        if (h.kind === 'exit') exitInteriorRef.current();
                        else setPanel({
                            kind: 'interior',
                            hotspot: h.kind
                        });
                    }
                } else if (driveUiRef.current.near && panelRef.current.kind === 'none' && !driveUiRef.current.driving) {
                    // STAGE 5 — walk-up entry to your own parked ride
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestEnterVehicle"])(driveUiRef.current.near);
                } else if (driveUiRef.current.driving && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveSpeed"])() < 2.6) {
                    // STAGE 5 — stopped + interact = park & step out
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestParkVehicle"])();
                } else if (nearestRef.current && !driveUiRef.current.driving) {
                    const anchorId = nearestRef.current;
                    if (anchorId.startsWith('door:')) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        enterRef.current(anchorId.slice(5));
                    } else {
                        const loc = resolveAnchorLoc(anchorId);
                        if (loc) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            setPanel({
                                kind: loc.id === world.currentLocation ? 'activities' : 'travel',
                                loc
                            });
                        }
                    }
                }
            }
            // ambience proximity blend — throttled to ~2 Hz, zero React work
            const nowMs = performance.now();
            if (nowMs - lastAmbience > 500) {
                lastAmbience = nowMs;
                const riverA = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['confluence'];
                const marketA = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['kpata-market'];
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ambience$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ambience"].update({
                    night: world.timeOfDay === 'night',
                    rain: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRainSky"])(world.weather),
                    indoors: interiorRef.current !== null,
                    river: Math.hypot(riverA.x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, riverA.z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z),
                    market: Math.hypot(marketA.x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, marketA.z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z)
                });
            }
            // onboarding auto-advance — the tour watches the REAL input layer
            const step = tutStepRef.current;
            if (step !== null) {
                const tp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTutProgress"])();
                if (step === 0 && tp.moved) {
                    tutStepRef.current = 1;
                    setTutStep(1);
                } else if (step === 1 && tp.looked) {
                    tutStepRef.current = 2;
                    setTutStep(2);
                } else if (step === 2 && nearestRef.current) {
                    tutStepRef.current = 3;
                    setTutStep(3);
                }
            }
            // arrival toast — first entry each session + persistent discovery
            const distNow = districtRef.current;
            if (distNow && distNow !== lastDistrictRef.current) {
                lastDistrictRef.current = distNow;
                const fresh = discover(distNow);
                if (!seenDistricts.current.has(distNow)) {
                    const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][distNow];
                    if (loc) {
                        seenDistricts.current.add(distNow);
                        setArrival(fresh ? `${loc.name} — new place discovered!` : loc.name);
                        if (arrivalTimer.current) clearTimeout(arrivalTimer.current);
                        arrivalTimer.current = setTimeout(()=>setArrival(null), fresh ? 3000 : 2600);
                        if (fresh) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('chime');
                    }
                }
            }
            // camera mode can change from the input layer (C key) — keep the chip honest
            const cm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCamMode"])();
            setCamModeState((prev)=>prev === cm ? prev : cm);
            // STAGE 5 — drive chrome: poll the input layer, re-render on real changes only
            const driving = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDriveActive"])();
            const riding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelIsRiding"])();
            const boardable = !driving && !riding ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boardableNear"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z) : null;
            // my own live car's consent — the roster row is the wire's truth
            let seatsOpen = null;
            if (driving) {
                const me = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle;
                const row = me ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWireStore"].getState().roster.find((r)=>r.handle === me) : null;
                seatsOpen = row?.car?.seatsOpen === true;
            }
            const dui = {
                driving,
                model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveModel"])(),
                near: driving || riding ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNearVehicle"])(),
                hints: driving && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveStartedAt"])() > 0 && performance.now() - (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveStartedAt"])() < 5200,
                riding,
                boardable: boardable ? {
                    handle: boardable.handle,
                    name: boardable.name,
                    model: boardable.model,
                    plate: boardable.plate
                } : null,
                seatsOpen,
                nearPump: driving && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nearServiceSpot"])('pump', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z),
                fuel: driving ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelFuelEstimate"])() : null
            };
            const prevDui = driveUiRef.current;
            if (prevDui.driving !== dui.driving || prevDui.model !== dui.model || prevDui.near !== dui.near || prevDui.hints !== dui.hints || prevDui.riding !== dui.riding || prevDui.seatsOpen !== dui.seatsOpen || prevDui.boardable?.handle !== dui.boardable?.handle || dui.boardable && prevDui.boardable && prevDui.boardable.plate !== dui.boardable.plate || prevDui.nearPump !== dui.nearPump || prevDui.fuel !== dui.fuel) {
                driveUiRef.current = dui;
                setDriveUi(dui);
            }
            /* W4 — the speedo writes: DOM only, only when the km/h tick changes */ // W10-c — THE TANK'S GAUGE: DOM only, one write per 2% change
            const fuelNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelFuelEstimate"])();
            if (speedoFuelRef.current) {
                const pct = fuelNow === null ? '' : `${Math.max(0, Math.round(fuelNow * 100))}%`;
                if (speedoFuelRef.current.textContent !== pct) speedoFuelRef.current.textContent = pct;
                if (speedoFuelRef.current) {
                    const low = fuelNow !== null && fuelNow < 0.15;
                    const nextColor = low ? '#ff5040' : '#7ee2a8';
                    if (speedoFuelRef.current.style.color !== nextColor) speedoFuelRef.current.style.color = nextColor;
                }
            }
            if (!driveUiRef.current.driving && lastKmhRef.current !== -999) lastKmhRef.current = -999;
            if (speedoRef.current) {
                const kmh = Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["speedToKmh"])(driving ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveSpeed"])() : 0));
                if (kmh !== lastKmhRef.current) {
                    lastKmhRef.current = kmh;
                    if (speedoNumRef.current) speedoNumRef.current.textContent = String(kmh);
                    if (speedoGearRef.current) speedoGearRef.current.textContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveSpeed"])() < -0.05 ? 'R' : 'D';
                    if (speedoNeedleRef.current) {
                        const frac = Math.max(0, Math.min(1, kmh / 80));
                        speedoNeedleRef.current.style.transform = `rotate(${-120 + frac * 240}deg)`;
                    }
                }
            }
            /* W4 — the banner law: nearest named-artery plate within 7u raises
       * ENTERING <NAME>, once per crossing, deduped 24s per name */ if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPhotoMode"])() && panelRef.current.kind === 'none' && !travellingRef.current) {
                const near = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nearestPlate"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z, 7);
                const now = performance.now();
                if (near && near.plate.name !== lastPlateNameRef.current) {
                    const shownAt = bannerShownAtRef.current.get(near.plate.name) ?? -1e9;
                    if (now - shownAt > 24_000) {
                        bannerShownAtRef.current.set(near.plate.name, now);
                        lastPlateNameRef.current = near.plate.name;
                        setBanner({
                            name: near.plate.name,
                            at: now
                        });
                    } else {
                        lastPlateNameRef.current = near.plate.name;
                    }
                } else if (!near && lastPlateNameRef.current) {
                    lastPlateNameRef.current = null; // left the mouth — the next street may speak
                }
                if (banner && now - banner.at > 2800) setBanner(null);
            } else if (banner) {
                setBanner(null);
            }
            const shopA = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['transport-area'];
            const shopNow = !driving && !!shopA && Math.hypot(shopA.x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, shopA.z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z) < SHOP_RADIUS;
            if (shopNow !== nearShopRef.current) {
                nearShopRef.current = shopNow;
                setNearShop(shopNow);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const onKey = (e)=>{
            if (e.code === 'Escape') setPanel({
                kind: 'none'
            });
        };
        window.addEventListener('keydown', onKey);
        return ()=>{
            cancelAnimationFrame(raf);
            window.removeEventListener('keydown', onKey);
        };
    }, [
        world.currentLocation,
        world.timeOfDay,
        world.weather,
        banner
    ]);
    // freeze walking while a sheet is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freezeInput"])(panel.kind !== 'none' || isTravelling);
    }, [
        panel,
        isTravelling
    ]);
    const openPanelFor = (anchorId)=>{
        if (!anchorId) return;
        // INC 4 — doors and interior hotspots speak their own protocol
        if (interior && hotspot) {
            const h = interior.hotspots.find((x)=>x.id === hotspot);
            if (h) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                if (h.kind === 'exit') onExitInterior();
                else setPanel({
                    kind: 'interior',
                    hotspot: h.kind
                });
            }
            return;
        }
        if (anchorId.startsWith('door:')) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
            onEnterInterior(anchorId.slice(5));
            return;
        }
        const loc = resolveAnchorLoc(anchorId);
        if (!loc) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        setPanel({
            kind: loc.id === world.currentLocation ? 'activities' : 'travel',
            loc
        });
    };
    const currentLoc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
    // M21 — the co-presence chip: REAL presence rows ONLY, TTL honored at
    // render (a stale ping is an absent neighbor). It re-evaluates with the
    // live slice's own sync cadence — this component adds ZERO new intervals.
    // The sim crowd is deliberately NOT shown here: the nation snapshot is
    // not subscribed in this tree, and no heavy subscription gets added for
    // a decoration (the phone's Live room carries the labeled (sim) line).
    const copresenceNow = Date.now();
    const coPresent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerCountIn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireToPresences"])(liveWire?.roster ?? [], copresenceNow), world.currentLocation, copresenceNow);
    const hotDef = interior && hotspot ? interior.hotspots.find((h)=>h.id === hotspot) ?? null : null;
    const doorDef = !interior && nearestAnchor?.startsWith('door:') ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$interiors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERIOR_BY_ID"][nearestAnchor.slice(5)] ?? null : null;
    const promptLoc = !interior && !doorDef && nearestAnchor ? resolveAnchorLoc(nearestAnchor) : null;
    const promptAnchor = nearestAnchor;
    const isPoiPrompt = !!promptAnchor?.startsWith('poi:');
    // STAGE 5 — your parked ride is close enough to enter; it wins the prompt slot
    const nearVehicleDef = driveUi.near ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][driveUi.near] : null;
    const vehicleChip = nearVehicleDef && panel.kind === 'none' && !driveUi.driving && !driveUi.riding && !interior && !isTravelling && !photo;
    const boardableDef = driveUi.boardable ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][driveUi.boardable.model] : null;
    const boardChip = boardableDef && driveUi.boardable && panel.kind === 'none' && !driveUi.driving && !driveUi.riding && !vehicleChip && !interior && !isTravelling && !photo;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none absolute inset-0 select-none",
        style: {
            zIndex: 30
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: surfaceRef,
                className: "pointer-events-auto absolute inset-0 touch-none",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 737,
                columnNumber: 7
            }, this),
            isTravelling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-scrim pointer-events-none absolute inset-0 flex items-center justify-center bg-[#f6d489]/12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lko-display flex items-center gap-2 rounded-full bg-black/45 px-5 py-2.5 text-lg text-white backdrop-blur-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KekeIcon"], {
                            size: 22
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 743,
                            columnNumber: 13
                        }, this),
                        " Travelling…"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 742,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 741,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-opacity duration-300 ${photo ? 'pointer-events-none opacity-0' : 'opacity-100'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-auto flex min-w-0 items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    if (interior) {
                                        // stepping back outside — WorldTab settles the interior visit
                                        onExitInterior();
                                        return;
                                    }
                                    // settle the visit's walking into the real needs economy
                                    settleWalk((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWalkedMeters"])());
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetWalkedMeters"])();
                                    onExit();
                                },
                                "aria-label": interior ? 'Step back outside' : 'Leave the 3D world',
                                className: "lko-press flex h-10 items-center gap-1.5 rounded-full bg-black/40 px-3.5 text-[13px] font-extrabold text-white backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArrowLeftIcon"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 767,
                                        columnNumber: 13
                                    }, this),
                                    interior ? 'Outside' : 'Exit'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 751,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex min-w-0 items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md",
                                children: [
                                    interior ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] bg-[#ffd88a]/90 text-[8px] font-black text-[#3d2a00]",
                                        children: "in"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 772,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                        id: currentLoc.id,
                                        size: 14,
                                        className: "shrink-0 text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 774,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate text-[13px] font-extrabold text-white",
                                        children: interior ? interior.name : currentLoc.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 776,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 770,
                                columnNumber: 11
                            }, this),
                            coPresent >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-testid": "hud-copresence",
                                "aria-label": `${coPresent} real players on this street`,
                                className: "flex items-center gap-1 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-2 text-[10.5px] font-extrabold text-white/85 backdrop-blur-md",
                                children: [
                                    "👥 ",
                                    coPresent,
                                    " here"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 782,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 750,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-auto flex flex-col items-end gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-extrabold text-white backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoinsIcon"], {
                                        size: 13,
                                        className: "shrink-0 text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 794,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(player.cash)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 795,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 793,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-2 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-1.5 text-[10.5px] font-bold text-white backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TimeIcon"], {
                                                name: world.timeOfDay,
                                                size: 11,
                                                className: "shrink-0 text-[#ffd88a]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 799,
                                                columnNumber: 15
                                            }, this),
                                            "Day ",
                                            world.day
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 798,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1 capitalize",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClockIcon"], {
                                                size: 11,
                                                className: "shrink-0 text-[#ffd88a]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 803,
                                                columnNumber: 15
                                            }, this),
                                            world.timeOfDay
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 802,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WeatherIcon"], {
                                                name: world.weather,
                                                size: 11,
                                                className: "shrink-0 text-[#ffd88a]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 807,
                                                columnNumber: 15
                                            }, this),
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEATHER_META"][world.weather]?.label ?? world.weather
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 806,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 797,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-1 text-[10.5px] font-bold text-white/90 backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PinIcon"], {
                                        size: 10,
                                        className: "shrink-0 text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 813,
                                        columnNumber: 13
                                    }, this),
                                    discovered.size,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"].length,
                                    " places found"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 812,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    !interior && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cycleCamMode"])();
                                            setCamModeState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCamMode"])());
                                        },
                                        "aria-label": "Cycle camera view (C)",
                                        title: "Cycle view — C",
                                        className: "lko-press flex h-8 items-center gap-1 rounded-full bg-black/40 px-2.5 text-[10.5px] font-extrabold text-white backdrop-blur-md",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "12",
                                                height: "12",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.4",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                "aria-hidden": true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M23 7l-7 5 7 5V7z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 830,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: "1",
                                                        y: "5",
                                                        width: "15",
                                                        height: "14",
                                                        rx: "2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 831,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 829,
                                                columnNumber: 17
                                            }, this),
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAM_MODES"].find((m)=>m.id === camMode)?.label ?? 'View'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 819,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: togglePhoto,
                                        "aria-label": "Photo mode (V)",
                                        title: "Photo mode — V",
                                        className: "lko-press flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "13",
                                            height: "13",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2.2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            "aria-hidden": true,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 843,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "12",
                                                    cy: "13",
                                                    r: "4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 844,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 842,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 836,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 817,
                                columnNumber: 11
                            }, this),
                            !interior && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniMap, {
                                discovered: discovered
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 849,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$PerfChip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PerfChip"], {}, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 851,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 792,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 749,
                columnNumber: 7
            }, this),
            photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 top-3 flex justify-center pt-[max(0rem,env(safe-area-inset-top))]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: togglePhoto,
                    className: "lko-press flex items-center gap-1.5 rounded-full bg-black/45 px-4 py-2 text-[12px] font-extrabold text-white backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "13",
                            height: "13",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2.2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            "aria-hidden": true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 863,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "12",
                                    cy: "13",
                                    r: "4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 864,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 862,
                            columnNumber: 13
                        }, this),
                        "Photo mode — tap or press V to exit"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 858,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 857,
                columnNumber: 9
            }, this),
            tutStep !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 top-[4.9rem] z-10 flex justify-center px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-pop w-full max-w-sm rounded-2xl border border-white/25 bg-black/55 p-4 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "lko-display text-[15px]",
                                    children: "Welcome to Lokoja"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 876,
                                    columnNumber: 15
                                }, this),
                                tutStep < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: finishTut,
                                    className: "rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-white/85",
                                    children: "Skip"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 878,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 875,
                            columnNumber: 13
                        }, this),
                        tutStep < 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 text-[13px] font-semibold leading-snug text-white/90",
                                    children: [
                                        tutStep === 0 && (touchMode ? 'Drag the left stick to walk around.' : 'Walk with W A S D or the arrow keys.'),
                                        tutStep === 1 && (touchMode ? 'Drag anywhere on the screen to look around.' : 'Drag with the mouse to look around.'),
                                        tutStep === 2 && 'Walk to a golden pin — press E or tap the pin button.'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 888,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 flex items-center gap-1.5",
                                    children: [
                                        0,
                                        1,
                                        2
                                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `h-1.5 w-7 rounded-full transition-colors ${i <= tutStep ? 'bg-[#ffd88a]' : 'bg-white/25'}`
                                        }, i, false, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 897,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 895,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 text-[13px] font-semibold leading-snug text-white/90",
                                    children: "You're ready — explore the city, meet people and find work."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 906,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: finishTut,
                                    className: "lko-press mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[var(--lko-green)] text-[13px] font-extrabold",
                                    children: "Start exploring"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 909,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 874,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 873,
                columnNumber: 9
            }, this),
            arrival && tutStep === null && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-[4.9rem] flex justify-center px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lko-pop flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-[13px] font-extrabold text-white backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PinIcon"], {
                            size: 14,
                            className: "text-[#ffd88a]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 925,
                            columnNumber: 13
                        }, this),
                        "Now entering ",
                        arrival
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 924,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 923,
                columnNumber: 9
            }, this),
            driveUi.driving && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: speedoRef,
                className: "pointer-events-none absolute right-4 z-10",
                style: {
                    bottom: touchMode ? '17rem' : '6.75rem'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex h-24 w-24 items-end justify-center rounded-full border-2 border-[#ffd88a]/55 bg-black/65 shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        [
                            -120,
                            -60,
                            0,
                            60,
                            120
                        ].map((deg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-1/2 left-1/2 h-[42px] w-px origin-bottom bg-white/25",
                                style: {
                                    transform: `translateX(-50%) rotate(${deg}deg)`
                                }
                            }, deg, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 937,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: speedoNeedleRef,
                            className: "absolute bottom-1/2 left-1/2 h-9 w-[3px] origin-bottom rounded-full bg-[#ff5040]",
                            style: {
                                transform: 'translateX(-50%) rotate(-120deg)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 944,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative mb-3 flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    ref: speedoNumRef,
                                    className: "text-[26px] font-black leading-none text-white",
                                    children: "0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 950,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-0.5 text-[8.5px] font-black tracking-[0.18em] text-white/70",
                                    children: "KM/H"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 951,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    ref: speedoFuelRef,
                                    className: "mt-0.5 text-[9px] font-black tracking-wider text-[#7ee2a8]",
                                    children: "⛽"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 952,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 949,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            ref: speedoGearRef,
                            className: "absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-[#ffd88a]",
                            children: "D"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 954,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 934,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 933,
                columnNumber: 9
            }, this),
            photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0 z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-y-0 left-1/3 w-px bg-white/20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 967,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-y-0 left-2/3 w-px bg-white/20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 968,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-1/3 h-px bg-white/20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 969,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-2/3 h-px bg-white/20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 970,
                        columnNumber: 11
                    }, this),
                    [
                        'left-3 top-3 border-l-2 border-t-2',
                        'right-3 top-3 border-r-2 border-t-2',
                        'bottom-3 left-3 border-b-2 border-l-2',
                        'bottom-3 right-3 border-b-2 border-r-2'
                    ].map((pos)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `absolute h-7 w-7 border-white/70 ${pos}`
                        }, pos, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 973,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black tracking-[0.3em] text-white/90",
                                children: "LOKOJA LIFE"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 976,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-1 w-1 rounded-full bg-[#e8a317]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 977,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-bold capitalize text-white/70",
                                children: [
                                    world.timeOfDay,
                                    " · ",
                                    world.weather.replace('night-', '')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 978,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 975,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 966,
                columnNumber: 9
            }, this),
            banner && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPhotoMode"])() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-[4.6rem] flex justify-center px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-pop flex flex-col items-center rounded-2xl border border-[#ffd88a]/45 bg-black/60 px-6 py-2.5 text-center shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd88a]",
                            children: "Now entering"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 990,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[17px] font-black uppercase tracking-wide text-white",
                            children: banner.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 991,
                            columnNumber: 13
                        }, this)
                    ]
                }, banner.name, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 986,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 985,
                columnNumber: 9
            }, this),
            driveUi.driving && driveUi.hints && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-[4.9rem] flex justify-center px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lko-pop max-w-full rounded-full bg-black/55 px-4 py-2 text-center text-[12px] font-extrabold text-white backdrop-blur-md",
                    children: [
                        touchMode ? 'Stick up = gas · down = brake · sides = steer' : 'W / ↑ gas · S / ↓ brake · A D steer',
                        ' ',
                        "— slow down, then PARK"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 999,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 998,
                columnNumber: 9
            }, this),
            nearShop && !driveUi.driving && panel.kind === 'none' && !isTravelling && !photo && !interior && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute left-4 z-10",
                style: {
                    bottom: touchMode ? '10.9rem' : '5.75rem'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "garage-open-chip",
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        setPanel({
                            kind: 'garage'
                        });
                    },
                    className: "lko-press lko-pop flex items-center gap-2 rounded-full border border-[#ffd88a]/50 bg-black/60 px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[15px]",
                            "aria-hidden": true,
                            children: "🏍️"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1022,
                            columnNumber: 13
                        }, this),
                        "Vehicle Shop"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1014,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1010,
                columnNumber: 9
            }, this),
            interior && hotDef && panel.kind === 'none' && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>openPanelFor(hotDef.id),
                    className: "lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/55 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffd88a] text-[11px] font-black text-[#3d2a00]",
                            children: hotDef.kind === 'exit' ? '→' : hotDef.kind === 'bed' ? '🛏' : hotDef.kind === 'stove' ? '🍲' : hotDef.kind === 'tv' ? '📺' : hotDef.kind === 'bath' ? '🚿' : hotDef.kind === 'shop' ? '🧺' : '📋'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1035,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[14px] font-extrabold",
                            children: hotDef.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1038,
                            columnNumber: 13
                        }, this),
                        !touchMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold",
                            children: "E"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1040,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1031,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1030,
                columnNumber: 9
            }, this),
            vehicleChip && nearVehicleDef && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestEnterVehicle"])(nearVehicleDef.model);
                    },
                    className: "lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[12px]",
                            children: nearVehicleDef.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1055,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[14px] font-extrabold",
                            children: [
                                "Enter ",
                                nearVehicleDef.label
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1058,
                            columnNumber: 13
                        }, this),
                        !touchMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold",
                            children: "E"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1060,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1048,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1047,
                columnNumber: 9
            }, this),
            driveUi.riding && panel.kind === 'none' && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "unboard-chip",
                    onClick: async ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelRequestUnboard"])();
                        if (r.ok) {
                            if (typeof r.x === 'number' && typeof r.z === 'number') (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestE2eTeleport"])(r.x, r.z);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify({
                                icon: '🚌',
                                text: 'You hop off — safe journey.',
                                tone: 'good'
                            });
                        } else if (r.why === 'moving') {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify({
                                icon: '🚌',
                                text: 'The danfo still dey move — wait make e stop.',
                                tone: 'neutral'
                            });
                        }
                    },
                    className: "lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[12px]",
                            children: "🚏"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1082,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[14px] font-extrabold",
                            children: "Hop off"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1083,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1068,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1067,
                columnNumber: 9
            }, this),
            boardChip && driveUi.boardable && boardableDef && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "board-chip",
                    onClick: async ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        const target = driveUi.boardable;
                        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelRequestBoard"])(target.handle);
                        const notify = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify;
                        if (r.ok) {
                            notify({
                                icon: '🚌',
                                text: `You enter ${target.name}'s ${boardableDef.label} — hold well.`,
                                tone: 'good'
                            });
                        } else {
                            const why = {
                                'seats-shut': 'The driver no open seat.',
                                moving: 'The danfo still dey move — wait make e stop.',
                                full: 'The motor don full.',
                                blocked: 'You no fit enter this one.',
                                'guest-dark': 'Claim your name first — guests no dey ride.',
                                'already-aboard': 'You don dey inside already.'
                            };
                            notify({
                                icon: '🚫',
                                text: why[r.why ?? ''] ?? 'The motor don go.',
                                tone: 'bad'
                            });
                        }
                    },
                    className: "lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[12px]",
                            children: boardableDef.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1112,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[14px] font-extrabold",
                            children: [
                                "Board ",
                                driveUi.boardable.name,
                                "'s ",
                                boardableDef.label
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1115,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1089,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1088,
                columnNumber: 9
            }, this),
            !interior && doorDef && panel.kind === 'none' && !isTravelling && !photo && !vehicleChip && !driveUi.driving && !driveUi.riding && !boardChip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>openPanelFor(promptAnchor),
                    className: "lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[11px] font-black text-white",
                            children: "→"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1125,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[14px] font-extrabold",
                            children: [
                                "Enter ",
                                doorDef.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1126,
                            columnNumber: 13
                        }, this),
                        !touchMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold",
                            children: "E"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1130,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1121,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1120,
                columnNumber: 9
            }, this),
            promptLoc && panel.kind === 'none' && !isTravelling && !photo && !interior && !doorDef && !vehicleChip && !driveUi.driving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>openPanelFor(promptAnchor),
                    className: "lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/55 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                            id: promptLoc.id,
                            size: 17,
                            className: "shrink-0 text-[#ffd88a]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1141,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[14px] font-extrabold",
                            children: isPoiPrompt ? `Read the ${promptLoc.name} job board` : promptAnchor === world.currentLocation ? `You're at ${promptLoc.name} — tap to see what's here` : `Travel to ${promptLoc.name}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1142,
                            columnNumber: 13
                        }, this),
                        !touchMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                            className: "rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold",
                            children: "E"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1150,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1137,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1136,
                columnNumber: 9
            }, this),
            gistVisible && npcDef && npcHustle && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute inset-x-0 bottom-52 flex justify-center px-6 sm:bottom-[6.75rem]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-black/55 py-2 pl-2 pr-2 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lko-gold)] text-[16px]",
                            children: npcDef.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1160,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 pl-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-[13px] font-extrabold leading-tight",
                                    children: [
                                        npcDef.name,
                                        " dey around"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1164,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block max-w-[13.5rem] truncate text-[11px] font-semibold text-white/80 sm:max-w-[18rem]",
                                    children: [
                                        "“",
                                        npcHustle.title,
                                        "” — gist dey Work board"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1165,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1163,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                onOpenWork();
                            },
                            className: "lko-press ml-1 flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorkIcon"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1176,
                                    columnNumber: 15
                                }, this),
                                "Work"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1169,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "aria-label": "Dismiss gist",
                            onClick: ()=>setDismissedGists((prev)=>{
                                    const next = new Set(prev);
                                    next.add(npcDef.id);
                                    return next;
                                }),
                            className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-extrabold text-white/80",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1179,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1158,
                columnNumber: 9
            }, this),
            touchMode && panel.kind === 'none' && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Joystick, {}, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1199,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-auto absolute bottom-6 right-4 flex flex-col items-center gap-3",
                        children: driveUi.driving ? /* behind the wheel: PARK replaces the walk buttons (stop + E also parks) */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "aria-label": "Park and step out",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestParkVehicle"])();
                            },
                            className: "lko-press flex h-14 w-14 items-center justify-center rounded-full border border-[#ffd88a]/70 bg-[#e8a317]/90 text-[10.5px] font-extrabold text-[#3d2a00] shadow-[0_0_18px_rgba(232,163,23,0.5)] backdrop-blur-md",
                            children: "PARK"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1203,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-label": "Interact",
                                    onPointerDown: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queueInteract"])(),
                                    className: `lko-press flex h-14 w-14 items-center justify-center rounded-full border text-white backdrop-blur-md ${promptAnchor || vehicleChip ? 'border-[#ffd88a]/70 bg-[#e8a317]/85 shadow-[0_0_18px_rgba(232,163,23,0.55)]' : 'border-white/25 bg-black/35'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PinIcon"], {
                                        size: 22
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1222,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1215,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-label": "Sprint (hold)",
                                    onPointerDown: (e)=>{
                                        try {
                                            e.currentTarget.setPointerCapture(e.pointerId);
                                        } catch  {
                                        /* synthetic pointers */ }
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSprint"])(true);
                                    },
                                    onPointerUp: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSprint"])(false),
                                    onPointerCancel: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSprint"])(false),
                                    className: "lko-press flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/35 text-[11px] font-extrabold text-white backdrop-blur-md",
                                    children: "RUN"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1224,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            driveUi.driving && !touchMode && panel.kind === 'none' && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute bottom-6 right-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestParkVehicle"])();
                    },
                    title: "Park & step out (or stop + E)",
                    className: "lko-press flex min-h-[44px] items-center gap-2 rounded-full border border-[#ffd88a]/70 bg-[#e8a317]/90 px-4 text-[12.5px] font-extrabold text-[#3d2a00] shadow-[0_0_18px_rgba(232,163,23,0.5)] backdrop-blur-md",
                    children: "🅿 Park & Step Out"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1249,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1248,
                columnNumber: 9
            }, this),
            driveUi.driving && driveUi.seatsOpen !== null && panel.kind === 'none' && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute bottom-[5.6rem] right-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "seats-toggle",
                    onClick: async ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        const next = !(driveUi.seatsOpen === true);
                        const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelRequestSeats"])(next);
                        const notify = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify;
                        if (ok) {
                            notify({
                                icon: '🚪',
                                text: next ? 'Seats open — paddies fit board when you stop.' : 'Seats shut — na you alone dey inside.',
                                tone: next ? 'good' : 'neutral'
                            });
                        } else {
                            notify({
                                icon: '🚫',
                                text: 'The wire no gree — try again.',
                                tone: 'bad'
                            });
                        }
                    },
                    className: `lko-press flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 text-[11.5px] font-extrabold shadow-[var(--lko-shadow-lg)] backdrop-blur-md ${driveUi.seatsOpen ? 'border-[#7ee2a8]/60 bg-[#146b3a]/85 text-[#eafff2]' : 'border-white/25 bg-black/55 text-white/90'}`,
                    children: [
                        "🚪 ",
                        driveUi.seatsOpen ? 'Seats: Open' : 'Seats: Shut'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1265,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1264,
                columnNumber: 9
            }, this),
            driveUi.driving && driveUi.nearPump && driveUi.fuel !== null && driveUi.fuel < 0.999 && panel.kind === 'none' && !photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-auto absolute bottom-[8.6rem] right-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "refuel-chip",
                    onClick: async ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveModel"])();
                        const p = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"];
                        if (!model) return;
                        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelRequestRefuel"])(model, 2000, p.x, p.z);
                        const notify = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify;
                        if (r.ok) {
                            notify({
                                icon: '⛽',
                                text: '₦2,000 fuel enter tank — the ledger don record am.',
                                tone: 'good'
                            });
                        } else {
                            const why = {
                                'minors-no-money': 'Minors no dey touch money.',
                                'no-pump': 'No pump here — find the Motor Park.',
                                'tank-full': 'The tank don full.',
                                'too-small': '₦200 na the minimum.',
                                'too-big': "₦20,000 na the pump's ceiling.",
                                insufficient: 'Your wallet no carry am — fund am first.',
                                'dry-tank': 'The tank don dry already.'
                            };
                            notify({
                                icon: '🚫',
                                text: why[r.why ?? ''] ?? 'The pump no gree — try again.',
                                tone: 'bad'
                            });
                        }
                    },
                    className: "lko-press flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#7ee2a8]/60 bg-[#146b3a]/85 px-3.5 text-[11.5px] font-extrabold text-[#eafff2] shadow-[var(--lko-shadow-lg)] backdrop-blur-md",
                    children: "⛽ Buy fuel ₦2,000"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1301,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1300,
                columnNumber: 11
            }, this),
            panel.kind !== 'none' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Close panel",
                        className: "lko-scrim pointer-events-auto absolute inset-0 bg-black/35",
                        onClick: ()=>setPanel({
                                kind: 'none'
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1335,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "lko-sheet pointer-events-auto absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-3xl border-t border-black/[0.08] bg-[var(--lko-surface)] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[var(--lko-shadow-lg)] sm:max-w-lg",
                        role: "dialog",
                        "aria-label": panel.kind === 'travel' ? `Travel to ${panel.loc.name}` : panel.kind === 'interior' ? `${interior?.name ?? 'Indoors'} — inside` : panel.kind === 'garage' ? 'Motor Park garage — buy and drive your own ride' : `${panel.loc.name} activities`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-black/10",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1353,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3 px-5 pt-3",
                                children: [
                                    panel.kind === 'interior' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[15px] font-black text-white",
                                                style: {
                                                    backgroundColor: interior?.palette.accent ?? '#2e7d5b'
                                                },
                                                children: panel.hotspot === 'bed' ? '🛏' : panel.hotspot === 'stove' ? '🍲' : panel.hotspot === 'tv' ? '📺' : panel.hotspot === 'bath' ? '🚿' : panel.hotspot === 'shop' ? '🧺' : '📋'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 1359,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "lko-display truncate text-lg leading-tight",
                                                        children: interior?.name ?? 'Indoors'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                                        children: "Inside your own four walls"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 1367,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 1365,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : panel.kind === 'garage' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--lko-gold)] text-[20px]",
                                                children: "🏍️"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 1374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "lko-display truncate text-lg leading-tight",
                                                        children: "Motor Park Garage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 1378,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                                        children: "Buy your own — drive Lokoja your way"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 1379,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 1377,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white",
                                                style: {
                                                    backgroundColor: panel.loc.color
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                                    id: panel.loc.id,
                                                    size: 22
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 1390,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 1386,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "lko-display truncate text-lg leading-tight",
                                                        children: panel.loc.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 1393,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            "“",
                                                            panel.loc.tagline,
                                                            "”"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                        lineNumber: 1394,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                lineNumber: 1392,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setPanel({
                                                kind: 'none'
                                            }),
                                        "aria-label": "Close",
                                        className: "lko-press flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1400,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1356,
                                columnNumber: 13
                            }, this),
                            panel.kind === 'travel' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TravelSheet, {
                                loc: panel.loc,
                                onConfirm: (t)=>{
                                    setPanel({
                                        kind: 'none'
                                    });
                                    travelAction(panel.loc.id, t);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1410,
                                columnNumber: 15
                            }, this) : panel.kind === 'interior' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InteriorSheet, {
                                def: interior,
                                hotspotKind: panel.hotspot,
                                onClose: ()=>setPanel({
                                        kind: 'none'
                                    }),
                                onRest: (k)=>{
                                    setPanel({
                                        kind: 'none'
                                    });
                                    restAction(k);
                                },
                                onEat: (mealKey, locId)=>{
                                    eatAction(mealKey, locId);
                                },
                                onRelax: (k)=>{
                                    setPanel({
                                        kind: 'none'
                                    });
                                    relaxAction(k);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1418,
                                columnNumber: 15
                            }, this) : panel.kind === 'garage' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$GaragePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GaragePanel"], {
                                onClose: ()=>setPanel({
                                        kind: 'none'
                                    })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1435,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivitiesSheet, {
                                loc: panel.loc,
                                onRest: (k)=>{
                                    setPanel({
                                        kind: 'none'
                                    });
                                    restAction(k);
                                },
                                onEat: (mealKey)=>{
                                    eatAction(mealKey, panel.loc.id);
                                },
                                onOpenWork: ()=>{
                                    setPanel({
                                        kind: 'none'
                                    });
                                    onOpenWork();
                                },
                                onOpenMap: ()=>{
                                    setPanel({
                                        kind: 'none'
                                    });
                                    onOpenMap(panel.loc.id);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1437,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1340,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 735,
        columnNumber: 5
    }, this);
}
/* ------------------------------- travel sheet -------------------------------- */ function TravelSheet({ loc, onConfirm }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const origin = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
    // M4 — public modes + YOUR rides, one shared offer law with the 2D map
    // M8 — the sheet's pump price = the store's pump price (scarcity surge rides)
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["allTravelOptions"])(origin, loc, world.weather, world.timeOfDay, player.vehicles, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fuelMultFor"])(world.day));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 px-5 pb-4 pt-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                children: loc.description
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1478,
                columnNumber: 7
            }, this),
            options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TravelRow, {
                    transport: option.transport,
                    loc: loc,
                    plan: option.plan,
                    label: option.label,
                    personal: option.personal,
                    onConfirm: ()=>onConfirm(option.transport)
                }, option.transport, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1482,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lko-num mt-1 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                children: "Trip time and fares follow the real weather and road conditions."
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1492,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 1477,
        columnNumber: 5
    }, this);
}
function TravelRow({ transport, loc, plan, label, personal, onConfirm }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const noCash = player.cash < plan.cost;
    const noEnergy = player.needs.energy < plan.energyCost;
    const disabled = noCash || noEnergy;
    const reason = noCash ? `You need ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(plan.cost)}${personal ? ' for fuel' : ''}` : noEnergy ? 'Too tired for this trip' : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `lko-card flex items-center gap-3 p-3 ${disabled ? 'opacity-60' : ''} ${personal && !disabled ? 'border border-[var(--lko-gold)]/45' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-[var(--lko-green-deep)]",
                children: TRANSPORT_ICON[transport]({
                    size: 20
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1529,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13.5px] font-extrabold leading-tight",
                        children: [
                            label ?? (transport === 'walk' ? 'Walk' : transport),
                            personal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1.5 rounded-full bg-[var(--lko-gold)]/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]",
                                children: "fuel · no fare"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1536,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1533,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-num truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: [
                            plan.minutes,
                            " min · ",
                            plan.energyCost,
                            " energy · ",
                            plan.distanceKm.toFixed(1),
                            " km",
                            plan.weatherModifier > 1 ? ` · ${loc.travelModifier > 1 ? 'hilly route' : 'slow roads'}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1541,
                        columnNumber: 9
                    }, this),
                    reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-bold text-red-600",
                        children: reason
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1545,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1532,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                disabled: disabled,
                onClick: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('chime');
                    onConfirm();
                },
                className: "lko-press flex h-10 shrink-0 items-center gap-1 rounded-xl bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold text-white disabled:cursor-not-allowed disabled:bg-black/15",
                children: plan.cost > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "lko-num",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(plan.cost)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1556,
                    columnNumber: 11
                }, this) : 'Free'
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1547,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 1528,
        columnNumber: 5
    }, this);
}
/* ----------------------------- activities sheet ------------------------------ */ function ActivitiesSheet({ loc, onRest, onEat, onOpenWork, onOpenMap }) {
    const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    const hunger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.needs.hunger ?? 100);
    const timeOfDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world?.timeOfDay ?? 'morning');
    const isHome = loc.id === 'home';
    // Stage 4 eating loop — real meals (food strip) + market groceries (Kpata)
    const isFoodSpot = loc.id === 'food-area' || loc.id === 'kpata-market';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 px-5 pb-4 pt-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                children: loc.description
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1589,
                columnNumber: 7
            }, this),
            isFoodSpot && (loc.id === 'food-area' ? loc.activities.filter((a)=>a.key === 'eat') : loc.activities.filter((a)=>a.key === 'shop-food')).map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MealMenu, {
                    title: loc.id === 'food-area' ? '🍲 Mama’s menu — eat now' : '🧺 Market fresh — buy foodstuff',
                    atLocationId: loc.id,
                    onEat: onEat,
                    // M6 — the outdoor food strip hosts the night stalls after dark
                    nightStalls: loc.id === 'food-area' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNightMarketOpen"])(timeOfDay)
                }, a.key, false, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1597,
                    columnNumber: 11
                }, this)),
            loc.activities.map((a)=>{
                // 'rest' renders as the Nap/Sleep pair; its sibling 'sleep' key is the
                // same action in data — skip the duplicate row
                if (a.key === 'sleep') return null;
                // eat / shop-food render as the meal menu above when this is a food spot
                if ((a.key === 'eat' || a.key === 'shop-food') && isFoodSpot) return null;
                if (a.stage <= 3 && a.key === 'rest' && isHome) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    onRest('nap');
                                },
                                className: "lko-press flex min-h-[52px] items-center gap-2 rounded-xl bg-[var(--lko-gold)] px-3 text-left text-[13px] font-extrabold text-[#3d2a00]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClockIcon"], {
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1623,
                                        columnNumber: 17
                                    }, this),
                                    " Nap"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1616,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    onRest('sleep');
                                },
                                className: "lko-press flex min-h-[52px] items-center gap-2 rounded-xl bg-[var(--lko-green)] px-3 text-left text-[13px] font-extrabold text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MoonIcon"], {
                                        size: 17
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1632,
                                        columnNumber: 17
                                    }, this),
                                    " Sleep till morning"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1625,
                                columnNumber: 15
                            }, this)
                        ]
                    }, a.key, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1615,
                        columnNumber: 13
                    }, this);
                }
                if (a.stage <= 3 && (a.key.startsWith('job-') || a.key === 'hustle')) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onOpenWork();
                        },
                        className: "lko-press lko-card flex min-h-[52px] items-center gap-3 p-3 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorkIcon"], {
                                    size: 19
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1648,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1647,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[13.5px] font-extrabold leading-tight",
                                        children: a.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1651,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: "Open the Work board"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1652,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1650,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                size: 16,
                                className: "text-[var(--lko-green)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1656,
                                columnNumber: 15
                            }, this)
                        ]
                    }, a.key, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1639,
                        columnNumber: 13
                    }, this);
                }
                if (a.stage <= 3 && (a.key === 'travel' || a.key === 'transport-hub')) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onOpenMap();
                        },
                        className: "lko-press lko-card flex min-h-[52px] items-center gap-3 p-3 text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-river-soft)] text-[var(--lko-river)]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapIcon"], {
                                    size: 19
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1671,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1670,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[13.5px] font-extrabold leading-tight",
                                        children: a.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1674,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: "Open the full map"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1675,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1673,
                                columnNumber: 15
                            }, this)
                        ]
                    }, a.key, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1662,
                        columnNumber: 13
                    }, this);
                }
                // honestly locked — later stage
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-h-[48px] items-center gap-3 rounded-xl border border-dashed border-black/10 px-3 opacity-70",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-[var(--lko-ink-soft)]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LockIcon"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1684,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1683,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 flex-1 text-[12.5px] font-bold text-[var(--lko-ink-soft)]",
                            children: a.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1686,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                            children: [
                                "Arrives in Stage ",
                                a.stage
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1687,
                            columnNumber: 13
                        }, this)
                    ]
                }, a.key, true, {
                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                    lineNumber: 1682,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 1588,
        columnNumber: 5
    }, this);
}
/* -------------------------------- meal menu --------------------------------- */ /**
 * Shared FOOD.meals list — one store action (eatMeal) behind every row,
 * used by the outdoor activities sheet AND the interior surfaces (stove,
 * Mama's counter, the provisions store).
 */ function MealMenu({ title, atLocationId, onEat, nightStalls = false }) {
    const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    const hunger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.needs.hunger ?? 100);
    const mealPriceAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.mealPriceAt);
    const timeOfDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world?.timeOfDay ?? 'morning');
    const nightOpen = nightStalls && atLocationId === 'food-area' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNightMarketOpen"])(timeOfDay);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-black/[0.06] bg-[var(--lko-gold-soft)]/40 p-2.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]",
                children: [
                    title,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold normal-case text-[var(--lko-ink-soft)]",
                        children: [
                            "hunger ",
                            Math.round(hunger),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1725,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1723,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                children: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FOOD"].meals.map((m)=>{
                        // M6 — night dishes live at the night stalls, and only after dark
                        if (m.night) return null;
                        const price = mealPriceAt(m.key, atLocationId);
                        const afford = cash >= price;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            disabled: !afford,
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                onEat(m.key, atLocationId);
                            },
                            className: `lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left ${afford ? 'lko-card' : 'cursor-not-allowed opacity-55'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[12.5px] font-extrabold leading-tight",
                                            children: m.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 1748,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: m.detail
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 1749,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1747,
                                    columnNumber: 15
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
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 1752,
                                                    columnNumber: 136
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 1752,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                            children: [
                                                "+",
                                                m.hunger,
                                                " 🍲"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 1753,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1751,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, m.key, true, {
                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                            lineNumber: 1736,
                            columnNumber: 13
                        }, this);
                    }),
                    nightOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 flex items-center justify-between rounded-lg bg-[#0a1230] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[#ffd88a]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🌙 Night market dey open"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1761,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold opacity-80",
                                        children: "late plates, fair price"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                        lineNumber: 1762,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1760,
                                columnNumber: 13
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FOOD"].meals.filter((m)=>m.night).map((m)=>{
                                const price = mealPriceAt(m.key, atLocationId);
                                const afford = cash >= price;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: !afford,
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        onEat(m.key, atLocationId);
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
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 1780,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                    children: m.detail
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 1781,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 1779,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex shrink-0 flex-col items-end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "lko-num text-[12px] font-extrabold text-[var(--lko-green)]",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 1784,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                                    children: [
                                                        "+",
                                                        m.hunger,
                                                        " 🍲"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                                    lineNumber: 1785,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                            lineNumber: 1783,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, m.key, true, {
                                    fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                    lineNumber: 1768,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1729,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 1722,
        columnNumber: 5
    }, this);
}
/* ------------------------------- interior sheet ------------------------------- */ const INTERIOR_ICON = {
    bed: '🛏',
    stove: '🍲',
    tv: '📺',
    bath: '🚿',
    menu: '📋',
    shop: '🧺',
    exit: '→'
};
const INTERIOR_COPY = {
    bed: {
        title: 'Rest a while',
        sub: 'Sleep till morning restores the most; naps top you up.'
    },
    stove: {
        title: 'Cook at the stove',
        sub: 'The pot at home is the cheapest belly filler.'
    },
    tv: {
        title: 'Watch some TV',
        sub: 'One slot — mood up, small energy back.'
    },
    bath: {
        title: 'Freshen up',
        sub: 'A quick bath — energy and mood, one slot.'
    },
    menu: {
        title: 'Food is ready',
        sub: 'Hot plates straight from the pot.'
    },
    shop: {
        title: 'Provisions counter',
        sub: 'Foodstuff and small chops for the pot.'
    },
    exit: {
        title: 'Step outside',
        sub: ''
    }
};
function InteriorSheet({ def, hotspotKind, onClose, onRest, onEat, onRelax }) {
    const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    const relax = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERIOR"].relax;
    const copy = INTERIOR_COPY[hotspotKind];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 px-5 pb-4 pt-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                children: copy.sub
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1840,
                columnNumber: 7
            }, this),
            hotspotKind === 'bed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onRest('nap');
                        },
                        className: "lko-press flex min-h-[52px] items-center gap-2 rounded-xl bg-[var(--lko-gold)] px-3 text-left text-[13px] font-extrabold text-[#3d2a00]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClockIcon"], {
                                size: 17
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1852,
                                columnNumber: 13
                            }, this),
                            " Nap"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1845,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onRest('sleep');
                        },
                        className: "lko-press flex min-h-[52px] items-center gap-2 rounded-xl bg-[var(--lko-green)] px-3 text-left text-[13px] font-extrabold text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MoonIcon"], {
                                size: 17
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1861,
                                columnNumber: 13
                            }, this),
                            " Sleep till morning"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1854,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1844,
                columnNumber: 9
            }, this),
            (hotspotKind === 'tv' || hotspotKind === 'bath') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                    onRelax(hotspotKind);
                },
                className: "lko-press lko-card flex min-h-[56px] items-center gap-3 p-3 text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-river-soft)] text-lg",
                        children: INTERIOR_ICON[hotspotKind]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1875,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block text-[13.5px] font-extrabold leading-tight",
                                children: copy.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1879,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    "+",
                                    relax[hotspotKind].mood,
                                    " mood · +",
                                    relax[hotspotKind].energy,
                                    " energy · −",
                                    Math.abs(relax[hotspotKind].hunger),
                                    " hunger · 1 slot"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                                lineNumber: 1880,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1878,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckIcon"], {
                        size: 16,
                        className: "text-[var(--lko-green)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1884,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1868,
                columnNumber: 9
            }, this),
            hotspotKind === 'stove' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MealMenu, {
                title: "🍲 Cook at home",
                atLocationId: def.locationId,
                onEat: onEat
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1890,
                columnNumber: 9
            }, this),
            (hotspotKind === 'menu' || hotspotKind === 'shop') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MealMenu, {
                title: hotspotKind === 'menu' ? '🍲 Mama’s menu — eat now' : '🧺 Market fresh — buy foodstuff',
                atLocationId: def.locationId,
                onEat: onEat
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1895,
                columnNumber: 9
            }, this),
            (hotspotKind === 'stove' || hotspotKind === 'menu' || hotspotKind === 'shop') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex items-center justify-between rounded-lg bg-black/[0.04] px-3 py-2 text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Wallet"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1905,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num text-[12px] font-extrabold text-[var(--lko-green)]",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cash)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                        lineNumber: 1906,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1904,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "lko-press mt-1 flex min-h-[44px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]",
                children: "Close"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HudOverlay.tsx",
                lineNumber: 1910,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HudOverlay.tsx",
        lineNumber: 1839,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_game_world_HudOverlay_tsx_b1c85efb._.js.map