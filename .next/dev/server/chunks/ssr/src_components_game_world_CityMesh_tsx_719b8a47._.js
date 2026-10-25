module.exports = [
"[project]/src/components/game/world/CityMesh.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CityMesh",
    ()=>CityMesh,
    "DOOR_LIGHT_BY_TIER",
    ()=>DOOR_LIGHT_BY_TIER,
    "DOOR_LIGHT_POOL",
    ()=>DOOR_LIGHT_POOL,
    "DOOR_LIGHT_SOURCES",
    ()=>DOOR_LIGHT_SOURCES,
    "DOOR_PARTS",
    ()=>DOOR_PARTS,
    "doorPartMatrix",
    ()=>doorPartMatrix,
    "nearestKInto",
    ()=>nearestKInto,
    "pickNearestDoorLights",
    ()=>pickNearestDoorLights
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — City Mesh (Stage 3D + 4-b Nigerianisation)
 * ---------------------------------------------------
 * Everything the eye reads as "a Nigerian city", built from instanced
 * primitives so the whole skyline costs a handful of draw calls:
 * buildings with baked plaster facades (small punched windows, damp
 * bases, night-lit panes), corrugated roofs with overhangs, striped
 * shopfront awnings + painted signboards, compound walls with gates and
 * laundry lines, utility poles with sagging wires, keke-stop shelters,
 * market crates, palms and savanna trees — plus the bespoke landmark
 * structures at each location anchor and floating location labels.
 *
 * Window glow / lamp glow read atmoLive.nightGlow (driven by the REAL
 * world clock) — no React re-render on time changes.
 *
 * SILK II — the frame law. The city's three heaviest static lesions are
 * healed here: (1) THE DOOR LIGHT LAW — the 98 per-door pointLights are
 * gone; a fixed pool of 6 point lights (DoorLights) tracks the K nearest
 * door anchors imperatively (K by effective tier: 0 low / 4 mid / 6 high,
 * read live from extrasLive), intensity following atmoLive.nightGlow each
 * frame — the shader's point-light count is per-tier constant. (2) THE
 * DOOR MERGE LAW — 98 doors × 7 private meshes became 6 InstancedMesh
 * buckets (one per part-kind, 686 instances, 6 materials), matrices
 * composed by doorPartMatrix to be exactly the old scene-graph
 * transforms; only the frame (posts + lintel) casts shadows. (3) THE
 * LABEL LAW — location labels cull by distance from the player (140u,
 * the 3 nearest always alive) via imperative per-frame writes; invisible
 * sprites skip the y-bounce. Every per-frame write is allocation-free
 * module scratch; zero new timers; zero React state.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/flora.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$species$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/flora-species.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/flora-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$flora$2d$shader$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/flora-shader.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/terrainArt.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/atmosphere.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/extras.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/props.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/plates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$catenary$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/catenary.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/junctions.ts [app-ssr] (ecmascript)"); // W3 — the junction hardware
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
function bakeFacade(kind, variant) {
    const S = 256;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    const eCanvas = document.createElement('canvas');
    eCanvas.width = S;
    eCanvas.height = S;
    const eCtx = eCanvas.getContext('2d');
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(9100 + kind.length * 131 + variant * 57);
    // plaster base (near-white → instance colour provides the wall tone)
    ctx.fillStyle = '#f1ebdd';
    ctx.fillRect(0, 0, S, S);
    for(let i = 0; i < 40; i++){
        ctx.fillStyle = `rgba(${104 + (rng() * 44 | 0)}, ${94 + (rng() * 34 | 0)}, 72, ${0.03 + rng() * 0.05})`;
        ctx.fillRect(rng() * S, rng() * S, 12 + rng() * 38, 5 + rng() * 16);
    }
    // vertical rain streaks under the roofline
    for(let i = 0; i < 13; i++){
        ctx.fillStyle = `rgba(96, 88, 70, ${0.05 + rng() * 0.06})`;
        ctx.fillRect(rng() * S, rng() * S * 0.4, 2 + rng() * 3, 44 + rng() * 90);
    }
    // block courses — the classic stripped masonry banding
    if (kind === 'block') {
        for(let y = 44; y < S - 40; y += 42){
            ctx.fillStyle = 'rgba(70, 62, 48, 0.15)';
            ctx.fillRect(0, y, S, 2);
            ctx.fillStyle = 'rgba(255, 255, 250, 0.22)';
            ctx.fillRect(0, y + 2, S, 1);
        }
    }
    // damp: the rain-splash grime line every Lokoja wall wears
    const grad = ctx.createLinearGradient(0, S, 0, S - 66);
    grad.addColorStop(0, 'rgba(72, 60, 42, 0.36)');
    grad.addColorStop(1, 'rgba(72, 60, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, S - 66, S, 66);
    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, S, S);
    const paintWindow = (x, y, w, h, opts)=>{
        // lintel + sill
        ctx.fillStyle = 'rgba(66, 58, 44, 0.6)';
        ctx.fillRect(x - 3, y - 4, w + 6, 4);
        ctx.fillStyle = 'rgba(244, 238, 222, 0.9)';
        ctx.fillRect(x - 4, y + h + 2, w + 8, 4);
        // painted timber shutters flanking some windows
        if (opts.shutter) {
            ctx.fillStyle = 'rgba(62, 74, 68, 0.95)';
            ctx.fillRect(x - 8, y, 8, h);
            ctx.fillRect(x + w, y, 8, h);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            for(let sy = y + 2; sy < y + h - 2; sy += 4){
                ctx.fillRect(x - 8, sy, 8, 1.4);
                ctx.fillRect(x + w, sy, 8, 1.4);
            }
        }
        // frame + glass + sky glint
        ctx.fillStyle = '#e4ddcb';
        ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
        ctx.fillStyle = '#222c33';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(198, 222, 232, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w * 0.5, y);
        ctx.closePath();
        ctx.fill();
        // night: only SOME panes glow, warm — a couple glow TV-blue
        if (opts.lit) {
            eCtx.fillStyle = opts.tv ? 'rgba(214, 226, 255, 0.9)' : 'rgba(255, 255, 255, 0.94)';
            eCtx.fillRect(x + 1, y + 1, w - 2, h - 2);
            eCtx.fillStyle = 'rgba(0, 0, 0, 0.42)';
            eCtx.fillRect(x + 1, y + 1, (w - 2) * 0.42, h - 2);
        }
    };
    const paintDoor = (x, y, w, h)=>{
        ctx.fillStyle = 'rgba(58, 48, 34, 0.9)';
        ctx.fillRect(x - 3, y - 3, w + 6, h + 3);
        ctx.fillStyle = '#4c3822';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(28, 20, 10, 0.5)';
        for(let px = x + w / 3; px < x + w - 1; px += w / 3)ctx.fillRect(px, y, 1.5, h);
        ctx.fillStyle = '#2a3138';
        ctx.fillRect(x + w * 0.18, y + h * 0.1, w * 0.64, h * 0.24);
        ctx.fillStyle = '#c8b070';
        ctx.fillRect(x + w - 6, y + h * 0.52, 2.5, 7);
    };
    if (kind === 'house') {
        for(let c = 0; c < 4; c++){
            paintWindow(18 + c * 60, 46, 30, 32, {
                shutter: rng() < 0.42,
                lit: rng() < (variant === 0 ? 0.46 : 0.3),
                tv: rng() < 0.14
            });
        }
        paintDoor(113, 182, 30, 62);
        paintWindow(32, 190, 30, 38, {
            shutter: rng() < 0.5,
            lit: rng() < 0.4,
            tv: rng() < 0.2
        });
        paintWindow(190, 190, 30, 38, {
            shutter: rng() < 0.5,
            lit: rng() < 0.4,
            tv: rng() < 0.2
        });
    } else if (kind === 'shop') {
        for(let c = 0; c < 3; c++){
            paintWindow(40 + c * 73, 44, 30, 30, {
                shutter: rng() < 0.3,
                lit: rng() < (variant === 0 ? 0.5 : 0.32),
                tv: rng() < 0.16
            });
        }
        // open shopfront: deep shaded interior with a serving counter
        ctx.fillStyle = '#e4ddcb';
        ctx.fillRect(30, 172, 196, 74);
        ctx.fillStyle = '#191b1d';
        ctx.fillRect(34, 176, 188, 70);
        ctx.fillStyle = '#6a4a2e';
        ctx.fillRect(34, 214, 188, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.fillRect(34, 176, 188, 16);
        // the interior breathes warm light at night
        eCtx.fillStyle = 'rgba(255, 255, 255, 0.34)';
        eCtx.fillRect(34, 190, 188, 54);
        eCtx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        eCtx.fillRect(40, 176, 40, 70);
    } else if (kind === 'block') {
        for(let r = 0; r < 3; r++){
            for(let c = 0; c < 5; c++){
                paintWindow(24 + c * 44, 40 + r * 52, 26, 24, {
                    shutter: rng() < 0.3,
                    lit: rng() < (variant === 0 ? 0.4 : 0.26),
                    tv: rng() < 0.12
                });
            }
        }
        paintDoor(112, 182, 32, 62);
    } else {
        // shed counters — plain washed plaster, no punched openings
        ctx.fillStyle = 'rgba(60, 52, 38, 0.12)';
        ctx.fillRect(0, 96, S, 2);
    }
    const map = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    const emissive = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](eCanvas);
    map.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    emissive.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    map.anisotropy = 4;
    return {
        map,
        emissive
    };
}
/** corrugated iron: vertical ribs, seam lines and rust bloom (tinted per roof) */ function bakeCorrugation() {
    const S = 256;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(5501);
    ctx.fillStyle = '#d2d2d2';
    ctx.fillRect(0, 0, S, S);
    for(let x = 0; x < S; x += 10){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.17)';
        ctx.fillRect(x, 0, 3, S);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fillRect(x + 5, 0, 2, S);
    }
    for(let y = 0; y < S; y += 86){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, y, S, 2);
    }
    for(let i = 0; i < 10; i++){
        const x = rng() * S;
        const y = rng() * S;
        const r = 7 + rng() * 24;
        const g = ctx.createRadialGradient(x, y, 1, x, y, r);
        g.addColorStop(0, `rgba(128, 62, 32, ${0.16 + rng() * 0.14})`);
        g.addColorStop(1, 'rgba(128, 62, 32, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
/** striped awning canvas — white/cream bands that take the per-instance tint */ function bakeStripes() {
    const S = 128;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    for(let x = 0; x < S; x += 16){
        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(x, 0, 8, S);
        ctx.fillStyle = '#d8d2c2';
        ctx.fillRect(x + 8, 0, 8, S);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.fillRect(0, S - 5, S, 5);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
/**
 * Painted business signboards — one atlas, 4×4 slots of 128px, each an
 * ORIGINAL Lokoja business name (props.SSHOP list) on a painted board.
 * Slot 15 is the plain dark back panel.
 */ function bakeSignAtlas() {
    const CELL = 128;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(771);
    const BG = [
        '#1b5c3a',
        '#8a2f22',
        '#1f3a6e',
        '#6e4a10',
        '#3a2a50',
        '#14532d',
        '#7a2838',
        '#2a4a2a'
    ];
    for(let slot = 0; slot < 16; slot++){
        const x0 = slot % 4 * CELL;
        const y0 = Math.floor(slot / 4) * CELL;
        ctx.fillStyle = slot === 15 ? '#232e28' : BG[slot % BG.length];
        ctx.fillRect(x0, y0, CELL, CELL);
        if (slot === 15) continue;
        ctx.strokeStyle = '#e2c06a';
        ctx.lineWidth = 5;
        ctx.strokeRect(x0 + 6, y0 + 6, CELL - 12, CELL - 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x0 + 8, y0 + 8, CELL - 16, 10);
        const name = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHOP_NAMES"][slot] ?? 'LOKOJA';
        const words = name.split(' ');
        ctx.font = '800 19px "Outfit", "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f7efd8';
        // wrap to at most 3 lines that fit the 108px board face
        const lines = [];
        let line = '';
        for (const w of words){
            const test = line ? `${line} ${w}` : w;
            if (ctx.measureText(test).width > 106 && line) {
                lines.push(line);
                line = w;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
        const lh = 22;
        const startY = y0 + CELL / 2 - (lines.length - 1) * lh / 2 + (rng() - 0.5) * 2;
        lines.forEach((l, i)=>ctx.fillText(l, x0 + CELL / 2, startY + i * lh, 108));
    }
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
/** soft radial falloff for the warm pools street lamps cast at night */ function bakeGlowPool() {
    const S = 128;
    const canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    g.addColorStop(0.45, 'rgba(255, 255, 255, 0.32)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
}
/** rounded-pill label sprite texture (name only — R1 typographic style) */ function makeLabelTexture(text) {
    const w = 512;
    const h = 128;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    // pill
    ctx.fillStyle = 'rgba(16, 22, 17, 0.78)';
    const r = 26;
    const x0 = 26;
    const y0 = 34;
    const x1 = w - 26;
    const y1 = h - 20;
    ctx.beginPath();
    ctx.roundRect(x0, y0, x1 - x0, y1 - y0, r);
    ctx.fill();
    ctx.strokeStyle = 'rgba(232, 163, 23, 0.55)';
    ctx.lineWidth = 3;
    ctx.stroke();
    // gold pin dot
    ctx.fillStyle = '#e8a317';
    ctx.beginPath();
    ctx.arc(x0 + 34, h / 2 - 4, 8, 0, Math.PI * 2);
    ctx.fill();
    // name
    ctx.fillStyle = '#fdf9ef';
    ctx.font = '700 44px "Outfit", "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x0 + 56, h / 2 - 2, w - x0 - 92);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
/* ------------------------------ instanced base ------------------------------ */ /** shared scratch vectors for instanced setup (mount-time only, no per-frame allocs) */ const UP_VEC = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0);
/** thin wrapper that fills an InstancedMesh once on mount */ function InstancedGroup({ count, setup, children, castShadow = false, receiveShadow = false }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mesh = ref.current;
        if (!mesh) return;
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Object3D"]();
        const color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#ffffff');
        for(let i = 0; i < count; i++){
            color.set('#ffffff');
            setup(i, m, color);
            m.updateMatrix();
            mesh.setMatrixAt(i, m.matrix);
            mesh.setColorAt(i, color);
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [
        count,
        setup
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
        ref: ref,
        args: [
            undefined,
            undefined,
            count
        ],
        castShadow: castShadow,
        receiveShadow: receiveShadow,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 410,
        columnNumber: 5
    }, this);
}
/* ------------------------------- buildings ---------------------------------- */ const FACADE_GROUPS = [
    {
        kind: 'house',
        test: (b)=>b.kind === 'house' || b.kind === 'colonial',
        variants: 2
    },
    {
        kind: 'shop',
        test: (b)=>b.kind === 'shop',
        variants: 2
    },
    {
        kind: 'block',
        test: (b)=>b.kind === 'block' || b.kind === 'hostel',
        variants: 2
    },
    {
        kind: 'shed',
        test: (b)=>b.kind === 'shed',
        variants: 1
    }
];
const RUST_REF = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#7a4630');
function Buildings() {
    // one baked material per (kind, lit-variant) — 7 materials, 7 draw calls
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const out = [];
        for (const g of FACADE_GROUPS){
            const list = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].filter(g.test);
            for(let v = 0; v < g.variants; v++){
                const sub = list.filter((_, i)=>i % g.variants === v);
                if (!sub.length) continue;
                const tex = bakeFacade(g.kind, v);
                out.push({
                    list: sub,
                    mat: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                        map: tex.map,
                        emissiveMap: tex.emissive,
                        emissive: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#ffb45c'),
                        emissiveIntensity: 0.04,
                        roughness: 0.94,
                        metalness: 0
                    })
                });
            }
        }
        return out;
    }, []);
    // dispose baked materials/textures when the world unmounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            for (const g of groups){
                g.mat.map?.dispose();
                g.mat.emissiveMap?.dispose();
                g.mat.dispose();
            }
        };
    }, [
        groups
    ]);
    const corrugated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const tex = bakeCorrugation();
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            map: tex,
            roughness: 0.62,
            metalness: 0.22,
            flatShading: true
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            corrugated.map?.dispose();
            corrugated.dispose();
        };
    }, [
        corrugated
    ]);
    const hips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].filter((b)=>b.roof === 'hip'), []);
    const slabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].filter((b)=>b.roof === 'shed'), []);
    const flats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].filter((b)=>b.roof === 'flat'), []);
    // subtle night glow on the lit panes — tasteful, not lantern-mode
    // (materials live in a ref so the frame loop can retune them safely)
    const matsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        matsRef.current = groups.map((g)=>g.mat);
    }, [
        groups
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const e = 0.03 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow * 0.95;
        for (const m of matsRef.current)m.emissiveIntensity = e;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            groups.map((g, gi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                    count: g.list.length,
                    castShadow: true,
                    receiveShadow: true,
                    setup: (i, m, color)=>{
                        const b = g.list[i];
                        m.position.set(b.x, b.y + b.h / 2, b.z);
                        m.rotation.set(0, b.rotY, 0);
                        m.scale.set(b.w, b.h, b.d);
                        color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALL_TONES"][b.tone]).multiplyScalar(0.94 + i % 4 * 0.03);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                1,
                                1,
                                1
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 505,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                            object: g.mat,
                            attach: "material"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 506,
                            columnNumber: 11
                        }, this)
                    ]
                }, gi, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 498,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: hips.length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const b = hips[i];
                    const roofH = Math.min(b.w, b.d) * 0.5;
                    m.position.set(b.x, b.y + b.h + roofH / 2 - 0.04, b.z);
                    m.rotation.set(0, b.rotY + Math.PI / 4, 0);
                    m.scale.set(b.w + 1.15, roofH, b.d + 1.15);
                    color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROOF_TONES"][b.roofTone]).lerp(RUST_REF, 0.24).multiplyScalar(0.9 + i % 3 * 0.06);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            0.71,
                            1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                        object: corrugated,
                        attach: "material"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 520,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 511,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: slabs.length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const b = slabs[i];
                    m.position.set(b.x, b.y + b.h + 0.12, b.z);
                    m.rotation.set(0, b.rotY, 0.1);
                    m.scale.set(b.w * 1.18, 0.16, b.d * 1.18);
                    color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROOF_TONES"][b.roofTone]).lerp(RUST_REF, 0.24).multiplyScalar(0.9 + i % 3 * 0.06);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                        object: corrugated,
                        attach: "material"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 532,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: flats.length * 2,
                castShadow: true,
                setup: (i, m, color)=>{
                    const b = flats[i % flats.length];
                    if (i < flats.length) {
                        // roof deck
                        m.position.set(b.x, b.y + b.h + 0.05, b.z);
                        m.rotation.set(0, b.rotY, 0);
                        m.scale.set(b.w * 1.02, 0.12, b.d * 1.02);
                        color.set('#57534a');
                    } else {
                        // parapet
                        m.position.set(b.x, b.y + b.h + 0.2, b.z);
                        m.rotation.set(0, b.rotY, 0);
                        m.scale.set(b.w * 1.05, 0.42, b.d * 1.05);
                        color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALL_TONES"][b.tone]).multiplyScalar(0.8);
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 552,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.9,
                        metalness: 0
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 553,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 536,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 495,
        columnNumber: 5
    }, this);
}
/* ------------------------------- shopfronts ---------------------------------- */ /**
 * Street-level commerce: striped awnings over the shopfronts and painted
 * business signboards (one atlas texture, one merged geometry — a single
 * draw call for every sign in Lokoja, with a plain back panel each).
 */ function Shopfronts() {
    const signGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const pos = [];
        const nor = [];
        const uv = [];
        const idx = [];
        let v = 0;
        const quad = (cx, cy, cz, w, h, rotY, outX, outZ, slot)=>{
            const col = slot % 4;
            const row = Math.floor(slot / 4);
            const u0 = (col + 0.02) / 4;
            const u1 = (col + 0.98) / 4;
            const v1 = 1 - (row + 0.03) / 4;
            const v0 = 1 - (row + 0.97) / 4;
            const hw = w / 2;
            const hh = h / 2;
            const cos = Math.cos(rotY);
            const sin = Math.sin(rotY);
            const corners = [
                [
                    -hw,
                    hh,
                    u0,
                    v1
                ],
                [
                    hw,
                    hh,
                    u1,
                    v1
                ],
                [
                    hw,
                    -hh,
                    u1,
                    v0
                ],
                [
                    -hw,
                    -hh,
                    u0,
                    v0
                ]
            ];
            for (const [lx, ly, u, vv] of corners){
                pos.push(cx + lx * cos + outX, cy + ly, cz - lx * sin + outZ);
                nor.push(outX, 0, outZ);
                uv.push(u, vv);
            }
            idx.push(v, v + 1, v + 2, v, v + 2, v + 3);
            v += 4;
        };
        for (const s of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SIGNBOARDS"]){
            const fx = Math.sin(s.rotY);
            const fz = Math.cos(s.rotY);
            quad(s.x, s.y, s.z, s.w, s.h, s.rotY, fx * 0.06, fz * 0.06, s.slot);
            // plain back panel a hair behind, so signs read as real boards
            quad(s.x - fx * 0.05, s.y, s.z - fz * 0.05, s.w, s.h, s.rotY, -fx * 0.06, -fz * 0.06, 15);
        }
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
        g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](pos, 3));
        g.setAttribute('normal', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](nor, 3));
        g.setAttribute('uv', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](uv, 2));
        g.setIndex(idx);
        return g;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>signGeo.dispose(), [
        signGeo
    ]);
    const signMat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const tex = bakeSignAtlas();
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            map: tex,
            emissiveMap: tex,
            emissive: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#ffc98a'),
            emissiveIntensity: 0.05,
            roughness: 0.8,
            metalness: 0,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            signMat.map?.dispose();
            signMat.emissiveMap?.dispose();
            signMat.dispose();
        };
    }, [
        signMat
    ]);
    const signMatRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        signMatRef.current = signMat;
    }, [
        signMat
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        if (signMatRef.current) signMatRef.current.emissiveIntensity = 0.04 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow * 0.5;
    });
    const stripeTex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>bakeStripes(), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>stripeTex.dispose(), [
        stripeTex
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AWNINGS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AWNINGS"][i];
                    m.position.set(a.x, a.y, a.z);
                    m.rotation.set(-0.48, a.rotY, 0, 'YXZ');
                    m.scale.set(a.width, 1.2, 1);
                    color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AWNING_TONES"][a.tone % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AWNING_TONES"].length]);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 656,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        map: stripeTex,
                        roughness: 0.85,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 657,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 649,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: signGeo,
                material: signMat,
                castShadow: true
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 661,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 647,
        columnNumber: 5
    }, this);
}
/* ----------------------------- rooftop clutter ------------------------------- */ /** the Nigerian skyline signature: blue plastic water tanks + TV antennas */ function RooftopClutter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_TANKS"].length,
                setup: (i, m)=>{
                    const t = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_TANKS"][i];
                    m.position.set(t.x, t.y + 0.22, t.z);
                    m.rotation.set(0, i * 0.7, 0);
                    m.scale.set(0.66, 0.44, 0.66);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 679,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8f8b80",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 680,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 673,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_TANKS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const t = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_TANKS"][i];
                    m.position.set(t.x, t.y + 0.9, t.z);
                    m.rotation.set(0, i * 1.3, 0);
                    m.scale.setScalar(1);
                    color.set(i % 5 === 0 ? '#2a3a44' : '#2e6ea3');
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.52,
                            0.56,
                            0.92,
                            9
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 690,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.55,
                        metalness: 0.05
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 691,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 683,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANTENNAS"].length,
                setup: (i, m)=>{
                    const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANTENNAS"][i];
                    m.position.set(a.x, a.y + a.h / 2 + 0.05, a.z);
                    m.rotation.set(0.06 * (i % 3 - 1), 0, 0.05 * (i % 5 - 2));
                    m.scale.set(1, a.h, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.022,
                            0.035,
                            1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 700,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#3a3f42",
                        roughness: 0.6,
                        metalness: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 701,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 694,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANTENNAS"].length,
                setup: (i, m)=>{
                    const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANTENNAS"][i];
                    m.position.set(a.x, a.y + a.h - 0.28, a.z);
                    m.rotation.set(0, i * 0.9, 0);
                    m.scale.set(0.62, 0.03, 0.03);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#4a4f52",
                        roughness: 0.6,
                        metalness: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 711,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 704,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 671,
        columnNumber: 5
    }, this);
}
/* --------------------------------- stalls ----------------------------------- */ function Stalls() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"].length,
                castShadow: true,
                setup: (i, m)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"][i];
                    m.position.set(s.x, s.y + 0.45, s.z);
                    m.rotation.set(0, s.rotY, 0);
                    m.scale.set(2, 0.9, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 733,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#7a5a38",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 734,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 723,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"][i];
                    m.position.set(s.x, s.y + 2.05, s.z);
                    m.rotation.set(0.06, s.rotY, 0);
                    m.scale.set(2.5, 0.1, 1.9);
                    color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALL_TONES"][s.tone]);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 748,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.75,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 749,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 737,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"].length * 2,
                setup: (i, m)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"][Math.floor(i / 2)];
                    const side = i % 2 === 0 ? -0.9 : 0.9;
                    const c = Math.cos(s.rotY);
                    const sn = Math.sin(s.rotY);
                    m.position.set(s.x + side * c, s.y + 1, s.z - side * sn);
                    m.rotation.set(0, 0, 0);
                    m.scale.set(0.09, 2, 0.09);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 764,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#6a5138",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 765,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 752,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 721,
        columnNumber: 5
    }, this);
}
/* -------------- trees — M23 W2: THE GREEN (the species guild) ---------------- */ /**
 * The species-true Kogi guild — one instanced draw call per species. Every
 * tree is a merged, vertex-coloured geometry (flora-species.ts: neem/mango/
 * cashew/shea/oilpalm/raffia/plantain/iroko/baobab/acacia, each with its
 * real silhouette) placed by the clearance-probe engine (flora.ts) under
 * M22-grade laws against the real roads, kerbs, zebras, lamps, parked bays,
 * stalls, buildings, anchors, schools and water. The shared material wraps
 * the W2 flora shader: per-instance wind sway computed in the vertex shader
 * (phase derived from each instance's own world position — zero CPU, no
 * per-frame matrix writes) and the M6 weather reaching the leaves through
 * the shared floraLive uniforms (harmattan golds the crowns, the rain
 * family deepens them lush; the leaf mask keeps the gold off the wood).
 */ /** one species = one InstancedMesh over the cached merged geometry */ function SpeciesMesh({ sp, list, mat, seed }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$species$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSpeciesGeometry"])(sp), [
        sp
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mesh = ref.current;
        if (!mesh) return;
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const sc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const c = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]();
        list.forEach((t, i)=>{
            e.set(0, t.rot, 0);
            q.setFromEuler(e);
            p.set(t.x, t.y, t.z);
            sc.set(t.s, t.s, t.s);
            m.compose(p, q, sc);
            mesh.setMatrixAt(i, m);
            // per-instance character, decided once: a gray jitter with a warm
            // lean on the tone-2 trees — the same tree species reads slightly
            // different across the town, exactly like a real streetscape
            const g = 0.88 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(seed + i * 3.71) * 0.22;
            const warm = t.tone === 2 ? 1.045 : 1;
            c.setRGB(g * warm, g, g * 0.96);
            mesh.setColorAt(i, c);
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [
        list,
        seed
    ]);
    if (list.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
        ref: ref,
        args: [
            geo,
            mat,
            list.length
        ],
        castShadow: true
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 819,
        columnNumber: 10
    }, this);
}
/** school compound trees (schools.ts plants its own) join the guild:
 *  the shade rows read as mango, the gate palms as raffia — same
 *  geometries, same wind, same weather as the town around them. */ const SCHOOL_SPECIES_MAP = {
    tree: 'mango',
    palm: 'raffia',
    acacia: 'acacia',
    baobab: 'baobab'
};
function FloraTrees() {
    // the ONE tree material — vertex colours carry the species palette,
    // the flora shader carries the wind (amp 0.16) and the weather
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            vertexColors: true,
            flatShading: true,
            roughness: 1,
            metalness: 0
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$flora$2d$shader$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyFloraShader"])(m, 0.16);
        return m;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>mat.dispose(), [
        mat
    ]);
    // the guild + the school compounds' own trees, merged per species
    const lists = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const out = {
            neem: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].neem
            ],
            mango: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].mango
            ],
            cashew: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].cashew
            ],
            shea: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].shea
            ],
            oilpalm: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].oilpalm
            ],
            raffia: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].raffia
            ],
            plantain: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].plantain
            ],
            iroko: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].iroko
            ],
            baobab: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].baobab
            ],
            acacia: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLORA_TREES"].acacia
            ]
        };
        let si = 0;
        for (const t of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_TREES"]){
            const sp = SCHOOL_SPECIES_MAP[t.kind] ?? 'mango';
            out[sp].push({
                x: t.x,
                z: t.z,
                y: t.y,
                s: t.scale,
                rot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(9100 + si * 1.37) * Math.PI * 2,
                tone: t.tone % 3
            });
            si++;
        }
        return out;
    }, []);
    // the flora clock — the ONE per-frame writer; its shared uniforms drive
    // the grass in WorldTerrain too (see flora-shader.ts)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, dt)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$flora$2d$shader$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stepFlora"])(dt));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_IDS"].map((sp, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SpeciesMesh, {
                sp: sp,
                list: lists[sp],
                mat: mat,
                seed: 8100 + i * 97
            }, sp, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 879,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 877,
        columnNumber: 5
    }, this);
}
/**
 * The boulders of Patti — half-sunk dodecahedra in the laterite palette,
 * each tilted and squashed by its own deterministic hash so no two read
 * alike. One draw call for the whole scatter.
 */ function Rocks() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
        count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROCKS"].length,
        castShadow: true,
        receiveShadow: true,
        setup: (i, m, color)=>{
            const r = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROCKS"][i];
            m.position.set(r.x, r.y + r.scale * r.squash * 0.42, r.z);
            m.rotation.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 3.7) * 0.5 - 0.25, r.rotY, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 9.1) * 0.5 - 0.25);
            m.scale.set(r.scale * (0.8 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 5.3) * 0.5), r.scale * r.squash, r.scale * (0.9 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 7.7) * 0.4));
            color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROCK_TONES"][r.tone % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROCK_TONES"].length]);
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dodecahedronGeometry", {
                args: [
                    1,
                    0
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 903,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                roughness: 1,
                flatShading: true
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 904,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 892,
        columnNumber: 5
    }, this);
}
/* ---------------------------------- lamps ------------------------------------ */ /**
 * ONE real street lamp body, merged into a single instanced geometry:
 * bolted base flange + collar, tapered pole and a top stub collar the
 * swan-neck arm bolts onto. `tall` = highway mast. Local frame: arm
 * reaches +Z; instances rotate by the lamp's rotY. The arm itself is a
 * SEPARATE unit-length instanced tube so each lamp's outreach bracket
 * can grow with its setback (LampDef.reach) — exactly how real
 * outer-rim masts on wide carriageways carry longer arms.
 */ function buildLampBody(tall) {
    const h = tall ? 5.1 : 3.8;
    const rT = tall ? 0.07 : 0.055;
    const rB = tall ? 0.105 : 0.085;
    const parts = [];
    // bolted base flange + weathering collar
    const base = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](rB * 1.9, rB * 2.3, 0.22, 8);
    base.translate(0, 0.11, 0);
    parts.push(base);
    const collar = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](rB * 1.35, rB * 1.65, 0.18, 8);
    collar.translate(0, 0.32, 0);
    parts.push(collar);
    // tapered pole
    const pole = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](rT, rB, h, 8);
    pole.translate(0, h / 2, 0);
    parts.push(pole);
    // stub collar where the outreach arm bolts on
    const stub = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](rT * 1.5, rT * 1.5, 0.14, 8);
    stub.translate(0, h - 0.02, 0);
    parts.push(stub);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(parts);
}
/**
 * The swan-neck outreach arm as a UNIT-length tube (0..1 along +Z):
 * rises off the pole collar, levels out over the carriageway. Instances
 * scale Z by the lamp's reach so a far-setback mast still hangs its lens
 * over the tarmac. Y is untouched by the stretch — the head height law
 * (4.55 / 5.45) holds for every lamp.
 */ function buildLampArm(tall) {
    const h = tall ? 5.1 : 3.8;
    const headY = tall ? 5.45 : 4.55;
    const curve = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CatmullRomCurve3"]([
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, h - 0.08, 0),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, h + (tall ? 0.42 : 0.4), 0.26),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, headY - 0.05, 0.66),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, headY - 0.08, 1.0)
    ]);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TubeGeometry"](curve, 12, tall ? 0.05 : 0.042, 6, false);
}
/**
 * Street lights: bolted flange + tapered pole + swan-neck arm reaching
 * OVER the carriageway (each lamp's bracket grows with its setback) +
 * luminaire housing with a sodium lens that glows at night + a warm
 * pool of light on the road under the head. Highway masts are taller
 * with a longer reach. All instanced — 9 draw calls for the whole
 * town's lighting.
 */ function Lamps() {
    const glowRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const glowRefMast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const poolRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const poolTex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>bakeGlowPool(), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>poolTex.dispose(), [
        poolTex
    ]);
    const poles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"].filter((l)=>!l.tall), []);
    const masts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"].filter((l)=>l.tall), []);
    const headAt = (l)=>[
            l.x + Math.sin(l.rotY) * l.reach,
            l.y + (l.tall ? 5.45 : 4.55),
            l.z + Math.cos(l.rotY) * l.reach
        ];
    const geos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            poleBody: buildLampBody(false),
            mastBody: buildLampBody(true),
            poleArm: buildLampArm(false),
            mastArm: buildLampArm(true),
            poleFix: (()=>{
                const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.5, 0.13, 0.26);
                g.rotateX(0.09);
                return g;
            })(),
            mastFix: (()=>{
                const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.62, 0.13, 0.3);
                g.rotateX(0.09);
                return g;
            })()
        }), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>{
            Object.values(geos).forEach((g)=>g.dispose());
        }, [
        geos
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow;
        if (glowRef.current) glowRef.current.emissiveIntensity = 0.1 + g * 2.6;
        if (glowRefMast.current) glowRefMast.current.emissiveIntensity = 0.1 + g * 2.6;
        if (poolRef.current) poolRef.current.opacity = g * 0.55;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            [
                {
                    arr: poles,
                    geo: geos.poleBody
                },
                {
                    arr: masts,
                    geo: geos.mastBody
                }
            ].map((grp, gi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                    count: grp.arr.length,
                    castShadow: true,
                    setup: (i, m)=>{
                        const l = grp.arr[i];
                        m.position.set(l.x, l.y, l.z);
                        m.rotation.set(0, l.rotY, 0);
                        m.scale.set(1, 1, 1);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                            object: grp.geo,
                            attach: "geometry"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1015,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#33383a",
                            roughness: 0.55,
                            metalness: 0.65
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1016,
                            columnNumber: 11
                        }, this)
                    ]
                }, `body-${gi}`, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1004,
                    columnNumber: 9
                }, this)),
            [
                {
                    arr: poles,
                    geo: geos.poleArm
                },
                {
                    arr: masts,
                    geo: geos.mastArm
                }
            ].map((grp, gi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                    count: grp.arr.length,
                    setup: (i, m)=>{
                        const l = grp.arr[i];
                        m.position.set(l.x, l.y, l.z);
                        m.rotation.set(0, l.rotY, 0);
                        m.scale.set(1, 1, l.reach);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                            object: grp.geo,
                            attach: "geometry"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1034,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#33383a",
                            roughness: 0.55,
                            metalness: 0.65
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1035,
                            columnNumber: 11
                        }, this)
                    ]
                }, `arm-${gi}`, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1024,
                    columnNumber: 9
                }, this)),
            [
                {
                    arr: poles,
                    geo: geos.poleFix,
                    head: 4.55
                },
                {
                    arr: masts,
                    geo: geos.mastFix,
                    head: 5.45
                }
            ].map((grp, gi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                    count: grp.arr.length,
                    castShadow: true,
                    setup: (i, m)=>{
                        const l = grp.arr[i];
                        m.position.set(l.x + Math.sin(l.rotY) * l.reach, l.y + grp.head - 0.1, l.z + Math.cos(l.rotY) * l.reach);
                        m.rotation.set(0, l.rotY, 0);
                        m.scale.set(1, 1, 1);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                            object: grp.geo,
                            attach: "geometry"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1058,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#2c3134",
                            roughness: 0.5,
                            metalness: 0.7
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1059,
                            columnNumber: 11
                        }, this)
                    ]
                }, `fix-${gi}`, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1043,
                    columnNumber: 9
                }, this)),
            [
                {
                    arr: poles,
                    head: 4.55,
                    w: 0.2
                },
                {
                    arr: masts,
                    head: 5.45,
                    w: 0.24
                }
            ].map((grp, gi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                    count: grp.arr.length,
                    setup: (i, m)=>{
                        const l = grp.arr[i];
                        m.position.set(l.x + Math.sin(l.rotY) * l.reach, l.y + grp.head - 0.185, l.z + Math.cos(l.rotY) * l.reach);
                        m.rotation.set(0, l.rotY, 0);
                        m.scale.set(1, 1, 1);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.42,
                                0.04,
                                grp.w
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1081,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            ref: gi === 0 ? glowRef : glowRefMast,
                            color: "#ffe9c0",
                            emissive: "#ffca7a",
                            emissiveIntensity: 0.1
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1082,
                            columnNumber: 11
                        }, this)
                    ]
                }, `lens-${gi}`, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1067,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"].length,
                setup: (i, m)=>{
                    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"][i];
                    const [hx, , hz] = headAt(l);
                    m.position.set(hx, l.y + 0.09, hz);
                    m.rotation.set(-Math.PI / 2, 0, 0);
                    m.scale.setScalar(l.tall ? 1.3 : 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                        args: [
                            2.4,
                            18
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1096,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        ref: poolRef,
                        color: "#ffb45c",
                        map: poolTex,
                        transparent: true,
                        opacity: 0,
                        depthWrite: false,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdditiveBlending"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1097,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1086,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 998,
        columnNumber: 5
    }, this);
}
/* ------------------------------ compound life --------------------------------- */ /**
 * Fenced family compounds: low plaster walls with coping gaps for the
 * gates, swung-open gate leaves and lines of washing between posts —
 * the everyday texture of a Nigerian neighbourhood. All visual-only.
 */ function CompoundLife() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALL_SEGMENTS"].length,
                castShadow: true,
                receiveShadow: true,
                setup: (i, m, color)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALL_SEGMENTS"][i];
                    m.position.set(s.x, s.y + 0.46, s.z);
                    m.rotation.set(0, s.rotY, 0);
                    m.scale.set(s.len, 0.92, 0.26);
                    color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALL_TONES"][s.tone % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALL_TONES"].length]).multiplyScalar(0.86);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GATE_LEAVES"].length,
                castShadow: true,
                setup: (i, m)=>{
                    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GATE_LEAVES"][i];
                    m.position.set(g.x, g.y + 0.78, g.z);
                    m.rotation.set(0, g.rotY, 0);
                    m.scale.set(1.05, 1.56, 0.07);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#4a3a28",
                        roughness: 0.9,
                        metalness: 0.05
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAUNDRY_LINES"].length * 2,
                setup: (i, m)=>{
                    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAUNDRY_LINES"][Math.floor(i / 2)];
                    const first = i % 2 === 0;
                    const x = first ? l.x1 : l.x2;
                    const z = first ? l.z1 : l.z2;
                    m.position.set(x, l.y - 0.89, z);
                    m.rotation.set(0, 0, first ? 0.02 : -0.02);
                    m.scale.set(1, 1, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.045,
                            0.055,
                            1.82,
                            5
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#7a6a4a",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAUNDRY_LINES"].length,
                setup: (i, m)=>{
                    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAUNDRY_LINES"][i];
                    const dx = l.x2 - l.x1;
                    const dz = l.z2 - l.z1;
                    const len = Math.hypot(dx, dz) || 1;
                    m.position.set((l.x1 + l.x2) / 2, l.y - 0.04, (l.z1 + l.z2) / 2);
                    m.quaternion.setFromUnitVectors(UP_VEC, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](dx / len, 0, dz / len));
                    m.scale.set(1, len, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.016,
                            0.016,
                            1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#cfc9b8",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAUNDRY_LINES"].length * 3,
                castShadow: true,
                setup: (i, m, color)=>{
                    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAUNDRY_LINES"][Math.floor(i / 3)];
                    const k = i % 3;
                    const t = 0.24 + k * 0.26;
                    m.position.set(l.x1 + (l.x2 - l.x1) * t, l.y - 0.3, l.z1 + (l.z2 - l.z1) * t);
                    m.rotation.set(0, Math.atan2(l.x2 - l.x1, l.z2 - l.z1) + (k - 1) * 0.12, 0.04 * (k - 1));
                    m.scale.set(0.42, 0.5, 1);
                    color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLOTH_TONES"][(i * 5 + k * 3) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLOTH_TONES"].length]);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 1,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1169,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1120,
        columnNumber: 5
    }, this);
}
/* ------------------------------ utility lines --------------------------------- */ /**
 * NEPA poles with crossarms and sagging wires — the iconic skyline
 * tangle. Poles + arms are instanced; every wire span is sampled into
 * ONE LineSegments geometry (2 conductors per span, no per-frame work).
 */ function UtilityLines() {
    const wireGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const pts = [];
        const SAMPLES = 7;
        for (const s of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WIRE_SPANS"]){
            const dx = s.bx - s.ax;
            const dz = s.bz - s.az;
            const len = Math.hypot(dx, dz) || 1;
            const px = -dz / len;
            const pz = dx / len;
            for (const off of [
                -0.55,
                0.55
            ]){
                // THE WIRE IS THE TRUE CATENARY — sampled per span, zero per-frame cost
                const L = len;
                const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$catenary$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catenaryA"])(L, s.sag);
                const endCosh = Math.cosh(L / (2 * a));
                let prevX = s.ax + px * off;
                let prevY = s.ay;
                let prevZ = s.az + pz * off;
                for(let k = 1; k <= SAMPLES; k++){
                    const t = k / SAMPLES;
                    const dip = a * endCosh - a * Math.cosh((t - 0.5) * L / a);
                    const cx = s.ax + dx * t + px * off;
                    const cy = s.ay + (s.by - s.ay) * t - dip;
                    const cz = s.az + dz * t + pz * off;
                    pts.push(prevX, prevY, prevZ, cx, cy, cz);
                    prevX = cx;
                    prevY = cy;
                    prevZ = cz;
                }
            }
        }
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
        g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](pts, 3));
        return g;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>wireGeo.dispose(), [
        wireGeo
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UTILITY_POLES"].length,
                castShadow: true,
                setup: (i, m)=>{
                    const p = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UTILITY_POLES"][i];
                    m.position.set(p.x, p.y + 2.75, p.z);
                    m.rotation.set(0, 0, 0.015 * (i % 5 - 2));
                    m.scale.set(1, 1, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.1,
                            0.14,
                            5.5,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#4d4238",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1238,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UTILITY_POLES"].length,
                setup: (i, m)=>{
                    const p = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UTILITY_POLES"][i];
                    m.position.set(p.x, p.y + 5.18, p.z);
                    m.rotation.set(0, p.rotY, 0);
                    m.scale.set(1.8, 0.09, 0.09);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#3c352c",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineSegments", {
                geometry: wireGeo,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("lineBasicMaterial", {
                    color: "#22262a",
                    transparent: true,
                    opacity: 0.75
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1252,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1251,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1230,
        columnNumber: 5
    }, this);
}
/* ------------------------------ street plates ------------------------------- */ /**
 * THE STREET NAME PLATES (W1) — blue municipal plates at the junction
 * mouths of the real-named OSM streets (Lugard Road, Ibb way…). ONE
 * canvas atlas carries every unique name (power-of-two rows); each plate
 * plane picks its slot through remapped UVs, so the whole fleet of plates
 * is ONE merged draw call. Posts are instanced. Names render exactly as
 * the survey spelled them, uppercased the way Nigerian plates are.
 */ function StreetPlates() {
    const built = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STREET_PLATES"].length) return null;
        const names = [
            ...new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STREET_PLATES"].map((p)=>p.name.toUpperCase()))
        ];
        const W = 512;
        const ROW = 48;
        const rows = names.length;
        const H = Math.max(64, 2 ** Math.ceil(Math.log2(rows * ROW)));
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#14418f'; // municipal steel blue
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#e9e5d8';
        ctx.lineWidth = 3;
        ctx.font = '700 30px "Outfit", "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const slotOf = new Map();
        names.forEach((name, i)=>{
            const y = i * ROW;
            ctx.strokeRect(5, y + 5, W - 10, ROW - 10);
            ctx.fillStyle = '#f4f1e6';
            ctx.fillText(name, W / 2, y + ROW / 2 + 1, W - 24);
            slotOf.set(name, i);
        });
        const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
        tex.anisotropy = 4;
        tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
        // merged plate planes with atlas UVs
        const planes = [];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const uvAttr = (g, i)=>{
            const v0 = 1 - (i + 1) * ROW / H;
            const v1 = 1 - i * ROW / H;
            const uv = g.getAttribute('uv');
            // plane uv rows: (0,1) (1,1) (0,0) (1,0) — remap v
            uv.setXY(0, 0, v1);
            uv.setXY(1, 1, v1);
            uv.setXY(2, 0, v0);
            uv.setXY(3, 1, v0);
        };
        for (const pl of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STREET_PLATES"]){
            const slot = slotOf.get(pl.name.toUpperCase());
            if (slot === undefined) continue;
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.9, 0.44);
            uvAttr(g, slot);
            e.set(0, pl.rotY, 0);
            q.setFromEuler(e);
            p.set(pl.x, pl.y + 1.52, pl.z);
            m.compose(p, q, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1));
            g.applyMatrix4(m);
            planes.push(g);
        }
        const plateGeo = planes.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(planes) : null;
        return {
            tex,
            plateGeo,
            count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STREET_PLATES"].length
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!built) return;
        return ()=>{
            built.tex.dispose();
            built.plateGeo?.dispose();
        };
    }, [
        built
    ]);
    if (!built || !built.plateGeo) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.plateGeo,
                castShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: built.tex,
                    roughness: 0.55,
                    metalness: 0.05,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1340,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1339,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: built.count,
                castShadow: true,
                setup: (i, mat)=>{
                    const pl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$plates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STREET_PLATES"][i];
                    mat.position.set(pl.x, pl.y + 0.72, pl.z);
                    mat.rotation.set(0, 0, 0);
                    mat.scale.set(1, 1, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.035,
                            0.05,
                            1.5,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1348,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#5a6166",
                        roughness: 0.7,
                        metalness: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1349,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1342,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1338,
        columnNumber: 5
    }, this);
}
/* ------------------------------ traffic lights ------------------------------ */ /**
 * W3 — THE SIGNALS. One mast per top junction mouth, three unlit lamp
 * discs (red / amber / green, vertical — the Nigerian head). The phase
 * comes from THE PHASE LAW (junctions.ts: green 12s → amber 3s → red
 * 15s, position-hashed offset per junction) evaluated on a running world
 * clock. Instance colours are rewritten ONLY when a light changes phase
 * — between changes the loop does 12 comparisons and nothing else.
 */ const LAMP_ON = {
    red: '#ff4432',
    amber: '#ffb324',
    green: '#3ce05a'
};
const LAMP_OFF = {
    red: '#3a1512',
    amber: '#392c10',
    green: '#123a18'
};
const LAMP_ORDER = [
    'red',
    'amber',
    'green'
];
const LAMP_Y = [
    3.24,
    2.96,
    2.68
] // vertical head: red top, amber, green
;
const SCRATCH_COLOR = {
    red: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](),
    amber: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](),
    green: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]()
};
function TrafficLights() {
    const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lampRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([
        null,
        null,
        null
    ]);
    const lastPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"].map(()=>-1));
    const didSetup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const mastGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // mast pole + head box, one merged unit per light (instanced)
        const parts = [];
        const pole = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.07, 0.1, 3.6, 6);
        pole.translate(0, 1.8, 0);
        parts.push(pole);
        const head = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.38, 1.0, 0.22);
        head.translate(0.18, 2.95, 0); // the head hangs on the road side of the mast
        parts.push(head);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(parts);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>mastGeo?.dispose(), [
        mastGeo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, dt)=>{
        clock.current += Math.min(dt, 0.1);
        if (!lampRefs.current[0]) return;
        // lamp positions: each light's three discs sit on the head face —
        // set once on the first live frame (the refs live only in this loop)
        if (!didSetup.current) {
            didSetup.current = true;
            const o = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Object3D"]();
            for(let k = 0; k < 3; k++){
                const mesh = lampRefs.current[k];
                if (!mesh) continue;
                for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"].length; i++){
                    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"][i];
                    const cos = Math.cos(l.rotY);
                    const sin = Math.sin(l.rotY);
                    // local head coords (0.16 side, 0.14 face) → world via the rotY frame
                    o.position.set(l.x + 0.16 * cos + 0.14 * sin, l.y + LAMP_Y[k], l.z - 0.16 * sin + 0.14 * cos);
                    o.updateMatrix();
                    mesh.setMatrixAt(i, o.matrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            }
        }
        let dirty = false;
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"].length; i++){
            const ph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lightPhaseAt"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"][i].offset, clock.current);
            const code = ph === 'green' ? 2 : ph === 'amber' ? 1 : 0;
            if (lastPhase.current[i] === code) continue;
            lastPhase.current[i] = code;
            dirty = true;
            // lamp k is ON iff k === the active phase's code
            for(let k = 0; k < 3; k++){
                const mesh = lampRefs.current[k];
                if (!mesh) continue;
                const kind = LAMP_ORDER[k];
                SCRATCH_COLOR[kind].set(k === code ? LAMP_ON[kind] : LAMP_OFF[kind]);
                mesh.setColorAt(i, SCRATCH_COLOR[kind]);
            }
        }
        if (dirty) {
            for (const mesh of lampRefs.current){
                if (!mesh) continue;
                const ic = mesh.instanceColor;
                if (ic) ic.needsUpdate = true;
            }
        }
    });
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"].length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"].length,
                castShadow: true,
                setup: (i, m)=>{
                    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"][i];
                    m.position.set(l.x, l.y, l.z);
                    m.rotation.set(0, l.rotY, 0);
                    m.scale.set(1, 1, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                        object: mastGeo,
                        attach: "geometry"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1451,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#3a4046",
                        roughness: 0.7,
                        metalness: 0.35
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1452,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1445,
                columnNumber: 7
            }, this),
            LAMP_ORDER.map((kind, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                    ref: (mesh)=>{
                        lampRefs.current[k] = mesh;
                    },
                    args: [
                        undefined,
                        undefined,
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LIGHTS"].length
                    ],
                    frustumCulled: false,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.12,
                                10,
                                10
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1462,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {}, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1463,
                            columnNumber: 11
                        }, this)
                    ]
                }, kind, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1456,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1444,
        columnNumber: 5
    }, this);
}
/* ------------------------------- danfo stops -------------------------------- */ /**
 * W3 — THE DANFO STOPS: yellow shelter (4 posts + striped roof + bench)
 * and a painted "DANFO STOP" board at the transit bays. Shelter boxes
 * merge to ONE draw call; the boards share one canvas texture; posts are
 * instanced.
 */ function DanfoStops() {
    const built = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DANFO_STOPS"].length) return null;
        const shelter = [];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1);
        const box = (w, h, d)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](w, h, d);
        for (const st of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DANFO_STOPS"]){
            e.set(0, st.rotY, 0);
            q.setFromEuler(e);
            // roof: yellow slab with a dark under-stripe
            p.set(st.x, st.y + 2.16, st.z);
            m.compose(p, q, s);
            const roof = box(2.7, 0.09, 1.25);
            roof.applyMatrix4(m);
            shelter.push(roof);
            p.set(st.x, st.y + 2.02, st.z);
            m.compose(p, q, s);
            const stripe = box(2.7, 0.07, 1.25);
            stripe.applyMatrix4(m);
            shelter.push(stripe);
            // bench across the back
            const bx2 = st.x - Math.sin(st.rotY) * 0.42;
            const bz2 = st.z - Math.cos(st.rotY) * 0.42;
            p.set(bx2, st.y + 0.45, bz2);
            m.compose(p, q, s);
            const bench = box(2.2, 0.09, 0.4);
            bench.applyMatrix4(m);
            shelter.push(bench);
            p.set(bx2, st.y + 0.24, bz2);
            m.compose(p, q, s);
            const benchFront = box(2.2, 0.42, 0.09);
            benchFront.applyMatrix4(m);
            shelter.push(benchFront);
        }
        // THE BOARD — one shared canvas, all stops read from it
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e2b33c';
        ctx.fillRect(0, 0, 256, 96);
        ctx.strokeStyle = '#1c2b4a';
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, 248, 88);
        ctx.fillStyle = '#1c2b4a';
        ctx.font = '800 30px "Outfit", "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DANFO STOP', 128, 50);
        const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
        tex.anisotropy = 4;
        tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
        const boards = [];
        for (const st of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DANFO_STOPS"]){
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.5, 0.56);
            const facing = st.rotY + Math.PI // faces the carriageway
            ;
            e.set(0, facing, 0);
            q.setFromEuler(e);
            p.set(st.x, st.y + 1.62, st.z);
            m.compose(p, q, s);
            g.applyMatrix4(m);
            boards.push(g);
        }
        return {
            shelter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(shelter),
            boards: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(boards),
            tex,
            count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DANFO_STOPS"].length
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!built) return;
        return ()=>{
            built.shelter.dispose();
            built.boards.dispose();
            built.tex.dispose();
        };
    }, [
        built
    ]);
    if (!built) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.shelter,
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2b33c",
                    roughness: 0.75,
                    metalness: 0.05
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1564,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1563,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.boards,
                castShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: built.tex,
                    roughness: 0.6,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1567,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1566,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: built.count * 5,
                castShadow: true,
                setup: (i, mat)=>{
                    const st = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DANFO_STOPS"][Math.floor(i / 5)];
                    const k = i % 5;
                    // 4 shelter posts (corners of the 2.7×1.25 slab) + 1 board post
                    if (k < 4) {
                        const sx2 = (k % 2 === 0 ? -1 : 1) * 1.2;
                        const sz2 = k < 2 ? -0.5 : 0.5;
                        mat.position.set(st.x + Math.sin(st.rotY) * sz2 + -Math.cos(st.rotY) * sx2, st.y + 1.05, st.z + Math.cos(st.rotY) * sz2 + Math.sin(st.rotY) * sx2);
                    } else {
                        const bx2 = st.x - Math.sin(st.rotY) * 1.55;
                        const bz2 = st.z - Math.cos(st.rotY) * 1.55;
                        mat.position.set(bx2, st.y + 0.8, bz2);
                    }
                    mat.rotation.set(0, 0, 0);
                    mat.scale.set(1, 1, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.045,
                            0.055,
                            2.1,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1589,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#4a4f55",
                        roughness: 0.6,
                        metalness: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1590,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1569,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1562,
        columnNumber: 5
    }, this);
}
/* ------------------------------ street furniture ------------------------------ */ /** road signs, keke-stop shelters, market crates, tire stacks, water drums */ function StreetProps() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_SIGNS"].length,
                setup: (i, m)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_SIGNS"][i];
                    m.position.set(s.x, s.y + 1.05, s.z);
                    m.rotation.set(0, 0, 0.03 * (i % 3 - 1));
                    m.scale.set(1, 1, 1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.045,
                            0.06,
                            2.1,
                            5
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a8f94",
                        roughness: 0.6,
                        metalness: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1610,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1603,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_SIGNS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_SIGNS"][i];
                    m.position.set(s.x, s.y + 1.95, s.z);
                    m.rotation.set(0, s.rotY, 0);
                    m.scale.set(1.0, 0.62, 0.07);
                    color.set([
                        '#1b7a43',
                        '#1f4f8e',
                        '#d8d6c8'
                    ][s.kind % 3]);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1620,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1621,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1613,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"].length * 4,
                setup: (i, m)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"][Math.floor(i / 4)];
                    const k = i % 4;
                    const cos = Math.cos(s.rotY);
                    const sin = Math.sin(s.rotY);
                    if (k < 2) {
                        // roof posts at the front corners
                        const lx = k === 0 ? -1.35 : 1.35;
                        m.position.set(s.x + lx * cos, s.y + 1.12, s.z - lx * sin);
                        m.rotation.set(0, s.rotY, 0);
                        m.scale.set(0.14, 2.24, 0.14);
                    } else {
                        // bench legs tucked under the back
                        const lx = k === 2 ? -1.0 : 1.0;
                        m.position.set(s.x + lx * cos - 0.55 * sin, s.y + 0.28, s.z - lx * sin - 0.55 * cos);
                        m.rotation.set(0, s.rotY, 0);
                        m.scale.set(0.12, 0.56, 0.45);
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1644,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#4a5248",
                        roughness: 0.85
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1645,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1625,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"][i];
                    m.position.set(s.x - 0.1 * Math.sin(s.rotY), s.y + 2.34, s.z - 0.1 * Math.cos(s.rotY));
                    m.rotation.set(0, s.rotY, 0.05);
                    m.scale.set(3.4, 0.13, 2.0);
                    color.set([
                        '#2e7d5b',
                        '#c94f2e'
                    ][s.tone % 2]);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1655,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1656,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1648,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"].length,
                castShadow: true,
                setup: (i, m)=>{
                    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"][i];
                    m.position.set(s.x - 0.55 * Math.sin(s.rotY), s.y + 0.58, s.z - 0.55 * Math.cos(s.rotY));
                    m.rotation.set(0, s.rotY, 0);
                    m.scale.set(2.5, 0.1, 0.5);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1665,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a6a44",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1666,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1659,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRATES"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const c = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CRATES"][i];
                    m.position.set(c.x, c.y, c.z);
                    m.rotation.set(0, c.rotY, 0.03 * (i % 3 - 1));
                    m.scale.set(0.55 * c.s, 0.36 * c.s, 0.42 * c.s);
                    color.set('#a3703c').multiplyScalar(0.88 + i % 4 * 0.06);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1678,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1670,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BASKETS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const b = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BASKETS"][i];
                    m.position.set(b.x, b.y, b.z);
                    m.rotation.set(0, i * 0.9, 0);
                    m.scale.setScalar(b.s);
                    color.set(i % 3 === 0 ? '#b8924a' : '#c9a458');
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.34,
                            0.24,
                            0.48,
                            7
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1688,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 1,
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1689,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1681,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIRES"].length,
                castShadow: true,
                setup: (i, m)=>{
                    const t = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIRES"][i];
                    m.position.set(t.x, t.y, t.z);
                    m.rotation.set(Math.PI / 2, 0, i * 0.5);
                    m.scale.setScalar(1);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            0.34,
                            0.13,
                            6,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1698,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#242424",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1699,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1692,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BARRELS"].length,
                castShadow: true,
                setup: (i, m, color)=>{
                    const b = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BARRELS"][i];
                    m.position.set(b.x, b.y, b.z);
                    m.rotation.set(0, i * 1.1, 0);
                    m.scale.set(1, 1, 1);
                    color.set([
                        '#2e6ea3',
                        '#c94f2e',
                        '#3a7a52'
                    ][b.tone % 3]);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.32,
                            0.32,
                            0.78,
                            9
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1709,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.6,
                        metalness: 0.05
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1710,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1702,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1601,
        columnNumber: 5
    }, this);
}
/* ----------------------------- landmark structures ---------------------------- */ function ConfluenceDeck(a) {
    const flagRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        if (flagRef.current) flagRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 2.2) * 0.28;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x,
            a.y,
            a.z
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.22,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            5.4,
                            5.9,
                            0.44,
                            10
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1727,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a6a44",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1728,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1726,
                columnNumber: 7
            }, this),
            Array.from({
                length: 10
            }).map((_, i)=>{
                const ang = i / 10 * Math.PI * 2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        Math.cos(ang) * 5.2,
                        0.85,
                        Math.sin(ang) * 5.2
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.16,
                                1,
                                0.16
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1735,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#6a5138",
                            roughness: 1
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1736,
                            columnNumber: 13
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1734,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    3.4,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.06,
                            0.08,
                            6.4,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1742,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#c8c8c8",
                        metalness: 0.6,
                        roughness: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1743,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1741,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: flagRef,
                position: [
                    0.9,
                    5.6,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    1.7,
                                    1.1,
                                    0.05
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 1747,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#f4f4ee",
                                roughness: 0.8
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 1748,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1746,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.38,
                            0.001
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    1.7,
                                    0.37,
                                    0.052
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 1751,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#1a7a3c",
                                roughness: 0.8
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 1752,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1750,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            -0.38,
                            0.001
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    1.7,
                                    0.37,
                                    0.052
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 1755,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#1a7a3c",
                                roughness: 0.8
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 1756,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1754,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1745,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Canoe, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1760,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1724,
        columnNumber: 5
    }, this);
}
function Canoe() {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        if (ref.current) {
            ref.current.position.y = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.18 + Math.sin(s.clock.elapsedTime * 1.3) * 0.08;
            ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.1) * 0.04;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: ref,
        position: [
            6.2,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.18,
            10.5
        ],
        rotation: [
            0,
            0.7,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            0.42,
                            3.2,
                            4,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1776,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#5a4028",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1777,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1775,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.18,
                    0
                ],
                scale: [
                    0.62,
                    0.5,
                    1
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            0.4,
                            2.6,
                            4,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1780,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#3a2a1a",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1781,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1779,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1774,
        columnNumber: 5
    }, this);
}
function PattiTower(a) {
    const beaconRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        if (beaconRef.current) {
            const blink = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow > 0.4 ? Math.sin(s.clock.elapsedTime * 3.4) > 0 ? 1 : 0.15 : 0.15;
            beaconRef.current.emissiveIntensity = blink * 2.2;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x,
            a.y,
            a.z
        ],
        children: [
            Array.from({
                length: 3
            }).map((_, i)=>{
                const ang = i / 3 * Math.PI * 2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        Math.cos(ang) * 0.85,
                        4.4,
                        Math.sin(ang) * 0.85
                    ],
                    rotation: [
                        Math.sin(ang) * 0.09,
                        0,
                        -Math.cos(ang) * 0.09
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.07,
                                0.1,
                                8.8,
                                5
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1802,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#b03a2e",
                            roughness: 0.7,
                            metalness: 0.3
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1803,
                            columnNumber: 13
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1801,
                    columnNumber: 11
                }, this);
            }),
            [
                2.2,
                4.4,
                6.6
            ].map((y, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        y,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                            args: [
                                0.72 - i * 0.12,
                                0.045,
                                6,
                                14
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1809,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#b03a2e",
                            roughness: 0.7,
                            metalness: 0.3
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1810,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1808,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    9,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.22,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1815,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ref: beaconRef,
                        color: "#ff5040",
                        emissive: "#ff3020",
                        emissiveIntensity: 0.15
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1816,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1814,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    4.2,
                    1,
                    -3
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            2.6,
                            2,
                            2.2
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1820,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#cbb682",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1821,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1819,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    4.2,
                    2.2,
                    -3
                ],
                rotation: [
                    0,
                    Math.PI / 4,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            2,
                            1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1824,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a4a2a",
                        roughness: 0.9,
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1825,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1823,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1796,
        columnNumber: 5
    }, this);
}
function JunctionRoundabout(a) {
    // W3 — THE CIRCULATORY LAW: a real annulus carriageway (ring 3.0–5.0)
    // with a kerbed planted island, and YIELD LINES — three white dashes
    // fanned at each of the four entries, angled against the flow. The old
    // stub was a flat disc with a signpost; a roundabout without yield
    // lines is a decoration, not a junction.
    const yieldGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const dashes = [];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1);
        for(let qy = 0; qy < 4; qy++){
            const ang = qy * Math.PI / 2 + 0.4;
            for(let d = 0; d < 3; d++){
                const r = 5.5 + d * 0.62;
                p.set(Math.sin(ang) * r, 0.215, Math.cos(ang) * r);
                e.set(-Math.PI / 2, ang + Math.PI / 2 + 0.5, 0);
                q.setFromEuler(e);
                m.compose(p, q, s);
                const dash = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.62, 0.13);
                dash.applyMatrix4(m);
                dashes.push(dash);
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(dashes);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>yieldGeo?.dispose(), [
        yieldGeo
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x,
            a.y,
            a.z
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.2,
                    0
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ringGeometry", {
                        args: [
                            3.0,
                            5.0,
                            30
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1864,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#43464a",
                        roughness: 0.96
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1865,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1863,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.245,
                    0
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ringGeometry", {
                        args: [
                            2.72,
                            3.0,
                            30
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1869,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b3ad9f",
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1870,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1868,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.3,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            2.72,
                            2.8,
                            0.34,
                            30
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1874,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#7d8f4e",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1875,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1873,
                columnNumber: 7
            }, this),
            yieldGeo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: yieldGeo,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ddd8c4",
                    roughness: 0.85,
                    polygonOffset: true,
                    polygonOffsetFactor: -2
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1880,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1879,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.9,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.09,
                            0.11,
                            3.8,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1885,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#4a5248",
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1886,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1884,
                columnNumber: 7
            }, this),
            [
                0.4,
                1.9,
                3.3
            ].map((y, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0.55,
                        y,
                        0
                    ],
                    rotation: [
                        0,
                        i * 2.1,
                        0
                    ],
                    castShadow: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                1.1,
                                0.3,
                                0.08
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1890,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: [
                                '#e8a317',
                                '#1b7a43',
                                '#c4562a'
                            ][i],
                            roughness: 0.7
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1891,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1889,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1861,
        columnNumber: 5
    }, this);
}
function SuyaGrill(a) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x + 3.2,
            a.y,
            a.z - 2
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.5,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1.6,
                            1,
                            0.8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1903,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#3a3a3a",
                        roughness: 0.9,
                        metalness: 0.3
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1904,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1902,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.02,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1.3,
                            0.08,
                            0.6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1907,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e05a28",
                        emissive: "#c43a10",
                        emissiveIntensity: 0.55
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1908,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1906,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    2.5,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            1.9,
                            1,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1912,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#c94f2e",
                        roughness: 0.8,
                        flatShading: true,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1913,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1911,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.7,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            0.05,
                            0.05,
                            2,
                            5
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1916,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#6a5138"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1917,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1915,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1900,
        columnNumber: 5
    }, this);
}
function Monument(a) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x,
            a.y,
            a.z
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.3,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            3.4,
                            0.6,
                            3.4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1927,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b9b2a2",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1928,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1926,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    2.6,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.9,
                            4.2,
                            0.9
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1931,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#d8d2c2",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1932,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1930,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    4.9,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            0.75,
                            0.7,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1935,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a6a3b",
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1936,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1934,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1925,
        columnNumber: 5
    }, this);
}
function GatePosts(a) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x,
            a.y,
            a.z
        ],
        children: [
            [
                -3,
                3
            ].map((x, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        x,
                        0,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                1.5,
                                0
                            ],
                            castShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        0.8,
                                        3,
                                        0.8
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 1948,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#d8cbb0",
                                    roughness: 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 1949,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1947,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                3.15,
                                0
                            ],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                                    args: [
                                        0.62,
                                        0.5,
                                        4
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 1952,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#5C6E3A",
                                    roughness: 0.8,
                                    flatShading: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 1953,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1951,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1946,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    2.2,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            5.4,
                            0.5,
                            0.3
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1958,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#5C6E3A",
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1959,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1957,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1944,
        columnNumber: 5
    }, this);
}
/**
 * Lord Lugard's Rest House — the colonial bungalow on Patti's summit
 * (the real hilltop is where the 1900-era administrator overlooked the
 * confluence). White walls, wide shaded veranda, flag pole.
 */ function LugardRestHouse(a) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            a.x - 6.5,
            a.y,
            a.z + 4.5
        ],
        rotation: [
            0,
            0.5,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.5,
                    0
                ],
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            7,
                            3,
                            5
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1974,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#f2ead8",
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1975,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1973,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    3.7,
                    0
                ],
                rotation: [
                    0,
                    Math.PI / 4,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            5.4,
                            1.8,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1979,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#6e4530",
                        roughness: 0.85,
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1980,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1978,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.32,
                    3.4
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            7.6,
                            0.3,
                            2.6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1984,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b9a06a",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1985,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1983,
                columnNumber: 7
            }, this),
            [
                -3,
                -1,
                1,
                3
            ].map((px)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        px,
                        1.75,
                        4.5
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.18,
                                2.7,
                                0.18
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1989,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#e8dcc3",
                            roughness: 1
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 1990,
                            columnNumber: 11
                        }, this)
                    ]
                }, px, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 1988,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    3.25,
                    3.4
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            7.8,
                            0.16,
                            3
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1994,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a4a2a",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1995,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1993,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    2.2,
                    4.6,
                    -1.2
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.7,
                            1.8,
                            0.7
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 1999,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b9b2a2",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2000,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 1998,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 1972,
        columnNumber: 5
    }, this);
}
/** Township Stadium — oval stands + green pitch + floodlights, south of the motor park */ function TownStadium() {
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['transport-area'];
    const x = base.x - 2;
    const z = base.z + 16;
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            x,
            y,
            z
        ],
        rotation: [
            0,
            0.35,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.12,
                    0
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                        args: [
                            10,
                            20
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2016,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#5d8a37",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2017,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2015,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.14,
                    0
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ringGeometry", {
                        args: [
                            8.6,
                            9,
                            20
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2020,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8dcc3",
                        roughness: 1,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2021,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2019,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.55,
                    0
                ],
                rotation: [
                    Math.PI / 2,
                    0,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            12.4,
                            12.4,
                            1.1,
                            24,
                            1,
                            true
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2025,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#c9a96b",
                        roughness: 1,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2026,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2024,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.35,
                    0
                ],
                rotation: [
                    Math.PI / 2,
                    0,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            13.8,
                            13.8,
                            1,
                            24,
                            1,
                            true
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2029,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b98a4a",
                        roughness: 1,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2030,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2028,
                columnNumber: 7
            }, this),
            [
                45,
                135,
                225,
                315
            ].map((deg)=>{
                const rad = deg * Math.PI / 180;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        Math.cos(rad) * 14.6,
                        0,
                        Math.sin(rad) * 14.6
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                4.4,
                                0
                            ],
                            castShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        0.14,
                                        0.2,
                                        8.8,
                                        5
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 2038,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#3a3f3a",
                                    roughness: 0.7,
                                    metalness: 0.4
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 2039,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2037,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                9,
                                0
                            ],
                            rotation: [
                                0.5,
                                0,
                                0
                            ],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        1.7,
                                        0.7,
                                        0.25
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 2042,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#e8e4d0",
                                    emissive: "#fff2c0",
                                    emissiveIntensity: 0.25
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 2043,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2041,
                            columnNumber: 13
                        }, this)
                    ]
                }, deg, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2036,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2013,
        columnNumber: 5
    }, this);
}
/** Central Mosque — dome + minaret, near the Kpata road */ function CentralMosque() {
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['kpata-market'];
    const x = base.x + 14;
    const z = base.z - 6;
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            x,
            y,
            z
        ],
        rotation: [
            0,
            -0.4,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.6,
                    0
                ],
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            7,
                            3.2,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2061,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8dcc3",
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2062,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2060,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    4.4,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            2.5,
                            12,
                            10,
                            0,
                            Math.PI * 2,
                            0,
                            Math.PI / 2
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2066,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#2e7d5b",
                        roughness: 0.6,
                        metalness: 0.15
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2067,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2065,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    7,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            0.24,
                            0.8,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2070,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8a317",
                        roughness: 0.5,
                        metalness: 0.3
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2071,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2069,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    4.6,
                    0,
                    3.4
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            4.5,
                            0
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    0.55,
                                    0.7,
                                    9,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2076,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#e8dcc3",
                                roughness: 0.95
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2077,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2075,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            9.4,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                                args: [
                                    0.85,
                                    1.4,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2080,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#2e7d5b",
                                roughness: 0.6
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2081,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2079,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            10.4,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    0.14,
                                    6,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2084,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#e8a317",
                                metalness: 0.4,
                                roughness: 0.4
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2085,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2083,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2074,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.9,
                    3.02
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            2.4,
                            1.8,
                            0.1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2090,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#3a4a3e",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2091,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2089,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2059,
        columnNumber: 5
    }, this);
}
/** A church hall near the university quarter */ function ChurchHall() {
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['university-area'];
    const x = base.x - 10;
    const z = base.z + 6;
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            x,
            y,
            z
        ],
        rotation: [
            0,
            0.9,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.9,
                    0
                ],
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            4.4,
                            3.8,
                            7.5
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#d8cbb0",
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    -1.35,
                    4.45,
                    0
                ],
                rotation: [
                    0,
                    0,
                    0.52
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            2.4,
                            0.14,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#7a6a55",
                        roughness: 0.85
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    1.35,
                    4.45,
                    0
                ],
                rotation: [
                    0,
                    0,
                    -0.52
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            2.4,
                            0.14,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#7a6a55",
                        roughness: 0.85
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2117,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    2.6,
                    4.6
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            2,
                            5.2,
                            2
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8dcc3",
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    5.6,
                    0
                ],
                rotation: [
                    0,
                    Math.PI / 4,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            1.5,
                            1.1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#7a6a55",
                        roughness: 0.85,
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    6.9,
                    4.6
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.12,
                            1.1,
                            0.12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8a317",
                        roughness: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    7.1,
                    4.6
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.55,
                            0.12,
                            0.12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8a317",
                        roughness: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2104,
        columnNumber: 5
    }, this);
}
/**
 * River life — fishing canoes and a laden ferry drifting the Niger and
 * Benue along the real river courses. Each boat slides along a window of
 * its river polyline (deterministic loop, no physics).
 */ const BOAT_PATHS = [
    {
        points: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"][0].points,
        from: 0.15,
        to: 0.95,
        speed: 1.4
    },
    {
        points: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"][0].points,
        from: 0.05,
        to: 0.85,
        speed: 1.1
    },
    {
        points: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"][1].points,
        from: 0.1,
        to: 0.9,
        speed: 1.2
    },
    {
        points: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"][0].points,
        from: 0.4,
        to: 0.99,
        speed: 1.7
    },
    {
        points: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"][1].points,
        from: 0.15,
        to: 0.98,
        speed: 1.25
    }
];
function riverPoint(points, t) {
    const clamped = Math.max(0, Math.min(0.9999, t));
    const target = clamped * (points.length - 1);
    const i = Math.min(points.length - 2, Math.floor(target));
    const f = target - i;
    const [ax, az] = points[i];
    const [bx, bz] = points[i + 1];
    return {
        x: ax + (bx - ax) * f,
        z: az + (bz - az) * f,
        yaw: Math.atan2(bx - ax, bz - az)
    };
}
function Boats() {
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const phases = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>BOAT_PATHS.map((_, i)=>i * 0.37), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state, dt)=>{
        const t = state.clock.elapsedTime;
        for(let i = 0; i < BOAT_PATHS.length; i++){
            const g = refs.current[i];
            if (!g) continue;
            const bp = BOAT_PATHS[i];
            const span = bp.to - bp.from;
            const u = (phases[i] + t * (bp.speed / (span * 60))) % 1;
            // ping-pong drift so boats come and go
            const tri = u < 0.5 ? u * 2 : 2 - u * 2;
            const p = riverPoint(bp.points, bp.from + tri * span);
            g.position.set(p.x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.16 + Math.sin(t * 1.2 + i) * 0.07, p.z);
            g.rotation.y = p.yaw + (tri > 0.5 ? Math.PI : 0);
            g.rotation.z = Math.sin(t * 1.05 + i * 2) * 0.035;
        }
        void dt;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: BOAT_PATHS.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: (el)=>{
                    refs.current[i] = el;
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        castShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                                args: [
                                    0.42,
                                    i === 3 ? 4.6 : 3,
                                    4,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: i === 3 ? '#3a6ea3' : i % 2 ? '#5a4028' : '#4a6a3a',
                                roughness: 1
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2204,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.2,
                            0
                        ],
                        scale: [
                            0.6,
                            0.45,
                            1
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                                args: [
                                    0.38,
                                    i === 3 ? 3.8 : 2.4,
                                    4,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2207,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#2a1e12",
                                roughness: 1
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2208,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2206,
                        columnNumber: 11
                    }, this),
                    i === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.85,
                            -0.6
                        ],
                        castShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    1.3,
                                    0.9,
                                    1.6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2212,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#c94f2e",
                                roughness: 0.85
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                lineNumber: 2213,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2211,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2201,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2199,
        columnNumber: 5
    }, this);
}
function AnchorStructures() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"].map((a)=>{
                switch(a.id){
                    case 'confluence':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfluenceDeck, {
                            ...a
                        }, a.id, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2228,
                            columnNumber: 20
                        }, this);
                    case 'mount-patti':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PattiTower, {
                            ...a
                        }, a.id, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2230,
                            columnNumber: 20
                        }, this);
                    case 'ganaja-junction':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(JunctionRoundabout, {
                            ...a
                        }, a.id, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2232,
                            columnNumber: 20
                        }, this);
                    case 'food-area':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SuyaGrill, {
                            ...a
                        }, a.id, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2234,
                            columnNumber: 20
                        }, this);
                    case 'historic-lokoja':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Monument, {
                            ...a
                        }, a.id, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2236,
                            columnNumber: 20
                        }, this);
                    case 'government-area':
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GatePosts, {
                            ...a
                        }, a.id, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2238,
                            columnNumber: 20
                        }, this);
                    default:
                        return null;
                }
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LugardRestHouse, {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['mount-patti']
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TownStadium, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CentralMosque, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChurchHall, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Boats, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2248,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2224,
        columnNumber: 5
    }, this);
}
/* ----------------------------- points of interest ----------------------------- */ /**
 * M2 — THE CIVIC MESH dressing: the Government House flag and one agency
 * fascia per GRA service office. Six small meshes total (performance law:
 * this city carries no decoration it cannot justify) — the buildings
 * themselves stay on the standard instanced block path.
 */ const CIVIC_FASCIA = {
    kgirs: '#5C6E3A',
    nepa: '#b9821f',
    police: '#1f3a5c',
    efcc: '#2e5c46'
};
function CivicDressing() {
    const tagged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].filter((b)=>b.tag), []);
    const poles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>tagged.filter((b)=>b.tag === 'gov-house'), [
        tagged
    ]);
    const offices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>tagged.filter((b)=>b.tag && b.tag !== 'gov-house'), [
        tagged
    ]);
    const campus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].some((b)=>b.tag), []);
    if (!campus) return null;
    // THE GOVERNMENT GROUNDS — fence, gate and the laterite drive from the GRA
    const { minX, maxX, minZ, maxZ, gateZmin, gateZmax } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC_CAMPUS"];
    const midX = (minX + maxX) / 2;
    const w = maxX - minX;
    const d = maxZ - minZ;
    const fenceY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(minX, minZ);
    const gateZ = (gateZmin + gateZmax) / 2;
    const fenceMat = {
        color: '#b8ab90',
        roughness: 0.95
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    midX,
                    fenceY + 0.55,
                    minZ
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            w,
                            1.1,
                            0.35
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ...fenceMat
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2287,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    midX,
                    fenceY + 0.55,
                    maxZ
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            w,
                            1.1,
                            0.35
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ...fenceMat
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    minX,
                    fenceY + 0.55,
                    (minZ + maxZ) / 2
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.35,
                            1.1,
                            d
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ...fenceMat
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    maxX,
                    fenceY + 0.55,
                    (minZ + gateZmin) / 2
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.35,
                            1.1,
                            gateZmin - minZ
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2298,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ...fenceMat
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2299,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2297,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    maxX,
                    fenceY + 0.55,
                    (gateZmax + maxZ) / 2
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.35,
                            1.1,
                            maxZ - gateZmax
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        ...fenceMat
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2303,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2301,
                columnNumber: 7
            }, this),
            [
                gateZmin,
                gateZmax
            ].map((gz)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        maxX,
                        fenceY + 1.35,
                        gz
                    ],
                    castShadow: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.5,
                                2.7,
                                0.5
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2308,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#1b7a43",
                            roughness: 0.6
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2309,
                            columnNumber: 11
                        }, this)
                    ]
                }, gz, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2307,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    maxX + 8,
                    fenceY + 0.06,
                    gateZ
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            16,
                            2.6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2314,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b06a3a",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2315,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2313,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    midX,
                    fenceY + 0.06,
                    gateZ
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            w - 3,
                            2.4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2318,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b06a3a",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2319,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2317,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    midX,
                    fenceY + 0.06,
                    (maxZ + gateZ) / 2
                ],
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            2.4,
                            (maxZ - gateZ) / 2 + 2
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2322,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#b06a3a",
                        roughness: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2323,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2321,
                columnNumber: 7
            }, this),
            poles.map((b)=>{
                const px = b.x + Math.sin(b.rotY) * (b.d / 2 + 0.4);
                const pz = b.z + Math.cos(b.rotY) * (b.d / 2 + 0.4);
                const py = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(px, pz);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        px,
                        py,
                        pz
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                4.2,
                                0
                            ],
                            castShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        0.055,
                                        0.075,
                                        8.4,
                                        6
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 2334,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#d8d6c8",
                                    roughness: 0.6
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                                    lineNumber: 2335,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2333,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FlagCloth, {}, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2338,
                            columnNumber: 13
                        }, this)
                    ]
                }, "gov-house-flag", true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2331,
                    columnNumber: 11
                }, this);
            }),
            offices.map((b)=>{
                const out = b.d / 2 + 0.07;
                const fx = b.x + Math.sin(b.rotY) * out;
                const fz = b.z + Math.cos(b.rotY) * out;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        fx,
                        b.y + b.h * 0.82,
                        fz
                    ],
                    rotation: [
                        0,
                        b.rotY,
                        0
                    ],
                    castShadow: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                b.w * 0.62,
                                0.62,
                                0.1
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2353,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: CIVIC_FASCIA[b.tag] ?? '#1c5c3a',
                            roughness: 0.55
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2354,
                            columnNumber: 13
                        }, this)
                    ]
                }, b.tag, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2347,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2283,
        columnNumber: 5
    }, this);
}
/** the Government House flag — a small waving plane driven by useFrame */ function FlagCloth() {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const matRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f7f7f2';
        ctx.fillRect(0, 0, 96, 64);
        ctx.fillStyle = '#1b7a43';
        ctx.fillRect(0, 0, 32, 64);
        ctx.fillRect(64, 0, 32, 64);
        const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
        if (matRef.current) matRef.current.map = tex;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(({ clock })=>{
        if (ref.current) {
            const t = clock.getElapsedTime();
            ref.current.rotation.y = Math.sin(t * 1.7) * 0.22;
            ref.current.rotation.z = Math.sin(t * 2.3) * 0.06;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        ref: ref,
        position: [
            0.62,
            7.6,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                args: [
                    1.24,
                    0.82
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2388,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                ref: matRef,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
                roughness: 0.9
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2389,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2387,
        columnNumber: 5
    }, this);
}
function JobBoard({ x, y, z, rotY }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            x,
            y,
            z
        ],
        rotation: [
            0,
            rotY,
            0
        ],
        children: [
            [
                -0.7,
                0.7
            ].map((px)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        px,
                        1.05,
                        0
                    ],
                    castShadow: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.14,
                                2.1,
                                0.14
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2400,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#6a5138",
                            roughness: 0.95
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2401,
                            columnNumber: 11
                        }, this)
                    ]
                }, px, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2399,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.9,
                    0.04
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1.9,
                            1.3,
                            0.08
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2406,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#1c5c3a",
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2407,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2405,
                columnNumber: 7
            }, this),
            [
                0.42,
                0,
                -0.42
            ].map((sx, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        sx,
                        1.84 - i % 2 * 0.14,
                        0.1
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.52,
                                0.7,
                                0.03
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2412,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: i === 1 ? '#f2ead8' : '#e8dcc3',
                            roughness: 1
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/CityMesh.tsx",
                            lineNumber: 2413,
                            columnNumber: 11
                        }, this)
                    ]
                }, sx, true, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2411,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    2.58,
                    0.02
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            2.06,
                            0.3,
                            0.12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#e8a317",
                        roughness: 0.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/CityMesh.tsx",
                        lineNumber: 2419,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2417,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2396,
        columnNumber: 5
    }, this);
}
function PointOfInterestProps() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POINTS_OF_INTEREST"].map((p)=>p.kind === 'jobboard' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(JobBoard, {
                x: p.x,
                y: p.y,
                z: p.z,
                rotY: p.rotY
            }, p.id, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2429,
                columnNumber: 33
            }, this) : null)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2427,
        columnNumber: 5
    }, this);
}
function nearestKInto(idx, d2, pts, px, pz, k) {
    const n = Math.min(k, idx.length, pts.length);
    if (n <= 0) return 0;
    let filled = 0;
    for(let i = 0; i < pts.length; i++){
        const dx = pts[i].x - px;
        const dz = pts[i].z - pz;
        const dist2 = dx * dx + dz * dz;
        if (filled === n && dist2 >= d2[n - 1]) continue; // rim ties keep the earlier entry
        if (filled < n) filled++;
        let slot = filled - 1;
        while(slot > 0 && d2[slot - 1] > dist2){
            d2[slot] = d2[slot - 1];
            idx[slot] = idx[slot - 1];
            slot--;
        }
        d2[slot] = dist2;
        idx[slot] = i;
    }
    return filled;
}
/* ---------------------------------- labels ----------------------------------- */ /**
 * THE LABEL LAW (SILK II): the 22 location labels are depthTest:false
 * overlays — the old build drew every one of them, always, and bounced
 * all 22 every frame. Now a label is visible only within
 * LABEL_CULL_RANGE of the player (XZ), with the 3 NEAREST kept alive
 * regardless so an arrival always reads its name. Visibility and the
 * y-bounce are imperative per-frame writes; invisible sprites skip the
 * bounce math entirely. Zero allocations (module scratch), zero React
 * churn, sprite scale + atlas untouched (readability unchanged).
 */ const LABEL_CULL_RANGE = 140;
