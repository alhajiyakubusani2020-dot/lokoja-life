module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/src/game/data/avatar.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Avatar customisation data
 * ---------------------------------------
 * All character-creation options live here so new options
 * (cosmetics shop, Loko Gems items, premium styles) can be added
 * later purely through data + a `premium` flag.
 */ __turbopack_context__.s([
    "AVATAR_CLOTHING_STYLES",
    ()=>AVATAR_CLOTHING_STYLES,
    "AVATAR_HAIRSTYLES",
    ()=>AVATAR_HAIRSTYLES,
    "CLOTHING_COLORS",
    ()=>CLOTHING_COLORS,
    "DEFAULT_AVATAR",
    ()=>DEFAULT_AVATAR,
    "HAIR_COLORS",
    ()=>HAIR_COLORS,
    "SKIN_TONES",
    ()=>SKIN_TONES
]);
const SKIN_TONES = [
    {
        key: 'deep-ebony',
        label: 'Deep Ebony',
        value: '#4A2C17'
    },
    {
        key: 'dark-brown',
        label: 'Dark Brown',
        value: '#5C3A21'
    },
    {
        key: 'rich-brown',
        label: 'Rich Brown',
        value: '#6E4326'
    },
    {
        key: 'warm-brown',
        label: 'Warm Brown',
        value: '#8A5A32'
    },
    {
        key: 'light-brown',
        label: 'Light Brown',
        value: '#A9714B'
    },
    {
        key: 'pale-brown',
        label: 'Pale Brown',
        value: '#C08A5E'
    }
];
const HAIR_COLORS = [
    {
        key: 'black',
        label: 'Black',
        value: '#1A1714'
    },
    {
        key: 'dark-brown',
        label: 'Dark Brown',
        value: '#2E1D12'
    },
    {
        key: 'burgundy',
        label: 'Burgundy',
        value: '#5C2330'
    },
    {
        key: 'honey',
        label: 'Honey Blonde',
        value: '#8A6A3B'
    },
    {
        key: 'gold-dye',
        label: 'Gold Dye',
        value: '#B79545'
    }
];
const AVATAR_HAIRSTYLES = [
    {
        key: 'bald',
        label: 'Bald',
        gender: 'all'
    },
    {
        key: 'low-cut',
        label: 'Low Cut',
        gender: 'all'
    },
    {
        key: 'waves',
        label: 'Waves',
        gender: 'all'
    },
    {
        key: 'afro',
        label: 'Afro',
        gender: 'all'
    },
    {
        key: 'cornrows',
        label: 'Cornrows',
        gender: 'all'
    },
    {
        key: 'dreads',
        label: 'Dreads',
        gender: 'all'
    },
    {
        key: 'braids',
        label: 'Long Braids',
        gender: 'all'
    },
    {
        key: 'puffs',
        label: 'Two Puffs',
        gender: 'all'
    }
];
const AVATAR_CLOTHING_STYLES = [
    {
        key: 'tshirt',
        label: 'T-Shirt',
        description: 'Everyday hustle wear'
    },
    {
        key: 'kaftan',
        label: 'Kaftan',
        description: 'Clean traditional look'
    },
    {
        key: 'ankara',
        label: 'Ankara Print',
        description: 'Full pattern flex'
    },
    {
        key: 'senator',
        label: 'Senator Wear',
        description: 'Sharp for business'
    },
    {
        key: 'hoodie',
        label: 'Hoodie',
        description: 'Street hoodie — blessed and chilly'
    },
    {
        key: 'lace',
        label: 'Lace',
        description: 'Lace grandeur — occasion wear'
    }
];
const CLOTHING_COLORS = [
    {
        key: 'forest',
        label: 'Forest Green',
        value: '#1B7A43'
    },
    {
        key: 'gold',
        label: 'Amber Gold',
        value: '#E8A317'
    },
    {
        key: 'terra',
        label: 'Terracotta',
        value: '#C4562A'
    },
    {
        key: 'oxblood',
        label: 'Oxblood',
        value: '#7C2D2D'
    },
    {
        key: 'cream',
        label: 'Cream',
        value: '#F1E3C8'
    },
    {
        key: 'charcoal',
        label: 'Charcoal',
        value: '#33332E'
    }
];
const DEFAULT_AVATAR = {
    skinTone: '#6E4326',
    hairColor: '#1A1714',
    hairstyle: 'low-cut',
    clothingStyle: 'tshirt',
    clothingColor: '#1B7A43'
};
}),
"[project]/src/game/systems/profile.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_LOOK_JSON",
    ()=>DEFAULT_LOOK_JSON,
    "GUEST_PREVIEW_MS",
    ()=>GUEST_PREVIEW_MS,
    "defaultLook",
    ()=>defaultLook,
    "previewState",
    ()=>previewState,
    "profilePatchVerdict",
    ()=>profilePatchVerdict,
    "profileVerdict",
    ()=>profileVerdict,
    "sanitizeProfilePublic",
    ()=>sanitizeProfilePublic,
    "validateAvatarLook",
    ()=>validateAvatarLook,
    "validateBio",
    ()=>validateBio,
    "validateDisplayName",
    ()=>validateDisplayName
]);
/**
 * LOKOJA LIFE — M24 W1: THE REGISTER (pure profile laws)
 * =======================================================
 * What the street sees. The claim door now collects the WHOLE face:
 * handle + PIN + birthday (the band law, untouched) + DISPLAY NAME +
 * AVATAR LOOK (+ optional bio) → the ProfileRow. The avatar look rides
 * the REAL vocabularies from data/avatar.ts — the same words the
 * CharacterCreation speaks and the W2 remote-body renderer will draw —
 * so what you design at signup is what the city sees walking.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. The API
 *    doors import the SAME functions (the M17 law-vault doctrine: the
 *    browser and the server can never disagree about a verdict).
 *  - The vocabulary law: every look value must exist in the REAL
 *    option arrays. A hex we never minted or a style key we never
 *    named refuses at the door — no invented bodies on the street.
 *  - THE PREVIEW LAW: a guest walks FREE for exactly 60 seconds, then
 *    the wall stands. Not a dead end — a door (claim, or the menu).
 *  - Contact is optional and nullable (the v2 register law): the M13
 *    minor shield never collects it; adults MAY give a recovery line,
 *    validated-if-present, never demanded.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-route] (ecmascript)");
;
/** The REAL vocabulary values, as sets — O(1) door checks, one truth. */ const SKIN_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SKIN_TONES"].map((o)=>o.value));
const HAIR_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HAIR_COLORS"].map((o)=>o.value));
const HAIR_KEYS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AVATAR_HAIRSTYLES"].map((o)=>o.key));
const CLOTHING_STYLE_KEYS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].map((o)=>o.key));
const CLOTHING_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLOTHING_COLORS"].map((o)=>o.value));
const DEFAULT_LOOK_JSON = JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"]);
function defaultLook() {
    return {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"]
    };
}
function isLookShape(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function str(v) {
    return typeof v === 'string' ? v : '';
}
function validateAvatarLook(raw) {
    let v = raw;
    if (typeof raw === 'string') {
        if (raw.length > 500) return {
            ok: false,
            why: 'The look payload is too heavy.'
        };
        try {
            v = JSON.parse(raw);
        } catch  {
            return {
                ok: false,
                why: 'The look is not a valid payload.'
            };
        }
    }
    if (!isLookShape(v)) return {
        ok: false,
        why: 'The look is not a valid payload.'
    };
    const skinTone = str(v.skinTone);
    const hairColor = str(v.hairColor);
    const hairstyle = str(v.hairstyle);
    const clothingStyle = str(v.clothingStyle);
    const clothingColor = str(v.clothingColor);
    if (!SKIN_VALUES.has(skinTone)) return {
        ok: false,
        why: 'Pick a skin tone from the real shades.'
    };
    if (!HAIR_VALUES.has(hairColor)) return {
        ok: false,
        why: 'Pick a hair colour from the real shades.'
    };
    if (!HAIR_KEYS.has(hairstyle)) return {
        ok: false,
        why: 'Pick a hairstyle the barber knows.'
    };
    if (!CLOTHING_STYLE_KEYS.has(clothingStyle)) return {
        ok: false,
        why: 'Pick a clothing style the tailor knows.'
    };
    if (!CLOTHING_VALUES.has(clothingColor)) return {
        ok: false,
        why: 'Pick a clothing colour from the real palette.'
    };
    return {
        ok: true,
        why: '',
        look: {
            skinTone,
            hairColor,
            hairstyle,
            clothingStyle,
            clothingColor
        }
    };
}
function validateDisplayName(name) {
    const n = name.trim().replace(/\s+/g, ' ');
    if (n.length < 2 || n.length > 24) return {
        ok: false,
        why: 'Display name must be 2–24 characters.'
    };
    // printable, no control chars / newlines — one line the roster can render
    if (/[\u0000-\u001F\u007F]/.test(n)) return {
        ok: false,
        why: 'Letters, numbers and plain punctuation only.'
    };
    if (/^[\p{P}\p{S}\s]+$/u.test(n)) return {
        ok: false,
        why: 'A name needs at least one letter or number.'
    };
    return {
        ok: true,
        why: ''
    };
}
function validateBio(bio) {
    const b = bio.trim();
    if (b.length > 280) return {
        ok: false,
        why: 'Bio must be 280 characters or fewer.'
    };
    if (/[\u0000-\u001F\u007F]/.test(b)) return {
        ok: false,
        why: 'Plain text only — no control characters.'
    };
    return {
        ok: true,
        why: ''
    };
}
function profileVerdict(input) {
    const vName = validateDisplayName(input.displayName ?? '');
    if (!vName.ok) return {
        ok: false,
        why: vName.why
    };
    const vBio = validateBio(input.bio ?? '');
    if (!vBio.ok) return {
        ok: false,
        why: vBio.why
    };
    const vLook = validateAvatarLook(input.avatarLook ?? '');
    if (!vLook.ok || !vLook.look) return {
        ok: false,
        why: vLook.why
    };
    return {
        ok: true,
        why: '',
        displayName: input.displayName.trim().replace(/\s+/g, ' '),
        bio: (input.bio ?? '').trim() || undefined,
        look: vLook.look
    };
}
function profilePatchVerdict(patch) {
    const vName = patch.displayName === undefined ? {
        ok: true,
        why: ''
    } : validateDisplayName(patch.displayName);
    if (!vName.ok) return {
        ok: false,
        why: vName.why
    };
    const vBio = patch.bio === undefined ? {
        ok: true,
        why: ''
    } : validateBio(patch.bio);
    if (!vBio.ok) return {
        ok: false,
        why: vBio.why
    };
    // THE ABSENT-FIELD LAW: an absent look means "keep mine" — its branch
    // carries look: undefined and the guard must NOT mistake that for a
    // refusal (only a PRESENT look must parse to a whole shape).
    const vLook = patch.avatarLook === undefined ? {
        ok: true,
        why: '',
        look: undefined
    } : validateAvatarLook(patch.avatarLook);
    if (!vLook.ok) return {
        ok: false,
        why: vLook.why
    };
    return {
        ok: true,
        why: '',
        displayName: patch.displayName === undefined ? undefined : patch.displayName.trim().replace(/\s+/g, ' '),
        bio: patch.bio === undefined ? undefined : patch.bio.trim() || '',
        look: vLook.look
    };
}
const GUEST_PREVIEW_MS = 60_000;
function previewState(startedAt, now) {
    if (!startedAt || startedAt <= 0) return {
        remainingMs: GUEST_PREVIEW_MS,
        expired: false,
        fraction: 1
    };
    const elapsed = Math.max(0, now - startedAt);
    const remainingMs = Math.max(0, GUEST_PREVIEW_MS - elapsed);
    return {
        remainingMs,
        expired: remainingMs === 0,
        fraction: Math.max(0, Math.min(1, remainingMs / GUEST_PREVIEW_MS))
    };
}
function sanitizeProfilePublic(row) {
    return {
        handle: row.handle,
        displayName: row.displayName,
        avatarLook: row.avatarLook,
        bio: row.bio ?? null
    };
}
}),
"[project]/src/lib/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — PH2.5 THE THROTTLE LAW (src/lib/rate-limit.ts)
 * ============================================================
 * The brute-force wall for the trust doors: login, tier, the wallet PIN
 * lane, and the cloud vault's read/write doors. Two mechanisms:
 *
 *  1. THE FIXED WINDOW (takeToken) — a hard ceiling on requests per key
 *     per window (`Map<key, { count, resetAt }>`). Used for volume doors
 *     (tier probes, cloud push/pull floods) where even HONEST traffic
 *     must not exceed the cap.
 *  2. THE FAILURE LOCKOUT (recordFailure / isLockedOut) — a failure
 *     counter per key per window with EXPONENTIAL BACKOFF: once
 *     `maxFails` failures are recorded inside the window, the key is
 *     locked for `baseLockMs * 2^(fails - maxFails)` (capped at
 *     `maxLockMs`). Every lockout expiry that meets a fresh failure
 *     doubles the next lock. Used for credential doors (login, PIN)
 *     where only FAILURES count — a correct password/PIN clears the
 *     book (clearFailures).
 *
 * THE KEY LAW: keys are built as `${kind}:${part}|${part}` via rlKey().
 * Identity parts come from the request itself — the handle (when the
 * caller declares one) AND the IP (x-forwarded-for's first hop, then
 * x-real-ip, else 'local'). Both parts are throttled TOGETHER: a
 * botnet of one handle from many IPs still trips the handle half; one
 * IP hammering many handles still trips the IP half (for per-IP doors
 * like tier, pass only the IP).
 *
 * SCOPE LAW — SINGLE INSTANCE: every bucket lives in THIS process's
 * memory. Behind one Next.js server (the deployment shape of this
 * project) the limits below are exact. Behind N instances the wall is
 * N× softer (each process counts its own map) — a shared store (Redis)
 * is the upgrade path, deliberately not built here: no new dependency
 * on a hot path that must never fail closed for honest players.
 *
 * FAIL-SAFE LAW: every map is bounded (MAX_KEYS) and prunes expired
 * entries opportunistically — a flood cannot OOM the relay.
 */ /** Production constants — the doors pass these; the unit probe passes
 *  its own tiny windows so the backoff math is verified in milliseconds. */ __turbopack_context__.s([
    "RL_LIMITS",
    ()=>RL_LIMITS,
    "__lockState",
    ()=>__lockState,
    "clearFailures",
    ()=>clearFailures,
    "ipOf",
    ()=>ipOf,
    "isLockedOut",
    ()=>isLockedOut,
    "recordFailure",
    ()=>recordFailure,
    "rlKey",
    ()=>rlKey,
    "takeToken",
    ()=>takeToken
]);
const RL_LIMITS = {
    /** auth/login — ≤5 failure RESPONSES / 15min per handle+IP (4 recorded
   *  failures arm the lock; the 5th bad attempt is refused, so at most 5
   *  failure responses ever leave the door per window). */ LOGIN_FAIL_WINDOW_MS: 15 * 60_000,
    LOGIN_MAX_FAILS: 4,
    LOGIN_BASE_LOCK_MS: 30_000,
    LOGIN_MAX_LOCK_MS: 15 * 60_000,
    /** auth/tier — ≤10/min/IP (a probe door, not a credential door). */ TIER_WINDOW_MS: 60_000,
    TIER_MAX_PER_WINDOW: 10,
    /** wallet PIN inside /api/live/action — ≤5 failure RESPONSES / 15min
   *  per handle (same 4-recorded-failures arm as login). */ PIN_FAIL_WINDOW_MS: 15 * 60_000,
    PIN_MAX_FAILS: 4,
    PIN_BASE_LOCK_MS: 30_000,
    PIN_MAX_LOCK_MS: 15 * 60_000,
    /** cloud/push — ≤30 writes/hour/account. */ PUSH_WINDOW_MS: 3_600_000,
    PUSH_MAX_PER_WINDOW: 30,
    /** cloud/pull — ≤60 reads/hour/account. */ PULL_WINDOW_MS: 3_600_000,
    PULL_MAX_PER_WINDOW: 60,
    /** auth/register — row-growth guard, generous for one household. */ REGISTER_WINDOW_MS: 15 * 60_000,
    REGISTER_MAX_PER_WINDOW: 10
};
const windows = new Map();
const locks = new Map();
const MAX_KEYS = 10_000;
function ipOf(req) {
    const xf = req.headers.get('x-forwarded-for');
    if (xf) {
        const first = xf.split(',')[0]?.trim();
        if (first) return first;
    }
    return req.headers.get('x-real-ip')?.trim() || 'local';
}
function rlKey(kind, parts) {
    return `${kind}:${parts.map((p)=>p && p.length > 0 ? p : '-').join('|')}`;
}
function pruneExpired(now) {
    for (const [k, w] of windows)if (now >= w.resetAt) windows.delete(k);
    for (const [k, s] of locks){
        // a lock that expired AND whose failure window is a day cold can never re-arm
        if (s.lockedUntil <= now && now - s.windowStart > 24 * 3_600_000) locks.delete(k);
    }
}
function takeToken(key, limit, windowMs) {
    const now = Date.now();
    let w = windows.get(key);
    if (!w || now >= w.resetAt) {
        w = {
            count: 0,
            resetAt: now + windowMs
        };
        windows.set(key, w);
        if (windows.size > MAX_KEYS) pruneExpired(now);
    }
    w.count++;
    if (w.count > limit) return {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((w.resetAt - now) / 1000))
    };
    return {
        ok: true,
        retryAfterSec: 0
    };
}
function isLockedOut(key) {
    const now = Date.now();
    const s = locks.get(key);
    if (!s) return {
        locked: false,
        retryAfterSec: 0,
        fails: 0
    };
    if (s.lockedUntil > now) {
        return {
            locked: true,
            retryAfterSec: Math.max(1, Math.ceil((s.lockedUntil - now) / 1000)),
            fails: s.fails
        };
    }
    return {
        locked: false,
        retryAfterSec: 0,
        fails: s.fails
    };
}
function recordFailure(key, opts) {
    const now = Date.now();
    let s = locks.get(key);
    if (!s || now - s.windowStart >= opts.windowMs) {
        s = {
            fails: 0,
            windowStart: now,
            lockedUntil: 0
        };
        locks.set(key, s);
        if (locks.size > MAX_KEYS) pruneExpired(now);
    }
    s.fails++;
    if (s.fails >= opts.maxFails) {
        const over = s.fails - opts.maxFails;
        const lock = Math.min(opts.baseLockMs * 2 ** over, opts.maxLockMs);
        if (now + lock > s.lockedUntil) s.lockedUntil = now + lock;
    }
    return isLockedOut(key);
}
function clearFailures(key) {
    locks.delete(key);
}
function __lockState(key) {
    const s = locks.get(key);
    return {
        lockedUntil: s?.lockedUntil ?? 0,
        fails: s?.fails ?? 0
    };
}
}),
"[project]/src/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "verifyParentPin",
    ()=>verifyParentPin,
    "verifyPin",
    ()=>verifyPin
]);
/**
 * LOKOJA LIFE — M9 Guest Loop: /api/auth/register
 * Claims a name on the city's register. Handles + contacts are unique;
 * the PIN hashes with a per-account salt (scrypt); a session token comes
 * back as the cloud vault's bearer. The register never sees the PIN itself.
 *
 * M13 — THE FAMILY SHIELD: a minor account (kid/teen) only exists behind
 * a parent's 6-digit PIN (scrypt, its own salt) and collects NOTHING —
 * no contact, no recovery line, no address. The contact column stays
 * null; the parent PIN is the only key a minor account answers to.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rate-limit.ts [app-route] (ecmascript)");
;
;
;
;
;
const HANDLE_RE = /^[a-zA-Z0-9_]{3,16}$/;
const PIN_RE = /^\d{4,8}$/;
const PARENT_PIN_RE = /^\d{6}$/;
const PHONE_RE = /^\+?\d{7,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function POST(req) {
    try {
        // PH2.5 THE THROTTLE LAW — the register mints rows: ≤10 claims / 15min
        // per IP (a generous household cap — row growth is the abuse here).
        const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["takeToken"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rlKey"])('register', [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ipOf"])(req)
        ]), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RL_LIMITS"].REGISTER_MAX_PER_WINDOW, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RL_LIMITS"].REGISTER_WINDOW_MS);
        if (!gate.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: 'too-many-attempts'
            }, {
                status: 429,
                headers: {
                    'Retry-After': String(gate.retryAfterSec)
                }
            });
        }
        const body = await req.json().catch(()=>({}));
        const handle = (body.handle ?? '').trim();
        const contact = (body.contact ?? '').trim();
        const pin = body.pin ?? '';
        const ageBand = [
            'kid',
            'teen',
            'adult'
        ].includes(body.ageBand ?? '') ? body.ageBand : 'adult';
        const minor = ageBand !== 'adult';
        if (!HANDLE_RE.test(handle)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: 'Name must be 3–16 letters, numbers, underscore.'
        }, {
            status: 400
        });
        if (!PIN_RE.test(pin)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: 'PIN must be 4–8 digits.'
        }, {
            status: 400
        });
        // W1 — THE FACE LAW: the claim carries the whole profile. The SAME
        // pure verdict the sheet ran runs here — neither side can drift.
        const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["profileVerdict"])({
            displayName: body.displayName ?? '',
            avatarLook: body.avatarLook ?? '',
            bio: body.bio ?? ''
        });
        if (!profile.ok) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: profile.why
        }, {
            status: 400
        });
        // M13 — the minor register law: parent PIN required, contact FORBIDDEN
        let parentPinHash = null;
        let parentSalt = null;
        if (minor) {
            const parentPin = body.parentPin ?? '';
            if (!PARENT_PIN_RE.test(parentPin)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: false,
                    why: 'A parent must set the shield PIN — exactly 6 digits.'
                }, {
                    status: 400
                });
            }
            if (parentPin === pin) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: false,
                    why: 'The parent PIN must differ from the account PIN.'
                }, {
                    status: 400
                });
            }
            parentSalt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString('hex');
            parentPinHash = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scryptSync"])(parentPin, parentSalt, 32).toString('hex');
        } else if (contact) {
            // W1 — the v2 register law: contact is OPTIONAL and nullable
            // (validated-if-present, never demanded). The M13 minor shield
            // never collects it; adults MAY leave a recovery line.
            if (!PHONE_RE.test(contact) && !EMAIL_RE.test(contact)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: false,
                    why: 'That phone/email no valid — or leave am empty.'
                }, {
                    status: 400
                });
            }
        }
        // minors have no contact — uniqueness rides the handle alone
        const exists = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].account.findFirst({
            where: minor || !contact ? {
                handle
            } : {
                OR: [
                    {
                        handle
                    },
                    {
                        contact
                    }
                ]
            }
        });
        if (exists) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: exists.handle === handle ? 'That name don dey the register already — login instead.' : 'That phone/email don get an account — login instead.'
            }, {
                status: 409
            });
        }
        const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString('hex');
        const pinHash = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scryptSync"])(pin, salt, 32).toString('hex');
        const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(24).toString('hex');
        // W1 — THE BIRTH LAW: the identity and its face are born together.
        // One transaction: if the profile row cannot exist, the account
        // does not either — no faceless citizens on the street.
        const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
            const account = await tx.account.create({
                data: {
                    handle,
                    // M13 — zero collection: the minor's contact never touches the disk
                    contact: minor ? null : contact || null,
                    pinHash,
                    salt,
                    ageBand,
                    parentPinHash,
                    parentSalt,
                    token
                },
                select: {
                    id: true,
                    handle: true
                }
            });
            await tx.profileRow.create({
                data: {
                    accountId: account.id,
                    handle: account.handle,
                    displayName: profile.displayName,
                    avatarLook: JSON.stringify(profile.look),
                    bio: profile.bio ?? null
                }
            });
            return account;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            token,
            profile: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeProfilePublic"])({
                handle: created.handle,
                displayName: profile.displayName,
                avatarLook: JSON.stringify(profile.look),
                bio: profile.bio ?? null
            })
        });
    } catch (e) {
        console.error('[register] FAILED:', JSON.stringify({
            name: e?.name,
            msg: e?.message,
            code: e?.code,
            stack: e?.stack?.slice(0, 400)
        }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: 'The register no gree — try again.'
        }, {
            status: 500
        });
    }
}
function verifyPin(pin, salt, pinHash) {
    try {
        const candidate = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scryptSync"])(pin, salt, 32);
        const stored = Buffer.from(pinHash, 'hex');
        return candidate.length === stored.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(candidate, stored);
    } catch  {
        return false;
    }
}
function verifyParentPin(pin, salt, pinHash) {
    if (!salt || !pinHash) return false;
    return verifyPin(pin, salt, pinHash);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b3e50b66._.js.map