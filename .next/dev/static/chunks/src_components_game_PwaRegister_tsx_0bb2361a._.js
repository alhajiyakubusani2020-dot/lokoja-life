(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/PwaRegister.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PwaRegister",
    ()=>PwaRegister
]);
/**
 * LOKOJA LIFE — M16: THE SILK REGISTER
 * -------------------------------------
 * Mounts the service worker the polite way: after the page is
 * interactive, on idle, so the registration never competes with the
 * first paint (the 3-second law applies to the worker too).
 *
 * THE UPDATE LAW: when a new worker is waiting, we do NOT force a
 * hard reload mid-life — the new version takes the wheel on the next
 * boot (a game session is minutes, not hours; the strand sweep on
 * activate keeps every old cache honest).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function PwaRegister() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PwaRegister.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!('serviceWorker' in navigator)) return;
            const w = window;
            if (w.__lkoSwRegistered) return;
            w.__lkoSwRegistered = true;
            const register = {
                "PwaRegister.useEffect.register": ()=>{
                    navigator.serviceWorker.register('/sw.js', {
                        scope: '/'
                    }).then({
                        "PwaRegister.useEffect.register": ()=>{
                            // M20 — THE LAST-GOOD BOOK: record the deployed shell version
                            // (read from the served worker source, never invented). The
                            // Nation Dashboard + the rollback command read this book.
                            fetch('/sw.js', {
                                cache: 'no-store'
                            }).then({
                                "PwaRegister.useEffect.register": (res)=>res.ok ? res.text() : ''
                            }["PwaRegister.useEffect.register"]).then({
                                "PwaRegister.useEffect.register": (src)=>{
                                    const m = /SW_VERSION\s*=\s*'([^']+)'/.exec(src);
                                    if (m && m[1]) {
                                        // dynamic import — flags.ts is device-side ops, the register never blocks on it
                                        __turbopack_context__.A("[project]/src/game/systems/flags.ts [app-client] (ecmascript, async loader)").then({
                                            "PwaRegister.useEffect.register": (f)=>f.recordDeploy(m[1])
                                        }["PwaRegister.useEffect.register"]).catch({
                                            "PwaRegister.useEffect.register": ()=>{}
                                        }["PwaRegister.useEffect.register"]);
                                    }
                                }
                            }["PwaRegister.useEffect.register"]).catch({
                                "PwaRegister.useEffect.register": ()=>{}
                            }["PwaRegister.useEffect.register"]);
                        }
                    }["PwaRegister.useEffect.register"]).catch({
                        "PwaRegister.useEffect.register": ()=>{
                            // a refused worker is a silent downgrade to the normal web —
                            // the game still runs; offline-first is a gift, not a gate
                            w.__lkoSwRegistered = false;
                        }
                    }["PwaRegister.useEffect.register"]);
                }
            }["PwaRegister.useEffect.register"];
            // idle-register: the shell paints first, the worker joins after
            const idle = window.requestIdleCallback;
            if (typeof idle === 'function') {
                idle(register, {
                    timeout: 4000
                });
            } else {
                const t = window.setTimeout(register, 1500);
                return ({
                    "PwaRegister.useEffect": ()=>window.clearTimeout(t)
                })["PwaRegister.useEffect"];
            }
        }
    }["PwaRegister.useEffect"], []);
    return null;
}
_s(PwaRegister, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = PwaRegister;
var _c;
__turbopack_context__.k.register(_c, "PwaRegister");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_game_PwaRegister_tsx_0bb2361a._.js.map