const LABEL_KEEP_NEAR = 3;
const LABEL_COUNT = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"].length;
// module scratch for the per-frame cull — no per-frame allocation
const labelD2 = new Float64Array(LABEL_COUNT);
const labelKeepI = new Int32Array(LABEL_KEEP_NEAR);
const labelKeepD = new Float64Array(LABEL_KEEP_NEAR);
function LocationLabels() {
    const sprites = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"].map((a)=>{
            const tex = makeLabelTexture(a.location.name);
            return {
                a,
                tex
            };
        }), []);
    const groupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        const grp = groupRef.current;
        if (!grp) return;
        const t = s.clock.elapsedTime;
        const px = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x;
        const pz = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z;
        for(let i = 0; i < LABEL_COUNT; i++){
            const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"][i];
            const dx = a.x - px;
            const dz = a.z - pz;
            labelD2[i] = dx * dx + dz * dz;
        }
        // the 3-nearest keep-alive — the same deterministic law as the door lights
        nearestKInto(labelKeepI, labelKeepD, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"], px, pz, LABEL_KEEP_NEAR);
        const range2 = LABEL_CULL_RANGE * LABEL_CULL_RANGE;
        for(let i = 0; i < LABEL_COUNT; i++){
            const child = grp.children[i];
            if (!child) continue;
            const near = labelD2[i] <= range2 || i === labelKeepI[0] || i === labelKeepI[1] || i === labelKeepI[2];
            if (child.visible !== near) child.visible = near;
            if (!near) continue; // THE CULL LAW: invisible labels cost no bounce writes
            child.position.y = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"][i].y + 7.4 + Math.sin(t * 1.1 + i * 1.7) * 0.18;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: groupRef,
        children: sprites.map(({ a, tex })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sprite", {
                position: [
                    a.x,
                    a.y + 8.2,
                    a.z
                ],
                scale: [
                    9,
                    2.25,
                    1
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("spriteMaterial", {
                    map: tex,
                    transparent: true,
                    depthTest: false,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2540,
                    columnNumber: 11
                }, this)
            }, a.id, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2539,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2537,
        columnNumber: 5
    }, this);
}
const DOOR_PARTS = [
    {
        kind: 'step',
        perDoor: 1,
        geo: [
            1.7,
            0.12,
            0.9
        ],
        x: 0,
        y: 0.06,
        z: 0.35,
        rotX: 0,
        rotY: 0,
        sideX: null,
        cast: false,
        receive: true,
        color: '#b9a98d',
        roughness: 1
    },
    {
        kind: 'post',
        perDoor: 2,
        geo: [
            0.13,
            2.1,
            0.13
        ],
        x: 0,
        y: 1.05,
        z: 0,
        rotX: 0,
        rotY: 0,
        sideX: [
            -0.62,
            0.62
        ],
        cast: true,
        receive: false,
        color: '#6a4c30',
        roughness: 1
    },
    {
        kind: 'lintel',
        perDoor: 1,
        geo: [
            1.42,
            0.14,
            0.15
        ],
        x: 0,
        y: 2.14,
        z: 0,
        rotX: 0,
        rotY: 0,
        sideX: null,
        cast: true,
        receive: false,
        color: '#6a4c30',
        roughness: 1
    },
    {
        kind: 'slab',
        perDoor: 1,
        geo: [
            0.86,
            1.94,
            0.055
        ],
        x: 0.45,
        y: 1.02,
        z: 0.16,
        rotX: 0,
        rotY: -0.62,
        sideX: null,
        cast: false,
        receive: false,
        color: '#2e7d5b',
        roughness: 0.75
    },
    {
        kind: 'awning',
        perDoor: 1,
        geo: [
            1.6,
            0.05,
            0.95
        ],
        x: 0,
        y: 2.32,
        z: 0.42,
        rotX: 0.34,
        rotY: 0,
        sideX: null,
        cast: false,
        receive: false,
        color: '#c94f2e',
        roughness: 0.85
    },
    {
        kind: 'sign',
        perDoor: 1,
        geo: [
            0.5,
            0.34,
            0.03
        ],
        x: 0,
        y: 1.88,
        z: 0.3,
        rotX: 0,
        rotY: 0,
        sideX: null,
        cast: false,
        receive: false,
        color: '#e8dcc3',
        roughness: 0.9,
        emissive: '#e8a317'
    }
];
// module scratch — the composition runs at mount only but stays alloc-free
const _doorParent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
const _doorLocal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
function doorPartMatrix(out, door, part, s) {
    _doorParent.makeRotationY(door.rotY);
    _doorParent.setPosition(door.x, door.y, door.z);
    if (part.rotX !== 0) _doorLocal.makeRotationX(part.rotX);
    else if (part.rotY !== 0) _doorLocal.makeRotationY(part.rotY);
    else _doorLocal.identity();
    _doorLocal.setPosition(part.x + (part.sideX ? part.sideX[s] : 0), part.y, part.z);
    return out.multiplyMatrices(_doorParent, _doorLocal);
}
/** one part-kind bucket: ONE InstancedMesh across all 98 doors */ function DoorBucket({ part, glowScale = 0 }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const count = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ALL_DOORS"].length * part.perDoor;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mesh = ref.current;
        if (!mesh) return;
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ALL_DOORS"].length; i++){
            for(let s = 0; s < part.perDoor; s++){
                mesh.setMatrixAt(i * part.perDoor + s, doorPartMatrix(m, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ALL_DOORS"][i], part, s));
            }
        }
        mesh.instanceMatrix.needsUpdate = true;
    }, [
        part
    ]);
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color: part.color,
            roughness: part.roughness,
            metalness: 0,
            emissive: part.emissive ?? '#000000',
            emissiveIntensity: 0
        }), [
        part
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>mat.dispose(), [
        mat
    ]);
    // the sign plate is the one emissive part — it follows nightGlow live
    // through a ref (the Shopfronts sign convention — the old JSX read
    // nightGlow once at mount; the file's own convention is the live read)
    const matRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        matRef.current = mat;
    }, [
        mat
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        if (glowScale > 0 && matRef.current) matRef.current.emissiveIntensity = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow * glowScale;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
        ref: ref,
        args: [
            undefined,
            undefined,
            count
        ],
        castShadow: part.cast,
        receiveShadow: part.receive,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                args: part.geo
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2683,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                object: mat,
                attach: "material"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2684,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2682,
        columnNumber: 5
    }, this);
}
const DOOR_LIGHT_POOL = 6;
const DOOR_LIGHT_BY_TIER = {
    low: 0,
    mid: 4,
    high: 6
};
const DOOR_LIGHT_SOURCES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ALL_DOORS"].filter((d)=>d.light !== false).map((d)=>({
        x: d.x + Math.sin(d.rotY) * 0.5,
        y: d.y + 2,
        z: d.z + Math.cos(d.rotY) * 0.5
    }));
