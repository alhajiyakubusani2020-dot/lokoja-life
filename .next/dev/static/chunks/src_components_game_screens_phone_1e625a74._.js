(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/screens/phone/ChatThread.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatThread",
    ()=>ChatThread,
    "tierChipClass",
    ()=>tierChipClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — ChatThread (Stage 5-c)
 * ------------------------------------
 * One NPC conversation inside the phone. The message list lives in
 * COMPONENT state only — threads do NOT persist across sessions
 * (gist dey cool). What DOES persist is the relationship itself:
 * familiarity, tier and the once-per-day cooldown live in the store
 * and save with the game.
 *
 * Flow: warm empty state → player taps the canned opener ("Abeg how
 * body?") → typing dots (~700ms) → NPC reply bubble → familiarity bar
 * fills → tier-up flourish when the tier changes. The store's chatNpc
 * enforces the one-chat-per-day gate; the UI mirrors it as a
 * "You don talk today" composer state.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/social.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-client] (ecmascript)");
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
/* ------------------------------- tier chips ------------------------------- */ const TIER_CHIP = {
    stranger: 'bg-black/[0.05] text-[var(--lko-ink-soft)]',
    acquaintance: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
    paddy: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
    'close-paddy': 'bg-[var(--lko-terra)]/15 text-[var(--lko-terra)]'
};
function tierChipClass(tier) {
    return TIER_CHIP[tier];
}
const OPENER = 'Abeg how body?';
const TYPING_MS = 700;
/* --------------------- M6 — the paddy's favour bubble ---------------------- */ function FavorBubble({ offer }) {
    _s();
    const acceptFavorOffer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "FavorBubble.useGameStore[acceptFavorOffer]": (s)=>s.acceptFavorOffer
    }["FavorBubble.useGameStore[acceptFavorOffer]"]);
    const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "FavorBubble.useGameStore[active]": (s)=>s.player?.activeOpportunities ?? []
    }["FavorBubble.useGameStore[active]"]);
    const taken = active.some((o)=>o.defId === offer.defId);
    const [dismissed, setDismissed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (dismissed || taken) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 self-start rounded-2xl border border-[var(--lko-green)]/30 bg-[var(--lko-green-soft)] px-3.5 py-2.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
                    size: 15,
                    className: "text-[var(--lko-green)]"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[12px] font-extrabold text-[var(--lko-green-deep)]",
                    children: "Favour accepted — e dey your Work tab."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "self-start rounded-2xl border border-[var(--lko-gold)]/50 bg-[var(--lko-gold-soft)] px-3.5 py-2.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex items-center gap-1.5 text-[12.5px] font-extrabold text-[var(--lko-gold-deep)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "🤝"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    " Favour: ",
                    offer.defId.replace(/-/g, ' ')
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 text-[11px] font-semibold text-[var(--lko-gold-deep)]/80",
                children: "Real gist from a real paddy — e go cold if you wait."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            acceptFavorOffer(offer);
                        },
                        className: "lko-press rounded-full bg-[var(--lko-green)] px-3 py-1.5 text-[11px] font-extrabold text-white",
                        children: "Accept"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            setDismissed(true);
                        },
                        className: "lko-press rounded-full bg-black/[0.06] px-3 py-1.5 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                        children: "Later"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(FavorBubble, "VU1cCpT9gN5fvA8A72vIwTkrySE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = FavorBubble;
