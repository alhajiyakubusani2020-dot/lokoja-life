module.exports = [
"[project]/src/components/game/Avatar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Avatar
 * ---------------------
 * Fully original, layered SVG character renderer driven by AvatarConfig.
 * No external assets — every hairstyle/clothing style is drawn in code,
 * so future cosmetics can be added as new path sets (data-driven art).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function Avatar({ config, gender, withBackdrop = true, className }) {
    const uid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])().replace(/[^a-zA-Z0-9]/g, '');
    const skin = config.skinTone;
    const hair = config.hairColor;
    const cloth = config.clothingColor;
    // darker shades derived from the base colours for depth
    const skinShade = shade(skin, -18);
    const clothShade = shade(cloth, -22);
    const shoulderPath = gender === 'male' ? 'M 44 222 C 44 164 70 146 100 146 C 130 146 156 164 156 222 Z' : 'M 52 222 C 52 168 74 148 100 148 C 126 148 148 168 148 222 Z';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 200 224",
        className: className,
        role: "img",
        "aria-label": "Character avatar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                    id: `disc-${uid}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "100",
                        r: "96"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/Avatar.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            withBackdrop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "100",
                        r: "96",
                        fill: "var(--lko-sand)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "100",
                        r: "96",
                        fill: "none",
                        stroke: "rgba(34,39,31,0.08)",
                        strokeWidth: "3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                clipPath: withBackdrop ? `url(#disc-${uid})` : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HairBack, {
                        config: config,
                        hair: hair
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 88 116 L 88 146 Q 100 154 112 146 L 112 116 Z",
                        fill: skinShade
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: shoulderPath,
                        fill: cloth
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ClothingDetail, {
                        style: config.clothingStyle,
                        cloth: cloth,
                        clothShade: clothShade
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 66 88 C 66 58 80 46 100 46 C 120 46 134 58 134 88 C 134 114 120 132 100 132 C 80 132 66 114 66 88 Z",
                        fill: skin
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "66",
                        cy: "92",
                        r: "7",
                        fill: skin
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "134",
                        cy: "92",
                        r: "7",
                        fill: skin
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "66",
                        cy: "92",
                        r: "3.4",
                        fill: skinShade,
                        opacity: "0.55"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "134",
                        cy: "92",
                        r: "3.4",
                        fill: skinShade,
                        opacity: "0.55"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 80 81 Q 87 77 94 80",
                        stroke: shade(hair, -10),
                        strokeWidth: "2.6",
                        strokeLinecap: "round",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 106 80 Q 113 77 120 81",
                        stroke: shade(hair, -10),
                        strokeWidth: "2.6",
                        strokeLinecap: "round",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "87",
                        cy: "91",
                        r: "3.6",
                        fill: "#241d16"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "113",
                        cy: "91",
                        r: "3.6",
                        fill: "#241d16"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "88.3",
                        cy: "89.7",
                        r: "1.1",
                        fill: "#ffffff",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "114.3",
                        cy: "89.7",
                        r: "1.1",
                        fill: "#ffffff",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 100 96 L 98 103 Q 100 104.5 102 103",
                        stroke: skinShade,
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 90 110 Q 100 119 110 110",
                        stroke: "#3d2b1f",
                        strokeWidth: "2.8",
                        strokeLinecap: "round",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "78",
                        cy: "101",
                        r: "4.5",
                        fill: shade(skin, -8),
                        opacity: "0.35"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "122",
                        cy: "101",
                        r: "4.5",
                        fill: shade(skin, -8),
                        opacity: "0.35"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HairFront, {
                        config: config,
                        hair: hair
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/Avatar.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
/* --------------------------- hair render helpers --------------------------- */ function HairBack({ config, hair }) {
    switch(config.hairstyle){
        case 'afro':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: hair,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "62",
                        r: "44"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "64",
                        cy: "76",
                        r: "20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "136",
                        cy: "76",
                        r: "20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this);
        case 'dreads':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: hair,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "58",
                        y: "64",
                        width: "11",
                        height: "58",
                        rx: "5.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "72",
                        y: "58",
                        width: "11",
                        height: "66",
                        rx: "5.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "117",
                        y: "58",
                        width: "11",
                        height: "66",
                        rx: "5.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "131",
                        y: "64",
                        width: "11",
                        height: "58",
                        rx: "5.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this);
        case 'braids':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: hair,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "57",
                        y: "66",
                        width: "13",
                        height: "108",
                        rx: "6.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "130",
                        y: "66",
                        width: "13",
                        height: "108",
                        rx: "6.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "55.5",
                        y: "120",
                        width: "16",
                        height: "7",
                        rx: "3.5",
                        fill: "#e8a317",
                        opacity: "0.85"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "128.5",
                        y: "120",
                        width: "16",
                        height: "7",
                        rx: "3.5",
                        fill: "#e8a317",
                        opacity: "0.85"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this);
        case 'puffs':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: hair,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "66",
                        cy: "56",
                        r: "19"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "134",
                        cy: "56",
                        r: "19"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "66",
                        cy: "56",
                        r: "19",
                        fill: "none",
                        stroke: shade(hair, -15),
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "134",
                        cy: "56",
                        r: "19",
                        fill: "none",
                        stroke: shade(hair, -15),
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this);
        default:
            return null;
    }
}
function HairFront({ config, hair }) {
    switch(config.hairstyle){
        case 'bald':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 82 54 Q 100 49 118 54",
                stroke: shade(config.skinTone, -10),
                strokeWidth: "2",
                strokeLinecap: "round",
                fill: "none",
                opacity: "0.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this);
        case 'low-cut':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 66 84 C 66 56 80 44 100 44 C 120 44 134 56 134 84 C 130 64 118 56 100 56 C 82 56 70 64 66 84 Z",
                fill: hair
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 163,
                columnNumber: 9
            }, this);
        case 'waves':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 66 84 C 66 56 80 44 100 44 C 120 44 134 56 134 84 C 130 64 118 56 100 56 C 82 56 70 64 66 84 Z",
                        fill: hair
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 76 62 Q 88 58 100 60 Q 112 62 124 62 M 74 68 Q 88 64 100 66 Q 112 68 126 68",
                        stroke: shade(hair, 30),
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        fill: "none",
                        opacity: "0.8"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 170,
                columnNumber: 9
            }, this);
        case 'afro':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 68 78 C 68 52 82 42 100 42 C 118 42 132 52 132 78 C 126 58 116 52 100 52 C 84 52 74 58 68 78 Z",
                fill: hair
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 187,
                columnNumber: 9
            }, this);
        case 'cornrows':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 66 84 C 66 54 80 42 100 42 C 120 42 134 54 134 84 C 130 62 118 54 100 54 C 82 54 70 62 66 84 Z",
                        fill: hair
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    [
                        76,
                        88,
                        100,
                        112,
                        124
                    ].map((x, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: `M ${x} ${48 + Math.abs(100 - x) * 0.12} Q ${x - 2} ${58 + Math.abs(100 - x) * 0.1} ${x} ${66}`,
                            stroke: shade(hair, 34),
                            strokeWidth: "2.4",
                            strokeLinecap: "round",
                            fill: "none"
                        }, i, false, {
                            fileName: "[project]/src/components/game/Avatar.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this);
        case 'dreads':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 64 80 C 64 52 80 42 100 42 C 120 42 136 52 136 80 C 130 58 118 52 100 52 C 82 52 70 58 64 80 Z",
                fill: hair
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this);
        case 'braids':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 62 82 C 62 52 80 42 100 42 C 120 42 138 52 138 82 C 132 58 118 52 100 52 C 82 52 68 58 62 82 Z",
                fill: hair
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 220,
                columnNumber: 9
            }, this);
        case 'puffs':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 64 84 C 64 52 80 44 100 44 C 120 44 136 52 136 84 C 130 62 118 56 100 56 C 82 56 70 62 64 84 Z",
                fill: hair
            }, void 0, false, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this);
        default:
            return null;
    }
}
/* ------------------------- clothing detail helpers ------------------------- */ function ClothingDetail({ style, cloth, clothShade }) {
    switch(style){
        case 'kaftan':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 88 148 L 100 168 L 112 148 Q 100 156 88 148 Z",
                        fill: clothShade
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 100 168 L 100 200",
                        stroke: clothShade,
                        strokeWidth: "2.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "176",
                        r: "2",
                        fill: "#e8a317",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "96",
                        cy: "184",
                        r: "2",
                        fill: "#e8a317",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "104",
                        cy: "184",
                        r: "2",
                        fill: "#e8a317",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "192",
                        r: "2",
                        fill: "#e8a317",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 251,
                columnNumber: 9
            }, this);
        case 'ankara':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 88 148 Q 100 158 112 148 Q 100 156 88 148 Z",
                        fill: clothShade
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this),
                    [
                        {
                            x: 70,
                            y: 170
                        },
                        {
                            x: 96,
                            y: 180
                        },
                        {
                            x: 122,
                            y: 168
                        },
                        {
                            x: 82,
                            y: 196
                        },
                        {
                            x: 112,
                            y: 200
                        },
                        {
                            x: 62,
                            y: 208
                        },
                        {
                            x: 134,
                            y: 208
                        }
                    ].map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            transform: `translate(${p.x} ${p.y})`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    r: "4.5",
                                    fill: "#fdf0d5",
                                    opacity: "0.95"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Avatar.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    r: "1.8",
                                    fill: clothShade
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/Avatar.tsx",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/game/Avatar.tsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 264,
                columnNumber: 9
            }, this);
        case 'senator':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 86 148 L 100 162 L 114 148",
                        fill: "none",
                        stroke: clothShade,
                        strokeWidth: "4",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 100 162 L 100 210",
                        stroke: clothShade,
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "172",
                        r: "1.6",
                        fill: "#fdf0d5",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "100",
                        cy: "184",
                        r: "1.6",
                        fill: "#fdf0d5",
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "116",
                        y: "176",
                        width: "16",
                        height: "12",
                        rx: "2",
                        fill: "none",
                        stroke: clothShade,
                        strokeWidth: "2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 287,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 280,
                columnNumber: 9
            }, this);
        case 'tshirt':
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 88 146 Q 100 160 112 146 Q 100 154 88 146 Z",
                        fill: clothShade
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 295,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 62 168 Q 66 158 72 152 M 138 152 Q 144 158 148 168",
                        stroke: clothShade,
                        strokeWidth: "3",
                        strokeLinecap: "round",
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/Avatar.tsx",
                        lineNumber: 297,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/Avatar.tsx",
                lineNumber: 293,
                columnNumber: 9
            }, this);
    }
}
/* ------------------------------ colour helper ------------------------------ */ /** Lighten (amount > 0) or darken (amount < 0) a hex colour by a percentage. */ function shade(hex, amount) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const clamp = (v)=>Math.max(0, Math.min(255, v));
    const r = clamp((num >> 16) + Math.round(2.55 * amount));
    const g = clamp((num >> 8 & 0x00ff) + Math.round(2.55 * amount));
    const b = clamp((num & 0x0000ff) + Math.round(2.55 * amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
}),
"[project]/src/components/game/NeedsBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NeedsBar",
    ()=>NeedsBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — NeedsBar (R1)
 * A labelled stat bar for the four player needs.
 * R1: SVG need icons in tinted discs instead of emoji, slimmer track,
 * tabular numbers. Colour shifts by value; small + large sizes.
 * Self-contained so game styling stays isolated.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const NEED_META = {
    health: {
        label: 'Health',
        disc: 'bg-red-50 text-red-500',
        icon: 'health'
    },
    energy: {
        label: 'Energy',
        disc: 'bg-[var(--lko-gold-soft)] text-[#b57d0a]',
        icon: 'energy'
    },
    hunger: {
        label: 'Food',
        disc: 'bg-orange-50 text-[var(--lko-terra)]',
        icon: 'hunger'
    },
    mood: {
        label: 'Mood',
        disc: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
        icon: 'mood'
    }
};
function barColor(value) {
    if (value <= 20) return '#ef4444';
    if (value <= 45) return '#f59e0b';
    return 'var(--lko-green)';
}
function NeedsBar({ need, value, size = 'md' }) {
    const meta = NEED_META[need];
    const disc = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
    const iconSize = size === 'sm' ? 13 : 15;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `${disc} flex shrink-0 items-center justify-center rounded-full ${meta.disc}`,
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NeedIcon"], {
                    name: need,
                    size: iconSize
                }, void 0, false, {
                    fileName: "[project]/src/components/game/NeedsBar.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/NeedsBar.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `${size === 'sm' ? 'w-12 text-xs' : 'w-14 text-[13px]'} shrink-0 font-bold text-[var(--lko-ink)]`,
                children: meta.label
            }, void 0, false, {
                fileName: "[project]/src/components/game/NeedsBar.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${size === 'sm' ? 'h-2' : 'h-2.5'} flex-1 overflow-hidden rounded-full bg-black/[0.07]`,
                role: "progressbar",
                "aria-valuenow": Math.round(value),
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": meta.label,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full rounded-full transition-[width] duration-500 ease-out",
                    style: {
                        width: `${Math.max(0, Math.min(100, value))}%`,
                        background: barColor(value)
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/game/NeedsBar.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/NeedsBar.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `lko-num ${size === 'sm' ? 'w-7 text-[11px]' : 'w-8 text-xs'} shrink-0 text-right font-bold text-[var(--lko-ink-soft)]`,
                children: Math.round(value)
            }, void 0, false, {
                fileName: "[project]/src/components/game/NeedsBar.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/NeedsBar.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/BottomNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomNav",
    ()=>BottomNav,
    "ComingSoon",
    ()=>ComingSoon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — BottomNav + ComingSoon (R1 + Stage 5)
 * Mobile-first bottom navigation (7 tabs) with the coherent SVG icon set,
 * an animated active pill, and the honest "arrives in a later stage" panel.
 * Principle: never fake finished functionality.
 * Stage 5: the Phone tab joins — chats, bank, hustle shortcut, settings.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
const TABS = [
    {
        key: 'home',
        label: 'Home'
    },
    {
        key: 'world',
        label: 'World'
    },
    {
        key: 'map',
        label: 'Map'
    },
    {
        key: 'work',
        label: 'Work'
    },
    {
        key: 'phone',
        label: 'Phone'
    },
    {
        key: 'bag',
        label: 'Bag'
    },
    {
        key: 'profile',
        label: 'You'
    }
];
function BottomNav({ active, onChange, badge }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Game navigation",
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-[var(--lko-surface)]/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md",
        style: {
            boxShadow: '0 -8px 24px -18px rgba(27,34,24,0.35)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-[-1px] h-px",
                style: {
                    background: 'linear-gradient(90deg, transparent, rgba(232,163,23,0.35), transparent)'
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/game/BottomNav.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto grid max-w-xl grid-cols-7 px-1",
                children: TABS.map((tab)=>{
                    const isActive = active === tab.key;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onChange(tab.key);
                        },
                        "aria-current": isActive ? 'page' : undefined,
                        className: "lko-press group flex min-h-[58px] flex-col items-center justify-center gap-0.5 px-1 py-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `relative flex h-7 w-14 items-center justify-center rounded-full transition-all duration-200 ${isActive ? 'bg-[var(--lko-green)] text-white shadow-[0_4px_10px_-3px_rgba(20,107,58,0.5)]' : 'text-[var(--lko-ink-soft)] group-hover:text-[var(--lko-green)]'}`,
                                "aria-hidden": true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIcon"], {
                                        name: tab.key,
                                        size: 19
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/BottomNav.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this),
                                    badge?.[tab.key] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--lko-surface)] bg-[var(--lko-terra)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/BottomNav.tsx",
                                        lineNumber: 74,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/BottomNav.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-[10.5px] font-bold leading-none transition-colors ${isActive ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]'}`,
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BottomNav.tsx",
                                lineNumber: 77,
                                columnNumber: 15
                            }, this)
                        ]
                    }, tab.key, true, {
                        fileName: "[project]/src/components/game/BottomNav.tsx",
                        lineNumber: 55,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/BottomNav.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/BottomNav.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
function ComingSoon({ icon, title, stage, description }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "lko-card lko-pop mx-4 my-5 flex flex-col items-center p-6 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIcon"], {
                    name: icon === 'bag' ? 'bag' : icon,
                    size: 30
                }, void 0, false, {
                    fileName: "[project]/src/components/game/BottomNav.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/BottomNav.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "lko-display text-lg",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/game/BottomNav.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mt-1 rounded-full bg-[var(--lko-green-soft)] px-3 py-0.5 text-xs font-bold text-[var(--lko-green-deep)]",
                children: [
                    "Arrives in ",
                    stage
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/BottomNav.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-sm leading-relaxed text-[var(--lko-ink-soft)]",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/game/BottomNav.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/BottomNav.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/LivingScene.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LivingScene",
    ()=>LivingScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
'use client';
;
;
const MOODS = {
    morning: {
        skyTop: '#ffeccb',
        skyMid: '#ffd99a',
        skyHorizon: '#ffc27d',
        sun: '#ffdf8a',
        sunGlow: '#ffdf8a',
        pattiFar: '#7ba266',
        pattiNear: '#55804a',
        pattiTop: '#46693d',
        roofs: '#7d8f6a',
        roofsDeep: '#5f7152',
        tree: '#3f6b38',
        riverA: '#49a693',
        riverB: '#3b9484',
        riverDeep: '#25766a',
        bank1: '#4e8a41',
        bank2: '#3d7034',
        grass: '#2c5427',
        road: '#d9b06c',
        windowsLit: false,
        stars: false
    },
    afternoon: {
        skyTop: '#bfe4ee',
        skyMid: '#f6e2b2',
        skyHorizon: '#f6cf8b',
        sun: '#ffd23f',
        sunGlow: '#ffd23f',
        pattiFar: '#6f9c5c',
        pattiNear: '#4d7c43',
        pattiTop: '#3d6437',
        roofs: '#748862',
        roofsDeep: '#57684b',
        tree: '#38652f',
        riverA: '#3d9d8b',
        riverB: '#2f8a7a',
        riverDeep: '#1d6f63',
        bank1: '#487f3c',
        bank2: '#386630',
        grass: '#284d24',
        road: '#d3a962',
        windowsLit: false,
        stars: false
    },
    evening: {
        skyTop: '#f9bd77',
        skyMid: '#f4925a',
        skyHorizon: '#e56f4d',
        sun: '#ff9d4d',
        sunGlow: '#ff9d4d',
        pattiFar: '#5c6e52',
        pattiNear: '#41573f',
        pattiTop: '#32462f',
        roofs: '#5a5348',
        roofsDeep: '#453f36',
        tree: '#2f4a2c',
        riverA: '#33796f',
        riverB: '#2a6a61',
        riverDeep: '#1d514b',
        bank1: '#3c6234',
        bank2: '#2e4d29',
        grass: '#223f1f',
        road: '#c19255',
        windowsLit: true,
        stars: false
    },
    night: {
        skyTop: '#16233c',
        skyMid: '#1d3a49',
        skyHorizon: '#255059',
        sun: '#f2ead2',
        sunGlow: '#f2ead2',
        pattiFar: '#243528',
        pattiNear: '#1b2a20',
        pattiTop: '#142019',
        roofs: '#18251f',
        roofsDeep: '#101a15',
        tree: '#122015',
        riverA: '#1d4c55',
        riverB: '#173f49',
        riverDeep: '#0f2f37',
        bank1: '#1d3524',
        bank2: '#152819',
        grass: '#0e1d12',
        road: '#8a795a',
        windowsLit: true,
        stars: true
    }
};
const RAIN_LINES = [
    {
        x: 90,
        y: 60,
        len: 20,
        d: '0s'
    },
    {
        x: 190,
        y: 30,
        len: 18,
        d: '-0.4s'
    },
    {
        x: 300,
        y: 80,
        len: 22,
        d: '-0.2s'
    },
    {
        x: 420,
        y: 40,
        len: 19,
        d: '-0.7s'
    },
    {
        x: 520,
        y: 90,
        len: 21,
        d: '-0.1s'
    },
    {
        x: 640,
        y: 50,
        len: 18,
        d: '-0.55s'
    },
    {
        x: 720,
        y: 100,
        len: 22,
        d: '-0.3s'
    },
    {
        x: 250,
        y: 140,
        len: 20,
        d: '-0.85s'
    },
    {
        x: 560,
        y: 160,
        len: 19,
        d: '-0.6s'
    },
    {
        x: 700,
        y: 180,
        len: 21,
        d: '-0.15s'
    },
    {
        x: 120,
        y: 180,
        len: 18,
        d: '-0.45s'
    },
    {
        x: 370,
        y: 130,
        len: 20,
        d: '-0.75s'
    }
];
const STARS = [
    {
        x: 70,
        y: 46,
        r: 1.6
    },
    {
        x: 150,
        y: 90,
        r: 1.2
    },
    {
        x: 240,
        y: 40,
        r: 1.8
    },
    {
        x: 330,
        y: 110,
        r: 1.1
    },
    {
        x: 460,
        y: 60,
        r: 1.6
    },
    {
        x: 540,
        y: 120,
        r: 1.2
    },
    {
        x: 620,
        y: 36,
        r: 1.7
    },
    {
        x: 700,
        y: 96,
        r: 1.2
    },
    {
        x: 760,
        y: 60,
        r: 1.5
    },
    {
        x: 200,
        y: 140,
        r: 1.0
    },
    {
        x: 500,
        y: 150,
        r: 1.0
    },
    {
        x: 680,
        y: 150,
        r: 1.2
    }
];
function LivingScene({ timeOfDay = 'afternoon', weather = 'sunny', className }) {
    const m = MOODS[timeOfDay];
    const isNight = timeOfDay === 'night';
    // M6 — the wet-sky family shows the rain streaks; a storm/flood day is
    // just rain drawn heavier by the overcast wash below.
    const isRain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRainSky"])(weather);
    const overcast = weather === 'cloudy' || isRain || weather === 'harmattan';
    // sun/moon position + size per time of day
    const orb = timeOfDay === 'morning' ? {
        x: 610,
        y: 150,
        r: 40
    } : timeOfDay === 'afternoon' ? {
        x: 640,
        y: 96,
        r: 44
    } : timeOfDay === 'evening' ? {
        x: 618,
        y: 286,
        r: 54
    } : {
        x: 630,
        y: 92,
        r: 34
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 800 450",
        className: className,
        role: "img",
        "aria-label": `Illustrated view of Lokoja at ${timeOfDay}${isRain ? ' in the rain' : ''}: Mount Patti, the city and the river confluence`,
        preserveAspectRatio: "xMidYMid slice",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "ls-sky",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: m.skyTop
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0.55",
                                stopColor: m.skyMid
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: m.skyHorizon
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "ls-river",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: m.riverA
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: m.riverDeep
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "ls-river-b",
                        x1: "0",
                        y1: "0",
                        x2: "0.6",
                        y2: "1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: m.riverB
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: m.riverDeep
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "ls-glow",
                        cx: "0.5",
                        cy: "0.5",
                        r: "0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: m.sunGlow,
                                stopOpacity: "0.55"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: m.sunGlow,
                                stopOpacity: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "ls-scrim",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: "#000",
                                stopOpacity: isNight ? 0 : 0.06
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#000",
                                stopOpacity: isNight ? 0.35 : 0.16
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "800",
                height: "450",
                fill: "url(#ls-sky)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            m.stars && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "#e8ecf4",
                children: STARS.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: s.x,
                        cy: s.y,
                        r: s.r,
                        className: "lko-sv-twinkle",
                        style: {
                            animationDelay: `${i % 5 * -0.6}s`
                        }
                    }, i, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 172,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 170,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: orb.x,
                cy: orb.y,
                r: orb.r * 2.4,
                fill: "url(#ls-glow)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            isNight ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: orb.x,
                        cy: orb.y,
                        r: orb.r,
                        fill: m.sun
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: orb.x - 12,
                        cy: orb.y - 8,
                        r: orb.r * 0.82,
                        fill: m.skyTop,
                        opacity: "0.9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 187,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: orb.x,
                cy: orb.y,
                r: orb.r,
                fill: m.sun,
                opacity: overcast ? 0.55 : 1
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 192,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "#ffffff",
                opacity: overcast ? 0.92 : 0.66,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        className: "lko-sv-cloud-a",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            transform: "translate(40 78)",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "0",
                                    cy: "0",
                                    rx: "46",
                                    ry: "15"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "30",
                                    cy: "-10",
                                    rx: "30",
                                    ry: "13"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "-28",
                                    cy: "-6",
                                    rx: "24",
                                    ry: "10"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        className: "lko-sv-cloud-b",
                        opacity: "0.8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            transform: "translate(300 150)",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "0",
                                    cy: "0",
                                    rx: "38",
                                    ry: "12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "26",
                                    cy: "-8",
                                    rx: "24",
                                    ry: "10"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    overcast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        className: "lko-sv-cloud-a",
                        style: {
                            animationDuration: '70s',
                            animationDelay: '-30s'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            transform: "translate(150 42)",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "0",
                                    cy: "0",
                                    rx: "58",
                                    ry: "16"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "34",
                                    cy: "-10",
                                    rx: "34",
                                    ry: "13"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                                    cx: "-36",
                                    cy: "-8",
                                    rx: "28",
                                    ry: "11"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            !isNight && !isRain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                stroke: timeOfDay === 'evening' ? '#5b3a2e' : '#3a4a3a',
                strokeWidth: "2.4",
                fill: "none",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        className: "lko-sv-bird-a",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(60 96)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M-7 0 Q -3 -5 0 0 Q 3 -5 7 0",
                                    className: "lko-anim-wing",
                                    style: {
                                        transformBox: 'fill-box',
                                        transformOrigin: 'center'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(88 108) scale(0.8)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M-7 0 Q -3 -5 0 0 Q 3 -5 7 0",
                                    className: "lko-anim-wing",
                                    style: {
                                        transformBox: 'fill-box',
                                        transformOrigin: 'center',
                                        animationDelay: '-0.4s'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LivingScene.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        className: "lko-sv-bird-b",
                        opacity: "0.8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            transform: "translate(140 70) scale(0.7)",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M-7 0 Q -3 -5 0 0 Q 3 -5 7 0",
                                className: "lko-anim-wing",
                                style: {
                                    transformBox: 'fill-box',
                                    transformOrigin: 'center',
                                    animationDelay: '-0.2s'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M -20 268 L 90 208 L 200 268 Z",
                fill: m.pattiFar
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 120 268 L 262 186 L 410 268 Z",
                fill: m.pattiFar,
                opacity: "0.85"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 30 268 L 150 158 L 236 224 L 292 268 Z",
                fill: m.pattiNear
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 150 158 L 178 186 L 162 192 L 190 220 L 150 236 L 122 208 L 148 190 L 132 184 Z",
                fill: m.pattiTop,
                opacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 150 158 L 150 140 L 164 145 L 150 151",
                fill: "#e8a317"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M -30 268 Q 60 250 150 266 Q 260 282 360 268 L 360 276 L -30 276 Z",
                fill: m.pattiFar,
                opacity: "0.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "330",
                        y: "238",
                        width: "26",
                        height: "30",
                        fill: m.roofs
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 328 238 L 343 228 L 358 238 Z",
                        fill: m.roofsDeep
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "366",
                        y: "230",
                        width: "20",
                        height: "38",
                        fill: m.roofsDeep
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 386 268 L 386 236 L 402 226 L 418 236 L 418 268 Z",
                        fill: m.roofs
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "428",
                        y: "216",
                        width: "10",
                        height: "52",
                        fill: m.roofsDeep
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 426 216 L 433 202 L 440 216 Z",
                        fill: m.roofs
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "450",
                        y: "240",
                        width: "30",
                        height: "28",
                        fill: m.roofs
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 448 240 L 465 230 L 482 240 Z",
                        fill: m.roofsDeep
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "492",
                        y: "234",
                        width: "18",
                        height: "34",
                        fill: m.roofsDeep
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 522 268 L 522 244 L 536 244 L 536 268 M 520 244 L 538 244 L 534 232 L 524 232 Z",
                        fill: m.roofs
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "546",
                        y: "242",
                        width: "24",
                        height: "26",
                        fill: m.roofs
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 544 242 L 558 232 L 572 242 Z",
                        fill: m.roofsDeep
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    m.windowsLit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        fill: "#ffd88a",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "336",
                                y: "246",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 268,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "372",
                                y: "238",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "392",
                                y: "242",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 270,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "456",
                                y: "248",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "497",
                                y: "242",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "552",
                                y: "250",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: "431",
                                y: "226",
                                width: "4",
                                height: "5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LivingScene.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M -20 270 Q 40 254 100 268 Q 170 252 240 268 Q 310 254 380 268 Q 460 252 540 268 Q 620 254 700 268 Q 750 258 800 268 L 800 286 L -20 286 Z",
                fill: m.tree
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                y: "282",
                width: "800",
                height: "168",
                fill: "url(#ls-river)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 800 282 L 800 450 L 520 450 Q 640 360 800 282 Z",
                fill: "url(#ls-river-b)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 288,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 528 446 Q 648 358 796 286",
                stroke: "#ffffff",
                strokeWidth: "4",
                fill: "none",
                opacity: "0.5",
                strokeDasharray: "10 12",
                className: "lko-anim-shimmer"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                stroke: "#ffffff",
                strokeWidth: "3",
                strokeLinecap: "round",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 90 340 Q 120 334 150 340",
                        opacity: "0.35"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 240 396 Q 274 389 308 396",
                        opacity: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 560 322 Q 590 316 620 322",
                        opacity: "0.35"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 660 412 Q 696 405 732 412",
                        opacity: "0.3",
                        className: "lko-anim-shimmer",
                        style: {
                            animationDelay: '-1.6s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                className: "lko-sv-bob",
                style: {
                    transformBox: 'fill-box',
                    transformOrigin: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    transform: "translate(150 322)",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M -30 8 Q 0 18 30 8 Q 0 13 -30 8 Z",
                            fill: "#7c4a1e"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 310,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 2 -16 L 4 6",
                            stroke: "#4a2c14",
                            strokeWidth: "3",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 311,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 4 -16 Q 19 -8 8 4 Q 5 -6 4 -16 Z",
                            fill: "#e8a317"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 312,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "-12",
                            cy: "4",
                            r: "4.5",
                            fill: "#5c3a21"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: "-17",
                            y: "-3",
                            width: "9",
                            height: "8",
                            rx: "2.4",
                            fill: "#1b7a43"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/LivingScene.tsx",
                    lineNumber: 309,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 0 450 L 0 396 Q 90 378 190 394 Q 300 412 400 396 Q 510 380 610 398 Q 710 412 800 396 L 800 450 Z",
                fill: m.bank1
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 0 450 L 0 424 Q 110 410 230 424 Q 360 440 500 426 Q 640 412 800 428 L 800 450 Z",
                fill: m.bank2
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 0 428 Q 130 416 260 424 Q 420 434 560 424 Q 690 416 800 424",
                stroke: m.road,
                strokeWidth: "9",
                fill: "none",
                strokeLinecap: "round",
                opacity: "0.85"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M 0 428 Q 130 416 260 424 Q 420 434 560 424 Q 690 416 800 424",
                stroke: "#ffffff",
                strokeWidth: "1.6",
                strokeDasharray: "9 11",
                fill: "none",
                opacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                stroke: m.grass,
                strokeWidth: "3",
                strokeLinecap: "round",
                fill: "none",
                children: [
                    {
                        x: 60,
                        y: 418
                    },
                    {
                        x: 96,
                        y: 432
                    },
                    {
                        x: 205,
                        y: 440
                    },
                    {
                        x: 348,
                        y: 428
                    },
                    {
                        x: 480,
                        y: 442
                    },
                    {
                        x: 610,
                        y: 436
                    },
                    {
                        x: 730,
                        y: 444
                    }
                ].map((g, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M ${g.x} ${g.y} q 3 -10 0 -16 M ${g.x + 7} ${g.y} q 3 -7 6 -12 M ${g.x - 7} ${g.y} q -3 -7 -6 -12`
                    }, i, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 351,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                className: "lko-sv-drive",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    transform: "translate(0 388) scale(1.15)",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 0 30 L 5 12 Q 7 3 18 3 L 39 3 Q 48 3 50 12 L 52 30 Z",
                            fill: "#e8a317"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 359,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 9 14 L 44 14 L 44 25 L 9 25 Z",
                            fill: "#fdf0d5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 360,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 13 6 L 34 6 Q 39 6 40 11 L 41 14 L 11 14 Z",
                            fill: "#bfe3dc"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 362,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "11",
                            cy: "31",
                            r: "6",
                            fill: "#241d16"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 364,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "11",
                            cy: "31",
                            r: "2.4",
                            fill: "#8a8a82"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 365,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "43",
                            cy: "31",
                            r: "6",
                            fill: "#241d16"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 366,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "43",
                            cy: "31",
                            r: "2.4",
                            fill: "#8a8a82"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 367,
                            columnNumber: 11
                        }, this),
                        m.windowsLit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 52 18 L 78 14 L 78 26 L 52 24 Z",
                            fill: "#ffe9a8",
                            opacity: "0.4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LivingScene.tsx",
                            lineNumber: 369,
                            columnNumber: 28
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/LivingScene.tsx",
                    lineNumber: 357,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this),
            isRain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                stroke: "#cfe4ee",
                strokeWidth: "2",
                strokeLinecap: "round",
                opacity: "0.5",
                children: RAIN_LINES.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M ${r.x} ${r.y} l -6 ${r.len}`,
                        className: "lko-sv-rain",
                        style: {
                            animationDelay: r.d
                        }
                    }, i, false, {
                        fileName: "[project]/src/components/game/LivingScene.tsx",
                        lineNumber: 377,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 375,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                y: "330",
                width: "800",
                height: "120",
                fill: "url(#ls-scrim)",
                opacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LivingScene.tsx",
                lineNumber: 388,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LivingScene.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/ChaosBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChaosBanner",
    ()=>ChaosBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — ChaosBanner (M8: THE CHAOS ENGINE)
 * -------------------------------------------------
 * The city's grid + naira mood, one glance: an active transformer outage
 * (with the community fix pool + in-person contribution tiers) and today's
 * cash weather (scarcity / ajo payout). Pure presentation over the store's
 * chaos slice — every naira moves through contributeToPool / bankWithdraw.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function ChaosBanner() {
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.chaos);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const contributeToPool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.contributeToPool);
    const outage = chaos.active;
    const scarcity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isScarcityDay"])(world.day);
    const payout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPayoutDay"])(world.day);
    const inDarkZone = outage !== null && world.currentLocation === outage.zoneId;
    const contributedToday = outage !== null && outage.playerContribDays.includes(world.day);
    const need = outage ? Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget - outage.pool) : 0;
    if (!outage && !scarcity && !payout) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-3 space-y-2",
        children: [
            outage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "chaos-outage",
                className: "rounded-2xl border border-[#c0392b]/30 bg-[#2b1a16] p-3 text-white shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#ffb4a0]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "animate-pulse",
                                                "aria-hidden": true,
                                                children: "⚡"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                                lineNumber: 44,
                                                columnNumber: 17
                                            }, this),
                                            " Blackout — ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][outage.zoneId]?.name ?? outage.zoneId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-[11.5px] font-semibold text-white/70",
                                        children: inDarkZone ? 'Your whole area don go dark — shops dey run blank.' : 'That side don dark. Your side still get light.'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-extrabold tabular-nums",
                                children: [
                                    "Day ",
                                    outage.startedDay,
                                    "→",
                                    outage.minUntilDay
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-white/60",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Community light fund"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tabular-nums",
                                        children: [
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(outage.pool),
                                            " / ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 h-2 overflow-hidden rounded-full bg-white/10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full bg-gradient-to-r from-[#ffb4a0] to-[#ffd166] transition-[width] duration-500",
                                    style: {
                                        width: `${Math.min(100, Math.round(outage.pool / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget * 100))}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this),
                            inDarkZone && !contributedToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex gap-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTiers.map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": `chaos-give-${tier}`,
                                        disabled: player.cash < tier,
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            contributeToPool(tier);
                                        },
                                        className: "lko-press flex-1 rounded-lg bg-[#ffd166] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40",
                                        children: [
                                            "Drop ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                                        ]
                                    }, tier, true, {
                                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                        lineNumber: 74,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                lineNumber: 72,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-[10.5px] font-bold text-white/55",
                                children: need <= 0 ? 'Pool don complete — technician dey come tomorrow morning.' : inDarkZone ? 'You don contribute today — the street dey grateful.' : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(need)} more — contribute from inside the dark zone.`
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, this),
            (scarcity || payout) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                "data-testid": "chaos-money-weather",
                children: [
                    scarcity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#fdecea] px-3 py-1.5 text-[11px] font-extrabold text-[#8a2a20]",
                        children: "💸 Cash scarcity — ATM dey dry · POS levy · fuel na black market"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this),
                    payout && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-3 py-1.5 text-[11px] font-extrabold text-[#1b5e20]",
                        children: "🐷 Ajo payout day — market prices soft small"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/ChaosBanner.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/ChaosBanner.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/ChaosBanner.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/FestivalBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FestivalBanner",
    ()=>FestivalBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — FestivalBanner (M10: THE LIVING CALENDAR)
 * --------------------------------------------------------
 * The city's year, one glance: today's festival (with its venue + the
 * days left), the live seasons (Ramadan's fast, the ram market, Detty
 * December), the next party on the calendar, the wedding on the street,
 * the town union's paving pool, and any meat in your pocket. Pure
 * presentation over the calendar laws — every naira moves through the
 * store's festival actions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
/** The ram market's day count for the chip. */ const A_LEN = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors.ramMarketDays;
function FestivalBanner() {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.calendar);
    const day = world.day;
    const festival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["festivalForDay"])(day);
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nextFestivalFrom"])(day + (festival ? festival.daysLeft : 0));
    const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weddingForCycle"])(day);
    const ramadan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inRamadan"])(day);
    const detty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inDetty"])(day);
    const ramDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ramMarketDayIndex"])(day);
    const ramPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ramPriceFor"])(day);
    const paving = calendar.paving;
    const quiet = !festival && !ramadan && !detty && ramDay === 0 && !wedding.isToday && wedding.inDays > 2 && !paving && calendar.meatPacks === 0;
    if (quiet) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "festival-next",
                className: "flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 py-2 text-[11px] font-extrabold text-[var(--lko-ink-soft)] shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: next.festival.icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        children: [
                            "Next on the calendar: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[var(--lko-ink)]",
                                children: next.festival.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                lineNumber: 56,
                                columnNumber: 35
                            }, this),
                            " — in ",
                            next.inDays,
                            " day",
                            next.inDays === 1 ? '' : 's'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/FestivalBanner.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-3 space-y-2",
        children: [
            festival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "festival-today",
                className: "rounded-2xl border border-[#8a5a00]/25 bg-gradient-to-r from-[#fff8ec] to-[#fdeecd] p-3 shadow-[var(--lko-shadow-sm)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#8a5a00]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            children: festival.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        festival.name,
                                        festival.daysLeft > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full bg-[#8a5a00]/10 px-1.5 py-0.5 text-[9px] font-black",
                                            children: [
                                                "day 1 of ",
                                                festival.daysLeft
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                            lineNumber: 75,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-[11.5px] font-semibold text-[#4a3200]",
                                    children: festival.note
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-[10.5px] font-bold text-[#8a5a00]/80",
                                    children: [
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][festival.venueId]?.name ?? festival.venueId,
                                        festival.daysLeft > 1 ? ` — runs ${festival.daysLeft} days` : ' — today only'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/FestivalBanner.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "shrink-0 rounded-full bg-white/70 px-2 py-1 text-[10px] font-extrabold tabular-nums text-[#8a5a00]",
                            children: [
                                "Year ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yearOf"])(day)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/FestivalBanner.tsx",
                            lineNumber: 84,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/FestivalBanner.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            (ramadan || detty || ramDay > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                "data-testid": "festival-seasons",
                children: [
                    ramadan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "festival-chip-ramadan",
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-extrabold text-[#1e3a8a]",
                        children: "🌙 Ramadan — fast dey run · iftar for evening · night market deep"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, this),
                    ramDay > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "festival-chip-ram-market",
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#fdf2e9] px-3 py-1.5 text-[11px] font-extrabold text-[#9a4b12]",
                        children: [
                            "🐏 Ram market day ",
                            ramDay,
                            "/",
                            A_LEN,
                            " — ram na ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(ramPrice),
                            " for Kpata"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, this),
                    detty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "festival-chip-detty",
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1.5 text-[11px] font-extrabold text-[#14532d]",
                        children: [
                            "🎉 Detty December — returnees don land · prices ×",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.detty,
                            " · gigs ×",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.detty
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            wedding.isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "festival-wedding",
                className: "flex items-center gap-2 rounded-2xl border border-[#9d174d]/20 bg-[#fdf2f8] px-3 py-2 text-[11px] font-extrabold text-[#9d174d]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "💍"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        children: [
                            wedding.couple,
                            " dey wed TODAY at ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][wedding.venueId]?.name ?? wedding.venueId,
                            " — aso-ebi dey Kpata"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 112,
                columnNumber: 9
            }, this),
            paving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "festival-paving",
                className: "rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": true,
                                        children: "🛣️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this),
                                    " Town union paving — ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][paving.zoneId]?.name ?? paving.zoneId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tabular-nums",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(paving.pool),
                                    " / ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-gradient-to-r from-[#86c99b] to-[var(--lko-green)] transition-[width] duration-500",
                            style: {
                                width: `${Math.min(100, Math.round(paving.pool / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget * 100))}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/FestivalBanner.tsx",
                            lineNumber: 131,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: paving.zoneId === world.currentLocation ? 'You dey inside the project zone — drop your tier for the day.' : `Contribute from inside ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][paving.zoneId]?.name ?? paving.zoneId}. Finished streets ride 15% faster for ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedDays} days.`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this),
            calendar.meatPacks > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "festival-packs",
                className: "flex items-center gap-2 rounded-2xl border border-[#9a3412]/20 bg-[#fff7ed] px-3 py-2 text-[11px] font-extrabold text-[#9a3412]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "🍖"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        children: [
                            calendar.meatPacks,
                            " meat pack",
                            calendar.meatPacks === 1 ? '' : 's',
                            " in your cooler — share am with your paddies"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this),
            !festival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "festival-next",
                className: "flex items-center gap-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: next.festival.icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalBanner.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    "Next: ",
                    next.festival.name,
                    " — in ",
                    next.inDays,
                    " day",
                    next.inDays === 1 ? '' : 's'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalBanner.tsx",
                lineNumber: 154,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/FestivalBanner.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/RiversBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RiversBanner",
    ()=>RiversBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — RiversBanner (M11: THE RIVERS AWAKE)
 * ---------------------------------------------------
 * The river at a glance: the Niger's level gauge (the water keeps its
 * own year), the zones it holds today (ferry + walkway verdicts), the
 * cold-room rescue bowl when the deep surge wakes it, the sandbag
 * compound line, and the toll bowls waiting for their owner. Pure
 * presentation over the river laws — every naira moves through the
 * store's river actions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
/** The level's honest word: what the water is doing to the city today. */ function levelVerdict(level) {
    if (level <= 0.01) return {
        label: 'Dry season — the river dey sleep inside him banks.',
        tone: 'text-[var(--lko-green-deep)]'
    };
    if (level < 0.35) return {
        label: 'The river dey rise small — low-lying eyes dey watch am.',
        tone: 'text-[#8a5a00]'
    };
    if (level < 0.55) return {
        label: 'The riverfront don go under — canoes dey work.',
        tone: 'text-[#0c4a6e]'
    };
    if (level < 0.75) return {
        label: 'Ganaja road don drown — the city dey paddle.',
        tone: 'text-[#9a4b12]'
    };
    return {
        label: 'PEAK SURGE — even Kpata dey drink. The whole city na waterfront.',
        tone: 'text-[#7f1d1d]'
    };
}
function RiversBanner() {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const rivers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.rivers);
    const day = world.day;
    const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverLevelFor"])(day);
    const cut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cutZonesFor"])(day);
    const rescue = rivers.rescue;
    const walkwayZones = Object.entries(rivers.walkways).filter(([, w])=>w.laid > 0);
    const quiet = level <= 0.01 && !rescue && walkwayZones.length === 0 && rivers.sandbags === 0;
    if (quiet) return null;
    const verdict = levelVerdict(level);
    const pct = Math.round(level * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-3 space-y-2",
        "data-testid": "rivers-banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-[#0c4a6e]/20 bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] p-3 shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": true,
                                        children: "🌊"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    " The Niger — ",
                                    pct,
                                    "% full"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversBanner.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tabular-nums font-bold normal-case",
                                children: RIVER_ZONE_LABEL(cut)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/RiversBanner.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/[0.06]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "data-testid": "rivers-gauge",
                            className: "h-full rounded-full bg-gradient-to-r from-[#7dd3fc] via-[#38bdf8] to-[#0c4a6e] transition-[width] duration-500",
                            style: {
                                width: `${Math.max(3, pct)}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/RiversBanner.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `mt-1.5 text-[10.5px] font-bold ${verdict.tone}`,
                        children: verdict.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversBanner.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            cut.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                "data-testid": "rivers-cuts",
                children: cut.map((zoneId)=>{
                    const left = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["segmentsLeft"])(rivers, zoneId);
                    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["walkwayOpen"])(rivers, zoneId);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": `rivers-cut-${zoneId}`,
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#0c4a6e]/10 px-3 py-1.5 text-[11px] font-extrabold text-[#0c4a6e]",
                        children: [
                            "🌊 ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.shortName ?? zoneId,
                            " cut",
                            open ? ' · walkway open — walk careful' : left > 0 ? ` · walkway: ${left} segment${left === 1 ? '' : 's'} left` : ' · ferry na the road now'
                        ]
                    }, zoneId, true, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 78,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/RiversBanner.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this),
            rescue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-[#9a3412]/20 bg-white p-3 shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": true,
                                        children: "🧊"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this),
                                    " Cold-room rescue — ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][rescue.zoneId]?.name ?? rescue.zoneId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversBanner.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tabular-nums",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(rescue.pool),
                                    " / ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversBanner.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "data-testid": "rivers-rescue-pool",
                            className: "h-full rounded-full bg-gradient-to-r from-[#fdba74] to-[#ea580c] transition-[width] duration-500",
                            style: {
                                width: `${Math.min(100, Math.round(rescue.pool / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget * 100))}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/RiversBanner.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: rescue.zoneId === world.currentLocation ? 'You dey inside the cold-room zone — drop your tier for the day.' : `Contribute from inside ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][rescue.zoneId]?.name ?? rescue.zoneId}. Full bowl = the trucks roll to the Patti high ground.`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversBanner.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this),
            (rivers.sandbags > 0 || walkwayZones.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                "data-testid": "rivers-compound",
                children: [
                    rivers.sandbags > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-3 py-1.5 text-[11px] font-extrabold text-[#92400e]",
                        children: [
                            "🧱 ",
                            rivers.sandbags,
                            " Crusher sack",
                            rivers.sandbags === 1 ? '' : 's',
                            " in your compound"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversBanner.tsx",
                        lineNumber: 125,
                        columnNumber: 13
                    }, this),
                    walkwayZones.map(([zoneId, w])=>{
                        const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["walkwayOpen"])(rivers, zoneId);
                        const tier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[w.tollTier] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[0];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-3 py-1.5 text-[11px] font-extrabold text-[#14532d]",
                            children: [
                                "🛤️ ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.shortName ?? zoneId,
                                ": ",
                                open ? `walkway open · toll ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} · bowl ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(w.pot)}` : `${w.laid}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].segments[zoneId]} segments laid`
                            ]
                        }, zoneId, true, {
                            fileName: "[project]/src/components/game/RiversBanner.tsx",
                            lineNumber: 133,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversBanner.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/RiversBanner.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
/** The cut-zone count's honest word for the gauge header. */ function RIVER_ZONE_LABEL(cut) {
    if (cut.length === 0) return 'all roads open';
    return `${cut.length} zone${cut.length === 1 ? '' : 's'} under water`;
}
}),
"[project]/src/components/game/LadderBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LadderBanner",
    ()=>LadderBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — LadderBanner (M12: THE LADDER)
 * ---------------------------------------------
 * The life above the hustle, one glance: the FUL semester clock (with
 * the ASUU strike when the gate freezes), the rent book / the owned
 * roof, the JAPA document chain (five honest steps), and the MOPOL
 * detail when the convoy calls. Pure presentation over the ladder
 * laws — every naira moves through the store's ladder actions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function LadderBanner() {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.education);
    const housing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.housing);
    const japa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.japa);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const day = world.day;
    const ed = education;
    const prop = housing.owned ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["propertyFor"])(housing.owned) : null;
    const comfort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["homeComfort"])(housing);
    const escort = civic ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["escortAvailable"])(japa, day, civic.kgirs.warrant) : false;
    const quiet = !ed.enrolled && !ed.graduated && !prop && housing.rentOwed === 0 && japa.nimcDay === 0 && japa.flownDay === 0 && !escort;
    if (quiet) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "ladder-next",
                className: "flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 py-2 text-[11px] font-extrabold text-[var(--lko-ink-soft)] shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "🪜"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        children: [
                            "The ladder dey wait — ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[var(--lko-ink)]",
                                children: "FUL enrollment · your own house · the JAPA file"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LadderBanner.tsx",
                                lineNumber: 51,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderBanner.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/LadderBanner.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this);
    }
    const steps = [
        {
            id: 'nimc',
            label: 'NIMC',
            done: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'nimc')
        },
        {
            id: 'passport',
            label: 'Passport',
            done: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'passport')
        },
        {
            id: 'clearance',
            label: 'KGIRS',
            done: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'clearance')
        },
        {
            id: 'police',
            label: 'Police',
            done: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'police')
        },
        {
            id: 'flight',
            label: 'JAPA',
            done: japa.flownDay > 0
        }
    ];
    const semDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["semesterDayOf"])(ed, day);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-3 space-y-2",
        "data-testid": "ladder-banner",
        children: [
            (ed.enrolled || ed.graduated) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-[#1d5c8a]/20 bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] p-3 shadow-[var(--lko-shadow-sm)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": true,
                                        children: "🎓"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    " FUL — ",
                                    ed.graduated ? 'GRADUATE' : `Semester ${ed.semester}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].education.semestersToGraduate}`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/LadderBanner.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            !ed.graduated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tabular-nums font-bold normal-case",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isExamWindow"])(ed, day) ? 'EXAM WINDOW' : `lecture day ${semDay}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LadderBanner.tsx",
                                lineNumber: 77,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this),
                    !ed.graduated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-center gap-1.5",
                        children: [
                            Array.from({
                                length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].education.lecturesNeeded
                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `h-1.5 flex-1 rounded-full ${i < ed.lecturesDone ? 'bg-[#1d5c8a]' : 'bg-black/[0.08]'}`
                                }, i, false, {
                                    fileName: "[project]/src/components/game/LadderBanner.tsx",
                                    lineNumber: 85,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 text-[10px] font-black tabular-nums text-[#1d5c8a]",
                                children: [
                                    ed.lecturesDone,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].education.lecturesNeeded
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/LadderBanner.tsx",
                                lineNumber: 90,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 83,
                        columnNumber: 13
                    }, this),
                    !ed.graduated && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isStrikeDay"])(ed, day) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        "data-testid": "ladder-strike",
                        className: "mt-1.5 text-[10.5px] font-extrabold text-[#9a3412]",
                        children: [
                            "🚧 ASUU strike — the gate don lock (",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strikeDaysLeft"])(ed, day),
                            " day",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strikeDaysLeft"])(ed, day) === 1 ? '' : 's',
                            " more)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 96,
                        columnNumber: 13
                    }, this),
                    ed.graduated && !ed.convocationAttended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[10.5px] font-extrabold text-[#1d5c8a]",
                        children: "🎓 Convocation coming — go collect the certificate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 101,
                        columnNumber: 13
                    }, this),
                    ed.convocationAttended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[10.5px] font-bold text-[#1d5c8a]/80",
                        children: "Certificate in hand — the career desks don open"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderBanner.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this),
            (prop || housing.rentOwed > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "ladder-housing",
                className: `flex items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-extrabold ${prop ? 'border-[#14532d]/20 bg-[#f0fdf4] text-[#14532d]' : housing.rentOwed >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].housing.baseRent * 2 ? 'border-[#7f1d1d]/25 bg-[#fef2f2] text-[#7f1d1d]' : 'border-black/[0.06] bg-white text-[var(--lko-ink)]'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: prop ? '🏠' : '🔑'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        children: prop ? `${prop.name} — yours · comfort ${comfort}` : `Rent owed: ${Math.round(housing.rentOwed) >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].housing.baseRent * 2 ? 'TWO CYCLES BEHIND — quit notice dey table' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(housing.rentOwed)}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    housing.wahala && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        className: "animate-pulse",
                        children: "⚠️"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 118,
                        columnNumber: 30
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderBanner.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this),
            (japa.nimcReadyDay > 0 || japa.flownDay > 0 || escort) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-1.5",
                "data-testid": "ladder-japa",
                children: [
                    steps.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            "data-testid": `japa-step-${s.id}`,
                            className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${s.done ? 'bg-[#ecfdf5] text-[#14532d]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                            children: [
                                s.done ? '✓' : '·',
                                " ",
                                s.label
                            ]
                        }, s.id, true, {
                            fileName: "[project]/src/components/game/LadderBanner.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this)),
                    escort && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "ladder-escort",
                        className: "inline-flex items-center gap-1 rounded-full bg-[#7f1d1d] px-2.5 py-1 text-[10.5px] font-extrabold text-white",
                        children: "🚨 MOPOL detail dey call — the convoy assembles at GRA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderBanner.tsx",
                        lineNumber: 135,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderBanner.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LadderBanner.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/PulseBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PulseBanner",
    ()=>PulseBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — PulseBanner (M15: THE CITY PULSE)
 * -------------------------------------------------
 * The city's newspaper, one glance on the Dashboard: today's loudest
 * headline (the weight law's top item), the unread count, and the
 * deep-link into the handset's City Pulse app. Pure presentation over
 * the DERIVED feed — the banner stores nothing, pays nothing.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/PhoneScreen.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function PulseBanner({ onOpenPhone }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.chaos);
    const rivers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.rivers);
    const calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.calendar);
    const cityPulse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.cityPulse);
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pulseForDay"])({
            day: world.day,
            weather: world.weather,
            chaos,
            civic,
            rivers,
            calendar
        }), [
        world.day,
        world.weather,
        chaos,
        civic,
        rivers,
        calendar
    ]);
    const top = items[0];
    const unread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pulseUnread"])(cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshPulseState"])(), items);
    // the quiet-day line never earns a banner — a calm city needs no megaphone
    if (items.length === 1 && items[0].kind === 'quiet') return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "data-testid": "pulse-banner",
        onClick: ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openPhoneApp"])('pulse');
            onOpenPhone();
        },
        className: "lko-press mb-3 flex w-full items-start gap-2.5 rounded-2xl border border-[#0d4d2a]/15 bg-gradient-to-r from-[#e8f5e9] to-[#f1f8f2] p-3 text-left shadow-[var(--lko-shadow-sm)]",
        "aria-label": "Open the City Pulse newspaper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mt-0.5 text-xl",
                "aria-hidden": true,
                children: top.icon
            }, void 0, false, {
                fileName: "[project]/src/components/game/PulseBanner.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-green-deep)]",
                        children: [
                            "📰 City Pulse",
                            unread > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-testid": "pulse-banner-unread",
                                className: "rounded-full bg-[var(--lko-green)] px-1.5 py-px text-[9px] text-white",
                                children: [
                                    unread,
                                    " new"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/PulseBanner.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/PulseBanner.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-0.5 block truncate text-[12.5px] font-extrabold leading-snug text-[var(--lko-ink)]",
                        children: top.headline
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/PulseBanner.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-0.5 block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: top.body
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/PulseBanner.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/PulseBanner.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mt-1 shrink-0 text-[10px] font-extrabold text-[var(--lko-green)]",
                children: [
                    items.length,
                    " more →"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/PulseBanner.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/PulseBanner.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/CasualShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoalsCard",
    ()=>GoalsCard,
    "OnboardingCard",
    ()=>OnboardingCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M9: THE CASUAL SHELL (dashboard cards)
 * -----------------------------------------------------
 * GoalsCard: today's three honest goals with live progress, the naira
 * each pays, and the streak. OnboardingCard: the Street Certified arc
 * (travel → work → meal → earn) that doubles as the Guest Loop's tour.
 * Both read the SAME pure laws the store executes — display can never
 * drift from the rules.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/goals.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function GoalsCard() {
    const goals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.goals);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.account);
    // the lazy day-roll: reads roll today's three the same way the store does
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureGoals"])(goals, world.day);
    const defs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["goalsFor"])(state);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "data-testid": "goals-card",
        className: "mb-3 rounded-2xl border border-[var(--lko-line)] bg-white p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                        children: "🎯 Today's goals"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/CasualShell.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    state.streak > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1 rounded-full bg-[#fff3e0] px-2 py-0.5 text-[10.5px] font-extrabold text-[#b35400]",
                        children: [
                            "🔥 ",
                            state.streak,
                            "-day streak"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/CasualShell.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/CasualShell.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-1.5",
                children: defs.map((g, i)=>{
                    const done = state.done[i];
                    const prog = state.progress[g.id] ?? 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: `flex items-center gap-2 rounded-xl px-2.5 py-2 ${done ? 'bg-[var(--lko-green-soft)]' : 'bg-black/[0.035]'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${done ? 'bg-[var(--lko-green)] text-white' : 'bg-white text-[var(--lko-ink-soft)]'}`,
                                "aria-hidden": true,
                                children: done ? '✓' : prog
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/CasualShell.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `min-w-0 flex-1 truncate text-[12px] font-bold ${done ? 'text-[var(--lko-green-deep)] line-through opacity-80' : 'text-[var(--lko-ink)]'}`,
                                children: [
                                    g.label,
                                    g.target > 1 && !done ? ` (${prog}/${g.target})` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/CasualShell.tsx",
                                lineNumber: 56,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `shrink-0 text-[11px] font-extrabold tabular-nums ${done ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-gold-deep)]'}`,
                                children: done ? 'paid' : `+${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(g.cash)}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/CasualShell.tsx",
                                lineNumber: 60,
                                columnNumber: 15
                            }, this)
                        ]
                    }, g.id, true, {
                        fileName: "[project]/src/components/game/CasualShell.tsx",
                        lineNumber: 44,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/CasualShell.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            !account.linked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                children: "Guest mode — claim your name before you leave the starter streets to lock these in on the cloud."
            }, void 0, false, {
                fileName: "[project]/src/components/game/CasualShell.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/CasualShell.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
function OnboardingCard() {
    const onboarding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.onboarding);
    if (onboarding.done.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].onboardingSteps.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "data-testid": "onboarding-card",
        className: "mb-3 rounded-2xl border border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)]/30 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "mb-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "🧭 Learn the streets"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/CasualShell.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "tabular-nums",
                        children: [
                            onboarding.done.length,
                            "/",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].onboardingSteps.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/CasualShell.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/CasualShell.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-1",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].onboardingSteps.map((step)=>{
                    const done = onboarding.done.includes(step.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-2 text-[11.5px] font-bold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${done ? 'bg-[var(--lko-green)] text-white' : 'border border-black/15 bg-white text-[var(--lko-ink-soft)]'}`,
                                "aria-hidden": true,
                                children: done ? '✓' : ''
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/CasualShell.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: done ? 'text-[var(--lko-ink-soft)] line-through' : 'text-[var(--lko-ink)]',
                                children: step.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/CasualShell.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, this),
                            !done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 flex-1 truncate text-right text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                                children: step.hint
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/CasualShell.tsx",
                                lineNumber: 102,
                                columnNumber: 25
                            }, this)
                        ]
                    }, step.id, true, {
                        fileName: "[project]/src/components/game/CasualShell.tsx",
                        lineNumber: 92,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/CasualShell.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 text-[10.5px] font-extrabold text-[var(--lko-gold-deep)]",
                children: [
                    "Finish all four — ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].onboardingReward),
                    " + the Street Certified badge go land."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/CasualShell.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/CasualShell.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/GuestGate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GuestGate",
    ()=>GuestGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M9: THE GUEST LOOP (the gate)
 * --------------------------------------------
 * "Lokoja knows your face. Claim your name to keep going."
 * Play-first, login-to-continue: the modal stands before forward travel
 * for unlinked guests. Claim (register) or Return (login) — the store's
 * merge law decides what continues, and nothing is ever lost.
 * "Maybe later" buys the rest of TODAY through the honest grace law.
 *
 * M21 A11Y FIX (teardown finding): the gate's ACTION buttons carry the
 * probeable law — REAL native <button> elements, explicit type="button",
 * aria-labels, and the canonical data-testids automation can trust:
 * `guest-claim` (the primary claim/return action) and `guest-enter`
 * (enter without claiming — the one-day grace). LOGIC, VERDICTS AND
 * STORE DOORS ARE UNTOUCHED — this is markup/a11y only.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-ssr] (ecmascript)");
'use client';
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
function GuestGate() {
    const gateOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.gateOpen);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.account);
    const acceptGateGrace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.acceptGateGrace);
    const closeGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.closeGate);
    const registerAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.registerAccount);
    const loginAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.loginAccount);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('claim');
    const [handle, setHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [contact, setContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [pin, setPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [birthYear, setBirthYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(String(NOW_YEAR - 20));
    const [parentPin, setParentPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [why, setWhy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // M13 — the family shield reads the birth year LIVE: a minor claims
    // behind a parent PIN and collects NOTHING (no contact field at all).
    const band = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ageBandForYear"])(Number(birthYear), NOW_YEAR);
    const minor = band !== null && band !== 'adult';
    if (!gateOpen || account.linked) return null;
    const submit = async ()=>{
        setBusy(true);
        setWhy(null);
        try {
            // W1 — THE BODY YOU BUILT IS THE FACE YOU CLAIM. A guest in the
            // world already walked out of CharacterCreation: the claim adopts
            // THAT look — no second picker, no divergence between the save
            // and the street. (The landing sheet picks a look fresh — no body
            // exists there yet.)
            const look = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().player?.avatar;
            const res = mode === 'claim' ? await registerAccount({
                handle,
                contact,
                pin,
                birthYear: Number(birthYear),
                parentPin: minor ? parentPin : undefined,
                displayName: handle,
                avatarLook: look ? JSON.stringify(look) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_LOOK_JSON"],
                bio: ''
            }) : await loginAccount({
                handle,
                pin
            });
            if (!res.ok) {
                setWhy(res.why ?? 'E no gree — try again.');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('notify');
            }
        } finally{
            setBusy(false);
        }
    };
    const clientWhy = mode === 'claim' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateHandle"])(handle).ok === false && handle.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateHandle"])(handle).why : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateContact"])(contact).ok === false && contact.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateContact"])(contact).why : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validatePin"])(pin).ok === false && pin.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validatePin"])(pin).why : null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validatePin"])(pin).ok === false && pin.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validatePin"])(pin).why : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center",
        role: "dialog",
        "aria-modal": true,
        "aria-label": "Claim your name",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-testid": "guest-gate",
            className: "lko-fade w-full max-w-md rounded-t-3xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-4 shadow-2xl sm:rounded-3xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "lko-display text-lg leading-tight",
                                    children: "Lokoja knows your face"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                    children: "Claim your name to keep going — your hustle dey safe, nothing dey lost."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                closeGate();
                            },
                            "aria-label": "Close",
                            className: "lko-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/GuestGate.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1",
                    children: [
                        'claim',
                        'return'
                    ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                setMode(m);
                                setWhy(null);
                            },
                            className: `lko-press rounded-lg px-2 py-1.5 text-[12px] font-extrabold ${mode === m ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`,
                            "aria-label": m === 'claim' ? 'Claim a new name' : 'Return to a claimed name',
                            children: m === 'claim' ? '🪪 Claim a name' : '🔁 I don claim before'
                        }, m, false, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/game/GuestGate.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            "data-testid": "gate-handle",
                            className: "w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]",
                            placeholder: "Your street name (e.g. ada_hustle)",
                            value: handle,
                            maxLength: 16,
                            onChange: (e)=>setHandle(e.target.value),
                            autoComplete: "username"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this),
                        mode === 'claim' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                minor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "data-testid": "gate-minor-branch",
                                    className: "rounded-xl border-2 border-[var(--lko-gold)] bg-[var(--lko-gold-soft)] px-3 py-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-extrabold leading-snug text-[#6b4a08]",
                                        children: [
                                            "🛡️ Family Shield — ",
                                            band === 'kid' ? 'pikin' : 'teen',
                                            " account. A parent sets the shield PIN. We collect NOTHING: no phone, no email, no contact — the PIN is the only key."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/GuestGate.tsx",
                                        lineNumber: 150,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "data-testid": "gate-contact",
                                    className: "w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]",
                                    placeholder: "Phone or email — optional now, the recovery line",
                                    value: contact,
                                    onChange: (e)=>setContact(e.target.value),
                                    autoComplete: "tel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                    lineNumber: 156,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "shrink-0 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                                            htmlFor: "gate-year",
                                            children: "Born"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/GuestGate.tsx",
                                            lineNumber: 166,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            id: "gate-year",
                                            "data-testid": "gate-year",
                                            className: "flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]",
                                            value: birthYear,
                                            onChange: (e)=>setBirthYear(e.target.value),
                                            children: YEARS.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: y,
                                                    children: y
                                                }, y, false, {
                                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/GuestGate.tsx",
                                            lineNumber: 169,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 rounded-full bg-black/[0.05] px-2 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: band === null ? '6+' : band === 'kid' ? '🛡️ pikin' : band === 'teen' ? '🛡️ teen' : '18+'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/GuestGate.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this),
                                minor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "data-testid": "gate-parent-pin",
                                    className: "w-full rounded-xl border-2 border-[var(--lko-gold)] bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.3em] outline-none focus:border-[var(--lko-green)]",
                                    placeholder: "Parent shield PIN (6 digits)",
                                    value: parentPin,
                                    maxLength: 6,
                                    inputMode: "numeric",
                                    onChange: (e)=>setParentPin(e.target.value.replace(/\D/g, '')),
                                    autoComplete: "new-password"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GuestGate.tsx",
                                    lineNumber: 185,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            "data-testid": "gate-pin",
                            className: "w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.3em] outline-none focus:border-[var(--lko-green)]",
                            placeholder: "PIN (4–8 digits)",
                            value: pin,
                            maxLength: 8,
                            inputMode: "numeric",
                            onChange: (e)=>setPin(e.target.value.replace(/\D/g, '')),
                            autoComplete: mode === 'claim' ? 'new-password' : 'current-password'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/GuestGate.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this),
                (why ?? clientWhy) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    "data-testid": "gate-why",
                    className: "mt-2 rounded-lg bg-[#fdecea] px-2.5 py-1.5 text-[11px] font-bold text-[#8a2a20]",
                    children: why ?? clientWhy
                }, void 0, false, {
                    fileName: "[project]/src/components/game/GuestGate.tsx",
                    lineNumber: 211,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "data-testid": "guest-claim",
                    disabled: busy || handle.length < 3 || pin.length < 4 || mode === 'claim' && minor && parentPin.length !== 6,
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        void submit();
                    },
                    "aria-label": mode === 'claim' ? 'Claim my name — register' : 'Return to my name — login',
                    className: "lko-press mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--lko-green)] text-[14px] font-extrabold text-white disabled:opacity-40",
                    children: busy ? 'The register dey write…' : mode === 'claim' ? minor ? 'Claim with the parent shield' : 'Claim my name' : 'Return to my name'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/GuestGate.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-2 flex items-center justify-between gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                            children: "Guests play free — the cloud save, streaks and leaderboards wait behind the name."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-testid": "guest-enter",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                acceptGateGrace();
                            },
                            "aria-label": "Maybe later — enter now with the one-day grace",
                            className: "lko-press shrink-0 rounded-lg bg-black/[0.05] px-3 py-2 text-[11.5px] font-extrabold text-[var(--lko-ink-soft)]",
                            children: "Maybe later"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GuestGate.tsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/GuestGate.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/GuestGate.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/GuestGate.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/Juice.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MoneyPop",
    ()=>MoneyPop,
    "Shockwave",
    ()=>Shockwave
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M9 JUICE (the dopamine layer)
 * --------------------------------------------
 * MoneyPop: every honest naira earned floats a "+₦X" chip up from the
 * money pill. Shockwave: every level-up sends one expanding ring across
 * the screen. SILK law: transform/opacity ONLY, zero effect-setState,
 * zero layout reads — the CSS animation runs its course and the fill
 * leaves the node invisible until the next pulse remounts it.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function MoneyPop() {
    const pulse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.pulse);
    if (!pulse) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-testid": "money-pop",
        className: "pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center",
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "lko-display rounded-full bg-[var(--lko-green)] px-3 py-1 text-sm text-white shadow-lg",
            style: {
                animation: 'lko-pop-rise 1s ease-out forwards'
            },
            children: [
                "+",
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(pulse.amount)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/Juice.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, pulse.id, false, {
        fileName: "[project]/src/components/game/Juice.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
function Shockwave() {
    const shockwave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.shockwave);
    if (shockwave <= 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none absolute inset-0 z-20 overflow-hidden",
        "aria-hidden": true,
        "data-testid": "shockwave-layer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "absolute left-1/2 top-1/3 h-24 w-24 rounded-full border-4 border-[var(--lko-gold)]",
            style: {
                animation: 'lko-shockwave 0.85s ease-out forwards',
                transform: 'translate(-50%, -50%)',
                opacity: 0
            }
        }, shockwave, false, {
            fileName: "[project]/src/components/game/Juice.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/Juice.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/geo-map.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// GENERATED by scripts/geo/generate_world.py — DO NOT hand-edit.
// 2D map geometry from the SAME real Lokoja data as the 3D world (OpenStreetMap, ODbL).
__turbopack_context__.s([
    "GEO_MAP_BRIDGES",
    ()=>GEO_MAP_BRIDGES,
    "GEO_MAP_LABELS",
    ()=>GEO_MAP_LABELS,
    "GEO_MAP_MAIN",
    ()=>GEO_MAP_MAIN,
    "GEO_MAP_MINOR",
    ()=>GEO_MAP_MINOR,
    "GEO_MAP_RIVERS",
    ()=>GEO_MAP_RIVERS,
    "GEO_MAP_TRUNK",
    ()=>GEO_MAP_TRUNK,
    "GEO_MAP_WATER",
    ()=>GEO_MAP_WATER
]);
const GEO_MAP_TRUNK = [
    "M34.1 53.0 L34.2 54.1 L34.5 54.8 L34.9 55.2 L35.4 55.5 L40.2 57.5 L41.0 58.2 L41.6 59.3 L41.7 60.4 L41.6 66.2 L41.8 68.1 L42.0 69.3 L43.4 74.5 L43.9 80.8 L44.2 81.8 L45.4 84.8",
    "M45.5 84.8 L44.4 82.3 L44.0 80.9 L43.4 74.4 L42.2 69.7 L41.8 68.0 L41.7 66.1 L41.8 60.4 L41.7 59.2 L41.1 58.1 L40.3 57.4 L35.0 55.2 L34.6 54.8 L34.3 54.2 L34.2 53.7 L34.2 53.0",
    "M61.8 92.8 L62.3 91.0 L63.0 89.0 L63.4 88.6 L65.1 87.8 L67.4 87.6 L69.0 86.9 L72.5 87.8 L75.2 88.7 L76.4 88.6 L78.2 88.9 L78.9 88.6 L79.6 86.8 L79.9 86.6 L80.1 86.5 L81.4 87.2",
    "M27.5 6.8 L28.7 7.0 L31.2 7.9 L44.3 14.0 L45.1 14.1 L45.8 14.1 L46.4 13.8 L47.7 13.1",
    "M47.6 13.0 L45.8 14.0 L44.5 14.0 L30.7 7.6 L29.0 7.0 L27.6 6.8",
    "M47.5 31.9 L47.4 29.2 L47.1 27.9 L47.1 27.1 L47.3 25.7 L48.1 21.7 L47.9 20.9 L47.7 18.7 L47.5 18.1 L46.5 16.5 L45.4 15.5 L45.3 15.2 L45.7 14.1",
    "M45.0 38.4 L43.9 41.2 L44.0 42.3 L43.7 44.2 L42.7 45.5 L42.1 46.1 L41.3 46.3 L38.2 46.3 L37.2 46.6 L32.1 47.9",
    "M32.3 48.0 L34.4 47.3 L37.2 46.7 L38.2 46.3 L41.3 46.3 L42.2 46.1 L42.7 45.6 L43.8 44.1 L44.0 42.3 L44.0 41.1 L45.0 38.4",
    "M45.6 14.1 L45.3 14.9 L45.2 15.3 L46.5 16.6 L47.4 18.1 L47.7 18.8 L47.8 20.8 L48.1 21.7 L47.3 25.6 L47.1 27.5",
    "M48.5 12.6 L50.3 11.5 L51.5 10.5 L52.3 9.7 L53.2 8.5 L53.9 7.1 L54.3 5.7 L55.0 1.5",
    "M54.9 1.5 L54.6 3.8 L54.1 6.1 L53.9 7.5 L52.8 8.8 L52.3 9.6 L51.1 10.8 L50.1 11.5 L48.5 12.6",
    "M54.9 97.5 L55.1 97.2 L56.8 96.4 L57.6 95.5 L61.0 94.1 L61.3 93.8 L61.8 92.8",
    "M34.3 52.3 L34.3 51.3 L33.9 50.2 L33.4 49.6 L32.0 48.4",
    "M32.0 48.5 L33.4 49.7 L34.0 50.4 L34.3 51.3 L34.2 52.3",
    "M47.1 27.5 L47.4 29.2 L47.4 31.9",
    "M47.4 31.9 L47.5 36.1",
    "M47.6 36.1 L47.5 31.9",
    "M45.5 84.9 L46.3 85.6 L47.4 86.2 L47.5 86.5",
    "M45.0 38.4 L45.4 37.1 L45.5 36.0",
    "M45.4 36.0 L45.4 37.0 L45.0 38.4",
    "M47.5 36.1 L45.5 35.9",
    "M45.5 36.0 L47.5 36.2",
    "M30.5 48.4 L31.5 48.2",
    "M31.5 48.0 L30.6 48.3",
    "M31.2 48.3 L32.0 48.5",
    "M32.0 48.1 L31.8 47.8 L31.5 48.0",
    "M31.5 48.0 L31.7 48.3 L32.0 48.1",
    "M34.2 52.3 L34.1 53.0",
    "M34.2 53.0 L34.3 52.3",
    "M45.4 35.9 L45.4 36.0 L45.5 36.0 L45.5 35.9 L45.4 35.9",
    "M45.4 84.8 L45.4 84.9 L45.5 84.9 L45.5 84.8 L45.4 84.8",
    "M32.0 48.4 L32.1 48.0",
    "M45.6 14.3 L45.8 14.1",
    "M32.1 47.9 L31.9 47.9",
    "M45.4 14.1 L45.5 14.3",
    "M32.0 48.4 L31.9 48.2",
    "M31.8 48.4 L32.0 48.5",
    "M32.1 48.0 L32.3 48.0",
    "M31.8 48.3 L31.8 48.4",
    "M32.0 48.0 L32.1 48.0",
    "M47.5 36.2 L47.6 36.2",
    "M48.5 12.6 L47.7 13.0",
    "M47.7 13.0 L48.5 12.6",
    "M47.6 36.2 L47.6 36.1",
    "M47.6 36.1 L47.5 36.1",
    "M47.5 36.1 L47.5 36.2",
    "M43.7 78.1 L43.7 78.1",
    "M41.7 60.9 L41.8 60.9",
    "M41.6 64.5 L41.7 64.4",
    "M31.6 48.3 L31.7 48.3",
    "M47.7 13.1 L47.7 13.0",
    "M47.7 13.0 L47.6 13.0",
    "M44.1 81.7 L44.2 81.6",
    "M43.5 74.8 L43.4 74.8",
    "M33.7 50.1 L33.8 50.1",
    "M38.6 56.8 L38.7 56.7",
    "M42.2 70.0 L42.2 69.9",
    "M46.3 13.9 L46.3 13.9",
    "M45.7 14.1 L45.7 14.1",
    "M45.6 14.1 L45.6 14.1"
];
const GEO_MAP_MAIN = [
    "M9.7 39.2 L12.2 40.9 L18.0 43.9 L20.1 45.9 L21.1 47.2 L21.6 47.5 L24.1 48.1",
    "M23.7 47.9 L21.1 47.2 L19.7 45.5 L18.0 43.9 L12.2 40.9 L9.7 39.2",
    "M9.7 39.1 L11.5 34.3 L12.0 32.3 L11.9 31.8 L10.0 27.9 L9.7 27.5 L8.9 27.1 L7.3 26.6",
    "M7.2 26.7 L9.1 27.2 L9.6 27.5 L10.0 27.9 L11.9 31.8 L12.0 32.3 L11.1 35.3 L9.7 39.1",
    "M35.1 93.9 L33.0 93.0 L32.6 92.8 L32.0 92.1 L31.5 91.1 L31.0 87.8 L30.4 86.8 L28.7 85.6 L27.8 85.3 L26.7 85.3",
    "M45.4 35.9 L43.5 35.8 L42.5 35.9 L41.7 36.3 L40.7 36.9 L40.0 37.8 L39.5 39.0 L39.5 39.9 L39.9 40.8 L39.9 41.3",
    "M40.0 41.3 L39.9 40.8 L39.6 40.0 L39.5 39.1 L40.1 37.8 L40.8 36.9 L41.8 36.2 L42.5 36.0 L43.5 35.8 L45.3 36.0",
    "M43.8 44.0 L40.5 43.8 L38.0 43.3 L36.6 42.8 L35.8 42.9",
    "M35.8 42.9 L36.6 42.9 L38.0 43.4 L40.5 43.8 L43.8 44.0",
    "M31.4 48.1 L28.6 48.7 L27.2 48.9 L25.5 48.5 L24.0 48.0",
    "M24.1 48.1 L25.9 48.7 L27.0 48.9 L28.6 48.8 L31.4 48.1",
    "M43.5 91.4 L42.7 94.1 L42.7 95.2 L42.9 97.5",
    "M2.1 41.3 L3.6 41.3 L5.5 40.9 L7.0 39.5 L7.8 39.0",
    "M7.8 38.9 L7.0 39.5 L5.5 40.8 L3.6 41.2 L2.1 41.2",
    "M35.6 40.7 L35.6 41.6 L35.9 44.0 L36.3 44.7 L37.7 46.4",
    "M45.3 85.1 L44.5 86.0 L44.2 86.7 L43.4 89.6",
    "M42.8 97.7 L41.5 97.4 L40.2 96.7 L38.3 94.7",
    "M39.9 41.3 L39.0 41.3 L37.5 40.9 L35.7 40.6",
    "M35.7 40.7 L39.9 41.4",
    "M36.1 44.5 L35.9 43.6 L35.7 41.8",
    "M37.8 46.4 L36.1 44.5",
    "M9.6 39.1 L8.9 38.6 L8.2 38.7",
    "M8.2 38.8 L8.8 38.7 L9.6 39.1",
    "M42.8 97.5 L41.4 97.3",
    "M32.0 48.0 L33.2 47.6",
    "M33.1 47.6 L32.0 47.9",
    "M42.8 97.6 L43.0 97.9 L43.1 97.7 L43.0 97.5 L42.8 97.6",
    "M35.7 41.8 L35.7 40.7",
    "M31.4 48.1 L32.0 48.0",
    "M32.0 47.9 L31.4 48.1",
    "M40.2 41.0 L39.9 40.7",
    "M39.9 41.3 L39.9 41.4 L40.0 41.4 L39.9 41.3",
    "M8.2 38.7 L7.8 38.9",
    "M7.8 39.0 L8.2 38.8",
    "M35.6 40.6 L35.6 40.7 L35.7 40.7 L35.6 40.6",
    "M24.0 48.0 L23.7 47.9",
    "M43.5 90.3 L43.5 90.6",
    "M45.4 84.9 L45.3 85.1",
    "M45.3 85.1 L45.5 84.9",
    "M9.7 39.1 L9.6 39.2 L9.7 39.1",
    "M37.8 46.5 L37.8 46.4",
    "M37.7 46.4 L37.8 46.5"
];
const GEO_MAP_MINOR = [
    "M12.0 32.1 L16.1 33.0 L16.5 32.7 L17.6 32.6 L19.0 31.9 L19.3 31.3 L19.5 30.4 L19.7 30.4 L20.1 30.8 L21.1 32.3 L21.5 32.2 L21.3 31.7 L21.5 31.5 L22.2 32.2 L23.5 32.3 L23.6 32.4 L23.8 32.8 L23.1 33.0 L22.1 33.7 L23.4 33.2 L22.5 34.1 L22.6 34.2 L23.0 33.8 L23.6 33.5 L23.7 33.6 L23.3 34.0 L23.7 33.9 L24.0 33.7 L23.8 34.0 L23.5 34.3 L24.3 33.8 L23.6 34.6 L24.3 34.2 L24.6 33.9 L24.7 33.9 L24.6 34.3 L23.8 35.1 L23.7 35.3 L23.8 35.5 L24.2 34.9 L25.0 34.5 L25.8 33.7 L26.0 33.1 L26.1 31.5 L26.3 30.9 L27.7 28.6 L28.1 28.5 L29.6 28.7 L30.3 28.5 L31.0 28.6 L31.6 28.4 L33.5 28.4 L35.4 28.1 L35.8 27.9 L37.8 28.0 L38.0 28.3 L37.8 29.0 L37.8 29.7 L37.6 30.1 L37.4 30.1 L37.3 30.0 L36.7 29.3 L36.8 29.7 L36.6 29.5 L36.2 29.4 L36.4 29.6 L36.6 30.2 L36.1 29.7 L36.3 30.1 L35.6 29.6 L34.7 29.5 L33.7 30.6 L32.2 31.1 L32.0 31.3 L31.6 32.0 L31.0 32.0 L31.0 32.1 L31.8 33.0 L32.5 33.0 L32.7 33.2 L36.0 38.0 L38.0 40.3 L38.9 41.2",
    "M22.6 86.0 L22.0 85.4 L21.5 85.6 L21.1 85.7 L20.0 85.6 L18.4 84.8 L18.1 84.7 L17.1 84.1 L16.7 83.8 L15.9 83.5 L15.3 83.0 L15.0 83.0 L14.9 82.9 L14.3 82.7 L13.5 82.2 L1.5 54.8 L1.8 54.6 L3.3 52.9 L4.6 51.9 L6.7 49.3 L7.3 48.0 L7.6 46.8 L7.4 44.0 L7.6 41.7 L7.8 41.1 L7.4 40.1 L6.9 39.6",
    "M77.2 77.0 L77.1 74.2 L76.1 66.5 L75.9 64.3 L76.0 63.8 L76.3 63.1 L76.4 61.9 L77.0 59.5 L77.1 58.7 L76.4 54.9 L75.9 52.9 L75.8 51.8 L75.7 51.5 L75.7 51.2",
    "M24.1 64.6 L21.0 63.7 L20.8 64.2 L20.3 64.4 L20.1 64.2 L20.3 63.9 L20.2 63.6 L20.4 63.5 L20.3 63.4 L18.1 63.0 L16.6 62.3 L15.7 62.2 L15.4 62.0 L14.8 62.0 L13.9 61.8 L13.6 61.9 L13.4 61.7 L13.2 61.3 L13.0 61.0 L12.1 60.8 L11.7 60.5 L11.5 60.1 L11.3 59.9 L10.9 59.9 L10.6 60.3 L10.4 60.3 L10.2 60.4 L9.4 60.5 L8.5 60.2 L5.6 59.8 L4.5 60.0 L2.3 60.1",
    "M56.1 78.2 L56.4 78.0 L56.6 77.6 L57.2 77.2 L58.0 76.5 L60.5 73.6 L61.7 71.8 L61.9 71.2 L62.9 69.4 L63.4 67.8 L63.5 66.7 L63.3 65.4 L63.5 63.7 L63.6 63.1 L63.6 61.4 L63.8 59.5 L64.1 57.6",
    "M13.9 52.5 L20.1 52.9 L22.3 53.2 L23.6 53.7 L25.0 54.0 L25.4 54.4 L27.3 54.8 L29.3 55.4 L33.2 54.7 L34.1 54.3 L34.2 54.1",
    "M67.5 28.1 L69.6 27.8 L71.3 27.1 L73.5 25.1 L75.5 23.6 L77.3 23.0 L80.1 21.7 L81.0 20.9 L82.0 19.6 L82.6 19.1 L84.0 18.5 L84.6 17.9",
    "M58.0 95.3 L57.8 95.0 L57.6 93.3 L57.8 91.8 L57.6 91.3 L57.5 90.2 L57.4 90.1 L57.1 88.7 L56.6 88.5 L56.5 88.2 L56.6 87.5 L56.1 86.5 L55.8 86.1 L55.5 84.0 L55.6 83.6 L55.8 82.9 L56.0 81.9 L56.1 81.2 L55.9 80.9 L56.2 79.3 L56.4 79.2 L56.3 78.7 L56.1 78.4 L56.1 78.2",
    "M64.1 57.6 L64.3 56.3 L65.4 53.5 L65.5 52.7 L65.4 51.5 L65.1 50.6 L65.1 49.8 L65.3 49.3 L65.0 48.7 L65.0 48.0 L65.7 46.0 L66.2 45.3",
    "M26.7 66.7 L26.3 67.3 L26.3 67.8 L25.8 67.9 L25.4 68.4 L24.9 68.6 L24.5 68.3 L23.9 68.4 L21.9 69.3 L21.7 69.2 L21.1 69.8 L20.8 70.0 L20.0 71.9 L19.7 72.4 L19.2 72.9 L18.6 74.3",
    "M75.1 51.1 L74.8 50.6 L75.0 49.0 L74.8 48.5 L74.2 47.5 L74.3 47.0 L74.1 46.7 L73.3 45.6 L71.6 44.6 L71.2 44.2 L70.5 43.3 L70.1 43.1 L69.0 43.1 L68.8 42.9 L68.1 43.1",
    "M52.4 15.2 L52.9 16.0 L53.5 16.5 L53.8 16.5 L54.1 16.7 L54.6 16.6 L54.8 16.8 L55.9 16.7 L56.8 16.6 L58.2 16.5 L59.8 16.3 L62.1 14.9 L63.2 14.5",
    "M26.1 81.1 L25.3 81.7 L24.1 81.6 L22.9 81.6 L22.6 81.6 L21.4 81.3 L19.6 81.1 L19.2 81.5 L19.2 81.5 L18.1 80.8 L17.9 80.8 L17.5 80.6 L16.6 80.6 L16.2 80.2 L15.7 80.0",
    "M12.9 54.2 L12.8 54.8 L12.5 55.0 L12.2 55.7 L12.9 56.4 L13.0 56.6 L12.4 57.6 L12.5 58.2 L12.2 58.3 L12.0 58.6 L11.8 58.6 L11.6 58.9 L11.4 59.0 L11.3 59.2 L9.3 58.3 L9.0 58.4 L8.7 59.4 L9.0 60.2 L9.3 60.5",
    "M76.0 63.9 L76.7 64.1 L78.0 63.8 L79.2 63.7 L80.6 63.3 L82.1 61.9 L82.7 61.0 L83.4 60.2 L83.9 60.0 L85.1 60.2",
    "M70.0 20.5 L70.1 20.8 L70.3 21.0 L70.0 21.2 L69.9 21.5 L69.3 22.2 L68.9 22.8 L67.9 24.1 L67.2 25.2 L67.0 25.2 L66.8 25.5 L65.7 26.0 L65.2 26.7 L64.6 27.1 L64.6 27.5 L64.9 28.0 L65.0 28.0",
    "M32.8 72.7 L32.6 73.2 L32.1 73.6 L31.1 73.7 L29.9 74.2 L29.9 74.0 L30.0 73.7 L30.0 73.5 L29.7 73.6 L29.4 73.3 L28.9 73.0 L28.3 72.2 L28.3 71.8 L27.9 70.7 L28.0 70.5 L28.5 70.1 L28.6 69.6 L29.0 69.5 L29.4 69.0 L29.2 69.0",
    "M7.8 41.1 L8.1 41.8 L8.2 42.6 L8.8 43.8 L8.9 45.8 L9.0 46.0 L9.3 49.0 L9.3 50.2 L10.3 50.3",
    "M79.8 86.7 L79.7 86.5 L79.8 86.2 L78.6 84.3 L78.0 83.2 L77.4 78.2 L77.2 77.2",
    "M2.2 59.2 L2.3 59.2 L4.7 57.9 L5.1 57.2 L5.5 56.9 L6.0 56.7 L6.1 56.4 L6.4 56.2 L6.8 55.5 L7.2 55.5 L8.0 54.9 L8.6 53.8 L8.5 52.9",
    "M17.9 45.9 L12.1 41.8 L11.3 42.2 L10.6 42.4 L10.8 43.0 L11.0 43.0",
    "M47.6 36.2 L47.5 38.1 L47.0 41.2 L46.5 42.9 L46.2 43.2 L43.9 43.4",
    "M19.0 44.8 L15.3 48.3 L16.9 49.9 L16.1 50.5 L15.7 50.0 L15.7 50.0 L15.5 50.7",
    "M3.9 38.6 L4.5 38.5 L4.8 38.3 L5.8 38.0 L6.3 38.2 L6.5 38.7 L5.8 40.0 L5.2 40.5 L4.2 41.0 L3.0 41.1 L2.9 40.2",
    "M48.5 12.6 L48.2 12.0 L47.2 11.5 L47.1 11.5 L46.4 11.6 L46.1 11.5 L44.7 10.4 L43.7 9.9 L42.3 9.4 L41.8 9.0 L41.4 8.2",
    "M5.2 51.2 L5.3 51.5 L5.3 52.1 L5.0 53.0 L5.0 54.0 L5.4 55.2 L5.3 56.3 L5.5 56.6 L5.5 58.0 L5.1 59.5",
    "M27.1 41.5 L24.9 42.4 L24.4 42.2 L22.8 42.7 L20.7 42.9 L20.6 43.2 L20.6 43.7 L21.0 44.2 L20.9 44.5",
    "M84.6 17.9 L84.2 17.7 L82.8 16.6 L82.4 16.6 L81.6 16.4 L81.1 16.4 L81.0 15.9 L80.8 15.8 L79.6 15.9 L78.8 15.9 L78.2 15.7 L77.6 15.3 L77.4 15.3",
    "M10.3 50.3 L11.1 50.1 L11.3 49.8 L11.8 50.2 L12.5 49.7 L13.5 50.0 L13.8 49.8 L14.1 50.3 L13.8 50.5 L13.8 51.1 L13.0 51.8 L12.9 52.3 L12.9 52.4 L13.9 52.5",
    "M35.6 41.8 L34.6 42.3 L34.0 42.4 L33.3 42.0 L33.2 41.4 L33.8 39.8 L34.1 39.4 L35.1 39.0 L35.8 39.1 L36.3 38.7 L36.7 38.8",
    "M11.2 26.3 L14.1 26.5 L14.4 26.3 L15.2 26.6 L15.3 26.7 L15.2 27.0 L15.3 27.2 L15.1 27.9 L14.5 28.1 L14.4 28.2 L15.2 29.0 L14.9 29.3",
    "M33.6 82.6 L33.6 82.2 L31.1 82.0 L30.3 82.1 L29.8 81.9 L28.9 81.9 L28.5 82.1 L28.4 82.3 L28.8 83.1 L28.1 83.8",
    "M36.9 67.9 L36.7 68.1 L35.6 68.7 L35.4 69.0 L35.4 70.0 L34.3 69.9 L34.6 71.4 L34.5 71.8 L35.0 71.8 L35.8 72.2 L35.8 72.5",
    "M25.0 85.6 L24.7 86.3 L25.1 87.1 L25.5 87.2 L26.0 87.8 L25.9 88.1 L26.1 88.7 L26.0 89.5 L25.2 90.4 L24.5 90.8 L24.1 90.8 L23.8 90.7 L23.6 91.0",
    "M43.0 72.8 L40.9 73.4 L39.3 73.4 L38.3 73.3 L37.5 73.3 L36.8 73.6 L36.4 74.3",
    "M11.5 40.4 L11.9 39.8 L12.3 39.0 L12.2 38.5 L11.8 38.1 L12.2 37.0 L13.3 37.2 L15.1 38.1",
    "M36.7 76.5 L39.7 75.5 L41.4 75.6 L43.5 75.1",
    "M44.5 86.1 L44.1 86.0 L42.0 86.4 L41.1 86.4 L39.4 87.0 L37.6 87.0",
    "M41.4 8.2 L41.3 8.2 L40.2 8.0 L39.8 7.8 L37.1 6.7 L36.4 6.3 L35.2 5.3",
    "M74.0 17.4 L74.2 17.6 L74.0 17.8 L72.4 18.4 L70.7 20.0 L69.4 20.9 L69.4 21.2 L69.1 21.3",
    "M13.4 79.3 L13.6 79.0 L13.9 79.1 L14.7 78.8 L14.9 78.9 L15.7 78.7 L16.1 78.9 L16.3 78.9 L17.0 78.9 L17.4 79.1 L18.0 79.2 L18.1 79.3 L17.9 80.4 L18.0 80.8",
    "M4.9 31.6 L5.0 31.7 L4.7 32.3 L5.8 33.2 L5.7 33.5 L6.1 34.2 L6.0 34.6 L6.2 35.1 L6.1 35.6 L6.2 36.0 L7.5 36.7",
    "M13.6 41.6 L14.6 39.9 L15.3 38.9 L15.9 39.3 L16.1 39.0 L16.2 38.9 L15.8 38.6 L16.5 37.8 L16.7 37.2",
    "M49.1 15.5 L49.6 15.6 L50.2 15.3 L51.0 15.3 L51.3 15.0 L52.0 15.2 L54.0 14.9 L54.4 14.3 L54.8 14.0",
    "M34.3 51.0 L34.5 50.9 L35.2 51.1 L36.4 51.1 L36.2 48.5 L35.8 47.0",
    "M22.6 86.0 L23.6 85.0 L25.8 83.8 L27.1 83.7 L27.9 83.9 L28.1 83.8",
    "M49.4 12.0 L49.9 12.4 L50.7 12.2 L51.4 12.3 L51.7 12.6 L52.0 13.2 L52.4 13.5 L53.5 13.6 L53.6 13.8 L53.5 14.2 L53.7 14.9",
    "M32.1 47.9 L31.9 47.2 L32.5 46.3 L33.5 45.9 L34.3 45.7 L35.5 45.2 L35.4 44.7 L36.1 44.5",
    "M17.7 46.1 L20.5 49.0 L21.1 48.7 L21.6 47.5",
    "M41.7 61.9 L39.3 61.8 L38.8 62.0 L38.5 62.3 L38.4 63.3 L38.9 64.5 L39.4 64.4",
    "M38.1 41.1 L36.7 41.6 L36.6 41.8 L36.6 42.1 L37.9 42.6 L40.5 43.1",
    "M23.1 61.3 L23.0 61.5 L21.2 61.5 L21.2 62.0 L20.8 62.1 L19.9 62.0 L19.7 62.2 L18.6 62.2 L18.4 63.0",
    "M8.4 29.1 L7.7 30.3 L8.7 30.9 L7.8 33.5 L7.9 33.6 L8.5 33.6",
    "M36.9 66.3 L36.5 66.3 L36.4 65.8 L35.5 66.0 L35.4 65.6 L34.8 65.4 L34.8 64.9 L34.5 63.9 L34.3 62.5",
    "M16.0 79.8 L15.6 80.0 L15.1 80.0 L14.1 80.2 L13.3 79.3 L11.2 79.0 L10.7 78.8",
    "M16.9 45.1 L16.5 45.5 L15.4 45.9 L15.1 46.0 L15.0 46.4 L15.1 46.7 L15.3 46.9 L15.9 46.7 L17.1 45.8 L17.7 46.1",
    "M36.4 74.3 L34.7 74.6 L34.6 74.8 L35.1 76.9 L36.7 76.5",
    "M29.2 69.0 L28.7 69.0 L29.0 68.5 L28.4 67.7 L28.3 67.1 L28.9 65.8 L29.8 65.0 L29.8 64.5",
    "M42.0 33.9 L41.9 33.0 L41.8 32.5 L41.9 31.8 L42.2 31.5 L42.8 31.2 L42.6 30.4 L44.2 30.8",
    "M8.3 27.0 L7.8 28.3 L8.1 28.7 L8.1 29.0 L8.5 29.1 L9.1 29.8 L9.7 30.6 L9.8 30.9 L9.5 31.3 L9.2 31.2",
    "M26.1 55.9 L25.3 55.8 L25.2 56.0 L25.0 56.1 L22.6 55.9 L22.6 56.3 L22.3 56.5 L21.8 56.5 L21.7 56.5 L21.7 56.3 L21.8 56.0",
    "M37.0 66.8 L36.9 65.9 L41.6 66.0",
    "M6.9 50.7 L7.6 51.2 L7.7 51.9 L8.7 53.0 L8.9 54.1 L9.2 54.5 L9.5 54.2",
    "M30.5 7.6 L29.5 9.8 L28.8 11.5 L28.3 12.5",
    "M35.0 79.7 L34.1 80.0 L34.3 82.4 L35.0 82.3 L36.3 82.4",
    "M43.7 35.8 L43.6 34.5 L44.2 34.2 L44.8 31.0",
    "M22.5 47.0 L22.5 46.0 L23.1 44.6 L23.0 43.8 L22.6 43.6 L22.4 43.7 L22.4 44.0 L22.5 44.1 L23.1 44.6",
    "M39.2 93.2 L37.9 93.1 L36.3 92.8 L36.2 92.7 L34.5 91.9 L34.4 91.8",
    "M44.3 40.5 L45.0 40.7 L46.0 40.8 L46.3 40.4 L46.8 39.0 L47.0 37.5",
    "M32.0 61.8 L32.5 61.8 L32.6 62.5 L32.8 62.6 L33.6 62.5 L36.6 62.3",
    "M2.6 53.7 L2.2 53.6 L2.1 53.4 L2.0 52.0 L2.4 51.0 L2.4 50.8 L2.2 50.6 L1.7 50.5 L1.5 49.8 L1.4 49.6 L1.3 49.6",
    "M23.6 59.5 L21.9 60.7 L21.4 60.1 L20.8 60.4 L20.1 59.2",
    "M5.0 52.7 L4.5 52.8 L4.1 53.2 L3.6 53.3 L3.6 53.0 L2.8 52.7 L2.9 52.3 L2.8 52.2 L2.7 52.2 L2.0 52.4 L1.6 52.3 L1.3 51.9",
    "M64.9 96.4 L64.9 96.4 L64.5 96.1 L64.3 96.1 L62.3 95.2 L61.4 94.9 L60.6 94.3",
    "M35.6 89.3 L37.0 88.8 L38.4 89.6 L39.1 89.7 L39.2 89.9 L39.7 89.7 L39.4 89.2 L39.5 89.2",
    "M77.4 15.3 L77.2 14.8 L77.4 14.3 L78.5 13.0 L79.6 11.3",
    "M10.8 36.1 L10.2 35.8 L9.3 35.6 L8.5 37.8 L8.0 37.7 L7.8 37.6",
    "M6.0 50.2 L6.1 50.4 L6.8 50.6 L7.1 50.6 L7.3 50.5 L8.3 48.6 L8.1 48.4 L7.3 48.2",
    "M32.6 67.3 L32.9 69.0 L33.3 69.2 L34.2 69.2 L35.1 69.6 L34.7 69.9",
    "M47.9 22.6 L47.3 22.5 L47.2 22.0 L46.5 22.1 L46.3 21.9 L45.2 20.9 L45.1 20.7 L45.4 20.4 L45.0 20.0",
    "M25.5 80.7 L25.1 80.1 L24.8 80.0 L24.5 79.8 L24.2 80.0 L22.9 80.1 L22.5 79.9 L21.8 79.1",
    "M43.4 9.8 L43.9 10.0 L44.9 11.9 L45.8 11.8 L45.4 11.5 L47.2 11.5",
    "M36.5 27.9 L35.9 27.6 L34.9 27.5 L33.6 26.5 L33.0 26.3 L32.4 25.9",
    "M8.9 27.1 L9.2 26.4 L9.3 25.4 L9.8 24.5 L10.2 24.7 L10.4 24.6 L11.0 25.0 L11.2 25.3",
    "M47.3 28.9 L46.5 29.0 L45.5 28.8 L44.7 29.0 L44.3 29.7 L44.3 30.3 L44.2 30.8",
    "M32.5 35.1 L32.1 35.3 L31.4 36.0 L32.7 38.3 L33.1 38.1",
    "M11.6 31.2 L10.2 32.1 L9.9 32.5 L9.3 33.5 L10.3 34.0",
    "M26.3 58.0 L25.3 59.6 L25.0 60.4 L24.7 60.5 L24.7 61.8",
    "M43.4 13.0 L43.6 12.9 L43.8 12.2 L43.8 12.2 L43.9 11.9 L43.7 12.0 L43.6 12.0 L43.5 11.8 L43.5 11.8 L43.3 11.7 L42.6 11.2",
    "M23.9 68.4 L23.7 67.3 L24.0 66.8 L24.1 65.7 L24.0 65.6 L23.6 65.6 L23.6 64.5",
    "M44.6 82.9 L40.3 83.3",
    "M38.8 94.7 L38.8 95.0 L38.6 95.2 L37.7 95.1 L36.5 95.3 L36.8 96.1 L36.4 96.2 L36.4 96.3 L36.4 96.8",
    "M22.6 86.0 L21.9 86.5 L20.8 86.8 L20.3 87.4 L18.8 87.4 L18.8 87.4",
    "M40.2 41.0 L41.2 40.3 L42.5 40.1 L42.8 40.2 L43.3 40.5 L44.2 40.7",
    "M38.0 8.4 L37.5 9.2 L37.6 8.4 L38.1 7.7 L39.2 5.8",
    "M17.4 39.4 L17.7 41.0 L17.9 41.2 L17.9 41.8 L18.0 42.0 L17.0 43.3",
    "M4.4 48.3 L4.7 48.1 L5.6 48.0 L5.9 47.6 L6.0 47.1 L6.6 46.9 L6.8 46.7 L7.2 46.6 L7.3 46.2 L7.5 46.0",
    "M42.7 81.0 L43.2 84.4 L43.5 84.9 L43.7 85.0",
    "M42.7 35.9 L42.9 39.6 L42.8 40.2",
    "M23.5 13.1 L25.2 14.0 L26.3 14.0 L27.5 14.3",
    "M26.7 85.3 L25.3 85.6 L24.1 85.6 L23.8 85.9 L22.6 86.0",
    "M35.5 68.6 L34.7 68.7 L34.4 68.6 L34.4 68.4 L34.7 68.1 L34.6 67.4 L34.7 66.8 L35.5 66.0",
    "M32.5 82.1 L32.3 83.0 L32.4 83.1 L32.4 83.3 L32.2 83.8 L32.2 84.1 L32.6 84.8 L33.6 85.6",
    "M29.7 80.4 L29.6 81.2 L29.4 81.4 L29.5 82.8 L29.7 83.4 L29.5 83.9",
    "M35.4 54.7 L37.8 55.5 L39.2 56.3",
    "M29.6 47.2 L29.3 46.3 L29.4 45.8 L29.6 45.4 L30.7 44.5 L30.7 43.7",
    "M34.3 37.7 L33.7 38.0 L33.1 38.1 L32.0 36.0 L31.9 36.0 L31.6 36.2",
    "M40.0 18.1 L40.3 17.9 L40.6 18.0 L40.6 18.3 L40.8 18.4 L41.3 18.1 L42.0 17.0 L42.5 16.5 L42.9 16.3",
    "M29.3 63.4 L29.3 61.2 L29.5 61.2 L29.8 61.3 L29.8 62.2 L29.8 62.3 L30.2 62.4",
    "M47.5 18.1 L48.3 17.6 L48.5 16.9 L49.0 16.2 L49.1 15.5 L48.9 15.1 L48.5 15.0",
    "M24.9 85.9 L24.7 85.9 L24.5 86.1 L24.5 86.7 L23.6 87.4 L22.4 87.9 L22.1 88.3",
    "M15.3 43.1 L17.1 44.0 L18.7 45.2",
    "M28.7 82.0 L28.2 82.0 L27.9 81.9 L27.1 81.3 L26.9 80.9 L26.6 81.0 L26.4 81.3 L26.2 81.1 L25.8 81.1 L25.5 80.7",
    "M29.1 83.7 L29.2 83.8 L31.2 84.0 L31.8 84.4 L32.6 84.8",
    "M35.2 83.2 L39.1 82.9",
    "M64.8 12.9 L64.9 12.6 L65.1 11.9 L65.4 11.0 L65.5 10.7 L65.9 9.2",
    "M19.6 48.1 L17.5 49.8 L17.3 49.5 L17.4 49.1 L17.3 49.0 L17.5 48.8",
    "M34.0 85.7 L34.1 84.1 L36.4 84.1",
    "M25.0 13.9 L24.8 15.0 L23.9 17.0 L23.8 17.7",
    "M37.9 72.5 L36.7 72.7 L35.8 72.5 L35.9 73.0 L36.2 73.6 L36.2 74.3",
    "M31.0 63.4 L31.1 65.8 L32.2 65.9 L32.2 65.5",
    "M36.7 61.1 L36.5 61.6 L36.6 63.1 L36.7 63.3 L37.4 63.1 L37.9 63.1 L38.0 63.2 L38.3 63.2",
    "M79.1 88.2 L78.2 86.5 L78.1 86.0 L78.2 85.8 L78.5 85.6 L78.9 85.8 L79.3 85.6",
    "M40.2 41.3 L41.7 41.3 L44.0 41.8",
    "M35.9 83.1 L36.0 83.7 L39.2 83.4",
    "M32.7 8.6 L30.9 10.5 L30.2 11.5",
    "M42.2 13.8 L42.0 13.3 L41.8 13.1 L40.4 12.7 L39.0 12.0",
    "M37.2 12.1 L37.1 12.3 L36.5 12.1 L35.5 13.1 L35.4 13.4 L35.2 14.7",
    "M34.3 79.9 L34.2 79.5 L34.3 78.5 L34.2 77.6 L34.6 77.4 L35.1 77.3 L35.1 76.9",
    "M12.4 32.2 L14.2 29.9 L13.6 29.3",
    "M25.9 11.3 L25.5 11.0 L25.0 11.8 L24.5 11.7 L24.3 12.1 L24.1 12.1 L23.5 13.1",
    "M14.1 30.0 L15.5 30.9 L16.1 29.8 L16.4 30.0 L16.5 29.7 L16.5 29.6",
    "M35.6 91.3 L34.5 90.6 L35.0 90.3 L34.9 89.9 L35.8 89.5 L35.5 89.3",
    "M37.8 46.5 L39.9 47.2 L41.4 46.9",
    "M28.9 57.9 L28.0 58.1 L27.2 59.1 L26.6 59.1 L25.8 58.8",
    "M30.2 80.3 L30.4 81.1 L31.1 81.0 L31.5 81.3 L32.8 81.3 L32.9 81.7",
    "M61.1 15.5 L62.4 15.0 L63.1 14.9 L63.3 14.9 L63.7 15.4 L63.8 15.8 L63.8 15.9",
    "M65.2 28.3 L65.3 28.2 L66.1 27.9 L66.3 27.7 L67.1 27.4 L67.8 27.1 L68.2 26.9 L68.3 26.6",
    "M6.9 60.0 L6.6 61.0 L8.2 62.9",
    "M15.5 42.6 L13.9 45.9",
    "M32.8 72.7 L32.8 72.4 L32.4 71.9 L32.0 71.8 L31.9 71.4 L31.9 71.1 L31.5 71.1 L31.4 70.6 L31.5 70.2 L31.4 70.0",
    "M36.3 82.4 L38.9 82.0 L39.1 82.2 L39.1 82.9",
    "M23.0 53.4 L22.4 53.0 L22.6 52.9 L22.4 52.0 L22.5 50.9 L22.3 50.3",
    "M32.1 54.9 L31.9 54.1 L31.8 52.7 L32.3 52.7 L33.2 52.9",
    "M77.2 15.4 L76.8 16.1 L76.8 16.6 L76.6 17.0 L75.7 16.9 L75.4 17.0 L75.2 16.6 L75.0 16.5",
    "M35.4 87.0 L35.4 87.2 L35.6 87.3 L37.4 87.1 L37.4 87.7 L38.1 87.6",
    "M44.0 32.1 L47.0 32.8 L47.3 32.7 L47.4 32.4",
    "M10.9 44.1 L10.6 45.4 L12.7 46.0",
    "M11.6 31.2 L12.2 30.7 L12.8 30.0 L14.3 28.7",
    "M37.8 84.9 L37.3 84.7 L37.1 86.4 L38.1 86.7 L38.1 87.0",
    "M27.9 63.3 L29.9 63.5 L30.5 63.5 L30.6 63.4 L31.4 63.4",
    "M36.1 81.2 L35.9 81.4 L35.1 81.4 L34.9 80.7 L36.0 80.4 L36.6 80.5",
    "M26.3 54.6 L26.0 56.8 L26.0 56.9 L26.7 56.9 L26.7 57.4",
    "M28.6 90.2 L28.6 90.1 L29.8 89.6 L29.8 89.0 L31.2 88.5",
    "M42.0 48.6 L41.9 48.9 L42.0 49.1 L42.2 50.6 L42.8 52.0",
    "M39.5 35.3 L40.5 35.4 L43.0 34.8",
    "M19.3 44.1 L19.6 43.6 L19.5 42.2 L18.4 41.9 L18.0 42.0",
    "M37.9 28.1 L38.1 27.5 L38.5 27.0 L38.6 26.7 L39.5 25.8 L39.9 25.2",
    "M27.3 14.6 L26.0 14.4 L25.6 14.5 L25.6 14.6 L27.3 14.8",
    "M8.7 42.6 L9.3 43.7 L9.4 46.0",
    "M58.1 2.0 L58.1 3.4 L58.3 4.4 L58.6 5.0 L58.5 4.8 L59.2 5.4",
    "M32.2 90.2 L32.4 90.4 L33.0 90.2 L33.3 91.1 L31.8 91.7",
    "M41.8 68.0 L43.7 68.8 L44.1 68.5 L44.6 68.5 L44.6 68.1",
    "M38.5 69.4 L38.8 69.6 L38.7 69.9 L38.7 70.2 L39.7 70.0 L39.9 71.4",
    "M32.8 72.7 L31.4 72.4 L30.2 71.9 L29.4 71.9",
    "M9.7 32.8 L9.8 33.0 L10.5 33.3 L9.7 35.3 L9.5 35.5",
    "M28.0 9.0 L27.7 8.8 L27.1 9.3 L25.9 11.3",
    "M30.7 38.7 L31.0 38.3 L31.2 38.3 L31.8 38.6 L32.3 39.2 L32.4 39.5 L32.2 40.0 L31.8 40.2",
    "M31.4 36.0 L30.0 33.5 L29.6 33.1",
    "M29.9 74.2 L30.1 75.5 L29.9 76.7 L30.0 77.6",
    "M10.7 44.9 L12.3 45.5 L14.0 45.7",
    "M36.3 82.4 L37.3 81.2 L38.1 80.7 L38.6 79.9",
    "M30.8 48.4 L31.3 50.1 L31.6 51.7",
    "M44.3 29.5 L44.9 29.5 L45.6 30.0 L46.2 30.2 L46.7 30.7 L47.4 30.5",
    "M16.9 43.9 L16.2 44.9 L16.0 44.9 L15.6 45.2 L15.0 45.4 L14.8 45.6 L14.6 45.7 L14.6 45.9",
    "M44.2 30.8 L46.2 31.3 L46.0 32.5",
    "M46.0 32.5 L45.7 33.8 L45.6 35.7 L45.5 35.9",
    "M26.7 85.3 L27.1 88.7",
    "M23.5 13.1 L23.1 12.9 L22.1 11.7 L21.2 10.7",
    "M45.4 30.8 L44.7 34.1",
    "M32.2 65.9 L32.1 66.4 L32.5 66.9 L32.6 67.3 L31.1 67.4 L31.1 67.7",
    "M27.5 14.3 L27.1 15.2 L24.8 15.0",
    "M42.2 78.8 L43.4 78.8 L43.0 77.9 L42.9 76.7",
    "M19.3 59.4 L18.5 59.8 L17.8 60.0 L16.3 59.2",
    "M39.0 80.4 L39.3 80.4 L40.1 82.5 L40.3 83.3",
    "M34.2 81.7 L33.3 81.7 L31.6 81.5 L30.9 81.6",
    "M14.9 34.0 L15.9 34.6 L16.4 33.9 L17.5 34.4 L17.6 34.3",
    "M33.2 82.8 L33.2 83.6 L33.6 83.5 L33.7 84.5 L33.6 85.6",
    "M29.8 64.5 L29.4 64.4 L27.8 63.8 L27.9 64.1 L27.7 64.9",
    "M43.6 89.4 L45.2 89.7 L45.5 90.4 L46.4 90.5",
    "M40.2 77.4 L40.3 78.8 L42.2 78.8",
    "M35.0 84.6 L35.5 84.6 L35.5 84.8 L35.4 86.1 L35.1 86.6 L35.2 87.2",
    "M37.0 56.7 L37.4 56.8 L38.0 56.6 L39.0 57.1 L39.2 57.3 L39.2 57.5 L38.8 57.9",
    "M40.5 43.0 L42.9 42.6 L43.4 42.7 L43.5 42.9",
    "M20.7 46.7 L21.3 46.3 L21.5 45.9 L21.4 45.4 L21.7 44.9 L20.9 44.5",
    "M39.9 94.0 L40.3 94.0 L40.4 94.4 L41.6 94.3 L42.7 94.3",
    "M31.4 92.1 L30.9 93.9 L31.0 94.2 L31.4 94.7 L31.4 95.0",
    "M40.2 76.5 L42.0 76.7 L43.3 76.6",
    "M38.5 60.2 L39.8 59.9 L41.5 59.1",
    "M38.5 38.5 L38.4 39.0 L38.6 39.2 L38.4 39.9 L38.6 40.3 L38.5 40.5 L39.0 41.0 L39.0 41.3",
    "M29.4 49.5 L29.7 49.5 L30.8 51.8 L31.0 51.7",
    "M66.1 8.4 L66.5 7.2 L66.9 5.6",
    "M66.2 45.3 L66.7 44.5 L67.3 44.1 L67.3 43.7 L67.9 43.1 L68.1 43.1",
    "M10.2 37.7 L11.5 38.4 L10.8 39.9",
    "M26.1 43.4 L26.7 43.3 L28.9 42.3",
    "M4.2 41.0 L3.8 37.9",
    "M40.3 44.4 L43.4 44.6",
    "M36.4 84.1 L39.4 84.0",
    "M40.3 93.0 L39.9 94.0 L39.4 95.6 L39.2 95.8",
    "M38.3 46.7 L38.6 47.8 L39.1 49.3 L39.1 49.6",
    "M29.1 52.3 L28.5 53.0 L27.5 53.3 L27.0 53.4 L27.0 52.8",
    "M43.6 89.6 L44.4 89.8 L44.5 90.2 L44.8 90.5 L44.9 90.7 L45.5 90.7 L45.7 90.7",
    "M42.1 94.3 L41.7 96.0 L41.6 96.5 L41.3 97.1",
    "M34.6 93.7 L33.6 94.1 L32.9 94.2 L32.5 95.3",
    "M13.0 56.5 L13.1 56.7 L14.2 57.1 L15.2 58.3",
    "M11.2 26.3 L11.2 25.3 L12.7 25.2 L12.7 24.7",
    "M32.0 42.4 L31.7 41.4 L31.7 40.4 L31.9 39.9 L31.8 39.5",
    "M26.5 50.1 L24.5 50.2 L23.8 50.9",
    "M34.9 85.9 L36.4 86.6 L37.6 87.0",
    "M41.7 66.6 L44.2 66.2 L44.3 65.9",
    "M13.9 52.5 L13.7 52.5 L13.7 53.4 L13.2 54.2 L12.2 54.3",
    "M14.9 35.1 L15.3 34.1 L15.7 33.6 L15.9 33.5 L16.3 33.5 L16.7 33.1",
    "M41.1 83.2 L41.1 82.2 L41.9 81.9 L42.0 82.1 L42.8 81.9",
    "M40.8 90.2 L40.5 90.3 L40.1 90.7 L40.2 91.6 L39.9 92.4 L39.7 92.3",
    "M36.2 49.4 L37.9 49.8 L39.1 49.6",
    "M30.7 43.7 L29.7 44.0 L28.9 42.3",
    "M42.6 45.8 L42.4 47.8 L42.0 48.6",
    "M11.3 40.3 L10.2 41.8 L9.7 41.5 L9.5 41.9",
    "M8.4 44.0 L8.5 45.8 L7.5 45.9",
    "M31.1 64.3 L32.8 64.4 L33.5 64.3 L33.6 64.6 L33.7 64.7",
    "M39.6 14.3 L39.0 14.1 L38.3 13.6 L37.4 12.6",
    "M25.5 10.0 L26.3 9.9 L26.1 10.3 L25.3 10.4 L24.6 10.3",
    "M37.1 78.3 L37.0 79.1 L36.2 79.2 L35.0 79.7",
    "M29.6 47.2 L30.5 47.0 L31.5 46.1 L31.5 46.0 L31.4 45.8 L31.6 45.7",
    "M47.1 27.9 L45.9 27.8 L45.4 27.7 L44.4 27.1",
    "M27.0 67.9 L26.6 66.6 L26.1 65.7 L26.2 65.3",
    "M32.8 72.4 L32.9 71.8 L33.2 71.7 L33.9 70.6 L34.3 70.2",
    "M43.6 14.5 L43.9 14.7 L43.6 15.0 L44.4 15.9 L44.6 16.3 L45.0 16.6",
    "M26.5 52.9 L27.3 52.7 L27.7 52.4 L29.0 51.7",
    "M22.8 47.7 L22.7 48.0 L22.9 48.3 L22.7 49.0 L22.3 49.1 L22.1 49.3 L21.5 49.1 L21.4 49.2",
    "M16.0 35.5 L16.4 35.8 L16.7 35.6 L17.5 35.6 L18.7 35.6",
    "M39.4 83.4 L39.6 85.1 L39.9 85.6 L40.4 85.6",
    "M44.0 41.8 L45.4 42.2 L46.6 42.9",
    "M37.2 36.6 L38.6 35.9 L39.8 35.8",
    "M33.2 35.2 L34.3 37.7",
    "M18.1 49.4 L16.3 47.3",
    "M17.0 35.1 L16.6 34.8 L16.3 35.2 L15.4 34.8 L15.8 34.0",
    "M22.0 11.5 L21.5 12.1 L21.2 13.2 L21.0 13.3 L20.7 13.8",
    "M35.2 83.2 L34.9 85.9",
    "M43.7 86.0 L43.7 85.0 L44.2 85.2 L44.4 85.0 L45.3 85.1",
    "M38.8 52.2 L41.6 52.6",
    "M38.6 59.6 L40.8 57.9",
    "M27.7 10.8 L26.6 12.3 L26.4 13.1",
    "M40.9 66.5 L41.0 68.1 L40.9 69.2",
    "M42.8 36.4 L42.2 36.7 L42.0 37.0 L41.9 37.8 L42.0 38.7",
    "M28.6 41.9 L29.1 41.7 L29.1 41.3 L30.2 41.2 L30.9 41.4",
    "M43.8 38.1 L43.5 39.9 L44.4 40.2",
    "M26.9 48.8 L27.2 47.7 L27.8 47.8 L27.9 48.8",
    "M14.6 42.1 L14.8 41.7 L15.0 41.6 L15.1 41.3 L15.3 40.7 L15.0 40.3 L14.6 39.9",
    "M39.9 77.4 L39.6 78.2 L39.7 78.3 L40.3 79.1 L41.1 79.2",
    "M37.1 5.7 L36.1 5.2 L35.9 5.0 L35.9 4.7 L35.5 4.9 L35.2 5.3",
    "M37.6 44.3 L38.0 44.3 L39.4 45.1 L40.0 45.3",
    "M31.1 5.1 L30.5 6.3 L29.9 6.7 L29.6 7.2",
    "M38.7 52.7 L41.4 53.0",
    "M29.1 53.8 L29.3 54.2 L29.1 54.4 L28.8 54.6 L28.1 54.6 L28.2 54.2 L28.7 54.0",
    "M38.0 38.0 L38.6 37.9 L40.2 36.6",
    "M4.0 39.5 L6.5 38.7",
    "M39.9 77.4 L41.3 77.3 L42.5 77.5",
    "M41.4 83.2 L41.3 84.0 L41.5 84.4 L41.7 84.4 L42.1 84.7 L42.4 84.6 L42.6 85.0",
    "M38.6 95.2 L38.3 96.2 L37.8 96.3 L37.6 96.7 L37.3 96.8 L37.1 97.0",
    "M39.8 55.0 L40.5 56.5 L40.4 57.5",
    "M28.9 51.8 L29.1 52.5 L29.5 52.5 L30.7 52.1 L30.8 51.8",
    "M37.3 45.9 L37.8 45.8 L40.0 45.6",
    "M14.0 43.1 L13.3 44.7 L13.1 45.6",
    "M42.6 80.9 L41.9 81.0 L41.0 80.8 L40.2 80.3",
    "M32.4 60.5 L32.0 61.7 L32.2 63.0",
    "M33.2 45.1 L32.3 44.9 L32.2 45.2 L32.6 45.5 L32.8 45.8 L33.4 45.9",
    "M2.6 38.9 L2.8 39.1 L2.8 40.1 L4.1 40.1",
    "M16.2 38.9 L17.2 37.6 L18.0 37.1",
    "M9.1 36.1 L8.3 35.9 L7.8 37.6",
    "M39.0 12.0 L38.2 11.6 L38.0 11.9 L37.9 12.2 L38.0 12.5 L38.6 12.8",
    "M10.4 39.7 L9.3 41.3 L9.3 41.7 L9.5 41.9",
    "M31.5 90.9 L31.7 90.9 L32.6 89.4 L33.1 89.0",
    "M34.9 89.9 L34.7 89.5 L33.8 89.5 L33.6 88.9 L33.3 89.0 L33.0 88.9",
    "M12.6 41.5 L14.9 42.8",
    "M37.1 63.6 L36.6 64.1 L36.1 64.2 L35.9 64.5 L35.5 64.6 L35.4 64.9 L35.6 65.0",
    "M31.9 92.0 L30.9 92.1 L30.5 91.9 L29.6 92.1 L29.5 92.3",
    "M28.5 55.4 L29.0 55.6 L29.4 56.0 L29.7 57.5",
    "M27.0 48.9 L26.8 49.3 L26.5 49.5 L26.4 51.0 L26.5 51.1",
    "M40.3 93.0 L41.6 93.2 L42.8 93.3",
    "M39.9 71.4 L37.9 71.9 L37.9 72.5",
    "M33.8 12.6 L35.1 13.2 L35.7 13.7 L36.0 13.6",
    "M34.4 9.4 L34.3 9.6 L34.5 9.7 L36.2 10.9",
    "M67.5 28.1 L66.7 28.0 L65.9 28.3 L65.2 28.3",
    "M20.9 65.7 L21.4 65.6 L22.1 65.2 L22.1 64.4 L22.5 64.2",
    "M14.2 36.1 L14.0 34.7 L14.3 34.6 L14.3 34.3 L14.5 34.3 L14.6 33.9",
    "M17.6 36.9 L17.4 37.2 L15.8 37.3 L15.6 37.9",
    "M38.4 68.4 L38.3 68.7 L38.1 68.8 L37.8 69.9 L37.6 69.9 L37.4 70.4",
    "M41.1 33.3 L40.4 34.5 L40.4 34.8 L41.0 35.0 L41.0 35.2",
    "M40.2 16.6 L40.0 16.5 L40.0 16.4 L40.8 15.0 L41.0 14.9 L41.3 15.1",
    "M27.4 46.8 L27.4 47.1 L27.2 47.1 L26.8 47.3 L26.8 47.8 L26.5 48.3 L26.4 48.7",
    "M31.6 60.4 L30.4 60.7 L30.5 61.3 L30.2 61.3 L30.2 61.7",
    "M37.0 6.0 L37.0 5.7 L37.3 5.0 L38.5 4.1",
    "M36.4 84.1 L36.5 85.6 L36.4 86.6",
    "M37.0 58.1 L36.4 60.5",
    "M40.5 44.0 L39.7 46.3",
    "M37.5 39.8 L38.2 39.4 L37.9 38.5 L38.1 37.7",
    "M35.9 4.7 L36.2 4.6 L36.6 4.6 L36.9 4.0 L37.9 4.5",
    "M22.9 10.0 L23.0 9.7 L25.2 9.1",
    "M36.8 6.5 L37.5 5.2 L37.7 5.4 L38.0 4.9 L38.2 4.8",
    "M19.0 59.6 L19.2 60.1 L19.6 60.5 L20.1 60.3 L20.4 60.5 L20.8 60.4",
    "M9.3 33.6 L8.7 34.7 L8.4 35.9",
    "M31.3 84.0 L31.0 83.3 L30.9 81.6",
    "M39.5 81.0 L39.0 81.1 L39.1 79.5 L38.7 79.5",
    "M39.3 61.5 L39.5 61.7 L41.7 61.7",
    "M27.5 46.8 L27.9 46.9 L28.1 47.4 L29.6 47.2",
    "M6.3 38.2 L3.9 39.0",
    "M14.2 36.1 L15.5 36.5 L16.0 35.5",
    "M37.3 91.0 L37.5 91.3 L37.3 91.6 L37.6 91.9 L37.1 92.2 L36.8 92.9",
    "M38.7 53.2 L41.1 53.5",
    "M30.9 41.4 L30.7 39.7 L30.0 39.9",
    "M20.1 52.9 L20.2 51.9 L20.7 51.8 L20.6 50.8",
    "M12.6 41.1 L13.4 39.6 L13.5 38.9",
    "M38.9 78.2 L38.4 78.1 L37.6 78.3 L37.1 78.3 L36.8 78.2 L36.8 77.9",
    "M34.9 60.1 L35.5 60.4 L37.2 60.7",
    "M32.0 42.4 L32.5 42.3 L33.5 43.0 L34.0 42.4",
    "M19.4 47.0 L20.7 48.3 L21.2 48.5",
    "M42.6 51.5 L43.7 49.3",
    "M39.3 66.0 L39.5 68.4",
    "M33.6 42.2 L34.2 41.2 L35.4 40.7",
    "M33.9 7.4 L34.5 7.7 L33.7 9.0",
    "M40.2 8.0 L39.5 9.7 L39.5 9.9 L39.5 9.6",
    "M75.0 68.5 L75.4 66.7 L75.6 66.2",
    "M19.5 49.4 L18.1 50.0 L17.8 50.2 L17.7 50.2 L17.5 49.8",
    "M25.5 8.5 L25.7 9.5 L26.5 9.4 L26.3 9.9",
    "M28.0 48.9 L28.3 50.2 L28.7 51.1",
    "M27.5 60.6 L26.6 60.7 L26.5 60.3 L26.7 59.3",
    "M22.0 11.5 L22.2 11.2 L22.5 10.7 L22.7 10.8 L23.1 10.4 L22.8 10.1 L22.9 10.0",
    "M41.3 73.2 L41.8 74.4 L41.9 75.5",
    "M38.4 72.3 L39.3 72.1 L39.5 72.2 L40.7 72.0",
    "M16.8 41.2 L17.0 41.4 L17.3 41.3 L17.1 39.5",
    "M31.7 80.4 L34.1 80.0",
    "M35.0 92.2 L36.0 90.8 L36.7 90.8",
    "M34.5 57.8 L33.7 57.7 L33.3 59.2",
    "M39.4 61.0 L40.3 60.9 L40.7 60.7 L41.7 60.7",
    "M43.6 46.9 L44.1 47.5 L43.9 49.1",
    "M24.0 14.4 L23.5 15.8 L24.2 16.1 L24.3 16.0",
    "M43.0 54.8 L43.0 54.5 L42.8 53.9 L43.0 53.7 L42.9 52.5",
    "M31.2 81.6 L30.9 80.9 L30.7 79.9 L30.4 79.9 L30.4 80.2",
    "M35.4 61.4 L35.4 61.2 L35.2 61.2 L35.4 60.8 L36.9 61.1",
    "M41.5 70.5 L41.5 70.5 L41.5 69.9 L41.1 69.9 L40.9 71.1",
    "M33.6 39.0 L33.2 39.4 L32.7 40.2 L32.6 41.0",
    "M37.7 6.0 L38.0 5.6 L39.0 6.3 L39.6 6.5",
    "M23.7 52.2 L23.8 52.6 L24.1 52.9 L25.6 53.0",
    "M18.1 44.0 L19.1 43.0 L18.1 42.7",
    "M29.9 39.0 L30.5 38.6 L31.3 39.1 L31.8 39.5",
    "M6.2 39.2 L4.0 39.9",
    "M34.5 71.8 L34.4 72.4 L34.1 72.6 L32.8 72.7",
    "M42.1 43.6 L43.4 43.8 L43.5 42.9",
    "M24.1 48.1 L23.9 49.5 L23.9 50.4",
    "M37.9 74.5 L38.3 74.5 L38.5 75.3 L39.5 75.1",
    "M36.3 38.4 L37.2 37.8 L37.5 38.1 L37.5 38.4 L38.0 38.6",
    "M23.4 50.7 L23.7 50.9 L23.6 52.1 L24.3 52.3",
    "M12.6 44.9 L10.5 43.9",
    "M12.7 30.1 L13.2 30.7 L14.4 31.6",
    "M38.2 84.5 L38.0 84.5 L37.7 85.0 L37.5 86.5",
    "M44.9 83.5 L43.0 84.0 L42.7 84.2",
    "M25.9 51.6 L25.9 53.3 L26.0 53.4 L26.4 53.4",
    "M27.8 54.9 L27.2 57.1",
    "M24.7 61.8 L24.7 62.2 L26.0 62.2 L26.0 62.7",
    "M32.7 59.5 L34.9 60.1",
    "M34.8 36.2 L35.8 36.1 L37.0 36.2",
    "M42.6 13.2 L41.3 15.1",
    "M25.4 57.8 L24.3 59.7",
    "M40.2 80.3 L39.7 80.0 L38.0 79.9",
    "M32.8 59.1 L35.0 59.6",
    "M45.4 37.3 L47.6 37.6",
    "M32.1 10.0 L32.0 10.3 L31.6 11.0 L31.4 11.7 L31.1 11.9",
    "M45.5 13.4 L45.6 13.4 L46.0 13.2 L45.7 12.5 L46.1 13.4 L47.0 13.2 L47.0 13.2",
    "M19.7 53.6 L20.0 53.6 L20.1 53.3 L20.5 53.0 L20.7 51.8",
    "M12.2 42.2 L11.4 44.3",
    "M26.7 12.3 L27.2 12.4 L28.0 10.9",
    "M38.8 87.0 L38.8 86.1 L38.4 86.1 L38.4 86.0 L37.6 85.9",
    "M35.9 73.0 L35.6 73.2 L35.0 73.9 L34.5 74.1 L34.7 74.6",
    "M33.5 38.1 L33.0 36.8 L33.7 36.4",
    "M47.0 25.5 L47.5 23.3",
    "M39.8 9.9 L41.4 9.7 L41.7 9.7 L41.7 9.7",
    "M35.1 93.9 L34.4 91.8",
    "M40.3 44.5 L38.2 43.9",
    "M42.8 38.1 L43.8 38.1 L45.0 38.4",
    "M31.4 90.2 L30.1 91.0 L29.5 91.2",
    "M33.6 88.9 L34.5 88.8 L34.7 89.0 L35.0 89.0 L34.8 89.0",
    "M41.4 93.2 L41.4 92.6 L41.5 92.5 L41.9 92.5 L43.0 92.7",
    "M39.3 73.9 L41.5 73.7",
    "M42.4 70.4 L44.5 70.6",
    "M32.4 10.8 L31.6 12.2 L31.1 11.9",
    "M22.8 12.6 L21.6 14.4",
    "M38.6 78.5 L38.5 79.0 L37.7 79.1 L37.8 79.5 L38.0 79.9",
    "M30.7 83.9 L30.5 83.5 L30.1 83.1 L29.9 82.7 L30.0 82.0",
    "M28.5 60.0 L28.7 60.8 L28.9 60.9 L29.5 60.5 L29.9 60.4",
    "M45.5 36.6 L47.6 36.9",
    "M26.5 51.6 L24.3 51.6",
    "M22.4 51.2 L22.0 51.2 L21.5 51.9 L21.0 52.1 L20.7 52.1",
    "M11.1 35.3 L12.5 35.8 L12.8 35.1",
    "M39.5 80.0 L39.6 79.4 L40.4 79.6 L40.5 79.7 L40.2 80.3",
    "M37.6 76.2 L37.5 74.1",
    "M38.4 62.6 L38.3 63.1 L38.4 63.6 L38.2 63.6 L38.0 64.6",
    "M44.9 35.9 L44.7 36.9 L43.6 36.9",
    "M13.4 37.3 L13.2 37.8 L13.2 38.2 L13.0 38.5 L13.7 39.0",
    "M40.3 80.0 L40.8 80.2 L41.8 80.5 L41.9 81.0",
    "M44.5 86.0 L44.9 86.2 L45.7 86.0 L45.7 85.5 L46.0 85.3",
    "M41.5 58.8 L42.3 58.4 L43.2 58.5",
    "M39.1 68.5 L38.2 68.3 L37.7 68.1 L37.5 68.6",
    "M30.3 9.0 L31.0 9.4 L30.1 10.5",
    "M25.0 60.4 L25.9 60.4 L25.9 59.7 L25.4 59.4",
    "M36.4 68.2 L36.5 68.7 L36.7 68.7 L36.8 68.9 L36.4 70.0",
    "M26.3 58.0 L24.2 57.6",
    "M8.2 25.0 L8.5 25.1 L8.1 26.9",
    "M28.1 43.8 L27.7 43.8 L26.7 44.2 L26.1 44.2",
    "M22.2 11.2 L22.9 11.3 L24.1 12.1",
    "M41.2 88.0 L40.4 88.3 L39.6 89.0",
    "M36.5 53.3 L36.6 52.9 L38.2 53.3",
    "M37.3 65.9 L37.3 67.4 L36.9 67.9",
    "M9.0 58.4 L7.5 58.8",
    "M43.8 88.4 L45.9 88.6",
    "M35.7 79.4 L35.7 79.7 L35.5 79.9 L34.1 80.4",
    "M26.3 50.1 L26.7 50.3 L28.4 50.4",
    "M36.8 77.9 L37.6 77.9 L37.6 76.7",
    "M34.5 85.8 L34.4 86.2 L33.8 86.6 L33.7 86.7 L33.6 86.6",
    "M40.1 55.7 L40.5 55.7 L41.1 56.2 L42.0 56.6",
    "M38.5 57.6 L38.4 58.0 L38.6 58.5 L38.6 59.6",
    "M39.9 16.3 L39.3 17.1 L38.4 17.7",
    "M27.0 60.7 L27.0 61.9 L26.9 62.2 L27.3 62.5",
    "M23.1 62.0 L23.0 62.4 L22.1 62.4 L22.0 62.9 L21.8 62.9",
    "M4.2 58.2 L4.5 58.7 L5.2 59.5",
    "M30.1 92.0 L30.4 93.3 L30.0 93.7 L29.8 93.7",
    "M28.6 56.8 L28.9 57.9 L29.8 57.7",
    "M38.1 37.7 L39.4 36.6 L39.8 36.5",
    "M24.9 50.2 L24.9 49.7 L26.4 49.6",
    "M34.3 93.9 L34.3 94.1 L34.2 94.2 L34.2 95.0 L33.9 95.3 L33.5 95.3",
    "M38.2 53.3 L38.6 53.4 L38.9 51.9",
    "M32.6 54.8 L32.8 55.2 L33.1 56.8",
    "M40.4 69.2 L40.3 69.3 L40.5 70.4 L40.4 71.1",
    "M36.8 48.8 L38.9 48.7",
    "M34.4 36.5 L33.5 35.1 L33.5 35.0 L33.8 34.8",
    "M44.9 14.1 L44.6 15.1 L45.3 15.9",
    "M30.4 7.8 L31.9 8.5 L32.1 8.5 L32.2 8.4",
    "M17.4 47.5 L17.5 47.6 L17.6 47.5 L18.7 48.8",
    "M38.0 76.6 L38.1 77.9 L38.9 77.9",
    "M37.6 91.9 L38.9 90.9",
    "M37.1 82.6 L39.1 82.5",
    "M37.6 54.0 L37.5 54.5 L37.6 54.6 L37.6 55.0 L38.2 55.4 L38.1 55.6",
    "M36.7 63.3 L36.5 63.7 L37.0 64.5 L36.6 65.0",
    "M40.0 41.6 L40.5 42.8 L40.4 43.6",
    "M33.2 41.4 L32.4 40.9 L31.7 40.6 L31.4 40.6",
    "M43.9 49.3 L43.6 49.3 L43.0 49.2 L42.0 48.6",
    "M37.8 91.8 L39.7 92.3",
    "M30.4 60.2 L30.0 58.7 L30.3 58.5",
    "M40.9 39.5 L41.8 39.1 L42.9 39.0",
    "M47.3 25.5 L46.7 25.4 L46.7 24.8 L46.6 24.8 L46.5 24.5 L46.5 24.1",
    "M11.9 40.7 L12.9 38.9",
    "M3.5 40.6 L4.2 40.5 L5.3 39.9",
    "M17.9 47.0 L19.1 48.5",
    "M31.3 57.6 L32.8 57.4 L32.8 56.9",
    "M37.0 60.7 L36.9 61.1 L37.0 62.7",
    "M37.2 60.7 L37.4 61.0 L37.5 62.7",
    "M33.6 4.3 L34.2 4.5 L35.2 5.3",
    "M40.0 12.0 L40.3 11.7 L40.3 11.7 L40.8 11.7 L40.6 11.7",
    "M64.0 28.7 L64.2 28.7 L64.8 29.0 L65.1 29.0 L65.7 28.9",
    "M16.1 32.9 L18.0 33.6",
    "M41.5 76.6 L41.7 75.9 L43.0 75.7",
    "M29.5 92.3 L29.1 93.0 L28.0 93.5",
    "M35.0 57.9 L36.9 58.6",
    "M26.4 47.0 L24.5 46.4",
    "M31.8 88.2 L32.0 88.5 L32.2 89.1 L31.3 89.5",
    "M31.2 88.5 L32.3 87.9 L32.5 88.0 L32.5 88.0",
    "M30.4 7.5 L30.8 6.7 L31.4 5.9",
    "M39.1 7.5 L38.6 8.4 L38.0 8.4",
    "M38.4 74.9 L39.5 74.7 L39.6 75.6",
    "M36.1 76.2 L36.2 74.9 L36.4 74.3",
    "M38.7 49.6 L38.6 50.5 L38.4 51.5",
    "M25.7 50.8 L24.6 50.8 L24.3 51.6",
    "M11.1 30.3 L10.3 31.0 L10.8 31.7",
    "M20.6 12.2 L21.3 12.2 L21.8 12.4 L22.2 11.8",
    "M34.2 78.9 L36.1 78.5",
    "M40.4 42.6 L39.0 42.2 L38.5 42.3",
    "M38.6 12.8 L39.3 13.1 L39.8 13.1 L40.0 13.0 L40.2 12.6",
    "M41.3 15.2 L41.4 15.3 L40.8 16.3 L40.2 16.6",
    "M22.3 55.2 L22.6 55.9 L21.5 56.0",
    "M14.9 31.0 L14.1 31.9 L13.5 31.4",
    "M38.2 84.0 L38.2 84.8 L38.0 85.9",
    "M40.4 38.8 L40.5 38.0 L41.2 37.2",
    "M40.4 42.7 L39.7 42.6 L38.5 42.3",
    "M45.8 38.9 L45.3 40.7",
    "M43.6 46.9 L43.5 48.2 L43.2 48.8",
    "M37.0 36.2 L37.7 37.4 L38.1 37.7",
    "M37.9 4.5 L38.3 4.9 L39.3 5.6 L39.2 5.8",
    "M27.2 41.9 L27.1 41.5 L27.6 41.3 L28.0 42.1",
    "M36.7 76.7 L37.4 76.7 L38.0 76.5 L38.1 76.4 L38.1 76.1",
    "M42.8 75.3 L43.3 76.6 L43.3 77.1",
    "M36.1 90.7 L37.3 89.8",
    "M37.1 51.2 L38.5 51.6 L38.9 51.9",
    "M37.0 70.8 L37.1 71.6 L37.7 71.5 L37.8 71.9 L37.9 71.9",
    "M34.2 35.3 L34.8 34.9 L35.6 35.1 L35.7 35.4",
    "M21.0 59.4 L20.6 59.1 L19.6 59.2 L19.3 59.4",
    "M26.6 57.6 L24.8 57.0",
    "M26.1 43.4 L26.1 44.7 L26.1 45.0 L26.4 45.0",
    "M40.3 75.6 L40.2 76.5 L39.9 77.4",
    "M42.0 56.6 L41.6 57.5 L40.8 57.8",
    "M32.0 59.0 L32.1 59.9 L31.6 60.0 L31.6 60.4",
    "M41.7 9.4 L41.3 9.5 L39.8 9.1",
    "M24.2 62.8 L23.2 62.9 L23.2 63.3 L23.7 63.3",
    "M26.2 41.8 L26.5 42.2 L27.8 41.7",
    "M31.6 60.0 L29.8 60.4",
    "M27.8 47.8 L28.0 47.9 L29.6 47.6",
    "M35.4 37.0 L37.1 36.4",
    "M38.5 60.9 L38.3 61.0 L38.4 62.6",
    "M33.1 56.8 L31.2 57.2",
    "M35.6 68.7 L35.4 68.5 L35.6 67.6 L35.9 67.2 L36.1 67.3",
    "M32.2 43.0 L32.0 43.4 L30.7 43.7",
    "M29.4 13.2 L30.1 12.6 L30.2 12.0 L30.5 11.8",
    "M26.0 64.0 L27.4 64.0 L27.4 64.5",
    "M25.5 63.6 L26.9 63.6 L26.9 64.0",
    "M8.8 53.5 L9.3 53.3 L9.7 53.3 L9.7 53.3",
    "M14.7 37.9 L15.1 37.5 L16.1 38.3",
    "M35.8 55.7 L35.8 56.1 L35.9 56.3 L37.0 56.7",
    "M41.3 63.7 L41.3 61.9",
    "M45.0 38.4 L46.6 39.4",
    "M45.7 35.1 L47.5 35.2",
    "M19.9 48.4 L18.8 49.5 L18.9 49.7",
    "M16.6 43.1 L17.0 41.9 L17.2 41.8 L17.3 41.5",
    "M12.3 30.6 L11.5 29.0",
    "M14.7 32.8 L15.0 33.8 L14.7 34.3 L14.5 34.3",
    "M27.1 15.2 L26.7 15.7 L25.8 16.5",
    "M39.6 86.9 L39.9 88.2 L40.1 88.6",
    "M35.9 51.1 L35.8 52.9",
    "M29.1 48.6 L29.7 50.3",
    "M30.2 61.7 L31.1 61.8 L32.0 61.7",
    "M41.8 71.1 L42.1 72.0 L41.2 72.2",
    "M32.4 6.5 L32.5 6.3 L33.9 7.4",
    "M56.2 96.7 L56.5 97.0 L56.3 97.6 L56.4 98.3",
    "M23.7 62.4 L23.6 62.5 L23.4 62.1 L22.6 61.9 L22.6 62.4",
    "M46.6 88.4 L46.4 89.9 L46.2 90.0",
    "M31.1 55.7 L32.9 55.5",
    "M44.2 35.8 L44.2 35.1 L45.0 34.4",
    "M29.5 12.8 L27.7 12.3",
    "M22.7 10.8 L23.6 11.3 L24.1 11.3 L24.4 11.1",
    "M38.5 51.6 L38.2 53.3",
    "M44.0 44.8 L45.7 45.2",
    "M45.0 9.5 L45.7 9.8 L45.2 10.8",
    "M36.2 10.9 L36.6 11.1 L37.6 11.3 L37.6 11.0",
    "M47.1 14.9 L47.9 14.4 L48.5 15.0",
    "M79.1 64.8 L78.3 64.2 L77.6 63.9",
    "M25.0 62.7 L25.1 63.1 L25.5 63.1 L25.5 64.1",
    "M13.0 42.4 L12.3 44.0",
    "M37.6 91.9 L38.5 92.4 L38.4 93.2",
    "M31.4 82.1 L31.2 83.0 L31.4 83.8",
    "M37.8 41.2 L38.0 41.9 L39.0 41.8",
    "M35.1 39.0 L34.9 38.8 L34.9 37.9 L34.5 37.7 L34.3 37.7",
    "M32.0 42.4 L32.2 43.0 L32.6 43.1 L32.8 43.1 L33.1 42.7",
    "M33.4 36.6 L32.8 35.2 L32.5 35.1",
    "M23.9 59.8 L22.7 60.6 L22.5 60.3",
    "M10.6 37.9 L10.1 39.1 L10.5 39.4",
    "M14.0 39.8 L15.0 38.3",
    "M39.9 74.3 L41.7 74.1",
    "M38.9 51.9 L39.5 51.6 L40.5 51.4",
    "M39.5 6.7 L40.1 7.0 L40.3 8.1",
    "M86.3 17.8 L86.0 17.7 L85.6 17.8 L85.3 17.6 L84.6 17.9",
    "M28.4 59.5 L27.8 59.6 L26.7 59.3",
    "M18.4 49.1 L17.2 47.8",
    "M25.9 48.6 L26.4 47.0",
    "M26.4 47.0 L26.4 46.4 L25.9 45.8 L25.5 45.7",
    "M13.0 29.9 L12.5 28.2",
    "M41.6 86.4 L41.5 87.2 L41.1 87.5 L41.2 88.0",
    "M38.0 88.2 L38.7 88.5 L39.6 89.0",
    "M36.8 53.0 L37.1 51.2",
    "M29.4 56.0 L31.1 55.7",
    "M41.8 60.4 L43.2 60.6 L43.3 61.0",
    "M31.2 65.4 L29.4 65.3",
    "M36.7 47.5 L38.5 47.2",
    "M45.3 43.3 L45.3 43.6 L44.9 44.5 L44.8 45.0",
    "M42.6 30.4 L41.9 29.8 L42.1 29.4 L41.7 29.2",
    "M34.8 9.5 L35.2 8.8 L35.5 9.0 L35.5 9.0",
    "M62.9 28.6 L63.0 28.6 L63.3 28.8 L63.6 28.7 L63.9 28.9 L64.3 28.7",
    "M14.9 39.4 L16.1 40.1 L16.4 40.2",
    "M7.5 47.5 L9.2 47.6",
    "M41.1 79.2 L42.8 79.1",
    "M40.2 76.0 L41.4 76.1 L41.5 75.5",
    "M34.4 72.4 L34.6 73.4 L34.5 74.1",
    "M40.5 51.4 L41.4 52.1 L42.0 52.2",
    "M41.6 69.2 L41.9 69.9 L42.0 70.4 L41.9 70.5 L41.5 70.5",
    "M30.1 63.5 L30.2 61.7",
    "M36.0 67.7 L36.0 67.9 L36.4 68.0 L36.8 67.5 L37.2 67.5",
    "M40.0 73.4 L40.1 73.0 L41.0 72.9 L41.2 73.3",
    "M29.3 41.7 L29.1 40.9 L29.0 40.0",
    "M37.0 10.5 L37.5 10.1 L38.0 10.1",
    "M47.1 14.9 L47.3 15.2 L47.5 15.1 L48.0 15.3 L48.5 15.0",
    "M39.4 9.3 L40.0 9.9 L39.7 10.0",
    "M26.2 46.3 L26.8 45.7 L27.7 45.5",
    "M24.0 48.5 L25.3 49.0 L25.6 49.2",
    "M18.2 46.6 L17.0 47.8",
    "M18.1 45.8 L19.0 46.6 L18.6 47.0",
    "M42.8 52.0 L42.9 52.5 L42.0 52.5 L42.0 52.2",
    "M33.2 51.8 L33.2 52.0 L33.6 52.1 L33.7 51.8 L33.4 51.0",
    "M30.5 61.3 L31.3 61.4 L31.8 61.3 L32.1 61.4",
    "M40.2 42.1 L41.5 42.0 L41.6 42.1 L41.6 42.4",
    "M47.8 20.4 L46.9 20.3 L46.9 21.1",
    "M28.7 9.7 L28.1 9.7 L27.7 10.8",
    "M41.7 51.2 L41.4 50.4 L41.6 50.1 L42.1 50.0",
    "M30.8 52.9 L30.7 53.0 L30.9 54.5",
    "M37.0 69.6 L37.0 69.8 L37.3 69.8 L37.8 68.7",
    "M44.8 42.0 L44.5 42.4 L45.3 43.3",
    "M46.5 16.6 L46.2 16.8 L45.3 15.9",
    "M3.6 53.0 L4.1 52.6 L5.1 52.6",
    "M24.0 48.0 L24.5 46.4",
    "M12.7 30.1 L12.0 28.6",
    "M35.5 78.0 L35.7 77.3 L36.7 77.2",
    "M41.4 58.6 L41.6 58.5 L42.1 57.7 L42.5 57.4",
    "M38.5 57.5 L39.6 58.8",
    "M31.1 63.8 L32.3 63.9 L32.4 63.5",
    "M27.9 58.3 L28.2 59.0 L28.6 59.3 L28.6 59.4 L28.4 59.5",
    "M19.2 46.2 L19.9 46.7 L20.4 47.3",
    "M11.2 35.4 L11.0 36.2 L11.8 36.3",
    "M38.9 75.8 L38.7 77.1 L39.1 77.2",
    "M41.7 77.3 L41.6 78.5 L42.1 78.5",
    "M34.4 86.2 L34.8 86.3 L34.5 86.8 L34.7 87.0",
    "M34.1 80.6 L35.5 80.3 L35.7 80.5",
    "M39.5 50.7 L39.8 50.4 L40.5 51.4",
    "M41.9 66.2 L42.0 65.9 L43.3 65.8",
    "M40.3 61.8 L40.3 62.5 L39.9 63.2 L39.9 63.4",
    "M45.2 37.9 L46.0 38.2 L46.2 37.4",
    "M42.9 16.3 L42.8 16.6 L43.1 17.0 L43.4 16.9 L43.6 16.6 L43.8 16.8",
    "M10.4 37.1 L11.9 37.9",
    "M11.9 37.8 L10.5 37.0",
    "M38.1 87.6 L38.1 88.0 L38.1 88.3 L38.5 88.5",
    "M38.2 84.7 L38.6 84.8 L38.4 86.0",
    "M42.0 56.6 L42.1 55.0",
    "M35.8 56.2 L35.6 57.4 L35.2 57.4",
    "M17.3 35.6 L17.1 37.2",
    "M36.0 80.7 L36.0 81.1 L36.4 81.6 L36.5 81.7 L36.6 81.6 L36.9 81.7",
    "M44.2 86.7 L45.3 87.1 L45.7 87.1",
    "M35.1 79.7 L35.0 79.1 L35.5 79.0 L35.7 79.4",
    "M35.6 89.3 L34.6 88.9 L34.5 88.8 L34.5 88.8 L34.3 88.8",
    "M33.6 52.8 L33.9 54.4",
    "M44.5 70.6 L44.6 70.2 L43.8 70.1 L43.7 70.5",
    "M31.5 72.4 L31.5 73.2 L31.8 73.2 L32.1 73.6",
    "M32.3 60.7 L33.2 60.8 L33.4 60.1",
    "M29.6 47.6 L31.2 47.2",
    "M30.3 42.4 L31.3 42.3 L31.9 42.2",
    "M41.4 15.2 L42.2 15.4 L42.9 15.2",
    "M11.1 42.9 L12.5 42.1",
    "M12.3 45.5 L13.0 44.0",
    "M39.8 97.6 L39.9 96.8 L39.6 96.6 L39.6 96.5 L39.3 96.4",
    "M27.6 85.3 L27.6 85.6 L28.0 86.8",
    "M35.2 82.8 L36.5 82.6 L36.6 82.5 L36.5 82.3",
    "M31.1 61.8 L31.0 63.4",
    "M27.2 57.1 L27.0 57.4 L26.7 57.4 L26.5 58.0 L26.3 58.0",
    "M11.4 27.6 L10.9 27.2 L11.2 26.3",
    "M23.1 12.9 L22.6 13.7 L22.1 14.2",
    "M32.8 63.9 L33.6 63.8 L33.6 63.6 L34.0 63.6 L34.0 63.3",
    "M30.0 43.9 L29.6 42.4",
    "M29.4 12.9 L29.0 13.1 L27.9 12.8",
    "M48.0 15.3 L47.6 15.7 L47.8 16.0 L47.7 16.3 L47.3 16.3",
    "M43.0 89.5 L42.6 89.7 L41.8 89.6",
    "M35.6 76.8 L35.4 75.5 L35.7 75.5",
    "M39.4 95.6 L40.5 95.1 L40.4 94.7",
    "M25.4 13.5 L27.0 13.7",
    "M22.5 14.4 L23.2 14.1 L24.0 14.4",
    "M39.7 85.4 L39.4 85.4 L39.4 85.6 L38.7 85.8 L38.7 85.4",
    "M30.4 54.8 L30.4 54.6 L31.3 54.5 L31.4 55.0",
    "M33.6 61.3 L34.1 60.1 L34.1 59.8",
    "M40.4 57.4 L39.0 56.7",
    "M30.3 54.5 L29.5 54.6 L29.5 55.4",
    "M10.1 40.2 L9.0 40.5 L9.1 40.9",
    "M10.6 29.2 L9.5 29.7 L9.3 29.9",
    "M41.6 76.2 L42.1 76.4 L43.1 76.3",
    "M37.0 56.7 L36.4 58.1",
    "M41.8 60.0 L43.2 59.9",
    "M39.3 66.5 L40.9 66.5",
    "M39.1 68.5 L38.9 68.1 L37.8 67.8",
    "M35.2 63.1 L35.4 64.5 L35.5 64.6",
    "M32.0 43.4 L31.7 43.8 L30.7 44.1",
    "M44.4 32.8 L45.9 33.1",
    "M29.2 10.4 L29.9 10.8 L30.3 11.4",
    "M35.2 8.8 L35.1 8.7 L34.4 7.7",
    "M26.4 49.7 L28.0 50.0",
    "M21.4 46.1 L21.9 46.4 L22.0 46.1 L21.5 45.7",
    "M33.8 88.5 L33.6 88.5 L33.0 88.9",
    "M29.7 50.3 L30.4 51.7",
    "M36.9 58.0 L37.5 58.4 L37.2 59.2",
    "M31.2 57.2 L29.7 57.5",
    "M33.1 8.8 L32.0 9.9",
    "M35.0 7.8 L34.6 7.7 L34.2 8.4",
    "M16.5 38.5 L17.3 39.1 L17.5 39.0 L17.7 38.8",
    "M20.3 44.7 L19.8 44.2 L19.6 44.5 L19.9 44.9",
    "M39.5 85.0 L40.4 84.9 L40.4 85.6",
    "M35.5 95.4 L35.2 94.2 L35.3 93.9",
    "M34.5 93.8 L34.7 94.6 L34.6 94.8 L34.2 94.9",
    "M40.5 70.2 L40.1 70.2 L40.0 70.8 L40.4 71.1",
    "M43.4 74.0 L44.0 73.9 L44.0 73.4 L44.3 73.3",
    "M30.6 52.6 L30.5 53.0 L29.8 53.4 L29.7 53.2",
    "M29.3 45.0 L28.4 44.9 L28.0 45.2 L27.9 45.2",
    "M44.6 31.7 L46.1 32.0",
    "M32.8 11.4 L32.6 11.9 L32.9 12.0 L33.1 11.8 L33.4 11.9",
    "M45.9 15.9 L46.7 15.2 L47.1 14.9",
    "M35.9 9.4 L36.7 10.0 L36.8 10.0",
    "M14.4 37.8 L15.0 36.4",
    "M38.0 73.2 L37.9 74.5 L37.8 74.7",
    "M36.0 80.0 L37.5 80.2",
    "M37.4 59.2 L37.2 60.7",
    "M37.2 59.2 L36.9 60.6",
    "M40.9 71.1 L41.3 72.6",
    "M36.6 69.5 L37.0 69.6 L37.5 68.6",
    "M41.4 38.9 L42.2 38.7 L42.9 38.7",
    "M44.3 30.3 L44.7 30.4 L45.4 30.8 L45.5 30.5",
    "M46.9 20.3 L47.0 19.8 L47.1 19.8 L47.2 19.4 L47.7 19.4",
    "M41.4 8.2 L41.0 7.2 L41.4 7.0",
    "M30.0 8.4 L31.4 9.0",
    "M77.4 15.3 L77.2 15.4 L76.6 15.0 L76.0 15.0",
    "M26.0 63.6 L26.0 65.0 L26.1 65.0",
    "M14.2 36.1 L13.2 35.8 L12.9 36.1",
    "M8.9 43.9 L7.4 44.0",
    "M40.4 88.3 L40.3 88.1 L40.5 88.0 L40.6 87.6 L41.1 87.6",
    "M33.5 88.9 L32.5 88.0",
    "M34.1 80.5 L32.6 80.6",
    "M40.2 83.3 L40.2 83.7 L40.0 84.3 L40.5 84.4",
    "M32.5 50.5 L32.9 50.8 L33.2 51.8",
    "M37.8 45.8 L37.6 44.3",
    "M33.5 37.0 L34.1 36.7 L34.7 36.1",
    "M27.9 12.8 L27.5 14.3",
    "M43.1 17.0 L43.2 17.5 L43.1 17.7 L43.6 18.1",
    "M25.2 49.2 L25.7 49.1 L26.6 49.4",
    "M14.7 35.6 L16.0 36.2",
    "M12.3 38.7 L12.8 38.4 L12.8 38.3 L12.9 37.9 L12.5 37.7",
    "M10.5 28.8 L11.5 28.2 L11.7 28.0",
    "M15.5 32.3 L15.1 32.4 L15.3 33.4",
    "M33.3 80.2 L33.1 79.6 L33.1 79.0 L33.0 78.8",
    "M34.3 51.0 L34.6 52.4",
    "M39.1 49.6 L39.1 50.6 L39.5 50.7",
    "M33.5 58.4 L34.9 58.8",
    "M28.1 55.0 L27.8 56.5",
    "M43.3 66.3 L43.3 64.9",
    "M27.7 45.5 L27.7 46.0 L27.5 46.8 L27.4 46.8",
    "M35.7 35.2 L35.8 35.0 L36.3 35.1 L36.2 35.9",
    "M45.0 35.9 L45.0 34.4",
    "M27.4 52.8 L28.2 52.8 L28.4 52.6 L28.7 52.8",
    "M13.6 37.4 L14.2 36.1",
    "M11.4 27.6 L11.7 27.6 L12.2 28.0 L12.5 28.0 L12.5 28.2",
    "M20.4 49.0 L19.8 49.2 L19.7 49.1 L19.9 48.9 L20.1 49.1",
    "M25.2 9.1 L25.1 8.7 L24.1 9.0",
    "M24.4 9.3 L24.6 10.1 L24.5 10.8",
    "M41.4 85.4 L41.2 85.2 L41.0 85.5 L41.1 86.4",
    "M32.8 59.1 L32.4 60.5",
    "M35.0 70.0 L34.7 70.8 L34.9 71.4",
    "M31.4 54.6 L31.3 53.2",
    "M40.2 44.9 L41.6 45.2",
    "M32.7 46.2 L32.8 46.5 L33.1 47.0 L33.3 47.5",
    "M34.0 37.9 L33.4 36.6",
    "M43.7 15.2 L42.9 16.3",
    "M24.7 60.6 L24.4 60.7 L24.4 61.8",
    "M7.3 26.7 L7.0 27.4 L6.6 27.9",
    "M42.5 83.1 L42.5 83.8 L42.4 84.2 L42.5 84.5",
    "M38.8 86.4 L40.0 85.6",
    "M41.0 80.8 L41.0 81.9 L41.1 82.2",
    "M36.1 76.7 L36.1 76.2 L36.7 76.0 L36.7 75.7",
    "M36.0 92.6 L36.5 91.8 L36.2 91.5 L36.3 91.4",
    "M42.7 86.9 L43.6 86.5 L43.5 86.1",
    "M32.0 55.5 L32.3 57.0",
    "M31.6 55.6 L31.9 57.0",
    "M34.6 71.4 L35.3 71.4 L35.5 72.0",
    "M27.4 42.4 L27.9 43.8",
    "M30.0 42.4 L30.4 43.8",
    "M33.7 10.8 L34.0 10.5 L34.3 10.3 L34.7 10.2 L34.8 10.0",
    "M41.7 13.0 L41.2 13.9 L40.8 13.7",
    "M25.1 63.7 L23.7 63.8",
    "M26.4 64.5 L27.8 64.5",
    "M25.6 61.8 L27.0 61.7",
    "M8.8 47.6 L8.7 48.6 L8.3 48.5",
    "M36.8 77.9 L36.7 76.5",
    "M42.0 77.4 L42.0 78.3 L42.2 78.8",
    "M33.6 85.6 L33.4 86.1 L33.2 86.1 L33.4 86.5",
    "M33.6 81.5 L35.0 81.3",
    "M33.5 93.2 L33.4 93.4 L33.9 94.2 L34.2 94.2",
    "M33.4 58.7 L34.8 59.0",
    "M28.9 42.3 L30.3 42.4",
    "M27.8 43.5 L29.1 42.9",
    "M40.9 14.9 L40.6 14.6 L39.7 14.3",
    "M31.6 4.9 L31.0 5.7 L31.4 5.9",
    "M34.3 12.9 L34.0 13.2 L33.1 12.7",
    "M5.6 56.9 L6.0 56.9 L5.9 56.9 L6.4 56.7 L6.8 57.4",
    "M13.8 30.3 L14.9 31.1",
    "M10.4 24.6 L11.1 23.4",
    "M42.6 87.9 L42.7 88.3 L42.7 89.2",
    "M29.0 89.9 L29.5 91.2",
    "M30.5 82.1 L30.6 83.3 L30.7 83.5",
    "M42.5 85.7 L42.2 85.7 L42.0 85.3 L42.5 85.1 L42.5 85.2",
    "M33.9 49.6 L34.5 50.9",
    "M33.5 58.1 L34.9 58.4",
    "M37.8 61.2 L37.9 62.6",
    "M27.9 62.5 L29.3 62.6",
    "M36.6 46.8 L36.5 46.3 L37.2 45.8",
    "M33.4 10.2 L32.7 10.1 L32.4 10.8",
    "M28.4 13.7 L28.0 14.2 L28.0 14.5 L27.5 14.3",
    "M33.8 12.1 L34.0 11.8 L34.5 11.6 L34.8 11.3",
    "M42.1 15.4 L41.7 16.0 L41.1 15.7",
    "M8.4 35.9 L7.9 35.8 L7.7 36.2 L8.1 36.4",
    "M26.5 12.8 L27.8 13.0",
    "M25.0 12.9 L24.7 13.3 L25.1 13.5 L25.0 13.9",
    "M43.9 80.8 L42.8 81.0 L42.6 80.9",
    "M42.5 77.5 L42.6 77.5 L42.5 78.0 L42.6 78.8",
    "M38.9 84.0 L38.9 85.4",
    "M37.0 52.1 L38.3 52.5",
    "M37.2 59.2 L38.6 59.2",
    "M34.7 55.3 L34.0 55.1 L33.7 54.5",
    "M29.8 64.9 L31.1 64.9",
    "M33.9 69.2 L33.8 68.6 L33.8 68.4 L34.4 68.6",
    "M40.0 48.5 L40.4 48.6 L40.9 48.7 L41.3 48.9",
    "M38.4 38.0 L38.8 38.3 L39.7 38.5",
    "M29.1 41.7 L29.9 41.7 L30.1 41.2",
    "M28.2 11.0 L28.7 9.7",
    "M25.5 9.8 L25.5 10.0 L25.0 9.9 L24.8 9.2",
    "M42.4 87.6 L42.0 87.5 L41.2 88.0",
    "M33.6 85.6 L34.9 85.9",
    "M34.2 85.7 L34.3 84.3",
    "M33.6 80.1 L33.7 81.5",
    "M36.5 95.3 L35.2 95.4",
    "M37.3 50.2 L38.7 50.1",
    "M30.4 55.9 L30.7 57.2",
    "M33.2 57.8 L32.8 59.1",
    "M36.0 68.5 L35.9 68.2 L36.1 67.1",
    "M27.9 62.9 L29.3 63.0",
    "M30.5 53.0 L31.0 52.7 L31.8 52.7",
    "M35.9 43.6 L36.7 43.7 L36.8 44.2",
    "M30.3 42.4 L30.8 43.7",
    "M47.1 26.9 L46.4 26.7 L46.4 26.1",
    "M43.2 13.5 L43.0 14.1 L43.6 14.5",
    "M44.8 16.4 L46.0 16.9",
    "M25.1 60.4 L25.1 61.8",
    "M12.9 52.0 L13.2 51.5 L13.0 50.6",
    "M25.6 61.8 L25.6 60.4",
    "M14.0 37.6 L13.4 38.8",
    "M17.2 36.8 L16.8 36.7 L16.8 36.1 L16.5 36.1",
    "M13.5 29.4 L13.2 28.1",
    "M4.9 41.1 L5.0 42.4",
    "M26.4 13.1 L27.7 13.4",
    "M40.2 76.3 L41.6 76.4",
    "M38.5 87.0 L38.7 87.8 L39.2 88.0",
    "M41.6 96.5 L42.3 96.9 L42.9 96.8",
    "M39.7 94.7 L38.3 94.7",
    "M35.1 78.7 L35.0 77.9 L35.1 77.3",
    "M41.5 83.2 L41.5 82.5 L42.1 82.3",
    "M35.9 61.7 L35.4 61.5 L35.4 62.4",
    "M40.9 66.5 L41.4 66.5 L41.5 67.4",
    "M36.5 40.7 L37.6 39.9",
    "M40.1 40.1 L40.6 39.8 L40.6 39.2 L40.4 39.1",
    "M46.5 37.5 L46.3 38.8",
    "M28.5 11.2 L28.0 12.4",
    "M46.9 13.5 L46.8 13.1 L46.1 13.4",
    "M26.5 52.1 L27.5 52.1 L27.7 52.4",
    "M11.0 38.1 L10.5 39.4",
    "M13.9 36.8 L12.6 36.4",
    "M6.1 35.6 L5.8 35.7 L5.4 35.5 L5.1 35.7 L4.8 35.7",
    "M21.4 45.4 L21.7 45.4 L21.9 45.3 L22.0 45.3 L22.2 45.6 L22.2 45.8 L22.1 45.9",
    "M33.2 93.1 L32.3 94.1",
    "M33.6 83.5 L34.9 83.2",
    "M35.2 57.4 L35.4 56.0",
    "M32.0 54.3 L33.3 54.0",
    "M31.9 53.9 L33.2 53.6",
    "M38.6 59.6 L38.5 60.9",
    "M36.6 48.7 L36.6 47.4 L36.7 47.5",
    "M43.8 35.8 L43.8 36.4 L44.5 36.7",
    "M48.3 12.4 L48.0 11.4",
    "M39.7 14.3 L39.5 14.1 L39.4 13.9 L39.5 13.1",
    "M27.7 10.8 L28.9 11.3",
    "M26.5 52.1 L26.4 53.4",
    "M14.8 52.5 L14.8 51.2",
    "M25.0 57.7 L24.5 58.5 L24.9 58.7",
    "M2.6 38.8 L3.9 38.7",
    "M11.6 35.5 L11.9 35.1 L12.7 35.4",
    "M12.5 43.3 L13.7 43.8",
    "M9.8 32.6 L9.4 32.4 L9.9 31.6",
    "M28.0 8.0 L27.0 8.1 L27.1 8.5",
    "M45.9 88.6 L46.0 88.3 L47.0 88.4",
    "M41.8 82.2 L42.0 82.1 L42.2 83.1",
    "M35.8 50.6 L35.6 49.3",
    "M29.0 51.7 L29.6 51.7 L30.3 51.5",
    "M32.5 50.5 L32.3 50.8 L32.5 51.4 L32.7 51.7",
    "M31.1 64.5 L29.8 64.5",
    "M29.9 60.4 L30.0 61.4 L30.2 61.4 L30.2 61.3",
    "M28.6 41.9 L27.4 42.4",
    "M41.0 35.0 L41.0 34.9 L40.5 34.6 L40.1 34.2",
    "M46.6 35.1 L46.7 33.8",
    "M45.6 11.1 L46.3 9.9",
    "M75.4 17.0 L75.2 16.5 L74.8 16.4 L74.7 16.5 L74.5 16.4",
    "M27.7 64.9 L27.6 65.5 L27.2 65.6 L26.9 65.6",
    "M10.2 28.3 L11.4 27.6",
    "M33.3 81.1 L34.6 81.0",
    "M34.0 56.3 L35.2 56.7",
    "M37.3 60.4 L38.6 60.5",
    "M31.4 63.4 L32.7 63.5",
    "M40.4 58.2 L41.2 59.2",
    "M29.6 49.2 L30.8 48.8",
    "M29.9 8.9 L30.3 9.0 L29.9 9.8",
    "M46.4 15.4 L46.9 15.8 L47.3 15.2",
    "M48.7 12.4 L48.5 11.9 L48.4 11.9 L48.3 11.2",
    "M39.9 5.9 L40.8 6.2 L40.9 6.5",
    "M74.5 16.4 L73.8 16.9 L73.8 17.1 L74.0 17.4",
    "M3.8 38.2 L5.1 38.0",
    "M15.2 40.7 L15.9 40.7 L16.1 40.1",
    "M9.2 47.7 L10.1 47.8 L10.1 47.4",
    "M26.3 7.4 L26.6 7.5 L26.7 8.5",
    "M12.7 25.2 L13.9 25.3 L13.9 25.2",
    "M33.5 90.5 L33.8 90.9 L34.5 90.6",
    "M35.0 52.0 L35.0 52.4 L35.9 52.3",
    "M37.3 57.1 L38.5 57.5",
    "M39.0 62.3 L40.3 62.2",
    "M33.0 62.6 L33.2 63.9",
    "M28.5 59.5 L29.0 59.6 L29.7 59.4",
    "M47.1 31.4 L46.8 32.2 L46.8 32.6",
    "M29.6 8.4 L29.1 8.4 L28.9 8.8 L29.3 8.9",
    "M26.4 64.0 L26.4 65.0 L26.1 65.0",
    "M17.2 48.4 L16.2 49.2",
    "M45.7 89.9 L45.9 88.6",
    "M34.4 77.5 L34.7 78.0 L34.7 78.7",
    "M40.1 81.5 L40.0 80.8 L40.4 80.4",
    "M37.3 49.6 L37.3 50.9",
    "M36.4 51.1 L36.3 52.4",
    "M40.9 56.5 L40.6 57.7",
    "M34.7 56.5 L34.5 57.8",
    "M39.5 59.2 L38.8 59.7 L39.0 60.1",
    "M27.7 59.9 L27.9 60.0 L28.0 60.6 L27.5 60.6",
    "M38.7 48.3 L39.1 48.2 L40.0 48.5",
    "M43.3 44.8 L43.7 45.0 L44.5 45.2",
    "M45.1 39.4 L44.8 40.6",
    "M46.5 13.8 L47.1 14.9",
    "M23.9 59.8 L24.6 60.0 L25.1 59.9",
    "M24.3 59.9 L24.2 60.2 L23.9 60.5 L24.0 61.0",
    "M14.9 35.1 L16.0 35.5",
    "M10.2 37.6 L9.2 37.4 L9.1 37.6",
    "M36.5 80.1 L36.6 79.8 L36.9 79.7 L36.8 79.1",
    "M29.8 48.5 L29.6 47.2",
    "M35.5 39.6 L36.1 40.3 L36.0 40.6",
    "M38.5 47.5 L37.7 47.6 L37.3 47.4",
    "M34.1 37.4 L35.1 36.6",
    "M32.5 35.1 L33.3 34.1",
    "M42.6 30.4 L42.5 30.0 L42.6 29.6 L43.1 29.6",
    "M30.8 6.7 L32.0 7.2",
    "M76.1 66.5 L75.4 66.0 L75.1 65.7",
    "M28.2 51.3 L27.9 51.4 L27.5 51.3 L27.4 51.1 L27.5 50.8",
    "M25.1 61.8 L24.4 61.8 L24.2 62.2",
    "M26.9 54.7 L27.0 54.1 L27.7 54.2",
    "M4.0 39.6 L2.8 39.7",
    "M11.6 43.8 L10.7 43.4 L10.5 43.5",
    "M42.7 78.8 L42.9 80.0",
    "M28.3 50.3 L29.5 49.8",
    "M28.5 50.6 L29.6 50.1",
    "M28.6 50.9 L29.7 50.3",
    "M28.7 51.1 L29.9 50.6",
    "M40.2 58.4 L41.0 59.4",
    "M31.8 63.0 L31.7 61.7",
    "M38.9 15.8 L40.0 16.4",
    "M28.9 11.3 L29.9 12.0",
    "M48.6 12.5 L48.9 12.7 L49.2 12.9 L48.9 13.2",
    "M23.9 59.8 L23.3 59.2 L23.1 58.9",
    "M42.5 85.2 L42.6 85.7 L42.5 85.7 L42.5 86.3",
    "M40.6 83.3 L40.6 82.0",
    "M37.3 59.8 L38.6 59.9",
    "M41.8 68.1 L40.5 68.0",
    "M40.5 68.0 L40.4 68.1 L40.4 69.2",
    "M27.8 63.8 L27.9 62.5",
    "M29.1 44.3 L29.1 44.6 L29.6 44.8 L29.8 45.2",
    "M28.7 11.7 L29.7 12.3",
    "M30.9 10.0 L30.9 9.8 L31.7 9.1",
    "M24.9 62.7 L25.6 62.7 L25.6 62.2",
    "M17.9 52.7 L17.9 53.3 L17.6 53.9",
    "M23.0 44.8 L22.1 44.1",
    "M25.9 11.3 L25.3 12.3",
    "M25.5 11.0 L25.3 10.9 L25.2 11.0 L25.1 10.8 L24.5 10.8",
    "M41.0 89.2 L41.2 88.8 L42.0 88.9",
    "M37.2 89.8 L38.2 90.3",
    "M34.9 76.0 L34.1 76.0 L34.3 76.5",
    "M30.1 50.2 L31.2 49.8",
    "M28.3 50.0 L29.4 49.5",
    "M34.7 55.3 L34.4 56.4",
    "M30.5 56.3 L31.7 56.1",
    "M40.2 64.2 L41.2 63.8 L41.3 63.7",
    "M40.0 59.8 L39.5 59.2 L39.8 58.9",
    "M32.4 48.7 L33.6 48.6",
    "M40.0 47.2 L40.0 48.5",
    "M39.9 35.3 L39.8 36.5",
    "M45.2 15.8 L45.0 16.0 L44.3 15.3",
    "M4.0 39.2 L2.8 39.2",
    "M26.6 8.1 L26.3 8.1 L26.2 8.2 L25.5 8.1",
    "M43.4 81.8 L43.6 83.0",
    "M41.9 91.8 L42.5 91.5 L42.4 91.7",
    "M28.9 81.9 L28.5 80.7",
    "M33.6 83.1 L34.3 82.9 L34.3 82.4",
    "M42.1 49.9 L43.2 50.3",
    "M39.1 49.9 L39.5 49.9 L39.6 50.2 L39.8 50.2 L39.8 50.4",
    "M28.8 49.8 L29.3 50.9",
    "M35.4 62.0 L36.6 61.9",
    "M38.4 64.7 L38.3 65.9",
    "M41.6 69.2 L40.4 69.2",
    "M28.1 41.2 L27.8 40.7 L28.5 40.5",
    "M46.0 32.9 L46.2 32.9 L46.0 33.9",
    "M35.6 9.9 L35.8 9.3",
    "M37.0 11.2 L36.9 11.5 L37.4 11.8 L37.2 12.1",
    "M32.7 12.0 L33.8 12.6",
    "M78.3 89.6 L78.5 89.4 L78.9 88.6",
    "M22.1 59.5 L21.4 59.6 L21.0 59.4",
    "M17.5 52.7 L16.9 53.6",
    "M26.1 47.7 L25.0 47.3",
    "M14.0 41.4 L14.6 41.2 L15.0 41.6",
    "M9.9 27.7 L10.3 27.4 L10.9 27.2",
    "M26.1 44.5 L24.9 44.8",
    "M40.2 78.2 L41.4 78.4",
    "M33.2 82.8 L32.8 82.8 L32.8 83.2 L32.4 83.2",
    "M37.2 77.9 L37.1 76.8",
    "M42.0 56.6 L42.5 56.8 L42.5 57.4",
    "M34.0 61.2 L34.1 62.1 L34.4 62.1",
    "M32.2 65.5 L32.0 64.3",
    "M34.7 41.0 L35.2 42.1",
    "M29.4 45.8 L29.1 45.8 L28.9 45.9 L29.0 46.4 L28.9 46.6",
    "M37.9 36.4 L38.7 37.2",
    "M41.0 9.6 L41.4 9.7 L42.0 9.2",
    "M28.3 6.9 L28.0 7.5 L28.0 8.0",
    "M2.7 38.4 L2.7 38.3 L3.9 38.3",
    "M10.0 37.9 L8.9 37.8",
    "M8.2 27.3 L7.5 27.4 L7.0 27.3",
    "M28.0 9.0 L27.8 9.4 L27.4 9.5 L27.1 9.3",
    "M23.4 13.1 L22.8 13.8 L22.6 13.7",
    "M23.5 10.1 L24.3 9.8 L24.4 9.6",
    "M23.3 11.6 L23.2 12.0 L22.8 12.6",
    "M38.7 94.2 L38.9 93.6 L39.0 93.5 L39.2 93.2",
    "M32.1 88.5 L33.0 88.4",
    "M33.2 80.6 L33.3 81.7",
    "M37.3 50.9 L38.4 51.1",
    "M34.0 56.3 L33.6 57.4",
    "M34.3 55.2 L34.0 56.3",
    "M35.0 58.4 L34.6 59.5",
    "M35.0 59.6 L35.5 58.5",
    "M30.2 58.3 L31.4 58.1",
    "M42.5 71.0 L41.3 71.1",
    "M39.9 58.6 L40.6 59.5",
    "M42.7 35.9 L42.7 35.5 L43.0 34.8",
    "M46.2 31.4 L46.7 31.3 L47.4 31.5",
    "M33.3 11.1 L33.7 11.2 L33.4 11.9",
    "M42.3 9.4 L42.2 9.5 L43.4 9.7",
    "M48.2 12.1 L47.9 11.8 L48.4 12.0",
    "M39.8 11.8 L40.0 11.7 L40.3 11.7 L40.2 11.7",
    "M76.8 16.2 L76.3 15.9 L76.1 15.3",
    "M23.7 62.4 L23.8 61.9 L24.4 61.8",
    "M3.4 40.1 L3.6 41.2",
    "M14.5 36.2 L14.9 35.1",
    "M14.9 29.3 L14.0 28.5",
    "M32.6 85.3 L32.7 85.7 L32.9 86.0 L32.9 86.0",
    "M30.3 50.7 L31.3 50.2",
    "M35.0 55.4 L34.7 56.5",
    "M33.3 54.0 L33.2 52.9",
    "M30.6 56.8 L31.7 56.6",
    "M39.8 64.3 L39.6 63.4 L39.9 63.4",
    "M33.5 62.5 L33.6 63.6",
    "M42.0 45.5 L42.1 45.2 L42.5 45.2 L42.8 45.4",
    "M35.7 35.4 L35.7 35.7 L36.1 35.8 L36.1 36.1",
    "M42.2 9.4 L41.7 9.7 L41.7 9.7 L42.0 9.6",
    "M33.9 9.2 L33.5 10.0 L33.5 10.2",
    "M51.8 10.2 L52.2 10.7 L51.8 11.1",
    "M25.4 48.6 L25.2 49.7",
    "M15.0 38.3 L15.1 38.1 L15.8 38.6",
    "M6.6 40.4 L7.3 41.2",
    "M24.2 13.0 L24.7 13.3 L24.6 13.8",
    "M43.9 88.0 L45.0 88.3",
    "M40.4 94.4 L39.8 94.6 L39.6 95.0",
    "M38.9 70.2 L38.9 70.5 L39.7 70.5",
    "M27.8 59.6 L27.5 60.1 L27.5 60.6",
    "M40.8 56.7 L41.6 56.9 L41.6 57.0 L41.8 57.1",
    "M32.5 11.2 L33.1 11.5 L33.3 11.1",
    "M32.7 10.8 L32.2 11.8",
    "M32.4 7.5 L32.9 7.6 L33.1 7.2 L33.3 7.4",
    "M39.5 9.9 L39.3 10.1 L39.5 10.0",
    "M26.9 64.5 L26.9 65.6",
    "M10.9 40.0 L10.2 40.9",
    "M34.3 82.4 L33.2 82.8",
    "M36.9 87.2 L36.9 87.6 L36.8 87.6 L36.7 87.8",
    "M33.5 82.6 L32.6 82.6 L32.5 82.4",
    "M39.9 71.4 L41.0 71.3",
    "M30.6 63.4 L30.7 64.5",
    "M34.5 64.1 L33.9 64.2 L33.9 64.7",
    "M34.8 64.8 L34.5 64.9 L33.7 64.7",
    "M32.7 49.0 L32.9 48.9 L33.7 49.1",
    "M44.0 31.2 L44.0 31.6 L44.6 31.7",
    "M45.7 33.0 L45.9 32.0",
    "M37.9 12.0 L38.4 12.3 L38.7 11.8",
    "M40.3 9.9 L40.7 9.4",
    "M74.2 17.6 L75.1 18.3",
    "M27.0 80.9 L27.0 80.3 L26.6 80.0",
    "M23.9 49.5 L24.9 49.7",
    "M22.5 12.2 L21.9 13.1",
    "M12.5 25.2 L12.5 24.7 L11.9 24.5",
    "M28.9 73.0 L28.8 74.1",
    "M36.1 87.2 L36.0 87.3 L36.1 87.5 L36.8 87.6",
    "M33.7 84.6 L33.1 84.6 L32.9 85.1",
    "M39.7 58.7 L40.4 59.6",
    "M41.6 68.1 L41.6 69.2",
    "M41.4 68.1 L41.3 69.2",
    "M28.5 55.1 L28.2 56.2",
    "M38.5 55.0 L39.5 55.5",
    "M29.8 62.3 L29.7 63.4",
    "M32.5 61.8 L32.8 60.8",
    "M30.8 60.2 L30.5 59.1",
    "M30.9 41.4 L31.0 41.7 L31.8 41.8",
    "M35.4 44.7 L35.3 44.7 L34.9 44.1 L34.7 44.0",
    "M39.8 36.5 L40.5 36.6 L40.8 36.8",
    "M45.7 33.8 L46.0 33.9 L46.7 33.4",
    "M38.3 6.3 L38.9 5.4",
    "M29.1 9.7 L28.8 10.8",
    "M27.4 50.8 L28.0 51.0 L28.1 51.2 L28.2 51.3",
    "M26.9 65.6 L26.3 65.4 L26.2 65.0",
    "M15.3 46.9 L16.0 47.7",
    "M19.9 44.9 L20.7 45.6",
    "M10.7 42.3 L10.7 42.1 L11.3 41.8 L11.3 41.7",
    "M12.2 37.0 L11.9 36.8 L11.3 36.8 L11.4 36.6",
    "M10.5 31.9 L10.6 32.2 L10.4 32.9",
    "M26.7 8.8 L25.6 9.0",
    "M25.0 11.8 L24.8 12.4 L24.3 12.1",
    "M43.7 76.8 L44.4 76.9 L44.4 77.2",
    "M41.8 79.5 L42.8 79.5",
    "M42.3 88.0 L42.3 88.4 L42.1 88.9 L42.0 88.9",
    "M37.9 93.1 L37.9 94.2",
    "M34.7 82.4 L35.0 83.4",
    "M34.3 78.8 L33.2 78.7",
    "M34.6 61.2 L34.9 61.3 L34.9 62.1",
    "M31.7 60.0 L31.5 58.9",
    "M43.0 57.4 L43.1 58.4",
    "M43.2 46.2 L44.2 46.7",
    "M38.3 36.1 L39.0 36.9",
    "M42.8 37.5 L43.9 37.5",
    "M24.3 52.3 L25.1 52.4 L25.4 52.2",
    "M24.2 62.2 L24.3 63.3",
    "M22.5 64.2 L22.5 64.7 L22.9 65.0",
    "M12.3 45.9 L12.2 46.4 L11.8 46.1",
    "M8.9 34.4 L9.4 34.6 L9.2 35.0",
    "M41.5 87.8 L41.7 88.1 L41.8 88.8",
    "M29.7 83.3 L28.7 83.2",
    "M37.4 51.8 L38.4 52.0",
    "M32.8 57.3 L32.9 57.6 L33.6 57.9",
    "M40.4 67.0 L40.5 68.0",
    "M34.8 62.4 L34.8 63.1 L35.2 63.0",
    "M38.4 65.3 L38.8 65.4 L38.8 66.0",
    "M39.5 58.7 L40.2 58.1 L40.3 58.3",
    "M28.6 61.9 L28.6 62.1 L28.8 62.3 L29.4 62.4",
    "M28.9 65.9 L29.9 65.8",
    "M43.1 58.4 L42.8 59.4 L42.7 59.4",
    "M39.3 56.1 L39.6 56.3 L40.3 56.1",
    "M32.1 45.8 L31.9 46.3 L32.2 46.7",
    "M30.8 39.1 L31.1 40.1",
    "M45.2 37.6 L44.7 37.5 L44.7 36.9",
    "M46.8 26.9 L46.8 28.0",
    "M31.4 5.9 L32.0 5.0",
    "M37.6 10.6 L37.6 9.9 L38.0 10.1",
    "M26.5 51.1 L27.5 51.6",
    "M26.3 60.7 L26.3 61.7",
    "M16.7 52.6 L16.7 51.6",
    "M10.7 36.3 L10.5 36.7 L10.0 36.7 L9.9 36.8",
    "M15.5 32.3 L15.9 32.3 L16.1 32.9",
    "M9.2 40.4 L8.9 40.0 L9.1 39.8 L9.1 39.5",
    "M22.6 45.6 L22.4 45.4 L22.7 45.1 L22.5 45.1 L22.5 45.1 L22.6 45.3",
    "M15.2 46.8 L14.7 47.0 L14.6 46.5",
    "M25.6 13.5 L25.8 13.1 L26.4 13.1",
    "M40.2 77.8 L41.2 77.8",
    "M40.7 90.1 L41.0 89.2",
    "M40.0 86.7 L40.1 87.7",
    "M30.3 81.8 L30.3 81.4 L30.6 81.3 L30.6 81.1",
    "M36.4 55.0 L36.6 54.0",
    "M35.4 56.0 L35.3 55.7 L34.7 55.3",
    "M32.3 52.7 L32.4 53.7",
    "M43.3 64.9 L43.3 63.8",
    "M39.4 69.4 L39.4 69.5 L39.6 69.6 L40.3 69.7",
    "M42.4 59.0 L41.9 59.2 L41.6 58.7",
    "M38.3 63.3 L38.3 63.4 L37.4 63.4",
    "M31.7 38.5 L31.8 37.5",
    "M41.6 42.8 L41.7 43.5 L42.0 43.6",
    "M28.1 8.1 L28.3 8.3 L28.0 9.0",
    "M37.4 5.8 L38.3 6.3",
    "M57.0 96.2 L56.6 95.2",
    "M27.8 56.5 L27.5 57.1 L27.2 57.1",
    "M26.9 63.6 L26.9 62.6",
    "M22.8 58.9 L23.0 59.4 L23.4 59.7",
    "M13.3 44.8 L14.3 45.2",
    "M13.6 44.2 L14.5 44.6",
    "M8.4 44.4 L7.4 44.4",
    "M8.2 42.6 L7.7 42.6 L7.7 42.8 L7.3 42.8",
    "M36.0 80.7 L37.1 80.7",
    "M42.3 89.2 L42.1 89.7 L42.2 89.7",
    "M35.1 76.9 L34.5 77.0 L34.6 77.4",
    "M35.0 82.3 L35.1 81.9 L35.5 81.9 L35.6 81.8",
    "M35.5 79.9 L36.3 79.6 L36.4 79.4",
    "M40.5 84.9 L40.6 84.5 L41.2 84.8",
    "M42.4 87.6 L42.7 86.9 L42.5 86.7",
    "M33.6 61.3 L34.6 61.2",
    "M39.0 66.8 L39.1 67.9",
    "M38.1 69.1 L38.5 69.2 L38.3 69.8",
    "M33.2 45.1 L33.3 45.3 L33.6 45.3 L33.7 45.8",
    "M29.1 44.6 L29.2 45.0 L29.5 45.5",
    "M35.7 37.5 L36.2 37.2 L36.4 36.9",
    "M46.8 17.0 L46.4 17.3 L46.0 16.9",
    "M33.4 11.9 L33.9 12.3 L33.8 12.6",
    "M29.5 9.6 L30.4 10.1",
    "M41.5 8.3 L41.9 8.0 L42.1 8.4",
    "M32.7 7.6 L32.7 7.8 L32.8 7.9 L32.5 8.5",
    "M23.1 46.8 L23.0 47.2 L23.0 47.8",
    "M23.4 49.2 L23.3 49.6 L23.9 49.7",
    "M8.2 37.8 L8.1 38.3 L8.6 38.4",
    "M25.9 11.8 L26.9 12.0",
    "M39.0 77.2 L38.9 78.2",
    "M42.7 89.2 L43.0 89.5 L43.6 89.6",
    "M45.7 87.1 L45.9 87.1 L46.0 87.4 L46.2 87.9",
    "M36.0 93.0 L35.7 94.0",
    "M29.5 91.2 L29.0 91.5 L28.5 91.6",
    "M36.9 58.0 L37.3 57.1",
    "M38.1 57.9 L37.7 58.8",
    "M30.5 59.1 L31.5 58.9",
    "M29.9 55.9 L30.1 56.8 L30.0 56.9",
    "M35.4 65.7 L36.4 65.4",
    "M44.2 46.7 L44.9 47.0 L45.0 46.8",
    "M35.7 10.6 L35.5 11.0 L35.5 11.2 L35.4 11.5",
    "M29.6 7.3 L29.6 7.4 L30.4 7.8",
    "M47.1 21.1 L47.2 21.4 L47.9 21.2",
    "M25.6 53.0 L25.6 52.5 L25.1 52.4",
    "M23.9 49.0 L24.6 49.1 L24.7 48.8",
    "M39.3 97.5 L39.3 97.4 L39.0 97.0 L39.3 96.8",
    "M41.7 95.8 L41.1 95.7 L40.8 95.8",
    "M32.7 49.7 L32.9 49.9 L32.5 50.5",
    "M42.1 55.0 L42.8 54.8 L43.1 54.9",
    "M31.2 65.4 L32.2 65.4",
    "M40.8 62.8 L40.9 61.8",
    "M41.4 71.2 L41.7 72.1",
    "M41.3 55.5 L41.5 55.5 L41.4 56.3",
    "M30.8 60.6 L30.9 61.0 L30.7 61.1 L30.7 61.3 L31.0 61.4",
    "M42.7 49.1 L42.6 50.1",
    "M31.1 43.6 L30.8 42.6",
    "M31.4 5.9 L32.3 6.3",
    "M47.8 16.8 L48.1 17.3 L48.4 17.2",
    "M28.0 11.4 L27.7 12.3",
    "M54.0 14.9 L54.6 15.1 L55.0 15.0",
    "M27.4 46.8 L26.5 46.7",
    "M13.0 40.3 L13.1 40.0 L12.5 39.7",
    "M9.7 40.8 L10.5 41.4",
    "M17.7 40.7 L16.7 40.9",
    "M8.1 29.6 L8.8 30.0 L8.8 30.2",
    "M27.2 10.7 L26.7 11.5",
    "M40.9 89.2 L40.1 88.6",
    "M37.5 87.7 L37.4 88.0",
    "M35.8 95.3 L35.7 94.5 L35.8 94.4",
    "M42.7 88.9 L43.7 89.0",
    "M35.0 51.0 L35.0 52.0",
    "M42.4 56.1 L42.6 55.1",
    "M31.5 71.2 L31.5 71.6 L32.0 71.8",
    "M36.9 49.5 L36.9 48.9 L36.6 48.7",
    "M31.1 11.9 L30.5 11.8 L30.2 11.5",
    "M45.7 13.4 L44.0 13.0",
    "M46.3 9.9 L46.6 10.1 L46.9 10.0 L47.1 10.1",
    "M74.2 17.6 L75.0 17.0",
    "M11.8 43.4 L11.2 43.1 L11.0 43.0 L11.1 42.9",
    "M39.3 76.2 L39.1 77.2",
    "M34.3 82.8 L34.6 83.8",
    "M33.2 83.6 L32.2 83.7",
    "M41.7 81.0 L41.7 82.0",
    "M40.6 90.1 L40.4 90.0 L40.5 90.1 L40.6 90.2",
    "M42.1 86.3 L42.1 85.8 L41.8 85.5",
    "M37.1 54.2 L36.9 55.2",
    "M29.7 57.5 L30.2 58.3",
    "M40.0 68.5 L40.0 68.9 L40.4 68.9",
    "M29.9 63.5 L29.8 64.5",
    "M39.0 71.7 L38.9 70.7",
    "M31.5 50.9 L30.5 51.1",
    "M29.1 40.5 L29.4 40.7 L29.5 41.3",
    "M44.1 46.4 L45.0 46.8",
    "M35.6 34.5 L36.2 34.8 L36.2 35.1",
    "M32.0 9.9 L32.4 10.1 L32.7 9.6",
    "M29.2 9.3 L29.6 8.4",
    "M77.2 62.4 L76.6 62.5 L76.5 62.8",
    "M11.2 38.9 L10.4 38.5",
    "M16.7 48.9 L16.3 48.4 L16.5 48.2",
    "M12.3 26.8 L12.8 26.9 L12.9 26.4",
    "M24.4 11.1 L24.6 11.1 L25.3 11.4",
    "M23.1 12.9 L23.5 12.3 L23.4 12.2",
    "M30.7 80.2 L31.2 80.0 L31.5 79.7",
    "M40.9 83.3 L41.0 84.2",
    "M38.2 50.1 L38.1 51.0",
    "M39.3 57.8 L39.5 57.7 L39.9 58.3",
    "M41.3 59.6 L41.6 59.7 L41.6 60.2 L41.7 60.3",
    "M28.6 58.0 L28.8 58.5 L29.0 58.6 L29.0 58.7",
    "M39.8 39.8 L39.8 40.0 L40.1 40.4 L40.4 40.4",
    "M45.7 34.5 L46.6 34.6",
    "M46.8 28.9 L47.0 29.5 L47.3 29.6",
    "M30.2 11.5 L29.7 12.3",
    "M31.8 8.1 L32.1 7.6 L32.4 7.5",
    "M30.7 7.6 L31.1 6.8",
    "M76.2 52.0 L76.4 51.8 L77.0 51.7",
    "M67.1 4.3 L66.9 5.2 L66.9 5.6",
    "M13.2 32.4 L13.5 32.0 L13.9 31.8",
    "M20.1 11.6 L19.5 12.0 L19.4 12.1 L19.4 12.1",
    "M28.7 6.9 L29.0 6.4 L28.8 6.2",
    "M41.4 80.0 L41.3 80.9",
    "M27.8 90.6 L28.6 90.2",
    "M39.8 81.6 L39.2 81.7 L39.1 81.4",
    "M37.3 50.6 L38.2 50.5",
    "M42.1 57.7 L42.3 57.9 L42.3 58.1 L42.6 58.2 L42.5 58.4",
    "M34.4 62.1 L35.4 62.0",
    "M33.6 61.5 L33.7 62.5",
    "M37.8 66.0 L37.7 66.9",
    "M31.4 60.5 L31.2 61.4",
    "M30.7 59.8 L31.6 59.6",
    "M31.1 49.5 L32.0 49.2",
    "M29.3 49.3 L28.7 49.5 L28.8 49.8",
    "M35.4 45.2 L35.5 45.7 L35.9 45.6",
    "M39.3 35.6 L39.4 36.0 L39.8 36.3",
    "M41.9 37.5 L42.0 37.5 L42.8 37.4",
    "M45.7 34.8 L46.6 34.9",
    "M42.0 9.6 L43.2 9.6 L43.4 9.8",
    "M45.3 15.9 L44.8 16.4 L44.7 16.2",
    "M31.6 7.0 L32.0 6.2",
    "M47.0 17.2 L47.8 16.8",
    "M47.1 10.1 L47.3 10.1 L47.7 10.8",
    "M65.7 28.9 L66.0 28.7 L65.8 28.3",
    "M23.7 63.3 L24.6 63.3",
    "M22.1 59.5 L22.6 60.2",
    "M24.0 48.8 L23.5 48.8 L23.4 49.2",
    "M12.2 40.2 L12.8 40.5 L13.0 40.3",
    "M26.4 43.3 L26.6 44.2",
    "M13.1 39.3 L13.4 39.5 L13.1 40.0",
    "M40.4 85.6 L40.5 86.0 L41.0 85.9",
    "M37.4 52.6 L38.3 52.9",
    "M31.2 57.2 L31.4 58.1",
    "M41.0 59.8 L41.1 60.7",
    "M38.2 48.8 L38.3 49.7",
    "M37.8 49.7 L37.8 48.8",
    "M30.9 37.5 L31.1 37.9 L31.2 38.3",
    "M35.0 42.8 L35.8 43.1",
    "M44.7 39.3 L45.6 39.5",
    "M39.4 36.6 L38.8 35.9",
    "M43.1 29.4 L43.5 29.5 L44.0 29.7",
    "M44.6 10.3 L45.0 9.5",
    "M38.6 12.8 L39.0 12.0",
    "M32.4 10.8 L33.3 11.1",
    "M29.3 10.1 L30.2 10.4",
    "M32.0 7.2 L31.6 8.0",
    "M31.7 5.5 L32.5 5.9",
    "M47.4 18.1 L46.5 18.4",
    "M12.3 26.3 L12.3 27.2",
    "M23.7 9.0 L23.8 9.9",
    "M33.1 90.6 L34.0 90.3",
    "M39.2 93.2 L39.8 93.4 L40.1 93.4",
    "M37.7 58.8 L38.6 58.9",
    "M27.6 53.3 L27.7 53.5 L28.3 53.4",
    "M37.5 62.7 L38.4 62.6",
    "M40.4 71.1 L41.3 71.1",
    "M39.9 51.5 L40.0 50.6",
    "M48.7 15.0 L49.4 15.2",
    "M37.6 10.6 L37.6 10.5 L37.6 10.8",
    "M76.4 51.9 L77.3 52.2",
    "M15.5 47.2 L15.1 47.6 L15.2 47.9",
    "M16.5 34.8 L17.2 34.3",
    "M8.7 38.7 L8.9 39.2 L8.7 39.4",
    "M25.2 9.1 L25.4 9.6 L25.7 9.5",
    "M41.8 89.6 L40.7 90.1",
    "M37.1 83.1 L37.0 82.2",
    "M34.2 77.7 L33.3 77.8",
    "M39.5 55.5 L39.2 56.3",
    "M35.9 58.7 L36.8 59.0",
    "M32.7 63.5 L32.8 64.4",
    "M32.7 63.5 L32.7 63.0 L32.2 63.0",
    "M39.4 64.4 L40.2 64.2",
    "M38.5 66.9 L39.3 66.8",
    "M38.2 71.8 L38.0 71.0",
    "M34.4 61.2 L34.5 62.1",
    "M31.7 43.8 L32.1 44.2 L32.0 44.5",
    "M42.0 38.2 L42.8 38.1",
    "M33.5 10.2 L33.3 10.9 L33.3 11.1",
    "M46.3 21.3 L46.4 20.9 L46.9 20.8",
    "M37.5 6.9 L37.9 6.1",
    "M24.9 58.7 L25.8 58.8",
    "M5.5 58.6 L5.9 58.0",
    "M14.3 52.5 L14.3 53.1 L14.4 53.3",
    "M12.8 45.6 L12.7 46.4",
    "M16.4 35.8 L16.3 36.6",
    "M15.7 31.6 L15.7 31.9 L15.5 32.0 L15.5 32.3",
    "M17.9 41.6 L18.8 41.6",
    "M41.5 85.6 L41.3 86.0 L41.5 86.1 L41.5 86.4",
    "M28.4 82.4 L28.1 82.6 L27.7 82.4",
    "M35.2 74.5 L35.2 75.1 L35.4 75.3",
    "M38.9 78.2 L39.3 78.3 L39.3 78.8",
    "M38.8 93.1 L38.8 92.6 L39.2 92.6",
    "M42.2 50.8 L43.1 50.6",
    "M39.5 50.7 L39.5 51.6",
    "M42.0 52.2 L42.8 52.0",
    "M41.4 53.0 L41.7 52.2",
    "M30.7 51.5 L31.5 51.3",
    "M29.5 56.7 L28.6 56.8",
    "M31.9 58.4 L31.5 58.5 L31.5 58.9",
    "M41.4 68.1 L41.4 67.9 L41.6 67.8 L41.5 67.4",
    "M29.8 64.9 L29.3 64.9 L29.4 64.4",
    "M38.4 69.2 L38.9 68.5",
    "M33.6 39.0 L33.5 38.1",
    "M38.1 7.7 L38.8 8.2",
    "M34.4 14.0 L34.1 13.6 L34.4 13.3",
    "M43.1 15.2 L43.6 14.5",
    "M47.9 14.4 L47.6 14.0 L47.4 13.9",
    "M45.3 20.3 L45.5 20.3 L45.8 20.6 L46.0 20.6",
    "M29.6 7.4 L29.5 7.7 L29.2 7.6 L29.1 7.9",
    "M79.0 12.3 L78.8 11.7 L78.9 11.5",
    "M5.2 51.2 L4.9 51.0 L4.4 51.2",
    "M14.1 35.4 L13.9 35.4 L13.9 36.0",
    "M15.0 26.4 L15.5 26.3 L15.7 26.0",
    "M9.5 41.9 L9.9 42.6",
    "M25.4 10.6 L25.7 10.5 L26.2 10.8",
    "M24.4 13.6 L24.0 14.4",
    "M39.4 83.4 L40.3 83.3",
    "M38.7 94.7 L38.7 94.2 L39.0 94.2",
    "M38.4 80.4 L38.6 80.5 L38.6 80.9 L38.5 80.9",
    "M35.5 51.1 L35.5 52.0",
    "M37.1 54.3 L38.0 54.5",
    "M37.8 61.8 L38.7 61.6",
    "M39.9 63.4 L40.2 64.2",
    "M39.2 63.6 L39.4 64.4",
    "M36.6 62.7 L37.5 62.7",
    "M39.8 39.8 L39.9 39.8 L40.4 40.4",
    "M28.6 43.1 L28.9 43.9",
    "M28.2 42.0 L28.1 41.2",
    "M41.9 37.3 L42.8 37.2",
    "M74.7 16.5 L74.9 17.0 L75.2 17.0",
    "M25.7 50.8 L25.7 51.0 L26.4 51.1",
    "M26.9 64.9 L27.7 64.9",
    "M10.7 29.4 L11.3 29.2 L11.5 29.0",
    "M8.6 35.2 L9.3 35.6",
    "M27.8 10.4 L27.4 10.3 L27.2 10.7",
    "M21.2 13.2 L21.7 13.4 L21.9 13.1",
    "M20.6 12.5 L21.2 12.5 L21.2 12.2",
    "M43.5 75.1 L44.1 74.9 L44.1 74.7",
    "M36.2 92.7 L36.6 91.9",
    "M31.9 81.3 L31.9 80.4",
    "M30.8 93.4 L31.7 93.4",
    "M32.1 56.0 L32.9 55.9",
    "M32.6 59.9 L33.4 60.1",
    "M35.8 42.9 L35.6 42.9 L35.0 42.8",
    "M42.0 36.1 L42.3 35.3",
    "M24.5 51.0 L23.7 50.9",
    "M27.2 59.1 L27.6 59.3 L27.8 59.6",
    "M22.1 59.5 L22.8 59.1",
    "M22.1 47.5 L22.1 46.7",
    "M27.9 10.0 L27.5 9.9 L27.4 10.3",
    "M23.8 14.7 L23.0 14.5",
    "M11.9 25.2 L11.9 24.4",
    "M39.1 77.2 L39.9 77.4",
    "M43.8 79.5 L44.6 79.6",
    "M37.2 81.4 L37.3 81.6 L37.4 82.1",
    "M37.8 90.7 L38.0 90.8 L38.4 91.3",
    "M37.3 85.0 L36.5 85.0",
    "M36.1 86.5 L36.0 86.7 L36.1 86.8 L36.1 87.2",
    "M36.4 82.2 L36.1 81.8 L36.4 81.6",
    "M35.5 84.2 L35.5 83.7 L35.5 83.5 L35.7 83.5",
    "M35.6 74.9 L35.6 75.2 L36.2 75.2",
    "M37.6 75.2 L38.4 75.2",
    "M39.5 92.7 L40.3 93.0",
    "M35.4 54.7 L35.7 53.9",
    "M39.9 66.9 L39.9 67.7",
    "M38.5 66.5 L39.3 66.2",
    "M40.0 66.0 L40.1 65.2",
    "M42.1 61.0 L42.1 61.1 L42.8 61.4",
    "M29.4 61.2 L29.3 61.2 L29.0 61.3 L29.0 61.7",
    "M29.5 61.2 L29.5 60.8 L29.9 60.7",
    "M38.1 71.4 L38.9 71.2",
    "M38.9 71.0 L38.1 71.1",
    "M35.4 65.6 L35.5 65.3 L35.7 65.2 L35.6 65.0",
    "M43.9 44.0 L44.2 43.8 L44.3 43.4",
    "M42.5 43.2 L42.9 43.4 L42.9 43.8",
    "M37.7 37.4 L38.3 36.8",
    "M30.9 10.8 L31.3 10.7 L31.6 11.0",
    "M39.3 17.1 L38.7 16.5",
    "M40.0 9.9 L39.7 10.0 L39.5 10.0",
    "M65.9 9.2 L66.1 8.4",
    "M15.8 37.3 L15.1 36.9",
    "M11.4 36.3 L11.6 35.5",
    "M18.3 45.5 L17.6 45.1",
    "M26.5 12.8 L26.0 12.8 L25.9 13.1",
    "M35.2 82.4 L35.2 83.2",
    "M36.2 75.8 L35.4 75.8",
    "M30.2 49.3 L30.5 50.1",
    "M35.9 59.7 L35.8 60.5",
    "M36.3 59.3 L36.1 60.1",
    "M39.6 60.5 L40.4 60.4",
    "M39.2 66.0 L39.3 65.2",
    "M39.4 47.1 L39.7 46.3",
    "M41.4 46.9 L41.8 46.2",
    "M43.2 46.2 L43.6 46.9",
    "M39.5 37.2 L40.0 37.8",
    "M49.0 11.6 L48.9 11.5 L48.6 11.5 L48.6 11.3",
    "M39.5 15.5 L40.3 15.9",
    "M36.4 6.2 L36.8 5.6",
    "M32.4 6.5 L32.0 7.2",
    "M40.6 18.0 L40.9 17.3",
    "M76.5 52.4 L76.9 51.7",
    "M14.9 31.1 L15.2 31.3 L15.5 30.9",
    "M45.3 84.4 L45.7 84.2 L45.8 83.9",
    "M46.3 85.6 L46.9 85.1",
    "M35.0 79.1 L34.2 79.2",
    "M36.8 75.8 L37.6 75.8",
    "M43.7 83.0 L43.8 83.8",
    "M43.3 83.0 L43.2 82.2",
    "M33.4 51.0 L34.1 50.7",
    "M36.0 54.9 L35.9 55.6",
    "M34.8 60.6 L34.5 60.4 L34.7 60.0",
    "M39.8 60.9 L39.8 61.7",
    "M31.4 63.1 L32.2 63.0",
    "M35.8 61.4 L36.5 61.6",
    "M34.0 63.3 L33.9 62.5",
    "M36.8 63.4 L37.5 63.8",
    "M38.0 55.6 L37.6 56.3",
    "M38.1 66.7 L38.2 65.9",
    "M33.0 46.8 L33.7 46.7 L33.6 46.5",
    "M42.6 45.8 L43.2 46.2",
    "M42.9 35.2 L43.6 35.2",
    "M29.5 9.8 L28.7 9.7",
    "M56.7 96.4 L56.6 96.2 L56.7 95.7",
    "M6.9 50.9 L7.0 51.1 L7.5 51.1",
    "M5.5 40.3 L5.2 39.5",
    "M13.8 38.0 L14.5 38.3",
    "M21.5 47.8 L20.8 47.5",
    "M10.8 23.8 L11.5 24.2",
    "M38.9 78.2 L38.9 78.6 L38.6 78.5",
    "M40.2 89.5 L41.0 89.5",
    "M40.4 86.5 L40.5 87.2 L40.7 87.2",
    "M40.9 97.7 L40.2 97.5",
    "M38.8 91.0 L39.4 91.5",
    "M32.6 93.1 L32.3 93.1 L32.1 93.4 L32.1 93.5",
    "M32.7 82.6 L31.9 82.5",
    "M39.6 81.2 L39.1 81.4 L39.0 81.2",
    "M32.8 94.4 L32.5 94.7 L32.2 94.7",
    "M41.8 85.2 L41.5 84.9 L41.3 85.1",
    "M40.5 93.0 L40.4 92.3",
    "M31.8 58.0 L32.6 57.9",
    "M35.2 59.0 L35.6 59.2 L35.8 58.9",
    "M39.6 66.0 L39.7 65.2",
    "M40.5 43.8 L40.4 43.6 L40.5 44.0 L40.5 43.8",
    "M38.2 49.2 L39.0 49.1",
    "M33.0 48.9 L33.2 49.3 L33.5 49.4",
    "M40.2 33.5 L40.0 33.9 L40.1 34.2",
    "M41.2 37.2 L41.4 37.4 L41.9 37.5",
    "M28.5 9.1 L29.2 9.3",
    "M45.0 10.8 L45.5 11.3",
    "M41.6 17.6 L41.4 17.4 L41.7 17.0",
    "M49.5 15.6 L49.0 16.2",
    "M40.7 11.7 L41.5 11.5",
    "M23.7 63.8 L23.6 64.5",
    "M25.7 46.7 L25.9 46.2 L26.0 46.2",
    "M18.8 42.6 L19.5 42.9",
    "M27.2 43.1 L27.5 43.8",
    "M42.8 79.5 L43.6 79.5",
    "M46.2 90.0 L45.4 89.9",
    "M33.2 85.3 L33.0 85.6 L33.1 85.6 L33.0 86.0",
    "M32.9 85.1 L32.5 85.4",
    "M43.0 91.4 L43.2 91.4 L43.2 91.4 L43.1 91.4",
    "M40.5 81.3 L40.5 81.8 L40.7 81.9",
    "M39.0 55.3 L38.7 56.0",
    "M28.9 56.0 L29.1 56.7",
    "M32.4 60.5 L31.6 60.4",
    "M34.7 39.2 L35.0 39.8",
    "M27.7 45.4 L27.9 45.2 L28.0 44.7",
    "M42.8 30.9 L42.2 30.9 L42.1 30.7",
    "M27.8 13.2 L28.5 13.5",
    "M22.7 48.1 L22.2 48.1 L22.0 48.0",
    "M19.1 44.8 L19.3 44.1",
    "M3.0 41.5 L3.2 41.7 L3.6 41.6",
    "M8.4 29.1 L8.6 28.8 L9.0 29.0",
    "M7.5 40.2 L8.0 40.1 L8.1 39.9",
    "M27.1 8.5 L26.7 8.5 L26.7 8.8",
    "M27.0 7.1 L27.0 7.4 L27.4 7.5",
    "M24.8 13.9 L24.6 14.2 L24.9 14.4",
    "M26.9 10.6 L27.6 10.8",
    "M39.4 77.3 L39.2 78.0",
    "M41.1 75.1 L41.8 75.0",
    "M34.0 92.0 L34.4 91.8 L34.2 91.5",
    "M34.7 79.8 L34.6 79.1",
    "M30.3 58.4 L30.5 59.1",
    "M30.1 53.8 L30.3 54.0 L30.8 53.9",
    "M29.7 52.0 L30.4 51.7",
    "M35.9 47.5 L36.6 47.4",
    "M45.0 34.8 L45.7 34.8",
    "M46.2 32.9 L46.9 33.0",
    "M42.6 13.2 L42.8 12.8 L42.8 12.5",
    "M44.2 10.1 L44.5 9.5",
    "M35.9 12.3 L36.0 12.0 L36.4 12.2",
    "M29.1 10.6 L29.6 10.9 L29.6 11.1",
    "M27.7 13.5 L28.4 13.7",
    "M47.2 23.2 L47.3 22.5",
    "M27.3 64.9 L27.2 65.6",
    "M16.4 40.2 L16.7 40.1 L16.7 39.7",
    "M26.8 43.3 L27.1 43.9",
    "M11.1 23.4 L11.7 23.8",
    "M42.4 76.7 L42.5 77.5",
    "M34.4 91.8 L34.7 91.5 L34.8 91.2",
    "M34.3 78.3 L33.5 78.4",
    "M39.8 81.6 L40.5 81.5",
    "M38.4 76.0 L38.2 75.3",
    "M38.4 86.7 L38.1 86.7 L38.1 86.2",
    "M38.8 86.7 L39.5 86.5",
    "M42.1 82.3 L42.8 82.1",
    "M27.9 62.0 L28.6 61.9",
    "M28.0 58.2 L27.7 57.5",
    "M37.7 40.1 L38.4 39.7",
    "M43.0 41.6 L42.8 42.3",
    "M34.6 37.1 L35.0 37.6",
    "M45.9 32.2 L45.1 32.1",
    "M44.5 11.4 L44.9 10.8",
    "M37.6 4.4 L38.0 3.7",
    "M20.1 45.9 L19.5 46.4",
    "M27.4 44.9 L27.4 45.1 L27.6 45.1 L27.7 45.5",
    "M17.3 47.5 L17.4 47.7 L17.0 48.0",
    "M12.3 40.0 L13.0 40.3",
    "M17.8 38.9 L17.2 38.5",
    "M13.6 38.4 L14.2 38.7",
    "M27.0 7.4 L27.0 8.1",
    "M45.8 89.2 L46.5 89.3",
    "M45.9 88.9 L46.5 89.0",
    "M45.5 89.9 L45.6 89.2",
    "M33.8 92.8 L34.0 92.6 L33.9 92.2",
    "M35.6 92.4 L35.4 92.8 L35.1 92.9",
    "M36.1 76.1 L35.4 76.3",
    "M42.8 82.4 L42.1 82.5",
    "M29.8 60.1 L29.7 59.4",
    "M40.0 55.1 L40.4 55.2 L40.6 55.4",
    "M39.1 38.1 L39.2 38.0 L39.8 38.3",
    "M44.1 40.9 L44.8 41.1",
    "M35.0 13.7 L34.6 14.3",
    "M33.5 10.2 L33.8 10.4 L34.1 10.2",
    "M30.1 9.4 L30.7 9.7",
    "M28.4 10.6 L29.0 10.9",
    "M27.7 11.3 L28.4 11.5",
    "M66.1 27.9 L66.7 27.6",
    "M24.5 57.7 L24.2 58.3",
    "M15.3 38.9 L15.0 38.3",
    "M27.1 8.5 L27.3 9.2",
    "M39.1 82.9 L39.2 83.4 L39.4 83.4",
    "M33.6 93.2 L33.8 92.8 L33.7 92.6",
    "M35.8 78.6 L35.5 77.9",
    "M41.9 81.0 L41.9 81.5 L42.1 81.7",
    "M33.0 56.2 L33.5 56.1 L33.6 56.0",
    "M29.0 65.9 L29.1 66.6",
    "M31.6 50.0 L31.6 50.4 L31.4 50.5",
    "M41.4 46.9 L41.0 47.5",
    "M41.5 48.1 L41.7 48.5 L42.0 48.6",
    "M39.0 35.4 L39.3 35.6 L39.5 35.3",
    "M45.0 34.4 L45.1 34.3 L45.7 34.3",
    "M49.3 11.2 L49.4 11.9",
    "M28.6 13.1 L28.4 13.7",
    "M31.1 8.9 L31.4 8.3",
    "M34.4 13.3 L35.0 13.7",
    "M28.3 9.6 L28.0 10.3",
    "M32.4 7.1 L32.3 7.8",
    "M28.3 8.3 L28.5 8.4 L28.7 7.9",
    "M31.8 9.1 L32.1 8.5",
    "M27.4 52.6 L27.4 53.3",
    "M6.7 50.6 L6.9 50.9 L7.1 50.6",
    "M25.0 47.3 L25.2 46.6",
    "M12.7 39.5 L13.3 39.7",
    "M12.0 28.6 L12.5 28.2",
    "M9.2 27.3 L8.9 27.9",
    "M13.5 40.5 L14.0 40.8",
    "M39.5 77.3 L39.7 76.7",
    "M42.0 89.1 L42.7 89.2",
    "M38.7 88.5 L38.8 88.3 L39.2 88.3",
    "M30.7 83.9 L30.7 84.0",
    "M42.0 83.1 L42.0 83.8",
    "M42.7 83.1 L42.9 83.7",
    "M41.0 81.7 L41.2 81.7 L41.3 82.1",
    "M35.5 52.4 L35.5 53.0",
    "M28.7 51.1 L29.0 51.7",
    "M31.9 58.4 L32.0 59.0",
    "M32.0 60.4 L31.8 61.0",
    "M39.5 68.2 L39.7 68.1 L39.9 67.7",
    "M29.9 60.1 L29.2 60.2",
    "M35.3 70.0 L35.1 70.7",
    "M28.3 58.0 L28.2 57.4",
    "M40.8 41.3 L40.8 42.0",
    "M39.8 36.9 L40.3 37.4",
    "M29.7 12.3 L29.4 12.9",
    "M29.0 11.0 L29.6 11.3",
    "M42.8 12.9 L43.1 13.0 L43.3 12.9 L43.4 13.0",
    "M45.5 14.1 L45.5 13.4",
    "M25.8 50.2 L25.7 50.8",
    "M24.3 51.6 L24.3 52.3",
    "M25.3 58.7 L25.0 59.3",
    "M12.3 44.0 L11.7 43.7",
    "M12.0 35.7 L11.8 36.3",
    "M7.6 40.6 L8.0 40.7 L8.3 40.5",
    "M27.0 13.7 L27.6 13.8",
    "M23.1 10.4 L23.4 10.0 L23.5 10.1",
    "M41.8 76.7 L41.6 77.3",
    "M37.4 88.0 L38.0 88.2",
    "M43.1 91.5 L42.5 91.5",
    "M30.3 82.1 L30.3 82.8",
    "M34.7 89.0 L34.5 89.0 L34.7 89.5",
    "M33.8 50.9 L34.0 51.5",
    "M35.1 57.6 L35.7 57.9",
    "M36.0 59.2 L36.7 59.4",
    "M43.3 63.8 L43.0 63.8 L43.0 64.2",
    "M38.9 61.5 L38.9 60.9",
    "M36.8 51.1 L36.8 50.5",
    "M30.4 54.6 L30.2 54.0",
    "M36.3 40.1 L36.8 40.5",
    "M30.5 36.9 L30.9 37.5",
    "M46.2 36.7 L46.2 37.4",
    "M44.9 33.5 L44.8 33.4 L44.3 33.4",
    "M45.8 11.3 L45.9 10.9 L46.1 10.7",
    "M32.0 5.0 L32.6 5.3",
    "M76.3 52.1 L77.0 52.1",
    "M27.1 81.3 L26.5 81.1",
    "M12.3 44.0 L12.9 44.2",
    "M22.5 47.0 L22.7 47.7",
    "M24.0 48.6 L23.4 48.4",
    "M2.4 41.5 L3.0 41.5",
    "M17.4 39.4 L17.5 39.2 L18.0 39.2",
    "M8.6 35.2 L8.0 35.0",
    "M23.4 14.0 L24.0 14.2",
    "M20.8 11.3 L20.9 11.9",
    "M36.2 79.2 L36.1 78.5",
    "M40.6 90.2 L40.8 90.3 L40.5 90.6",
    "M37.6 87.0 L37.6 87.7",
    "M40.0 89.5 L40.4 90.0",
    "M32.1 49.9 L32.6 50.3",
    "M40.7 72.0 L40.6 71.8 L41.0 71.7",
    "M39.2 59.5 L39.5 60.0",
    "M28.0 60.4 L28.6 60.5",
    "M32.2 49.3 L32.7 49.7",
    "M39.8 38.3 L40.5 38.3",
    "M42.3 37.5 L42.3 38.2",
    "M43.6 34.5 L43.0 34.6",
    "M36.0 11.3 L36.3 11.5 L36.1 11.9",
    "M30.9 11.9 L30.6 12.5",
    "M27.4 7.5 L27.8 6.9",
    "M31.9 5.2 L32.5 5.5",
    "M27.8 48.1 L27.5 48.1 L27.3 48.3",
    "M7.0 38.7 L7.3 39.2",
    "M7.9 41.2 L8.4 40.8",
    "M26.7 8.8 L26.7 9.2 L26.5 9.4",
    "M34.7 91.4 L35.3 91.8",
    "M31.6 80.9 L31.4 80.3",
    "M35.7 75.8 L35.8 75.2",
    "M38.1 80.7 L38.2 81.1 L38.5 81.0",
    "M45.8 86.0 L46.3 85.6",
    "M39.2 56.3 L38.9 56.8",
    "M38.7 56.9 L38.5 57.5",
    "M32.2 57.9 L32.4 58.5",
    "M35.2 63.0 L35.2 62.4",
    "M43.0 67.9 L43.0 68.5",
    "M39.5 68.4 L39.6 68.6 L40.0 68.7",
    "M38.8 58.6 L39.2 59.1",
    "M42.8 56.9 L42.6 57.3 L42.5 57.4",
    "M30.0 58.7 L29.8 58.5 L29.5 58.5 L29.5 58.4",
    "M29.3 57.8 L29.5 58.4",
    "M31.4 45.8 L31.2 45.6 L31.5 45.4",
    "M40.2 6.7 L39.6 6.5",
    "M47.7 14.1 L47.2 14.4",
    "M14.4 40.2 L14.0 39.8",
    "M9.9 40.2 L9.4 39.9",
    "M18.0 43.9 L18.2 43.3",
    "M27.4 44.9 L27.4 44.7 L27.7 44.5 L27.6 44.4",
    "M12.2 25.2 L12.2 24.6",
    "M36.6 82.5 L36.7 83.1",
    "M37.1 75.7 L37.4 75.4 L37.6 75.4",
    "M40.0 81.6 L40.1 82.2",
    "M41.5 89.6 L42.1 89.7",
    "M34.2 95.0 L34.3 95.3 L34.2 95.6",
    "M45.9 87.1 L46.5 87.3",
    "M45.0 85.4 L45.3 85.6 L45.5 85.7",
    "M31.0 55.1 L31.1 55.7",
    "M33.4 54.6 L33.3 54.0",
    "M34.6 61.2 L34.8 60.6",
    "M43.0 64.2 L42.9 64.8",
    "M42.5 66.5 L42.5 65.8",
    "M41.5 70.5 L41.6 71.1",
    "M36.9 67.9 L37.2 68.3 L37.1 68.4",
    "M38.9 61.2 L38.7 61.2 L38.7 61.6",
    "M34.7 60.9 L34.1 60.8",
    "M40.3 56.2 L40.7 56.1 L40.8 55.9",
    "M29.6 51.7 L29.8 52.3",
    "M40.8 66.0 L40.9 65.4",
    "M39.1 49.6 L39.7 49.5",
    "M35.6 49.3 L36.2 49.4",
    "M42.2 48.2 L42.8 48.5",
    "M45.4 14.1 L45.2 13.5",
    "M36.6 11.9 L37.2 12.1",
    "M31.7 10.8 L32.3 11.1",
    "M40.1 7.0 L40.3 6.4",
    "M48.0 11.8 L48.3 12.2",
    "M12.9 39.6 L13.2 39.1",
    "M5.6 39.4 L5.8 40.0",
    "M12.1 30.8 L12.0 30.4 L12.1 30.3",
    "M9.2 26.5 L8.6 26.3",
    "M5.4 30.4 L5.6 30.5 L5.5 30.8",
    "M21.3 46.4 L21.8 46.7",
    "M39.9 74.9 L40.0 75.5",
    "M46.2 90.0 L45.8 90.5",
    "M43.9 87.6 L44.5 87.7",
    "M36.2 77.7 L36.8 77.6",
    "M37.3 89.8 L37.2 90.2",
    "M36.9 90.0 L37.4 90.3",
    "M32.2 89.0 L32.8 88.9",
    "M42.0 89.1 L41.8 89.6",
    "M40.0 92.0 L39.6 91.6",
    "M36.4 58.1 L36.7 58.2 L36.9 58.0",
    "M35.2 57.4 L35.0 57.9",
    "M27.8 56.5 L28.4 56.5",
    "M37.8 65.4 L37.9 65.6 L37.9 66.0",
    "M34.8 64.8 L35.4 64.8",
    "M35.4 61.5 L35.4 61.4 L35.8 61.4",
    "M31.8 39.5 L32.1 39.0",
    "M35.0 42.8 L34.6 42.6 L34.6 42.3",
    "M41.0 36.7 L41.3 36.8 L41.5 37.0",
    "M43.3 35.8 L43.4 35.2",
    "M43.6 34.8 L43.0 34.8",
    "M46.8 28.9 L46.7 28.4",
    "M41.0 7.1 L40.9 6.5",
    "M38.8 6.6 L38.3 6.3",
    "M3.5 40.8 L2.9 40.8",
    "M13.2 45.6 L13.1 46.2",
    "M13.0 36.5 L12.7 37.0",
    "M8.7 43.5 L8.1 43.5",
    "M13.2 31.2 L12.7 30.9",
    "M26.6 12.3 L26.0 12.2",
    "M41.1 88.0 L41.1 88.6",
    "M36.3 79.1 L36.4 79.4 L36.6 79.6",
    "M42.4 82.0 L42.3 81.8 L42.0 81.9",
    "M43.2 83.0 L43.4 83.6",
    "M39.4 85.4 L39.1 85.4 L39.1 85.1",
    "M45.7 87.1 L45.8 86.8 L45.5 86.7",
    "M36.8 91.3 L37.3 91.0",
    "M39.9 67.7 L40.5 67.7",
    "M37.9 72.5 L38.1 72.6 L38.4 72.6",
    "M41.7 55.3 L41.7 55.5 L42.1 55.6",
    "M38.8 55.7 L39.0 55.8 L39.2 55.5",
    "M38.4 55.0 L37.9 54.8",
    "M34.9 58.4 L35.5 58.5",
    "M40.8 40.6 L41.1 41.1",
    "M35.5 39.6 L35.8 39.1",
    "M43.9 37.5 L43.8 38.1",
    "M41.3 48.9 L41.7 48.5",
    "M44.5 45.2 L44.2 45.7",
    "M41.1 33.3 L41.3 32.7",
    "M36.5 10.4 L36.2 10.9",
    "M44.3 10.2 L44.4 10.3",
    "M39.3 12.1 L39.2 12.4 L38.9 12.5",
    "M25.6 64.8 L25.7 65.0 L26.0 65.0",
    "M2.9 40.4 L3.4 40.4",
    "M13.6 42.8 L13.9 42.3",
    "M13.2 37.9 L13.7 38.1",
    "M12.9 38.9 L13.4 39.2",
    "M10.4 35.9 L10.2 35.9 L10.0 36.3",
    "M14.7 32.8 L14.8 32.6 L15.1 32.4",
    "M27.2 12.4 L27.6 12.5 L27.7 12.3",
    "M40.9 77.8 L40.9 78.3",
    "M38.2 87.8 L38.7 87.8",
    "M36.7 89.6 L37.2 89.8",
    "M35.4 80.0 L35.5 80.5",
    "M34.5 57.8 L35.0 57.9",
    "M39.3 58.1 L39.7 58.5",
    "M28.5 55.1 L28.7 54.6",
    "M32.6 46.2 L32.1 45.8",
    "M35.2 35.3 L35.7 35.4",
    "M43.7 30.7 L43.7 30.9 L44.0 31.2",
    "M43.6 35.2 L44.2 35.2",
    "M43.0 34.8 L42.8 34.3",
    "M40.2 16.6 L40.7 16.9",
    "M31.9 10.5 L32.4 10.8",
    "M45.6 13.4 L45.8 13.3 L45.8 13.6",
    "M26.5 51.1 L26.5 51.6",
    "M25.4 57.3 L25.3 57.6 L25.4 57.8",
    "M19.5 45.3 L19.9 44.9",
    "M21.1 44.6 L20.9 44.8 L20.9 45.1",
    "M37.1 80.7 L37.3 81.2",
    "M34.7 87.0 L34.2 86.8",
    "M37.9 74.1 L37.4 74.0",
    "M39.6 86.8 L39.4 86.3",
    "M40.4 86.6 L40.0 86.1",
    "M40.5 92.5 L39.9 92.4",
    "M32.6 62.5 L32.7 63.0",
    "M39.0 60.6 L39.0 60.1",
    "M42.2 59.0 L42.3 59.3 L42.5 59.3",
    "M39.3 71.6 L39.4 72.1",
    "M38.2 63.6 L37.7 63.6",
    "M30.3 47.8 L30.4 48.3",
    "M30.8 40.2 L31.3 40.1",
    "M37.1 39.3 L37.4 39.1 L37.3 38.9",
    "M43.9 37.5 L44.0 37.0",
    "M37.2 10.1 L37.6 10.1 L37.8 10.1",
    "M49.0 11.6 L48.5 11.7",
    "M31.5 10.2 L31.9 9.9",
    "M36.2 10.9 L36.0 11.1 L36.0 11.3",
    "M34.2 8.2 L34.7 8.4",
    "M41.5 17.8 L41.8 18.2",
    "M27.0 61.1 L27.2 61.1 L27.4 61.3",
    "M27.4 42.4 L27.2 41.9",
    "M23.4 49.2 L23.9 49.3",
    "M17.4 39.4 L16.9 39.5",
    "M18.2 43.8 L18.7 44.0",
    "M10.5 27.3 L10.1 26.9",
    "M23.3 49.6 L22.8 49.5",
    "M13.6 30.5 L13.2 30.1",
    "M12.9 31.6 L12.7 31.4 L12.7 31.1",
    "M37.8 81.0 L37.9 81.5",
    "M43.4 97.6 L43.8 97.6 L43.9 97.7",
    "M36.8 78.2 L36.3 78.2",
    "M32.3 81.3 L32.4 80.7",
    "M40.0 82.4 L39.5 82.5",
    "M35.7 94.5 L35.7 94.0",
    "M43.5 84.9 L43.2 85.0 L43.3 85.2",
    "M42.0 52.5 L42.0 53.0",
    "M38.6 54.5 L38.5 55.0",
    "M28.2 51.3 L28.7 51.1",
    "M40.2 58.1 L39.8 57.7",
    "M38.5 55.0 L38.4 55.0 L38.2 55.4",
    "M30.0 56.8 L30.2 57.4",
    "M30.7 44.6 L31.3 44.8",
    "M31.4 40.6 L31.3 40.1",
    "M44.4 45.3 L44.8 45.5 L44.8 45.6",
    "M44.3 15.3 L44.2 15.2 L44.1 15.3 L44.0 15.1",
    "M45.4 13.6 L45.7 14.1",
    "M76.2 52.0 L76.5 52.4",
    "M18.7 52.8 L18.5 53.2",
    "M25.4 54.4 L25.1 54.9",
    "M15.8 44.3 L16.1 44.0",
    "M11.5 29.0 L11.4 28.8 L11.7 28.5",
    "M14.3 34.6 L14.8 34.5",
    "M22.7 49.0 L22.4 49.4",
    "M21.7 44.9 L22.1 45.0 L22.1 44.8",
    "M24.6 14.2 L24.4 14.7",
    "M33.8 85.6 L33.6 86.1",
    "M37.0 79.0 L37.5 79.0",
    "M40.9 80.7 L40.8 81.3",
    "M44.3 82.0 L44.7 81.8",
    "M33.6 93.7 L33.3 94.1",
    "M30.9 57.6 L31.0 58.2",
    "M32.4 53.4 L32.6 53.4 L32.7 53.7",
    "M36.8 49.5 L36.9 50.1",
    "M41.1 42.0 L41.1 42.6",
    "M33.1 49.4 L32.7 49.7",
    "M40.9 36.8 L41.2 37.2",
    "M46.2 33.1 L46.7 33.3",
    "M39.5 15.5 L39.3 16.0",
    "M37.8 7.0 L38.2 6.6",
    "M76.4 51.8 L75.9 51.6",
    "M62.1 14.9 L61.8 14.5",
    "M20.1 46.9 L19.8 47.3",
    "M18.1 43.5 L18.4 43.4 L18.6 43.5",
    "M8.4 43.1 L7.9 43.1",
    "M23.5 12.3 L23.8 11.8",
    "M13.0 25.3 L13.0 24.8",
    "M41.1 94.4 L41.3 94.8",
    "M36.9 87.6 L37.4 87.7",
    "M35.0 79.2 L34.9 79.5 L35.0 79.7",
    "M37.9 57.8 L38.4 57.9",
    "M39.1 71.6 L39.3 72.1",
    "M35.6 58.2 L35.8 57.7",
    "M28.8 58.5 L28.3 58.5",
    "M47.6 24.0 L47.1 23.9",
    "M27.6 13.9 L28.1 14.1",
    "M46.9 14.6 L46.5 14.8",
    "M19.8 52.8 L19.4 53.1",
    "M12.4 37.0 L12.5 36.5",
    "M17.3 38.0 L17.0 38.4",
    "M27.3 42.3 L27.1 42.5 L26.9 42.4",
    "M8.0 27.4 L7.7 27.8",
    "M4.0 40.5 L3.9 40.1",
    "M20.5 13.3 L20.7 13.3 L20.7 13.5 L20.8 13.6",
    "M25.6 14.5 L25.7 14.0",
    "M36.5 89.6 L36.8 90.0",
    "M31.7 83.9 L32.2 83.9",
    "M32.1 82.1 L32.2 81.6",
    "M37.5 83.5 L37.6 84.0",
    "M37.0 83.6 L37.1 84.1",
    "M43.1 54.9 L43.2 55.3",
    "M35.2 56.5 L35.7 56.6",
    "M33.2 52.9 L33.3 52.7 L33.6 52.8",
    "M30.0 57.9 L30.5 57.8",
    "M39.3 61.5 L39.3 61.1",
    "M39.4 71.6 L39.3 71.1",
    "M28.9 42.3 L28.6 41.9",
    "M35.7 38.7 L36.2 38.8",
    "M34.4 38.5 L34.9 38.8",
    "M47.4 36.1 L47.3 36.6",
    "M32.7 9.2 L33.1 9.5",
    "M27.6 7.3 L28.0 7.5",
    "M35.5 9.0 L35.9 9.3",
    "M37.1 10.1 L37.5 10.3",
    "M29.5 7.7 L29.6 7.8 L29.4 8.1",
    "M62.1 14.9 L62.3 15.4",
    "M6.0 38.8 L6.1 39.3",
    "M3.6 39.6 L3.7 40.1",
    "M3.4 37.9 L3.4 38.3",
    "M17.0 37.8 L17.4 38.0",
    "M18.4 43.6 L17.9 43.6",
    "M17.5 39.8 L18.0 39.7",
    "M11.7 45.2 L11.6 45.7",
    "M22.6 45.6 L22.3 45.3",
    "M22.6 12.3 L22.8 11.9",
    "M21.7 13.4 L22.2 13.6",
    "M40.8 75.6 L40.8 76.0",
    "M36.4 83.7 L36.4 84.1",
    "M35.7 84.0 L35.6 84.4",
    "M30.1 83.2 L29.7 83.3",
    "M30.1 83.9 L30.2 83.9",
    "M31.2 81.1 L31.7 80.9",
    "M31.9 80.9 L32.4 80.8",
    "M36.3 81.4 L35.9 81.6",
    "M37.0 76.4 L36.9 76.0",
    "M41.4 83.9 L41.9 83.9",
    "M40.9 83.9 L40.5 83.9",
    "M31.4 58.1 L31.8 58.0",
    "M30.3 53.1 L30.3 53.5",
    "M33.7 59.8 L33.9 59.3",
    "M36.5 66.0 L36.9 65.9",
    "M32.0 50.4 L32.3 50.0",
    "M28.0 50.0 L28.0 50.1 L28.3 50.1",
    "M36.2 61.2 L36.6 61.3",
    "M43.6 45.5 L43.8 45.0",
    "M43.7 44.2 L44.2 44.3",
    "M49.0 11.6 L49.2 12.1",
    "M47.0 14.7 L46.6 15.0",
    "M34.8 14.0 L34.6 13.9 L34.4 14.0",
    "M34.9 13.1 L35.1 12.7",
    "M76.7 51.7 L77.0 52.1",
    "M26.5 51.6 L26.5 52.1",
    "M23.7 63.3 L23.7 63.8",
    "M25.6 61.8 L25.1 61.8",
    "M9.4 41.2 L9.7 41.5",
    "M2.0 41.7 L2.5 41.7",
    "M15.4 34.8 L15.0 34.7",
    "M16.8 42.4 L17.2 42.6",
    "M13.9 30.2 L13.6 29.9",
    "M20.6 48.1 L20.4 48.3 L20.3 48.2",
    "M24.8 10.8 L24.5 11.1",
    "M37.7 80.5 L37.9 80.8",
    "M42.0 86.4 L42.1 86.8",
    "M36.5 87.6 L36.5 87.7 L36.7 87.8",
    "M32.8 92.9 L32.5 93.2",
    "M31.6 84.2 L31.5 84.1",
    "M32.3 80.4 L32.2 80.0",
    "M34.6 81.4 L34.7 81.8",
    "M33.5 51.5 L34.0 51.3",
    "M41.2 57.3 L41.7 57.4",
    "M38.0 68.2 L37.8 68.7",
    "M32.3 63.9 L32.4 64.3",
    "M32.5 61.9 L33.0 61.9",
    "M30.8 48.8 L31.2 48.5",
    "M29.7 44.9 L29.9 44.5",
    "M46.0 40.8 L46.1 41.0 L45.8 41.0",
    "M36.9 36.9 L37.3 36.7",
    "M46.7 33.0 L46.7 33.4",
    "M43.5 9.8 L43.5 9.8",
    "M29.6 8.4 L30.0 8.5",
    "M31.7 9.1 L32.1 9.3",
    "M48.1 14.6 L48.2 14.6",
    "M29.0 6.4 L29.2 6.0",
    "M28.6 12.2 L28.9 11.8",
    "M75.9 64.6 L76.4 64.6",
    "M24.1 63.8 L24.1 64.2",
    "M27.2 64.5 L27.3 64.9",
    "M5.2 38.2 L5.3 38.6",
    "M16.2 49.2 L15.9 49.6",
    "M15.3 48.3 L15.0 48.5",
    "M14.5 30.8 L14.4 31.0 L14.5 31.2",
    "M27.1 42.5 L27.2 42.9",
    "M17.5 43.6 L17.8 43.2",
    "M42.7 80.5 L42.6 80.9",
    "M42.1 79.5 L42.1 79.9",
    "M42.4 91.7 L42.3 92.1",
    "M36.0 90.9 L36.2 91.2",
    "M33.6 82.2 L33.6 81.7",
    "M32.1 80.9 L32.1 80.4",
    "M38.7 77.0 L38.3 77.0",
    "M45.3 87.1 L45.2 87.3 L45.0 87.4",
    "M35.9 51.5 L36.4 51.5",
    "M34.9 58.4 L35.0 57.9",
    "M35.2 63.0 L35.6 62.9",
    "M38.9 61.5 L39.3 61.5",
    "M37.3 69.0 L37.3 69.2 L37.5 69.3",
    "M37.8 71.9 L37.4 72.0",
    "M37.7 71.5 L37.7 71.1",
    "M30.4 60.7 L30.3 60.3",
    "M40.4 40.4 L40.6 40.7",
    "M37.3 43.1 L37.4 43.5",
    "M37.4 49.3 L37.8 49.3",
    "M39.6 41.3 L39.6 40.9",
    "M47.3 35.6 L47.3 36.1",
    "M28.1 12.5 L27.9 12.8",
    "M35.2 13.3 L35.0 13.7",
    "M29.2 9.3 L29.6 9.4",
    "M36.7 12.6 L36.3 12.3",
    "M31.6 9.7 L31.3 9.5",
    "M31.8 5.4 L31.4 5.1",
    "M24.6 63.3 L24.7 63.7",
    "M22.6 61.9 L22.6 61.5",
    "M23.7 62.4 L23.8 62.9",
    "M5.1 38.7 L5.3 39.1",
    "M4.8 40.2 L4.9 40.6",
    "M15.7 35.4 L15.9 35.0",
    "M15.2 34.8 L15.0 35.1",
    "M8.8 43.6 L9.1 43.4",
    "M25.4 10.0 L25.5 10.4",
    "M41.1 78.8 L41.1 79.2",
    "M44.7 86.9 L44.6 87.3",
    "M39.8 97.6 L39.7 97.6 L39.4 97.5",
    "M37.2 81.4 L36.8 81.2",
    "M40.4 60.4 L40.5 60.8",
    "M39.3 61.1 L39.3 60.8 L39.4 60.7",
    "M36.8 51.1 L36.4 51.1",
    "M36.0 50.7 L35.9 51.1",
    "M35.5 58.5 L35.6 58.2",
    "M44.5 45.2 L44.8 45.0",
    "M31.7 9.7 L32.0 9.9",
    "M47.8 16.8 L48.2 16.5",
    "M31.9 6.1 L32.1 5.7",
    "M28.9 8.7 L28.5 8.6",
    "M24.1 64.2 L24.1 64.6",
    "M25.4 58.7 L25.5 58.4",
    "M16.3 48.4 L16.0 48.1",
    "M8.9 38.7 L9.0 38.3",
    "M2.5 41.7 L2.9 41.8",
    "M14.0 29.0 L14.2 29.3",
    "M15.9 39.3 L16.2 39.5",
    "M8.0 28.9 L7.8 29.2",
    "M13.5 42.0 L13.7 41.7",
    "M8.9 44.9 L8.5 45.0",
    "M13.6 45.6 L13.5 46.0",
    "M17.0 49.2 L16.7 48.9",
    "M12.8 25.3 L12.8 25.7",
    "M43.1 79.5 L43.1 79.9",
    "M43.3 88.2 L43.3 88.6",
    "M44.6 89.6 L44.6 89.2",
    "M38.9 88.7 L38.8 88.7",
    "M35.1 81.9 L34.7 81.8",
    "M35.6 79.0 L35.5 78.6",
    "M34.6 78.0 L35.0 77.9",
    "M41.4 83.5 L41.7 83.5 L41.7 83.6",
    "M36.2 54.1 L36.6 54.2",
    "M35.4 56.0 L35.8 56.1",
    "M32.0 59.0 L32.4 58.9",
    "M42.0 72.6 L42.2 73.0",
    "M29.4 62.4 L29.8 62.4",
    "M38.8 73.3 L38.8 72.9",
    "M37.7 36.0 L37.9 36.4",
    "M36.3 34.9 L36.5 34.6",
    "M44.0 31.2 L44.2 30.8",
    "M44.9 30.5 L44.8 31.0",
    "M44.3 15.3 L44.6 15.1",
    "M33.6 12.0 L33.4 12.4",
    "M41.9 17.0 L42.3 17.2",
    "M34.5 12.5 L34.3 12.9",
    "M9.2 43.5 L9.5 43.3",
    "M10.6 41.2 L10.9 41.5",
    "M9.3 41.4 L9.0 41.1",
    "M8.4 45.2 L8.1 45.2",
    "M22.2 10.5 L22.5 10.7",
    "M21.3 11.6 L21.6 11.9",
    "M13.2 25.3 L13.2 24.9",
    "M38.9 91.1 L38.9 91.5",
    "M34.2 86.3 L33.9 86.1",
    "M33.7 95.3 L33.4 95.5",
    "M31.4 94.7 L31.1 94.8 L31.1 94.9",
    "M32.2 56.6 L32.6 56.5",
    "M37.7 58.8 L37.6 59.2",
    "M37.7 48.0 L37.7 47.6",
    "M46.3 34.0 L46.7 34.1",
    "M45.9 27.8 L45.7 28.2",
    "M44.3 33.4 L43.9 33.4",
    "M34.6 13.0 L34.4 13.3",
    "M36.6 5.9 L36.9 6.1",
    "M30.2 8.1 L30.0 8.1 L29.9 8.2",
    "M43.1 91.4 L43.1 91.5 L43.2 91.6",
    "M32.0 84.6 L32.0 84.7",
    "M34.2 79.4 L33.8 79.2",
    "M35.7 77.4 L35.6 77.0",
    "M46.8 85.2 L47.0 85.5",
    "M38.8 65.0 L38.8 65.4",
    "M35.1 54.7 L35.4 54.7",
    "M38.0 73.6 L37.6 73.7",
    "M35.7 65.2 L35.8 65.6",
    "M31.0 52.7 L31.0 52.4",
    "M32.1 59.4 L32.5 59.4",
    "M39.4 47.1 L39.4 47.5",
    "M45.0 45.0 L45.0 45.4",
    "M43.5 46.8 L43.8 46.5",
    "M47.0 35.7 L47.0 36.1",
    "M29.7 5.7 L30.0 5.9",
    "M28.1 8.1 L28.3 7.8",
    "M47.5 23.3 L47.2 23.2",
    "M38.9 11.9 L38.9 11.9",
    "M22.6 61.5 L22.6 61.1",
    "M10.6 42.4 L10.2 42.5",
    "M26.4 9.7 L26.7 9.8",
    "M21.5 13.9 L21.9 14.0",
    "M38.5 90.8 L38.9 91.0",
    "M35.6 82.0 L35.7 82.4",
    "M30.5 79.9 L30.3 79.6",
    "M37.1 78.5 L36.7 78.5",
    "M41.3 83.2 L41.3 82.9",
    "M38.0 54.5 L38.0 54.2",
    "M33.6 57.4 L33.2 57.3",
    "M42.0 56.0 L42.4 56.1",
    "M41.8 61.1 L42.1 61.0",
    "M40.4 60.1 L40.4 60.4",
    "M43.3 57.6 L43.0 57.6",
    "M36.8 64.3 L36.7 64.6",
    "M32.2 49.3 L32.1 49.1 L32.0 49.2",
    "M41.9 48.9 L41.8 49.3",
    "M46.4 35.1 L46.3 35.5",
    "M40.6 8.4 L40.9 8.2",
    "M32.2 4.7 L32.0 5.0",
    "M41.7 17.4 L42.0 17.6",
    "M6.6 40.4 L6.4 40.1",
    "M15.2 40.5 L15.4 40.2",
    "M7.5 30.7 L7.9 30.8",
    "M13.0 38.6 L12.8 38.8",
    "M20.9 11.9 L21.1 11.9 L21.1 11.7",
    "M13.4 25.3 L13.4 24.9",
    "M40.8 95.8 L40.8 95.4",
    "M31.8 58.0 L31.9 58.4",
    "M31.4 63.4 L31.4 63.1",
    "M37.1 51.3 L36.8 51.1",
    "M40.4 56.5 L40.1 56.5",
    "M40.0 41.3 L40.2 41.0",
    "M39.5 39.7 L39.7 39.6 L39.8 39.8",
    "M38.6 8.4 L38.3 8.4",
    "M35.5 10.8 L35.2 10.6",
    "M47.8 20.0 L47.4 20.0",
    "M76.5 62.8 L76.3 63.1",
    "M8.6 31.2 L8.8 31.3 L8.9 31.2",
    "M13.7 40.7 L13.5 40.9",
    "M22.1 45.0 L22.0 45.3",
    "M24.6 8.5 L24.6 8.8",
    "M44.4 76.9 L44.4 76.6",
    "M36.8 86.7 L36.9 86.4",
    "M37.8 74.6 L37.5 74.5",
    "M40.7 88.2 L40.8 88.5",
    "M43.0 86.7 L43.0 86.4",
    "M42.9 65.5 L42.9 65.8",
    "M41.0 34.9 L41.3 34.9",
    "M34.1 12.8 L34.1 12.5",
    "M39.8 11.1 L39.7 10.8",
    "M29.0 12.4 L29.0 12.7",
    "M59.9 5.9 L59.9 5.9 L60.0 5.7",
    "M75.2 17.0 L75.5 17.0",
    "M13.2 51.6 L13.0 51.6",
    "M2.9 41.8 L3.0 41.5",
    "M15.9 32.3 L16.2 32.2",
    "M7.8 30.4 L7.8 30.7",
    "M23.4 10.0 L23.3 9.7",
    "M25.6 14.6 L25.3 14.6",
    "M42.6 79.5 L42.6 79.9",
    "M44.5 88.8 L44.5 88.5",
    "M40.6 89.8 L40.9 89.9",
    "M40.4 94.5 L40.4 94.7",
    "M37.0 75.8 L37.0 75.5",
    "M40.4 84.9 L40.7 84.9",
    "M43.3 88.9 L43.3 88.6",
    "M27.7 51.4 L27.6 51.7",
    "M28.5 52.0 L28.3 51.7",
    "M35.0 59.6 L34.9 59.9",
    "M28.6 61.9 L28.7 61.6",
    "M42.1 72.0 L42.2 72.3",
    "M36.1 46.4 L36.4 46.3",
    "M45.0 46.8 L45.1 46.5",
    "M45.3 43.6 L45.4 43.9",
    "M43.6 49.5 L43.9 49.7",
    "M34.5 9.8 L34.7 9.5",
    "M37.1 12.3 L37.1 12.5 L37.0 12.4",
    "M31.8 4.8 L32.0 5.0",
    "M40.1 9.6 L40.0 9.9",
    "M32.7 4.4 L32.6 4.5",
    "M31.8 8.5 L31.6 8.8",
    "M43.4 14.9 L43.6 15.0",
    "M25.5 64.5 L25.6 64.8",
    "M26.6 45.8 L26.8 45.6",
    "M17.9 47.0 L17.6 46.8",
    "M20.9 11.9 L20.6 11.9",
    "M42.1 77.1 L42.0 77.4",
    "M35.3 91.7 L35.6 91.9",
    "M32.2 89.1 L32.3 89.4",
    "M30.4 79.9 L30.1 79.9",
    "M36.0 80.7 L36.0 80.4",
    "M40.8 81.0 L40.5 81.0",
    "M44.4 85.0 L44.5 84.7",
    "M40.8 83.3 L40.8 83.0",
    "M34.0 51.3 L34.2 51.2",
    "M33.6 61.3 L33.6 61.5",
    "M40.6 63.7 L40.7 64.0",
    "M40.7 72.0 L40.8 72.3",
    "M41.3 70.9 L41.3 71.1",
    "M40.3 72.1 L40.4 72.4",
    "M38.5 62.6 L38.8 62.7",
    "M35.8 52.8 L36.1 52.9",
    "M28.0 47.9 L28.1 48.1",
    "M44.8 46.4 L44.7 46.6",
    "M44.3 46.5 L44.2 46.7",
    "M39.6 11.8 L39.8 11.8",
    "M35.8 12.9 L35.6 12.7",
    "M48.0 21.5 L47.7 21.5",
    "M12.9 38.9 L13.0 38.7",
    "M38.3 78.5 L38.6 78.5",
    "M36.7 85.0 L36.7 85.3",
    "M33.2 79.8 L33.5 79.7",
    "M31.7 81.3 L31.7 81.6",
    "M39.3 81.1 L39.6 81.2",
    "M38.3 76.0 L38.4 76.3",
    "M41.8 83.2 L41.8 82.9",
    "M33.1 50.1 L32.9 49.9",
    "M39.9 41.4 L40.0 41.6",
    "M32.7 48.9 L32.9 48.6",
    "M45.9 42.4 L45.7 42.6",
    "M38.5 36.0 L38.4 35.7",
    "M44.0 29.7 L44.0 30.0",
    "M47.5 24.7 L47.2 24.6",
    "M28.6 12.6 L28.8 12.4",
    "M41.3 8.2 L41.5 8.4",
    "M18.1 43.4 L17.9 43.5",
    "M14.0 41.4 L13.8 41.3",
    "M23.7 9.2 L24.0 9.1",
    "M43.1 97.6 L43.4 97.6",
    "M36.3 80.7 L36.4 81.0",
    "M35.8 74.4 L35.8 74.6",
    "M44.2 83.7 L44.3 84.0",
    "M44.0 73.7 L44.3 73.6",
    "M29.0 62.4 L28.9 62.6",
    "M31.6 52.7 L31.6 52.4",
    "M35.5 59.2 L35.6 59.5",
    "M34.9 47.1 L34.8 46.9",
    "M44.0 29.7 L44.3 29.7",
    "M41.5 17.3 L41.7 17.4",
    "M47.4 11.1 L47.2 11.0",
    "M30.1 12.5 L30.2 12.7",
    "M2.4 41.5 L2.4 41.7",
    "M39.5 84.6 L39.7 84.6",
    "M43.1 97.7 L43.4 97.6",
    "M31.7 80.6 L31.8 80.8",
    "M37.3 79.0 L37.3 79.3",
    "M37.3 69.8 L37.5 69.9",
    "M40.0 41.6 L40.0 41.4",
    "M40.2 41.0 L40.0 41.1",
    "M40.3 40.3 L40.3 40.0",
    "M37.0 36.2 L37.3 36.2",
    "M33.9 12.7 L33.8 13.0",
    "M47.7 19.5 L47.5 19.5",
    "M9.6 33.1 L9.8 33.0",
    "M25.4 7.9 L25.5 8.0 L25.5 8.1",
    "M24.1 8.8 L24.1 9.0",
    "M35.1 77.6 L34.9 77.6",
    "M42.0 89.1 L41.8 89.0",
    "M45.4 86.1 L45.4 85.8",
    "M44.6 29.5 L44.6 29.8",
    "M36.6 11.1 L36.5 11.3",
    "M8.9 40.0 L8.8 39.8",
    "M14.0 39.8 L13.8 39.6",
    "M23.5 10.1 L23.5 10.3",
    "M34.5 86.9 L34.3 86.9",
    "M34.7 81.6 L34.5 81.6",
    "M37.6 84.0 L37.5 84.2",
    "M35.5 54.2 L35.8 54.3",
    "M29.2 61.2 L29.1 61.0",
    "M28.0 8.0 L28.1 8.1",
    "M46.1 13.2 L45.6 13.2",
    "M48.2 12.0 L48.3 12.2",
    "M39.8 9.1 L39.6 9.1",
    "M32.7 4.2 L32.7 4.2",
    "M86.5 17.7 L86.3 17.8",
    "M17.9 41.8 L17.7 41.8",
    "M2.0 42.0 L2.1 42.0",
    "M10.7 42.1 L10.5 42.1",
    "M21.1 10.8 L21.2 10.9",
    "M25.8 10.6 L25.7 10.7",
    "M39.3 60.8 L39.4 61.0",
    "M34.9 59.9 L34.9 60.1",
    "M41.6 56.9 L41.6 56.7",
    "M42.1 43.7 L42.1 43.9",
    "M30.4 5.4 L30.3 5.6",
    "M29.0 12.0 L29.1 11.8",
    "M30.8 10.2 L30.9 10.0",
    "M75.7 51.5 L75.9 51.6",
    "M27.0 50.4 L27.0 50.5",
    "M25.0 10.4 L24.9 10.5",
    "M41.0 89.3 L40.9 89.2",
    "M31.7 81.6 L31.7 81.7",
    "M39.5 68.2 L39.4 68.3",
    "M34.6 52.4 L34.7 52.4",
    "M42.3 52.5 L42.3 52.7",
    "M40.0 41.4 L40.2 41.3",
    "M40.2 41.3 L40.0 41.3",
    "M38.4 39.9 L38.2 39.8",
    "M24.1 9.0 L24.0 9.1",
    "M41.3 84.0 L41.3 84.2",
    "M40.0 84.3 L40.0 84.5",
    "M30.1 51.2 L30.0 51.3",
    "M35.6 40.6 L35.4 40.7",
    "M35.4 40.7 L35.6 40.7",
    "M35.9 11.3 L36.0 11.3",
    "M76.0 63.9 L75.8 64.0",
    "M18.2 43.7 L18.2 43.8",
    "M41.0 89.2 L40.9 89.2",
    "M33.1 80.2 L33.0 80.1",
    "M30.2 58.3 L30.3 58.4",
    "M34.8 60.0 L34.9 59.9",
    "M35.2 39.0 L35.1 39.0",
    "M30.7 44.6 L30.6 44.6",
    "M41.2 85.2 L41.3 85.1",
    "M39.3 61.1 L39.4 61.0",
    "M59.2 5.4 L59.3 5.5",
    "M15.9 44.1 L15.8 44.1"
];
const GEO_MAP_WATER = [
    "M69.2 5.2 L69.1 6.2 L67.5 12.0 L66.4 15.6 L65.1 18.4 L62.8 25.4 L61.6 27.0 L56.6 32.2 L54.3 35.1 L52.5 37.9 L50.8 41.6 L46.9 50.6 L46.0 53.1 L45.5 58.1 L45.5 60.3 L48.3 73.2 L49.5 77.8 L50.0 81.9 L50.2 91.8 L50.6 96.9 L51.2 98.7",
    "M89.9 22.1 L79.8 26.2 L77.8 27.2 L75.8 28.7 L72.7 31.9 L63.9 44.9 L62.6 46.4 L59.7 49.9 L59.4 51.2 L59.4 53.4 L58.4 56.4 L56.4 61.3 L51.8 69.9 L51.8 75.0 L49.5 77.8",
    "M66.8 73.0 L67.2 71.8 L68.3 70.4 L68.8 69.3 L69.0 68.3 L69.0 66.4 L68.8 66.0 L68.7 65.3 L68.9 64.4 L69.0 62.9 L68.8 62.0 L68.2 61.1 L68.0 60.4 L68.1 58.7 L68.2 58.2 L68.8 57.6 L69.1 56.8 L70.0 56.2 L71.3 54.7 L72.0 54.2 L72.8 53.7 L74.6 51.7 L75.3 49.3 L75.4 49.0 L75.0 47.9 L75.2 46.9 L75.4 46.5 L76.1 46.1 L77.1 46.0 L77.6 45.7 L78.2 44.9 L78.2 44.8 L77.6 43.8 L77.5 41.7 L78.4 41.5 L78.6 41.2 L78.6 40.7 L78.8 40.3 L80.4 39.1 L81.2 38.0 L81.6 37.8 L81.7 37.1 L81.5 36.5 L80.5 36.1",
    "M33.6 4.1 L33.4 5.3 L33.6 5.9 L33.3 6.3 L33.4 6.4 L33.6 6.5 L34.1 6.5 L34.7 6.8 L35.4 7.0 L35.9 7.5 L35.8 7.6 L35.6 7.8 L35.7 8.0 L36.9 9.1 L37.5 9.3 L38.3 9.2 L38.4 9.3 L38.6 9.8 L38.4 10.3 L38.5 10.8 L39.2 11.0 L40.0 10.8 L40.8 10.9 L41.1 10.7 L41.9 10.6 L42.6 10.3 L43.5 10.8 L43.8 10.9 L44.6 11.7 L44.9 11.9 L45.0 12.3 L44.6 12.4 L44.7 12.5 L44.9 12.4 L45.5 12.5 L45.8 12.4 L46.4 12.5 L46.7 12.4 L47.4 12.4 L47.7 13.1 L48.2 13.3 L49.0 14.1 L49.5 14.3 L49.7 14.3 L49.6 13.9 L49.6 13.7 L50.2 13.6 L50.5 14.1 L50.8 13.8 L51.6 13.9 L52.7 13.7 L52.8 13.2 L53.0 13.0 L53.2 12.7 L53.2 12.6 L53.0 12.5 L52.9 12.3 L53.0 12.2 L52.9 11.5 L53.0 11.3 L53.0 11.0 L53.6 10.4 L53.7 10.0 L54.4 9.7 L54.6 9.2 L55.1 8.7 L55.5 8.6 L54.9 9.6 L54.5 10.7",
    "M27.5 83.3 L27.8 83.4 L28.5 84.4 L28.9 84.6 L29.4 84.8 L29.8 84.7 L31.1 84.9 L32.2 86.6 L33.4 87.6 L33.9 87.6 L36.1 88.5 L37.6 89.0 L38.4 89.5 L39.1 89.7 L39.8 90.6 L40.8 91.5 L41.1 91.3 L41.4 90.7 L41.7 90.5 L41.9 90.6 L43.5 90.5 L44.0 91.0 L44.1 91.6 L45.5 91.6 L46.3 92.1 L46.8 92.0 L47.1 91.7 L48.9 91.2 L50.3 91.1",
    "M3.5 64.5 L3.6 64.2 L4.0 64.2 L4.1 63.9 L4.6 63.6 L4.8 63.2 L5.2 62.9 L5.0 62.5 L5.3 61.9 L5.6 61.6 L5.5 60.8 L6.0 60.0 L6.1 59.3 L6.8 58.4 L6.5 57.6 L7.0 57.4 L6.9 57.2 L7.1 57.0 L7.1 56.7 L7.5 56.3 L7.7 56.2 L8.2 56.3 L9.0 56.1 L9.2 55.2 L9.7 55.1 L10.0 54.9 L10.1 54.0 L10.6 53.6 L10.7 53.2 L10.5 52.8 L10.6 51.6 L11.3 51.6 L11.5 51.5 L11.5 51.1 L11.6 51.0 L12.4 51.0 L13.3 50.3 L13.9 50.2 L14.3 49.9 L14.5 50.1 L14.8 50.1",
    "M60.3 81.5 L59.1 81.3 L58.5 81.5 L56.8 82.8 L56.4 83.7 L56.4 84.4 L56.9 87.6 L56.8 88.4 L56.5 89.6 L56.0 90.5 L53.7 93.6 L50.6 96.9",
    "M47.8 48.6 L49.8 50.4 L50.9 50.6 L51.9 49.7 L52.4 49.4 L52.8 49.3 L53.5 49.4 L54.0 49.7 L54.3 50.3 L54.4 50.9 L54.0 52.4 L53.9 53.7 L54.4 55.4 L54.2 57.1 L54.8 58.9 L55.6 60.4 L56.4 61.3",
    "M12.2 80.8 L12.4 80.8 L12.7 81.2 L15.2 81.0 L15.9 81.2 L16.4 81.5 L16.7 82.0 L17.1 82.1 L17.4 81.7 L18.4 81.7 L18.7 82.6 L18.9 82.7 L19.7 82.3 L20.1 82.2 L20.4 82.4 L20.8 82.1 L21.1 82.1 L21.6 82.7 L22.9 82.5 L23.9 82.5 L24.5 82.8 L25.1 82.8 L25.9 82.5 L26.8 82.8 L27.5 83.3",
    "M97.3 38.5 L96.7 38.4 L96.1 38.9 L95.6 38.7 L94.6 39.2 L93.3 39.5 L92.0 39.4 L90.6 39.8 L90.3 39.7 L89.9 39.8 L89.7 40.2 L89.4 40.3 L88.4 40.2 L87.3 40.7 L85.8 40.9 L84.3 41.6",
    "M72.3 21.3 L71.3 21.5 L70.7 21.8 L69.0 24.2 L68.6 25.2 L67.3 26.3 L64.2 27.8 L63.5 27.8 L61.6 27.0",
    "M66.8 73.0 L65.4 76.7 L63.7 79.3 L62.9 80.7 L62.5 81.1 L61.4 81.9 L61.0 81.9 L60.3 81.5",
    "M74.7 76.7 L75.3 76.9 L76.0 76.5 L77.6 76.3 L80.6 77.3 L81.5 78.6 L82.0 78.8 L82.2 79.1 L82.7 80.0 L82.9 80.3 L83.0 81.2 L83.5 81.6",
    "M45.3 1.5 L45.4 1.6 L45.0 3.0 L45.0 3.8 L45.4 4.3 L46.5 5.2 L48.6 6.2 L50.6 6.4 L52.5 7.2 L52.6 7.5 L53.0 7.6",
    "M59.0 2.1 L59.1 2.8 L59.0 3.7 L59.5 4.9 L58.8 6.0 L56.9 7.9 L56.2 8.3 L54.8 10.3",
    "M55.4 25.5 L55.1 25.6 L54.7 25.5 L54.4 25.5 L54.0 26.0 L53.7 28.5 L52.7 29.4 L51.5 30.7 L51.1 31.0 L51.2 31.1 L50.9 31.9 L50.9 32.6"
];
const GEO_MAP_RIVERS = [
    {
        id: "niger",
        name: "Le Niger",
        d: "M69.2 5.2 L69.1 6.2 L67.5 12.0 L66.4 15.6 L65.1 18.4 L62.8 25.4 L61.6 27.0 L56.6 32.2 L54.3 35.1 L52.5 37.9 L50.8 41.6 L46.9 50.6 L46.0 53.1 L45.5 58.1 L45.5 60.3 L48.3 73.2 L49.5 77.8 L50.0 81.9 L50.2 91.8 L50.6 96.9 L51.2 98.7",
        w: 5.4,
        lx: 50.8,
        ly: 41.6,
        rot: 114.7
    },
    {
        id: "benu",
        name: "Benu\u00e9",
        d: "M89.9 22.1 L79.8 26.2 L77.8 27.2 L75.8 28.7 L72.7 31.9 L63.9 44.9 L62.6 46.4 L59.7 49.9 L59.4 51.2 L59.4 53.4 L58.4 56.4 L56.4 61.3 L51.8 69.9 L51.8 75.0 L49.5 77.8",
        w: 0.9,
        lx: 59.7,
        ly: 49.9,
        rot: 118.2
    },
    {
        id: "s97242",
        name: null,
        d: "M66.8 73.0 L67.2 71.8 L68.3 70.4 L68.8 69.3 L69.0 68.3 L69.0 66.4 L68.8 66.0 L68.7 65.3 L68.9 64.4 L69.0 62.9 L68.8 62.0 L68.2 61.1 L68.0 60.4 L68.1 58.7 L68.2 58.2 L68.8 57.6 L69.1 56.8 L70.0 56.2 L71.3 54.7 L72.0 54.2 L72.8 53.7 L74.6 51.7 L75.3 49.3 L75.4 49.0 L75.0 47.9 L75.2 46.9 L75.4 46.5 L76.1 46.1 L77.1 46.0 L77.6 45.7 L78.2 44.9 L78.2 44.8 L77.6 43.8 L77.5 41.7 L78.4 41.5 L78.6 41.2 L78.6 40.7 L78.8 40.3 L80.4 39.1 L81.2 38.0 L81.6 37.8 L81.7 37.1 L81.5 36.5 L80.5 36.1",
        w: 0.9,
        lx: 75.3,
        ly: 49.3,
        rot: -68.6
    },
    {
        id: "s62977",
        name: null,
        d: "M33.6 4.1 L33.4 5.3 L33.6 5.9 L33.3 6.3 L33.4 6.4 L33.6 6.5 L34.1 6.5 L34.7 6.8 L35.4 7.0 L35.9 7.5 L35.8 7.6 L35.6 7.8 L35.7 8.0 L36.9 9.1 L37.5 9.3 L38.3 9.2 L38.4 9.3 L38.6 9.8 L38.4 10.3 L38.5 10.8 L39.2 11.0 L40.0 10.8 L40.8 10.9 L41.1 10.7 L41.9 10.6 L42.6 10.3 L43.5 10.8 L43.8 10.9 L44.6 11.7 L44.9 11.9 L45.0 12.3 L44.6 12.4 L44.7 12.5 L44.9 12.4 L45.5 12.5 L45.8 12.4 L46.4 12.5 L46.7 12.4 L47.4 12.4 L47.7 13.1 L48.2 13.3 L49.0 14.1 L49.5 14.3 L49.7 14.3 L49.6 13.9 L49.6 13.7 L50.2 13.6 L50.5 14.1 L50.8 13.8 L51.6 13.9 L52.7 13.7 L52.8 13.2 L53.0 13.0 L53.2 12.7 L53.2 12.6 L53.0 12.5 L52.9 12.3 L53.0 12.2 L52.9 11.5 L53.0 11.3 L53.0 11.0 L53.6 10.4 L53.7 10.0 L54.4 9.7 L54.6 9.2 L55.1 8.7 L55.5 8.6 L54.9 9.6 L54.5 10.7",
        w: 0.9,
        lx: 45.5,
        ly: 12.5,
        rot: 0.0
    },
    {
        id: "s95649",
        name: null,
        d: "M27.5 83.3 L27.8 83.4 L28.5 84.4 L28.9 84.6 L29.4 84.8 L29.8 84.7 L31.1 84.9 L32.2 86.6 L33.4 87.6 L33.9 87.6 L36.1 88.5 L37.6 89.0 L38.4 89.5 L39.1 89.7 L39.8 90.6 L40.8 91.5 L41.1 91.3 L41.4 90.7 L41.7 90.5 L41.9 90.6 L43.5 90.5 L44.0 91.0 L44.1 91.6 L45.5 91.6 L46.3 92.1 L46.8 92.0 L47.1 91.7 L48.9 91.2 L50.3 91.1",
        w: 0.9,
        lx: 39.8,
        ly: 90.6,
        rot: 34.6
    },
    {
        id: "s95645",
        name: null,
        d: "M3.5 64.5 L3.6 64.2 L4.0 64.2 L4.1 63.9 L4.6 63.6 L4.8 63.2 L5.2 62.9 L5.0 62.5 L5.3 61.9 L5.6 61.6 L5.5 60.8 L6.0 60.0 L6.1 59.3 L6.8 58.4 L6.5 57.6 L7.0 57.4 L6.9 57.2 L7.1 57.0 L7.1 56.7 L7.5 56.3 L7.7 56.2 L8.2 56.3 L9.0 56.1 L9.2 55.2 L9.7 55.1 L10.0 54.9 L10.1 54.0 L10.6 53.6 L10.7 53.2 L10.5 52.8 L10.6 51.6 L11.3 51.6 L11.5 51.5 L11.5 51.1 L11.6 51.0 L12.4 51.0 L13.3 50.3 L13.9 50.2 L14.3 49.9 L14.5 50.1 L14.8 50.1",
        w: 0.9,
        lx: 7.7,
        ly: 56.2,
        rot: -18.0
    },
    {
        id: "s97243",
        name: null,
        d: "M60.3 81.5 L59.1 81.3 L58.5 81.5 L56.8 82.8 L56.4 83.7 L56.4 84.4 L56.9 87.6 L56.8 88.4 L56.5 89.6 L56.0 90.5 L53.7 93.6 L50.6 96.9",
        w: 0.9,
        lx: 56.9,
        ly: 87.6,
        rot: 89.1
    },
    {
        id: "s36702",
        name: null,
        d: "M47.8 48.6 L49.8 50.4 L50.9 50.6 L51.9 49.7 L52.4 49.4 L52.8 49.3 L53.5 49.4 L54.0 49.7 L54.3 50.3 L54.4 50.9 L54.0 52.4 L53.9 53.7 L54.4 55.4 L54.2 57.1 L54.8 58.9 L55.6 60.4 L56.4 61.3",
        w: 0.9,
        lx: 54.3,
        ly: 50.3,
        rot: 80.6
    },
    {
        id: "s16372",
        name: null,
        d: "M12.2 80.8 L12.4 80.8 L12.7 81.2 L15.2 81.0 L15.9 81.2 L16.4 81.5 L16.7 82.0 L17.1 82.1 L17.4 81.7 L18.4 81.7 L18.7 82.6 L18.9 82.7 L19.7 82.3 L20.1 82.2 L20.4 82.4 L20.8 82.1 L21.1 82.1 L21.6 82.7 L22.9 82.5 L23.9 82.5 L24.5 82.8 L25.1 82.8 L25.9 82.5 L26.8 82.8 L27.5 83.3",
        w: 0.9,
        lx: 19.7,
        ly: 82.3,
        rot: -5.5
    },
    {
        id: "s48492",
        name: null,
        d: "M97.3 38.5 L96.7 38.4 L96.1 38.9 L95.6 38.7 L94.6 39.2 L93.3 39.5 L92.0 39.4 L90.6 39.8 L90.3 39.7 L89.9 39.8 L89.7 40.2 L89.4 40.3 L88.4 40.2 L87.3 40.7 L85.8 40.9 L84.3 41.6",
        w: 0.9,
        lx: 90.3,
        ly: 39.7,
        rot: 162.4
    },
    {
        id: "s54830",
        name: null,
        d: "M72.3 21.3 L71.3 21.5 L70.7 21.8 L69.0 24.2 L68.6 25.2 L67.3 26.3 L64.2 27.8 L63.5 27.8 L61.6 27.0",
        w: 0.9,
        lx: 68.6,
        ly: 25.2,
        rot: 137.4
    },
    {
        id: "s43566",
        name: null,
        d: "M66.8 73.0 L65.4 76.7 L63.7 79.3 L62.9 80.7 L62.5 81.1 L61.4 81.9 L61.0 81.9 L60.3 81.5",
        w: 0.9,
        lx: 62.5,
        ly: 81.1,
        rot: 135.7
    },
    {
        id: "s83440",
        name: null,
        d: "M74.7 76.7 L75.3 76.9 L76.0 76.5 L77.6 76.3 L80.6 77.3 L81.5 78.6 L82.0 78.8 L82.2 79.1 L82.7 80.0 L82.9 80.3 L83.0 81.2 L83.5 81.6",
        w: 0.9,
        lx: 82.0,
        ly: 78.8,
        rot: 51.8
    },
    {
        id: "s36209",
        name: null,
        d: "M45.3 1.5 L45.4 1.6 L45.0 3.0 L45.0 3.8 L45.4 4.3 L46.5 5.2 L48.6 6.2 L50.6 6.4 L52.5 7.2 L52.6 7.5 L53.0 7.6",
        w: 0.9,
        lx: 46.5,
        ly: 5.2,
        rot: 24.9
    },
    {
        id: "s76453",
        name: null,
        d: "M59.0 2.1 L59.1 2.8 L59.0 3.7 L59.5 4.9 L58.8 6.0 L56.9 7.9 L56.2 8.3 L54.8 10.3",
        w: 0.9,
        lx: 58.8,
        ly: 6.0,
        rot: 121.2
    },
    {
        id: "s60520",
        name: null,
        d: "M55.4 25.5 L55.1 25.6 L54.7 25.5 L54.4 25.5 L54.0 26.0 L53.7 28.5 L52.7 29.4 L51.5 30.7 L51.1 31.0 L51.2 31.1 L50.9 31.9 L50.9 32.6",
        w: 0.9,
        lx: 52.7,
        ly: 29.4,
        rot: 119.7
    }
];
const GEO_MAP_BRIDGES = [
    [
        5.1,
        63
    ],
    [
        6,
        59.9
    ],
    [
        14,
        50.2
    ],
    [
        28.1,
        83.8
    ],
    [
        33.6,
        4.3
    ],
    [
        39.3,
        89.9
    ],
    [
        39.8,
        10.9
    ],
    [
        40.2,
        90.9
    ],
    [
        43.5,
        90.5
    ],
    [
        47.7,
        13
    ],
    [
        52.7,
        13.5
    ],
    [
        56.8,
        88.6
    ],
    [
        59.2,
        5.4
    ],
    [
        64.7,
        27.6
    ],
    [
        74.9,
        50.8
    ],
    [
        77.2,
        76.3
    ]
];
const GEO_MAP_LABELS = [
    {
        name: "Adankolo",
        x: 12.23,
        y: 40.92,
        kind: "suburb"
    },
    {
        name: "Zokoja",
        x: 43.94,
        y: 41.21,
        kind: "village"
    },
    {
        name: "Lokoja",
        x: 43.94,
        y: 41.21,
        kind: "suburb"
    },
    {
        name: "Filele",
        x: 30.71,
        y: 7.63,
        kind: "village"
    },
    {
        name: "Felelen Buzu",
        x: 30.71,
        y: 7.63,
        kind: "village"
    },
    {
        name: "Emiwoziri",
        x: 57.63,
        y: 95.48,
        kind: "village"
    },
    {
        name: "Kpato",
        x: 80.08,
        y: 86.55,
        kind: "village"
    },
    {
        name: "Numai",
        x: 47.45,
        y: 31.85,
        kind: "village"
    },
    {
        name: "Felele",
        x: 43.39,
        y: 74.45,
        kind: "suburb"
    },
    {
        name: "Crusher",
        x: 44.16,
        y: 86.66,
        kind: "suburb"
    },
    {
        name: "Ganaja",
        x: 79.87,
        y: 86.58,
        kind: "suburb"
    },
    {
        name: "Kpata",
        x: 38.65,
        y: 56.79,
        kind: "suburb"
    },
    {
        name: "Otokiti",
        x: 41.61,
        y: 66.16,
        kind: "suburb"
    },
    {
        name: "Zango",
        x: 35.60,
        y: 40.63,
        kind: "suburb"
    }
];
}),
"[project]/src/components/game/MapCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapCanvas",
    ()=>MapCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — MapCanvas (Stage 6: real cartography)
 * -------------------------------------------------------------
 * The 2D map is now generated from the SAME real Lokoja data as the 3D
 * world (OpenStreetMap via scripts/geo → geo-map.ts): every mapped
 * street, the true Niger/Benue courses meeting at the real Confluence
 * south-east of the town, the actual stream bridges, and the real
 * suburb names (Adankolo, Filele, Felele, Crusher, Ganaja, Kpato…).
 *
 * Cartography rules kept from the Stage-4 pass:
 *   • Water = wide strokes with a sand rim + deep channel line.
 *   • Roads = 3-tier hierarchy (trunk / main / minor) with dark casing +
 *     laterite fill + centre dashes on trunk roads.
 *   • Mount Patti = nested contour bands + summit rest house + the real
 *     Patti Road trail dashes.
 *   • Deterministic, no Math.random(), no SVG filters. viewBox 0 0 100 100
 *     so the HTML marker overlay (positioned by the same grid) never drifts.
 *
 * Scale: 1 map unit = 6.2 world units = 161 m real.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/geo-map.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
/** Mount Patti summit in map grid — the same data the 3D world uses */ const PATTI = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"]['mount-patti'];
const PATTI_TRAILHEAD = {
    x: 41.7,
    y: 36.3
};
function MapCanvas() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 100 100",
        className: "pointer-events-none absolute inset-0 h-full w-full",
        preserveAspectRatio: "xMidYMid meet",
        role: "img",
        "aria-label": "Real map of Lokoja: the Niger and Benue rivers meeting at the Confluence, Mount Patti in the north-west, the town's real street network, main roads with bridges, suburbs and a compass, scale bar and title cartouche",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@media (max-width: 639px){ .lko-lbl-sm{ display:none } }`
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "lko4-land",
                        x1: "0",
                        y1: "0",
                        x2: "0.85",
                        y2: "1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0",
                                stopColor: "#f3e9cb"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#e5d3a4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                        id: "lko4-grain",
                        width: "2.7",
                        height: "2.3",
                        patternUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "0.6",
                                cy: "0.7",
                                r: "0.17",
                                fill: "#a8946a",
                                opacity: "0.2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "1.9",
                                cy: "1.7",
                                r: "0.13",
                                fill: "#b3a077",
                                opacity: "0.16"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "1.3",
                                cy: "0.4",
                                r: "0.1",
                                fill: "#8f7c55",
                                opacity: "0.12"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "100",
                height: "100",
                fill: "url(#lko4-land)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "100",
                height: "100",
                fill: "url(#lko4-grain)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "49.5",
                cy: "77",
                rx: "7",
                ry: "5",
                fill: "#c9dcae",
                opacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "66",
                cy: "12",
                rx: "7",
                ry: "4",
                fill: "#c9dcae",
                opacity: "0.45"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "57.5",
                cy: "58",
                rx: "3.4",
                ry: "7",
                fill: "#c9dcae",
                opacity: "0.42"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "55",
                cy: "92",
                rx: "5",
                ry: "4",
                fill: "#cfdcb2",
                opacity: "0.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "76",
                cy: "30",
                rx: "6",
                ry: "4",
                fill: "#c9dcae",
                opacity: "0.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "86",
                cy: "41",
                rx: "5",
                ry: "3.6",
                fill: "#cfdcb2",
                opacity: "0.38"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "66",
                cy: "45",
                rx: "3.4",
                ry: "5",
                fill: "#c9dcae",
                opacity: "0.34"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "33",
                cy: "31",
                rx: "8",
                ry: "6",
                fill: "#c9d8ab",
                opacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"]).map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: l.mapX,
                    cy: l.mapY,
                    r: l.id === 'mount-patti' || l.id === 'confluence' ? 4.6 : 3.6,
                    fill: "#f8efd6",
                    opacity: "0.62"
                }, l.id, false, {
                    fileName: "[project]/src/components/game/MapCanvas.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "none",
                stroke: "#a8946a",
                strokeWidth: "0.3",
                opacity: "0.55",
                strokeLinecap: "round",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_MINOR"].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: d
                    }, i, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "none",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        stroke: "#8f7c55",
                        strokeWidth: "1.12",
                        opacity: "0.9",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_MAIN"].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: d
                            }, i, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        stroke: "#d9b98a",
                        strokeWidth: "0.72",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_MAIN"].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: d
                            }, i, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "none",
                strokeLinecap: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        stroke: "#6e5c3e",
                        strokeWidth: "1.7",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_TRUNK"].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: d
                            }, i, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        stroke: "#e8dcc3",
                        strokeWidth: "1.12",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_TRUNK"].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: d
                            }, i, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        stroke: "#a8865a",
                        strokeWidth: "0.16",
                        strokeDasharray: "1.1 1.3",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_TRUNK"].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: d
                            }, i, false, {
                                fileName: "[project]/src/components/game/MapCanvas.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_RIVERS"].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: r.d,
                            stroke: "#cdb87f",
                            strokeWidth: r.w + 1.5,
                            opacity: "0.9"
                        }, `rim-${r.id}`, false, {
                            fileName: "[project]/src/components/game/MapCanvas.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this)),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_RIVERS"].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: r.d,
                            stroke: "#2e7f86",
                            strokeWidth: r.w
                        }, `body-${r.id}`, false, {
                            fileName: "[project]/src/components/game/MapCanvas.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_RIVERS"].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: r.d,
                            stroke: "#175a64",
                            strokeWidth: r.w * 0.42,
                            opacity: "0.75"
                        }, `deep-${r.id}`, false, {
                            fileName: "[project]/src/components/game/MapCanvas.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_BRIDGES"].map(([x, y], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: x - 1.05,
                    y: y - 0.55,
                    width: "2.1",
                    height: "1.1",
                    rx: "0.24",
                    fill: "#e8dcc3",
                    stroke: "#6e5c3e",
                    strokeWidth: "0.14"
                }, i, false, {
                    fileName: "[project]/src/components/game/MapCanvas.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: PATTI.mapX,
                        cy: PATTI.mapY,
                        rx: "11.5",
                        ry: "9",
                        fill: "#b5c48b",
                        opacity: "0.55",
                        transform: `rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: PATTI.mapX,
                        cy: PATTI.mapY,
                        rx: "9",
                        ry: "7",
                        fill: "#93ab6b",
                        opacity: "0.6",
                        transform: `rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: PATTI.mapX,
                        cy: PATTI.mapY,
                        rx: "6.4",
                        ry: "5",
                        fill: "#6f9450",
                        opacity: "0.62",
                        transform: `rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: PATTI.mapX,
                        cy: PATTI.mapY,
                        rx: "3.6",
                        ry: "2.9",
                        fill: "#587a3e",
                        transform: `rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: PATTI.mapX - 0.8,
                        y: PATTI.mapY - 0.6,
                        width: "1.6",
                        height: "1.2",
                        rx: "0.2",
                        fill: "#f3e9cb",
                        stroke: "#4a3418",
                        strokeWidth: "0.18"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: `M ${PATTI_TRAILHEAD.x} ${PATTI_TRAILHEAD.y} L 40.2 35.3 L 38.9 33.9 L 39.4 32.1 L 37.9 30.8 L 36.6 29.3 L ${PATTI.mapX} ${PATTI.mapY}`,
                        fill: "none",
                        stroke: "#4a3418",
                        strokeWidth: "0.3",
                        strokeDasharray: "0.7 0.6",
                        opacity: "0.75"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                opacity: "0.85",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "49.5",
                        cy: "77.6",
                        r: "1.7",
                        fill: "none",
                        stroke: "#d9d2c0",
                        strokeWidth: "0.22"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 48.4 77.2 C 49 76.4 50.2 76.5 50.6 77.3 C 51 78.1 50.3 78.9 49.5 78.7",
                        fill: "none",
                        stroke: "#d9d2c0",
                        strokeWidth: "0.2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_LABELS"].map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    className: "lko-lbl-sm",
                    x: l.x,
                    y: l.y - 0.9,
                    fontSize: "1.55",
                    fontWeight: "700",
                    fill: l.kind === 'suburb' ? '#5c4a28' : '#6b5a36',
                    letterSpacing: "0.16",
                    textAnchor: "middle",
                    stroke: "#f1e7c8",
                    strokeWidth: "0.42",
                    paintOrder: "stroke",
                    children: l.name
                }, l.name, false, {
                    fileName: "[project]/src/components/game/MapCanvas.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$geo$2d$map$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_MAP_RIVERS"].filter((r)=>r.name).map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    className: "lko-lbl-sm",
                    x: r.lx,
                    y: r.ly,
                    fontSize: "2.1",
                    fontWeight: "700",
                    fill: "#0d4148",
                    letterSpacing: "0.3",
                    textAnchor: "middle",
                    transform: `rotate(${r.rot} ${r.lx} ${r.ly})`,
                    stroke: "#e8f0e2",
                    strokeWidth: "0.4",
                    paintOrder: "stroke",
                    children: r.name
                }, `lbl-${r.id}`, false, {
                    fileName: "[project]/src/components/game/MapCanvas.tsx",
                    lineNumber: 192,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "2.2",
                        y: "2.2",
                        width: "30",
                        height: "10.4",
                        rx: "1.4",
                        fill: "#f8efd6",
                        opacity: "0.94",
                        stroke: "#a14e2a",
                        strokeWidth: "0.28"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "4",
                        y: "6.2",
                        fontSize: "3",
                        fontWeight: "800",
                        fill: "#7a3a1e",
                        letterSpacing: "0.12",
                        children: "LOKOJA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "4",
                        y: "9.4",
                        fontSize: "1.45",
                        fontWeight: "700",
                        fill: "#56683d",
                        letterSpacing: "0.24",
                        children: "KOGI STATE · NIGERIA"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "4",
                        y: "11.6",
                        fontSize: "1.15",
                        fontWeight: "600",
                        fill: "#8a7a58",
                        letterSpacing: "0.14",
                        children: "THE CONFLUENCE CITY · REAL STREET MAP"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: "translate(93.4 88.6)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        r: "4.4",
                        fill: "#f8efd6",
                        opacity: "0.92",
                        stroke: "#a14e2a",
                        strokeWidth: "0.26"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M -1.7 0.7 L 0 -2 L 1.7 0.7 Z",
                        fill: "#a14e2a",
                        stroke: "#4a3418",
                        strokeWidth: "0.22"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        y: "-4.9",
                        fontSize: "2.2",
                        fontWeight: "800",
                        fill: "#7a3a1e",
                        textAnchor: "middle",
                        children: "N"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: "translate(60 95.4)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "-0.6",
                        y: "-1.5",
                        width: "27.4",
                        height: "3",
                        rx: "0.7",
                        fill: "#f8efd6",
                        opacity: "0.9",
                        stroke: "#a14e2a",
                        strokeWidth: "0.2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 0 0 L 12.4 0",
                        stroke: "#5c4a28",
                        strokeWidth: "0.34"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 0 -0.8 L 0 0.8 M 6.2 -0.55 L 6.2 0.55 M 12.4 -0.8 L 12.4 0.8",
                        stroke: "#5c4a28",
                        strokeWidth: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "0",
                        y: "2.1",
                        fontSize: "1.05",
                        fontWeight: "700",
                        fill: "#5c4a28",
                        textAnchor: "middle",
                        children: "0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "6.2",
                        y: "2.1",
                        fontSize: "1.05",
                        fontWeight: "700",
                        fill: "#5c4a28",
                        textAnchor: "middle",
                        children: "1 km"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "12.4",
                        y: "2.1",
                        fontSize: "1.05",
                        fontWeight: "700",
                        fill: "#5c4a28",
                        textAnchor: "middle",
                        children: "2 km"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/MapCanvas.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/MapCanvas.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/MapCanvas.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/ui/icons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icon",
    ()=>Icon,
    "weatherIcon",
    ()=>weatherIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
/** stroke style shared by every icon in the set */ const base = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
};
const PATHS = {
    world: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.4 9h17.2M3.4 15h17.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    map: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 4.5 3.7 6.6a1 1 0 0 0-.7 1v10.9a1 1 0 0 0 1.3 1L9 17.5l6 2 5.3-2.1a1 1 0 0 0 .7-1V5.5a1 1 0 0 0-1.3-1L15 6.5l-6-2Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 4.5v13M15 6.5v13"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    work: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "7",
                width: "18",
                height: "13",
                rx: "2.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 12.5h6.5M14.5 12.5H21"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 11.4v2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    bag: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.3 8 4 11l1 8.3A2 2 0 0 0 7 21h10a2 2 0 0 0 2-1.7L20 11l-2.3-3Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 11h16"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 11V8a3 3 0 0 1 6 0v3"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    user: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "8",
                r: "3.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 20a7 7 0 0 1 14 0"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    pin: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 10c0 4.5-5 9.3-6.4 10.6a1 1 0 0 1-1.3 0C9.9 19.3 5 14.5 5 10a7 7 0 0 1 14 0Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10",
                r: "2.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    cash: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2.5",
                y: "6.5",
                width: "19",
                height: "11",
                rx: "2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 12h.01M18 12h.01",
                strokeWidth: 2.6
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    clock: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7.2V12l3 1.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    star: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m12 3.6 2.5 5a1.6 1.6 0 0 0 1.2.9l5.4.8-3.9 3.8a1.6 1.6 0 0 0-.5 1.4l1 5.4-4.9-2.6a1.6 1.6 0 0 0-1.5 0l-4.9 2.6 1-5.4a1.6 1.6 0 0 0-.5-1.4L3 10.3l5.4-.8a1.6 1.6 0 0 0 1.2-.9Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)),
    lock: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "5",
                y: "11",
                width: "14",
                height: "9.5",
                rx: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.2 11V7.8a3.8 3.8 0 0 1 7.6 0V11"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    'chevron-right': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m9.5 5.5 6.2 6.5-6.2 6.5"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 105,
        columnNumber: 20
    }, ("TURBOPACK compile-time value", void 0)),
    'chevron-down': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m5.5 9.5 6.5 6.2 6.5-6.2"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 106,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0)),
    'arrow-left': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 12H5.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m11.5 5.5-6.4 6.5 6.4 6.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    'arrow-up-right': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.5 17.5 17 7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 6.5H17.5V15.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    close: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M6 6 18 18M18 6 6 18"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 119,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    sliders: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 7.5h9M17.5 7.5H20M4 16.5h3M11.5 16.5H20"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "15",
                cy: "7.5",
                r: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "16.5",
                r: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    volume: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11.5 4.8a.7.7 0 0 0-1.2-.5L7 7.6a1.4 1.4 0 0 1-1 .4H4.2a1.2 1.2 0 0 0-1.2 1.2v5.6a1.2 1.2 0 0 0 1.2 1.2H6a1.4 1.4 0 0 1 1 .4l3.3 3.3a.7.7 0 0 0 1.2-.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.5 8.8a5 5 0 0 1 0 6.4M18.2 6.2a8.6 8.6 0 0 1 0 11.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    'volume-x': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11.5 4.8a.7.7 0 0 0-1.2-.5L7 7.6a1.4 1.4 0 0 1-1 .4H4.2a1.2 1.2 0 0 0-1.2 1.2v5.6a1.2 1.2 0 0 0 1.2 1.2H6a1.4 1.4 0 0 1 1 .4l3.3 3.3a.7.7 0 0 0 1.2-.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m16 9.5 5 5M21 9.5l-5 5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    save: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m19 21-7-4.2L5 21V5.4A2.4 2.4 0 0 1 7.4 3h9.2A2.4 2.4 0 0 1 19 5.4Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)),
    exit: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m15.5 16.5 4.5-4.5-4.5-4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 12H9.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    heart: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M12 20.6C8.9 17.9 5.8 14.8 3.6 11.9a4.8 4.8 0 0 1-1-2.7A4.4 4.4 0 0 1 7 4.9c1.5 0 2.6.5 3.9 1.7l1.1 1 1.1-1A5.7 5.7 0 0 1 17 4.9a4.4 4.4 0 0 1 4.4 4.3 4.8 4.8 0 0 1-1 2.7c-2.2 2.9-5.3 6-8.4 8.7Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)),
    energy: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M13.2 2.4 4.5 13.2a.55.55 0 0 0 .45.9h5.3l-1.4 7.4 8.7-10.8a.55.55 0 0 0-.45-.9h-5.3Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 152,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    food: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.5 3v6a2.2 2.2 0 0 0 2.2 2.2h1.6A2.2 2.2 0 0 0 10.5 9V3M7.5 3v18"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19.5 3a4.2 4.2 0 0 0-4 4.2V13h4M19.5 3v18"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    mood: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.4 14.2s1.3 1.9 3.6 1.9 3.6-1.9 3.6-1.9"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.2 9.4h.01M14.8 9.4h.01",
                strokeWidth: 2.6
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    sun: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    moon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M20.4 14.6A8.5 8.5 0 1 1 9.4 3.6a7 7 0 0 0 11 11Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 172,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    cloud: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M17.3 18.5H8a6 6 0 1 1 5.8-7.6h1.3a3.8 3.8 0 1 1 .2 7.6Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 173,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    rain: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.3 15.5H8a6 6 0 1 1 5.8-7.6h1.3a3.8 3.8 0 1 1 .2 7.6Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 18.5v2.3M12.5 17.5v2.3M16.5 18.5v2.3"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    sunrise: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3.5v4M5 8.5 6.6 10M19 8.5 17.4 10M3 15h2.5M18.5 15H21M6.5 15a5.5 5.5 0 0 1 11 0"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2.5 19h19"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    'camera-follow': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 4.5c4.6 0 8.4 3.1 10 7.5-1.6 4.4-5.4 7.5-10 7.5S3.6 16.4 2 12c1.6-4.4 5.4-7.5 10-7.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    'camera-free': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "19",
                cy: "5.4",
                r: "1.7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "5",
                cy: "18.6",
                r: "1.7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.5 21.2a9.6 9.6 0 0 0 9.5-14.7M13.4 2.9a9.6 9.6 0 0 0-9.4 14.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    locate: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "6.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "1.1",
                fill: "currentColor",
                stroke: "none"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    sprint: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m6 5.5 6.5 6.5L6 18.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m12.5 5.5 6.5 6.5-6.5 6.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    check: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m4.5 12.5 5 5L19.5 6.5"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 213,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    eye: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2.5 12.2a.9.9 0 0 1 0-.7A10.2 10.2 0 0 1 12 5a10.2 10.2 0 0 1 9.5 6.5.9.9 0 0 1 0 .7A10.2 10.2 0 0 1 12 18.7 10.2 10.2 0 0 1 2.5 12.2Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    dice: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3.5",
                y: "3.5",
                width: "17",
                height: "17",
                rx: "3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.2 8.2h.01M15.8 8.2h.01M12 12h.01M8.2 15.8h.01M15.8 15.8h.01",
                strokeWidth: 2.6
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    sparkle: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M11 4.2 12.4 9a2 2 0 0 0 1.4 1.4l4.8 1.4a.5.5 0 0 1 0 1L13.8 14a2 2 0 0 0-1.4 1.4L11 20.2a.5.5 0 0 1-1 0L8.6 15.4A2 2 0 0 0 7.2 14l-4.8-1.4a.5.5 0 0 1 0-1L7.2 10.4A2 2 0 0 0 8.6 9L10 4.2a.5.5 0 0 1 1 0Z"
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)),
    bed: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 5.5v13M3 10h15.5A2.5 2.5 0 0 1 21 12.5v6M3 16.5h18"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 231,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "7.5",
                cy: "7.8",
                r: "1.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    compass: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m15.6 8.4-1.9 4.9-4.9 1.9 1.9-4.9Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true),
    ledger: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v14A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 8h7M8.5 12h7M8.5 16h4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/icons.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true)
};
function Icon({ name, size = 18, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        width: size,
        height: size,
        ...base,
        ...rest,
        children: PATHS[name]
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/icons.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
function weatherIcon(weather) {
    switch(weather){
        case 'rain':
            return 'rain';
        case 'cloudy':
            return 'cloud';
        case 'night-clear':
            return 'moon';
        default:
            return 'sun';
    }
}
}),
"[project]/src/components/game/ui/kit.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Btn",
    ()=>Btn,
    "GlassChip",
    ()=>GlassChip,
    "IconBtn",
    ()=>IconBtn,
    "SectionLabel",
    ()=>SectionLabel,
    "SheetShell",
    ()=>SheetShell,
    "StatTile",
    ()=>StatTile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/icons.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const BTN_VARIANT = {
    primary: 'bg-[var(--lko-green)] text-white shadow-[0_8px_20px_-10px_rgba(16,101,61,0.65)] hover:bg-[#0d5735] disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)] disabled:shadow-none',
    gold: 'bg-[var(--lko-gold)] text-[#33230a] shadow-[0_8px_20px_-10px_rgba(217,154,27,0.7)] hover:bg-[#c98d14] disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)] disabled:shadow-none',
    ghost: 'bg-[var(--lko-surface)] text-[var(--lko-ink)] border border-[var(--lko-line)] hover:border-black/[0.16]',
    soft: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)] border border-[var(--lko-green)]/20 hover:border-[var(--lko-green)]/40',
    danger: 'bg-red-50 text-red-700 border border-red-200/80 hover:border-red-300'
};
const BTN_SIZE = {
    sm: 'min-h-[38px] px-3.5 text-[13px] gap-1.5 rounded-[10px]',
    md: 'min-h-[46px] px-4 text-sm gap-2 rounded-xl',
    lg: 'min-h-[54px] px-5 text-[15px] gap-2 rounded-[14px]'
};
function Btn({ variant = 'primary', size = 'md', icon, iconEnd, block = true, className = '', children, type = 'button', ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: `lko-press inline-flex items-center justify-center font-bold tracking-[-0.01em] disabled:cursor-not-allowed ${BTN_VARIANT[variant]} ${BTN_SIZE[size]} ${block ? 'w-full' : ''} ${className}`,
        ...rest,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                name: icon,
                size: size === 'sm' ? 15 : 17
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 73,
                columnNumber: 16
            }, this),
            children,
            iconEnd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                name: iconEnd,
                size: size === 'sm' ? 15 : 17
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 75,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/ui/kit.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function IconBtn({ icon, label, size = 20, active = false, className = '', ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        "aria-label": label,
        title: label,
        className: `lko-press pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl lko-glass ${active ? 'text-[var(--lko-green)]' : 'text-[var(--lko-ink)]'} ${className}`,
        ...rest,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
            name: icon,
            size: size
        }, void 0, false, {
            fileName: "[project]/src/components/game/ui/kit.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/kit.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
function GlassChip({ children, className = '', tone = 'plain' }) {
    const tones = {
        plain: 'text-[var(--lko-ink)]',
        good: 'text-[var(--lko-green-deep)]',
        bad: 'border-red-200/80 bg-red-50/85 text-red-700',
        gold: 'text-[#8a5a00]'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold lko-glass ${tones[tone]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/game/ui/kit.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
function SectionLabel({ icon, children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: `lko-label flex items-center gap-1.5 ${className}`,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                name: icon,
                size: 13,
                className: "shrink-0 opacity-80"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 137,
                columnNumber: 16
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/ui/kit.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
function SheetShell({ label, onClose, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50",
        role: "dialog",
        "aria-label": label,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "aria-label": "Close panel",
                onClick: onClose,
                className: "absolute inset-0 bg-[rgba(14,20,15,0.42)] backdrop-blur-[2px]"
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-pop absolute inset-x-0 bottom-0 mx-auto w-full max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-sheet max-h-[80dvh] overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto mb-2.5 h-1 w-10 rounded-full bg-black/15",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/ui/kit.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        children
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/ui/kit.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/ui/kit.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
function StatTile({ label, value, tone = 'plain' }) {
    const tones = {
        plain: 'bg-[var(--lko-cream)] text-[var(--lko-ink)]',
        good: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
        bad: 'bg-red-50 text-red-700',
        gold: 'bg-[var(--lko-gold-soft)] text-[#8a5a00]'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl px-3 py-2.5 text-center ${tones[tone]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lko-display mt-0.5 text-[17px] leading-tight",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/game/ui/kit.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/ui/kit.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/BizBlock.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BizBlock",
    ()=>BizBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * The business hosted at this location (if any): not-yet-owned shows the
 * buy row; owned shows the live till, a free in-person collect and the
 * next upgrade. Income preview reads the SAME pure law the day roll uses,
 * so the number on the sheet is the number the till will get.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/biz.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
function BizBlock({ locationId }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    // M8 — the chaos state rides into the SAME income law the day roll uses
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.chaos);
    const buyBiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.buyBiz);
    const collectBiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.collectBiz);
    const upgradeBiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.upgradeBiz);
    const hireStaff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.hireStaff);
    const fireStaff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.fireStaff);
    const installBizUpgrade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.installBizUpgrade);
    const host = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizAtLocation"])(locationId);
    if (!host) return null;
    const { typeId, def } = host;
    const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId);
    // today's honest per-day income at the shop's current shape (staff + power included)
    const todayIncome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizIncomeFor"])(typeId, shop?.level ?? 1, world.day, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["marketForDay"])(civic, world.day), player.reputation, shop ? {
        staff: shop.staff,
        upgrades: shop.upgrades,
        chaos
    } : undefined);
    const darkNow = !!shop && civic.nepa.shedding && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPowerBackup"])(shop.upgrades);
    const blackoutNow = !!shop && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, def.locationId, world.day);
    const genFuelToday = !!shop && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizGeneratorFuelFor"])(typeId, world.day, shop.upgrades, chaos);
    const scarcityNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isScarcityDay"])(world.day) && def.pos === true;
    const buy = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        buyBiz(typeId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label mb-1.5 flex items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: def.emoji
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    " ",
                    shop ? 'Your business here' : 'Shop for sale here'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/BizBlock.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            !shop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs leading-relaxed text-[var(--lko-ink-soft)]",
                        children: def.blurb
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    player.level < def.unlockLevel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 flex items-center gap-1.5 text-xs font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "lock",
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, this),
                            " Opens at Level ",
                            def.unlockLevel,
                            " — you are Level ",
                            player.level,
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 65,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: buy,
                        disabled: player.cash < def.buyCost,
                        className: `lko-press mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${player.cash < def.buyCost ? 'cursor-not-allowed border-[var(--lko-line)] opacity-55' : 'border-[var(--lko-green)]/50 bg-white hover:border-[var(--lko-green)]'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-extrabold text-[var(--lko-ink)]",
                                children: [
                                    "Buy the ",
                                    def.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 78,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-extrabold tabular-nums text-[var(--lko-terra)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(def.buyCost)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 79,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true),
            shop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-xs font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Level ",
                                    shop.level,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].maxLevel,
                                    " · ~",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(todayIncome),
                                    "/day"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizUpgradeCost"])(typeId, shop.level) === null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "MAX LEVEL"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 91,
                                columnNumber: 61
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    blackoutNow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        "data-testid": "biz-blackout",
                        className: "mt-1.5 rounded-lg bg-[#2b1a16] px-2.5 py-1.5 text-[11px] font-bold text-[#ffb4a0]",
                        children: [
                            "⚡ TRANSFORMER DON BLOW — the whole zone dey dark",
                            !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPowerBackup"])(shop.upgrades) ? ` (shop dey run blank — −${Math.round((1 - 0.25) * 100)}%)` : '',
                            ". ",
                            genFuelToday ? `Generator dey burn ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(genFuelToday)}/day from the till.` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasGenerator"])(shop.upgrades) ? 'Generator dey carry the light.' : 'Fit a generator below.'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, this),
                    scarcityNow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        "data-testid": "biz-pos-boom",
                        className: "mt-1.5 rounded-lg bg-[#e8f5e9] px-2.5 py-1.5 text-[11px] font-bold text-[#1b5e20]",
                        children: [
                            "📱 Cash scarcity — your POS terminal dey harvest today (+",
                            Math.round((1.35 - 1) * 100),
                            "% commissions)."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 99,
                        columnNumber: 13
                    }, this),
                    darkNow && !blackoutNow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 rounded-lg bg-[#c0392b]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#8a2a20]",
                        children: [
                            "🔌 NEPA don cut the light — the shop dey run dark today (−",
                            Math.round((1 - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].sheddingIncomeFactor) * 100),
                            "%). Fit a generator or solar below."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-baseline justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-bold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: "Till today"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-display text-xl tabular-nums text-[var(--lko-green-deep)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(shop.accrued)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex items-center justify-between gap-2 rounded-lg bg-black/[0.035] px-2.5 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    "👥 Attendants ",
                                    shop.staff,
                                    "/",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffCapFor"])(shop.level),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[10px] font-semibold",
                                        children: [
                                            "+",
                                            Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffIncomeBoost * 100),
                                            "% each · wage ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffWagePerDay),
                                            "/day from the till"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/BizBlock.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex shrink-0 gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "biz-hire",
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            hireStaff(typeId);
                                        },
                                        disabled: shop.staff >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staffCapFor"])(shop.level) || player.cash < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffHireFee,
                                        className: "lko-press rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40",
                                        children: [
                                            "Hire · ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffHireFee)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/BizBlock.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this),
                                    shop.staff > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "biz-fire",
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            fireStaff(typeId);
                                        },
                                        className: "lko-press rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                                        children: "Let go"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/BizBlock.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-center justify-between gap-2 rounded-lg bg-black/[0.035] px-2.5 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    "⚡ Power",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[10px] font-semibold",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPowerBackup"])(shop.upgrades) ? 'Your light no dey go.' : 'Shedding go dim this shop — fit backup power.'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/BizBlock.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex shrink-0 gap-1.5",
                                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].upgrades).map(([id, up])=>{
                                    const installed = shop.upgrades.includes(id);
                                    return installed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1 rounded-full bg-[var(--lko-green)]/15 px-2 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "check",
                                                size: 11
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                                lineNumber: 157,
                                                columnNumber: 21
                                            }, this),
                                            " ",
                                            up.emoji,
                                            " ",
                                            up.label
                                        ]
                                    }, id, true, {
                                        fileName: "[project]/src/components/game/BizBlock.tsx",
                                        lineNumber: 156,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": `biz-install-${id}`,
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            installBizUpgrade(typeId, id);
                                        },
                                        disabled: player.cash < up.cost,
                                        title: up.blurb,
                                        className: "lko-press rounded-lg border border-[var(--lko-green)]/40 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--lko-green-deep)] disabled:opacity-40",
                                        children: [
                                            up.emoji,
                                            " ",
                                            up.label,
                                            " · ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(up.cost)
                                        ]
                                    }, id, true, {
                                        fileName: "[project]/src/components/game/BizBlock.tsx",
                                        lineNumber: 160,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    collectBiz(typeId, 'shop');
                                },
                                disabled: shop.accrued <= 0 || world.currentLocation !== def.locationId,
                                className: "lko-press flex-1 rounded-lg bg-[var(--lko-green)] px-3 py-2 text-sm font-extrabold text-white disabled:opacity-45",
                                children: "Collect (free here)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/BizBlock.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            (()=>{
                                const cost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bizUpgradeCost"])(typeId, shop.level);
                                if (cost === null) return null;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        upgradeBiz(typeId);
                                    },
                                    disabled: player.cash < cost,
                                    className: "lko-press flex-1 rounded-lg border border-[var(--lko-green)]/50 bg-white px-3 py-2 text-sm font-extrabold text-[var(--lko-green-deep)] disabled:opacity-45",
                                    children: [
                                        "Upgrade · ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cost)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/BizBlock.tsx",
                                    lineNumber: 187,
                                    columnNumber: 17
                                }, this);
                            })()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this),
                    shop.accrued > 0 && world.currentLocation !== def.locationId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "You no dey here — travel come collect free, or use the phone (+fee)."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/BizBlock.tsx",
                        lineNumber: 198,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/BizBlock.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/FleetBlock.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FleetBlock",
    ()=>FleetBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — FleetBlock (M5: WORK & FLEET)
 * -------------------------------------------
 * The Motor Park gig board, mounted in the park's location sheet (the same
 * shared sheet the 2D map and the 3D world open). Reads the ONE derived
 * board law (availableGigs — deterministic per day + your garage) and hands
 * every run to the store's runGig action. Presentation only: payouts,
 * fuel, energy and presence rules all live in systems/fleet + the store.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fleet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/icons.tsx [app-ssr] (ecmascript)");
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
function FleetBlock() {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const fleet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.fleet);
    const isTravelling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.isTravelling);
    const runGig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.runGig);
    const gigs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["availableGigs"])(world.day, player.vehicles, player.level, world.weather, fleet, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fuelMultFor"])(world.day)), [
        world.day,
        world.weather,
        player.vehicles,
        player.level,
        fleet
    ]);
    const atPark = world.currentLocation === 'transport-area';
    const run = (gigId)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        runGig(gigId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 rounded-xl border border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)]/25 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label mb-1.5 flex items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "🛵"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FleetBlock.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    " Driver gigs today",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: "passengers pay · you burn the fuel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FleetBlock.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FleetBlock.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            player.vehicles.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs leading-relaxed text-[var(--lko-ink-soft)]",
                children: "No ride in your garage yet — the Motor Park showroom dey sell right here. Buy one and the park go start giving you runs."
            }, void 0, false, {
                fileName: "[project]/src/components/game/FleetBlock.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            player.vehicles.length > 0 && gigs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs leading-relaxed text-[var(--lko-ink-soft)]",
                children: "You don clear today's board. Tomorrow get their own runs — come back fresh."
            }, void 0, false, {
                fileName: "[project]/src/components/game/FleetBlock.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this),
            gigs.map((gig)=>{
                const vdef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][gig.model];
                const dest = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][gig.toId];
                const tooTired = player.needs.energy < gig.energyCost;
                const blocked = !atPark || tooTired || isTravelling;
                const reason = !atPark ? 'You no dey the park — travel come first' : tooTired ? 'You are too tired for this run' : 'You are travelling';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": gig.id,
                    onClick: ()=>run(gig.id),
                    disabled: blocked,
                    className: `lko-press mt-1.5 flex min-h-[56px] w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left first:mt-0 ${blocked ? 'cursor-not-allowed border-black/[0.06] bg-white opacity-55' : 'border-[var(--lko-gold)]/50 bg-white hover:border-[var(--lko-gold)]'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-xl",
                            "aria-hidden": true,
                            children: vdef.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/FleetBlock.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-[13px] font-extrabold text-[var(--lko-ink)]",
                                    children: [
                                        "Run to ",
                                        dest?.shortName ?? gig.toId,
                                        gig.rainPremium && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-1.5 rounded-full bg-[var(--lko-gold)]/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]",
                                            children: "rain pay"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/FleetBlock.tsx",
                                            lineNumber: 93,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/FleetBlock.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                    children: blocked ? reason : `Your ${vdef.short} · ${gig.distanceKm.toFixed(1)} km · ${gig.minutes} min · fuel −${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(gig.fuel)}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/FleetBlock.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/FleetBlock.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "shrink-0 text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block text-sm font-extrabold tabular-nums text-[var(--lko-green-deep)]",
                                    children: [
                                        "+",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(gig.payout)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/FleetBlock.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block text-[10px] font-bold tabular-nums text-[var(--lko-ink-soft)]",
                                    children: [
                                        "−",
                                        gig.energyCost,
                                        " energy"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/FleetBlock.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/FleetBlock.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this)
                    ]
                }, gig.id, true, {
                    fileName: "[project]/src/components/game/FleetBlock.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this);
            }),
            player.vehicles.length > 0 && gigs.length > 0 && !atPark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                        name: "lock",
                        size: 11
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FleetBlock.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    " The board opens when you stand inside the Motor Park."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FleetBlock.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/FleetBlock.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/FestivalPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FestivalPanel",
    ()=>FestivalPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — FestivalPanel (M10: THE LIVING CALENDAR)
 * -------------------------------------------------------
 * The venue block inside the shared LocationSheet: today's festival
 * attendance, the Regatta's crews + bookie, the ram market + meat
 * sharing, the wedding's gift table (with aso-ebi respect), and the
 * paving pool's tiers. Every naira moves through the store's festival
 * actions — this panel only reads the pure gates and renders honest
 * buttons.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
/**
 * F4 FIX 6 — festival length by id, mirroring calendar.ts:festivalDefsForYear.
 * The FestivalDay shape exposes daysLeft but not len; the day-festivals are
 * single-day except the Eid pair (2d), the Regatta (2d) and Detty December
 * (yearDays − dettyStart + 1). Numbers come straight from FESTIVALS.anchors
 * so a future anchor change cannot desync this label.
 */ function festivalLenFor(id) {
    switch(id){
        case 'eid-fitr':
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors.eidFitrDays;
        case 'regatta':
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors.regattaDays;
        case 'eid-kabir':
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors.eidKabirDays;
        case 'detty':
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors.dettyStart + 1;
        default:
            return 1;
    }
}
function FestivalPanel({ location }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.calendar);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.account);
    const attendFestival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.attendFestival);
    const buyRam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.buyRam);
    const shareMeat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.shareMeat);
    const sponsorBoat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.sponsorBoat);
    const betBoat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.betBoat);
    const attendWedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.attendWedding);
    const contributePaving = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.contributePaving);
    const day = world.day;
    const standingHere = world.currentLocation === location.id;
    const festival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["festivalForDay"])(day);
    /* F4 FIX 6 — the day-label law. calendar.ts:192 returns daysLeft = len − i
     with i the 0-based live index, so the live day number is len − daysLeft + 1
     (the old "day ${daysLeft} to go" mislabelled live day 1 of a multi-day fest
     as "day 2 to go"). daysLeft is 1 on the final day → "day len of len";
     daysLeft can never be 0 out of festivalForDay (i < len), but if a future
     law ever emits 0 the clamp below treats it as the final day (day = len).
     Single-day festivals keep the "— today" copy. */ const festivalLen = festival ? festivalLenFor(festival.id) : 1;
    const festivalDay = Math.min(festivalLen, Math.max(1, festivalLen - (festival?.daysLeft ?? 0) + 1));
    const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weddingForCycle"])(day);
    const ramDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ramMarketDayIndex"])(day);
    const year = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yearOf"])(day);
    const atFestivalVenue = !!festival && festival.venueId === location.id;
    const atWeddingVenue = wedding.isToday && wedding.venueId === location.id;
    const atRamMarket = ramDay > 0 && location.id === 'kpata-market';
    const atPaving = !!calendar.paving && calendar.paving.zoneId === location.id;
    const nothingHere = !atFestivalVenue && !atWeddingVenue && !atRamMarket && !atPaving;
    if (nothingHere) return null;
    const festivalGate = atFestivalVenue ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAttendFestival"])(calendar, day, world.currentLocation) : null;
    const weddingGate = atWeddingVenue ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAttendWedding"])(calendar, world.currentLocation, wedding) : null;
    const ramGate = atRamMarket ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canBuyRam"])(day, world.currentLocation, player.cash) : null;
    const pavingGate = atPaving ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canContributePaving"])(calendar, day, world.currentLocation) : null;
    const hasAsoEbi = calendar.asoEbi.includes(wedding.id);
    /* travelling eyes: the venue is elsewhere — show the honest pointer */ if (!standingHere) {
        const here = atFestivalVenue ? festival : atWeddingVenue ? {
            icon: '💍',
            name: `${wedding.couple} wedding`
        } : atRamMarket ? {
            icon: '🐏',
            name: 'Ram market'
        } : {
            icon: '🛣️',
            name: 'Paving project'
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-testid": "festival-here-hint",
            className: "mt-3 rounded-xl border border-[#8a5a00]/20 bg-[#fff8ec] px-3 py-2 text-[11px] font-bold text-[#8a5a00]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    "aria-hidden": true,
                    children: here.icon
                }, void 0, false, {
                    fileName: "[project]/src/components/game/FestivalPanel.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this),
                " ",
                here.name,
                " dey here — travel first to join."
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/FestivalPanel.tsx",
            lineNumber: 106,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 space-y-2",
        "data-testid": "festival-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label",
                children: "The Calendar"
            }, void 0, false, {
                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            festival && atFestivalVenue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#8a5a00]/25 bg-gradient-to-r from-[#fff8ec] to-[#fdeecd] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#8a5a00]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                children: festival.icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            " ",
                            festival.name,
                            " ",
                            festivalLen > 1 ? `— day ${festivalDay} of ${festivalLen}` : '— today'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[11px] font-semibold text-[#4a3200]",
                        children: festival.note
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "festival-attend",
                        disabled: !festivalGate?.ok,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            attendFestival();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#ffd166] px-3 py-2 text-[12px] font-extrabold text-[#4a3200] disabled:opacity-40",
                        children: festivalGate?.ok ? `Join the celebration (mood +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.mood}${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.repFestivals.includes(festival.id) ? `, rep +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.rep}` : ''}, naira spray)` : festivalGate?.why ?? '…'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this),
            festival?.id === 'regatta' && atFestivalVenue && standingHere && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                        children: [
                            "🚤 The crews — sponsor one for ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorFee)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this),
                    (()=>{
                        const sponsoredThisYear = calendar.sponsored.find((s)=>s.year === year);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 grid grid-cols-2 gap-1.5",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["regattaTeamsFor"])(year).map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `regatta-team-${team.toLowerCase().replace(/[^a-z]+/g, '-')}`,
                                    disabled: !!sponsoredThisYear || player.cash < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorFee,
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        sponsorBoat(team);
                                    },
                                    className: `lko-press rounded-lg px-2 py-1.5 text-[10.5px] font-extrabold disabled:opacity-40 ${sponsoredThisYear?.teamId === team ? 'bg-[#0c4a6e] text-white' : 'bg-white text-[#0c4a6e] shadow-sm'}`,
                                    children: sponsoredThisYear?.teamId === team ? `★ ${team}` : team
                                }, team, false, {
                                    fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                    lineNumber: 146,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/FestivalPanel.tsx",
                            lineNumber: 144,
                            columnNumber: 15
                        }, this);
                    })(),
                    festival.daysLeft === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors.regattaDays && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                                children: [
                                    "🎲 Bookie — race-eve stakes (",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].betOdds,
                                    "× if your boat carries the day)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 166,
                                columnNumber: 15
                            }, this),
                            (()=>{
                                const bet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canBet"])(calendar, day, world.currentLocation, account.ageBand);
                                const staked = calendar.bets.find((b)=>b.year === year);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1.5 flex gap-1.5",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].betTiers.map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `bet-tier-${tier}`,
                                            disabled: !bet.ok || player.cash < tier || !!staked,
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                betBoat(staked?.teamId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["regattaTeamsFor"])(year)[0], tier);
                                            },
                                            className: "lko-press flex-1 rounded-lg bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#0c4a6e] shadow-sm disabled:opacity-40",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                                        }, tier, false, {
                                            fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                            lineNumber: 175,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                    lineNumber: 173,
                                    columnNumber: 19
                                }, this);
                            })(),
                            !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canBet"])(calendar, day, world.currentLocation, account.ageBand).ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10px] font-bold text-[#0c4a6e]/70",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canBet"])(calendar, day, world.currentLocation, account.ageBand).why
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 192,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 165,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                lineNumber: 139,
                columnNumber: 9
            }, this),
            atRamMarket && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#9a3412]/20 bg-[#fff7ed] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]",
                        children: [
                            "🐏 Ram market — day ",
                            ramDay,
                            " · one ram = ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].meatPacksPerRam,
                            " meat packs"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "ram-buy",
                        disabled: !ramGate?.ok,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            buyRam();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#ea580c] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: ramGate?.ok ? `Buy the ram — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ramPriceFor"])(day))}` : ramGate?.why ?? '…'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this),
                    calendar.meatPacks > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inMeatSeason"])(day) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]",
                                children: [
                                    "🍖 Share the meat (",
                                    calendar.meatPacks,
                                    " pack",
                                    calendar.meatPacks === 1 ? '' : 's',
                                    " left) — +",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].meatShareFamiliarity,
                                    " familiarity each"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 218,
                                columnNumber: 15
                            }, this),
                            (()=>{
                                const paddies = Object.keys(player.relationships).filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPC_BY_ID"][id]);
                                const shareable = paddies.filter((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canShareMeat"])(calendar, day, id).ok);
                                if (paddies.length === 0) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-[10.5px] font-bold text-[#9a3412]/70",
                                        children: "Make friends first — meat follows familiarity."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                        lineNumber: 225,
                                        columnNumber: 26
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1.5 flex flex-wrap gap-1.5",
                                    children: paddies.slice(0, 8).map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `share-meat-${id}`,
                                            disabled: !shareable.includes(id),
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                shareMeat(id);
                                            },
                                            className: "lko-press rounded-full bg-white px-2.5 py-1 text-[10.5px] font-extrabold text-[#9a3412] shadow-sm disabled:opacity-35",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPC_BY_ID"][id].name
                                        }, id, false, {
                                            fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                            lineNumber: 230,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                    lineNumber: 228,
                                    columnNumber: 19
                                }, this);
                            })()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this),
            wedding.isToday && atWeddingVenue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#9d174d]/20 bg-[#fdf2f8] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#9d174d]",
                        children: [
                            "💍 ",
                            wedding.couple,
                            " — the canopies dey up ",
                            hasAsoEbi ? '· aso-ebi dey body you ✔' : '· you no buy aso-ebi'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-1.5",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingGiftTiers.map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `wedding-gift-${tier}`,
                                disabled: !weddingGate?.ok || player.cash < tier,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    attendWedding(tier);
                                },
                                className: "lko-press flex-1 rounded-lg bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#9d174d] shadow-sm disabled:opacity-40",
                                children: [
                                    "Gift ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                                ]
                            }, tier, true, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 259,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    weddingGate && !weddingGate.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10px] font-bold text-[#9d174d]/70",
                        children: weddingGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 273,
                        columnNumber: 46
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                lineNumber: 253,
                columnNumber: 9
            }, this),
            calendar.paving && atPaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-black/[0.06] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "🛣️ Paving pool"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tabular-nums",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(calendar.paving.pool),
                                    " / ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-gradient-to-r from-[#86c99b] to-[var(--lko-green)] transition-[width] duration-500",
                            style: {
                                width: `${Math.min(100, Math.round(calendar.paving.pool / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget * 100))}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/FestivalPanel.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 286,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-1.5",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTiers.map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `paving-give-${tier}`,
                                disabled: !pavingGate?.ok || player.cash < tier,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    contributePaving(tier);
                                },
                                className: "lko-press flex-1 rounded-lg bg-[var(--lko-gold)] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40",
                                children: [
                                    "Drop ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                                ]
                            }, tier, true, {
                                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                                lineNumber: 294,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this),
                    pavingGate && !pavingGate.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        children: pavingGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/FestivalPanel.tsx",
                        lineNumber: 308,
                        columnNumber: 44
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/FestivalPanel.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/FestivalPanel.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/RiversPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RiversPanel",
    ()=>RiversPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — RiversPanel (M11: THE RIVERS AWAKE)
 * --------------------------------------------------
 * The river block inside the shared LocationSheet AND the 2D map's own
 * inline sheet: Crusher sand on the Patti road, sandbag segments in the
 * cut zones, the toll tier + the bowl, the fishermen's canoe + the day's
 * ferry board at the jetty, the ride fares across the water, and the
 * cold-room rescue tiers. Every naira moves through the store's river
 * actions — this panel only reads the pure gates and renders honest
 * buttons.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function RiversPanel({ location }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const rivers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.rivers);
    const buySand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.buySand);
    const laySegment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.laySegment);
    const setTollTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.setTollTier);
    const collectTolls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.collectTolls);
    const buyCanoe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.buyCanoe);
    const takeFerry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.takeFerry);
    const runFerryGig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.runFerryGig);
    const contributeRescue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.contributeRescue);
    const day = world.day;
    const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverLevelFor"])(day);
    const standingHere = world.currentLocation === location.id;
    const cut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cutZonesFor"])(day);
    const isSandVendor = location.id === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sandVendorZone;
    const isJetty = location.id === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JETTY_ID"];
    const isCutZone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zoneCut"])(day, location.id);
    const rescueHere = !!rivers.rescue && rivers.rescue.zoneId === location.id;
    const nothingHere = !isSandVendor && !isJetty && !isCutZone && !rescueHere && level <= 0.01;
    if (nothingHere) return null;
    const w = rivers.walkways[location.id];
    const left = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["segmentsLeft"])(rivers, location.id);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["walkwayOpen"])(rivers, location.id);
    const layGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canLaySegment"])(rivers, day, location.id, world.currentLocation, rivers.sandbags);
    const rescueGate = rescueHere ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canContributeRescue"])(rivers, day, world.currentLocation) : null;
    const gigs = isJetty ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["availableFerryGigs"])(rivers, day, cut) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 space-y-2",
        "data-testid": "rivers-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label",
                children: "The River"
            }, void 0, false, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            isSandVendor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#92400e]/20 bg-[#fffbeb] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#92400e]",
                        children: [
                            "⛰️ The Crusher — ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sackPrice),
                            " a sack"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[#92400e]/80",
                        children: [
                            "Sandbags hold the walkways when the Niger comes. You carry ",
                            rivers.sandbags,
                            " sack",
                            rivers.sandbags === 1 ? '' : 's',
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-1.5",
                        children: [
                            1,
                            5
                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `buy-sand-${n}`,
                                disabled: player.cash < n * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sackPrice,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    buySand(n);
                                },
                                className: "lko-press flex-1 rounded-lg bg-[#d97706] px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40",
                                children: [
                                    "Buy ",
                                    n,
                                    " sack",
                                    n > 1 ? 's' : '',
                                    " — ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(n * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sackPrice)
                                ]
                            }, n, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this),
            isCutZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                        children: [
                            "🌊 The water dey here — ",
                            (level * 100).toFixed(0),
                            "% of the river dey flow"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this),
                    !open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-semibold text-[#0c4a6e]/80",
                                children: [
                                    "Walkway: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].segments[location.id] - left,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].segments[location.id],
                                    " segments laid (",
                                    left,
                                    " left, ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment,
                                    " sacks each)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "lay-segment",
                                disabled: !layGate.ok || player.needs.energy < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].layEnergy,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    laySegment();
                                },
                                className: "lko-press mt-2 w-full rounded-lg bg-[#0c4a6e] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                                children: layGate.ok ? `Lay one segment — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment} sacks + ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].layEnergy} energy` : layGate.why
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 110,
                                columnNumber: 15
                            }, this),
                            rivers.sandbags < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10px] font-bold text-[#0c4a6e]/70",
                                children: [
                                    "You carry ",
                                    rivers.sandbags,
                                    " sack",
                                    rivers.sandbags === 1 ? '' : 's',
                                    " — the Crusher dey sell on the Patti road."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 124,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true),
                    open && w && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                                children: [
                                    "🎫 Your walkway dey open — toll ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[w.tollTier] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[0]),
                                    " · bowl ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(w.pot)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 132,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 flex gap-1.5",
                                children: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers.map((tier, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `toll-tier-${tier}`,
                                            disabled: w.tollTier === i,
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                setTollTier(i);
                                            },
                                            className: `lko-press flex-1 rounded-lg px-2 py-1.5 text-[11px] font-extrabold disabled:opacity-100 ${w.tollTier === i ? 'bg-[#0c4a6e] text-white' : 'bg-white text-[#0c4a6e] shadow-sm'}`,
                                            children: w.tollTier === i ? `★ ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)}` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                                        }, tier, false, {
                                            fileName: "[project]/src/components/game/RiversPanel.tsx",
                                            lineNumber: 137,
                                            columnNumber: 19
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "collect-tolls",
                                        disabled: w.pot <= 0,
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            collectTolls();
                                        },
                                        className: "lko-press flex-1 rounded-lg bg-[var(--lko-gold)] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40",
                                        children: [
                                            "Collect ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(w.pot)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                                        lineNumber: 152,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 135,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 131,
                        columnNumber: 13
                    }, this),
                    location.id !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutReturnId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "ferry-ride-back",
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            takeFerry(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutReturnId);
                        },
                        className: "lko-press mt-2 w-full rounded-lg border border-[#0c4a6e]/30 bg-white px-3 py-2 text-[12px] font-extrabold text-[#0c4a6e]",
                        children: [
                            "🛶 Take the canoe back — ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ferryFareBetween"])(location.id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutReturnId, day))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 167,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this),
            isJetty && cut.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                        children: "🛶 The jetty — the canoes dey wait"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    !rivers.canoe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "buy-canoe",
                        disabled: player.cash < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].canoeCost,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            buyCanoe();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#0c4a6e] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: [
                            "Buy the fishermen's canoe — ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].canoeCost),
                            " (unlock the ferry gigs)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 188,
                        columnNumber: 13
                    }, this),
                    gigs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                                children: [
                                    "🚣 Today's boatloads",
                                    rivers.canoe ? '' : ' (need a canoe)'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, this),
                            gigs.map((gig)=>{
                                const dest = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][gig.toId];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `ferry-gig-${gig.toId}`,
                                    disabled: !rivers.canoe || player.needs.energy < gig.energyCost,
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        runFerryGig(gig.id);
                                    },
                                    className: "lko-press mt-1.5 flex min-h-[48px] w-full items-center gap-2.5 rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-left disabled:opacity-45",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block truncate text-[12.5px] font-extrabold leading-tight",
                                                    children: [
                                                        "Boatload to ",
                                                        dest?.shortName ?? gig.toId
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/RiversPanel.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                    children: "surge price — the water dey pay"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/RiversPanel.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/RiversPanel.tsx",
                                            lineNumber: 218,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex shrink-0 flex-col items-end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "lko-num text-[12px] font-extrabold text-[var(--lko-green)]",
                                                    children: [
                                                        "+",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(gig.payout)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/RiversPanel.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                                    children: [
                                                        "−",
                                                        gig.energyCost,
                                                        " energy"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/RiversPanel.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/RiversPanel.tsx",
                                            lineNumber: 222,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, gig.id, true, {
                                    fileName: "[project]/src/components/game/RiversPanel.tsx",
                                    lineNumber: 208,
                                    columnNumber: 19
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]",
                        children: "Ride across"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex flex-col gap-1.5",
                        children: cut.map((zoneId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `ferry-ride-${zoneId}`,
                                disabled: player.cash < (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ferryFareBetween"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JETTY_ID"], zoneId, day),
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    takeFerry(zoneId);
                                },
                                className: "lko-press flex min-h-[44px] items-center justify-between rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-left disabled:opacity-45",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate text-[12px] font-extrabold text-[var(--lko-ink)]",
                                        children: [
                                            "🛶 To ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.shortName ?? zoneId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num shrink-0 text-[12px] font-extrabold text-[var(--lko-terra)]",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ferryFareBetween"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JETTY_ID"], zoneId, day))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                                        lineNumber: 245,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, zoneId, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 183,
                columnNumber: 9
            }, this),
            isJetty && cut.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-black/[0.06] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: "🛶 The jetty — the river dey sleep"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "Dry season. The fishermen dey mend nets — but a smart hustler buys the canoe BEFORE the water comes."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 260,
                        columnNumber: 11
                    }, this),
                    !rivers.canoe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "buy-canoe-dry",
                        disabled: player.cash < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].canoeCost,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            buyCanoe();
                        },
                        className: "lko-press mt-2 w-full rounded-lg border border-[#0c4a6e]/30 bg-[#f0f9ff] px-3 py-2 text-[12px] font-extrabold text-[#0c4a6e] disabled:opacity-40",
                        children: [
                            "Buy the fishermen's canoe — ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].canoeCost)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 264,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 256,
                columnNumber: 9
            }, this),
            rescueHere && rivers.rescue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#9a3412]/20 bg-[#fff7ed] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "🧊 Cold-room rescue bowl"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tabular-nums",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(rivers.rescue.pool),
                                    " / ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 284,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-gradient-to-r from-[#fdba74] to-[#ea580c] transition-[width] duration-500",
                            style: {
                                width: `${Math.min(100, Math.round(rivers.rescue.pool / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget * 100))}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/RiversPanel.tsx",
                            lineNumber: 289,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-1.5",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.tiers.map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `rescue-give-${tier}`,
                                disabled: !rescueGate?.ok || player.cash < tier,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    contributeRescue(tier);
                                },
                                className: "lko-press flex-1 rounded-lg bg-[#ea580c] px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40",
                                children: [
                                    "Drop ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                                ]
                            }, tier, true, {
                                fileName: "[project]/src/components/game/RiversPanel.tsx",
                                lineNumber: 296,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this),
                    rescueGate && !rescueGate.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10px] font-bold text-[#9a3412]/70",
                        children: rescueGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/RiversPanel.tsx",
                        lineNumber: 310,
                        columnNumber: 44
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this),
            !standingHere && isCutZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] px-3 py-2 text-[11px] font-bold text-[#0c4a6e]",
                children: [
                    "🌊 The water dey here — take the canoe from the Motor Park jetty",
                    open ? ', or waka the sandbag walkway' : '',
                    "."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/RiversPanel.tsx",
                lineNumber: 316,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/RiversPanel.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/LadderPanels.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EducationPanel",
    ()=>EducationPanel,
    "HousingPanel",
    ()=>HousingPanel,
    "JapaPanel",
    ()=>JapaPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — LadderPanels (M12: THE LADDER)
 * ---------------------------------------------
 * The venue blocks inside the shared LocationSheet AND the 2D map's own
 * inline sheet: the FUL desks (enroll / lecture / exam / convocation),
 * the housing desk (the rent book, the wahala, the ladder, the
 * furnishing), and the JAPA desks (GRA's four counters, the Ganaja
 * agent, the Motor Park send-off) + the MOPOL detail. Every naira moves
 * through the store's ladder actions — these panels only read the pure
 * gates and render honest buttons.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function EducationPanel({ location }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.education);
    const enrollFul = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.enrollFul);
    const attendLecture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.attendLecture);
    const sitExam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.sitExam);
    const attendConvocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.attendConvocation);
    const day = world.day;
    const atUniversity = world.currentLocation.startsWith('ful-');
    const E = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].education;
    const enrollGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canEnroll"])(education, player.level);
    const lectureGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAttendLecture"])(education, day, atUniversity);
    const examGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canSitExam"])(education, day, atUniversity);
    const convGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAttendConvocation"])(education, day, atUniversity);
    const semDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["semesterDayOf"])(education, day);
    const nothing = education.graduated && education.convocationAttended;
    if (nothing) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 space-y-2",
        "data-testid": "education-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label",
                children: "The Ladder — FUL"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            !education.enrolled && !education.graduated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]",
                        children: [
                            "🎓 Enroll — ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(E.enrollFee),
                            " a semester"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[#1d5c8a]/80",
                        children: [
                            E.semesterDays,
                            "-day semesters · ",
                            E.lecturesNeeded,
                            " lectures · ",
                            E.semestersToGraduate,
                            " semesters to the certificate. The career desks dey wait at the top."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "ful-enroll",
                        disabled: !enrollGate.ok || player.cash < E.enrollFee,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            enrollFul();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: enrollGate.ok ? `Enroll — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(E.enrollFee)}` : enrollGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, this),
            education.enrolled && !education.graduated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]",
                        children: [
                            "📚 Semester ",
                            education.semester,
                            "/",
                            E.semestersToGraduate,
                            " — lecture day ",
                            semDay
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[#1d5c8a]/80",
                        children: [
                            "Lectures ",
                            education.lecturesDone,
                            "/",
                            E.lecturesNeeded,
                            " · exam reads smart + lectures (the honest bar: ",
                            E.examPassScore,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLectureWindow"])(education, day) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isStrikeDay"])(education, day) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "ful-lecture",
                        disabled: !lectureGate.ok || player.needs.energy < 8,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            attendLecture();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: lectureGate.ok ? `Attend the lecture (smart +${E.lectureSmartXp}, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(E.lectureStipend)})` : lectureGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 114,
                        columnNumber: 13
                    }, this),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isStrikeDay"])(education, day) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        "data-testid": "ful-strike",
                        className: "mt-2 rounded-lg bg-[#fff7ed] px-3 py-2 text-[11px] font-extrabold text-[#9a3412]",
                        children: [
                            "🚧 ASUU strike dey run — the gate don lock. ",
                            lectureGate.why
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 127,
                        columnNumber: 13
                    }, this),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isExamWindow"])(education, day) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "ful-exam",
                        disabled: !examGate.ok,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            sitExam();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#9a3412] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: examGate.ok ? 'Sit the exam — the work decides' : examGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 132,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this),
            education.graduated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]",
                        children: [
                            "🎓 ",
                            education.convocationAttended ? 'CERTIFICATE IN HAND' : 'CONVOCATION — the gown dey wait'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this),
                    !education.convocationAttended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "ful-convocation",
                        disabled: !convGate.ok,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            attendConvocation();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: convGate.ok ? `Collect the certificate (rep +${E.graduateRep}, mood +${E.graduateMood})` : convGate.why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 153,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 148,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LadderPanels.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
function HousingPanel({ location }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const housing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.housing);
    const payRent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.payRent);
    const buyProperty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.buyProperty);
    const furnishHome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.furnishHome);
    const resolveWahala = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.resolveWahala);
    const atHome = world.currentLocation === 'home';
    const prop = housing.owned ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["propertyFor"])(housing.owned) : null;
    const rentGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPayRent"])(housing, player.cash);
    const wahalaGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canResolveWahala"])(housing, player.cash);
    const comfort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["homeComfort"])(housing);
    const currentTier = housing.owned ? housing.furnishing[housing.owned] ?? 0 : 0;
    const furnishGate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canFurnish"])(housing, currentTier + 1);
    const housingForSale = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROPERTIES"].filter((p)=>p.locationId === location.id);
    const nothing = !atHome && housingForSale.length === 0;
    if (nothing) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 space-y-2",
        "data-testid": "housing-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label",
                children: "The Ladder — Housing"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            atHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-black/[0.06] bg-white p-3",
                children: prop ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#14532d]",
                            children: [
                                "🏠 ",
                                prop.name,
                                " — YOURS · comfort ",
                                comfort
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 203,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                            children: [
                                "No rent again. Every sleep dey restore +",
                                comfort * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].housing.sleepEnergyPerComfort,
                                " extra energy."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 206,
                            columnNumber: 15
                        }, this),
                        currentTier < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].housing.furnishTiers.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": `furnish-tier-${currentTier + 1}`,
                            disabled: !furnishGate.ok || player.cash < furnishGate.cost,
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                furnishHome(currentTier + 1);
                            },
                            className: "lko-press mt-2 w-full rounded-lg bg-[#14532d] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                            children: furnishGate.ok ? `Furnish tier ${currentTier + 1} — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].housing.furnishTiers.find((f)=>f.tier === currentTier + 1)?.label} (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(furnishGate.cost)})` : furnishGate.why
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 210,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "🔑 The rent book"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                                    lineNumber: 228,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "tabular-nums",
                                    children: [
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(Math.round(housing.rentOwed)),
                                        " due"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                                    lineNumber: 229,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 227,
                            columnNumber: 15
                        }, this),
                        housing.wahala && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            "data-testid": "housing-wahala",
                            className: "mt-1 rounded-lg bg-[#fff7ed] px-2.5 py-1.5 text-[10.5px] font-bold text-[#9a3412]",
                            children: [
                                "⚠️ ",
                                housing.wahala.note
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 232,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 flex gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": "pay-rent",
                                    disabled: !rentGate.ok,
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        payRent('home');
                                    },
                                    className: "lko-press flex-1 rounded-lg bg-[#14532d] px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40",
                                    children: rentGate.ok ? `Pay rent — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(rentGate.amount)}` : rentGate.why
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                                    lineNumber: 237,
                                    columnNumber: 17
                                }, this),
                                housing.wahala && housing.wahala.cost > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": "resolve-wahala",
                                    disabled: !wahalaGate.ok,
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        resolveWahala();
                                    },
                                    className: "lko-press flex-1 rounded-lg bg-[var(--lko-gold)] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40",
                                    children: [
                                        "Settle wahala — ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(wahalaGate.cost)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                                    lineNumber: 249,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 236,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, this),
            housingForSale.map((p)=>{
                const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canBuyProperty"])(housing, p.id, player.level, player.cash);
                const owned = housing.owned === p.id;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-black/[0.06] bg-white p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "🏠 ",
                                        p.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "tabular-nums",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(p.price)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                                    lineNumber: 275,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                            children: [
                                "Level ",
                                p.level,
                                " · comfort ",
                                p.comfort,
                                " · no more rent when you own"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 277,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": `buy-property-${p.id}`,
                            disabled: owned || !gate.ok,
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                buyProperty(p.id);
                            },
                            className: "lko-press mt-2 w-full rounded-lg bg-[var(--lko-green)] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                            children: owned ? '★ You own this one' : gate.ok ? `Buy — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(p.price)}` : gate.why
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/LadderPanels.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this)
                    ]
                }, p.id, true, {
                    fileName: "[project]/src/components/game/LadderPanels.tsx",
                    lineNumber: 272,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LadderPanels.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
/* --------------------------------- japa panel -------------------------------- */ const STEP_META = {
    nimc: {
        label: 'NIMC slip',
        emoji: '🪪'
    },
    passport: {
        label: 'Passport',
        emoji: '📜'
    },
    clearance: {
        label: 'KGIRS clearance',
        emoji: '🧾'
    },
    police: {
        label: 'Police certificate',
        emoji: '👮'
    },
    flight: {
        label: 'The send-off',
        emoji: '✈️'
    }
};
function JapaPanel({ location }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const japa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.japa);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.account);
    const requestNimc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.requestNimc);
    const collectNimc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.collectNimc);
    const requestPassport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.requestPassport);
    const collectPassport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.collectPassport);
    const tryAgent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.tryAgent);
    const kgirsClearance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.kgirsClearance);
    const policeCertificate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.policeCertificate);
    const takeFlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.takeFlight);
    const runEscort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.runEscort);
    const day = world.day;
    const J = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].japa;
    const atGrades = location.id === 'government-area' && world.currentLocation === 'government-area';
    const atGanaja = location.id === 'ganaja-junction' && world.currentLocation === 'ganaja-junction';
    const atPark = location.id === 'transport-area' && world.currentLocation === 'transport-area';
    const warrant = !!civic && civic.kgirs.warrant;
    const escortGate = civic ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canRunEscort"])(japa, day, warrant, atGrades) : {
        ok: false,
        why: ''
    };
    const escortLive = civic ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["escortAvailable"])(japa, day, warrant) : false;
    const gradesRows = atGrades ? [
        {
            step: 'nimc',
            gate: japa.nimcReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'nimc') ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canCollectNimc"])(japa, day, atGrades) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canRequestNimc"])(japa, player.level, atGrades),
            label: japa.nimcReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'nimc') ? `Collect the NIMC slip (queue: ${japa.nimcReadyDay > day ? `${japa.nimcReadyDay - day}d` : 'ready'})` : `Request the NIMC slip — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(J.nimcFee)}`,
            run: ()=>japa.nimcReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'nimc') ? collectNimc() : requestNimc(),
            testId: japa.nimcReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'nimc') ? 'japa-collect-nimc' : 'japa-request-nimc'
        },
        {
            step: 'passport',
            gate: japa.passportReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'passport') ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canCollectPassport"])(japa, day, atGrades) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canRequestPassport"])(japa, player.cash, atGrades),
            label: japa.passportReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'passport') ? `Collect the passport (${japa.passportReadyDay > day ? `${japa.passportReadyDay - day}d to print` : 'ready'})` : `Apply — official window (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(J.passportFee)}, ${J.passportQueueDays} days)`,
            run: ()=>japa.passportReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'passport') ? collectPassport() : requestPassport(),
            testId: japa.passportReadyDay > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'passport') ? 'japa-collect-passport' : 'japa-request-passport'
        },
        {
            step: 'clearance',
            gate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canClearKgirs"])(japa, warrant, atGrades),
            label: 'KGIRS clearance — the taxman dey sign',
            run: kgirsClearance,
            testId: 'japa-clearance'
        },
        {
            step: 'police',
            gate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canGetPoliceCertificate"])(japa, civic?.police.fines ?? 0, player.cash, atGrades),
            label: `Police character certificate — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(J.policeFee)}`,
            run: policeCertificate,
            testId: 'japa-police'
        }
    ] : [];
    const nothing = japa.flownDay > 0 || !atGrades && !atGanaja && !atPark;
    if (nothing) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 space-y-2",
        "data-testid": "japa-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label",
                children: "The Ladder — JAPA file"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1.5",
                children: [
                    'nimc',
                    'passport',
                    'clearance',
                    'police',
                    'flight'
                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, s) || s === 'flight' && japa.flownDay > 0 ? 'bg-[#ecfdf5] text-[#14532d]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                        children: [
                            STEP_META[s].emoji,
                            " ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, s) ? `✓ ${STEP_META[s].label}` : STEP_META[s].label
                        ]
                    }, s, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            atGrades && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-black/[0.06] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: "🏛️ The desks"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 363,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex flex-col gap-1.5",
                        children: gradesRows.map((row)=>{
                            const done = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, row.step);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": row.testId,
                                disabled: done || !row.gate.ok,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    row.run();
                                },
                                className: "lko-press flex min-h-[44px] items-center justify-between rounded-lg border border-black/[0.05] bg-[var(--lko-cream)] px-2.5 py-1.5 text-left disabled:opacity-45",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1 truncate text-[11.5px] font-extrabold text-[var(--lko-ink)]",
                                        children: done ? `✓ ${STEP_META[row.step].label} — in the file` : row.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                                        lineNumber: 378,
                                        columnNumber: 19
                                    }, this),
                                    !done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                        children: row.gate.ok ? '' : row.gate.why.slice(0, 42)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                                        lineNumber: 381,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, row.step, true, {
                                fileName: "[project]/src/components/game/LadderPanels.tsx",
                                lineNumber: 368,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this),
                    japa.policeShifts > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 rounded-lg bg-[#7f1d1d]/[0.06] px-2.5 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#7f1d1d]",
                                children: [
                                    "👮 MOPOL detail — ",
                                    japa.policeShifts,
                                    "/",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].mopol.shiftsToUnlock,
                                    " police shifts of trust"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/LadderPanels.tsx",
                                lineNumber: 389,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "mopol-escort",
                                disabled: !escortGate.ok,
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    runEscort();
                                },
                                className: "lko-press mt-1.5 w-full rounded-lg bg-[#7f1d1d] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                                children: escortGate.ok ? `Run the VIP escort — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].mopol.escortPay)} + the siren ×${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].mopol.sirenMinutesMult}` : escortLive ? escortGate.why : `The convoy moves every ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].mopol.escortEvery} days`
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LadderPanels.tsx",
                                lineNumber: 392,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 388,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 362,
                columnNumber: 9
            }, this),
            atGanaja && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'passport') && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPaper"])(japa, 'nimc') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#9a3412]/20 bg-[#fff7ed] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]",
                        children: '🕶️ The agent — "express passport, half price"'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 413,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[#9a3412]/80",
                        children: [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(J.agentFee),
                            " today, the book today... maybe. The street sabi ",
                            japa.agentTries > 0 ? `his record: ${japa.agentTries} tries, ${japa.agentScams} wash` : 'am well — ask around',
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 416,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "japa-agent",
                        disabled: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canTryAgent"])(japa, player.cash, atGanaja).ok,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            tryAgent();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#ea580c] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canTryAgent"])(japa, player.cash, atGanaja).ok ? `Take the gamble — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(J.agentFee)}` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canTryAgent"])(japa, player.cash, atGanaja).why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 419,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 412,
                columnNumber: 9
            }, this),
            atPark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]",
                        children: "✈️ The send-off — the Abuja motor"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 436,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[10.5px] font-semibold text-[#1d5c8a]/80",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["papersComplete"])(japa) ? 'The file complete — the whole park go spray you.' : 'The motor dey wait for the complete file — the desks dey at GRA.'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 439,
                        columnNumber: 11
                    }, this),
                    japa.flownDay > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 rounded-lg bg-[#ecfdf5] px-3 py-2 text-[11px] font-extrabold text-[#14532d]",
                        children: "✓ You don JAPA — the remittance dey come, the village dey proud."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 443,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "japa-flight",
                        disabled: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canTakeFlight"])(japa, player.cash, atPark).ok || player.cash < J.ticketFee,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            takeFlight();
                        },
                        className: "lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canTakeFlight"])(japa, player.cash, atPark).ok ? `Take the send-off — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(J.ticketFee)} (rep +${J.repReward})` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canTakeFlight"])(japa, player.cash, atPark).why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LadderPanels.tsx",
                        lineNumber: 447,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LadderPanels.tsx",
                lineNumber: 435,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LadderPanels.tsx",
        lineNumber: 348,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/LocationSheet.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocActionBoard",
    ()=>LocActionBoard,
    "LocVibeLine",
    ()=>LocVibeLine,
    "LocationSheet",
    ()=>LocationSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — LocationSheet (shared, Stage 3.5)
 * ------------------------------------------------
 * The bottom-sheet location panel: description, activities, travel
 * confirmation rows. Extracted from the Stage 2 MapScreen so BOTH the
 * 2D map and the 3D world open the exact same panel — one interaction
 * language, one set of fares straight from calculateTravel().
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/kit.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locActions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/hustles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locVibes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locVibes.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BizBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/BizBlock.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FleetBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/FleetBlock.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FestivalPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/FestivalPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$RiversPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/RiversPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/LadderPanels.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
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
function TravelOptionRow({ plan, label, emoji, personal, disabled, disabledReason, onConfirm }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onConfirm,
        disabled: disabled,
        className: `lko-press flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left ${disabled ? 'cursor-not-allowed border-[var(--lko-line)] bg-black/[0.02] opacity-55' : personal ? 'border-[var(--lko-gold)]/45 bg-[var(--lko-gold-soft)]/30 hover:border-[var(--lko-gold)]' : 'border-[var(--lko-line)] bg-[var(--lko-surface)] hover:border-[var(--lko-green)]/50'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl",
                style: {
                    background: 'var(--lko-cream)'
                },
                "aria-hidden": true,
                children: emoji
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 64,
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
                                className: "ml-1.5 rounded-full bg-[var(--lko-gold)]/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]",
                                children: "fuel · no fare"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: disabled ? disabledReason : `${plan.minutes} min trip`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-sm font-extrabold tabular-nums text-[var(--lko-terra)]",
                        children: plan.cost === 0 ? 'Free' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(plan.cost)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-[11px] font-bold tabular-nums text-[#8a5a00]",
                        children: [
                            "−",
                            plan.energyCost,
                            " energy"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LocationSheet.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
/* ----------------------- G2 — the vibe line + action board -------------------
 * Rotating scene line (world.day % lines) + the location's real action board
 * from locActions.ts. Exported so BOTH detail surfaces (this shared sheet and
 * the 2D map / 3D HUD's own detail blocks) can render the exact same board
 * with one line. Doors fire the REAL store actions — nothing here invents a
 * mutation; rows whose honest door is contextual (Work tab, phone apps, the
 * world HUD panels) stay informational and say so.
 * -------------------------------------------------------------------------- */ const NEED_EFFECT_EMOJI = {
    health: '❤️',
    energy: '⚡',
    hunger: '🍲',
    mood: '🙂'
};
/* F4 FIX 9 — hustle-search honesty. locActions.ts puts a searchHustles door on
 * 10 G2 locations, but opportunities.ts:79-81 generates offers ONLY from
 * HUSTLES rows whose locationId matches, and all 20 hustles live at the 13
 * core ids — the affordance at the G2 spots was an always-dry search that
 * still burned its cooldown. Hide the row where no hustle data exists; it
 * stays intact at every location that actually has hustles. */ const LOCATIONS_WITH_HUSTLES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLES"].map((h)=>h.locationId));
function NeedsEffects({ effects }) {
    const parts = Object.keys(NEED_EFFECT_EMOJI).filter((k)=>effects[k] !== undefined && effects[k] !== 0).map((k)=>`${effects[k] > 0 ? '+' : ''}${effects[k]}${NEED_EFFECT_EMOJI[k]}`);
    if (!parts.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "shrink-0 text-[10px] font-bold tabular-nums text-[var(--lko-ink-soft)]",
        children: parts.join(' ')
    }, void 0, false, {
        fileName: "[project]/src/components/game/LocationSheet.tsx",
        lineNumber: 123,
        columnNumber: 10
    }, this);
}
function LocVibeLine({ locationId }) {
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const lines = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locVibes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOC_VIBES"][locationId];
    if (!lines?.length) return null;
    const vibe = lines[(world?.day ?? 0) % lines.length];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        "data-testid": "loc-vibe-line",
        className: "mt-2 rounded-xl bg-[var(--lko-gold-soft)]/25 px-3 py-2 text-[12px] italic leading-relaxed text-[var(--lko-ink-soft)]",
        children: [
            "“",
            vibe,
            "”"
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LocationSheet.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
function LocActionBoard({ locationId, isCurrent, onOpenWork, onClose }) {
    const actions = (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOC_ACTIONS"][locationId] ?? []).filter((a)=>a.door !== 'searchHustles' || LOCATIONS_WITH_HUSTLES.has(locationId));
    if (!actions.length) return null;
    const fire = (a)=>{
        const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
        if (a.door === 'rest' && (a.arg === 'nap' || a.arg === 'sleep')) s.rest(a.arg);
        else if (a.door === 'relaxIndoors' && (a.arg === 'tv' || a.arg === 'bath')) s.relaxIndoors(a.arg);
        else if (a.door === 'workout') s.workout();
        else if (a.door === 'study') s.study(a.label);
        else if (a.door === 'searchHustles') {
            s.searchHustles();
            // the found offers live on the Work board — ride the same deep-link
            // the work chips use instead of duplicating the board here
            onClose?.();
            onOpenWork?.();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "lko-label mb-1.5",
                children: "Things to do here"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                children: actions.map((a)=>{
                    const wired = a.kind === 'needs' && (a.door === 'rest' || a.door === 'relaxIndoors' || a.door === 'workout' || a.door === 'study');
                    const hustle = a.door === 'searchHustles';
                    const canFire = (wired || hustle) && isCurrent;
                    if (canFire) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                fire(a);
                            },
                            className: "lko-press flex min-h-[44px] items-center gap-2.5 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-surface)] px-3 py-1.5 text-left hover:border-[var(--lko-green)]/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base",
                                    style: {
                                        background: 'var(--lko-cream)'
                                    },
                                    "aria-hidden": true,
                                    children: a.emoji
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LocationSheet.tsx",
                                    lineNumber: 193,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[13px] font-extrabold text-[var(--lko-ink)]",
                                            children: a.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/LocationSheet.tsx",
                                            lineNumber: 197,
                                            columnNumber: 19
                                        }, this),
                                        a.effects && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: "honest shift · one clock slot"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/LocationSheet.tsx",
                                            lineNumber: 198,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/LocationSheet.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this),
                                a.effects && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedsEffects, {
                                    effects: a.effects
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/LocationSheet.tsx",
                                    lineNumber: 200,
                                    columnNumber: 31
                                }, this)
                            ]
                        }, a.key, true, {
                            fileName: "[project]/src/components/game/LocationSheet.tsx",
                            lineNumber: 185,
                            columnNumber: 15
                        }, this);
                    }
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-testid": `loc-action-${a.key}`,
                        className: "flex min-h-[44px] items-center gap-2.5 rounded-xl border border-[var(--lko-line)] bg-black/[0.015] px-3 py-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base",
                                style: {
                                    background: 'var(--lko-cream)'
                                },
                                "aria-hidden": true,
                                children: a.emoji
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 210,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: [
                                            a.label,
                                            a.kind === 'spend' && a.cost ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1.5 rounded-full bg-[var(--lko-terra)]/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[var(--lko-terra)]",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(a.cost)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                                lineNumber: 217,
                                                columnNumber: 21
                                            }, this) : null,
                                            a.door && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1.5 rounded-full bg-black/[0.05] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                                title: `rides the real ${a.door}() door`,
                                                children: [
                                                    a.door,
                                                    "()"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                                lineNumber: 222,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this),
                                    a.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[10px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                        children: a.note
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                                        lineNumber: 227,
                                        columnNumber: 28
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 213,
                                columnNumber: 15
                            }, this),
                            a.effects && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NeedsEffects, {
                                effects: a.effects
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 229,
                                columnNumber: 29
                            }, this)
                        ]
                    }, a.key, true, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 205,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            !isCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                children: [
                    "Travel here first — the live rows only fire when you are standing in ",
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][locationId]?.shortName ?? 'the spot',
                    "."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 235,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LocationSheet.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
function LocationSheet({ locationId, onClose, onOpenWork, onTravel }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const travel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.travel);
    const calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.calendar);
    const selected = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][locationId];
    const origin = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
    const isSelectedCurrent = selected?.id === origin.id;
    const isSelectedLocked = !!selected && player.level < selected.unlockLevel;
    // travel options for the selected destination — public modes + YOUR rides (M4)
    // M8 — fuel surge rides through: the sheet shows the black-market pump price
    // M10 — a paved destination rides the union's smooth road in the SAME numbers
    const plans = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!selected || isSelectedCurrent || isSelectedLocked) return [];
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
    if (!selected) return null;
    const confirmTravel = (transport)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        if (onTravel) onTravel(selected.id, transport);
        else travel(selected.id, transport);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetShell"], {
        label: `${selected.name} details`,
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
                        style: {
                            background: `${selected.color}1f`
                        },
                        "aria-hidden": true,
                        children: selected.emoji
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "lko-display text-lg leading-tight",
                                children: selected.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold italic text-[var(--lko-ink-soft)]",
                                children: [
                                    "“",
                                    selected.tagline,
                                    "”"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 298,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 288,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]",
                children: selected.description
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LocVibeLine, {
                locationId: selected.id
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 rounded-xl border border-[var(--lko-line)] bg-black/[0.02] p-4 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex items-center justify-center gap-1.5 text-sm font-extrabold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "lock",
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this),
                            " Not open to you yet"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 313,
                        columnNumber: 11
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
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 317,
                                columnNumber: 19
                            }, this),
                            " to unlock this part of Lokoja. You are Level ",
                            player.level,
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 316,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 312,
                columnNumber: 9
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "lko-label mb-1.5 mt-3.5",
                        children: "Activities here"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1.5",
                        children: selected.activities.map((a)=>{
                            // Stage 3: work content is live — chips deep-link to the Work tab
                            const isLive = a.stage <= 3;
                            const isWork = a.key.startsWith('job-') || a.key === 'hustle';
                            if (isLive && isWork && onOpenWork) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        onClose();
                                        onOpenWork();
                                    },
                                    className: "lko-press flex items-center gap-1 rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[11px] font-bold text-[#8a5a00]",
                                    children: [
                                        a.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                            name: "arrow-up-right",
                                            size: 11
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/LocationSheet.tsx",
                                            lineNumber: 344,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, a.key, true, {
                                    fileName: "[project]/src/components/game/LocationSheet.tsx",
                                    lineNumber: 334,
                                    columnNumber: 19
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${isLive ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'bg-black/[0.04] text-[var(--lko-ink-soft)]'}`,
                                children: [
                                    !isLive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "lock",
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                                        lineNumber: 357,
                                        columnNumber: 31
                                    }, this),
                                    isLive ? a.label : `${a.label} (Stage ${a.stage})`
                                ]
                            }, a.key, true, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 349,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 327,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LocActionBoard, {
                    locationId: selected.id,
                    isCurrent: isSelectedCurrent,
                    onOpenWork: onOpenWork,
                    onClose: onClose
                }, void 0, false, {
                    fileName: "[project]/src/components/game/LocationSheet.tsx",
                    lineNumber: 369,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 368,
                columnNumber: 9
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$BizBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BizBlock"], {
                locationId: selected.id
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 379,
                columnNumber: 29
            }, this),
            !isSelectedLocked && selected.id === 'transport-area' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FleetBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FleetBlock"], {}, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 382,
                columnNumber: 65
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$FestivalPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FestivalPanel"], {
                location: selected
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 385,
                columnNumber: 29
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$RiversPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RiversPanel"], {
                location: selected
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 388,
                columnNumber: 29
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EducationPanel"], {
                location: selected
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 391,
                columnNumber: 29
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HousingPanel"], {
                location: selected
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 392,
                columnNumber: 29
            }, this),
            !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$LadderPanels$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JapaPanel"], {
                location: selected
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 393,
                columnNumber: 29
            }, this),
            !isSelectedCurrent && !isSelectedLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "lko-label mb-1.5 mt-3.5",
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
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 398,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: plans.map((option)=>{
                            const tooPoor = player.cash < option.plan.cost;
                            const tooTired = player.needs.energy < option.plan.energyCost;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TravelOptionRow, {
                                plan: option.plan,
                                label: option.label,
                                emoji: option.emoji,
                                personal: option.personal,
                                disabled: tooPoor || tooTired,
                                disabledReason: tooPoor ? `You need ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(option.plan.cost)} for this ${option.personal ? 'fuel' : 'fare'}` : 'You are too tired for this trip',
                                onConfirm: ()=>confirmTravel(option.transport)
                            }, option.transport, false, {
                                fileName: "[project]/src/components/game/LocationSheet.tsx",
                                lineNumber: 406,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            isSelectedCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--lko-green-soft)] p-3 text-center text-sm font-bold text-[var(--lko-green-deep)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                        name: "check",
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/LocationSheet.tsx",
                        lineNumber: 429,
                        columnNumber: 11
                    }, this),
                    " You are already here."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 428,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Btn"], {
                variant: "ghost",
                onClick: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                    onClose();
                },
                className: "mt-3",
                children: "Cancel"
            }, void 0, false, {
                fileName: "[project]/src/components/game/LocationSheet.tsx",
                lineNumber: 433,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/LocationSheet.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — World Input Controls (Stage 3D + Stage 5)
 * --------------------------------------------------------
 * A tiny framework-agnostic input layer shared by the DOM HUD
 * (joystick, buttons) and the R3F player controller (keyboard).
 *
 * - Movement comes from EITHER the virtual joystick (touch) or
 *   WASD/arrow keys (desktop) — joystick wins when engaged.
 * - Look drag: pointer drag anywhere on the look surface.
 * - Interact: E / Enter (keyboard) or the HUD button (touch).
 * - Stage 5 drive mode: while driving, the same joystick/key axes are
 *   re-interpreted by DriveSystem (Y = throttle/brake, X = steer) and
 *   the walking controller is held frozen. The DOM HUD and the R3F
 *   drive loop meet here — neither imports the other.
 */ __turbopack_context__.s([
    "CAM_MODES",
    ()=>CAM_MODES,
    "CAM_RIG",
    ()=>CAM_RIG,
    "KMH_PER_U",
    ()=>KMH_PER_U,
    "MOVE",
    ()=>MOVE,
    "addDriveMeters",
    ()=>addDriveMeters,
    "addWalkDistance",
    ()=>addWalkDistance,
    "attachControls",
    ()=>attachControls,
    "consumeEnterRequest",
    ()=>consumeEnterRequest,
    "consumeInteract",
    ()=>consumeInteract,
    "consumeLook",
    ()=>consumeLook,
    "consumeParkRequest",
    ()=>consumeParkRequest,
    "consumeZoom",
    ()=>consumeZoom,
    "cycleCamMode",
    ()=>cycleCamMode,
    "e2eTeleport",
    ()=>e2eTeleport,
    "freezeInput",
    ()=>freezeInput,
    "getCamMode",
    ()=>getCamMode,
    "getDriveMeters",
    ()=>getDriveMeters,
    "getDriveModel",
    ()=>getDriveModel,
    "getDriveSeat",
    ()=>getDriveSeat,
    "getDriveSpeed",
    ()=>getDriveSpeed,
    "getDriveStartedAt",
    ()=>getDriveStartedAt,
    "getNearVehicle",
    ()=>getNearVehicle,
    "getTutProgress",
    ()=>getTutProgress,
    "getWalkedMeters",
    ()=>getWalkedMeters,
    "isAttached",
    ()=>isAttached,
    "isDriveActive",
    ()=>isDriveActive,
    "isInputFrozen",
    ()=>isInputFrozen,
    "isPhotoMode",
    ()=>isPhotoMode,
    "playerPos",
    ()=>playerPos,
    "queueInteract",
    ()=>queueInteract,
    "queueZoom",
    ()=>queueZoom,
    "readMoveInput",
    ()=>readMoveInput,
    "reportDriveSpeed",
    ()=>reportDriveSpeed,
    "reportNearVehicle",
    ()=>reportNearVehicle,
    "reportPlayerPos",
    ()=>reportPlayerPos,
    "requestE2eTeleport",
    ()=>requestE2eTeleport,
    "requestEnterVehicle",
    ()=>requestEnterVehicle,
    "requestParkVehicle",
    ()=>requestParkVehicle,
    "resetDriveMeters",
    ()=>resetDriveMeters,
    "resetTutProgress",
    ()=>resetTutProgress,
    "resetWalkedMeters",
    ()=>resetWalkedMeters,
    "setCamMode",
    ()=>setCamMode,
    "setDriveActive",
    ()=>setDriveActive,
    "setDriveSeat",
    ()=>setDriveSeat,
    "setJoystick",
    ()=>setJoystick,
    "setPhotoMode",
    ()=>setPhotoMode,
    "setSprint",
    ()=>setSprint,
    "speedToKmh",
    ()=>speedToKmh,
    "togglePhotoMode",
    ()=>togglePhotoMode
]);
const MOVE = {
    walkSpeed: 4.4,
    sprintSpeed: 7.4,
    accel: 26,
    playerRadius: 0.55,
    cameraDistance: 9.6,
    cameraMinDistance: 6,
    cameraMaxDistance: 15,
    cameraHeight: 4.4,
    camPitchMin: 0.14,
    camPitchMax: 1.05,
    camAlignRate: 2.1,
    interactRadius: 8.6
};
const CAM_MODES = [
    {
        id: 'follow',
        label: 'Follow'
    },
    {
        id: 'orbit',
        label: 'Orbit'
    },
    {
        id: 'drone',
        label: 'Drone'
    }
];
const CAM_RIG = {
    follow: {
        dist: 1,
        height: 0,
        align: 2.1
    },
    orbit: {
        dist: 1.25,
        height: 1.2,
        align: 0
    },
    drone: {
        dist: 2.1,
        height: 10.5,
        align: 1.1
    }
};
/* --------------------------------- state ----------------------------------- */ const keys = new Set();
let joy = {
    x: 0,
    y: 0
} // -1..1, y+ = forward
;
let joyActive = false;
let lookDx = 0;
let lookDy = 0;
let interactQueued = false;
let sprintHeld = false;
let attached = false;
function onKeyDown(e) {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    keys.add(e.code);
    if (e.code === 'KeyE' || e.code === 'Enter') interactQueued = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprintHeld = true;
    if (e.code === 'KeyC') cycleCamMode();
    // photo mode (V) is owned by the HUD so it can animate chrome with it
    // stop page scroll on arrows/space while exploring
    if ([
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Space'
    ].includes(e.code)) e.preventDefault();
    // tutorial: any movement key counts as "moved"
    if ([
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
    ].includes(e.code)) markMoved();
}
function onKeyUp(e) {
    keys.delete(e.code);
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprintHeld = false;
}
function onBlur() {
    keys.clear();
    sprintHeld = false;
}
/* ------------------------------ look dragging ------------------------------ */ let dragging = false;
let lastX = 0;
let lastY = 0;
let dragTotal = 0;
function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
}
function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lookDx += dx;
    lookDy += dy;
    lastX = e.clientX;
    lastY = e.clientY;
    // tutorial: a meaningful drag counts as "looked around"
    if (Math.hypot(dx, dy) > 2) {
        dragTotal += Math.hypot(dx, dy);
        if (dragTotal > 30) tut.looked = true;
    }
}
function onPointerUp() {
    dragging = false;
}
function attachControls(surface) {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    surface.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('wheel', onWheel, {
        passive: true
    });
    attached = true;
    return ()=>{
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('blur', onBlur);
        surface.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        window.removeEventListener('wheel', onWheel);
        attached = false;
        keys.clear();
        joy = {
            x: 0,
            y: 0
        };
        joyActive = false;
        dragging = false;
    };
}
function setJoystick(x, y) {
    joy = {
        x,
        y
    };
    joyActive = Math.hypot(x, y) > 0.01;
    if (joyActive) markMoved();
}
function setSprint(on) {
    sprintHeld = on;
}
function queueInteract() {
    interactQueued = true;
}
/** camera look consumes the accumulated drag delta.
 *  SILK II: returns a SHARED scratch (zero allocation in the frame loop) —
 *  the single-frame-ownership law: read it in the tick that consumed it,
 *  never hold the reference across frames. */ const LOOK_SCRATCH = {
    dx: 0,
    dy: 0
};
function consumeLook() {
    LOOK_SCRATCH.dx = lookDx;
    LOOK_SCRATCH.dy = lookDy;
    lookDx = 0;
    lookDy = 0;
    return LOOK_SCRATCH;
}
let zoomDelta = 0;
function queueZoom(delta) {
    zoomDelta += delta;
}
function consumeZoom() {
    const d = zoomDelta;
    zoomDelta = 0;
    return d;
}
function onWheel(e) {
    zoomDelta += Math.sign(e.deltaY) * 1.1;
}
/** unified movement vector, camera-relative intent (y+ = forward).
 *  SILK II: shared scratch, same single-frame-ownership law as consumeLook. */ const MOVE_SCRATCH = {
    x: 0,
    y: 0,
    sprint: false
};
function readMoveInput() {
    let x;
    let y;
    if (joyActive) {
        x = joy.x;
        y = joy.y;
    } else {
        let kx = 0;
        let ky = 0;
        if (keys.has('KeyW') || keys.has('ArrowUp')) ky += 1;
        if (keys.has('KeyS') || keys.has('ArrowDown')) ky -= 1;
        if (keys.has('KeyA') || keys.has('ArrowLeft')) kx -= 1;
        if (keys.has('KeyD') || keys.has('ArrowRight')) kx += 1;
        const len = Math.hypot(kx, ky);
        x = len > 1 ? kx / len : kx;
        y = len > 1 ? ky / len : ky;
    }
    MOVE_SCRATCH.x = x;
    MOVE_SCRATCH.y = y;
    MOVE_SCRATCH.sprint = sprintHeld;
    return MOVE_SCRATCH;
}
function consumeInteract() {
    const hit = interactQueued;
    interactQueued = false;
    return hit;
}
/** HUD panels open → freeze walking input without unmounting the scene */ let inputFrozen = false;
function freezeInput(frozen) {
    inputFrozen = frozen;
    if (frozen) {
        joy = {
            x: 0,
            y: 0
        };
        joyActive = false;
        keys.clear();
    }
}
function isInputFrozen() {
    return inputFrozen || driveActive;
}
function isAttached() {
    return attached;
}
/* ------------------------------ camera modes -------------------------------- */ let camMode = 'follow';
let photoMode = false;
function cycleCamMode() {
    const i = CAM_MODES.findIndex((m)=>m.id === camMode);
    camMode = CAM_MODES[(i + 1) % CAM_MODES.length].id;
    return camMode;
}
function setCamMode(mode) {
    camMode = mode;
}
function getCamMode() {
    return camMode;
}
function togglePhotoMode() {
    photoMode = !photoMode;
    return photoMode;
}
function setPhotoMode(on) {
    photoMode = on;
}
function isPhotoMode() {
    return photoMode;
}
/* ------------------------- walk measurement + tutorial ------------------------ */ /**
 * Stage 3D increment 2 — presentation MEASURES, the store APPLIES.
 * The player controller reports metres actually walked each frame;
 * the WorldTab settles them into the real needs economy on exit via
 * store.settleWorldWalk(). Nothing here touches money/time directly.
 */ let walkedMeters = 0;
function addWalkDistance(meters) {
    if (Number.isFinite(meters) && meters > 0) walkedMeters += meters;
}
function getWalkedMeters() {
    return walkedMeters;
}
function resetWalkedMeters() {
    walkedMeters = 0;
}
const playerPos = {
    x: 0,
    z: 0,
    heading: 0
};
const e2eTeleport = {
    x: 0,
    z: 0,
    pending: false
};
function requestE2eTeleport(x, z) {
    e2eTeleport.x = x;
    e2eTeleport.z = z;
    e2eTeleport.pending = true;
}
function reportPlayerPos(x, z, heading = playerPos.heading) {
    playerPos.x = x;
    playerPos.z = z;
    playerPos.heading = heading;
}
/* --------------------------- one-time onboarding ------------------------------ */ /** tutorial progress flags — the HUD drives a 3-step first-visit tour */ const tut = {
    moved: false,
    looked: false
};
/** called by the input layer itself so ANY input path (touch/keyboard) counts */ function markMoved() {
    tut.moved = true;
}
function getTutProgress() {
    return {
        ...tut
    };
}
function resetTutProgress() {
    tut.moved = false;
    tut.looked = false;
}
/* ============================ Stage 5 — drive mode ============================ */ /**
 * Drive-mode handshake between the DOM HUD and the R3F DriveSystem.
 * Nothing here touches money or time — the store's settleDrive stays the
 * only authority; this layer only MEASURES (metres driven, speed feel).
 *
 * Seat protocol: while driving, DriveSystem writes the vehicle's ground
 * position here every frame. The player rig should be hidden (or seated)
 * at that spot — DriveSystem applies it best-effort via the scene graph;
 * if PlayerController is ever given the one-line hook (INTEGRATOR note in
 * the worklog), reading getDriveSeat() after its own position update is
 * the guaranteed version of the same contract.
 */ let driveActive = false;
let driveModel = null;
let driveMeters = 0;
let driveSpeed = 0;
let driveStartedAt = 0;
let nearVehicle = null;
let enterRequest = null;
let parkRequest = false;
let driveSeat = null;
function setDriveSeat(seat) {
    driveSeat = seat;
}
function getDriveSeat() {
    return driveSeat;
}
function setDriveActive(on, model = null) {
    driveActive = on;
    driveModel = on ? model : null;
    if (on) {
        driveStartedAt = performance.now();
        joy = {
            x: 0,
            y: 0
        };
        joyActive = false;
        keys.clear();
        nearVehicle = null;
    } else {
        driveSeat = null;
        driveSpeed = 0;
    }
}
function isDriveActive() {
    return driveActive;
}
function getDriveModel() {
    return driveModel;
}
function addDriveMeters(meters) {
    if (Number.isFinite(meters) && meters > 0) driveMeters += meters;
}
function getDriveMeters() {
    return driveMeters;
}
function resetDriveMeters() {
    driveMeters = 0;
}
function reportDriveSpeed(speed) {
    driveSpeed = speed;
}
function getDriveSpeed() {
    return driveSpeed;
}
const KMH_PER_U = 3.6 / 0.55;
function speedToKmh(speed) {
    return speed * KMH_PER_U;
}
function getDriveStartedAt() {
    return driveStartedAt;
}
function reportNearVehicle(model) {
    nearVehicle = model;
}
function getNearVehicle() {
    return nearVehicle;
}
function requestEnterVehicle(model) {
    enterRequest = model;
}
function consumeEnterRequest() {
    const m = enterRequest;
    enterRequest = null;
    return m;
}
function requestParkVehicle() {
    parkRequest = true;
}
function consumeParkRequest() {
    const hit = parkRequest;
    parkRequest = false;
    return hit;
}
}),
];

//# sourceMappingURL=src_components_game_2b28b142._.js.map