// module scratch — the per-frame nearest-K allocates nothing
const _lightIdx = new Int32Array(DOOR_LIGHT_POOL);
const _lightD2 = new Float64Array(DOOR_LIGHT_POOL);
function pickNearestDoorLights(px, pz, k) {
    return nearestKInto(_lightIdx, _lightD2, DOOR_LIGHT_SOURCES, px, pz, k);
}
function DoorLights() {
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const k = DOOR_LIGHT_BY_TIER[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].tier];
        const active = Math.min(k, DOOR_LIGHT_SOURCES.length);
        const glow = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow;
        // selection only matters while a glow can read it; the ACTIVE slots
        // keep tracking (visible at intensity 0 by day) so the light count is
        // stable across the whole day cycle
        if (glow > 0 && active > 0) pickNearestDoorLights(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z, active);
        for(let s = 0; s < DOOR_LIGHT_POOL; s++){
            const light = refs.current[s];
            if (!light) continue;
            if (s >= active) {
                // THE SPARE LAW: pool slots beyond the tier count sit dark + hidden
                light.intensity = 0;
                light.visible = false;
                continue;
            }
            light.visible = true;
            if (glow <= 0) {
                light.intensity = 0;
                continue;
            }
            const src = DOOR_LIGHT_SOURCES[_lightIdx[s]];
            light.position.set(src.x, src.y, src.z);
            light.intensity = glow * 6;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: Array.from({
            length: DOOR_LIGHT_POOL
        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                ref: (el)=>{
                    refs.current[i] = el;
                },
                color: "#ffd9a0",
                intensity: 0,
                distance: 6,
                decay: 1.8
            }, i, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2760,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2758,
        columnNumber: 5
    }, this);
}
function Doorways() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            DOOR_PARTS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DoorBucket, {
                    part: p,
                    glowScale: p.kind === 'sign' ? 0.35 : 0
                }, p.kind, false, {
                    fileName: "[project]/src/components/game/world/CityMesh.tsx",
                    lineNumber: 2778,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DoorLights, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2781,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2775,
        columnNumber: 5
    }, this);
}
function CityMesh() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Buildings, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2791,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Shopfronts, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2792,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RooftopClutter, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2793,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CompoundLife, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2794,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UtilityLines, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2795,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StreetPlates, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2796,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TrafficLights, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2797,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DanfoStops, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2798,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StreetProps, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2799,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Stalls, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2800,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloraTrees, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2801,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Rocks, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2802,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Lamps, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2803,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AnchorStructures, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2804,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CivicDressing, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2805,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PointOfInterestProps, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2806,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Doorways, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2807,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LocationLabels, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/CityMesh.tsx",
                lineNumber: 2808,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/CityMesh.tsx",
        lineNumber: 2790,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_game_world_CityMesh_tsx_719b8a47._.js.map