/* ------------------------------ typing bubble ----------------------------- */ function TypingBubble({ emoji }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-end gap-1.5 self-start",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[13px]",
                "aria-hidden": true,
                children: emoji
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center gap-1 rounded-2xl rounded-bl-md border border-black/[0.06] bg-white px-3.5 py-3",
                role: "status",
                "aria-label": "Typing",
                children: [
                    0,
                    1,
                    2
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "h-1.5 w-1.5 animate-bounce rounded-full bg-black/30",
                        style: {
                            animationDelay: `${i * 140}ms`
                        }
                    }, i, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_c1 = TypingBubble;
function ChatThread({ npcId, onBack }) {
    _s1();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ChatThread.useGameStore[player]": (s)=>s.player
    }["ChatThread.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ChatThread.useGameStore[world]": (s)=>s.world
    }["ChatThread.useGameStore[world]"]);
    const chatNpc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ChatThread.useGameStore[chatNpc]": (s)=>s.chatNpc
    }["ChatThread.useGameStore[chatNpc]"]);
    const emoteChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ChatThread.useGameStore[emoteChat]": (s)=>s.emoteChat
    }["ChatThread.useGameStore[emoteChat]"]);
    const giveGift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ChatThread.useGameStore[giveGift]": (s)=>s.giveGift
    }["ChatThread.useGameStore[giveGift]"]);
    const hangout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ChatThread.useGameStore[hangout]": (s)=>s.hangout
    }["ChatThread.useGameStore[hangout]"]);
    // M13 — THE FAMILY SHIELD: kid socials are preset emotes ONLY
    const kidMode = player.ageBand === 'kid';
    const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][npcId];
    const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npcId);
    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierFor"])(rel.familiarity);
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIER_META"][tier];
    const chattedToday = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canChat"])(rel, world.day);
    const giftableToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canGift"])(rel, world.day);
    const hangoutable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canHangout"])(rel, world.day) && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.slots.includes(world.timeOfDay);
    const [msgs, setMsgs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [typing, setTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tierUp, setTierUp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showGifts, setShowGifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [favor, setFavor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const chatTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bannerTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /** tier captured at mount = tier before this thread's one chat */ const tierBefore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(tier);
    /* clear pending timers when the thread closes */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatThread.useEffect": ()=>{
            return ({
                "ChatThread.useEffect": ()=>{
                    if (chatTimer.current) window.clearTimeout(chatTimer.current);
                    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
                }
            })["ChatThread.useEffect"];
        }
    }["ChatThread.useEffect"], []);
    /* keep the newest bubble in view */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatThread.useEffect": ()=>{
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    }["ChatThread.useEffect"], [
        msgs.length,
        typing
    ]);
    if (!npc) return null;
    const locName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][npc.homeLocationId]?.name ?? 'Lokoja';
    const sendOpener = ()=>{
        if (typing || chattedToday) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        setMsgs((m)=>[
                ...m,
                {
                    from: 'me',
                    text: OPENER
                }
            ]);
        setTyping(true);
        chatTimer.current = window.setTimeout(()=>{
            setTyping(false);
            const outcome = chatNpc(npcId);
            if (!outcome) {
                // cooldown race (shouldn't happen through this UI) — stay honest
                setMsgs((m)=>[
                        ...m,
                        {
                            from: 'sys',
                            text: 'You don talk today. Tomorrow another level.'
                        }
                    ]);
                return;
            }
            if (outcome.tier !== tierBefore.current) {
                setTierUp(outcome.tier);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                bannerTimer.current = window.setTimeout(()=>setTierUp(null), 5000);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            }
            tierBefore.current = outcome.tier;
            if (outcome.favorOffer) {
                setFavor(outcome.favorOffer);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            }
            setMsgs((m)=>[
                    ...m,
                    {
                        from: 'npc',
                        text: outcome.reply
                    },
                    ...outcome.firstMeeting ? [
                        {
                            from: 'sys',
                            text: `You don add ${npc.name} — small small na im paddy dey grow.`
                        }
                    ] : []
                ]);
        }, TYPING_MS);
    };
    /** M13 — kid socials: an emote carries the day (same clock, same ledger). */ const sendEmote = (emoteId, glyph)=>{
        if (typing || chattedToday) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        setMsgs((m)=>[
                ...m,
                {
                    from: 'me',
                    text: glyph
                }
            ]);
        setTyping(true);
        chatTimer.current = window.setTimeout(()=>{
            setTyping(false);
            const outcome = emoteChat(npcId, emoteId);
            if (!outcome) {
                setMsgs((m)=>[
                        ...m,
                        {
                            from: 'sys',
                            text: 'You don greet today. Tomorrow another level.'
                        }
                    ]);
                return;
            }
            if (outcome.tier !== tierBefore.current) {
                setTierUp(outcome.tier);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                bannerTimer.current = window.setTimeout(()=>setTierUp(null), 5000);
            }
            tierBefore.current = outcome.tier;
            setMsgs((m)=>[
                    ...m,
                    {
                        from: 'npc',
                        text: outcome.reply
                    }
                ]);
        }, TYPING_MS);
    };
    const sendGift = (giftId, label)=>{
        if (!giftableToday) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        if (giveGift(npcId, giftId)) {
            setMsgs((m)=>[
                    ...m,
                    {
                        from: 'sys',
                        text: `You send ${label} — na real paddy move be that.`
                    }
                ]);
            setShowGifts(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 border-b border-black/[0.06] bg-white/70 py-2 pl-1 pr-3 backdrop-blur",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onBack();
                        },
                        "aria-label": "Back to chats",
                        className: "lko-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--lko-ink-soft)]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowLeftIcon"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 257,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-lg",
                        "aria-hidden": true,
                        children: npc.emoji
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-sm font-extrabold leading-tight",
                                children: npc.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    meta.label,
                                    " • ",
                                    locName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${TIER_CHIP[tier]}`,
                        children: meta.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 border-b border-black/[0.05] bg-white/50 px-3.5 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-ink-soft)]",
                        children: "Familiarity"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.08]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-[var(--lko-terra)] transition-[width] duration-700",
                            style: {
                                width: `${Math.min(100, rel.familiarity)}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            rel.familiarity,
                            "/100"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3",
                children: [
                    tierUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lko-pop mb-3 flex items-center gap-2.5 rounded-2xl border border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)] px-3.5 py-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--lko-gold-deep)]",
                                "aria-hidden": true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SparkleIcon"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[13px] font-extrabold leading-tight text-[var(--lko-gold-deep)]",
                                        children: [
                                            "Friendship level up — ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIER_META"][tierUp].label,
                                            "!"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                        lineNumber: 301,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-[11px] font-semibold text-[var(--lko-gold-deep)]/80",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIER_META"][tierUp].perk
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this),
                    msgs.length === 0 && !typing && !favor ? /* warm empty states */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "my-auto flex flex-col items-center px-4 pb-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-16 w-16 items-center justify-center rounded-full border border-black/[0.06] bg-white text-3xl shadow-[var(--lko-shadow-sm)]",
                                "aria-hidden": true,
                                children: npc.emoji
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this),
                            rel.familiarity === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-display mt-3 text-[15px]",
                                        children: "You never talk before — break the ice."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                        lineNumber: 322,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                                        children: "One chat a day dey grow friendship small small."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                        lineNumber: 323,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lko-display mt-3 text-[15px]",
                                        children: "You don talk today."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                        lineNumber: 329,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                                        children: [
                                            "Tomorrow another level with ",
                                            npc.name,
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                        lineNumber: 330,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: [
                            msgs.map((msg, i)=>msg.from === 'sys' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mx-auto my-1 max-w-[85%] text-center text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                                    children: msg.text
                                }, i, false, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 340,
                                    columnNumber: 17
                                }, this) : msg.from === 'me' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "max-w-[80%] self-end rounded-2xl rounded-br-md bg-[var(--lko-green)] px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]",
                                    children: msg.text
                                }, i, false, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 347,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex max-w-[85%] items-end gap-1.5 self-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[13px]",
                                            "aria-hidden": true,
                                            children: npc.emoji
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                            lineNumber: 355,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "rounded-2xl rounded-bl-md border border-black/[0.06] bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-[var(--lko-ink)] shadow-[var(--lko-shadow-sm)]",
                                            children: msg.text
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                            lineNumber: 361,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 354,
                                    columnNumber: 17
                                }, this)),
                            typing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingBubble, {
                                emoji: npc.emoji
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                lineNumber: 367,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 337,
                        columnNumber: 11
                    }, this),
                    favor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FavorBubble, {
                            offer: favor
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 372,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 371,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: bottomRef
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-black/[0.06] bg-white/70 px-3 py-2.5 backdrop-blur",
                children: kidMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        msgs.length === 0 && !typing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-2 text-center text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                            children: "🛡️ Pikin mode — greet with emotes, one a day."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 383,
                            columnNumber: 15
                        }, this),
                        chattedToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-black/[0.05] px-4 text-[13px] font-bold text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                    size: 15,
                                    className: "text-[var(--lko-green)]",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 389,
                                    columnNumber: 17
                                }, this),
                                "You don greet today"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 388,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "data-testid": "kid-emote-grid",
                            className: "grid grid-cols-6 gap-1.5",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIELD"].kidEmotes.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `kid-emote-${e.id}`,
                                    onClick: ()=>sendEmote(e.id, e.glyph),
                                    disabled: typing,
                                    "aria-label": e.label,
                                    className: "lko-press flex min-h-[44px] items-center justify-center rounded-xl border border-black/[0.06] bg-white text-xl disabled:opacity-50",
                                    children: e.glyph
                                }, e.id, false, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 395,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 393,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        setShowGifts((v)=>!v);
                                    },
                                    className: `lko-press flex-1 rounded-full px-2 py-1.5 text-[11px] font-extrabold ${giftableToday ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                                    children: [
                                        "🎁 ",
                                        giftableToday ? 'Send gift' : 'Gifted today'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 413,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                        if (hangout(npcId)) {
                                            setMsgs((m)=>[
                                                    ...m,
                                                    {
                                                        from: 'sys',
                                                        text: `You and ${npc.name} catch evening — mood +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.mood}.`
                                                    }
                                                ]);
                                        }
                                    },
                                    disabled: !hangoutable,
                                    className: `lko-press flex-1 rounded-full px-2 py-1.5 text-[11px] font-extrabold disabled:cursor-not-allowed disabled:bg-black/[0.05] disabled:text-[var(--lko-ink-soft)] ${hangoutable ? 'bg-[var(--lko-terra)]/15 text-[var(--lko-terra)]' : ''}`,
                                    children: [
                                        "🍻 ",
                                        hangoutable ? `Hang out · ₦${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.cost.toLocaleString()}` : 'Hang out later'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 424,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 412,
                            columnNumber: 13
                        }, this),
                        showGifts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex flex-col gap-1.5 rounded-2xl border border-[var(--lko-gold)]/30 bg-[var(--lko-gold-soft)]/50 p-2",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].gifts.map((g)=>{
                                const afford = player.cash >= g.cost;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: !afford || !giftableToday,
                                    onClick: ()=>sendGift(g.id, g.label),
                                    className: `lko-press flex items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-left disabled:cursor-not-allowed disabled:opacity-55 ${afford ? '' : 'opacity-55'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg",
                                            "aria-hidden": true,
                                            children: g.emoji
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                            lineNumber: 452,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block truncate text-[12px] font-extrabold",
                                                    children: g.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block truncate text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                                                    children: g.note
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                                    lineNumber: 455,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                            lineNumber: 453,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "lko-num block text-[11.5px] font-extrabold text-[var(--lko-gold-deep)]",
                                                    children: [
                                                        "₦",
                                                        g.cost.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-[9.5px] font-bold text-[var(--lko-green-deep)]",
                                                    children: [
                                                        "+",
                                                        g.familiarity,
                                                        " fam"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                            lineNumber: 457,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, g.id, true, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 444,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 440,
                            columnNumber: 11
                        }, this),
                        chattedToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-black/[0.05] px-4 text-[13px] font-bold text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                    size: 15,
                                    className: "text-[var(--lko-green)]",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                                    lineNumber: 468,
                                    columnNumber: 13
                                }, this),
                                "You don talk today"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 467,
                            columnNumber: 11
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: sendOpener,
                            disabled: typing,
                            className: "lko-press flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--lko-green)] px-4 text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] disabled:bg-black/10 disabled:text-white/60 disabled:shadow-none",
                            children: OPENER
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/ChatThread.tsx",
        lineNumber: 246,
        columnNumber: 5
    }, this);
}
_s1(ChatThread, "Y7kXsa7akAOCuuDabs4hVE0Nrc0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c2 = ChatThread;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FavorBubble");
__turbopack_context__.k.register(_c1, "TypingBubble");
__turbopack_context__.k.register(_c2, "ChatThread");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/PulseApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PulseApp",
    ()=>PulseApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — PulseApp (M15: THE CITY PULSE + THE AWARENESS WAR)
 * -----------------------------------------------------------------
 * The phone's newspaper: the city's deterministic news (derived, never
 * stored), the signed postcard ("My Spot"), the mailbox of postcards
 * that landed you here (the ghost cards), the KNOW YOUR CITY card
 * (percent from honest ledgers only), and the Day Clip — the 9:16
 * auto-playing card the WhatsApp generation screenshots for Status.
 *
 * Every naira of street credit moves through the store's share actions
 * (shareTeleport / sharePulseCard) — this UI never mints, never signs,
 * never pays. The cooldown and the ledger live in the store.
 *
 * M24-UI wave 2 — the face: a newspaper MASTHEAD (the green band, the
 * unread count as its press stamp), the feed with icon chips, the
 * spot card, the mailbox, the knowledge meter. Every number, every
 * testid, every honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/teleport.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
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
/* ------------------------------ the feed row ------------------------------- */ function FeedRow({ item, onShare, shared }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-testid": `pulse-item-${item.kind}`,
        className: "rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex min-w-0 items-start gap-2 text-[13px] font-extrabold leading-snug",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--lko-green-soft)] text-[11px]",
                                "aria-hidden": true,
                                children: item.icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-0",
                                children: item.headline
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": `pulse-share-${item.kind}`,
                        onClick: onShare,
                        className: "lko-press shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                        "aria-label": `Share this news: ${item.headline}`,
                        children: "Share"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 pl-8 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                children: item.body
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            shared && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-green)]",
                children: "The street don hear — credit paid today"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = FeedRow;
/* ---------------------------- the ghost card ------------------------------- */ function GhostCard({ code, mineName }) {
    const dec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeTeleport"])(code);
    if (!dec.ok) return null;
    const card = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postcardFor"])(dec.moment);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-testid": "ghost-card",
        className: "rounded-2xl border border-[#ffd166]/50 bg-[#fff8e6] p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8a6d1a]",
                children: [
                    "📩 Postcard — ",
                    dec.moment.name === mineName ? 'your own' : dec.moment.name,
                    "'s corner"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-[13px] font-extrabold leading-snug text-[#4a3200]",
                children: card.title
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 text-[11px] font-semibold text-[#6b5416]",
                children: card.body
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_c1 = GhostCard;
/* ----------------------------- the day clip -------------------------------- */ /** THE DAY CLIP — 9:16, three honest beats, it plays itself. Screenshot it for Status. */ function DayClip({ beats, code }) {
    _s();
    const [beat, setBeat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const clip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DayClip.useMemo[clip]": ()=>{
            const b = beats.slice(0, 3);
            while(b.length < 3)b.push({
                icon: '🌤️',
                line: 'Lokoja dey move — your turn to waka.'
            });
            b.push({
                icon: '📲',
                line: `Join the street: ${code.slice(0, 24)}…`
            });
            return b;
        }
    }["DayClip.useMemo[clip]"], [
        beats,
        code
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DayClip.useEffect": ()=>{
            const t = setInterval({
                "DayClip.useEffect.t": ()=>setBeat({
                        "DayClip.useEffect.t": (b)=>(b + 1) % clip.length
                    }["DayClip.useEffect.t"])
            }["DayClip.useEffect.t"], 2200);
            return ({
                "DayClip.useEffect": ()=>clearInterval(t)
            })["DayClip.useEffect"];
        }
    }["DayClip.useEffect"], [
        clip.length
    ]);
    const current = clip[beat % clip.length];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-testid": "day-clip",
        className: "relative mx-auto aspect-[9/16] w-full max-w-[180px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#146b3a] via-[#0d4d2a] to-[#0b3d23] p-3 text-white shadow-[var(--lko-shadow-md)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/60",
                children: "Lokoja Life · Day Clip"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex h-[70%] flex-col items-center justify-center gap-2 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-3xl",
                        "aria-hidden": true,
                        children: current.icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12px] font-extrabold leading-snug",
                        children: current.line
                    }, beat, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-x-3 bottom-2 flex justify-center gap-1",
                children: clip.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `h-1 w-4 rounded-full ${i === beat % clip.length ? 'bg-white' : 'bg-white/30'}`
                    }, i, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(DayClip, "8RS6OJk2i7ZqZacyV2KJvEK9kBs=");
_c2 = DayClip;
function PulseApp() {
    _s1();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[player]": (s)=>s.player
    }["PulseApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[world]": (s)=>s.world
    }["PulseApp.useGameStore[world]"]);
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[civic]": (s)=>s.civic
    }["PulseApp.useGameStore[civic]"]);
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[chaos]": (s)=>s.chaos
    }["PulseApp.useGameStore[chaos]"]);
    const rivers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[rivers]": (s)=>s.rivers
    }["PulseApp.useGameStore[rivers]"]);
    const calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[calendar]": (s)=>s.calendar
    }["PulseApp.useGameStore[calendar]"]);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[education]": (s)=>s.education
    }["PulseApp.useGameStore[education]"]);
    const housing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[housing]": (s)=>s.housing
    }["PulseApp.useGameStore[housing]"]);
    const japa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[japa]": (s)=>s.japa
    }["PulseApp.useGameStore[japa]"]);
    const cityPulse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[cityPulse]": (s)=>s.cityPulse
    }["PulseApp.useGameStore[cityPulse]"]);
    const openCityPulse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[openCityPulse]": (s)=>s.openCityPulse
    }["PulseApp.useGameStore[openCityPulse]"]);
    const shareTeleport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[shareTeleport]": (s)=>s.shareTeleport
    }["PulseApp.useGameStore[shareTeleport]"]);
    const sharePulseCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PulseApp.useGameStore[sharePulseCard]": (s)=>s.sharePulseCard
    }["PulseApp.useGameStore[sharePulseCard]"]);
    const creditPaid = player.cooldowns[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"].shareCooldownKey] === world.day;
    // mark today read on open (the store action is idempotent by law)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PulseApp.useEffect": ()=>{
            openCityPulse();
        }
    }["PulseApp.useEffect"], [
        world.day
    ]);
    const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PulseApp.useMemo[items]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pulseForDay"])({
                day: world.day,
                weather: world.weather,
                chaos,
                civic,
                rivers,
                calendar
            })
    }["PulseApp.useMemo[items]"], [
        world.day,
        world.weather,
        chaos,
        civic,
        rivers,
        calendar
    ]);
    const unread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pulseUnread"])(cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(), items);
    const knowledge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PulseApp.useMemo[knowledge]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cityKnowledge"])(player, {
                calendar,
                rivers,
                education,
                housing,
                japa,
                chaos
            })
    }["PulseApp.useMemo[knowledge]"], [
        player,
        calendar,
        rivers,
        education,
        housing,
        japa,
        chaos
    ]);
    const [spot, setSpot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [spotBusy, setSpotBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const shareSpot = async ()=>{
        setSpotBusy(true);
        setErr(null);
        const res = await shareTeleport();
        setSpotBusy(false);
        if (res.ok && res.url) {
            const title = `${player.name} na Day ${world.day} dey ${world.currentLocation === 'home' ? 'Home' : world.currentLocation}`;
            setSpot({
                url: res.url,
                title,
                body: 'Signed postcard — open am to land here.'
            });
        } else {
            setErr(res.why ?? 'The share no gree.');
        }
    };
    const shareTop = async (item)=>{
        setErr(null);
        const res = await sharePulseCard(item);
        if (!res.ok) setErr(res.why ?? 'The share no gree.');
    };
    // the clip's beats: the day's loudest news, then the ledger's biggest move
    const beats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PulseApp.useMemo[beats]": ()=>{
            const news = items.slice(0, 2).map({
                "PulseApp.useMemo[beats].news": (i)=>({
                        icon: i.icon,
                        line: i.headline
                    })
            }["PulseApp.useMemo[beats].news"]);
            const biggest = [
                ...player.transactions
            ].filter({
                "PulseApp.useMemo[beats]": (t)=>t.day === world.day && t.amount > 0
            }["PulseApp.useMemo[beats]"]).sort({
                "PulseApp.useMemo[beats]": (a, b)=>b.amount - a.amount
            }["PulseApp.useMemo[beats]"])[0];
            if (biggest) news.push({
                icon: '💸',
                line: `Biggest move: ${biggest.label} +${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(biggest.amount)}`
            });
            return news;
        }
    }["PulseApp.useMemo[beats]"], [
        items,
        player.transactions,
        world.day
    ]);
    // my current spot's postcard (derived fresh — the same bytes the share mints)
    const mySpot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PulseApp.useMemo[mySpot]": ()=>{
            const tally = {
                earned: 0,
                moves: 0,
                trail: [
                    0,
                    0,
                    0
                ]
            };
            const enc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeTeleport"])({
                v: 1,
                day: world.day,
                locId: world.currentLocation,
                name: player.name,
                level: player.level,
                rep: player.reputation,
                earned: tally.earned,
                moves: tally.moves,
                trail: tally.trail
            });
            return enc.ok ? enc : null;
        }
    }["PulseApp.useMemo[mySpot]"], [
        player,
        world
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        "data-testid": "pulse-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--lko-green-deep)] via-[var(--lko-green)] to-[#0b4a2a] p-3.5 text-white shadow-[var(--lko-shadow-md)]",
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
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M41 17 C 31 20 26 26 24 36",
                                stroke: "#fff",
                                strokeWidth: "5",
                                fill: "none",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "24",
                                cy: "37.5",
                                r: "4",
                                fill: "#fff"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display text-[16px]",
                                children: "📰 City Pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-testid": "pulse-unread",
                                className: "rounded-full bg-white/15 px-2 py-1 text-[10px] font-black backdrop-blur-sm",
                                children: unread > 0 ? `${unread} new` : 'all read'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "relative mt-0.5 text-[10px] font-bold text-white/80",
                        children: [
                            "The city talk wetin e see — Day ",
                            world.day,
                            ", ",
                            items.length,
                            " headline",
                            items.length === 1 ? '' : 's',
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-xl bg-[#fdecea] px-3 py-2 text-[11px] font-bold text-[#8a2a20]",
                children: err
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 218,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FeedRow, {
                        item: item,
                        onShare: ()=>shareTop(item),
                        shared: creditPaid
                    }, item.id, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                children: "My Spot"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]",
                "data-testid": "my-spot",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13px] font-extrabold",
                        children: "📍 Sign where you stand"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "Anyone wey open the link go land here, no fare."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "share-spot",
                        disabled: spotBusy,
                        onClick: shareSpot,
                        className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2.5 text-[12px] font-extrabold text-white shadow-[var(--lko-shadow-sm)] disabled:opacity-50",
                        children: spotBusy ? 'Signing…' : `Share this spot${creditPaid ? ' (+credit done today)' : ` (+${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"].shareStreetCredit} rep)`}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    spot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 rounded-xl bg-[var(--lko-green-soft)] p-2",
                        "data-testid": "spot-preview",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-extrabold text-[var(--lko-green-deep)]",
                                children: spot.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 break-all text-[10px] font-bold text-[var(--lko-green)]",
                                children: spot.url
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-num mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    spot.url.length,
                                    " chars — e fit WhatsApp."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, this),
                    mySpot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-num mt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            "Postcard: ",
                            mySpot.code.length,
                            " chars, ",
                            mySpot.bytes,
                            " bytes of payload — e fit WhatsApp."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            (cityPulse?.arrivals.length ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                "data-testid": "mailbox",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The mailbox — who don call you"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 262,
                        columnNumber: 11
                    }, this),
                    [
                        ...cityPulse?.arrivals ?? []
                    ].reverse().slice(0, 3).map((code)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GhostCard, {
                            code: code,
                            mineName: player.name
                        }, code, false, {
                            fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                            lineNumber: 264,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 261,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                children: "Know Your City"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]",
                "data-testid": "know-city",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] font-extrabold",
                                children: "🌍 The footprint meter"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-num rounded-full bg-[var(--lko-river-soft)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--lko-river)]",
                                children: [
                                    knowledge.percent,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniBar"], {
                            pct: knowledge.percent,
                            tone: "river",
                            tall: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-[11px] font-extrabold text-[var(--lko-green-deep)]",
                        children: [
                            "You be ",
                            knowledge.grade,
                            " — ",
                            knowledge.checked,
                            "/",
                            knowledge.total,
                            " roads don see your footprint."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex flex-wrap gap-1",
                        children: knowledge.checks.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                title: c.label,
                                className: `rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${c.done ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                                children: [
                                    c.done ? '✓' : '·',
                                    " ",
                                    c.label
                                ]
                            }, c.id, true, {
                                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                children: "The Day Clip — screenshot for Status"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DayClip, {
                beats: beats,
                code: mySpot?.code ?? 'lkt1.share-your-spot'
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/PulseApp.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
} /* ------------------------------ (no helpers below) -------------------------- */ 
_s1(PulseApp, "CnXkxyLLTv3+eP+ZEjW+cbs8Snk=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c3 = PulseApp;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "FeedRow");
__turbopack_context__.k.register(_c1, "GhostCard");
__turbopack_context__.k.register(_c2, "DayClip");
__turbopack_context__.k.register(_c3, "PulseApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/ForgeApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ForgeApp",
    ()=>ForgeApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — ForgeApp (M18: THE CITY FORGE)
 * --------------------------------------------
 * The phone's forge yard: run the 3-hour pipeline on the honest
 * sample extract (import → classify → blueprint → QA → ship), read
 * the pilot ladder (Abuja first, Accra proving the continent), and
 * cast "YOUR CITY NEXT?" votes (the ballot box rides the relay when
 * claimed; the local book moves at once — offline-first).
 *
 * This UI never forges: the pipeline is pure law, the store records
 * the ledger, and the QA battery stands between every pack and ship.
 *
 * M24-UI wave 2 — the face: an ember-toned hero, the pipeline as a
 * lit stage ladder, the ledger as a verdict list. Every number, every
 * testid, every honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/citypack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ForgeApp() {
    _s();
    const [running, setRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stageIdx, setStageIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [worldCounts, setWorldCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const forge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ForgeApp.useGameStore[forge]": (s)=>s.forge
    }["ForgeApp.useGameStore[forge]"]);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ForgeApp.useGameStore[account]": (s)=>s.account
    }["ForgeApp.useGameStore[account]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ForgeApp.useGameStore[world]": (s)=>s.world
    }["ForgeApp.useGameStore[world]"]);
    const runForge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ForgeApp.useGameStore[runForge]": (s)=>s.runForge
    }["ForgeApp.useGameStore[runForge]"]);
    const forgeVote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ForgeApp.useGameStore[forgeVote]": (s)=>s.forgeVote
    }["ForgeApp.useGameStore[forgeVote]"]);
    const forgeVotesPull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ForgeApp.useGameStore[forgeVotesPull]": (s)=>s.forgeVotesPull
    }["ForgeApp.useGameStore[forgeVotesPull]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ForgeApp.useEffect": ()=>{
            const t = setTimeout({
                "ForgeApp.useEffect.t": ()=>{
                    void forgeVotesPull();
                }
            }["ForgeApp.useEffect.t"], 0);
            return ({
                "ForgeApp.useEffect": ()=>clearTimeout(t)
            })["ForgeApp.useEffect"];
        }
    }["ForgeApp.useEffect"], [
        forgeVotesPull
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ForgeApp.useEffect": ()=>{
            // the pull lands asynchronously — mirror the world book for the read
            const t = setInterval({
                "ForgeApp.useEffect.t": ()=>{
                    const fg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().forge;
                    if (fg) setWorldCounts({
                        ...fg.votes.counts
                    });
                }
            }["ForgeApp.useEffect.t"], 4000);
            return ({
                "ForgeApp.useEffect": ()=>clearInterval(t)
            })["ForgeApp.useEffect"];
        }
    }["ForgeApp.useEffect"], []);
    if (!forge || !world) return null;
    const pack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lokojaDefaultPack"])();
    const say = (m)=>{
        setNotice(m);
        setTimeout(()=>setNotice(null), 3400);
    };
    const run = async ()=>{
        if (running) return;
        setRunning(true);
        // the stages light one by one (the honest pacing — the real run is
        // instant math; the walk-through shows the SLA's shape)
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PIPELINE"].length; i++){
            setStageIdx(i);
            await new Promise((r)=>setTimeout(r, 550));
        }
        runForge();
        setRunning(false);
        setStageIdx(-1);
        say('🏗️ The forge ran — check the ledger below.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "data-testid": "forge-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-2 pt-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                    id: "forge",
                    glyph: "🏗️",
                    title: "City Forge",
                    sub: "A city na data — 3 hours, one pipeline, no program",
                    hue: "ember",
                    right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full bg-white/15 px-2 py-1 text-[9px] font-black backdrop-blur-sm",
                        children: [
                            "SLA ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CITY_SLA_MINUTES"],
                            "m"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 81,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mx-4 mb-2 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-800",
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                lineNumber: 88,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "forge-home-pack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12px] font-black",
                                children: [
                                    "🏗️ ",
                                    pack.name,
                                    " — ",
                                    pack.version
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    pack.streets.length,
                                    " streets · ",
                                    pack.locations.length,
                                    " doors · COL ",
                                    pack.economy.colIndex,
                                    " · ",
                                    pack.culture.dishes.length,
                                    " dishes · ",
                                    pack.civic.powerZones.length,
                                    " grid zones"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "forge-run",
                                onClick: ()=>{
                                    void run();
                                },
                                disabled: running,
                                className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2.5 text-[11px] font-black tracking-wide text-white shadow-[var(--lko-shadow-sm)] disabled:opacity-50",
                                children: running ? 'The forge dey run…' : `Run the forge (the ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CITY_SLA_MINUTES"]}-min SLA)`
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            running && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-1",
                                "data-testid": "forge-stages",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PIPELINE"].map((st, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-[10.5px] font-extrabold ${i <= stageIdx ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]/60'}`,
                                        children: [
                                            i < stageIdx ? '✓' : i === stageIdx ? '▸' : '·',
                                            " ",
                                            st.label,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold",
                                                children: [
                                                    "(",
                                                    st.startsAtMinute,
                                                    "–",
                                                    st.startsAtMinute + st.budgetMinutes,
                                                    " min)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                                lineNumber: 109,
                                                columnNumber: 80
                                            }, this)
                                        ]
                                    }, st.key, true, {
                                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    forge.ledger.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Forge Ledger"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    forge.ledger.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "forge-ledger",
                        children: forge.ledger.slice(-4).reverse().map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 rounded-lg bg-black/[0.02] px-2 py-1 text-[11px] font-bold first:mt-0",
                                children: [
                                    e.verdict === 'shipped' ? '✅' : '🚫',
                                    " ",
                                    e.city,
                                    " · ",
                                    e.version,
                                    " — QA ",
                                    e.qaScore,
                                    "/100 · ",
                                    e.totalMinutes,
                                    " min · Day ",
                                    e.atDay
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Pilot Ladder"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "forge-pilots",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PILOT_LADDER"].map((c)=>{
                            const votes = worldCounts[c.city] ?? 0;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 flex items-center justify-between rounded-xl bg-black/[0.02] px-2.5 py-2 first:mt-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-[12px] font-extrabold",
                                                children: [
                                                    c.name,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            "COL ",
                                                            c.colIndex
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 79
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)] capitalize",
                                                children: [
                                                    c.status,
                                                    votes > 0 ? ` · 🗳️ ${votes}` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                                lineNumber: 139,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, this),
                                    c.status === 'voting' || c.status === 'queued' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": `forge-vote-${c.city}`,
                                        onClick: async ()=>{
                                            const r = await forgeVote(c.city);
                                            if (!r.ok) say(r.why === 'capped' ? 'Your vote card full (3 cities).' : 'You don vote this one before.');
                                        },
                                        className: `lko-press shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${forge.votes.mine.includes(c.city) ? 'bg-[var(--lko-green)] text-white' : 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'}`,
                                        children: forge.votes.mine.includes(c.city) ? '✓ Voted' : 'Vote'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                        lineNumber: 142,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: "gold",
                                        children: c.status
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                        lineNumber: 153,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, c.city, true, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-dashed border-[var(--lko-green)]/40 bg-[var(--lko-green-soft)]/50 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11.5px] font-extrabold",
                                children: "🎓 YOUR CITY NEXT?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                children: "Student-drafted packs dey welcome — you draft the extract + the Culture Pack, the QA battery checks am, the nation votes. UGC at city scale."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            !account.linked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                children: "Claim your name to vote — the ballot dey check identity."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                                lineNumber: 166,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LawNote"], {
                        children: "The pipeline is pure law; the store records the ledger; the QA battery stands between every pack and ship. This UI never forges."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/ForgeApp.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_s(ForgeApp, "bAd9QJh9mHOwQHGRS0z+q7QRBVw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = ForgeApp;
var _c;
__turbopack_context__.k.register(_c, "ForgeApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/NationApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NationApp",
    ()=>NationApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M20 — THE NATION DASHBOARD (the ops app)
 * -----------------------------------------
 * The city's honest mirror: the live crowd (the worker's aggregate —
 * numbers, never people), the naira's liquidity ledger, the moderation
 * book (refusal counts — no text exists to read), the forge's ledger,
 * the live nation's health, and the OPS row (flags + telemetry opt-in
 * + the last-good deploy book).
 *
 * EVERY number here is a real local fact — the dashboard invents
 * nothing, rounds nothing up, and goes quiet when the books are empty.
 *
 * M24-UI wave 2 — the face: an ink-toned hero (the ops mirror), the
 * live nation as a three-tile strip, the crowd as district bars, the
 * naira weather as its ledger. Every number, every testid, every
 * honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/flags.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const WHY_LABELS = {
    'kid-text-refused': 'Kid mic (by law)',
    'word-wall': 'Word wall',
    'no-links-ever': 'No links ever',
    'too-long': 'Too long',
    empty: 'Empty',
    'guest-mic-dark': 'Guest mic dark'
};
function NationApp() {
    _s();
    const nation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[nation]": (s)=>s.nation
    }["NationApp.useGameStore[nation]"]);
    const snap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[snap]": (s)=>s.nationSnapshot
    }["NationApp.useGameStore[snap]"]);
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[path]": (s)=>s.nationPath
    }["NationApp.useGameStore[path]"]);
    const opsFlags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[opsFlags]": (s)=>s.opsFlags
    }["NationApp.useGameStore[opsFlags]"]);
    const liveWire = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[liveWire]": (s)=>s.liveWire
    }["NationApp.useGameStore[liveWire]"]);
    const live = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[live]": (s)=>s.live
    }["NationApp.useGameStore[live]"]);
    const forge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[forge]": (s)=>s.forge
    }["NationApp.useGameStore[forge]"]);
    const nationSetCrowd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[nationSetCrowd]": (s)=>s.nationSetCrowd
    }["NationApp.useGameStore[nationSetCrowd]"]);
    const opsSetFlag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[opsSetFlag]": (s)=>s.opsSetFlag
    }["NationApp.useGameStore[opsSetFlag]"]);
    const setTelemetryOptIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "NationApp.useGameStore[setTelemetryOptIn]": (s)=>s.setTelemetryOptIn
    }["NationApp.useGameStore[setTelemetryOptIn]"]);
    const [manifest, setManifest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NationApp.useEffect": ()=>{
            // deferred read — the deploy book is device-side, never on the SSR path
            const t = setTimeout({
                "NationApp.useEffect.t": ()=>setManifest((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readManifest"])())
            }["NationApp.useEffect.t"], 0);
            return ({
                "NationApp.useEffect": ()=>clearTimeout(t)
            })["NationApp.useEffect"];
        }
    }["NationApp.useEffect"], []);
    if (!nation) return null;
    const trend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inflationTrend"])(nation.inflation);
    const modRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["moderationScore"])(nation.moderation);
    const modTotal = nation.moderation.length;
    const lastForge = forge?.ledger && forge.ledger.length > 0 ? forge.ledger[forge.ledger.length - 1] : null;
    const presence = liveWire?.roster?.length ?? 0;
    const events = liveWire?.events?.length ?? 0;
    const liveStats = live?.stats;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "data-testid": "nation-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-2 pt-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                    id: "nation",
                    glyph: "🪙",
                    title: "Nation Dashboard",
                    sub: "The city's honest mirror — numbers only, no wahala",
                    hue: "ink",
                    wrap: true,
                    right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                        tone: snap ? 'ok' : nation.crowd.on ? 'warn' : 'plain',
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            "data-testid": "nation-crowd-path",
                            children: snap ? path === 'worker' ? 'worker thread' : 'main thread' : nation.crowd.on ? 'warming…' : 'asleep'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                            lineNumber: 78,
                            columnNumber: 15
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 77,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "nation-live",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: "Live Nation"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 grid grid-cols-3 gap-1.5 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-[var(--lko-river-soft)] px-1 py-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "lko-num text-[14px] font-black text-[var(--lko-river)]",
                                                children: presence
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[8.5px] font-bold text-[var(--lko-ink-soft)]",
                                                children: "present"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 93,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-[var(--lko-green-soft)] px-1 py-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "lko-num text-[14px] font-black text-[var(--lko-green-deep)]",
                                                children: events
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[8.5px] font-bold text-[var(--lko-ink-soft)]",
                                                children: "events"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 97,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-[var(--lko-gold-soft)] px-1 py-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "lko-num text-[14px] font-black text-[var(--lko-gold-deep)]",
                                                children: liveStats ? liveStats.tradesDone + liveStats.chats : 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 100,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[8.5px] font-bold text-[var(--lko-ink-soft)]",
                                                children: "my moves"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 101,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Crowd"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "nation-crowd",
                        children: [
                            snap ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-2 flex items-baseline gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-num text-[20px] font-black leading-none text-[var(--lko-green-deep)]",
                                                "data-testid": "nation-crowd-total",
                                                children: snap.total.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    "souls · mood ",
                                                    snap.avgMood,
                                                    " · pocket ₦",
                                                    snap.avgWealth.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 115,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: snap.districts.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                "data-testid": `nation-district-${d.id}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-[86px] shrink-0 truncate text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                                        children: d.id
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.05]",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-full rounded-full bg-[var(--lko-green)]",
                                                            style: {
                                                                width: `${Math.min(100, d.pop / snap.total * 100 * 4)}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-[92px] shrink-0 text-right text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            d.pop,
                                                            " · ",
                                                            d.top,
                                                            " · ",
                                                            d.mood
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, d.id, true, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 121,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: nation.crowd.on ? 'The nation dey wake…' : 'The crowd sleeps — wake am below.'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex items-center justify-between rounded-xl bg-[var(--lko-green-soft)] px-2.5 py-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                        children: "Crowd sim"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 142,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "data-testid": "nation-crowd-toggle",
                                        className: "lko-press rounded-lg bg-[var(--lko-green)] px-2.5 py-1 text-[9.5px] font-black text-white",
                                        onClick: ()=>nationSetCrowd(!nation.crowd.on),
                                        children: nation.crowd.on ? 'DARK AM' : 'WAKE AM'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Naira Weather"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "nation-inflation",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-1 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                        children: "The day-roll ledger"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    trend.rows > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `rounded-full px-2 py-0.5 text-[9px] font-black ${trend.hot ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`,
                                        "data-testid": "nation-inflation-trend",
                                        children: [
                                            "avg ×",
                                            trend.avg.toFixed(2),
                                            trend.hot ? ' HOT' : ' calm'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            nation.inflation.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "The ledger waits for the first day roll — the SAME channel the market reads."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: nation.inflation.slice(-6).reverse().map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1 text-[10px] font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[var(--lko-ink-soft)]",
                                                children: [
                                                    "Day ",
                                                    row.day
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: row.mult >= 1.1 ? 'text-red-700' : row.mult <= 0.95 ? 'text-[var(--lko-river)]' : 'text-[var(--lko-ink)]',
                                                children: [
                                                    "×",
                                                    row.mult.toFixed(2),
                                                    " ",
                                                    row.mult >= 1.12 ? '— prices dey bite' : row.mult >= 1.08 ? '— market hot' : row.mult <= 0.95 ? '— slow waka' : '— steady'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, row.day, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Moderation"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "nation-moderation",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-1 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                        children: "The refusal counts"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            modTotal,
                                            " refusals · words NEVER stored"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            modRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "Clean streets — nothing refused yet."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: modRows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1 text-[10px] font-bold",
                                        "data-testid": `nation-mod-${row.why}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[var(--lko-ink-soft)]",
                                                children: WHY_LABELS[row.why] ?? row.why
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[var(--lko-ink)]",
                                                children: [
                                                    "×",
                                                    row.count
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, row.why, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 195,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Forge"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "nation-forge",
                        children: lastForge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10.5px] font-bold text-[var(--lko-ink)]",
                            "data-testid": "nation-forge-last",
                            children: [
                                lastForge.verdict === 'shipped' ? '✅' : '🛑',
                                " ",
                                lastForge.city,
                                " · QA ",
                                lastForge.qaScore,
                                "/100 · ",
                                lastForge.totalMinutes,
                                "min · day ",
                                lastForge.atDay
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                            children: "The ledger is empty — run the forge."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Ops"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": "nation-ops",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                            children: "Telemetry"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                            lineNumber: 221,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "data-testid": "nation-telemetry-toggle",
                                            className: `lko-press rounded-lg px-2.5 py-1 text-[9.5px] font-black text-white ${nation.telemetryOptIn ? 'bg-[var(--lko-terra)]' : 'bg-[var(--lko-green)]'}`,
                                            onClick: ()=>setTelemetryOptIn(!nation.telemetryOptIn),
                                            children: nation.telemetryOptIn ? 'ON — quiet numbers' : 'OFF — yours only'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[9px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                    children: "Opt-in counts day-rolls and travels. A child's copy stays dark even if a flag says yes — the wall is structural."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this),
                                Object.keys(opsFlags).filter((k)=>k !== 'telemetryAsk').map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                                children: [
                                                    "flag: ",
                                                    k
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "data-testid": `nation-flag-${k}`,
                                                className: "lko-press rounded-lg bg-black/[0.05] px-2.5 py-1 text-[9.5px] font-black text-[var(--lko-ink)]",
                                                onClick: ()=>opsSetFlag(k, !opsFlags[k]),
                                                children: opsFlags[k] ? 'ON' : 'OFF'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                lineNumber: 237,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, k, true, {
                                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-black/[0.05] pt-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                            children: "Last-good deploys"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this),
                                        manifest.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[9px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: "The book fills as shells ship (one per boot)."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-0.5 space-y-0.5",
                                            children: manifest.slice(0, 3).map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between text-[9.5px] font-bold",
                                                    "data-testid": `nation-deploy-${i}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[var(--lko-ink)]",
                                                            children: [
                                                                i === 0 ? '● ' : '○ ',
                                                                row.version
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[var(--lko-ink-soft)]",
                                                            children: new Date(row.at).toLocaleDateString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, `${row.version}-${i}`, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-[9px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: "Rollback na one command: bun run ops:rollback"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/NationApp.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(NationApp, "ZMxAkJ9dOuP2lv+ORefKSHEUov4=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = NationApp;
var _c;
__turbopack_context__.k.register(_c, "NationApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_game_screens_phone_1e625a74._.js.map