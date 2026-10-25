module.exports = [
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
"[project]/src/components/game/world/atmosphere.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — World Atmosphere (Stage 3D)
 * -------------------------------------------
 * Maps the REAL world clock (world.timeOfDay) + weather to lighting,
 * sky, fog and night-glow parameters. Pure derivation — no second
 * time system: if the store says "evening", Lokoja looks like evening.
 */ __turbopack_context__.s([
    "atmoLive",
    ()=>atmoLive,
    "getAtmosphere",
    ()=>getAtmosphere,
    "sunVec",
    ()=>sunVec
]);
const KEYFRAMES = {
    morning: {
        // golden Harmattan sunrise — long warm light across the savanna
        sunDir: [
            0.74,
            0.42,
            0.32
        ],
        sunColor: '#ffce8a',
        sunIntensity: 2.9,
        hemiSky: '#a9cbe4',
        hemiGround: '#b29468',
        hemiIntensity: 0.88,
        skyTop: '#5fa3d4',
        skyHorizon: '#f2d9a4',
        fogColor: '#e8d5ae',
        fogDensity: 0.0036,
        nightGlow: 0.04,
        stars: 0,
        showMoon: false,
        sunsetBand: 0.35
    },
    afternoon: {
        // high hot light, but gently warm — never flat white
        sunDir: [
            0.25,
            0.94,
            -0.2
        ],
        sunColor: '#fff2d0',
        sunIntensity: 3.2,
        hemiSky: '#b4d8e8',
        hemiGround: '#a68e5c',
        hemiIntensity: 1.05,
        skyTop: '#4f9fd8',
        skyHorizon: '#cfe4d4',
        fogColor: '#d8e4d0',
        fogDensity: 0.0028,
        nightGlow: 0,
        stars: 0,
        showMoon: false,
        sunsetBand: 0
    },
    evening: {
        // M19 — THE CONFLUENCE SUNSET, the viral shot: the Niger turns liquid
        // amber, the horizon burns rose-gold under the harmattan haze, and the
        // whole town glows like the inside of a lantern.
        sunDir: [
            -0.85,
            0.16,
            0.26
        ],
        sunColor: '#ff7e3c',
        sunIntensity: 2.75,
        hemiSky: '#c98d5e',
        hemiGround: '#6a4c38',
        hemiIntensity: 0.62,
        skyTop: '#3f4a8e',
        skyHorizon: '#ff9a4e',
        fogColor: '#e09a5e',
        fogDensity: 0.0050,
        nightGlow: 0.65,
        stars: 0.25,
        showMoon: false,
        sunsetBand: 1
    },
    night: {
        // deep blue night; sodium streetlight pools + lit windows carry the town
        sunDir: [
            -0.35,
            0.72,
            -0.55
        ],
        sunColor: '#8fa8dc',
        sunIntensity: 0.8,
        hemiSky: '#2c3a62',
        hemiGround: '#222a38',
        hemiIntensity: 0.6,
        skyTop: '#0a1230',
        skyHorizon: '#1e2c50',
        fogColor: '#161f3a',
        fogDensity: 0.0046,
        nightGlow: 1,
        stars: 1,
        showMoon: true,
        sunsetBand: 0
    }
};
function getAtmosphere(timeOfDay, weather) {
    const base = {
        ...KEYFRAMES[timeOfDay]
    };
    if (weather === 'rain') {
        base.sunIntensity *= 0.4;
        base.hemiIntensity *= 0.8;
        base.fogDensity *= 2.1;
        base.fogColor = '#9aa89e';
        base.skyTop = '#6a7a76';
        base.skyHorizon = '#9aa89a';
        base.nightGlow = Math.max(base.nightGlow, 0.45);
        base.stars = 0;
        base.sunsetBand = 0; // M19 — rain owns the horizon
    } else if (weather === 'cloudy') {
        base.sunIntensity *= 0.68;
        base.fogDensity *= 1.45;
        base.fogColor = '#c2c9b8';
        base.skyTop = '#8a9a94';
        base.skyHorizon = '#c2c9b4';
        base.stars = 0;
        base.sunsetBand *= 0.3; // M19 — the band survives, dulled
    } else if (weather === 'harmattan') {
        // M6 — the Sahara's dust rides the dry season: a pale ochre wash, the
        // sun a dim orange coin, visibility cut hard. The city feels muffled.
        base.sunIntensity *= 0.62;
        base.sunColor = '#e8a45e';
        base.hemiIntensity *= 0.9;
        base.fogDensity *= 2.6;
        base.fogColor = '#d9c09a';
        base.skyTop = '#b7a37e';
        base.skyHorizon = '#e3cda4';
        base.stars = 0;
        // M19 — harmattan SUNSETS are the famous ones: dust scatters the band
        // wider and redder. Harmattan mornings keep their soft gold.
        base.sunsetBand = Math.max(base.sunsetBand, timeOfDay === 'evening' ? 1 : 0.2);
    } else if (weather === 'storm') {
        // M6 — a confluence thunderstorm: rain turned to eleven. Near-dark
        // noon, green-grey sky, the town's windows fighting back.
        base.sunIntensity *= 0.24;
        base.hemiIntensity *= 0.7;
        base.fogDensity *= 2.9;
        base.fogColor = '#6e7d78';
        base.skyTop = '#3c4a4a';
        base.skyHorizon = '#77857c';
        base.nightGlow = Math.max(base.nightGlow, 0.55);
        base.stars = 0;
        base.sunsetBand = 0;
    } else if (weather === 'flood') {
        // M6 — flood watch: the rivers own the day. Heavy grey-green veil,
        // soaked light, the town holding its breath.
        base.sunIntensity *= 0.32;
        base.hemiIntensity *= 0.74;
        base.fogDensity *= 2.4;
        base.fogColor = '#7d8a80';
        base.skyTop = '#44524e';
        base.skyHorizon = '#8a9488';
        base.nightGlow = Math.max(base.nightGlow, 0.5);
        base.stars = 0;
        base.sunsetBand = 0;
    } else if (weather === 'night-clear' && timeOfDay === 'night') {
        base.stars = 1;
    }
    return base;
}
function sunVec(dir) {
    const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
    return [
        dir[0] / len,
        dir[1] / len,
        dir[2] / len
    ];
}
const atmoLive = {
    nightGlow: 0,
    fogColor: '#d6e5d8',
    /** M19 — the eased sunset-band strength (sky shader reads it) */ sunsetBand: 0,
    /** M19 — 0..1 flood presence for the water veil (weather==='flood' eases in) */ flood: 0,
    /** M19 — the live weather string (polish layers read without React) */ weather: 'sunny'
};
}),
"[project]/src/components/game/world/flora-shader.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M23 W2: THE GREEN (the flora shader)
 * ---------------------------------------------------
 * The whole vegetation layer breathes through ONE shared shader state:
 *  • WIND — a vertex-shader sway (two sine bands + a slow drift, the
 *    classic three-frequency gust curve) whose phase is derived from the
 *    instance's world position inside the shader itself, so every tree
 *    and grass tuft swings on its own clock at ZERO CPU cost. No
 *    per-frame matrix writes, no allocation, no CPU phase tables.
 *  • WEATHER — the M6 weather law the city already obeys reaches the
 *    leaves: harmattan golds the crowns (the dry-season savanna look),
 *    the rain family deepens them toward lush. The dry target eases in
 *    over ~2s when the day rolls — vegetation never pops.
 *
 * The injection is `onBeforeCompile` over MeshStandardMaterial so the
 * standard lighting/shadow pipeline survives untouched. Trees and grass
 * share the same uniform OBJECTS (uTime/uDry), so one per-frame write
 * drives every flora draw call. The leaf mask (aLeaf) keeps the gold off
 * the wood; the sway weight (aSway) keeps the ground rigid.
 *
 * LAWS OF THIS FILE:
 *  - Zero per-frame allocation; the only per-frame work is two uniform
 *    writes inside stepFlora.
 *  - No React: the dry target reads atmoLive.weather (the M19 live
 *    weather the AtmosphereController already publishes every frame).
 *  - The shader never invents data: aSway/aLeaf come baked from the
 *    species geometry (flora-species.ts) and the grass tuft builder.
 */ __turbopack_context__.s([
    "applyFloraShader",
    ()=>applyFloraShader,
    "dryTargetOf",
    ()=>dryTargetOf,
    "floraLive",
    ()=>floraLive,
    "stepFlora",
    ()=>stepFlora
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/atmosphere.ts [app-ssr] (ecmascript)");
;
const floraLive = {
    /** shader clock (seconds, accumulates) */ time: 0,
    /** eased dryness 0..1 (1 = harmattan gold, 0 = flood-season lush) */ dry: 0.45
};
/**
 * Weather → dryness target. The harmattan is THE dry season (full gold);
 * the rain family (rain/storm/flood) reads as the wet end; sunny/cloudy
 * hold the savanna middle. An unknown weather falls back to the middle —
 * a config mistake can never gold the whole town by surprise.
 */ const WEATHER_DRY = {
    harmattan: 1,
    sunny: 0.45,
    'night-clear': 0.45,
    cloudy: 0.3,
    rain: 0.08,
    storm: 0.04,
    flood: 0
};
function dryTargetOf(weather) {
    return WEATHER_DRY[weather] ?? 0.45;
}
/** the shared uniform objects — every flora material points at THESE */ const uTime = {
    value: 0
};
const uDry = {
    value: 0.45
};
function applyFloraShader(mat, amp) {
    mat.onBeforeCompile = (shader)=>{
        shader.uniforms.uTime = uTime;
        shader.uniforms.uDry = uDry;
        shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute float aSway;\nattribute float aLeaf;\nvarying float vLeaf;\nuniform float uTime;').replace('#include <begin_vertex>', `#include <begin_vertex>
  #ifdef USE_INSTANCING
    float flPhase = instanceMatrix[3][0] * 0.73 + instanceMatrix[3][2] * 0.57;
  #else
    float flPhase = 0.0;
  #endif
  float flSway = aSway * ( sin(uTime * 1.35 + flPhase) * 0.5
    + sin(uTime * 2.62 + flPhase * 1.618 + 1.3) * 0.3
    + sin(uTime * 0.51 + flPhase * 0.377) * 0.2 );
  transformed.x += flSway * ${amp.toFixed(4)};
  transformed.z += flSway * ${(amp * 0.62).toFixed(4)};
  vLeaf = aLeaf;`);
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vLeaf;\nuniform float uDry;').replace('#include <color_fragment>', `#include <color_fragment>
  {
    float flDry = clamp(uDry * vLeaf, 0.0, 1.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.63, 0.52, 0.25), flDry * 0.55);
    diffuseColor.rgb *= mix(1.05, 1.0, uDry);
  }`);
    };
    mat.customProgramCacheKey = ()=>`flora-${amp.toFixed(3)}`;
}
function stepFlora(dt) {
    const d = Math.min(dt, 0.1) // a hitched frame must not lurch the ease
    ;
    floraLive.time += d;
    const target = dryTargetOf(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].weather);
    floraLive.dry += (target - floraLive.dry) * Math.min(1, d * 0.55);
    uTime.value = floraLive.time;
    uDry.value = floraLive.dry;
}
}),
"[project]/src/components/game/world/WorldTerrain.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldTerrain",
    ()=>WorldTerrain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — 3D Terrain (Stage 4C — "the ground half of the world")
 * --------------------------------------------------------------------
 * The land itself, painted like a place instead of a prototype:
 *  • heightfield from layout.heightAt (shared with the player controller —
 *    feet always meet ground) with layered savanna vertex colours:
 *    gold-olive base, river lowlands, laterite road halos, market dust
 *    bowls, parched high ground, Patti rock — plus a baked grain texture.
 *  • rivers with proper banks: a sand/mud shelf that dips under a wider
 *    two-tone water surface (shallow rim → deep channel), wet dark line at
 *    the waterline, confluence foam accent.
 *  • roads that read as roads: width hierarchy (trunk asphalt 6.5 → minor
 *    laterite 4.5 → trail 3.6), baked wheel-track wear + centre dashes,
 *    dirt shoulders, junction patches at shared endpoints.
 *  • grass as crossed-blade tufts (two instanced variants) with per-instance
 *    hue jitter, plus a few dry-season flower dots near the rivers.
 *  • bridges with railings, pylons and abutments carrying their road's
 *    surface style.
 * Everything is baked/memoised once; no per-frame allocations; no shadows
 * added; ~21 draw calls total. Zero Math.random — seeded helpers only.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/terrainArt.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/roads.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$drains$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/drains.ts [app-ssr] (ecmascript)"); // W1 — the corridor law
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/junctions.ts [app-ssr] (ecmascript)"); // W3 — the school humps
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/flora.ts [app-ssr] (ecmascript)"); // W2 — the 10k savanna
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$flora$2d$shader$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/flora-shader.ts [app-ssr] (ecmascript)"); // W2 — shared wind + weather
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/atmosphere.ts [app-ssr] (ecmascript)"); // M19 — the flood veil reads the live weather
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
function smoothstep(a, b, t) {
    const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return x * x * (3 - 2 * x);
}
/* -------------------------------- terrain ---------------------------------- */ const SEG = 160;
/** districts that kick up real dust: market, motor park, junction, food strip */ const DUSTY_DISTRICTS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DISTRICTS"].filter((d)=>d.kind === 'market' || d.kind === 'junction' || d.kind === 'park' || d.kind === 'food');
function TerrainMesh() {
    const grain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeGroundGrainTexture"])(256);
        t.repeat.set(96, 96);
        return t;
    }, []);
    /* SILK II — THE TIME-SLICE LAW: the heightfield used to build in ONE
   * synchronous useMemo (25,921 vertices × 3 heightAt + 2 road queries
   * each) — a 50–150ms mount jam on low-end phones. The geometry shell is
   * allocated instantly and the per-vertex work is sliced into useFrame
   * with a 6ms frame budget, so the land RISES over a handful of frames
   * under the entering veil instead of freezing one. The per-vertex math
   * and its row-major order are UNCHANGED — bit-identical output, only the
   * schedule moved. */ const build = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_HALF"] * 2, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD_HALF"] * 2, SEG, SEG);
        geo.rotateX(-Math.PI / 2);
        return {
            geo,
            pos: geo.attributes.position,
            colors: new Float32Array(geo.attributes.position.count * 3)
        };
    }, []);
    /* the frame loop mutates the buffers through this holder — the render
   * path only ever READS the memo (react-hooks immutability law) */ const holder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        holder.current = build;
    }, [
        build
    ]);
    /* the palette + scratch, hoisted out of the frame loop (zero-alloc law) */ const paint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const mk = (hex)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](hex);
        return {
            c: mk('#000000'),
            base: mk('#7f8f4c'),
            mottD: mk('#6d7f40'),
            mottL: mk('#9d9a5c'),
            lush: mk('#59763a'),
            dust: mk('#b58a58'),
            dustD: mk('#a1764a'),
            dryHi: mk('#a39a5e'),
            rock: mk('#8f7f63'),
            iron: mk('#7c5c40'),
            paleBand: mk('#a58f66'),
            footFan: mk('#b09a68'),
            sand: mk('#c2aa72'),
            mud: mk('#66543a'),
            bed: mk('#4c5a40')
        };
    }, []);
    const buildState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        row: 0,
        done: false
    });
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const s = buildState.current;
        if (s.done) return;
        const h = holder.current;
        if (!h) return;
        const { geo, pos, colors } = h;
        const t0 = performance.now();
        const perRow = SEG + 1;
        const { c, base, mottD, mottL, lush, dust, dustD, dryHi, rock, iron, paleBand, footFan, sand, mud, bed } = paint;
        while(s.row < perRow && performance.now() - t0 < 6){
            const rowStart = s.row * perRow;
            for(let col = 0; col < perRow; col++){
                const i = rowStart + col;
                const x = pos.getX(i);
                const z = pos.getZ(i);
                const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
                pos.setY(i, y);
                c.copy(base);
                // low-frequency mottling — two octave bands, never the same twice
                const n1 = Math.sin(x * 0.052 + z * 0.031) * 0.5 + Math.sin(x * 0.021 - z * 0.047 + 1.3) * 0.5;
                const n2 = Math.sin(x * 0.14 + z * 0.11 + 2.1) * 0.5 + Math.sin(x * 0.09 - z * 0.16 + 0.6) * 0.5;
                c.lerp(n1 > 0 ? mottL : mottD, Math.abs(n1) * 0.34);
                c.lerp(n2 > 0 ? mottL : mottD, Math.abs(n2) * 0.13);
                // parched patches on high ground, broken up by the second noise band
                const dryT = Math.max(0, (y - 4.5) / 9) * (0.55 + 0.45 * n2);
                if (dryT > 0) c.lerp(dryHi, Math.min(1, dryT) * 0.65);
                // richer green lowlands near the rivers (moisture gradient)
                const { d, halfWidth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
                const moist = 1 - smoothstep(2, 26, d - halfWidth);
                if (moist > 0) c.lerp(lush, moist * 0.6);
                // dusty laterite halos: a wide soft band along the MAJOR roads (smooth
                // on the coarse mesh) plus a tight packed-earth rim on every street
                const rd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(x, z);
                const rm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistanceMajors"])(x, z);
                const halo = 1 - smoothstep(2.4, 13, rm);
                if (halo > 0) c.lerp(dust, halo * 0.6);
                const packed = 1 - smoothstep(1.0, 2.8, rd);
                if (packed > 0) c.lerp(dustD, packed * 0.75);
                // dust bowls around the market / motor park / junction / food strip
                for (const dd of DUSTY_DISTRICTS){
                    const ddx = x - dd.x;
                    const ddz = z - dd.z;
                    const dd2 = ddx * ddx + ddz * ddz;
                    const rOut = dd.radius * 1.9;
                    if (dd2 < rOut * rOut) {
                        const t = 1 - smoothstep(dd.radius * 0.62, rOut, Math.sqrt(dd2));
                        if (t > 0) c.lerp(dust, t * 0.5);
                    }
                }
                // rocky slopes — steeper ground reveals the Patti stone, but the real
                // hill wears its geology in BANDS: ironstone and pale laterite strata
                // alternate as the mountain rises, the grassy savanna crown keeps its
                // top (the rest house lawn), and a pale erosion fan spreads at the foot
                const slope = (Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x + 2, z) - y) + Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z + 2) - y)) / 4;
                const pd = Math.hypot(x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOUNT_PATTI"].x, z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOUNT_PATTI"].z);
                let rockT = 0;
                if (slope > 0.32) rockT = Math.min(1, (slope - 0.32) * 2.2);
                if (y > 16) rockT = Math.max(rockT, Math.min(1, (y - 16) / 14));
                // the summit crown stays grassy — pull the stone back where the hill tops out
                const crownT = 1 - smoothstep(24, 40, pd);
                if (crownT > 0 && y > 20) rockT *= 1 - crownT * 0.85;
                if (rockT > 0.02) {
                    const band = Math.sin(y * 1.35 + Math.sin(x * 0.11 + z * 0.09) * 0.85);
                    c.lerp(band > 0 ? iron : paleBand, rockT * 0.82);
                } else if (slope > 0.32) {
                    // non-Patti steep ground (stream gullies) keeps the neutral stone
                    c.lerp(rock, Math.min(1, (slope - 0.32) * 2.2));
                }
                // the erosion fan — where the hill sheds into the plain, on gentle ground only
                const fanT = (1 - Math.abs(pd - 76) / 14) * (1 - smoothstep(0.26, 0.48, slope));
                if (fanT > 0) c.lerp(footFan, Math.min(0.42, fanT * 0.55));
                // river banks — sand shelf, wet dark line, darker bed under the water
                if (d < halfWidth + 9) {
                    const sandT = 1 - smoothstep(halfWidth + 1.5, halfWidth + 9, d);
                    if (sandT > 0) c.lerp(sand, sandT * 0.75);
                }
                if (d < halfWidth + 1.2) c.lerp(mud, 1 - smoothstep(halfWidth - 1, halfWidth + 1.2, d));
                if (d < halfWidth - 0.6) c.lerp(bed, 1 - smoothstep(halfWidth - 4, halfWidth - 0.6, d));
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }
            s.row++;
        }
        pos.needsUpdate = true; // the land rises live under the veil
        if (s.row >= perRow) {
            s.done = true;
            geo.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](colors, 3));
            geo.computeVertexNormals();
            setReady(true); // the painted land takes over from the flat shell
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: build.geo,
        receiveShadow: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
            vertexColors: ready,
            map: grain,
            color: ready ? '#ffffff' : '#7f8f4c',
            roughness: 0.95,
            metalness: 0
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
            lineNumber: 218,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
/* --------------------------------- rivers ---------------------------------- */ /** dense resample of a polyline every `step` units */ function resample(points, step) {
    const out = [];
    for(let i = 0; i < points.length - 1; i++){
        const [ax, az] = points[i];
        const [bx, bz] = points[i + 1];
        const len = Math.hypot(bx - ax, bz - az);
        const n = Math.max(1, Math.round(len / step));
        for(let s = 0; s < n; s++){
            const t = s / n;
            out.push([
                ax + (bx - ax) * t,
                az + (bz - az) * t
            ]);
        }
    }
    out.push(points[points.length - 1]);
    return out;
}
/**
 * Water surface: wider than the carved channel so the rim tucks under the
 * bank (the real waterline sits ≈ halfWidth+3.4 out). Four columns across
 * give a two-tone depth read — bright shallow rim, dark mid channel.
 */ function waterGeometry(points, width) {
    const dense = resample(points, 4);
    const edge = width / 2 + 3.6;
    const offs = [
        -edge,
        -edge * 0.42,
        edge * 0.42,
        edge
    ];
    const shade = [
        1.22,
        0.78,
        0.78,
        1.22
    ];
    const verts = [];
    const cols = [];
    const idx = [];
    for(let i = 0; i < dense.length; i++){
        const [x, z] = dense[i];
        const prev = dense[Math.max(0, i - 1)];
        const next = dense[Math.min(dense.length - 1, i + 1)];
        const dx = next[0] - prev[0];
        const dz = next[1] - prev[1];
        const len = Math.hypot(dx, dz) || 1;
        const nx = -dz / len;
        const nz = dx / len;
        for(let k = 0; k < 4; k++){
            verts.push(x + nx * offs[k], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"], z + nz * offs[k]);
            cols.push(shade[k], shade[k], shade[k]);
        }
        if (i < dense.length - 1) {
            const b = i * 4;
            for(let k = 0; k < 3; k++){
                idx.push(b + k, b + 4 + k, b + k + 1, b + k + 1, b + 4 + k, b + 5 + k);
            }
        }
    }
    const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geo.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](verts, 3));
    geo.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](cols, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}
/**
 * The bank between land and water: a draped sand/mud shelf — dark wet band
 * right at the waterline, sand above it, fading out into the terrain's own
 * sand tint so no hard seam shows.
 */ function shelfGeometry(points, width) {
    const dense = resample(points, 2.5);
    const hw = width / 2;
    const offs = [
        hw + 0.8,
        hw + 2.9,
        hw + 4.8,
        hw + 6.8
    ];
    const tones = [
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#4e4234'),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#64513a'),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#c2a870'),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#93875e')
    ];
    const verts = [];
    const cols = [];
    const idx = [];
    const both = [
        1,
        -1
    ] // both banks
    ;
    for (const side of both){
        const base = verts.length / 3;
        for(let i = 0; i < dense.length; i++){
            const [x, z] = dense[i];
            const prev = dense[Math.max(0, i - 1)];
            const next = dense[Math.min(dense.length - 1, i + 1)];
            const dx = next[0] - prev[0];
            const dz = next[1] - prev[1];
            const len = Math.hypot(dx, dz) || 1;
            const nx = -dz / len * side;
            const nz = dx / len * side;
            for(let k = 0; k < 4; k++){
                const px = x + nx * offs[k];
                const pz = z + nz * offs[k];
                verts.push(px, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(px, pz) + 0.02, pz);
                cols.push(tones[k].r, tones[k].g, tones[k].b);
            }
            if (i < dense.length - 1) {
                const b = base + i * 4;
                for(let k = 0; k < 3; k++){
                    idx.push(b + k, b + 4 + k, b + k + 1, b + k + 1, b + 4 + k, b + 5 + k);
                }
            }
        }
    }
    const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geo.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](verts, 3));
    geo.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](cols, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}
function Rivers() {
    const nigerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const foamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const foam2Ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { waters, shelf } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            waters: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].map((r)=>waterGeometry(r.points, r.width)),
            shelf: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].map((r)=>shelfGeometry(r.points, r.width)))
        }), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state)=>{
        // gentle water shimmer — one material trick, cheap
        const t = state.clock.elapsedTime;
        if (nigerRef.current) {
            const m = nigerRef.current.material;
            m.roughness = 0.15 + Math.sin(t * 0.7) * 0.05;
        }
        if (foamRef.current) {
            foamRef.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
            foamRef.current.material.opacity = 0.26 + Math.sin(t * 2.1) * 0.08;
        }
        if (foam2Ref.current) {
            foam2Ref.current.scale.setScalar(1 + Math.sin(t * 0.9 + 2.1) * 0.05);
            foam2Ref.current.material.opacity = 0.11 + Math.sin(t * 1.3 + 1.0) * 0.05;
        }
    });
    const confluence = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONFLUENCE_POINT"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: shelf,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    vertexColors: true,
                    flatShading: true,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 377,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            waters.map((g, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    ref: i === 0 ? nigerRef : undefined,
                    geometry: g,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        vertexColors: true,
                        color: i === 2 ? '#2e8a80' : '#2f8fa0',
                        roughness: 0.18,
                        metalness: 0.08,
                        transparent: true,
                        opacity: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this)
                }, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"][i].id, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 380,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: foamRef,
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                position: [
                    confluence[0],
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.06,
                    confluence[1]
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                        args: [
                            9.5,
                            24
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#eaf5ee",
                        transparent: true,
                        opacity: 0.28,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                        lineNumber: 394,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: foam2Ref,
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                position: [
                    confluence[0],
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.05,
                    confluence[1]
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                        args: [
                            15,
                            28
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                        lineNumber: 397,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#dceee8",
                        transparent: true,
                        opacity: 0.12,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 396,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloodVeil, {
                waters: waters
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 402,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 374,
        columnNumber: 5
    }, this);
}
/* ------------------------- M19 — the flood-water veil ------------------------ */ const FLOOD_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
/**
 * THE FLOOD LAW, rendered: the veil sits 0.09u over the water, tinted
 * the Niger's real flood brown. Two scrolling sine bands fake the ripple
 * (fragment-only — the vertices never move, so the cost is one cheap
 * plane draw). Opacity answers ONLY to atmoLive.flood; at zero the mesh
 * parks invisible — a dry-season veil costs nothing.
 */ function FloodVeil({ waters }) {
    const matRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const grpRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const uniforms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            uTime: {
                value: 0
            },
            uOpacity: {
                value: 0
            },
            uMud: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#5e4f36')
            },
            uSky: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#8a9488')
            }
        }), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state, dt)=>{
        const mat = matRef.current;
        const grp = grpRef.current;
        if (!mat || !grp) return;
        const u = mat.uniforms;
        u.uTime.value = state.clock.elapsedTime;
        u.uOpacity.value += (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].flood * 0.5 - u.uOpacity.value) * Math.min(1, dt * 0.6);
        grp.visible = u.uOpacity.value > 0.012;
        if (!grp.visible) return;
        // the flood sky is heavy grey-green — the veil catches it
        u.uSky.value.set('#7d8a80');
    });
    const frag = /* glsl */ `
    varying vec3 vWorld;
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uMud;
    uniform vec3 uSky;
    void main() {
      // two travelling swells — the Niger hauling debris toward the delta
      float w1 = sin(vWorld.x * 0.55 + uTime * 1.1) * 0.5 + 0.5;
      float w2 = sin(vWorld.z * 0.43 - uTime * 0.8 + vWorld.x * 0.21) * 0.5 + 0.5;
      float ripple = w1 * 0.6 + w2 * 0.4;
      vec3 col = mix(uMud, uSky, ripple * 0.35);
      gl_FragColor = vec4(col, uOpacity * (0.65 + ripple * 0.35));
    }
  `;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: grpRef,
        visible: false,
        children: waters.map((g, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: g,
                renderOrder: 2,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                    ref: i === 0 ? matRef : undefined,
                    uniforms: uniforms,
                    vertexShader: FLOOD_VERT,
                    fragmentShader: frag,
                    transparent: true,
                    depthWrite: false
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 474,
                    columnNumber: 11
                }, this)
            }, `flood-${i}`, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 473,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 471,
        columnNumber: 5
    }, this);
}
/** data style → render class (asphalt / laterite / trail) */ function roadClassOf(style) {
    if (style === 'asphalt') return 'asphalt';
    if (style === 'laterite') return 'laterite';
    return 'trail';
}
/**
 * Road ribbon draping the terrain via heightAt. Resampled every 3 u so it
 * hugs slopes; tiny per-road lift offsets keep overlapping ribbons at
 * junctions from z-fighting. u across the road, v along it (tiled).
 */ function roadGeometry(points, width, yOff, vScale) {
    const dense = resample(points, 3);
    const verts = [];
    const uvs = [];
    const idx = [];
    let cursor = 0;
    // Stage 7 — mapped streets stop at the school fence (the swept yard owns
    // its ground, exactly like a real satellite view of a Lokoja school)
    const yard = dense.map(([x, z])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z));
    for(let i = 0; i < dense.length; i++){
        const [x, z] = dense[i];
        const prev = dense[Math.max(0, i - 1)];
        const next = dense[Math.min(dense.length - 1, i + 1)];
        const dx = next[0] - prev[0];
        const dz = next[1] - prev[1];
        const len = Math.hypot(dx, dz) || 1;
        const nx = -dz / len * (width / 2);
        const nz = dx / len * (width / 2);
        const yL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x + nx, z + nz) + yOff;
        const yR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x - nx, z - nz) + yOff;
        verts.push(x + nx, yL, z + nz);
        verts.push(x - nx, yR, z - nz);
        uvs.push(0, cursor * vScale, 1, cursor * vScale);
        cursor += 1;
        if (i < dense.length - 1 && !yard[i] && !yard[i + 1]) {
            const a = i * 2;
            idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
        }
    }
    const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geo.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](verts, 3));
    geo.setAttribute('uv', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}
/** darker worn-earth discs where MAJOR road endpoints meet, so seams don't show */ function junctionDiscs() {
    const pts = [];
    for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (!r.major) continue;
        pts.push(r.pts[0]);
        pts.push(r.pts[r.pts.length - 1]);
    }
    const used = pts.map(()=>false);
    const geos = [];
    for(let i = 0; i < pts.length; i++){
        if (used[i]) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(pts[i][0], pts[i][1]) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(pts[i][0], pts[i][1])) continue; // yard owns its ground
        used[i] = true;
        let cx = pts[i][0];
        let cz = pts[i][1];
        let n = 1;
        for(let j = i + 1; j < pts.length; j++){
            if (!used[j] && Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 5) {
                used[j] = true;
                cx += pts[j][0];
                cz += pts[j][1];
                n++;
            }
        }
        if (n < 2) continue;
        cx /= n;
        cz /= n;
        const disc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleGeometry"](5.6, 20);
        disc.rotateX(-Math.PI / 2);
        disc.translate(cx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(cx, cz) + 0.16, cz);
        geos.push(disc);
    }
    return geos.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(geos) : null;
}
function Roads() {
    /**
   * Lane markings — worn white paint: dashed centrelines along the asphalt
   * arteries (highway/major/secondary) and solid edge lines on the highway.
   * Markings clip at school fences (the renderer's own law) and skip bridge
   * spans (each bridge deck carries its own surface).
   */ const markings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const dashes = [];
        const edges = [];
        for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
            if (r.style !== 'asphalt') continue;
            if (r.cls !== 'highway' && r.cls !== 'major' && r.cls !== 'secondary') continue;
            const hw = (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][r.cls] ?? 4.2) / 2;
            for(let i = 0; i < r.pts.length - 1; i++){
                const [ax, az] = r.pts[i];
                const [bx, bz] = r.pts[i + 1];
                const seg = Math.hypot(bx - ax, bz - az);
                if (seg < 2.4) continue;
                const yaw = Math.atan2(bx - ax, bz - az);
                const nx = -(bz - az) / seg;
                const nz = (bx - ax) / seg;
                // dashed centreline
                let acc = 1.6;
                while(acc + 1.5 <= seg){
                    const t = (acc + 0.75) / seg;
                    const x = ax + (bx - ax) * t;
                    const z = az + (bz - az) * t;
                    acc += 3.7;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
                    const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
                    if (ri.d < ri.halfWidth + 1.2) continue;
                    const dash = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.1, 1.5);
                    dash.rotateX(-Math.PI / 2);
                    dash.rotateY(yaw);
                    dash.translate(x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) + 0.1, z);
                    dashes.push(dash);
                }
                // solid edge lines — the dual-carriageway highway reads as engineered
                if (r.cls === 'highway') {
                    for(let eAcc = 0.75; eAcc < seg; eAcc += 3){
                        const t = eAcc / seg;
                        const x = ax + (bx - ax) * t;
                        const z = az + (bz - az) * t;
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
                        const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
                        if (ri.d < ri.halfWidth + 1.2) continue;
                        for (const side of [
                            -1,
                            1
                        ]){
                            const edge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.09, 3);
                            edge.rotateX(-Math.PI / 2);
                            edge.rotateY(yaw);
                            edge.translate(x + nx * (hw - 0.42) * side, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x + nx * (hw - 0.42) * side, z + nz * (hw - 0.42) * side) + 0.1, z + nz * (hw - 0.42) * side);
                            edges.push(edge);
                        }
                    }
                }
            }
        }
        const all = [
            ...dashes,
            ...edges
        ];
        return all.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(all) : null;
    }, []);
    const { shoulder, asphalt, laterite, trail, fabric, junctions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const shoulders = [];
        const byClass = {
            asphalt: [],
            laterite: [],
            trail: []
        };
        const fabricGeos = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"].forEach((r, i)=>{
            const st = {
                w: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][r.cls] ?? 4.2,
                cls: roadClassOf(r.style)
            };
            // the dense residential fabric (2,700+ real minor streets) renders as
            // one flat earthen surface — textured stripes at every street angle
            // would tile over each other into visual mush
            if (r.cls === 'minor' || r.cls === 'foot') {
                fabricGeos.push(roadGeometry(r.pts, st.w, 0.07 + i % 5 * 0.004, 0.25));
                return;
            }
            // dirt shoulders only on the sparse arteries
            shoulders.push(roadGeometry(r.pts, st.w + 2.4, 0.05 + i % 4 * 0.003, 0.25));
            byClass[st.cls].push(roadGeometry(r.pts, st.w, 0.09 + i % 5 * 0.004, 1 / 7.2));
        });
        return {
            shoulder: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(shoulders),
            asphalt: byClass.asphalt.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(byClass.asphalt) : null,
            laterite: byClass.laterite.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(byClass.laterite) : null,
            trail: byClass.trail.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(byClass.trail) : null,
            fabric: fabricGeos.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(fabricGeos) : null,
            junctions: junctionDiscs()
        };
    }, []);
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadTextures"])(), []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: shoulder,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#a9885c",
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 678,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 677,
                columnNumber: 7
            }, this),
            fabric && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: fabric,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#a5825a",
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 683,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 682,
                columnNumber: 9
            }, this),
            asphalt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: asphalt,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: tex.asphalt,
                    roughness: 0.94,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 688,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 687,
                columnNumber: 9
            }, this),
            laterite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: laterite,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: tex.laterite,
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 693,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 692,
                columnNumber: 9
            }, this),
            trail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: trail,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: tex.laterite,
                    color: "#b08c68",
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 698,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 697,
                columnNumber: 9
            }, this),
            markings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: markings,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#ddd8c4",
                    roughness: 0.85,
                    metalness: 0,
                    polygonOffset: true,
                    polygonOffsetFactor: -2
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 704,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 703,
                columnNumber: 9
            }, this),
            junctions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: junctions,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#8f7248",
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 710,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 709,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 675,
        columnNumber: 5
    }, this);
}
/* --------------------------------- bridges ---------------------------------- */ function Bridges() {
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadTextures"])(), []);
    const built = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const decks = [];
        const rails = [];
        const piers = [];
        const surfA = [];
        const surfL = [];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1);
        for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BRIDGES"]){
            // +3 so the visible deck ends where the walkable deck zone ends
            // (collision uses length/2 + 1.5) — ends land on the bank, not mid-water
            const L = b.length + 3;
            const W = b.width;
            const cls = b.cls === 'asphalt' ? 'asphalt' : b.cls === 'laterite' ? 'laterite' : 'trail';
            e.set(0, b.rotY, 0);
            q.setFromEuler(e);
            p.set(b.x, b.y, b.z);
            m.compose(p, q, s);
            // deck slab
            const deck = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](W, 0.55, L);
            deck.applyMatrix4(m);
            decks.push(deck);
            // road surface riding the deck, in the carrying road's own style
            const surf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](W, L);
            surf.rotateX(-Math.PI / 2);
            const uvA = surf.attributes.uv;
            for(let k = 0; k < uvA.count; k++)uvA.setY(k, uvA.getY(k) * (L / 7.2));
            surf.translate(0, 0.29, 0);
            surf.applyMatrix4(m);
            (cls === 'asphalt' ? surfA : surfL).push(surf);
            // post-and-rail railings, both sides
            for (const side of [
                -1,
                1
            ]){
                const rx = side * (W / 2 - 0.28);
                const top = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.12, 0.1, L);
                top.translate(rx, 0.98, 0);
                top.applyMatrix4(m);
                rails.push(top);
                const mid = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.09, 0.08, L);
                mid.translate(rx, 0.66, 0);
                mid.applyMatrix4(m);
                rails.push(mid);
                for(let z = -L / 2 + 1; z <= L / 2 - 1; z += 2.6){
                    const post = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.14, 0.62, 0.14);
                    post.translate(rx, 0.58, z);
                    post.applyMatrix4(m);
                    rails.push(post);
                }
            }
            // two pylons down through the waterline
            for (const z of [
                -L * 0.28,
                L * 0.28
            ]){
                const py = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](1.35, 3.6, 0.95);
                py.translate(0, -1.7, z);
                py.applyMatrix4(m);
                piers.push(py);
            }
            // stone abutments masking the deck ends down to the terrain
            const dirX = Math.sin(b.rotY);
            const dirZ = Math.cos(b.rotY);
            for (const sd of [
                -1,
                1
            ]){
                const ex = b.x + dirX * (L / 2 - 1);
                const ez = b.z + dirZ * (L / 2 - 1);
                const gh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(ex, ez);
                const h = Math.max(1, b.y - 0.27 - gh + 0.5);
                const ab = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](W - 0.6, h, 2.4);
                ab.translate(ex, gh - 0.5 + h / 2, ez);
                piers.push(ab);
            }
        }
        return {
            deck: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(decks),
            rail: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(rails),
            pier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(piers),
            surfA: surfA.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(surfA) : null,
            surfL: surfL.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(surfL) : null
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.deck,
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#989083",
                    roughness: 0.95,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 804,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 803,
                columnNumber: 7
            }, this),
            built.surfA && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.surfA,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: tex.asphalt,
                    roughness: 0.94,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 808,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 807,
                columnNumber: 9
            }, this),
            built.surfL && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.surfL,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    map: tex.laterite,
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 813,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 812,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.rail,
                castShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#6d675c",
                    roughness: 0.8,
                    metalness: 0.25
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 817,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 816,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.pier,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#8d8474",
                    roughness: 1,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 820,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 819,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 802,
        columnNumber: 5
    }, this);
}
/* ---------------------------------- grass ----------------------------------- */ /**
 * A tuft of `blades` crossed, tapered blades with a slight bend — reads as
 * grass from any angle instead of flat paper shards. The W2 attributes ride
 * along: aSway = the tip-ward wind weight (0 rooted, 1 at the tip) and
 * aLeaf = 1 (the weather-gold mask — grass IS leaf, harmattan owns it).
 */ function tuftGeometry(blades, w, h, bend) {
    const pos = [];
    const idx = [];
    const sway = [];
    const leaf = [];
    for(let bI = 0; bI < blades; bI++){
        const a = bI / blades * Math.PI;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const base = pos.length / 3;
        const v = [
            [
                -w,
                0,
                0
            ],
            [
                w,
                0,
                0
            ],
            [
                -w * 0.45 + bend * 0.35,
                h * 0.55,
                bend * 0.28
            ],
            [
                w * 0.45 + bend * 0.35,
                h * 0.55,
                bend * 0.28
            ],
            [
                bend,
                h,
                bend * 0.55
            ]
        ];
        for (const [vx, vy, vz] of v){
            pos.push(vx * cos - vz * sin, vy, vx * sin + vz * cos);
            sway.push(Math.min(1, vy / h * (vy / h) * 1.4)); // quadratic tip-ward
            leaf.push(1);
        }
        idx.push(base, base + 1, base + 3, base, base + 3, base + 2, base + 2, base + 3, base + 4);
    }
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](pos, 3));
    g.setAttribute('aSway', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](sway, 1));
    g.setAttribute('aLeaf', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](leaf, 1));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
}
/**
 * Savanna ground cover — W2: 10,000 tufts (was 3.2k) placed by flora.ts's
 * law engine (off tarmac AND shoulders via roadGap, above the waterline
 * with the sink judged, out of the river, off the anchor plazas), split
 * over two InstancedMeshes with per-instance colour from the moisture
 * gradient + deterministic hue jitter. The shared flora shader gives every
 * blade its own tip-ward sway (phase from the instance position — zero
 * CPU) and hands the M6 weather the whole field: harmattan golds it, the
 * rains deepen it. No shadows (the old law), 2 draw calls.
 */ function Grass() {
    const refA = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const refB = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { geoA, geoB, mat, countA, countB } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
            roughness: 1,
            metalness: 0
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$flora$2d$shader$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyFloraShader"])(mat, 0.26); // W2 — the field breathes with the trees
        return {
            geoA: tuftGeometry(2, 0.22, 1.3, 0.34),
            geoB: tuftGeometry(3, 0.17, 0.95, 0.5),
            mat,
            countA: Math.ceil(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRASS_TUFTS"].length / 2),
            countB: Math.floor(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRASS_TUFTS"].length / 2)
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>mat.dispose(), [
        mat
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const meshA = refA.current;
        const meshB = refB.current;
        if (!meshA || !meshB) return;
        const meshes = [
            meshA,
            meshB
        ];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const sc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRASS_TUFTS"].forEach((g, i)=>{
            const mesh = meshes[i % 2];
            const k = Math.floor(i / 2);
            // deterministic per-tuft jitter — yaw, lean, stretch, hue
            e.set(((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 3.7 + 1.3) - 0.5) * 0.3, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 12.9898) * Math.PI * 2, ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 7.9 + 4.1) - 0.5) * 0.3);
            q.setFromEuler(e);
            // modest cap — savanna tufts, not thorn bushes (keeps night silhouettes soft)
            const s = Math.min(g.s, 1.15) * 0.74;
            const sy = s * (0.85 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 5.1) * 0.4);
            sc.set(s, sy, s);
            p.set(g.x, g.y, g.z);
            m.compose(p, q, sc);
            mesh.setMatrixAt(k, m);
            color.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRASS_TONES"][g.tone]);
            color.offsetHSL(((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 2.3) - 0.5) * 0.035, ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 8.7) - 0.5) * 0.16, ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 4.9) - 0.5) * 0.07);
            mesh.setColorAt(k, color);
        });
        for (const mesh of meshes){
            mesh.instanceMatrix.needsUpdate = true;
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: refA,
                args: [
                    geoA,
                    mat,
                    countA
                ],
                frustumCulled: false
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 943,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: refB,
                args: [
                    geoB,
                    mat,
                    countB
                ],
                frustumCulled: false
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 944,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 942,
        columnNumber: 5
    }, this);
}
/** tiny dry-season flower dots near the rivers — a few dozen, one draw call */ const FLOWER_TONES = [
    '#e8cf6f',
    '#d9814f',
    '#efe9dc'
];
function Flowers() {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { geo, mat, list } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const list = [];
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRASS"].length && list.length < 72; i += 11){
            const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRASS"][i];
            const rv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(g.x, g.z);
            if (rv.d > rv.halfWidth + 11) continue;
            list.push({
                x: g.x,
                z: g.z,
                y: g.y,
                s: 0.75 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 6.6) * 0.6,
                c: Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash1"])(i * 3.3) * 3)
            });
        }
        return {
            geo: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.085, 6, 5),
            mat: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                roughness: 0.8,
                metalness: 0
            }),
            list
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const mesh = ref.current;
        if (!mesh) return;
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]();
        list.forEach((f, i)=>{
            m.compose(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](f.x, f.y + 0.55 * f.s, f.z), q, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](f.s, f.s, f.s));
            mesh.setMatrixAt(i, m);
            color.set(FLOWER_TONES[f.c]);
            mesh.setColorAt(i, color);
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [
        list
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
        ref: ref,
        args: [
            geo,
            mat,
            list.length
        ],
        frustumCulled: false
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 989,
        columnNumber: 10
    }, this);
}
/* --------------------------------- kerbs ------------------------------------ */ /**
 * Raised concrete kerb lines along both edges of every asphalt artery —
 * the data comes from world3d/roads.ts (pure laws: junction mouths stay
 * open, bridges carry their own structure, nothing in water/yards). Each
 * run segment becomes one draped slab that rides heightAt at both ends.
 * All merged: one draw call, one material.
 */ function Kerbs() {
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const slabs = [];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1);
        for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KERB_RUNS"]){
            const dx = r.bx - r.ax;
            const dz = r.bz - r.az;
            const len = Math.hypot(dx, dz);
            if (len < 0.4 || len > 6) continue; // data guarantee: ≤ one 4u sample + chord; skip strays
            const mx = (r.ax + r.bx) / 2;
            const mz = (r.az + r.bz) / 2;
            const yL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(r.ax, r.az);
            const yR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(r.bx, r.bz);
            e.set(0, Math.atan2(dx, dz), 0);
            q.setFromEuler(e);
            p.set(mx, (yL + yR) / 2 + 0.075, mz);
            m.compose(p, q, s);
            const slab = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.22, 0.15, len + 0.08);
            slab.applyMatrix4(m);
            slabs.push(slab);
        }
        return slabs.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(slabs) : null;
    }, []);
    if (!geo) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        castShadow: true,
        receiveShadow: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
            color: "#b3ad9f",
            roughness: 0.95,
            metalness: 0
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
            lineNumber: 1031,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 1030,
        columnNumber: 5
    }, this);
}
/* --------------------------------- zebras ------------------------------------ */ /**
 * Zebra crossings at the artery junction mouths — 5 worn-white bands per
 * crossing, laid across the carriageway just outside each junction disc,
 * from the same deterministic roads.ts data. One merged draw call riding
 * the markings' polygon offset so the paint never z-fights the tarmac.
 */ function Zebras() {
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const stripes = [];
        for (const z of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZEBRAS"]){
            const ux = Math.sin(z.rotY);
            const uz = Math.cos(z.rotY);
            const across = z.half * 2 - 0.6;
            if (across < 1.2) continue;
            for(let i = 0; i < 5; i++){
                const along = (i - 2) * 0.95;
                const x = z.x + ux * along;
                const zz = z.z + uz * along;
                const stripe = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](across, 0.48);
                stripe.rotateX(-Math.PI / 2);
                stripe.rotateY(z.rotY);
                stripe.translate(x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, zz) + 0.115, zz);
                stripes.push(stripe);
            }
        }
        return stripes.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(stripes) : null;
    }, []);
    if (!geo) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        receiveShadow: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
            color: "#ddd8c4",
            roughness: 0.85,
            metalness: 0,
            polygonOffset: true,
            polygonOffsetFactor: -2
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
            lineNumber: 1068,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 1067,
        columnNumber: 5
    }, this);
}
/* --------------------------------- drains ------------------------------------ */ /**
 * W1 — THE OPEN U-DRAINS. Every DRAIN_SEGS segment becomes a concrete
 * U-channel piece: floor slab + two walls riding heightAt at both ends
 * (the kerb's drape pattern), invert from the 1:100 gravity law. Covers:
 * zebra footpath slabs + catch-pit grates. Culverts: a deck slab spanning
 * the channel where a side road crosses, with wing-wall headwalls at the
 * downstream mouth. Three merged draw calls total: channels, covers,
 * culverts. No per-frame work — the network is module-scope data.
 */ function Drains() {
    const built = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const channel = [];
        const covers = [];
        const culverts = [];
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]();
        const q = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]();
        const e = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"]();
        const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        const s = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](1, 1, 1);
        const box = (w, h, d)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](w, h, d);
        for (const seg of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$drains$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DRAIN_SEGS"]){
            const dx = seg.bx - seg.ax;
            const dz = seg.bz - seg.az;
            const len = Math.hypot(dx, dz);
            if (len < 0.25 || len > 6) continue; // data guarantee: one 4u sample per segment
            const mx = (seg.ax + seg.bx) / 2;
            const mz = (seg.az + seg.bz) / 2;
            const ySurf = (seg.ay + seg.by) / 2;
            const yInv = (seg.fa + seg.fb) / 2;
            const yaw = Math.atan2(dx, dz);
            e.set(0, yaw, 0);
            q.setFromEuler(e);
            // floor slab: 0.6 wide, sits at the invert
            p.set(mx, yInv + 0.03, mz);
            m.compose(p, q, s);
            const floor = box(0.6, 0.08, len + 0.06);
            floor.applyMatrix4(m);
            channel.push(floor);
            // walls: 0.1 thick, from the invert up to just proud of the surface
            const wallH = Math.max(0.32, ySurf + 0.05 - yInv);
            for (const side of [
                -1,
                1
            ]){
                p.set(mx - Math.cos(yaw) * 0.25 * side, yInv + wallH / 2 - 0.02, mz + Math.sin(yaw) * 0.25 * side);
                m.compose(p, q, s);
                const wall = box(0.1, wallH, len + 0.06);
                wall.applyMatrix4(m);
                channel.push(wall);
            }
            if (seg.cover === 1) {
                // zebra footpath slab — slightly proud, worn white face
                p.set(mx, ySurf + 0.075, mz);
                m.compose(p, q, s);
                const slab = box(0.78, 0.07, 1.5);
                slab.applyMatrix4(m);
                covers.push(slab);
            } else if (seg.cover === 2) {
                // catch-pit grate at the segment's end — the invert resets there
                p.set(seg.bx, seg.by + 0.02, seg.bz);
                m.compose(p, q, s);
                const grate = box(0.6, 0.05, 0.7);
                grate.applyMatrix4(m);
                covers.push(grate);
            }
        }
        // catch-pit rims (concrete collar around each grate) + culverts
        for (const pit of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$drains$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DRAIN_PITS"]){
            p.set(pit.x, pit.y + 0.045, pit.z);
            e.set(0, pit.rotY, 0);
            q.setFromEuler(e);
            m.compose(p, q, s);
            const rim = box(0.86, 0.055, 0.96);
            rim.applyMatrix4(m);
            covers.push(rim);
        }
        for (const c of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$drains$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DRAIN_CULVERTS"]){
            e.set(0, c.rotY + Math.PI / 2, 0);
            q.setFromEuler(e);
            // deck slab spanning the channel under the crossing road — deck
            // length = the recorded crossing span; a zebra-covered deck wears a
            // proud pedestrian slab in the covers set instead
            if (c.covered === 1) {
                p.set(c.x, c.y + 0.075, c.z);
                m.compose(p, q, s);
                const deck = box(0.9, 0.07, c.span + 0.4);
                deck.applyMatrix4(m);
                covers.push(deck);
            } else {
                p.set(c.x, c.y + 0.06, c.z);
                m.compose(p, q, s);
                const deck = box(1.15, 0.12, c.span);
                deck.applyMatrix4(m);
                culverts.push(deck);
            }
            // wing-wall headwalls: two angled cheeks at the outlet mouth
            for (const wing of [
                -1,
                1
            ]){
                p.set(c.x + Math.sin(c.rotY) * 1.5 - Math.cos(c.rotY) * 0.42 * wing, c.y + 0.16, c.z + Math.cos(c.rotY) * 1.5 + Math.sin(c.rotY) * 0.42 * wing);
                m.compose(p, q, s);
                const head = box(0.14, 0.42, 0.7);
                head.applyMatrix4(m);
                culverts.push(head);
            }
        }
        return {
            channel: channel.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(channel) : null,
            covers: covers.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(covers) : null,
            culverts: culverts.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(culverts) : null
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!built) return;
        return ()=>{
            built.channel?.dispose();
            built.covers?.dispose();
            built.culverts?.dispose();
        };
    }, [
        built
    ]);
    if (!built) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            built.channel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.channel,
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#9d9789",
                    roughness: 0.98,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 1197,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1196,
                columnNumber: 9
            }, this),
            built.covers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.covers,
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#b9b3a5",
                    roughness: 0.9,
                    metalness: 0.05
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 1202,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1201,
                columnNumber: 9
            }, this),
            built.culverts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.culverts,
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#a8a294",
                    roughness: 0.95,
                    metalness: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 1207,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1206,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 1194,
        columnNumber: 5
    }, this);
}
/* ------------------------------- speed bumps -------------------------------- */ /**
 * W3 — THE SCHOOL HUMPS. Each SPEED_BUMPS entry is extruded from the
 * shared cos² profile (bumpProfile — the ONE truth the DriveSystem rides
 * and the suite verifies): 9 slices across the throat, merged into one
 * draw call, with two painted white bands on the shoulders of the hump.
 * A hump you can see and feel — not a painted lie.
 */ function SpeedBumps() {
    const built = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPEED_BUMPS"].length) return null;
        const SLICES = 9;
        const humps = [];
        const paint = [];
        for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPEED_BUMPS"]){
            const cos = Math.cos(b.rotY);
            const sin = Math.sin(b.rotY);
            // the hump surface: a grid of SLICES along the road, full width across
            const verts = [];
            const idx = [];
            const halfW = b.half;
            for(let i = 0; i <= SLICES; i++){
                const u = -1 + 2 * i / SLICES;
                const along = u * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUMP_HALF_LEN"];
                const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bumpProfile"])(u);
                for (const across of [
                    -halfW,
                    halfW
                ]){
                    const wx = b.x + sin * along + -cos * across;
                    const wz = b.z + cos * along + sin * across;
                    verts.push(wx, b.y + h + 0.012, wz);
                }
            }
            for(let i = 0; i < SLICES; i++){
                const a0 = i * 2;
                idx.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2);
            }
            const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
            g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](verts, 3));
            g.setIndex(idx);
            g.computeVertexNormals();
            humps.push(g);
            // painted bands on the hump shoulders (u = ±0.55..±0.8)
            for (const band of [
                -0.8,
                -0.55,
                0.55,
                0.8
            ]){
                const g2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](halfW * 2 - 0.3, 0.34);
                g2.rotateX(-Math.PI / 2);
                g2.rotateY(b.rotY);
                const along = band * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUMP_HALF_LEN"];
                const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bumpProfile"])(band);
                g2.translate(b.x + sin * along, b.y + h + 0.024, b.z + cos * along);
                paint.push(g2);
            }
        }
        return {
            humps: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(humps),
            paint: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$terrainArt$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeGeoms"])(paint)
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!built) return;
        return ()=>{
            built.humps.dispose();
            built.paint.dispose();
        };
    }, [
        built
    ]);
    if (!built) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.humps,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#5b5147",
                    roughness: 0.95,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 1282,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1281,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                geometry: built.paint,
                receiveShadow: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e8e3d2",
                    roughness: 0.8,
                    polygonOffset: true,
                    polygonOffsetFactor: -2
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                    lineNumber: 1285,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1284,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 1280,
        columnNumber: 5
    }, this);
}
function WorldTerrain() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TerrainMesh, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1296,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Grass, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1297,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Flowers, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1298,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Rivers, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Roads, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1300,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Kerbs, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1301,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Zebras, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1302,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Drains, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SpeedBumps, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Bridges, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
                lineNumber: 1305,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldTerrain.tsx",
        lineNumber: 1295,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/SchoolMesh.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SchoolMesh",
    ()=>SchoolMesh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — School Mesh (Stage 7)
 * ------------------------------------
 * Renders every school compound from the pure world3d/schools.ts data:
 * swept sand yards, painted perimeter walls with rhythm pillars, the
 * gatehouse pair with the painted name board, long classroom blocks with
 * front verandas + louvre window bands + corrugated gable roofs, the
 * admin / library / lab / theatre / toilet blocks, flagpole with
 * school-colour flag, borehole water tank, football pitch with real line
 * markings, and the laterite driveway that ties each gate to the real
 * road it meets.
 *
 * Instanced per part-kind — 12 compounds render in a handful of draw
 * calls, everything reads at the arcade city scale the rest of the world
 * uses, and nothing here mutates game state.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
/* ------------------------------- shared palettes ------------------------------ */ const SAND_YARD = '#c9a86a';
const SAND_ASM = '#d4b479';
const LATERITE = '#a5623a';
const CONCRETE = '#b8b2a4';
const PILLAR_TONES = [
    '#d8d2c2',
    '#cfc9b8',
    '#e0dacb'
];
const STEEL = '#7d8288';
const ROOF_TONES = [
    '#8a4a2a',
    '#6e4530',
    '#96543a',
    '#7a6a55'
];
const LOUVRE = '#9fc4cc';
/* ------------------------------- gate name board ------------------------------ */ const boardTexCache = new Map();
function gateBoardTexture(name, motto, color) {
    const key = `${name}|${motto}|${color}`;
    let tex = boardTexCache.get(key);
    if (tex) return tex;
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(0, 0, 1024, 26);
    ctx.fillRect(0, 230, 1024, 26);
    ctx.strokeStyle = '#f4efe2';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 1004, 236);
    ctx.fillStyle = '#fdf9ec';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let size = 76;
    ctx.font = `900 ${size}px Arial, sans-serif`;
    while(ctx.measureText(name).width > 940 && size > 34){
        size -= 4;
        ctx.font = `900 ${size}px Arial, sans-serif`;
    }
    ctx.fillText(name, 512, 108);
    ctx.font = 'italic 600 40px Georgia, serif';
    ctx.fillStyle = '#f1e6c8';
    ctx.fillText(`“${motto}”`, 512, 190);
    tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    tex.anisotropy = 4;
    boardTexCache.set(key, tex);
    return tex;
}
/** pitch line markings — one shared canvas */ function pitchTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 320;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#7d8a4a';
    ctx.fillRect(0, 0, 512, 320);
    ctx.strokeStyle = 'rgba(250,248,240,0.85)';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, 476, 284);
    ctx.beginPath();
    ctx.moveTo(256, 18);
    ctx.lineTo(256, 302);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(256, 160, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(18, 96, 66, 128);
    ctx.strokeRect(428, 96, 66, 128);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return tex;
}
/** thin wrapper that fills an InstancedMesh once on mount (CityMesh pattern) */ function InstancedGroup({ count, setup, children, castShadow = false, receiveShadow = false }) {
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
        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
/* --------------------------------- the mesh ----------------------------------- */ const RUST_REF = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#7a4a30');
function SchoolMesh() {
    const compounds = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_COMPOUNDS"];
    // group all compound boxes once — kind → list
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const by = {
            wall: [],
            pillar: [],
            gatehouse: [],
            block: [],
            admin: [],
            library: [],
            lab: [],
            office: [],
            toilet: [],
            theatre: [],
            flag: [],
            water: [],
            veranda: [],
            senate: [],
            faculty: [],
            hostel: [],
            watchtower: [],
            healthsci: [],
            workshop: [],
            chapel: [],
            mosque: [],
            hall: [],
            canteen: [],
            clinic: [],
            demo: []
        };
        for (const c of compounds){
            for (const b of c.boxes)by[b.kind].push(b);
        }
        return by;
    }, [
        compounds
    ]);
    const siteById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const m = new Map();
        for (const c of compounds)m.set(c.site.id, c.site);
        return m;
    }, [
        compounds
    ]);
    const pitchTex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>pitchTexture(), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>pitchTex.dispose(), [
        pitchTex
    ]);
    /** body position/rotation for a plain box part */ const bodySetup = (list, paint, i, m, color)=>{
        const b = list[i];
        m.position.set(b.x, b.y + b.h / 2, b.z);
        m.rotation.set(0, b.rotY, 0);
        m.scale.set(b.w, b.h, b.d);
        color.set(paint(b));
    };
    /** gable roof over a block — squashed 4-cone like the city hip roofs */ const roofSetup = (list, paint, i, m, color)=>{
        const b = list[i];
        const roofH = Math.min(b.w, b.d) * 0.42;
        m.position.set(b.x, b.y + b.h + roofH / 2 - 0.02, b.z);
        m.rotation.set(0, b.rotY + Math.PI / 4, 0);
        m.scale.set(b.w + 1.2, roofH, b.d + 1.2);
        color.set(paint(b)).lerp(RUST_REF, 0.22);
    };
    const schoolPaint = (fallbacks)=>(b)=>{
            const s = siteById.get(b.schoolId);
            return s?.paint ?? fallbacks[0];
        };
    const wallPaint = schoolPaint([
        '#e8e0cc'
    ]);
    const roofPaint = ()=>ROOF_TONES[0];
    const bigKinds = [
        'office',
        'admin',
        'library',
        'lab',
        'theatre',
        'faculty',
        'hostel',
        'healthsci',
        'workshop',
        'chapel',
        'mosque',
        'hall',
        'canteen',
        'clinic',
        'demo'
    ];
    const bigList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>bigKinds.flatMap((k)=>groups[k]), [
        groups
    ]);
    /** roof tone per kind — the painted corrugated variety real campuses carry */ const roofTone = (kind)=>kind === 'admin' ? 3 : kind === 'library' ? 1 : kind === 'chapel' || kind === 'mosque' ? 0 : kind === 'hostel' || kind === 'hall' ? 2 : kind === 'senate' ? 3 : 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            compounds.map((c)=>{
                const y = c.gate.y;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                c.gate.x,
                                y + 0.05,
                                c.gate.z
                            ],
                            rotation: [
                                -Math.PI / 2,
                                0,
                                0
                            ],
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                                    args: [
                                        c.groundR,
                                        26
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: SAND_YARD,
                                    roughness: 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 216,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                c.assembly.x,
                                y + 0.07,
                                c.assembly.z
                            ],
                            rotation: [
                                -Math.PI / 2,
                                0,
                                0
                            ],
                            renderOrder: 2,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                                    args: [
                                        c.assembly.r,
                                        22
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 222,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: SAND_ASM,
                                    roughness: 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 221,
                            columnNumber: 13
                        }, this),
                        !c.pitch && c.site.field && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                c.assembly.x,
                                y + 0.085,
                                c.assembly.z
                            ],
                            rotation: [
                                -Math.PI / 2,
                                0,
                                0
                            ],
                            renderOrder: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ringGeometry", {
                                    args: [
                                        c.assembly.r * 0.8,
                                        c.assembly.r * 0.85,
                                        32
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 228,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                    color: "#f6f2e4",
                                    transparent: true,
                                    opacity: 0.7
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 229,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 227,
                            columnNumber: 15
                        }, this),
                        c.pitch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                c.pitch.x,
                                y + 0.08,
                                c.pitch.z
                            ],
                            rotation: [
                                -Math.PI / 2,
                                0,
                                -c.pitch.rotY
                            ],
                            renderOrder: 3,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                                    args: [
                                        c.pitch.w,
                                        c.pitch.d
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 239,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    map: pitchTex,
                                    roughness: 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 240,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 234,
                            columnNumber: 15
                        }, this),
                        c.drive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                (c.drive.ax + c.drive.bx) / 2,
                                Math.min(y, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(c.drive.ax, c.drive.az)) + 0.06,
                                (c.drive.az + c.drive.bz) / 2
                            ],
                            rotation: [
                                -Math.PI / 2,
                                0,
                                -Math.atan2(c.drive.bx - c.drive.ax, c.drive.bz - c.drive.az)
                            ],
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                                    args: [
                                        2.3,
                                        Math.hypot(c.drive.bx - c.drive.ax, c.drive.bz - c.drive.az) + 2
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 258,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: LATERITE,
                                    roughness: 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 259,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 245,
                            columnNumber: 15
                        }, this)
                    ]
                }, `ground-${c.site.id}`, true, {
                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                    lineNumber: 214,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.wall.length,
                castShadow: true,
                receiveShadow: true,
                setup: (i, m, color)=>bodySetup(groups.wall, wallPaint, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.veranda.length,
                receiveShadow: true,
                setup: (i, m, color)=>bodySetup(groups.veranda, ()=>CONCRETE, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.pillar.length,
                castShadow: true,
                setup: (i, m, color)=>bodySetup(groups.pillar, (b)=>PILLAR_TONES[b.h > 3 ? 2 : i % 2], i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.92
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.gatehouse.length,
                castShadow: true,
                setup: (i, m, color)=>bodySetup(groups.gatehouse, wallPaint, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.block.length,
                castShadow: true,
                receiveShadow: true,
                setup: (i, m, color)=>bodySetup(groups.block, wallPaint, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.94
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.block.length,
                castShadow: true,
                setup: (i, m, color)=>roofSetup(groups.block, roofPaint, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            0.71,
                            1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.62,
                        metalness: 0.22,
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: bigList.length,
                castShadow: true,
                receiveShadow: true,
                setup: (i, m, color)=>bodySetup(bigList, wallPaint, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.94
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 301,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: bigList.length,
                castShadow: true,
                setup: (i, m, color)=>roofSetup(bigList, ()=>ROOF_TONES[roofTone(bigList[i].kind)], i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                        args: [
                            0.71,
                            1,
                            4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.62,
                        metalness: 0.22,
                        flatShading: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            compounds.flatMap((c)=>c.boxes.filter((b)=>b.kind === 'senate').map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        children: [
                            [
                                0,
                                1,
                                2
                            ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                    position: [
                                        b.x + Math.sin(b.rotY) * (b.d / 2 + 0.28 + s * 0.42),
                                        b.y + 0.07 + (2 - s) * 0.07,
                                        b.z + Math.cos(b.rotY) * (b.d / 2 + 0.28 + s * 0.42)
                                    ],
                                    rotation: [
                                        0,
                                        b.rotY,
                                        0
                                    ],
                                    castShadow: true,
                                    receiveShadow: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                            args: [
                                                b.w * 0.5,
                                                0.14 + s * 0.07,
                                                0.5
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                            lineNumber: 329,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#c8c2b4",
                                            roughness: 0.9
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                            lineNumber: 330,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, s, true, {
                                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                    lineNumber: 318,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                position: [
                                    b.x + Math.sin(b.rotY) * (b.d / 2 + 0.1),
                                    b.y + b.h * 0.74,
                                    b.z + Math.cos(b.rotY) * (b.d / 2 + 0.1)
                                ],
                                rotation: [
                                    0,
                                    b.rotY,
                                    0
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        castShadow: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    0.55,
                                                    0.55,
                                                    0.12,
                                                    20
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                                lineNumber: 343,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#f4efe2",
                                                roughness: 0.5
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                                lineNumber: 344,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 342,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            0,
                                            0.075
                                        ],
                                        rotation: [
                                            Math.PI / 2,
                                            0,
                                            0
                                        ],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                args: [
                                                    0.05,
                                                    0.34,
                                                    0.02
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                                lineNumber: 347,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#26221e",
                                                roughness: 0.6
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 346,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0.12,
                                            0.02,
                                            0.075
                                        ],
                                        rotation: [
                                            Math.PI / 2,
                                            0,
                                            -Math.PI / 3
                                        ],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                args: [
                                                    0.04,
                                                    0.24,
                                                    0.02
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                                lineNumber: 351,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#26221e",
                                                roughness: 0.6
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                                lineNumber: 352,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 350,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 334,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `senate-${c.site.id}-${i}`, true, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 315,
                        columnNumber: 13
                    }, this))),
            compounds.flatMap((c)=>c.boxes.filter((b)=>b.kind === 'watchtower').map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    b.x,
                                    b.y + b.h * 0.42,
                                    b.z
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            b.w * 0.55,
                                            b.h * 0.84,
                                            b.d * 0.55
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 366,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#b8b2a4",
                                        roughness: 0.92
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 367,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 365,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    b.x,
                                    b.y + b.h * 0.94,
                                    b.z
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            b.w * 1.5,
                                            b.h * 0.2,
                                            b.d * 1.5
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 371,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#9fc4cc",
                                        roughness: 0.25,
                                        metalness: 0.15
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 372,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 370,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    b.x,
                                    b.y + b.h + 0.22,
                                    b.z
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("coneGeometry", {
                                        args: [
                                            b.w * 1.15,
                                            0.5,
                                            4
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: ROOF_TONES[0],
                                        roughness: 0.62,
                                        metalness: 0.2,
                                        flatShading: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 376,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 374,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `tower-${c.site.id}-${i}`, true, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 364,
                        columnNumber: 13
                    }, this))),
            compounds.flatMap((c)=>c.boxes.filter((b)=>b.kind === 'chapel' || b.kind === 'mosque').map((b, i)=>b.kind === 'chapel' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            b.x,
                            b.y,
                            b.z
                        ],
                        rotation: [
                            0,
                            b.rotY,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    b.h + 1.05,
                                    b.d / 2 - 0.1
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            0.09,
                                            0.72,
                                            0.09
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 391,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#f2ecda",
                                        roughness: 0.7
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 392,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 390,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    b.h + 1.18,
                                    b.d / 2 - 0.1
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            0.34,
                                            0.09,
                                            0.09
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 395,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#f2ecda",
                                        roughness: 0.7
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 396,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 394,
                                columnNumber: 17
                            }, this)
                        ]
                    }, `chapel-${c.site.id}-${i}`, true, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 388,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            b.x,
                            b.y,
                            b.z
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    b.h + 0.42,
                                    0
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                        args: [
                                            1.15,
                                            14,
                                            10,
                                            0,
                                            Math.PI * 2,
                                            0,
                                            Math.PI / 2
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 403,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#2e7d5b",
                                        roughness: 0.5,
                                        metalness: 0.25
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 404,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 402,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    b.h + 1.62,
                                    0
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                        args: [
                                            0.03,
                                            0.03,
                                            0.42,
                                            6
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 407,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#d9c26a",
                                        metalness: 0.7,
                                        roughness: 0.3
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                        lineNumber: 408,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 406,
                                columnNumber: 17
                            }, this)
                        ]
                    }, `mosque-${c.site.id}-${i}`, true, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 400,
                        columnNumber: 15
                    }, this))),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.toilet.length,
                castShadow: true,
                setup: (i, m, color)=>bodySetup(groups.toilet, ()=>'#c8c2b2', i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.95
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 416,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.water.length,
                castShadow: true,
                setup: (i, m, color)=>bodySetup(groups.water, ()=>STEEL, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 423,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.5,
                        metalness: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InstancedGroup, {
                count: groups.flag.length,
                castShadow: true,
                setup: (i, m, color)=>bodySetup(groups.flag, ()=>STEEL, i, m, color),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 429,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.4,
                        metalness: 0.55
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                lineNumber: 428,
                columnNumber: 7
            }, this),
            compounds.map((c)=>{
                const flag = c.boxes.find((b)=>b.kind === 'flag');
                if (!flag) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        flag.x + 0.55,
                        flag.y + flag.h - 0.85,
                        flag.z
                    ],
                    rotation: [
                        0,
                        c.rotY,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                1.05,
                                0.62,
                                0.02
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 439,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: c.site.color,
                            roughness: 0.8,
                            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 440,
                            columnNumber: 13
                        }, this)
                    ]
                }, `flag-${c.site.id}`, true, {
                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                    lineNumber: 438,
                    columnNumber: 11
                }, this);
            }),
            compounds.map((c)=>{
                const tex = gateBoardTexture(c.site.name, c.site.motto, c.site.color);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        c.gate.x + Math.sin(c.rotY) * 0.15,
                        c.gate.y + 3.15,
                        c.gate.z + Math.cos(c.rotY) * 0.15
                    ],
                    rotation: [
                        0,
                        c.rotY,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                4.7,
                                1.18,
                                0.14
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 454,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#ffffff",
                            roughness: 0.55,
                            map: tex,
                            emissive: "#ffffff",
                            emissiveMap: tex,
                            emissiveIntensity: 0.05
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                            lineNumber: 455,
                            columnNumber: 13
                        }, this)
                    ]
                }, `board-${c.site.id}`, true, {
                    fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                    lineNumber: 449,
                    columnNumber: 11
                }, this);
            }),
            compounds.flatMap((c)=>c.boxes.filter((b)=>[
                        'block',
                        'library',
                        'lab',
                        'office',
                        'admin',
                        'theatre',
                        'faculty',
                        'hostel',
                        'hall',
                        'healthsci',
                        'workshop',
                        'demo',
                        'canteen',
                        'clinic',
                        'chapel',
                        'mosque',
                        'senate'
                    ].includes(b.kind)).map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            b.x + Math.sin(b.rotY) * (b.d / 2 + 0.04),
                            b.y + b.h * 0.62,
                            b.z + Math.cos(b.rotY) * (b.d / 2 + 0.04)
                        ],
                        rotation: [
                            0,
                            b.rotY,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    b.w * 0.82,
                                    0.72,
                                    0.08
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 484,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: LOUVRE,
                                roughness: 0.25,
                                metalness: 0.15
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                                lineNumber: 485,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `louvre-${c.site.id}-${b.kind}-${i}`, true, {
                        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
                        lineNumber: 475,
                        columnNumber: 13
                    }, this)))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/SchoolMesh.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/HumanRig.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HumanRig",
    ()=>HumanRig,
    "MidRig",
    ()=>MidRig,
    "rigHairOf",
    ()=>rigHairOf,
    "rigStyleOf",
    ()=>rigStyleOf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Human Rig (Stage 5 "perfect the human")
 * -----------------------------------------------------
 * An articulated low-poly Nigerian: jointed limbs (shoulders/elbows,
 * hips/knees), hands, feet, a head with real hair shapes, and a walk
 * cycle with knee flex + counter-swinging arms + torso bob + hip sway,
 * an idle breathing loop and a run lean.
 *
 * Stage 5 refinements:
 *  - 7.5-head proportions (~1.84 m): longer legs (52% of height),
 *    relaxed shoulders, visible waist taper, smaller head.
 *  - Clothing styles rendered on the body from `colors.style`
 *    (tshirt / kaftan / ankara / senator / hoodie / lace) with clothAlt
 *    2-tone bands, collars, hoods and hems; `dress` + coarse
 *    `hairStyle` remain supported for older callers.
 *  - Hairstyle 3D hints from `colors.hairstyle`: afro cap, dreads/braids
 *    back strands, waves/low-cut/cornrows snug cap, puffs side spheres.
 *
 * Two tiers keep the frame budget honest:
 *  - HumanRig (full): the PLAYER only — every joint, casts shadows.
 *  - MidRig: NPCs — jointed legs + one-piece swinging arms, no
 *    forearm/hand meshes, no shadow casting (blob shadows carry them).
 *
 * Animation is driven entirely by a speedRef the controllers write —
 * the rig owns zero gameplay state. Frame loops allocate nothing.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
'use client';
;
;
;
;
const KNOWN_STYLES = new Set([
    'tshirt',
    'kaftan',
    'ankara',
    'senator',
    'hoodie',
    'lace',
    // M19 — the wardrobe's premium rail (the drops included)
    'agbada',
    'jersey',
    'lab-coat',
    'confluence-gold'
]);
const DRESS_LIKE = new Set([
    'kaftan',
    'lace',
    'agbada',
    'lab-coat',
    'confluence-gold'
]);
const LONG_SLEEVE = new Set([
    'kaftan',
    'senator',
    'hoodie',
    'lace',
    'agbada',
    'lab-coat',
    'confluence-gold'
]);
const SENATOR_TROUSERS = 'senator';
const CAP_HAIR = new Set([
    'low-cut',
    'waves',
    'cornrows'
]);
const STRAND_HAIR = new Set([
    'dreads',
    'braids'
]);
function rigStyleOf(c) {
    if (c.style && KNOWN_STYLES.has(c.style)) return c.style;
    return c.dress ? 'kaftan' : 'tshirt';
}
function rigHairOf(c) {
    if (c.hairstyle) return c.hairstyle;
    if (c.hairStyle === 'volume') return 'afro';
    if (c.hairStyle === 'cap') return 'low-cut';
    return 'bald';
}
/* -------------------------------- proportions ------------------------------- */ /**
 * Shared proportion table (both rigs read it) — a ~1.84 m stylised human
 * on roughly 7.5 heads: legs 52% of height, relaxed shoulder line and a
 * waist that tapers between pelvis and chest.
 */ const P = {
    hipY: 0.96,
    thigh: {
        r: 0.088,
        len: 0.34,
        drop: 0.52
    },
    shin: {
        r: 0.068,
        len: 0.28
    },
    foot: {
        y: -0.4,
        z: 0.06,
        w: 0.13,
        h: 0.085,
        l: 0.27
    },
    pelvis: {
        y: 0.9,
        r: 0.165,
        len: 0.1
    },
    waist: {
        y: 1.05,
        r: 0.152,
        len: 0.12
    },
    chest: {
        y: 1.24,
        r: 0.205,
        len: 0.32
    },
    shoulder: {
        y: 1.45,
        x: 0.27
    },
    upperArm: {
        r: 0.068,
        len: 0.26,
        elbow: 0.38
    },
    foreArm: {
        r: 0.056,
        len: 0.18,
        handY: -0.28,
        handR: 0.07
    },
    neck: {
        y: 1.565
    },
    head: {
        y: 1.71,
        r: 0.127
    }
};
function useRigMaterials(c) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const trim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](c.cloth).multiplyScalar(0.68);
        // M19 — the premium cloth laws: the white coat is white, the Confluence
        // Gold is GOLD (earned colours are not negotiable), agbada keeps the
        // player's chosen cloth but a richer trim
        const clothColor = c.style === 'lab-coat' ? '#f2f2ec' : c.style === 'confluence-gold' ? '#c9992e' : c.cloth;
        const trimColor = c.style === 'agbada' || c.style === 'confluence-gold' ? '#e8c86a' : trim;
        return {
            skin: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: c.skin,
                roughness: 0.72
            }),
            cloth: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: clothColor,
                roughness: 0.9
            }),
            clothAlt: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: c.clothAlt ?? c.cloth,
                roughness: 0.9
            }),
            trim: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: trimColor,
                roughness: 0.82,
                metalness: trimColor === '#e8c86a' ? 0.35 : 0
            }),
            hair: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: c.hair,
                roughness: 1
            }),
            dark: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: '#26221e',
                roughness: 1
            }),
            shoe: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: '#3a332c',
                roughness: 0.95
            })
        };
    }, [
        c.skin,
        c.cloth,
        c.clothAlt,
        c.hair,
        c.hairstyle,
        c.style,
        c.hairStyle,
        c.dress
    ]);
}
/* ------------------------------ hairstyle hints ----------------------------- */ /**
 * 3D hair shapes for one head (head-local space, back = −z).
 * `detail` = player tier (5 strands), false = NPC tier (3 strands).
 */ function HairPieces({ hair, m, detail, seg }) {
    if (hair === 'bald') return null;
    if (CAP_HAIR.has(hair)) {
        // waves / low-cut / cornrows — snug cap hugging the skull
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            position: [
                0,
                0.035,
                -0.015
            ],
            scale: [
                1.07,
                0.82,
                1.07
            ],
            material: m.hair,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    P.head.r,
                    seg,
                    seg
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HumanRig.tsx",
            lineNumber: 143,
            columnNumber: 7
        }, this);
    }
    if (hair === 'afro') {
        // rounded cap sphere, slightly flattened and pushed back
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            position: [
                0,
                0.05,
                -0.012
            ],
            scale: [
                1.04,
                0.94,
                1.04
            ],
            material: m.hair,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    P.head.r * 1.22,
                    seg,
                    seg
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/HumanRig.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this);
    }
    if (hair === 'puffs') {
        // snug base + two side spheres
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        0.035,
                        -0.015
                    ],
                    scale: [
                        1.07,
                        0.82,
                        1.07
                    ],
                    material: m.hair,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            P.head.r,
                            seg,
                            seg
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0.125,
                        0.085,
                        -0.02
                    ],
                    material: m.hair,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.072,
                            seg,
                            seg
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        -0.125,
                        0.085,
                        -0.02
                    ],
                    material: m.hair,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.072,
                            seg,
                            seg
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    if (STRAND_HAIR.has(hair)) {
        // dreads / braids — thin strands hanging from the back of the head
        const long = hair === 'braids';
        const strands = detail ? long ? [
            [
                0.088,
                -0.13,
                -0.058,
                0.4
            ],
            [
                -0.088,
                -0.13,
                -0.058,
                0.4
            ],
            [
                0.042,
                -0.12,
                -0.1,
                0.34
            ],
            [
                -0.042,
                -0.12,
                -0.1,
                0.34
            ],
            [
                0,
                -0.125,
                -0.112,
                0.32
            ]
        ] : [
            [
                0.075,
                -0.1,
                -0.082,
                0.26
            ],
            [
                -0.075,
                -0.1,
                -0.082,
                0.26
            ],
            [
                0.028,
                -0.115,
                -0.105,
                0.28
            ],
            [
                -0.028,
                -0.115,
                -0.105,
                0.28
            ]
        ] : [
            [
                0.07,
                -0.1,
                -0.08,
                0.24
            ],
            [
                -0.07,
                -0.1,
                -0.08,
                0.24
            ],
            [
                0,
                -0.11,
                -0.104,
                0.22
            ]
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        0.035,
                        -0.015
                    ],
                    scale: [
                        1.07,
                        0.82,
                        1.07
                    ],
                    material: m.hair,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            P.head.r,
                            seg,
                            seg
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this),
                strands.map(([x, y, z, len], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            x,
                            y,
                            z
                        ],
                        rotation: [
                            long ? 0.08 : 0.12,
                            0,
                            -x * 1.6
                        ],
                        material: m.hair,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.034,
                                len,
                                0.034
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this)
                    }, i, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true);
    }
    return null;
}
/**
 * The full articulated human — ~1.84 m, pivot-based limbs.
 * speedRef: units/s movement speed (0 = idle breathing).
 * rig (M19): the walk-style parameters from the wardrobe — 'street' is
 * the identity element (all multipliers 1, lean 0), so the default path
 * renders EXACTLY the classic walk. NPC rigs stay street forever.
 */ const STREET_RIG = {
    freq: 1,
    swing: 1,
    bob: 1,
    sway: 1,
    lean: 0,
    shin: 1
};
function HumanRig({ colors, speedRef, castShadow = true, rig }) {
    const m = useRigMaterials(colors);
    const style = rigStyleOf(colors);
    const hairstyle = rigHairOf(colors);
    const dressLike = DRESS_LIKE.has(style);
    const walkRig = rig ?? STREET_RIG;
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        lArm: null,
        rArm: null,
        lFore: null,
        rFore: null,
        lLeg: null,
        rLeg: null,
        lShin: null,
        rShin: null,
        chest: null,
        body: null
    });
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Math.random() * Math.PI * 2, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state)=>{
        const r = refs.current;
        const t = state.clock.elapsedTime + phase;
        const s = speedRef.current;
        const walk = Math.min(1, s / 4.4);
        const run = Math.max(0, Math.min(1, (s - 4.4) / 3));
        // M19 — the wardrobe's walk style bends every honest multiplier; 'street'
        // is the identity, so the classic walk is byte-identical when unequipped
        const f = (8.4 + run * 2.6) * walkRig.freq;
        const swing = Math.sin(t * f) * (0.52 + run * 0.22) * walk * walkRig.swing;
        // arms counter-swing (phase-locked to the legs), elbows flex more while running
        if (r.lArm) r.lArm.rotation.x = -swing;
        if (r.rArm) r.rArm.rotation.x = swing;
        if (r.lFore) r.lFore.rotation.x = -0.26 - run * 0.72 - Math.max(0, -swing) * 0.55;
        if (r.rFore) r.rFore.rotation.x = -0.26 - run * 0.72 - Math.max(0, swing) * 0.55;
        // legs: thigh swing + knee flex on the back-swing (toe-off)
        if (r.lLeg) r.lLeg.rotation.x = swing;
        if (r.rLeg) r.rLeg.rotation.x = -swing;
        if (r.lShin) r.lShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 0.5)) * 0.82 * walk * walkRig.shin;
        if (r.rShin) r.rShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 1.5)) * 0.82 * walk * walkRig.shin;
        // torso bob (two beats per stride) + run lean + gentle hip sway
        if (r.body) {
            r.body.position.y = Math.abs(Math.sin(t * f)) * walk * 0.05 * walkRig.bob;
            r.body.rotation.x = run * 0.16 + walkRig.lean;
            r.body.rotation.z = Math.sin(t * f) * 0.035 * walk * walkRig.sway;
        }
        // idle breathing — chest scale 1 ± 0.01, faster and subtler than before
        if (r.chest) {
            const breathe = 1 + Math.sin(t * 2.6) * 0.01 * (1 - walk * 0.7);
            r.chest.scale.set(breathe, 1, breathe);
        }
    });
    const sh = castShadow;
    // limb + trouser materials by style
    const thighMat = dressLike ? m.cloth : style === SENATOR_TROUSERS ? m.cloth : m.dark;
    const shinMat = dressLike ? m.skin : style === SENATOR_TROUSERS ? m.cloth : style === 'hoodie' ? m.dark : m.skin;
    const pelvisMat = dressLike || style === SENATOR_TROUSERS ? m.cloth : m.dark;
    const foreMat = LONG_SLEEVE.has(style) ? m.cloth : m.skin;
    const Arm = ({ side })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
            ref: (el)=>{
                if (side === -1) refs.current.lArm = el;
                else refs.current.rArm = el;
            },
            position: [
                side * P.shoulder.x,
                P.shoulder.y,
                0
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        -0.21,
                        0
                    ],
                    castShadow: sh,
                    material: m.cloth,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            P.upperArm.r,
                            P.upperArm.len,
                            3,
                            7
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 301,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    ref: (el)=>{
                        if (side === -1) refs.current.lFore = el;
                        else refs.current.rFore = el;
                    },
                    position: [
                        0,
                        -P.upperArm.elbow,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                -0.13,
                                0
                            ],
                            castShadow: sh,
                            material: foreMat,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                                args: [
                                    P.foreArm.r,
                                    P.foreArm.len,
                                    3,
                                    7
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 312,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                P.foreArm.handY,
                                0
                            ],
                            castShadow: sh,
                            material: m.skin,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    P.foreArm.handR,
                                    8,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 316,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 304,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/world/HumanRig.tsx",
            lineNumber: 293,
            columnNumber: 5
        }, this);
    const Leg = ({ side })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
            ref: (el)=>{
                if (side === -1) refs.current.lLeg = el;
                else refs.current.rLeg = el;
            },
            position: [
                side * 0.12,
                P.hipY,
                0
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        -0.26,
                        0
                    ],
                    castShadow: sh,
                    material: thighMat,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            P.thigh.r,
                            P.thigh.len,
                            3,
                            7
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 332,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    ref: (el)=>{
                        if (side === -1) refs.current.lShin = el;
                        else refs.current.rShin = el;
                    },
                    position: [
                        0,
                        -P.thigh.drop,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                -0.21,
                                0
                            ],
                            castShadow: sh,
                            material: shinMat,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                                args: [
                                    P.shin.r,
                                    P.shin.len,
                                    3,
                                    7
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 343,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                P.foot.y,
                                P.foot.z
                            ],
                            castShadow: sh,
                            material: m.shoe,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    P.foot.w,
                                    P.foot.h,
                                    P.foot.l
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 347,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 335,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/world/HumanRig.tsx",
            lineNumber: 324,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: (el)=>{
            refs.current.body = el;
        },
        position: [
            0,
            0,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Leg, {
                side: -1
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Leg, {
                side: 1
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    P.pelvis.y,
                    0
                ],
                castShadow: sh,
                material: pelvisMat,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                    args: [
                        P.pelvis.r,
                        P.pelvis.len,
                        3,
                        8
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 360,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 359,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    P.waist.y,
                    0
                ],
                castShadow: sh,
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                    args: [
                        P.waist.r,
                        P.waist.len,
                        3,
                        9
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 364,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 363,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: (el)=>{
                    refs.current.chest = el;
                },
                position: [
                    0,
                    P.chest.y,
                    0
                ],
                castShadow: sh,
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                    args: [
                        P.chest.r,
                        P.chest.len,
                        4,
                        10
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 367,
                columnNumber: 7
            }, this),
            style === 'kaftan' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.94,
                            0
                        ],
                        castShadow: sh,
                        material: m.cloth,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.215,
                                0.35,
                                0.8,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 381,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.05,
                            1.415,
                            0.145
                        ],
                        rotation: [
                            0,
                            0,
                            0.5
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.035,
                                0.14,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 385,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 384,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            -0.05,
                            1.415,
                            0.145
                        ],
                        rotation: [
                            0,
                            0,
                            -0.5
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.035,
                                0.14,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 388,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 387,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.31,
                            0.192
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.018,
                                0.16,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 391,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 390,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            style === 'lace' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.9,
                            0
                        ],
                        castShadow: sh,
                        material: m.cloth,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.205,
                                0.375,
                                0.95,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 398,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.45,
                            0
                        ],
                        castShadow: sh,
                        material: m.clothAlt,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.382,
                                0.382,
                                0.055,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 402,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            (style === 'agbada' || style === 'confluence-gold') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.86,
                            0
                        ],
                        castShadow: sh,
                        material: m.cloth,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.24,
                                0.46,
                                1.02,
                                14
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 411,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 410,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.28,
                            0.2
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.16,
                                0.3,
                                0.014
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 415,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 414,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.19,
                            1.47,
                            0
                        ],
                        rotation: [
                            0,
                            0,
                            -0.16
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.14,
                                0.2,
                                0.05
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 419,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 418,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            -0.19,
                            1.47,
                            0
                        ],
                        rotation: [
                            0,
                            0,
                            0.16
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.14,
                                0.2,
                                0.05
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 422,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 421,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            style === 'lab-coat' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.92,
                            0
                        ],
                        castShadow: sh,
                        material: m.cloth,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.215,
                                0.34,
                                0.88,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 430,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 429,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.055,
                            1.38,
                            0.16
                        ],
                        rotation: [
                            0,
                            0,
                            0.5
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.03,
                                0.16,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 434,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 433,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            -0.055,
                            1.38,
                            0.16
                        ],
                        rotation: [
                            0,
                            0,
                            -0.5
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.03,
                                0.16,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 437,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 436,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            style === 'jersey' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.045,
                            1.3,
                            0.2
                        ],
                        castShadow: sh,
                        material: m.clothAlt,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.035,
                                0.13,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 444,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.095,
                            1.25,
                            0.2
                        ],
                        castShadow: sh,
                        material: m.clothAlt,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.065,
                                0.035,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 448,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 447,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            style === 'ankara' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.08,
                            0
                        ],
                        castShadow: sh,
                        material: m.clothAlt,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.212,
                                0.212,
                                0.1,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 456,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 455,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.35,
                            0
                        ],
                        castShadow: sh,
                        material: m.clothAlt,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                0.185,
                                0.185,
                                0.07,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 459,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 458,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            style === SENATOR_TROUSERS && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.055,
                            1.42,
                            0.15
                        ],
                        rotation: [
                            0,
                            0,
                            0.55
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.11,
                                0.035,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 467,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 466,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            -0.055,
                            1.42,
                            0.15
                        ],
                        rotation: [
                            0,
                            0,
                            -0.55
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.11,
                                0.035,
                                0.012
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 470,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 469,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.3,
                            0.198
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.018,
                                0.2,
                                0.01
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 473,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 472,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            style === 'hoodie' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.5,
                            -0.1
                        ],
                        scale: [
                            1.18,
                            0.72,
                            0.9
                        ],
                        castShadow: sh,
                        material: m.cloth,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.13,
                                10,
                                10
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 481,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 480,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            1.06,
                            0.182
                        ],
                        castShadow: sh,
                        material: m.trim,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                0.17,
                                0.085,
                                0.03
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 484,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 483,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Arm, {
                side: -1
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Arm, {
                side: 1
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 490,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    P.neck.y,
                    0
                ],
                material: m.skin,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.055,
                        0.065,
                        0.09,
                        8
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 493,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 492,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    P.head.y,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        castShadow: sh,
                        material: m.skin,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                P.head.r,
                                14,
                                14
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 497,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 496,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            -0.04,
                            0.028
                        ],
                        scale: [
                            0.88,
                            0.72,
                            0.92
                        ],
                        material: m.skin,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.115,
                                12,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 501,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HairPieces, {
                        hair: hairstyle,
                        m: m,
                        detail: true,
                        seg: 12
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 503,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 495,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HumanRig.tsx",
        lineNumber: 355,
        columnNumber: 5
    }, this);
}
function MidRig({ colors, speedRef }) {
    const m = useRigMaterials(colors);
    const style = rigStyleOf(colors);
    const hairstyle = rigHairOf(colors);
    const dressLike = DRESS_LIKE.has(style);
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        lArm: null,
        rArm: null,
        lLeg: null,
        rLeg: null,
        lShin: null,
        rShin: null,
        chest: null,
        body: null
    });
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Math.random() * Math.PI * 2, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state)=>{
        const r = refs.current;
        const t = state.clock.elapsedTime + phase;
        const s = speedRef.current;
        const walk = Math.min(1, s / 4.4);
        const run = Math.max(0, Math.min(1, (s - 4.4) / 3));
        const f = 8.4 + run * 2.6;
        const swing = Math.sin(t * f) * 0.5 * walk;
        if (r.lArm) r.lArm.rotation.x = -swing;
        if (r.rArm) r.rArm.rotation.x = swing;
        if (r.lLeg) r.lLeg.rotation.x = swing;
        if (r.rLeg) r.rLeg.rotation.x = -swing;
        if (r.lShin) r.lShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 0.5)) * 0.8 * walk;
        if (r.rShin) r.rShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 1.5)) * 0.8 * walk;
        if (r.body) {
            r.body.position.y = Math.abs(Math.sin(t * f)) * walk * 0.045;
            r.body.rotation.z = Math.sin(t * f) * 0.03 * walk;
        }
        if (r.chest) {
            const breathe = 1 + Math.sin(t * 2.6) * 0.01 * (1 - walk * 0.7);
            r.chest.scale.set(breathe, 1, breathe);
        }
    });
    // simplified cloth rules (same logic as the full rig, fewer meshes)
    const thighMat = dressLike || style === SENATOR_TROUSERS ? m.cloth : m.dark;
    const shinMat = dressLike ? m.skin : style === SENATOR_TROUSERS ? m.cloth : style === 'hoodie' ? m.dark : m.skin;
    const pelvisMat = dressLike || style === SENATOR_TROUSERS ? m.cloth : m.dark;
    const Leg = ({ side })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
            ref: (el)=>{
                if (side === -1) refs.current.lLeg = el;
                else refs.current.rLeg = el;
            },
            position: [
                side * 0.12,
                P.hipY,
                0
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        -0.26,
                        0
                    ],
                    material: thighMat,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            P.thigh.r,
                            P.thigh.len,
                            3,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 569,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 568,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    ref: (el)=>{
                        if (side === -1) refs.current.lShin = el;
                        else refs.current.rShin = el;
                    },
                    position: [
                        0,
                        -P.thigh.drop,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                -0.21,
                                0
                            ],
                            material: shinMat,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                                args: [
                                    P.shin.r,
                                    P.shin.len,
                                    3,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                                lineNumber: 579,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 578,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                P.foot.y,
                                P.foot.z
                            ],
                            material: m.shoe,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    P.foot.w,
                                    P.foot.h,
                                    P.foot.l
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                                lineNumber: 582,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 581,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 571,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/world/HumanRig.tsx",
            lineNumber: 561,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: (el)=>{
            refs.current.body = el;
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Leg, {
                side: -1
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 590,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Leg, {
                side: 1
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 591,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    P.pelvis.y,
                    0
                ],
                material: pelvisMat,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                    args: [
                        P.pelvis.r,
                        P.pelvis.len,
                        3,
                        8
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 593,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 592,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    P.waist.y,
                    0
                ],
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                    args: [
                        P.waist.r,
                        P.waist.len,
                        3,
                        8
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 596,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 595,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: (el)=>{
                    refs.current.chest = el;
                },
                position: [
                    0,
                    P.chest.y,
                    0
                ],
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                    args: [
                        P.chest.r,
                        P.chest.len,
                        4,
                        9
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 599,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 598,
                columnNumber: 7
            }, this),
            style === 'kaftan' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.94,
                    0
                ],
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.215,
                        0.34,
                        0.8,
                        10
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 605,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 604,
                columnNumber: 9
            }, this),
            style === 'lace' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.9,
                    0
                ],
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.2,
                        0.36,
                        0.95,
                        10
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 610,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 609,
                columnNumber: 9
            }, this),
            style === 'ankara' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.08,
                    0
                ],
                material: m.clothAlt,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.212,
                        0.212,
                        0.1,
                        10
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 615,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 614,
                columnNumber: 9
            }, this),
            style === 'hoodie' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    1.5,
                    -0.1
                ],
                scale: [
                    1.18,
                    0.72,
                    0.9
                ],
                material: m.cloth,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                    args: [
                        0.13,
                        9,
                        9
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 620,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 619,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    -P.shoulder.x,
                    P.shoulder.y,
                    0
                ],
                ref: (el)=>{
                    refs.current.lArm = el;
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        -0.28,
                        0
                    ],
                    material: m.cloth,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            0.064,
                            0.42,
                            3,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 630,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 629,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 625,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    P.shoulder.x,
                    P.shoulder.y,
                    0
                ],
                ref: (el)=>{
                    refs.current.rArm = el;
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        -0.28,
                        0
                    ],
                    material: m.cloth,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("capsuleGeometry", {
                        args: [
                            0.064,
                            0.42,
                            3,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 638,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 637,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 633,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    P.neck.y,
                    0
                ],
                material: m.skin,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                    args: [
                        0.055,
                        0.065,
                        0.09,
                        8
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/HumanRig.tsx",
                    lineNumber: 642,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 641,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    P.head.y,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        material: m.skin,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                P.head.r,
                                12,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/HumanRig.tsx",
                            lineNumber: 646,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 645,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HairPieces, {
                        hair: hairstyle,
                        m: m,
                        detail: false,
                        seg: 9
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/HumanRig.tsx",
                        lineNumber: 648,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/HumanRig.tsx",
                lineNumber: 644,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/HumanRig.tsx",
        lineNumber: 589,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/Actors.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Birds",
    ()=>Birds,
    "Npcs",
    ()=>Npcs,
    "PlayerAvatar",
    ()=>PlayerAvatar,
    "PlayerController",
    ()=>PlayerController,
    "Rain",
    ()=>Rain,
    "SmokeWisps",
    ()=>SmokeWisps,
    "Traffic",
    ()=>Traffic,
    "playerRigColors",
    ()=>playerRigColors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Actors (Stage 3D)
 * ---------------------------------
 * Everything that moves in the world:
 *  - PlayerController: unified joystick/keyboard input, collision, terrain
 *    grounding, walk-cycle animation, character tinted from the player's
 *    ACTUAL avatar config in the save.
 *  - CameraRig: smooth third-person follow with drag-look + soft auto-align.
 *  - NPCs strolling the lively districts (fewer at night — the real clock).
 *  - Keke/okada/taxi traffic driving the road loops.
 *  - Rain particles when the real weather says so.
 *
 * No gameplay logic lives here: movement is free expression, while money,
 * time and location authority stay in the store.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export D as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/collision.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-ssr] (ecmascript)"); // M19 — the equipped walk style
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HumanRig$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/HumanRig.tsx [app-ssr] (ecmascript)");
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
/* ------------------------------ rig colour mapping ---------------------------- */ const VOLUME_HAIR = new Set([
    'afro',
    'puffs',
    'dreads',
    'braids'
]);
const CAP_HAIR = new Set([
    'low-cut',
    'waves',
    'cornrows'
]);
const DRESS_STYLES = new Set([
    'kaftan',
    'lace'
]);
function playerRigColors(avatar) {
    return {
        skin: avatar.skinTone,
        cloth: avatar.clothingColor,
        clothAlt: avatar.clothingColor,
        hair: avatar.hairColor,
        hairStyle: VOLUME_HAIR.has(avatar.hairstyle) ? 'volume' : CAP_HAIR.has(avatar.hairstyle) ? 'cap' : 'none',
        dress: DRESS_STYLES.has(avatar.clothingStyle),
        // Stage 5 — raw keys so the rig can render the exact style + hair hints
        hairstyle: avatar.hairstyle,
        style: avatar.clothingStyle
    };
}
/** soft blob shadow — reads as contact shadow, costs one quad */ function BlobShadow({ scale = 1 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        rotation: [
            -Math.PI / 2,
            0,
            0
        ],
        position: [
            0,
            0.04,
            0
        ],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                args: [
                    0.5 * scale,
                    12
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/Actors.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                color: "#1a2016",
                transparent: true,
                opacity: 0.28,
                depthWrite: false
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/Actors.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function PlayerAvatar({ avatar, speedRef, driving = false }) {
    // M19 — the equipped walk style rides the wardrobe slice (store subscription
    // re-renders only when the PLAYER equips something new — rare and cheap)
    const activeWalk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.wardrobe.activeWalk);
    const rig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["walkRigFor"])({
            activeWalk
        }), [
        activeWalk
    ]);
    if (driving) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HumanRig$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HumanRig"], {
        colors: playerRigColors(avatar),
        speedRef: speedRef,
        castShadow: true,
        rig: rig
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 95,
        columnNumber: 10
    }, this);
}
function PlayerController({ avatar, spawnLocationId, onPosition, onNearestAnchor, onDistrict, driving = false }) {
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const playerSpeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        z: 0,
        vx: 0,
        vz: 0,
        yaw: 0,
        camYaw: 0,
        camPitch: 0.42,
        camDist: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].cameraDistance,
        speed: 0,
        anchorId: null,
        districtId: null,
        teleport: null
    });
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])();
    // spawn at the player's actual current location
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"][spawnLocationId];
        if (!a || !group.current) return;
        const s = state.current;
        s.x = a.x + 4;
        s.z = a.z + 5;
        // face the camera toward the anchor
        s.camYaw = Math.atan2(a.x - s.x, a.z - s.z);
        const groundY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(s.x, s.z);
        group.current.position.set(s.x, groundY, s.z);
        // snap the camera to the correct rig position on the FIRST frame
        // (no slow lerp from the default canvas position)
        const cosP = Math.cos(s.camPitch);
        camera.position.set(s.x - Math.sin(s.camYaw) * s.camDist * cosP, groundY + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].cameraHeight + Math.sin(s.camPitch) * s.camDist * 0.9, s.z - Math.cos(s.camYaw) * s.camDist * cosP);
        camera.lookAt(a.x, a.y + 1.6, a.z);
        // dev/E2E debug bridge (stripped from production builds)
        if ("TURBOPACK compile-time truthy", 1) {
            ;
            window.__lko = {
                teleport: (x, z)=>{
                    state.current.teleport = {
                        x,
                        z
                    };
                },
                pos: ()=>({
                        x: state.current.x,
                        z: state.current.z
                    }),
                anchors: Object.fromEntries(Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]).map(([id, an])=>[
                        id,
                        {
                            x: an.x,
                            z: an.z
                        }
                    ])),
                // E2E: feed the walked-meters accumulator directly (the frame loop
                // feeds it via addWalkDistance(s.speed*dt) — this skips terrain fights)
                walk: (m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addWalkDistance"])(m)
            };
        }
        return ()=>{
            delete window.__lko;
        };
    }, [
        spawnLocationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, rawDt)=>{
        const s = state.current;
        const dt = Math.min(rawDt, 0.05);
        const g = group.current;
        if (!g) return;
        // debug teleport (E2E) — the NODE_ENV bridge's request, or the
        // e2e=1 production witness request (M23 flora witness)
        const tpReq = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["e2eTeleport"].pending ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["e2eTeleport"] : s.teleport;
        if (tpReq) {
            s.x = tpReq.x;
            s.z = tpReq.z;
            s.vx = 0;
            s.vz = 0;
            s.teleport = null;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["e2eTeleport"].pending = false;
        }
        const frozen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputFrozen"])();
        // ---- look ----
        const look = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["consumeLook"])();
        s.camYaw -= look.dx * 0.0042;
        s.camPitch = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(s.camPitch + look.dy * 0.0032, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].camPitchMin, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].camPitchMax);
        // ---- movement (camera-relative) ----
        const input = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readMoveInput"])();
        const moving = !frozen && (Math.abs(input.x) > 0.01 || Math.abs(input.y) > 0.01);
        const targetSpeed = moving ? input.sprint ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].sprintSpeed : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].walkSpeed : 0;
        let tx = 0;
        let tz = 0;
        if (moving) {
            const sin = Math.sin(s.camYaw);
            const cos = Math.cos(s.camYaw);
            // forward = -z when yaw=0 → rotate input by camYaw
            tx = input.x * cos - input.y * sin;
            tz = -input.x * sin - input.y * cos;
            const len = Math.hypot(tx, tz) || 1;
            tx = tx / len * targetSpeed;
            tz = tz / len * targetSpeed;
        }
        const accel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].accel * dt;
        s.vx += __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(tx - s.vx, -accel, accel);
        s.vz += __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(tz - s.vz, -accel, accel);
        let nx = s.x + s.vx * dt;
        let nz = s.z + s.vz * dt;
        [nx, nz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePosition"])(nx, nz);
        s.x = nx;
        s.z = nz;
        s.speed = Math.hypot(s.vx, s.vz);
        // presentation MEASURES (the store APPLIES on exit) — metres walked
        if (!frozen) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addWalkDistance"])(s.speed * dt);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportPlayerPos"])(s.x, s.z, s.yaw);
        // slide dampening when blocked
        if (s.speed > 0.01) {
            const dot = (s.vx * tx + s.vz * tz) / (s.speed * (targetSpeed || 1) + 1e-6);
            if (targetSpeed > 0 && dot < 0.4) {
                s.vx *= 0.6;
                s.vz *= 0.6;
            }
        }
        // ---- ground ----
        const deckY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(s.x, s.z);
        const groundY = deckY ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(s.x, s.z);
        g.position.set(s.x, groundY, s.z);
        // face movement direction
        if (s.speed > 0.4) {
            const targetYaw = Math.atan2(s.vx, s.vz);
            let d = targetYaw - s.yaw;
            while(d > Math.PI)d -= Math.PI * 2;
            while(d < -Math.PI)d += Math.PI * 2;
            s.yaw += d * Math.min(1, dt * 10);
        }
        g.rotation.y = s.yaw;
        // ---- nearest anchor / point of interest (interaction discovery) ----
        let nearestId = null;
        let nearestD = Infinity;
        for(let ai = 0; ai < ANCHOR_ENTRIES.length; ai++){
            const id = ANCHOR_ENTRIES[ai][0];
            const a = ANCHOR_ENTRIES[ai][1];
            const d = Math.hypot(a.x - s.x, a.z - s.z);
            if (d < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].interactRadius && d < nearestD) {
                nearestD = d;
                nearestId = id;
            }
        }
        // physical props (job boards) are interactables too — namespaced ids
        for (const p of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POINTS_OF_INTEREST"]){
            const d = Math.hypot(p.x - s.x, p.z - s.z);
            if (d < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].interactRadius * 0.62 && d < nearestD) {
                nearestD = d;
                nearestId = `poi:${p.id}`;
            }
        }
        // interior doors (INC 4) — tight radius so stepping inside feels deliberate
        for (const dr of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ALL_DOORS"]){
            const d = Math.hypot(dr.x - s.x, dr.z - s.z);
            if (d < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERIOR"].doorRadius && d < nearestD) {
                nearestD = d;
                nearestId = `door:${dr.interiorId}`;
            }
        }
        const changed = nearestId !== s.anchorId;
        s.anchorId = nearestId;
        if (onNearestAnchor && changed) {
            onNearestAnchor(nearestId);
        }
        // ---- district awareness (the HUD shows arrival toasts) ----
        let districtNow = null;
        for (const d of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DISTRICTS"]){
            if (Math.hypot(d.x - s.x, d.z - s.z) <= d.radius) {
                districtNow = d.id;
                break;
            }
        }
        if (onDistrict && districtNow !== s.districtId) {
            s.districtId = districtNow;
            onDistrict(districtNow);
        }
        if (onPosition) onPosition(s.x, s.z, s.yaw);
        playerSpeed.current = s.speed;
        // ---- camera ----
        const rig = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAM_RIG"][(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCamMode"])()];
        s.camDist = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(s.camDist + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["consumeZoom"])(), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].cameraMinDistance, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].cameraMaxDistance * ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCamMode"])() === 'drone' ? 1.5 : 1));
        // soft auto-align behind the running player (off in orbit mode)
        if (rig.align > 0 && s.speed > 1.5 && look.dx === 0) {
            let d = s.yaw - s.camYaw;
            while(d > Math.PI)d -= Math.PI * 2;
            while(d < -Math.PI)d += Math.PI * 2;
            s.camYaw += d * Math.min(1, dt * rig.align * 0.12);
        }
        // third-person rig — parked BEHIND the player (opposite the view dir)
        const cosP = Math.cos(s.camPitch);
        const rigDist = s.camDist * rig.dist;
        const desired = CAM_DESIRED.set(s.x - Math.sin(s.camYaw) * rigDist * cosP, groundY + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE"].cameraHeight + rig.height + Math.sin(s.camPitch) * rigDist * 0.9, s.z - Math.cos(s.camYaw) * rigDist * cosP);
        // keep the camera above terrain
        const camGround = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(desired.x, desired.z) + 1.2;
        if (desired.y < camGround) desired.y = camGround;
        // INC 4 — never let a building swallow the view: pull the boom in
        // to just before the first obstructed sample (known clipping fix)
        const obsT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cameraObstructionT"])(s.x, s.z, desired.x, desired.z, desired.y);
        if (obsT !== null) {
            desired.lerpVectors(CAM_FROM.set(s.x, groundY + 1.7, s.z), desired, obsT);
        }
        camera.position.lerp(desired, Math.min(1, dt * ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCamMode"])() === 'drone' ? 4.2 : 6.5)));
        camera.lookAt(s.x, groundY + 1.7, s.z);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: group,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlayerAvatar, {
                avatar: avatar,
                speedRef: playerSpeed,
                driving: driving
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/Actors.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            !driving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BlobShadow, {
                scale: 1.2
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/Actors.tsx",
                lineNumber: 349,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 347,
        columnNumber: 5
    }, this);
}
/* ----------------------------------- NPCs ------------------------------------- */ const NPC_COUNT = 12;
const NPC_SKINS = [
    '#4A2C17',
    '#5C3A21',
    '#6E4326',
    '#8A5A32',
    '#A9714B'
];
const NPC_CLOTHES = [
    '#c94f2e',
    '#2e7d5b',
    '#d99a2b',
    '#3a6ea3',
    '#8a5aa3',
    '#b03a5b',
    '#e8dcc3'
];
const NPC_HAIRS = [
    '#1A1714',
    '#2E1D12',
    '#5C2330',
    '#8A6A3B',
    '#B79545'
];
// wardrobe keys — tshirt double-weighted so the street still reads everyday
const NPC_STYLES = [
    'tshirt',
    'tshirt',
    'kaftan',
    'ankara',
    'senator',
    'hoodie',
    'lace'
];
const NPC_HAIRSTYLES = [
    'bald',
    'low-cut',
    'waves',
    'afro',
    'cornrows',
    'dreads',
    'braids',
    'puffs'
];
/** FNV-1a string hash — seeds the per-NPC look rng (deterministic crowds) */ function hashSeed(s) {
    let h = 2166136261;
    for(let i = 0; i < s.length; i++){
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
/* ------------------------ talk chips + speech bubbles ----------------------- */ const TALK_RADIUS = 4 // u — close enough to say hello
;
const BUBBLE_MS = 4500;
const CHIP_Y = 1.98 // floats just above the head
;
const BUBBLE_Y = 2.44;
/**
 * Shared scratch written by the Npcs frame loop and read by NpcTalkLayer —
 * a stable object + one fixed array, so the frame path allocates nothing.
 */ const npcTalk = {
    /** world position per NPC (x, groundY, z); y = -999 while hidden */ pos: new Float32Array(NPC_COUNT * 3),
    target: {
        live: false,
        i: -1,
        id: '',
        name: ''
    }
};
/* ---- SILK II: the player loop allocates NOTHING -------------------------
 * ANCHOR_ENTRIES is hoisted once (Object.entries used to allocate a fresh
 * 22-tuple array EVERY FRAME); the camera boom reuses module scratch
 * vectors instead of `new THREE.Vector3` twice per frame. */ const ANCHOR_ENTRIES = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]);
const CAM_DESIRED = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
const CAM_FROM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
/** one fixed overlay host for all talk DOM (created lazily, client-only) */ let TALK_HOST = null;
function talkHost() {
    if (!TALK_HOST) {
        TALK_HOST = document.createElement('div');
        TALK_HOST.setAttribute('data-lko-npc-talk', '');
        TALK_HOST.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:40;overflow:hidden;';
        document.body.appendChild(TALK_HOST);
    }
    return TALK_HOST;
}
// projection scratch — module scope, no per-frame allocation
const TALK_V = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
const TALK_DIR = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
/** place a DOM anchor over a world point; hides it when behind/off screen */ function placeAnchor(el, x, y, z, cam) {
    if (!el) return;
    TALK_V.set(x, y, z);
    cam.getWorldDirection(TALK_DIR);
    const dx = TALK_V.x - cam.position.x;
    const dy = TALK_V.y - cam.position.y;
    const dz = TALK_V.z - cam.position.z;
    if (dx * TALK_DIR.x + dy * TALK_DIR.y + dz * TALK_DIR.z < 0.4) {
        el.style.display = 'none';
        return;
    }
    TALK_V.project(cam);
    if (TALK_V.x < -1.15 || TALK_V.x > 1.15 || TALK_V.y < -1.15 || TALK_V.y > 1.1) {
        el.style.display = 'none';
        return;
    }
    el.style.display = 'block';
    el.style.left = `${(TALK_V.x * 0.5 + 0.5) * 100}%`;
    el.style.top = `${(-TALK_V.y * 0.5 + 0.5) * 100}%`;
}
/**
 * The talk chip + speech bubble.
 *
 * WHY IMPERATIVE DOM: the codebase runs without @react-three/drei, and a
 * react-dom portal rendered inside the R3F v9 tree corrupts the reconciler
 * here ("Unexpected Fiber popped" → Canvas crash), so this is the in-house
 * equivalent of <Html>: the component returns null into the three tree and
 * owns two plain DOM anchors inside a fixed overlay host. Everything is
 * written directly per frame (projection + styles, zero allocation, zero
 * React re-renders). Tapping the chip goes through
 * useGameStore.chatNpc — no economy logic lives here.
 */ const CHIP_CLASS = 'lko-press pointer-events-auto flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 bg-[var(--lko-green)] px-4 py-2 text-[13px] font-extrabold text-white shadow-[var(--lko-shadow-lg)]';
const BUBBLE_CARD_CLASS = 'w-[min(72vw,260px)] rounded-2xl border border-white/25 bg-black/60 p-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md';
const BUBBLE_NAME_CLASS = 'text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-gold)]';
const BUBBLE_TEXT_CLASS = 'mt-1 text-[13px] font-semibold leading-snug';
function NpcTalkLayer() {
    const camera = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])((s)=>s.camera);
    const els = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chipId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const bubbleI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(-1);
    const bubbleUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // build the two DOM anchors once; drop them when the world unmounts
    // (the tap handler lives here too — it only reads refs + the store, so
    //  it never goes stale and the component never re-renders)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const host = talkHost();
        const chip = document.createElement('div');
        chip.setAttribute('data-lko-talk-chip', '');
        chip.style.cssText = 'position:absolute;display:none;transform:translate(-50%,-100%);';
        const chipBtn = document.createElement('button');
        chipBtn.type = 'button';
        chipBtn.className = CHIP_CLASS;
        const icon = document.createElement('span');
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '💬';
        const chipLabel = document.createElement('span');
        chipLabel.textContent = 'Talk';
        chipBtn.append(icon, chipLabel);
        chip.appendChild(chipBtn);
        host.appendChild(chip);
        const bubble = document.createElement('div');
        bubble.setAttribute('data-lko-talk-bubble', '');
        bubble.style.cssText = 'position:absolute;display:none;transform:translate(-50%,-100%);';
        const card = document.createElement('div');
        card.className = `lko-pop ${BUBBLE_CARD_CLASS}`;
        const bubbleName = document.createElement('p');
        bubbleName.className = BUBBLE_NAME_CLASS;
        const bubbleText = document.createElement('p');
        bubbleText.className = BUBBLE_TEXT_CLASS;
        card.append(bubbleName, bubbleText);
        bubble.appendChild(card);
        host.appendChild(bubble);
        els.current = {
            chip,
            chipBtn,
            chipLabel,
            bubble,
            bubbleName,
            bubbleText
        };
        // chip tap → the store's chat action (outcome drives the bubble)
        const onTap = ()=>{
            const tgt = npcTalk.target;
            if (!tgt.live) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
            const out = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().chatNpc(tgt.id);
            if (out) {
                bubbleName.textContent = out.firstMeeting ? `${tgt.name} · first meeting` : tgt.name;
                bubbleText.textContent = out.reply;
                bubbleI.current = tgt.i;
                bubbleUntil.current = performance.now() + BUBBLE_MS;
                // replay the pop-in
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = '';
            }
        // null = same-day cooldown — the store already toasted; stay quiet
        };
        chipBtn.addEventListener('click', onTap);
        return ()=>{
            chipBtn.removeEventListener('click', onTap);
            chip.remove();
            bubble.remove();
            els.current = null;
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const e = els.current;
        if (!e) return;
        // sheets/photo/travel freeze world input — the chip steps aside
        const frozen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isInputFrozen"])();
        const tgt = npcTalk.target;
        const p = npcTalk.pos;
        // chip identity + visibility (follows the CURRENT nearest talkable NPC)
        const wantChip = !frozen && tgt.live;
        if (wantChip) {
            if (tgt.id !== chipId.current) {
                chipId.current = tgt.id;
                e.chipLabel.textContent = `Talk to ${tgt.name}`;
                e.chipBtn.setAttribute('aria-label', `Talk to ${tgt.name}`);
            }
            placeAnchor(e.chip, p[tgt.i * 3], p[tgt.i * 3 + 1] + CHIP_Y, p[tgt.i * 3 + 2], camera);
        } else {
            if (chipId.current !== '') chipId.current = '';
            if (e.chip.style.display !== 'none') e.chip.style.display = 'none';
        }
        // the bubble keeps riding its own NPC for its whole lifetime
        if (bubbleI.current >= 0) {
            const gone = performance.now() > bubbleUntil.current || p[bubbleI.current * 3 + 1] < -500;
            if (gone) {
                bubbleI.current = -1;
                e.bubble.style.display = 'none';
            } else {
                placeAnchor(e.bubble, p[bubbleI.current * 3], p[bubbleI.current * 3 + 1] + BUBBLE_Y, p[bubbleI.current * 3 + 2], camera);
            }
        }
    });
    return null;
}
function Npcs({ timeOfDay, onGist }) {
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const gistRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from({
            length: NPC_COUNT
        }, (_, i)=>{
            const zone = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPC_ZONES"][i % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPC_ZONES"].length];
            // real identities — the same registry that powers hustle offers
            const pool = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPCS"].filter((n)=>n.homeLocationId === zone.locationId);
            const identity = pool.length ? pool[i % pool.length] : null;
            // Stage 5 — deterministic per-person look: hash the identity (or
            // seat) so every reload dresses the same crowd AND the crowd never
            // looks cloned (skin, cloth, hair, hairstyle, wardrobe style)
            const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(hashSeed(`${identity?.id ?? 'villager'}#${i}`));
            const skin = NPC_SKINS[Math.floor(rng() * NPC_SKINS.length)];
            const cloth = NPC_CLOTHES[Math.floor(rng() * NPC_CLOTHES.length)];
            const clothAlt = NPC_CLOTHES[Math.floor(rng() * NPC_CLOTHES.length)];
            const hairstyle = NPC_HAIRSTYLES[Math.floor(rng() * NPC_HAIRSTYLES.length)];
            const style = NPC_STYLES[Math.floor(rng() * NPC_STYLES.length)];
            return {
                zone,
                identity,
                ang0: rng() * Math.PI * 2,
                radius: 5 + rng() * (zone.radius - 7),
                speed: 0.25 + rng() * 0.4,
                dir: rng() > 0.5 ? 1 : -1,
                rig: {
                    skin,
                    cloth,
                    clothAlt,
                    hair: NPC_HAIRS[Math.floor(rng() * NPC_HAIRS.length)],
                    hairStyle: VOLUME_HAIR.has(hairstyle) ? 'volume' : CAP_HAIR.has(hairstyle) ? 'cap' : 'none',
                    dress: DRESS_STYLES.has(style),
                    hairstyle,
                    style
                },
                walk: {
                    current: 1.2 + rng() * 0.6
                }
            };
        }), []);
    // at night most residents head home — the real clock makes the city breathe
    const activeCount = timeOfDay === 'night' ? 4 : NPC_COUNT;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        const t = s.clock.elapsedTime;
        for(let i = 0; i < NPC_COUNT; i++){
            const g = refs.current[i];
            if (!g) continue;
            const d = data[i];
            const ang = d.ang0 + t * d.speed * d.dir;
            let x = d.zone.x + Math.cos(ang) * d.radius;
            let z = d.zone.z + Math.sin(ang) * d.radius;
            [x, z] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePosition"])(x, z);
            g.visible = i < activeCount;
            if (!g.visible) {
                npcTalk.pos[i * 3 + 1] = -999; // hidden — any chip/bubble on this NPC drops
                continue;
            }
            const gy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
            g.position.set(x, gy, z);
            g.rotation.y = -ang + (d.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
            npcTalk.pos[i * 3] = x;
            npcTalk.pos[i * 3 + 1] = gy;
            npcTalk.pos[i * 3 + 2] = z;
        }
        // discovery — ONE pass feeds BOTH the HUD gist chip (WORLD3D radius)
        // and the Stage 5 talk chip (close range): the nearest NAMED resident
        const px = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x;
        const pz = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z;
        let bestGist = null;
        let bestGistD = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].npcGistRadius;
        let talkI = -1;
        let talkId = '';
        let talkName = '';
        let bestTalkD = TALK_RADIUS;
        for(let i = 0; i < NPC_COUNT; i++){
            if (i >= activeCount) break;
            const d = data[i];
            if (!d.identity) continue;
            const g = refs.current[i];
            if (!g) continue;
            const dist = Math.hypot(g.position.x - px, g.position.z - pz);
            if (dist < bestGistD) {
                bestGistD = dist;
                bestGist = d.identity.id;
            }
            if (dist < bestTalkD) {
                bestTalkD = dist;
                talkI = i;
                talkId = d.identity.id;
                talkName = d.identity.name;
            }
        }
        if (onGist && bestGist !== gistRef.current) {
            gistRef.current = bestGist;
            onGist(bestGist);
        }
        // talk target — mutate the shared scratch in place (no allocation)
        const tgt = npcTalk.target;
        if (talkI < 0) {
            tgt.live = false;
        } else if (!tgt.live || tgt.id !== talkId) {
            tgt.live = true;
            tgt.i = talkI;
            tgt.id = talkId;
            tgt.name = talkName;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            data.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    ref: (el)=>{
                        refs.current[i] = el;
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HumanRig$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MidRig"], {
                            colors: d.rig,
                            speedRef: d.walk
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/Actors.tsx",
                            lineNumber: 703,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BlobShadow, {
                            scale: 0.9
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/Actors.tsx",
                            lineNumber: 704,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/Actors.tsx",
                    lineNumber: 702,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NpcTalkLayer, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/Actors.tsx",
                lineNumber: 708,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 700,
        columnNumber: 5
    }, this);
}
// speeds are presentation feel, scaled off the shared config base
const BASE = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].trafficBaseSpeed;
/** the town's fleet mix — 14 rigs across all FIVE real road loops (perf
 *  ceiling ~14; loops 3/4 carry the keke+danfo and one okada so no circuit
 *  of the geo pipeline's five rides empty) */ const TRAFFIC_MIX = [
    {
        kind: 'keke',
        loop: 0,
        lane: 1.55,
        base: 1.0
    },
    {
        kind: 'taxi',
        loop: 0,
        lane: -1.7,
        base: 1.14
    },
    {
        kind: 'danfo',
        loop: 0,
        lane: 1.9,
        base: 0.8
    },
    {
        kind: 'okada',
        loop: 0,
        lane: -1.4,
        base: 1.32
    },
    {
        kind: 'lorry',
        loop: 0,
        lane: -2.1,
        base: 0.58
    },
    {
        kind: 'danfo',
        loop: 1,
        lane: 1.9,
        base: 0.78
    },
    {
        kind: 'sedan',
        loop: 1,
        lane: 1.75,
        base: 1.06,
        variant: 'white'
    },
    {
        kind: 'okada',
        loop: 1,
        lane: -1.35,
        base: 1.36
    },
    {
        kind: 'taxi',
        loop: 1,
        lane: 1.65,
        base: 1.12
    },
    {
        kind: 'keke',
        loop: 2,
        lane: 1.5,
        base: 1.0
    },
    {
        kind: 'sedan',
        loop: 2,
        lane: -1.8,
        base: 1.08,
        variant: 'silver'
    },
    {
        kind: 'danfo',
        loop: 3,
        lane: 2.1,
        base: 0.72
    },
    {
        kind: 'keke',
        loop: 3,
        lane: -1.55,
        base: 0.96
    },
    {
        kind: 'okada',
        loop: 4,
        lane: 1.4,
        base: 1.3
    }
];
const VEHICLES = TRAFFIC_MIX.map((m, i)=>{
    // per-vehicle seeded rng: order-independent, identical every load
    const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(8021 + i * 97);
    return {
        ...m,
        variant: m.variant ?? 'silver',
        toneIdx: Math.floor(r() * 4),
        s: r() * 400,
        base: m.base * (0.9 + r() * 0.2) * BASE,
        phase: r() * Math.PI * 2,
        wobbleFreq: 0.25 + r() * 0.3,
        weave: m.kind === 'okada' ? 0.4 + r() * 0.25 : 0,
        yaw: 0,
        rate: 0
    };
});
// arc-length tables precomputed once — the frame loop never allocates
const LOOP_TABLES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAFFIC_LOOPS"].map((loop)=>{
    const n = loop.length;
    const t = {
        ax: new Float64Array(n),
        az: new Float64Array(n),
        dx: new Float64Array(n),
        dz: new Float64Array(n),
        start: new Float64Array(n),
        len: new Float64Array(n),
        yaw: new Float64Array(n),
        total: 0
    };
    let acc = 0;
    for(let i = 0; i < n; i++){
        const a = loop[i];
        const b = loop[(i + 1) % n];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        t.ax[i] = a[0];
        t.az[i] = a[1];
        t.dx[i] = b[0] - a[0];
        t.dz[i] = b[1] - a[1];
        t.start[i] = acc;
        t.len[i] = l;
        t.yaw[i] = Math.atan2(t.dx[i], t.dz[i]);
        acc += l;
    }
    t.total = acc;
    return t;
});
const SCRATCH_A = {
    x: 0,
    z: 0,
    yaw: 0
};
const SCRATCH_B = {
    x: 0,
    z: 0,
    yaw: 0
};
/** position along a loop at arc-length s — writes into `out`, no allocation */ function loopPoint(loopIdx, s, out) {
    const t = LOOP_TABLES[loopIdx];
    const rem = (s % t.total + t.total) % t.total;
    let k = 0;
    while(k < t.len.length - 1 && rem > t.start[k + 1])k++;
    const f = t.len[k] === 0 ? 0 : (rem - t.start[k]) / t.len[k];
    out.x = t.ax[k] + t.dx[k] * f;
    out.z = t.az[k] + t.dz[k] * f;
    out.yaw = t.yaw[k];
}
// feel constants per family: body roll gain/cap + wheel radius (spin rate)
const ROLL_GAIN = {
    keke: 0.55,
    okada: 3.4,
    taxi: 0.24,
    sedan: 0.24,
    danfo: 0.15,
    lorry: 0.1
};
const MAX_ROLL = {
    keke: 0.09,
    okada: 0.4,
    taxi: 0.05,
    sedan: 0.05,
    danfo: 0.04,
    lorry: 0.03
};
const WHEEL_R = {
    keke: 0.34,
    okada: 0.33,
    taxi: 0.34,
    sedan: 0.34,
    danfo: 0.38,
    lorry: 0.41
};
function buildTrafficRig(v) {
    if (v.kind === 'keke') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildKeke"])();
    if (v.kind === 'okada') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildOkada"])(v.toneIdx);
    if (v.kind === 'danfo') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildDanfo"])();
    if (v.kind === 'taxi') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSedan"])('taxi');
    if (v.kind === 'lorry') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildLorry"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSedan"])(v.variant);
}
// module-level rig caches — built lazily on the first client render (SSR
// import stays safe); geometries/materials themselves live in vehicles.ts
let RIG_CACHE = null;
let PARKED_RIG_CACHE = null;
function getRigs() {
    if (!RIG_CACHE) RIG_CACHE = VEHICLES.map(buildTrafficRig);
    return RIG_CACHE;
}
function getParkedRigs() {
    if (!PARKED_RIG_CACHE) {
        PARKED_RIG_CACHE = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PARKED_VEHICLES"].map((p)=>{
            if (p.build === 'keke') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildKeke"])(true);
            if (p.build === 'danfo') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildDanfo"])(true);
            if (p.build === 'okada') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildOkada"])(0, true);
            if (p.build === 'taxi') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSedan"])('taxi', true);
            if (p.build === 'lorry') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildLorry"])(true);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSedan"])(p.variant, true);
        });
    }
    return PARKED_RIG_CACHE;
}
// reused scratch for the nightly "4 nearest vehicles" scan (no allocs)
const BEST_D = [
    Infinity,
    Infinity,
    Infinity,
    Infinity
];
const BEST_I = [
    -1,
    -1,
    -1,
    -1
];
function Traffic({ timeOfDay }) {
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const coneRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const night = timeOfDay === 'night';
    const coneGeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](2.5, 5.6);
        g.translate(0, 2.8, 0); // pivot at the near edge so the pool runs forward
        return g;
    }, []);
    // one call flips every headlight/taillight in town (moving + parked)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyVehicleNight"])(night);
    }, [
        night
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state, rawDt)=>{
        const dt = Math.min(rawDt, 0.05);
        const t = state.clock.elapsedTime;
        for(let i = 0; i < VEHICLES.length; i++){
            const v = VEHICLES[i];
            const g = refs.current[i];
            const rig = getRigs()[i];
            if (!g || !rig) continue;
            // cruise: deterministic per-vehicle noise + gentle slow-down into corners
            loopPoint(v.loop, v.s, SCRATCH_A);
            loopPoint(v.loop, v.s + 3.4, SCRATCH_B);
            let lookYaw = SCRATCH_B.yaw - SCRATCH_A.yaw;
            while(lookYaw > Math.PI)lookYaw -= Math.PI * 2;
            while(lookYaw < -Math.PI)lookYaw += Math.PI * 2;
            const noise = 1 + Math.sin(t * v.wobbleFreq + v.phase) * 0.09;
            const corner = 1 - Math.min(0.45, Math.abs(lookYaw) * 1.15);
            const spd = v.base * noise * corner;
            v.s += spd * dt;
            // lane keeping (right-hand traffic); okadas weave, everyone drifts a hair
            const lateral = v.lane + (v.weave > 0 ? Math.sin(v.s * 0.55 + v.phase) * v.weave : Math.sin(v.s * 0.21 + v.phase) * 0.07);
            const x = SCRATCH_A.x + -Math.cos(SCRATCH_A.yaw) * lateral;
            const z = SCRATCH_A.z + Math.sin(SCRATCH_A.yaw) * lateral;
            // smoothed turn rate → steer + bank (okadas lean IN, bodies lean OUT)
            let dy = SCRATCH_A.yaw - v.yaw;
            while(dy > Math.PI)dy -= Math.PI * 2;
            while(dy < -Math.PI)dy += Math.PI * 2;
            v.rate += (dy / Math.max(dt, 1e-3) - v.rate) * Math.min(1, dt * 4.5);
            v.yaw = SCRATCH_A.yaw;
            // ride bridge decks where the loop crosses water (bypass / Kogi bridge)
            g.position.set(x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(x, z) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) + 0.05, z);
            g.rotation.set(0, SCRATCH_A.yaw, 0);
            const leanSign = v.kind === 'okada' ? -1 : 1;
            const rollTarget = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(leanSign * v.rate * ROLL_GAIN[v.kind], -MAX_ROLL[v.kind], MAX_ROLL[v.kind]);
            rig.bank.rotation.z += (rollTarget - rig.bank.rotation.z) * Math.min(1, dt * 6);
            if (rig.steer) rig.steer.rotation.y = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(v.rate * 0.35, -0.3, 0.3);
            // wheels spin by true distance travelled
            const dist = spd * dt;
            const wr = WHEEL_R[v.kind];
            for (const w of rig.wheels)w.rotation.x += dist / wr;
        }
        // night: the four shared light pools ride the vehicles nearest the player
        const cones = coneRefs.current;
        if (night) {
            for(let k = 0; k < 4; k++){
                BEST_D[k] = Infinity;
                BEST_I[k] = -1;
            }
            const px = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x;
            const pz = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z;
            for(let i = 0; i < VEHICLES.length; i++){
                const g = refs.current[i];
                if (!g) continue;
                const d2 = (g.position.x - px) * (g.position.x - px) + (g.position.z - pz) * (g.position.z - pz);
                for(let k = 0; k < 4; k++){
                    if (d2 < BEST_D[k]) {
                        for(let m = 3; m > k; m--){
                            BEST_D[m] = BEST_D[m - 1];
                            BEST_I[m] = BEST_I[m - 1];
                        }
                        BEST_D[k] = d2;
                        BEST_I[k] = i;
                        break;
                    }
                }
            }
            for(let c = 0; c < cones.length; c++){
                const cone = cones[c];
                if (!cone) continue;
                const gi = c < 4 ? BEST_I[c] : -1;
                const src = gi >= 0 ? refs.current[gi] : null;
                if (src && BEST_D[c] < 3600) {
                    cone.visible = true;
                    cone.position.set(src.position.x, src.position.y + 0.05, src.position.z);
                    cone.rotation.y = VEHICLES[gi].yaw;
                } else {
                    cone.visible = false;
                }
            }
        } else {
            for (const cone of cones)if (cone) cone.visible = false;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            VEHICLES.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    ref: (el)=>{
                        refs.current[i] = el;
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                            object: getRigs()[i].group
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/Actors.tsx",
                            lineNumber: 1005,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BlobShadow, {
                            scale: v.kind === 'lorry' ? 2.6 : v.kind === 'danfo' ? 2 : 1.6
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/Actors.tsx",
                            lineNumber: 1006,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/Actors.tsx",
                    lineNumber: 1004,
                    columnNumber: 9
                }, this)),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PARKED_VEHICLES"].map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        p.x,
                        p.y,
                        p.z
                    ],
                    rotation: [
                        0,
                        p.rotY,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                            object: getParkedRigs()[i].group
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/Actors.tsx",
                            lineNumber: 1012,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BlobShadow, {
                            scale: p.build === 'lorry' ? 2.6 : p.build === 'sedan' || p.build === 'taxi' ? 1.7 : p.build === 'danfo' ? 2 : 1.3
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/Actors.tsx",
                            lineNumber: 1013,
                            columnNumber: 11
                        }, this)
                    ]
                }, `parked-${i}`, true, {
                    fileName: "[project]/src/components/game/world/Actors.tsx",
                    lineNumber: 1011,
                    columnNumber: 9
                }, this)),
            [
                0,
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    ref: (el)=>{
                        coneRefs.current[i] = el;
                    },
                    visible: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        geometry: coneGeo,
                        material: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["headlightConeMaterial"])(),
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        position: [
                            0,
                            0.06,
                            1.6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/Actors.tsx",
                        lineNumber: 1019,
                        columnNumber: 11
                    }, this)
                }, `cone-${i}`, false, {
                    fileName: "[project]/src/components/game/world/Actors.tsx",
                    lineNumber: 1018,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 1002,
        columnNumber: 5
    }, this);
}
function Rain({ weather }) {
    const COUNT = 620;
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // M6 — the wet-sky family: rain, storm and flood all shower; a storm
    // day falls harder and darker, a flood day harder still.
    const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRainSky"])(weather);
    const heavy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHeavySky"])(weather);
    const fallSpeed = weather === 'storm' ? 40 : weather === 'flood' ? 36 : 27;
    const dropSize = heavy ? 0.12 : 0.09;
    const dropOpacity = weather === 'storm' ? 0.72 : weather === 'flood' ? 0.66 : 0.62;
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
        const pos = new Float32Array(COUNT * 3);
        for(let i = 0; i < COUNT; i++){
            pos[i * 3] = (Math.random() - 0.5) * 44;
            pos[i * 3 + 1] = Math.random() * 26;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
        }
        g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](pos, 3));
        return g;
    }, []);
    /* SILK II — the fall is GPU law now: the vertex shader wraps each drop's
   * y with mod(position.y - uTime·uFall), so the per-frame CPU loop and the
   * full position-buffer upload are GONE. The static y doubles as the wrap
   * phase; the camera-quantized reposition stays (one vector write). */ const uTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        value: 0
    });
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointsMaterial"]({
            color: '#aebfc9',
            size: dropSize,
            transparent: true,
            opacity: dropOpacity,
            sizeAttenuation: true
        });
        m.onBeforeCompile = (shader)=>{
            shader.uniforms.uTime = uTimeRef.current;
            shader.uniforms.uFall = {
                value: fallSpeed
            };
            shader.vertexShader = `uniform float uTime;\nuniform float uFall;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\n  transformed.y = mod(position.y - uTime * uFall, 28.0);');
        };
        m.customProgramCacheKey = ()=>'lko-rain-fall';
        return m;
    }, [
        dropSize,
        dropOpacity,
        fallSpeed,
        uTimeRef
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>mat.dispose(), [
        mat
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state, dt)=>{
        const pts = ref.current;
        if (!pts || !active) return;
        uTimeRef.current.value += Math.min(dt, 0.05);
        // follow the camera area in coarse steps so the shower is always around you
        pts.position.set(Math.round(state.camera.position.x / 22) * 22, 0, Math.round(state.camera.position.z / 22) * 22);
    });
    if (!active) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
        ref: ref,
        geometry: geo,
        frustumCulled: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
            object: mat,
            attach: "material"
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/Actors.tsx",
            lineNumber: 1096,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 1095,
        columnNumber: 5
    }, this);
}
function Birds({ timeOfDay }) {
    const night = timeOfDay === 'night';
    const flocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['confluence'],
                n: 7,
                r: 15,
                h: 11,
                speed: 0.16
            },
            {
                c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['mount-patti'],
                n: 6,
                r: 19,
                h: 34,
                speed: 0.11
            },
            {
                c: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['kpata-market'],
                n: 5,
                r: 11,
                h: 9,
                speed: 0.21
            }
        ], []);
    const birds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const out = [];
        flocks.forEach((f, fi)=>{
            for(let i = 0; i < f.n; i++){
                out.push({
                    flock: fi,
                    phase: i / f.n * Math.PI * 2 + fi * 1.7,
                    rad: f.r + i % 3 * 2.4
                });
            }
        });
        return out;
    }, [
        flocks
    ]);
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const wings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        const t = s.clock.elapsedTime;
        for(let i = 0; i < birds.length; i++){
            const g = refs.current[i];
            if (!g) continue;
            const b = birds[i];
            const f = flocks[b.flock];
            const ang = b.phase + t * f.speed;
            const x = f.c.x + Math.cos(ang) * b.rad;
            const z = f.c.z + Math.sin(ang) * b.rad;
            g.position.set(x, f.c.y + f.h + Math.sin(t * 0.7 + i) * 1.6, z);
            g.rotation.y = -ang + Math.PI / 2;
            const w = wings.current[i];
            if (w) w.rotation.z = Math.sin(t * 9 + i * 1.31) * 0.6;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        visible: !night,
        children: birds.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: (el)=>{
                    refs.current[i] = el;
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        scale: [
                            1.5,
                            0.8,
                            0.9
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    0.075,
                                    6,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/Actors.tsx",
                                lineNumber: 1158,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#2a2620",
                                roughness: 1
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/Actors.tsx",
                                lineNumber: 1159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/Actors.tsx",
                        lineNumber: 1157,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        ref: (el)=>{
                            wings.current[i] = el;
                        },
                        children: [
                            -1,
                            1
                        ].map((sd)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    sd * 0.21,
                                    0.02,
                                    0
                                ],
                                rotation: [
                                    0,
                                    0,
                                    sd * 0.18
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                                        args: [
                                            0.36,
                                            0.15
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/Actors.tsx",
                                        lineNumber: 1165,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#2a2620",
                                        roughness: 1,
                                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/Actors.tsx",
                                        lineNumber: 1166,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, sd, true, {
                                fileName: "[project]/src/components/game/world/Actors.tsx",
                                lineNumber: 1164,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/Actors.tsx",
                        lineNumber: 1162,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/game/world/Actors.tsx",
                lineNumber: 1155,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 1153,
        columnNumber: 5
    }, this);
}
/* -------------------------------- cooking smoke -------------------------------- */ const SMOKE_PUFFS = 7;
function SmokeWisps() {
    const emitters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                x: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['food-area'].x + 4.4,
                z: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['food-area'].z - 3.6
            },
            {
                x: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['kpata-market'].x - 8.6,
                z: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['kpata-market'].z - 4.2
            }
        ].map((e)=>({
                ...e,
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(e.x, e.z)
            })), []);
    const refs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
        g.addColorStop(0, 'rgba(238,233,224,0.6)');
        g.addColorStop(1, 'rgba(238,233,224,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((s)=>{
        const t = s.clock.elapsedTime;
        for(let e = 0; e < emitters.length; e++){
            for(let p = 0; p < SMOKE_PUFFS; p++){
                const sp = refs.current[e * SMOKE_PUFFS + p];
                if (!sp) continue;
                const life = (t * 0.32 + p / SMOKE_PUFFS + e * 0.37) % 1;
                sp.position.set(emitters[e].x + Math.sin(life * 8 + p) * 0.4, emitters[e].y + 0.7 + life * 2.8, emitters[e].z + Math.cos(life * 6.4 + p) * 0.3);
                sp.scale.setScalar(0.55 + life * 1.6);
                sp.material.opacity = 0.42 * (1 - life) * Math.min(1, life * 4);
            }
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: emitters.map((_, e)=>Array.from({
                length: SMOKE_PUFFS
            }, (_, p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sprite", {
                    ref: (el)=>{
                        refs.current[e * SMOKE_PUFFS + p] = el;
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("spriteMaterial", {
                        map: tex,
                        transparent: true,
                        depthWrite: false,
                        opacity: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/Actors.tsx",
                        lineNumber: 1226,
                        columnNumber: 13
                    }, this)
                }, `${e}-${p}`, false, {
                    fileName: "[project]/src/components/game/world/Actors.tsx",
                    lineNumber: 1225,
                    columnNumber: 11
                }, this)))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/Actors.tsx",
        lineNumber: 1222,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/RemoteWalkers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoteWalkers",
    ()=>RemoteWalkers,
    "remoteRigColors",
    ()=>remoteRigColors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M24 W2: THE REMOTE WALKERS
 * =========================================
 * Real players as real bodies in the one living city. This layer is
 * purely ADDITIVE: it mounts beside Traffic/Rain and touches NOTHING
 * that already exists (no world file edited — the 3D freeze honoured).
 *
 * THE FRAME LAW (zero React churn): the roster store only changes at
 * walk-in/walk-out cadence; the 10Hz truth lives in remotenet's module
 * map and is consumed HERE inside useFrame — positions, headings and
 * the walk cycle animate with ZERO setState, ZERO allocation per frame.
 *
 * THE HONEST BODY: each walker wears the REAL avatarLook the register
 * law minted (W1's ProfileRow read at the wire door), rendered by the
 * SAME MidRig the NPCs wear (the perf law: the player keeps the only
 * full HumanRig; remote bodies are street people, not heroes). The walk
 * cycle is driven by the MEASURED speed between the wire's snaps — the
 * body walks when the walker actually walks, and stands when they stand.
 *
 * THE STALE + RANGE LAWS (bodies.ts verbatim): a body whose snaps died
 * is hidden, a body out of render range is culled — the street can hold
 * many walkers, the frame budget holds few.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HumanRig$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/HumanRig.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/bodies.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/remotenet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-ssr] (ecmascript)");
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
/* ------------------------------ rig colour mapping ---------------------------- */ const VOLUME_HAIR = new Set([
    'afro',
    'puffs',
    'dreads',
    'braids'
]);
const CAP_HAIR = new Set([
    'low-cut',
    'waves',
    'cornrows'
]);
const DRESS_STYLES = new Set([
    'kaftan',
    'lace'
]);
function remoteRigColors(look) {
    const l = look ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"];
    return {
        skin: l.skinTone,
        cloth: l.clothingColor,
        clothAlt: l.clothingColor,
        hair: l.hairColor,
        hairStyle: VOLUME_HAIR.has(l.hairstyle) ? 'volume' : CAP_HAIR.has(l.hairstyle) ? 'cap' : 'none',
        dress: DRESS_STYLES.has(l.clothingStyle),
        hairstyle: l.hairstyle,
        style: l.clothingStyle
    };
}
/* --------------------------------- the name tag -------------------------------- */ const tagCache = new Map();
function nameTagTexture(name) {
    const cached = tagCache.get(name);
    if (cached) return cached;
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = 'rgba(12,14,10,0.72)';
    const w = Math.min(246, 28 + name.length * 13);
    ctx.beginPath();
    ctx.roundRect((256 - w) / 2, 10, w, 44, 22);
    ctx.fill();
    ctx.fillStyle = '#f5edd8';
    ctx.font = 'extrabold 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 128, 33);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    tagCache.set(name, tex);
    return tex;
}
function NameTag({ name }) {
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>nameTagTexture(name), [
        name
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sprite", {
        position: [
            0,
            2.35,
            0
        ],
        scale: [
            1.5,
            0.375,
            1
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("spriteMaterial", {
            map: tex,
            transparent: true,
            depthWrite: false,
            fog: false
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
/* -------------------------------- one remote body ------------------------------- */ function RemoteBodyView({ handle }) {
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const speedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const body = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteBody"])(handle);
    const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>remoteRigColors(body?.look ?? null), [
        body?.look
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const g = group.current;
        if (!g) return;
        const b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteBody"])(handle);
        if (!b) return;
        // W10 — THE CARRIED LAW'S FACE: a walker whose car is live on the
        // wire is IN that car — their body must not ghost-walk beside it.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLiveDriver"])(handle)) {
            g.visible = false;
            return;
        }
        // the snaps are wall-clock anchored (Date.now() at the wire push) — the
        // sample clock is the SAME wall clock, never the R3F scene clock
        const s = b.buf.sample(Date.now());
        // THE STALE LAW: sample() answers alive=false the moment the newest
        // snap is STALE_MS old — a dead body does not stand.
        if (!s.alive) {
            g.visible = false;
            return;
        }
        // THE RANGE LAW — culled from MY body, not deleted (they may walk back)
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inRenderRange"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z, s.x, s.z)) {
            g.visible = false;
            return;
        }
        g.visible = true;
        g.position.set(s.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(s.x, s.z), s.z);
        g.rotation.y = s.hd;
        // THE WALK TRUTH: the measured speed drives the cycle — the body walks
        // when the walker actually walked, stands when they stood
        speedRef.current = s.speed;
    });
    if (!body) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: group,
        visible: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HumanRig$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MidRig"], {
                colors: colors,
                speedRef: speedRef
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                position: [
                    0,
                    0.04,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circleGeometry", {
                        args: [
                            0.5,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#1a2016",
                        transparent: true,
                        opacity: 0.28,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            body.name ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NameTag, {
                name: body.name
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
                lineNumber: 167,
                columnNumber: 20
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
function RemoteWalkers() {
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBodiesStore"])((s)=>s.count);
    const names = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBodiesStore"])((s)=>s.names);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // the local moment + the join seam — the walker's own truths, brought here
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPosReader"])(()=>({
                x: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x,
                z: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z,
                hd: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].heading
            }));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setJoinExecutor"])((x, z)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestE2eTeleport"])(x, z));
        // W10 — the drive truth + the wheels' bracket: my car speaks while I
        // am seated (the sender reads THIS layer's own module truth)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelSetDriveReader"])(()=>({
                active: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDriveActive"])(),
                model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveModel"])(),
                speed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveSpeed"])(),
                x: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x,
                z: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z,
                hd: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].heading
            }));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteStartSending"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelStartSending"])();
        window.__lklBodies = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bodiesWitness"];
        window.__lklWheels = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelsWitness"];
        return ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteStopSending"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelStopSending"])();
            delete window.__lklBodies;
            delete window.__lklWheels;
        };
    }, []);
    // keyed by handle+name: a rename remounts the view (the tag texture follows
    // the truth); a roster change only mounts/unmounts the delta
    const namesKey = names.join('|');
    const handles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteBodyList"])().map((b)=>`${b.handle}\u0000${b.name}`), [
        count,
        namesKey
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: handles.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RemoteBodyView, {
                handle: k.split('\u0000')[0]
            }, k, false, {
                fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
                lineNumber: 221,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/RemoteWalkers.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/RemoteVehicles.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoteVehicles",
    ()=>RemoteVehicles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M24 W10-a: THE REMOTE VEHICLES
 * =============================================
 * Real players' cars as real rigs on the one living city's roads. This
 * layer is purely ADDITIVE: it mounts beside RemoteWalkers and touches
 * NOTHING that already exists (no world file edited — the 3D freeze
 * honoured; the W2 doctrine: one import + one line in the scene).
 *
 * THE FRAME LAW (zero React churn): the roster store only changes at
 * walk-in/walk-out cadence; the 12Hz truth lives in wheelnet's module
 * map and is consumed HERE inside useFrame — positions, headings and
 * the wheel spin animate with ZERO setState, ZERO allocation per frame.
 *
 * THE HONEST CAR: each rig is the SAME builder the player's own rides
 * wear (buildPlayerRig's own family), painted by THE PAINT LAW's real
 * vocabulary (an invented colour never renders — unknown falls to the
 * default). The wheels spin by the MEASURED speed between the wire's
 * snaps; a parked car (mv=false) stands with still wheels exactly where
 * it stopped — the buffer never stales a car (absence is the roster's
 * verdict: the driver left), the SEED LAW stands it before the first
 * tick ever arrives.
 *
 * THE RANGE LAW (wheels.ts verbatim): a car beyond CAR_RANGE from MY
 * body is culled — a car catches the eye farther than a walker (90 vs
 * 60) but the frame budget still holds few.
 *
 * THE DRIVER IS INSIDE: the name tag rides the car (the walker's own
 * body is hidden by RemoteWalkers' carried guard — one truth, no ghost).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/collision.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/systems/wheels.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
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
/* --------------------------- the rig builder (paint law) --------------------------- */ /** THE PAINT LAW'S RENDER SIDE — the vocabulary maps onto the builders'
 *  real arguments; anything else falls to the honest default. */ function buildPaintedRig(model, paint) {
    if (model === 'okada') {
        const tone = [
            '0',
            '1',
            '2',
            '3'
        ].includes(paint) ? Number(paint) : 2;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildOkada"])(tone);
    }
    if (model === 'keke') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildKeke"])();
    if (model === 'danfo') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildDanfo"])();
    const variant = paint === 'white' || paint === 'silver' || paint === 'darkblue' || paint === 'maroon' ? paint : 'taxi' // 'yellow' and everything unknown = the honest taxi livery
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSedan"])(variant);
}
/* ------------------------------ the plate tag ------------------------------ */ const tagCache = new Map();
function plateTagTexture(name, plate) {
    const key = `${name}\u0000${plate}`;
    const cached = tagCache.get(key);
    if (cached) return cached;
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 72;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 72);
    ctx.fillStyle = 'rgba(12,14,10,0.72)';
    const w = Math.min(246, 40 + name.length * 12);
    ctx.beginPath();
    ctx.roundRect((256 - w) / 2, 6, w, 38, 19);
    ctx.fill();
    ctx.fillStyle = '#f5edd8';
    ctx.font = 'extrabold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 128, 26);
    // the plate — the car's own face, small and honest
    ctx.fillStyle = '#e8e4d8';
    ctx.beginPath();
    ctx.roundRect(78, 48, 100, 20, 5);
    ctx.fill();
    ctx.fillStyle = '#1a2016';
    ctx.font = 'bold 15px ui-monospace, monospace';
    ctx.fillText(plate.slice(0, 10), 128, 59);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    tex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    tagCache.set(key, tex);
    return tex;
}
function PlateTag({ name, plate }) {
    const tex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>plateTagTexture(name, plate), [
        name,
        plate
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sprite", {
        position: [
            0,
            2.5,
            0
        ],
        scale: [
            1.7,
            0.48,
            1
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("spriteMaterial", {
            map: tex,
            transparent: true,
            depthWrite: false,
            fog: false
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
/* --------------------------- the rig cache (the DriveSystem doctrine) --------------------------- */ /** ONE base rig per (model, paint), OUTSIDE React entirely — built once,
 *  geometry/material caches shared (vehicles.ts matCache/geoCache), and
 *  NEVER mounted directly: two same-model cars mounting one THREE.Group
 *  fought over the same transforms (one car vanished, wheels fought).
 *  rigFor clones the base per VIEWER key — Object3D.clone shares every
 *  geometry and material reference, so the GPU cost of a clone is zero. */ const RIGS = new Map();
const RIG_CLONES = new Map();
/** the viewer keys rigFor touched since the last prune — the layer evicts
 *  clones whose car left the roster/parked set, so the cache stays bounded */ const RIG_CLONE_USES = new Set();
/** clone a rig for ONE viewer. Object3D.clone(true) shares all geometry +
 *  material references; the only work is remapping wheels/steer/bank onto
 *  the CLONED nodes (traverse order is deterministic, so index-matched) —
 *  the frame loop must spin THIS mount's wheels, never the base rig's. */ function cloneRig(base) {
    const group = base.group.clone(true);
    const originals = [];
    base.group.traverse((o)=>originals.push(o));
    const clones = [];
    group.traverse((o)=>clones.push(o));
    const map = new Map();
    originals.forEach((o, i)=>map.set(o, clones[i]));
    return {
        group,
        bank: map.get(base.bank) ?? group,
        wheels: base.wheels.map((w)=>map.get(w)).filter((w)=>!!w),
        frontWheels: base.frontWheels.map((w)=>map.get(w)).filter((w)=>!!w),
        steer: base.steer ? map.get(base.steer) ?? null : null
    };
}
function rigFor(model, paint, viewer) {
    const k = `${model}:${paint}`;
    let base = RIGS.get(k);
    if (!base) {
        base = buildPaintedRig(model, paint);
        RIGS.set(k, base);
    }
    const ck = `${k}\u0000${viewer}`;
    RIG_CLONE_USES.add(ck);
    let r = RIG_CLONES.get(ck);
    if (!r) {
        r = cloneRig(base);
        RIG_CLONES.set(ck, r);
    }
    return r;
}
/* -------------------------------- one remote car -------------------------------- */ function RemoteCarView({ handle }) {
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastHd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const car = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteCarList"])().find((c)=>c.handle === handle);
    // the meta is a plain per-render object (the compiler memoizes; no manual deps to lie)
    const meta = car ? {
        model: car.model,
        paint: car.paint,
        plate: car.plate,
        name: car.name
    } : null;
    // the render reads the MODULE cache — one CLONE per (model, paint, viewer):
    // this handle's own rig, never another car's THREE.Group
    const rig = meta ? rigFor(meta.model, meta.paint, handle) : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const g = group.current;
        if (!g) return;
        // THE FRAME LAW: the module map is re-read HERE (the RemoteWalkers
        // pattern) — the rig comes from the module cache, never a render local
        const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteCarList"])().find((x)=>x.handle === handle);
        if (!c) return;
        const r = rigFor(c.model, c.paint, handle);
        const s = c.buf.sample(Date.now());
        if (!s.alive) {
            g.visible = false;
            return;
        }
        // THE RANGE LAW — culled from MY body, not deleted (they may drive back)
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["carInRenderRange"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z, s.x, s.z)) {
            g.visible = false;
            return;
        }
        g.visible = true;
        // THE GROUND LAW: the bridge deck first, the earth second — the same
        // priority the player's own ride rides
        g.position.set(s.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(s.x, s.z) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(s.x, s.z), s.z);
        g.rotation.y = s.hd;
        // THE WHEEL TRUTH: the measured speed drives the spin — the wheels
        // turn when the car actually moved, stand still when it is parked
        if (lastPos.current) {
            const d = Math.hypot(s.x - lastPos.current.x, s.z - lastPos.current.z);
            if (d > 0.0005) {
                const radius = WHEEL_R[c.model] ?? 0.34;
                const spin = radius > 0 ? d / radius : 0;
                for (const w of r.wheels)w.rotation.x += spin;
                if (r.steer && d > 0.02) r.steer.rotation.y = Math.max(-0.5, Math.min(0.5, (s.hd - lastHd.current) * 8));
            }
        }
        lastHd.current = s.hd;
        lastPos.current = {
            x: s.x,
            z: s.z
        };
    });
    if (!car || !meta || !rig) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: group,
        visible: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                object: rig.group,
                dispose: null
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlateTag, {
                name: meta.name,
                plate: meta.plate
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
}
const WHEEL_R = {
    okada: 0.33,
    keke: 0.34,
    taxi: 0.34,
    danfo: 0.38
};
/* ------------------------- W10-b — one parked ghost ------------------------- */ /**
 * THE PARKED GHOST VIEW — an ABSENT driver's disk row, spawned where the
 * car was left: the same rig, the same plate tag, NO buffer (nothing
 * moves), the same range law. A live roster row for the same (handle,
 * model) erases the ghost client-side (the LIVE-WINS law in wheelnet) —
 * here the ghost simply disappears with the key.
 */ function ParkedGhostView({ gkey }) {
    const group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [, handle, model, plate, paint] = gkey.split('\u0000');
    const rig = rigFor(model, paint, gkey);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        const g = group.current;
        if (!g) return;
        const gh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parkedGhostByKey"])(gkey);
        if (!gh) {
            g.visible = false;
            return;
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["carInRenderRange"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z, gh.x, gh.z)) {
            g.visible = false;
            return;
        }
        g.visible = true;
        g.position.set(gh.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(gh.x, gh.z) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(gh.x, gh.z), gh.z);
        g.rotation.y = gh.hd;
    });
    if (!rig) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: group,
        visible: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
                object: rig.group,
                dispose: null
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlateTag, {
                name: handle,
                plate: plate
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
function RemoteVehicles() {
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWheelsStore"])((s)=>s.count);
    const plates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWheelsStore"])((s)=>s.plates);
    const parkedKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWheelsStore"])((s)=>s.parkedKeys);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // W10-b — THE PARKED SPAWN: one honest query per world mount, landed
        // when BOTH truths exist — a LIVE wire AND a real body pos (a query
        // fired at (0,0) or before the handshake is a wasted beat). The
        // wire:parked broadcast lane keeps the map warm after this first ask.
        let alive = true;
        void (async ()=>{
            for(let i = 0; i < 40 && alive; i++){
                const p = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"];
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWireStore"].getState().state === 'live' && (p.x !== 0 || p.z !== 0)) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelQueryParked"])(p.x, p.z);
                    return;
                }
                await new Promise((r)=>setTimeout(r, 1500));
            }
        })();
        return ()=>{
            alive = false;
        };
    }, []);
    const platesKey = plates.join('|');
    const handles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["remoteCarList"])().map((c)=>`${c.handle}\u0000${c.plate}\u0000${c.paint}\u0000${c.model}`), [
        count,
        platesKey
    ]);
    // THE CLONE PRUNE — every mount registers its clone key through rigFor
    // (render + every frame), so after each roster/parked change anything NOT
    // re-registered belongs to an unmounted viewer: evict it. The clone cache
    // stays bounded by the live roster exactly like the old RIGS map was.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        for (const k of [
            ...RIG_CLONES.keys()
        ]){
            if (!RIG_CLONE_USES.has(k)) RIG_CLONES.delete(k);
        }
        RIG_CLONE_USES.clear();
    }, [
        count,
        platesKey,
        parkedKeys
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            handles.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RemoteCarView, {
                    handle: k.split('\u0000')[0]
                }, k, false, {
                    fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this)),
            parkedKeys.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ParkedGhostView, {
                    gkey: k
                }, k, false, {
                    fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
                    lineNumber: 327,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/RemoteVehicles.tsx",
        lineNumber: 322,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/components/game/world/StageCapture.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StageCapture",
    ()=>StageCapture
]);
/**
 * LOKOJA LIFE — M24 W9: THE STAGE CAPTURE (the world's own broadcast tap)
 * ----------------------------------------------------------------------
 * ONE additive component inside the world's Canvas — the W2 doctrine
 * (RemoteWalkers: one import, one JSX line, the world never knows).
 *
 * THE LAW IT SERVES: a WebGL canvas without preserveDrawingBuffer hands
 * captureStream a CLEARED buffer the moment compositing ends — the silent
 * black stage. This tap binds the world's own canvas to stagenet (the POV
 * hook) and pumps requestFrame() from R3F's addAfterEffect — the SAME task
 * that just drew the frame, so the buffer is alive. It renders nothing,
 * moves nothing, costs nothing when nobody is on air (the pump returns
 * before touching anything unless a stage is pumping).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export D as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__k__as__addAfterEffect$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export k as addAfterEffect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/stagenet.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function StageCapture() {
    const gl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])((s)=>s.gl);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageBindCanvas"])(gl.domElement);
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__k__as__addAfterEffect$3e$__["addAfterEffect"])(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stagePump"])();
        });
        return ()=>{
            unsubscribe();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageBindCanvas"])(null);
        };
    }, [
        gl
    ]);
    return null;
}
}),
"[project]/src/components/game/world/DriveSystem.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DriveSystem",
    ()=>DriveSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — DriveSystem (Stage 5-a)
 * --------------------------------------
 * "You own and DRIVE vehicles in the 3D world." This component owns the
 * player's OWN rides (distinct from the ambient Traffic fleet):
 *
 *  - spawn: the last-driven owned vehicle materialises parked at a
 *    road-adjacent spot near the player on world entry ("where you left
 *    it" within a visit — the spot is re-found if you re-enter far away)
 *  - enter: walk-up prompt (HUD) or the garage Drive button requests it
 *    through controls.ts; drive mode freezes the walking controller and
 *    hides the player rig via the seat protocol (see controls.ts)
 *  - drive: throttle/brake/steer from the SAME joystick + WASD axes,
 *    VehicleDef top speed / accel / handling, 0.45× on grass, building +
 *    river collision through the EXISTING resolver (fast hits kill 60%
 *    of speed), wheel spin, corner lean (okada leans IN), bridge decks,
 *    night headlight pool — all presentation-only
 *  - camera: smoothed chase cam with speed FOV pull and the same
 *    obstruction/terrain safety the walk camera uses
 *  - park: vehicle stays where you left it; metres driven are settled
 *    through store.settleDrive — the only money/time authority
 *
 * No economy logic lives here. Module-level state is deliberately small
 * (one parked-spot map + rig cache) and survives interior swaps.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export D as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/junctions.ts [app-ssr] (ecmascript)"); // W3 — the school humps
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/collision.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)"); // W10-b/W10-c — the passenger seat + the tank's truth
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/systems/wheels.ts [app-ssr] (ecmascript) <locals>");
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
/* ------------------------------- feel constants ------------------------------- */ const ENTER_RADIUS = 4.6 // walk-up "Enter {label}" range
;
const ON_ROAD_DIST = 4.6 // within this of a road centreline = tarmac
;
const GRASS_CAP = 0.45 // grass multiplies top speed (mud drag)
;
const REVERSE_MAX = 2.6 // careful reverse gear for dead ends
;
const IMPACT_SPEED = 4.2 // hits above this kill 60% of speed
;
const RESPAWN_FAR = 60 // parked farther than this from you → re-spot nearby
;
const CHASE_DIST = 7.4;
const CHASE_HEIGHT = 3.05;
const FOV_BASE = 55;
/* W10-b — the passenger seat hangs ON the rig (the honest danfo ride):
 * seat 0 left, seat 1 right, seat 2 back — and the reach per model (the
 * okada's pillion rides BEHIND the rider, the cars take the running board). */ const SEAT_SIDE = [
    'left',
    'right',
    'back'
];
const SEAT_DIST = {
    okada: 1.15,
    keke: 1.2,
    taxi: 1.4,
    danfo: 1.65
};
/** react-hooks/immutability guards hook values from stray writes — animating
 *  the canvas camera's fov goes through this sanctioned module helper */ function applyFov(cam, fov) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
}
/** per-family presentation tuning (mirrors the Traffic feel table) */ const WHEEL_R = {
    okada: 0.33,
    keke: 0.34,
    taxi: 0.34,
    danfo: 0.38
};
/**
 * W3 — THE ACKERMANN GEOMETRY: wheelbase L and track width w per model
 * (measured off the rigs: danfo axles ±1.35 track ±0.86, sedan ±1.28/±0.8).
 * The inner/outer front-wheel angles follow the real law
 *   cot(δo) − cot(δi) = w/L
 * via δ = atan(L / (R ∓ w/2)) — algebraically exact for the turn radius R.
 */ const ACKERMANN = {
    okada: {
        L: 1.35,
        w: 0
    },
    keke: {
        L: 1.55,
        w: 0
    },
    taxi: {
        L: 2.56,
        w: 1.6
    },
    danfo: {
        L: 2.7,
        w: 1.72
    }
};
const ROLL_GAIN = {
    okada: 3.4,
    keke: 0.55,
    taxi: 0.24,
    danfo: 0.15
};
const MAX_ROLL = {
    okada: 0.4,
    keke: 0.09,
    taxi: 0.05,
    danfo: 0.04
};
const LEAN_SIGN = {
    okada: -1,
    keke: 1,
    taxi: 1,
    danfo: 1
};
/* --------------------------- module-level session state ------------------------ */ /** where each owned model is parked right now (survives interior swaps) */ const PARKED_SPOTS = new Map();
/** rig cache — one shared rig per model, built lazily like the traffic fleet */ const RIG_CACHE = new Map();
let lastDriven = null;
/* ------------------------------ engine hum (synth) ----------------------------- */ /** tiny two-knob engine voice — diegetic speed feel, zero assets. Fails silent. */ class DriveHum {
    ctx = null;
    osc = null;
    gain = null;
    enabled = true;
    setEnabled(on) {
        this.enabled = on;
        if (this.gain && this.ctx) {
            this.gain.gain.setTargetAtTime(on ? 0.02 : 0, this.ctx.currentTime, 0.05);
        }
    }
    start() {
        if (this.ctx) return;
        try {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            if (!Ctor) return;
            const ctx = new Ctor();
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = 58;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 340;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            void ctx.resume();
            this.ctx = ctx;
            this.osc = osc;
            this.gain = gain;
        } catch  {
        /* audio is best-effort; never break driving for it */ }
    }
    update(speedNorm) {
        if (!this.ctx || !this.osc || !this.gain) return;
        const t = this.ctx.currentTime;
        this.osc.frequency.setTargetAtTime(56 + speedNorm * 108, t, 0.08);
        this.gain.gain.setTargetAtTime(this.enabled ? 0.014 + speedNorm * 0.05 : 0, t, 0.1);
    }
    stop() {
        const ctx = this.ctx;
        try {
            if (this.gain && ctx) this.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
        } catch  {
        /* ignore */ }
        this.ctx = null;
        this.osc = null;
        this.gain = null;
        if (ctx) {
            setTimeout(()=>{
                try {
                    void ctx.close();
                } catch  {
                /* ignore */ }
            }, 160);
        }
    }
}
/* ------------------------------- player-rig find ------------------------------- */ /**
 * Locate the walking player's root group WITHOUT touching Actors.tsx:
 * its BlobShadow is a 12-segment circle of radius 0.6 (scale 1.2) — the
 * only blob in town with exactly those parameters. Used to hide the rig
 * while driving (seat protocol, see controls.ts).
 */ function findPlayerRigGroup(scene) {
    let found = null;
    scene.traverse((o)=>{
        if (found) return;
        const mesh = o;
        if (!mesh.isMesh) return;
        const g = mesh.geometry;
        if (g instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleGeometry"]) {
            const p = g.parameters;
            if (Math.abs(p.radius - 0.6) < 0.005 && p.segments === 12) {
                let top = o;
                while(top.parent && top.parent !== scene)top = top.parent;
                found = top;
            }
        }
    });
    return found;
}
function DriveSystem({ timeOfDay, followRef }) {
    const night = timeOfDay === 'night';
    const { camera: r3fCam, scene } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])();
    // the canvas mounts a perspective camera (fov 55) — DriveSystem animates its fov
    const camera = r3fCam;
    const soundOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settings?.sound ?? true);
    /** React only needs to know WHICH rig is mounted; physics lives in refs */ const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const drive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        active: false,
        model: null,
        x: 0,
        z: 0,
        yaw: 0,
        speed: 0,
        camYaw: 0,
        fov: FOV_BASE
    });
    const playerRigRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const enterVehicleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const parkVehicleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const frameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const spawnedThisVisit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // W10-b — the passenger seat: whose car I follow + where it last stood
    const rideRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rideLastSample = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // W10-c — the dry-tank notify rides once per dry spell
    const dryNotified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const humRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const soundRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(soundOn);
    const scratch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        desired: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](),
        from: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]()
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        soundRef.current = soundOn;
        humRef.current?.setEnabled(soundOn);
    }, [
        soundOn
    ]);
    /* ------------------------------ helpers (stable) ------------------------------ */ const ensureRig = (model)=>{
        let rig = RIG_CACHE.get(model);
        if (!rig) {
            rig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildPlayerRig"])(model);
            // ground-contact blob shadow (same read as the traffic fleet's)
            const blob = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleGeometry"](0.95, 14), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: '#1a2016',
                transparent: true,
                opacity: 0.26,
                depthWrite: false
            }));
            blob.rotation.x = -Math.PI / 2;
            blob.position.y = 0.04;
            rig.group.add(blob);
            // night-only fake headlight pool, riding the rig like Traffic's
            const coneGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](2.5, 5.6);
            coneGeo.translate(0, 2.8, 0);
            const cone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](coneGeo, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["headlightConeMaterial"])());
            cone.rotation.x = Math.PI / 2;
            cone.position.set(0, 0.06, 1.6);
            cone.visible = false;
            cone.name = 'driveCone';
            rig.group.add(cone);
            RIG_CACHE.set(model, rig);
        }
        const cone = rig.group.getObjectByName('driveCone');
        if (cone) cone.visible = night;
        return rig;
    };
    /** parked spot for a model — reuses "where you left it", re-spots if absurdly far */ const ensureParked = (model)=>{
        const existing = PARKED_SPOTS.get(model);
        if (existing && Math.hypot(existing.x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, existing.z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z) <= RESPAWN_FAR) {
            return existing;
        }
        const spot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findPlayerVehicleSpot"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].heading);
        PARKED_SPOTS.set(model, spot);
        return spot;
    };
    const applySeatHide = (hide)=>{
        const g = playerRigRef.current;
        if (g) g.visible = !hide;
    };
    const enterVehicle = (model)=>{
        const st = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
        if (!st.player || drive.current.active) return;
        if (!st.player.vehicles.some((v)=>v.model === model)) return;
        // W10-c — THE DRY TANK: a dry engine takes no key (the pump is the cure)
        const mine = st.player.vehicles.find((v)=>v.model === model);
        if (mine && typeof mine.fuel === 'number' && mine.fuel < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DRY_TANK"]) {
            st.notify({
                icon: '⛽',
                text: 'Tank dry — buy fuel at the Motor Park pump.',
                tone: 'bad'
            });
            return;
        }
        const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model];
        if (!def) return;
        const spot = ensureParked(model);
        const rig = ensureRig(model);
        const groundY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(spot.x, spot.z) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(spot.x, spot.z);
        rig.group.position.set(spot.x, groundY, spot.z);
        rig.group.rotation.y = spot.rotY;
        const d = drive.current;
        d.active = true;
        d.model = model;
        d.x = spot.x;
        d.z = spot.z;
        d.yaw = spot.rotY;
        d.speed = 0;
        d.camYaw = spot.rotY;
        lastDriven = model;
        setMounted({
            model,
            rig
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDriveActive"])(true, model);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetDriveMeters"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportDriveSpeed"])(0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportNearVehicle"])(null);
        // hide the walking rig while the built-in driver silhouette takes over
        playerRigRef.current = findPlayerRigGroup(scene);
        applySeatHide(true);
        // hard cut: chase cam snaps behind the vehicle, then smooths from there
        const { desired } = scratch.current;
        desired.set(d.x - Math.sin(d.camYaw) * CHASE_DIST, groundY + CHASE_HEIGHT, d.z - Math.cos(d.camYaw) * CHASE_DIST);
        const camGround = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(desired.x, desired.z) + 1.15;
        if (desired.y < camGround) desired.y = camGround;
        camera.position.copy(desired);
        camera.lookAt(d.x + Math.sin(d.yaw) * 2.2, groundY + 1.55, d.z + Math.cos(d.yaw) * 2.2);
        if (!humRef.current) humRef.current = new DriveHum();
        humRef.current.setEnabled(soundRef.current);
        humRef.current.start();
    };
    const parkVehicle = ()=>{
        if (!drive.current.active) return;
        const model = drive.current.model;
        const st = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
        // the ONLY money/time touch: metres driven settle through the store action
        st.settleDrive((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveMeters"])());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetDriveMeters"])();
        drive.current.active = false;
        drive.current.speed = 0;
        drive.current.fov = FOV_BASE;
        applyFov(camera, FOV_BASE);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDriveActive"])(false);
        applySeatHide(false);
        playerRigRef.current = null;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportDriveSpeed"])(0);
        if (model) {
            lastDriven = model;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportNearVehicle"])(model); // parked right by you — the prompt may re-offer it
        }
        humRef.current?.stop();
    };
    /* --------------------------------- lifecycle ---------------------------------- */ // leaving the scene mid-drive (world exit / crash boundary) still settles
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDriveActive"])()) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().settleDrive((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDriveMeters"])());
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetDriveMeters"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDriveActive"])(false);
                playerRigRef.current = null;
                humRef.current?.stop();
            }
        };
    }, []);
    // dev/E2E bridge (stripped from production builds)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.__lkoDrive = {
            enter: (model)=>enterVehicleRef.current?.(model),
            exit: ()=>parkVehicleRef.current?.(),
            pos: ()=>({
                    x: drive.current.x,
                    z: drive.current.z,
                    speed: drive.current.speed,
                    model: drive.current.model
                }),
            owned: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().player?.vehicles.map((v)=>v.model) ?? [],
            parked: ()=>Object.fromEntries([
                    ...PARKED_SPOTS.entries()
                ]),
            // E2E only: test funds go through the REAL store action (never direct mutation)
            grantTestFunds: ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().addCash(500_000);
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().player?.cash ?? 0;
            }
        };
        return ()=>{
            delete window.__lkoDrive;
        };
    }, []);
    // keep the latest enter/park handlers reachable from the (stable) bridge
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        enterVehicleRef.current = enterVehicle;
        parkVehicleRef.current = parkVehicle;
    });
    // dusk/dawn while mounted — flip the rig's headlight pool with the sky
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const cone = mounted?.rig.group.getObjectByName('driveCone');
        if (cone) cone.visible = night;
    }, [
        night,
        mounted
    ]);
    /* --------------------------------- frame loop --------------------------------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, rawDt)=>{
        const dt = Math.min(rawDt, 0.05);
        const d = drive.current;
        frameRef.current++;
        // HUD requests (garage Drive / Enter chip / Park button / stop+E)
        const wantEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["consumeEnterRequest"])();
        if (wantEnter && !d.active) enterVehicle(wantEnter);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["consumeParkRequest"])() && d.active) parkVehicle();
        /* ---- W10-b — THE PASSENGER SEAT: riding somebody's stopped car ----
     * While myRide lives, the walker controller is FROZEN and the body
     * teleports each frame to the car's own buffer sample (the E2E
     * teleport seam — the controller keeps its truth, we just aim it).
     * The seat hangs ON the rig: okada behind the rider, keke/taxi/danfo
     * on the running board — the honest danfo ride, visible, no ghost
     * beside the car. The body lane is silent (the carried law); on
     * unboard/drop the body steps off where the car STANDS. */ const ride = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["myRideState"])();
        if (ride && !d.active) {
            if (!rideRef.current) {
                rideRef.current = ride.driver;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freezeInput"])(true);
            }
            const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleCar"])(ride.driver);
            if (s) {
                rideLastSample.current = {
                    x: s.x,
                    z: s.z,
                    hd: s.hd
                };
                const side = SEAT_SIDE[ride.seat % 3] ?? 'left';
                const dist = SEAT_DIST[ride.model] ?? 1.3;
                const sin = Math.sin(s.hd);
                const cos = Math.cos(s.hd);
                // heading 0 faces +z; left = +cos/-sin, right = −cos/+sin, back = −forward
                const ox = side === 'left' ? cos * dist : side === 'right' ? -cos * dist : -sin * dist;
                const oz = side === 'left' ? -sin * dist : side === 'right' ? sin * dist : -cos * dist;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestE2eTeleport"])(s.x + ox, s.z + oz);
            }
        } else if (rideRef.current && !ride) {
            // the ride ended (my hop-off ack, the crew drop, or the wire's own
            // roster backstop): the input unfreezes and the body lands where
            // the car last stood — never inside its geometry, never at (0,0)
            rideRef.current = null;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freezeInput"])(false);
            const last = rideLastSample.current;
            if (last) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestE2eTeleport"])(last.x + 1.2, last.z + 1.2);
            rideLastSample.current = null;
        }
        // world entry: once the walking controller has reported a real position,
        // the last-driven ride waits parked by the roadside nearby
        if (frameRef.current >= 3 && !spawnedThisVisit.current) {
            spawnedThisVisit.current = true;
            const vehicles = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().player?.vehicles ?? [];
            if (vehicles.length > 0) {
                const model = lastDriven && vehicles.some((v)=>v.model === lastDriven) ? lastDriven : vehicles[vehicles.length - 1].model;
                const spot = ensureParked(model);
                const rig = ensureRig(model);
                rig.group.position.set(spot.x, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(spot.x, spot.z) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(spot.x, spot.z), spot.z);
                rig.group.rotation.y = spot.rotY;
                setMounted({
                    model,
                    rig
                });
            }
        }
        if (d.active && d.model) {
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][d.model];
            const rig = RIG_CACHE.get(d.model);
            if (!def || !rig) return;
            // ---- input: same axes as walking (joystick wins, then WASD) ----
            const input = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readMoveInput"])();
            // W10-c — THE DRY-TANK COAST: the engine dies at the dry line (the
            // wire's pos door refuses further motion; the sender reports the
            // car stopped — the tank's own truth, one notify, no spam)
            const dry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelIsDryTank"])();
            if (dry && !dryNotified.current) {
                dryNotified.current = true;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify({
                    icon: '⛽',
                    text: 'Tank dry! The engine don die — find a pump.',
                    tone: 'bad'
                });
            }
            if (!dry) dryNotified.current = false;
            const throttle = dry ? 0 : input.y;
            const steer = input.x;
            // ---- longitudinal: accel → top speed, grass cap, brake/reverse ----
            const onRoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(d.x, d.z) < ON_ROAD_DIST;
            const cap = def.topSpeed * (onRoad ? 1 : GRASS_CAP);
            if (throttle > 0.02) {
                d.speed += def.accel * throttle * dt;
            } else if (throttle < -0.02) {
                if (d.speed > 0.25) d.speed -= def.accel * 2.1 * dt; // brake
                else d.speed = Math.max(d.speed - def.accel * 0.55 * dt, -REVERSE_MAX); // reverse creep
            } else {
                const drag = def.accel * 0.42 * dt // engine braking + rolling drag
                ;
                d.speed = Math.abs(d.speed) <= drag ? 0 : d.speed - Math.sign(d.speed) * drag;
            }
            if (d.speed > cap) d.speed += (cap - d.speed) * Math.min(1, dt * 2.6);
            d.speed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(d.speed, -REVERSE_MAX, def.topSpeed);
            // ---- steering: authority grows with roll speed, fades at the top end ----
            const speedNorm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(Math.abs(d.speed) / def.topSpeed, 0, 1);
            const steerAuth = Math.min(1, Math.abs(d.speed) / 2.0) * (1 - 0.42 * speedNorm);
            const turnRate = steer * 1.55 * def.handling * steerAuth * (d.speed < -0.05 ? -1 : 1);
            d.yaw += turnRate * dt;
            // ---- W3 THE ACKERMANN LAW — the front wheels get their REAL angles:
            // the turn radius R = |speed / yawRate|, then δi = atan(L/(R − w/2))
            // and δo = atan(L/(R + w/2)) — cot(δo) − cot(δi) = w/L exactly. Zero
            // allocations; a few trig calls per frame on a driven rig only.
            const dims = ACKERMANN[d.model];
            const yawRate = turnRate;
            const turnR = Math.abs(yawRate) > 1e-4 ? Math.abs(d.speed / yawRate) : Infinity;
            const sTurn = yawRate >= 0 ? 1 : -1 // yaw+ = a left turn → left wheel inner
            ;
            if (rig.frontWheels.length >= 2) {
                const Ri = Math.max(0.55, turnR - dims.w / 2);
                const Ro = Math.max(0.55, turnR + dims.w / 2);
                const dInner = Math.atan(dims.L / Ri);
                const dOuter = Math.atan(dims.L / Ro);
                // frontWheels build order: [left (−x), right (+x)]
                rig.frontWheels[0].rotation.y = sTurn * dInner;
                rig.frontWheels[1].rotation.y = sTurn * dOuter;
            }
            if (rig.steer) {
                // the fork vehicles (okada/keke) steer the whole fork by the
                // bicycle-model angle δ = atan(L / R)
                const dFork = Math.atan(dims.L / Math.max(0.55, turnR));
                rig.steer.rotation.y = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(sTurn * dFork, -0.55, 0.55);
            }
            // ---- integrate + reuse the building/river/rim resolver ----
            const fx = Math.sin(d.yaw);
            const fz = Math.cos(d.yaw);
            const rawX = d.x + fx * d.speed * dt;
            const rawZ = d.z + fz * d.speed * dt;
            const [rx, rz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolvePosition"])(rawX, rawZ);
            const shoved = Math.hypot(rx - rawX, rz - rawZ);
            if (shoved > 0.02) {
                // wall/scrape contact — a fast hit kills 60% of the speed
                if (Math.abs(d.speed) > IMPACT_SPEED) d.speed *= 0.4;
                else d.speed *= 0.9;
            }
            d.x = rx;
            d.z = rz;
            if (d.speed !== 0) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDriveMeters"])(Math.abs(d.speed) * dt);
            // ---- visuals: ground, bumps, wheels, lean ----
            const groundY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bridgeDeckY"])(d.x, d.z) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(d.x, d.z);
            // W3 THE SCHOOL-BUMP LAW — the body rides the true sinusoid: lift by
            // the shared profile and shed a little speed on the throat (a real
            // hump slows the car; painted-only lies don't)
            const bump = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bumpHeightAt"])(d.x, d.z);
            rig.group.position.set(d.x, groundY + bump, d.z);
            if (bump > 0.002) d.speed *= Math.max(0, 1 - 1.6 * dt * (bump / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$junctions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUMP_AMPLITUDE"]));
            rig.group.rotation.y = d.yaw;
            const wr = WHEEL_R[d.model];
            for (const w of rig.wheels)w.rotation.x += d.speed * dt / wr;
            const rollTarget = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(LEAN_SIGN[d.model] * turnRate * ROLL_GAIN[d.model], -MAX_ROLL[d.model], MAX_ROLL[d.model]);
            rig.bank.rotation.z += (rollTarget - rig.bank.rotation.z) * Math.min(1, dt * 6);
            // ---- seat protocol: rig hidden, vehicle position published ----
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDriveSeat"])({
                x: d.x,
                y: groundY,
                z: d.z,
                yaw: d.yaw,
                hide: true
            });
            // ---- HUD + shared state (minimap/ambience read playerPos) ----
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportDriveSpeed"])(d.speed);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportPlayerPos"])(d.x, d.z, d.yaw);
            followRef.current.set(d.x, 0, d.z);
            // ---- chase cam: smoothed, terrain-safe, obstruction-aware ----
            const dyaw = d.yaw - d.camYaw;
            const wrapped = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
            d.camYaw += wrapped * Math.min(1, dt * 2.8);
            const { desired, from } = scratch.current;
            const dist = CHASE_DIST + speedNorm * 2.2;
            desired.set(d.x - Math.sin(d.camYaw) * dist, groundY + CHASE_HEIGHT + speedNorm * 0.9, d.z - Math.cos(d.camYaw) * dist);
            const camGround = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(desired.x, desired.z) + 1.15;
            if (desired.y < camGround) desired.y = camGround;
            from.set(d.x, groundY + 1.6, d.z);
            const obsT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$collision$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cameraObstructionT"])(d.x, d.z, desired.x, desired.z, desired.y);
            if (obsT !== null) desired.lerpVectors(from, desired, obsT);
            camera.position.lerp(desired, Math.min(1, dt * 5.2));
            camera.lookAt(d.x + fx * 2.3, groundY + 1.55, d.z + fz * 2.3);
            // ---- speed feel: gentle FOV pull + engine hum ----
            const targetFov = FOV_BASE + 8.5 * speedNorm;
            if (Math.abs(d.fov - targetFov) > 0.02) {
                d.fov += (targetFov - d.fov) * Math.min(1, dt * 3);
                applyFov(camera, d.fov);
            }
            humRef.current?.update(speedNorm);
            return;
        }
        // ---- not driving: walk-up discovery of parked rides ----
        humRef.current?.update(0);
        let near = null;
        let nearD = ENTER_RADIUS;
        for (const [model, spot] of PARKED_SPOTS){
            const owned = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().player?.vehicles.some((v)=>v.model === model);
            if (!owned) continue;
            const dist = Math.hypot(spot.x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, spot.z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z);
            if (dist < nearD) {
                nearD = dist;
                near = model;
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reportNearVehicle"])(near);
    });
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: mounted.rig.group
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/DriveSystem.tsx",
        lineNumber: 641,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/game/world/polish.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PolishLayer",
    ()=>PolishLayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M19: NEXT-GEN POLISH LAYER
 * -----------------------------------------
 * The beauty extras, each one governed by THE EXTRAS-FIRST LAW:
 * under frame stress these layers strip tier-by-tier BEFORE the dynres
 * governor touches pixel ratio — gameplay never waits for beauty.
 *
 *   • DustHaze  — "volumetric" harmattan: a few huge soft drifting
 *     planes with a 2-octave procedural noise shader. NO raymarching,
 *     NO render targets, NO post — the Sahara on a budget.
 *   • Puddles   — rain-wet ellipses on the roads: ONE merged geometry
 *     (one draw call) with a fake-fresnel wet shader that glints at the
 *     sun. Fade in with the rain family, dry out under a clear sky.
 *
 * Both read the shared `atmoLive` weather + the `extrasLive` level —
 * zero React state churn, everything eases inside useFrame.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/atmosphere.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/extras.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
/* --------------------------------- DustHaze -------------------------------- */ const DUST_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const DUST_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uTint;
  // two-octave value noise from a hash — no textures, THE ZERO-ASSET LAW
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    vec2 p = vWorld.xz * 0.018;
    p += vec2(uTime * 0.014, uTime * 0.006); // the slow Sahara drift
    float n = noise(p) * 0.65 + noise(p * 2.7 + 13.1) * 0.35;
    float veil = smoothstep(0.28, 0.85, n);
    // fade the plane's own edge so no rectangle seam ever shows
    float edge = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x)
               * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
    float a = veil * edge * uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uTint, a);
  }
`;
/**
 * THE HAZE LAW: planes hug the ground (dust does), drift deterministically
 * with the shared clock, and their opacity answers ONLY to the weather +
 * extras level. `visible` flips at true zero — an invisible layer costs
 * exactly nothing.
 */ function DustHaze({ tier }) {
    const matRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const groupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const planes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(1973) // seeded — every player sees the same dust
        ;
        const out = [];
        for(let i = 0; i < 4; i++){
            out.push({
                x: (rng() - 0.5) * 160,
                z: (rng() - 0.5) * 160,
                y: 1.6 + i * 1.9 + rng() * 0.8,
                w: 130 + rng() * 50,
                h: 26 + rng() * 14,
                rot: (rng() - 0.5) * 0.6
            });
        }
        return out;
    }, []);
    const uniforms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            uTime: {
                value: 0
            },
            uOpacity: {
                value: 0
            },
            uTint: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#d9bd8c')
            }
        }), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state, dt)=>{
        const mat = matRef.current;
        const grp = groupRef.current;
        if (!mat || !grp) return;
        const tierCap = tier === 'high' ? 0.34 : 0.26 // mid sees slightly less dust
        ;
        // EXTRAS-FIRST: the live level multiplies the weather target — under
        // frame stress level 0 strips the haze to nothing BEFORE dynres moves
        const stress = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].level === 2 ? 1 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].level === 1 ? 0.5 : 0;
        const target = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].weather === 'harmattan' ? tierCap * stress : 0;
        const u = mat.uniforms;
        u.uTime.value = state.clock.elapsedTime;
        u.uOpacity.value += (target - u.uOpacity.value) * Math.min(1, dt * 0.8);
        const on = u.uOpacity.value > 0.01;
        grp.visible = on;
        if (!on) return;
        // the whole group drifts imperceptibly east — dust rides the wind
        grp.position.x = Math.sin(state.clock.elapsedTime * 0.02) * 6;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: groupRef,
        visible: false,
        children: planes.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    p.x,
                    p.y,
                    p.z
                ],
                rotation: [
                    0,
                    p.rot,
                    0
                ],
                renderOrder: 4,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            p.w,
                            p.h
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/polish.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                        ref: i === 0 ? matRef : undefined,
                        uniforms: uniforms,
                        vertexShader: DUST_VERT,
                        fragmentShader: DUST_FRAG,
                        transparent: true,
                        depthWrite: false,
                        fog: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/polish.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/game/world/polish.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/polish.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
/* --------------------------------- Puddles --------------------------------- */ /**
 * THE PUDDLE BOOK: seeded ellipses scattered along the real roads (the
 * same ROADS the traffic drives), kept off the centres where feet walk.
 * ONE merged geometry → ONE draw call for the whole wet city (THE DRAW
 * LAW). The shader fakes it all: fresnel sky tint + one sun glint.
 */ function buildPuddleGeometry(count) {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(88421);
    const verts = [];
    const idx = [];
    const vertsPer = 10;
    let placed = 0;
    let guard = 0;
    while(placed < count && guard < count * 40){
        guard++;
        const road = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"][Math.floor(rng() * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"].length)];
        if (!road.pts || road.pts.length < 2) continue;
        const seg = Math.floor(rng() * (road.pts.length - 1));
        const [ax, az] = road.pts[seg];
        const [bx, bz] = road.pts[seg + 1];
        const t = 0.15 + rng() * 0.7;
        const px = ax + (bx - ax) * t;
        const pz = az + (bz - az) * t;
        // sit at the road edge, not the crown — puddles hug the gutters
        const dx = bx - ax;
        const dz = bz - az;
        const len = Math.hypot(dx, dz) || 1;
        const nx = -dz / len * (road.w * 0.5) * (rng() < 0.5 ? -1 : 1);
        const nz = dx / len * (road.w * 0.5) * (rng() < 0.5 ? -1 : 1);
        const cx = px + nx + (rng() - 0.5) * 1.2;
        const cz = pz + nz + (rng() - 0.5) * 1.2;
        const rx = 0.9 + rng() * 1.7;
        const rz = 0.7 + rng() * 1.4;
        const rot = Math.atan2(dz, dx) + (rng() - 0.5) * 0.5;
        const base = verts.length / 3;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        for(let k = 0; k < vertsPer; k++){
            const a = k / vertsPer * Math.PI * 2;
            const lx = Math.cos(a) * rx;
            const lz = Math.sin(a) * rz;
            verts.push(cx + lx * cos - lz * sin, 0.035, cz + lx * sin + lz * cos);
        }
        for(let k = 1; k < vertsPer - 1; k++){
            idx.push(base, base + k, base + k + 1);
        }
        placed++;
    }
    const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    geo.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}
const PUDDLE_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const PUDDLE_FRAG = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  uniform float uOpacity;
  uniform vec3 uSky;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uTime;
  void main() {
    // fake fresnel — grazing angles read the sky, steep angles read mud
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - abs(dot(viewDir, vNormal)), 2.2);
    vec3 col = mix(vec3(0.16, 0.15, 0.13), uSky, 0.25 + fres * 0.6);
    // one cheap sun glint, wobbling slightly — the whole "reflection"
    vec3 h = normalize(viewDir + normalize(uSunDir));
    float spec = pow(max(dot(vNormal, h), 0.0), 90.0) * (0.85 + 0.15 * sin(uTime * 2.0 + vWorld.x));
    col += uSunColor * spec * 0.9;
    gl_FragColor = vec4(col, uOpacity * (0.55 + fres * 0.45));
  }
`;
function Puddles({ tier }) {
    const matRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildPuddleGeometry(16), []);
    const uniforms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            uOpacity: {
                value: 0
            },
            uSky: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#cfe0e8')
            },
            uSunDir: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0.3, 0.8, 0.2)
            },
            uSunColor: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#fff2d0')
            },
            uTime: {
                value: 0
            }
        }), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state, dt)=>{
        const mat = matRef.current;
        if (!mat) return;
        const u = mat.uniforms;
        u.uTime.value = state.clock.elapsedTime;
        const wet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wetnessFor"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].weather);
        // EXTRAS-FIRST: the live level dries the streets under stress too
        const stress = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].level === 2 ? 1 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].level === 1 ? 0.6 : 0;
        const target = wet * (tier === 'high' ? 0.85 : 0.7) * stress;
        u.uOpacity.value += (target - u.uOpacity.value) * Math.min(1, dt * 0.5); // rain fills, sun dries
        const on = u.uOpacity.value > 0.015;
        mat.visible = on;
        if (!on) return;
        u.uSunColor.value.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].sunsetBand > 0.5 ? '#ff9a5e' : '#fff2d0');
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        geometry: geo,
        renderOrder: 3,
        frustumCulled: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
            ref: matRef,
            uniforms: uniforms,
            vertexShader: PUDDLE_VERT,
            fragmentShader: PUDDLE_FRAG,
            transparent: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -1
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/polish.tsx",
            lineNumber: 267,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/polish.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
function PolishLayer({ tier }) {
    if (tier === 'low') return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DustHaze, {
                tier: tier
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/polish.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Puddles, {
                tier: tier
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/polish.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/components/game/world/WorldScene.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldScene",
    ()=>WorldScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — World Scene (Stage 3D)
 * -------------------------------------
 * The R3F root: canvas setup tuned per device tier, the sky dome,
 * and the atmosphere controller — which reads the REAL world clock
 * + weather (store props) and eases lights/sky/fog/night-glow toward
 * the matching keyframe. One directional light both lights the city
 * and casts the shadow frustum that follows the player.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export F as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-9ce18a08.esm.js [app-ssr] (ecmascript) <export D as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/atmosphere.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$WorldTerrain$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/WorldTerrain.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$CityMesh$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/CityMesh.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$SchoolMesh$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/SchoolMesh.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/Actors.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$RemoteWalkers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/RemoteWalkers.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$RemoteVehicles$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/game/world/RemoteVehicles.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$StageCapture$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/StageCapture.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$DriveSystem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/DriveSystem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$polish$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/polish.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/perfProbe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/extras.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/music.ts [app-ssr] (ecmascript)");
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
;
;
/* ------------------------------ perf governors (M3+M7) ------------------------- */ /** the governed renderer, captured once at canvas creation (module scratch —
 *  keeps the frame loop free of hook-returned objects it must mutate) */ const governedRenderer = {
    gl: null
};
/** where the shadow frustum currently sits (player pos, copied per frame) */ const shadowGovFollow = {
    x: 0,
    z: 0
};
const shadowGovScratch = {
    x: 9999,
    z: 9999,
    t: -1
};
/** copies the follow target into module scratch each frame (ref writes from a
 *  hook-owned ref inside useFrame trip the immutability lint; this doesn't) */ function FollowCopier({ followRef }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])(()=>{
        shadowGovFollow.x = followRef.current.x;
        shadowGovFollow.z = followRef.current.z;
    });
    return null;
}
/**
 * The shadow map used to re-render EVERY frame — a second full pass over every
 * shadow caster at 30-60fps. The Governor flips to on-demand: the map refreshes
 * when the player moves ≥3u (frustum follows), when rigs have had time to walk
 * on (0.4s heartbeat), or on the first frame. Three.js renders the map exactly
 * once per needsUpdate and then parks it — the sun's EASING is handled because
 * any real sun move coincides with player movement or the heartbeat.
 */ function ShadowGovernor() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((state)=>{
        const gl = governedRenderer.gl;
        if (!gl) return;
        const sm = gl.shadowMap;
        if (sm.autoUpdate) return; // not governed (defensive)
        const p = shadowGovFollow;
        const now = state.clock.elapsedTime;
        if (shadowGovScratch.t < 0 || Math.hypot(p.x - shadowGovScratch.x, p.z - shadowGovScratch.z) >= 3 || now - shadowGovScratch.t >= 0.4) {
            shadowGovScratch.x = p.x;
            shadowGovScratch.z = p.z;
            shadowGovScratch.t = now;
            sm.needsUpdate = true;
        }
    });
    return null;
}
/**
 * Low tier only: paces the render loop at ~30Hz in demand mode — same visual
 * pacing on weak phones, half the GPU energy, and thermal headroom that keeps
 * the GPU from throttling into stutter. M7: a hidden tab never invalidates —
 * background phones keep their battery.
 */ function FramePacer({ hz }) {
    const invalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])((s)=>s.invalidate);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hz) return;
        const t = setInterval(()=>{
            if (typeof document !== 'undefined' && document.hidden) return;
            invalidate();
        }, 1000 / hz);
        return ()=>clearInterval(t);
    }, [
        hz,
        invalidate
    ]);
    return null;
}
/* ------------------------- M7 — dynamic resolution governor --------------------- */ /** live dyn-res state (module scratch — read by the E2E hook + settings UI) */ const dynResLive = {
    cap: 1,
    dir: 'steady',
    sinceMs: 0,
    changes: 0
};
/**
 * RUN ON ANY DEVICE, part 1: the governor that fights lag while you play.
 * Every ~2s it reads the perf probe's frame ring; sustained frame stress
 * (p95 over 40ms) walks the render resolution DOWN a step — the game gets
 * lighter without moving a single gameplay law. Sustained headroom walks
 * it back UP. Hysteresis lives in the pure law (systems/device.ts).
 */ function DynamicResGovernor({ profile }) {
    const gl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useThree$3e$__["useThree"])((s)=>s.gl);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const floor = profile.preset.dprFloor;
        const initialCap = Math.min(profile.preset.dprCap, window.devicePixelRatio || 1);
        dynResLive.cap = initialCap;
        const id = setInterval(()=>{
            if (document.hidden) return; // a background tab is not rendering truth
            const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readFrameStats"])();
            if (!stats) return;
            const { state, action } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nextDynRes"])(dynResLive, {
                p95ms: stats.p95ms,
                nowMs: performance.now()
            }, {
                floor,
                initialCap
            });
            Object.assign(dynResLive, state);
            if (action !== 'hold') {
                gl.setPixelRatio(Math.min(dynResLive.cap, window.devicePixelRatio || 1));
            }
            // M19 — THE EXTRAS-FIRST HEARTBEAT: the same ~2s tick recomputes the
            // polish verdict; beauty strips tier-by-tier BEFORE resolution moves.
            const p95 = stats ? stats.p95ms : null;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateExtrasLevel"])(profile.effective, p95, dynResLive.dir);
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].setIntensity(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].level); // the drum kit thins under stress too
            } catch  {
            /* audio is best-effort */ }
        }, 2000);
        return ()=>clearInterval(id);
    }, [
        gl,
        profile
    ]);
    return null;
}
/* ------------------------------- shared easing state --------------------------- */ const skyTargets = {
    top: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#4f9fd8'),
    horizon: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#cfe4d4'),
    sun: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#fff2d0'),
    glow: 1,
    /** M19 — the Confluence sunset band strength (eased toward the keyframe) */ band: 0,
    /** M19 — the band's colour: rose-gold at dusk, soft gold at sunrise */ bandColor: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#ff8a5e')
};
const starsState = {
    opacity: 0
};
/* ---------------------------------- sky dome ---------------------------------- */ function SkyDome({ sunRef }) {
    const uniforms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            uTop: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#4f9fd8')
            },
            uHorizon: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#cfe4d4')
            },
            uSunDir: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0.3, 0.8, 0.2)
            },
            uSunColor: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#fff2d0')
            },
            uSunGlow: {
                value: 1
            },
            uBand: {
                value: 0
            },
            uBandColor: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]('#ff8a5e')
            }
        }), []);
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, dt)=>{
        const m = mat.current;
        if (!m) return;
        const u = m.uniforms;
        const k = Math.min(1, dt * 3.2);
        u.uTop.value.lerp(skyTargets.top, k);
        u.uHorizon.value.lerp(skyTargets.horizon, k);
        u.uSunColor.value.lerp(skyTargets.sun, k);
        u.uSunDir.value.lerp(sunRef.current, k);
        u.uSunGlow.value += (skyTargets.glow - u.uSunGlow.value) * k;
        u.uBand.value += (skyTargets.band - u.uBand.value) * k;
        u.uBandColor.value.lerp(skyTargets.bandColor, k);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        scale: [
            -1,
            1,
            1
        ],
        renderOrder: -10,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    620,
                    24,
                    16
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                ref: mat,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackSide"],
                depthWrite: false,
                fog: false,
                uniforms: uniforms,
                vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
          }
        `,
                fragmentShader: `
          varying vec3 vDir;
          uniform vec3 uTop;
          uniform vec3 uHorizon;
          uniform vec3 uSunDir;
          uniform vec3 uSunColor;
          uniform float uSunGlow;
          uniform float uBand;
          uniform vec3 uBandColor;
          void main() {
            float h = clamp(vDir.y, 0.0, 1.0);
            vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
            float sun = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 90.0);
            col += uSunColor * sun * uSunGlow;
            float haze = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 7.0);
            col += uSunColor * haze * 0.14 * uSunGlow;
            // M19 — THE CONFLUENCE SUNSET BAND: a wide rose-gold glow hugging
            // the horizon on the sun's side. Two pows, no loops — 6 adds total.
            float bandH = exp(-h * 7.0);
            float bandSun = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 2.2);
            col += uBandColor * bandH * bandSun * uBand * 0.55;
            gl_FragColor = vec4(col, 1.0);
          }
        `
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldScene.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
/* ---------------------------------- stars ------------------------------------- */ function Stars() {
    const mat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const geo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // seeded so the night sky is identical for every player, every load
        const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(4242);
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
        const pos = new Float32Array(320 * 3);
        for(let i = 0; i < 320; i++){
            const theta = rng() * Math.PI * 2;
            const phi = Math.acos(rng() * 0.85);
            const r = 560;
            pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
            pos[i * 3 + 1] = Math.cos(phi) * r * 0.9 + 40;
            pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
        }
        g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](pos, 3));
        return g;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, dt)=>{
        if (!mat.current) return;
        mat.current.opacity += (starsState.opacity - mat.current.opacity) * Math.min(1, dt * 3);
        mat.current.visible = mat.current.opacity > 0.02;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
        geometry: geo,
        renderOrder: -9,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointsMaterial", {
            ref: mat,
            color: "#dfe8ff",
            size: 2.2,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0,
            depthWrite: false
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/WorldScene.tsx",
            lineNumber: 268,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldScene.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
/* ------------------------------ atmosphere controller --------------------------- */ const scratch = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"]();
function AtmosphereController({ timeOfDay, weather, sunRef, followRef }) {
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAtmosphere"])(timeOfDay, weather), [
        timeOfDay,
        weather
    ]);
    // M7 — low tier leans the fog in a touch: cheaper overdraw, same sky law
    const fogMult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>1 + ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDeviceProfile"])().preset.fogPush ?? 0), []);
    const sun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hemi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const moon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$9ce18a08$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__F__as__useFrame$3e$__["useFrame"])((_, dt)=>{
        const k = Math.min(1, dt * 3.2);
        const f = fog.current;
        if (f) {
            f.color.lerp(scratch.set(target.fogColor), k);
            f.density += (target.fogDensity * fogMult - f.density) * k;
        }
        skyTargets.top.lerp(scratch.set(target.skyTop), k);
        skyTargets.horizon.lerp(scratch.set(target.skyHorizon), k);
        skyTargets.sun.lerp(scratch.set(target.sunColor), k);
        skyTargets.glow = target.showMoon ? 0.25 : 1;
        // M19 — the band eases toward its keyframe; harmattan dusk burns rose-gold
        skyTargets.band = target.sunsetBand;
        skyTargets.bandColor.set(timeOfDay === 'morning' ? '#ffd08a' : '#ff7e5e');
        // M19 — the shared live state the polish layers read (zero React churn)
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].weather = weather;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].sunsetBand += (target.sunsetBand - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].sunsetBand) * k;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].flood += ((weather === 'flood' ? 1 : 0) - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].flood) * Math.min(1, dt * 0.5);
        const sv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sunVec"])(target.sunDir);
        sunRef.current.set(sv[0], sv[1], sv[2]);
        if (sun.current) {
            sun.current.intensity += (target.sunIntensity - sun.current.intensity) * k;
            sun.current.color.lerp(scratch.set(target.sunColor), k);
            // keep the shadow frustum centred on the action
            sun.current.position.set(followRef.current.x + sv[0] * 90, sv[1] * 90, followRef.current.z + sv[2] * 90);
            sun.current.target.position.set(followRef.current.x, 0, followRef.current.z);
            sun.current.target.updateMatrixWorld();
        }
        if (hemi.current) {
            hemi.current.intensity += (target.hemiIntensity - hemi.current.intensity) * k;
            hemi.current.color.lerp(scratch.set(target.hemiSky), k);
            hemi.current.groundColor.lerp(scratch.set(target.hemiGround), k);
        }
        if (moon.current) moon.current.visible = target.showMoon;
        // shared glow for windows/lamps (CityMesh reads this) + star opacity
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow += (target.nightGlow - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmoLive"].nightGlow) * k;
        starsState.opacity = target.stars;
    });
    const sv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$atmosphere$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sunVec"])(target.sunDir);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fogExp2", {
                ref: fog,
                attach: "fog",
                args: [
                    target.fogColor,
                    target.fogDensity
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 351,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hemisphereLight", {
                ref: hemi,
                args: [
                    target.hemiSky,
                    target.hemiGround,
                    target.hemiIntensity
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                ref: sun,
                castShadow: true,
                position: [
                    sv[0] * 90,
                    sv[1] * 90,
                    sv[2] * 90
                ],
                intensity: target.sunIntensity,
                color: target.sunColor,
                "shadow-mapSize": [
                    1024,
                    1024
                ],
                "shadow-camera-near": 20,
                "shadow-camera-far": 220,
                "shadow-camera-left": -40,
                "shadow-camera-right": 40,
                "shadow-camera-top": 40,
                "shadow-camera-bottom": -40,
                "shadow-bias": -0.0006
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 353,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: moon,
                position: [
                    -160,
                    250,
                    -230
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            13,
                            16,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldScene.tsx",
                        lineNumber: 370,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#e8edf8",
                        fog: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldScene.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
/* --------------------------- M6 — night market glow --------------------------- */ /**
 * The Food Strip turns after dark: two strings of warm bulbs strung
 * across the stalls and two glowing stall signs. Presentation only —
 * every bulb is an unlit emissive sphere, no real lights added (the
 * night sky already carries sodium pools). Hidden outside evening/night
 * by the SAME law the menu reads — isNightMarketOpen.
 */ function NightMarketGlow({ timeOfDay }) {
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNightMarketOpen"])(timeOfDay);
    const anchor = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['food-area'];
    const bulbs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const out = [];
        // two sagging bulb strings across the stall row (13 bulbs each)
        for(let row = 0; row < 2; row++){
            const z = anchor.z + (row === 0 ? -6.5 : 6.5);
            for(let i = 0; i < 13; i++){
                const t = i / 12;
                out.push({
                    x: anchor.x - 11 + 22 * t,
                    y: 3.1 - Math.sin(t * Math.PI) * 0.75,
                    z
                });
            }
        }
        return out;
    }, [
        anchor.x,
        anchor.z
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            bulbs.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        b.x,
                        b.y,
                        b.z
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.16,
                                6,
                                5
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldScene.tsx",
                            lineNumber: 412,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                            color: "#ffd88a",
                            toneMapped: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldScene.tsx",
                            lineNumber: 413,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/game/world/WorldScene.tsx",
                    lineNumber: 411,
                    columnNumber: 9
                }, this)),
            [
                -6.5,
                6.5
            ].map((dz, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        anchor.x,
                        3.1,
                        anchor.z + dz
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                22,
                                0.05,
                                0.05
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldScene.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                            color: "#1a1a22"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldScene.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this)
                    ]
                }, `w${i}`, true, {
                    fileName: "[project]/src/components/game/world/WorldScene.tsx",
                    lineNumber: 418,
                    columnNumber: 9
                }, this)),
            [
                -8,
                8
            ].map((dx, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        anchor.x + dx,
                        2.4,
                        anchor.z + (i === 0 ? -10 : 10)
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                2.6,
                                1.1,
                                0.14
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldScene.tsx",
                            lineNumber: 426,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                            color: "#ff9e5e",
                            toneMapped: false
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldScene.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this)
                    ]
                }, `s${i}`, true, {
                    fileName: "[project]/src/components/game/world/WorldScene.tsx",
                    lineNumber: 425,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldScene.tsx",
        lineNumber: 408,
        columnNumber: 5
    }, this);
}
function WorldScene({ avatar, currentLocationId, timeOfDay, weather, onReady, onNearestAnchor, onDistrict, onGist, onContextLost, onContextRestored }) {
    /**
   * M7 — the device law, read once per session. The player's saved pick
   * (settings.graphics) is threaded through getDeviceProfile; the E2E
   * hook __lklForceQuality overrides the EFFECTIVE tier for device-matrix
   * screenshots without touching any gameplay law.
   */ const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const setting = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().settings.graphics;
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDeviceProfile"])(setting);
        const forced = window.__lklForceQuality;
        if (forced === 'low' || forced === 'mid' || forced === 'high') {
            return {
                ...p,
                effective: forced,
                preset: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUALITY_PRESETS"][forced]
            };
        }
        return p;
    }, []);
    const sunRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0.3, 0.8, 0.2));
    const camTarget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
        shadows: profile.preset.shadows,
        dpr: Math.min(profile.preset.dprCap, window.devicePixelRatio || 1),
        frameloop: profile.preset.frameHz ? 'demand' : 'always',
        gl: {
            antialias: profile.preset.antialias,
            powerPreference: 'high-performance',
            stencil: false
        },
        camera: {
            fov: 55,
            near: 0.5,
            far: profile.preset.far,
            position: [
                8,
                8,
                8
            ]
        },
        onCreated: ({ gl })=>{
            gl.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            // gentle lift: warm Nigerian light without blowing the plaster out
            gl.toneMappingExposure = 1.12;
            if (profile.preset.shadows) {
                // cheaper shadow filter — visually indistinguishable here at 1024², measurably faster
                gl.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PCFShadowMap"];
                // M3: shadows render on demand via <ShadowGovernor/>, not every frame
                gl.shadowMap.autoUpdate = false;
                gl.shadowMap.needsUpdate = true;
                governedRenderer.gl = gl;
            }
            // honest metrics for the perf harness — dev builds always, production
            // ONLY behind the ?e2e=1 test-hook door (Phase-2.5 perf-truth harness
            // reads renderer.info.drawCalls here; normal play never passes ?e2e)
            // PH2.5 fix: was nested in the shadows branch — mid/low tiers (shadows
            // off) never exposed the renderer; the hook belongs on the common path.
            if (("TURBOPACK compile-time value", "development") !== 'production' || new URLSearchParams(window.location.search).has('e2e')) {
                ;
                window.__lklRenderer = gl;
            }
            // M4: the perf probe reads renderer.info on EVERY tier — real-device
            // diagnostics must work in production and on weak phones too
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPerfRenderer"])(gl);
            dynResLive.cap = Math.min(profile.preset.dprCap, window.devicePixelRatio || 1);
            /* --- M7: context-loss recovery — the black-screen killer -------------
         * Mobile OSes silently evict WebGL contexts under memory pressure
         * (a phone call is enough). Without these two listeners the player
         * is stuck on a dead canvas; with them the game rebuilds itself. */ const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e)=>{
                e.preventDefault() // tells three.js we intend to restore
                ;
                window.__lklGlStatus = 'lost';
                onContextLost?.();
            });
            canvas.addEventListener('webglcontextrestored', ()=>{
                ;
                window.__lklGlStatus = 'restored';
                if (profile.preset.shadows) gl.shadowMap.needsUpdate = true;
                onContextRestored?.();
            });
            // M7 E2E: the device matrix needs the tier + dyn-res state + the canvas
            if (window.location.search.includes('e2e=1')) {
                ;
                window.__lklGlCanvas = canvas;
                window.__lklDynRes = dynResLive;
                window.__lklTier = profile.effective;
            }
            onReady?.();
        },
        style: {
            position: 'absolute',
            inset: 0,
            touchAction: 'none'
        },
        children: [
            profile.preset.shadows ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ShadowGovernor, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 541,
                columnNumber: 9
            }, this) : profile.preset.frameHz ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FramePacer, {
                hz: profile.preset.frameHz
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 543,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DynamicResGovernor, {
                profile: profile
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 545,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FollowCopier, {
                followRef: camTarget
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 546,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AtmosphereController, {
                timeOfDay: timeOfDay,
                weather: weather,
                sunRef: sunRef,
                followRef: camTarget
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SkyDome, {
                sunRef: sunRef
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 548,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Stars, {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 549,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$WorldTerrain$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldTerrain"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 551,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$CityMesh$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CityMesh"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 552,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$SchoolMesh$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SchoolMesh"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 554,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$polish$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PolishLayer"], {
                tier: profile.effective
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 557,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlayerController"], {
                avatar: avatar,
                spawnLocationId: currentLocationId,
                onNearestAnchor: onNearestAnchor,
                onDistrict: onDistrict,
                onPosition: (x, z)=>camTarget.current.set(x, 0, z)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 559,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Npcs"], {
                timeOfDay: timeOfDay,
                onGist: onGist
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 566,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Traffic"], {
                timeOfDay: timeOfDay
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 567,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$RemoteWalkers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RemoteWalkers"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 570,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$RemoteVehicles$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RemoteVehicles"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 574,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$StageCapture$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StageCapture"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 575,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Rain"], {
                weather: weather
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 576,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NightMarketGlow, {
                timeOfDay: timeOfDay
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 578,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Birds"], {
                timeOfDay: timeOfDay
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 580,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$Actors$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SmokeWisps"], {}, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 581,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$DriveSystem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DriveSystem"], {
                timeOfDay: timeOfDay,
                followRef: camTarget
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldScene.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WorldScene.tsx",
        lineNumber: 479,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/wardrobe-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWardrobeBus",
    ()=>useWardrobeBus
]);
/**
 * LOKOJA LIFE — Wardrobe Bus (Stage 5)
 * --------------------------------------
 * Tiny cross-layer signal: the 3D interior hotspot ("Use the wardrobe")
 * and the 2D WardrobePanel live in different component trees, so a
 * one-flag store is the cleanest way to connect them. No game economy
 * lives here — appearance changes go through useGameStore.setAvatar.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useWardrobeBus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        open: false,
        show: ()=>set({
                open: true
            }),
        hide: ()=>set({
                open: false
            })
    }));
}),
"[project]/src/components/game/world/panels/BankPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BankPanel",
    ()=>BankPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Bank Panel (Stage 5-b)
 * ------------------------------------
 * The teller's window as a bottom sheet, opened from inside the Lokoja
 * Microfinance Bank interior. Pure presentation over the SAME store
 * authority: every naira moves through `bankDeposit` / `bankWithdraw`
 * (they validate, ledger, notify and autosave). No economy lives here.
 *
 * House style: the shared kit SheetShell + the HUD's glass/typography
 * classes, mobile-first (390px), touch targets ≥ 44px.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/kit.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
/** the teller's quick amounts — presentation chips, not economy rules */ const QUICK_AMOUNTS = [
    1000,
    5000,
    25000
];
function AmountButton({ label, disabled, onClick, tone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        onClick: onClick,
        className: `lko-press flex min-h-[46px] items-center justify-center rounded-xl px-2 text-[13px] font-extrabold ${tone === 'in' ? 'bg-[var(--lko-green)] text-white disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]' : 'bg-[var(--lko-gold)] text-[#33230a] disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]'}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
function BankPanel({ onClose }) {
    const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    const bankBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.bankBalance ?? 0);
    const transactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.transactions ?? []);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.chaos);
    const bankDeposit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.bankDeposit);
    const bankWithdraw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.bankWithdraw);
    // last five bank moves, newest first
    const bankTx = transactions.filter((t)=>t.category === 'bank').slice(0, 5);
    // M8 — the naira's mood today
    const scarcity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isScarcityDay"])(world.day);
    const atmLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["atmRemaining"])(chaos, world.day);
    const deposit = (amount)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        bankDeposit(amount);
    };
    const withdraw = (amount, channel = 'atm')=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        bankWithdraw(amount, channel);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetShell"], {
        label: "Lokoja Microfinance Bank",
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-3 px-1.5 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1d5c8a] text-[20px] text-white",
                        children: "🏦"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "lko-display truncate text-lg leading-tight",
                                children: "Lokoja Microfinance Bank"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                children: "“Save am safe — collect am anytime.”"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        "aria-label": "Close",
                        className: "lko-press flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 grid grid-cols-2 gap-2 px-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2.5 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70",
                                children: "Pocket cash"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display mt-0.5 text-[16px] leading-tight",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cash)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl bg-[var(--lko-green-soft)] px-3 py-2.5 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70",
                                children: "Bank balance"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display mt-0.5 text-[16px] leading-tight text-[var(--lko-green-deep)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(bankBalance)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            scarcity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "bank-scarcity",
                className: "mx-1.5 mt-3 rounded-xl bg-[#fdecea] px-3 py-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11.5px] font-extrabold text-[#8a2a20]",
                        children: "💸 Cash scarcity — the ATM dey pay small small"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[11px] font-semibold text-[#8a2a20]/80",
                        children: [
                            "ATM fit still pay ",
                            Number.isFinite(atmLeft) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(atmLeft) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].atmCap),
                            " today. The POS agent dey instant — ",
                            Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].posFeeRate * 100),
                            "% levy, no cap."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 px-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-label mb-1.5",
                        children: "Deposit"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-2",
                        children: [
                            QUICK_AMOUNTS.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AmountButton, {
                                    tone: "in",
                                    label: `₦${a / 1000}k`,
                                    disabled: cash < a,
                                    onClick: ()=>deposit(a)
                                }, a, false, {
                                    fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AmountButton, {
                                tone: "in",
                                label: "All",
                                disabled: cash <= 0,
                                onClick: ()=>deposit(Math.floor(cash))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2.5 px-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-label mb-1.5",
                        children: [
                            "Withdraw ",
                            scarcity ? '— choose your door' : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-2",
                        children: [
                            QUICK_AMOUNTS.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AmountButton, {
                                    tone: "out",
                                    label: `₦${a / 1000}k`,
                                    disabled: bankBalance < a,
                                    onClick: ()=>withdraw(a, 'atm')
                                }, a, false, {
                                    fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AmountButton, {
                                tone: "out",
                                label: "All · ATM",
                                disabled: bankBalance <= 0,
                                onClick: ()=>withdraw(bankBalance, 'atm')
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    scarcity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 grid grid-cols-4 gap-2",
                        children: [
                            QUICK_AMOUNTS.map((a)=>{
                                const fee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["posFeeFor"])(a);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `bank-pos-${a}`,
                                    disabled: bankBalance < a,
                                    onClick: ()=>withdraw(a, 'pos'),
                                    className: "lko-press flex min-h-[46px] flex-col items-center justify-center rounded-xl border border-[#1d5c8a]/40 bg-white px-1 text-[11px] font-extrabold text-[#1d5c8a] disabled:opacity-40",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "POS ₦",
                                                a / 1000,
                                                "k"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9.5px] font-bold opacity-70",
                                            children: [
                                                "−",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(fee),
                                                " levy"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                            lineNumber: 179,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, a, true, {
                                    fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                    lineNumber: 171,
                                    columnNumber: 17
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "bank-pos-all",
                                disabled: bankBalance <= 0,
                                onClick: ()=>withdraw(bankBalance, 'pos'),
                                className: "lko-press flex min-h-[46px] flex-col items-center justify-center rounded-xl border border-[#1d5c8a]/40 bg-white px-1 text-[11px] font-extrabold text-[#1d5c8a] disabled:opacity-40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "POS All"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9.5px] font-bold opacity-70",
                                        children: "instant · levy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3.5 px-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-label mb-1.5",
                        children: "Recent bank moves"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    bankTx.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-xl bg-black/[0.04] px-3 py-3 text-center text-[12px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "No bank moves yet — your first deposit starts the story."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "overflow-hidden rounded-xl bg-black/[0.04]",
                        children: bankTx.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: `flex items-center justify-between gap-2 px-3 py-2 ${i > 0 ? 'border-t border-black/[0.05]' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-[12.5px] font-bold",
                                                children: t.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    "Day ",
                                                    t.day
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `lko-num shrink-0 text-[12.5px] font-extrabold ${t.amount >= 0 ? 'text-[var(--lko-green)]' : 'text-red-600'}`,
                                        children: [
                                            t.amount >= 0 ? '+' : '',
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(t.amount)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, t.id, true, {
                                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                                lineNumber: 206,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "lko-press mx-1.5 mb-1 mt-3 flex min-h-[46px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]",
                children: "Step back from the counter"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/panels/BankPanel.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/panels/LoungeConfirm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoungeConfirm",
    ()=>LoungeConfirm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Lounge Confirm (Stage 5-b)
 * ----------------------------------------
 * The small confirm chip-sheet for a night out at Golden Nights Lounge.
 * The price comes from config (INTERIOR.NIGHT_OUT.cost) and the money
 * moves ONLY through `useGameStore.nightOut()` — it validates the
 * pocket, ledgers the spend and shows its own toast.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/kit.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function LoungeConfirm({ onClose }) {
    const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    const cost = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERIOR"].NIGHT_OUT.cost;
    const affordable = cash >= cost;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetShell"], {
        label: "Night out at Golden Nights",
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-3 px-1.5 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8a317] text-[20px] text-white",
                        children: "🍾"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "lko-display truncate text-lg leading-tight",
                                children: "Golden Nights Lounge"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                children: "“Small chops, loud music, sweet life.”"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        "aria-label": "Close",
                        className: "lko-press flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 px-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between rounded-xl bg-[var(--lko-gold-soft)] px-3.5 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[#8a5a00]",
                                children: "Night out — table + small chops"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-display text-[16px] text-[#8a5a00]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cost)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[11.5px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                        children: [
                            "One clock slot. Mood go rise well well — ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cost),
                            " leaves your pocket, and evenings slap sweeter than afternoons."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-1.5 mt-3 grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onClose();
                        },
                        className: "lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]",
                        children: "Not today"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().nightOut();
                            onClose();
                        },
                        disabled: !affordable,
                        className: "lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--lko-green)] text-[13px] font-extrabold text-white disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]",
                        children: affordable ? 'Enjoy the night' : 'Pocket no reach'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 px-1.5 pb-1 text-center text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: [
                    "Pocket: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num text-[var(--lko-ink)]",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cash)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/panels/LoungeConfirm.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/panels/CivicPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CivicPanel",
    ()=>CivicPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Civic Panel (M2)
 * ------------------------------
 * The service counter as a bottom sheet, opened from inside any of the four
 * GRA offices (KGIRS, NEPA, Police, EFCC). One component, four agencies —
 * because the queue is the same queue, only the stamp changes.
 *
 * Pure presentation over the store authority: every naira moves through
 * payNepa / payKgirs / fileEfccTip (they validate, ledger, notify, autosave).
 * The panel is only reachable INSIDE the government-area, so the in-person
 * (free) rules apply — the phone app carries the +fee variant.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/kit.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
/**
 * M8 — the grid's live status inside the NEPA office: which zone is dark,
 * how the community fix pool dey grow, and (in person, in the dark zone)
 * the contribution tiers. The store's contributeToPool carries every naira.
 */ function M8OutageCard() {
    const chaos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.chaos);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const contributeToPool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.contributeToPool);
    const outage = chaos.active;
    if (!outage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
            label: "Grid status",
            value: "HOLDING — every transformer intact",
            tone: "good"
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
            lineNumber: 35,
            columnNumber: 12
        }, this);
    }
    const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][outage.zoneId]?.name ?? outage.zoneId;
    const inZone = world.currentLocation === outage.zoneId;
    const contributedToday = outage.playerContribDays.includes(world.day);
    const need = Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget - outage.pool);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-testid": "civic-outage",
        className: "rounded-xl bg-[#2b1a16] px-3 py-2.5 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#ffb4a0]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "animate-pulse",
                        "aria-hidden": true,
                        children: "⚡"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    " Transformer down — ",
                    zoneName
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 text-[11px] font-semibold text-white/70",
                children: [
                    "Light don go since day ",
                    outage.startedDay,
                    ". Pool: ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(outage.pool),
                    " / ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget),
                    need > 0 ? ` — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(need)} more` : ' — technician dey come tomorrow.'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            inZone && !contributedToday && need > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1.5 flex gap-1.5",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTiers.map((tier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            contributeToPool(tier);
                        },
                        className: "lko-press flex-1 rounded-lg bg-[#ffd166] px-2 py-1.5 text-[10.5px] font-extrabold text-[#4a3200]",
                        children: [
                            "Drop ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(tier)
                        ]
                    }, tier, true, {
                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
const OFFICE_META = {
    'kgirs-office': {
        title: 'KGIRS Revenue Office',
        line: '“If you earn am, the state sabi am.”',
        icon: '🧮',
        tint: '#5C6E3A'
    },
    'nepa-office': {
        title: 'NEPA District Office',
        line: '“NEPA don bring light — bring money join am.”',
        icon: '💡',
        tint: '#b9821f'
    },
    'police-station': {
        title: 'GRA Police Station',
        line: '“The warrant desk na here — bail no dey free.”',
        icon: '🚨',
        tint: '#1f3a5c'
    },
    'efcc-office': {
        title: 'EFCC Zonal Command',
        line: '“Nobody dey above the law — whisper am to us.”',
        icon: '🕵️',
        tint: '#2e5c46'
    }
};
function Row({ label, value, tone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-2.5 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `lko-num text-[12px] font-extrabold ${tone === 'bad' ? 'text-red-600' : tone === 'good' ? 'text-[var(--lko-green)]' : 'text-[var(--lko-ink)]'}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
function ActionButton({ label, disabled, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: disabled,
        onClick: onClick,
        className: "lko-press flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--lko-green)] px-3 text-[13.5px] font-extrabold text-white disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]",
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
function CivicPanel({ office, onClose }) {
    const civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.civic);
    const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    const payNepa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.payNepa);
    const payKgirs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.payKgirs);
    const fileEfccTip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.fileEfccTip);
    const meta = OFFICE_META[office];
    if (!civic) return null;
    const act = (fn)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        fn();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$kit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SheetShell"], {
        label: meta.title,
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-3 px-1.5 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[20px] text-white",
                        style: {
                            background: meta.tint
                        },
                        children: meta.icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "lko-display truncate text-lg leading-tight",
                                children: meta.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]",
                                children: meta.line
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-[10.5px] font-extrabold",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cash)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-col gap-1.5",
                children: [
                    office === 'nepa-office' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Electricity bill owed",
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(civic.nepa.owed),
                                tone: civic.nepa.owed > 0 ? 'bad' : 'good'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            civic.nepa.shedding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Load-shedding",
                                value: "LIGHT CUT",
                                tone: "bad"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 172,
                                columnNumber: 37
                            }, this),
                            civic.nepa.shedding && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Reconnection fee",
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa.reconnectFee)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 173,
                                columnNumber: 37
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(M8OutageCard, {}, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Lifetime paid",
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(civic.nepa.totalPaid)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                label: civic.nepa.owed <= 0 && !civic.nepa.shedding ? 'Nothing to settle — meter dey smile' : `Settle NEPA — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nepaSettleCost"])(civic))}`,
                                disabled: civic.nepa.owed <= 0 && !civic.nepa.shedding,
                                onClick: ()=>act(()=>payNepa('office'))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-1 text-[10.5px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                                children: "Paying here costs exactly the bill — no online fee. Unpaid debt past three days puts your compound on load-shedding."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    office === 'kgirs-office' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Tax assessment due",
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(civic.kgirs.assessed),
                                tone: civic.kgirs.assessed > 0 ? 'bad' : 'good'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            civic.kgirs.warrant ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                        label: "STATUS",
                                        value: "WARRANT ACTIVE",
                                        tone: "bad"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "px-1 text-[10.5px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                                        children: "A warrant cannot clear here — walk to the police station next door, settle the fine, come back clean."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                        lineNumber: 197,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                label: civic.kgirs.assessed <= 0 ? 'No assessment dey wait' : `Pay assessment — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["kgirsSettleCost"])(civic))}`,
                                disabled: civic.kgirs.assessed <= 0,
                                onClick: ()=>act(()=>payKgirs('office'))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Assessments settled",
                                value: String(civic.kgirs.paid)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    office === 'police-station' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            civic.kgirs.warrant && civic.kgirs.assessed > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                        label: "KGIRS tax warrant",
                                        value: "ACTIVE",
                                        tone: "bad"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                        label: "Fine (25% on top)",
                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["kgirsSettleCost"])(civic)),
                                        tone: "bad"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                        lineNumber: 217,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                        label: `Clear warrant — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["kgirsSettleCost"])(civic))}`,
                                        onClick: ()=>act(()=>payKgirs('police'))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                        lineNumber: 218,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-lg bg-black/[0.03] px-2.5 py-3 text-center text-[11.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "Your name clean for the warrant book. Keep am so."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Outstanding fines",
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(civic.police.fines),
                                tone: civic.police.fines > 0 ? 'bad' : 'good'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Fines settled (life)",
                                value: String(civic.police.paid)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    office === 'efcc-office' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-lg bg-black/[0.03] px-2.5 py-2 text-[11px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                                children: [
                                    "Whistleblower programme: file a credible tip; when the commission recovers, you chop",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        className: "text-[var(--lko-green)]",
                                        children: "5%"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this),
                                    " of the recovery. One tip at a time — investigations take two days."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 232,
                                columnNumber: 13
                            }, this),
                            civic.efcc.pending.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                    label: `Under investigation — ${t.label}`,
                                    value: `day ${t.filedDay + 2}`
                                }, t.id, false, {
                                    fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                label: "File a tip",
                                onClick: ()=>act(()=>fileEfccTip())
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                label: "Rewards collected (life)",
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(civic.efcc.rewardsTotal),
                                tone: "good"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                                lineNumber: 240,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/panels/CivicPanel.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/GaragePanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GaragePanel",
    ()=>GaragePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Garage / Vehicle Shop (Stage 5-a + M24 W10-a)
 * -----------------------------------------------------------
 * The motor park bottom sheet: the showroom (buy through the ONE store
 * action, buyVehicle), your garage (Drive hands the request to the 3D
 * DriveSystem through controls.ts) and THE WHEELS' FACE (W10 — paint +
 * custom plate through the SAME laws the wire door runs; the street
 * sees your ride exactly as you paint it here). Presentation only —
 * prices, plates, affordability and the paint vocabulary live in
 * data/vehicles.ts + systems/wheels.ts + the store.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/systems/wheels.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
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
/** the swatch the paint key shows — the rigs' REAL tones (presentation
 *  mirror of world3d/vehicles.ts; the vocabulary itself is the law's) */ const PAINT_SWATCH = {
    '0': {
        label: 'Red',
        css: '#b33a2b'
    },
    '1': {
        label: 'Blue',
        css: '#2b62b3'
    },
    '2': {
        label: 'Green',
        css: '#2e7d5b'
    },
    '3': {
        label: 'Black',
        css: '#3d4043'
    },
    stock: {
        label: 'Stock',
        css: 'linear-gradient(135deg,#e3b53a,#3e8e5a)'
    },
    yellow: {
        label: 'Yellow',
        css: '#e3b53a'
    },
    white: {
        label: 'White',
        css: '#e8e8e8'
    },
    silver: {
        label: 'Silver',
        css: '#b8bcc2'
    },
    darkblue: {
        label: 'Navy',
        css: '#24466e'
    },
    maroon: {
        label: 'Maroon',
        css: '#6e2430'
    }
};
function GaragePanel({ onClose }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const buyVehicle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.buyVehicle);
    const sellVehicle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.sellVehicle);
    const setVehicleStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.setVehicleStyle);
    const cash = player.cash;
    const owned = player.vehicles;
    const drive = (model)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        onClose();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestEnterVehicle"])(model);
    };
    const buy = (model)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        buyVehicle(model); // store notifies + plays its own reward sound
    };
    const sell = (vehicleId)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        sellVehicle(vehicleId); // store notifies with the honest resale price
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2.5 px-5 pb-4 pt-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                children: "Buy your own ride, and Lokoja opens up. Your keke waits by the roadside near you — walk up and enter, or press Drive."
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex items-center justify-between rounded-lg bg-black/[0.04] px-3 py-2 text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoinsIcon"], {
                                size: 13,
                                className: "text-[var(--lko-gold-deep)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            " Pocket cash"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num text-[12.5px] font-extrabold text-[var(--lko-green)]",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(cash)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            owned.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-black/[0.06] bg-[var(--lko-green)]/[0.07] p-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-1.5 px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-green-deep)]",
                        children: "Your rides"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5",
                        children: owned.map((v)=>{
                            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][v.model];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lko-card flex items-center gap-2.5 p-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-[19px]",
                                        children: def.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-[13px] font-extrabold leading-tight",
                                                children: def.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                                lineNumber: 96,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-num block truncate text-[10.5px] font-bold text-[var(--lko-green)]",
                                                children: [
                                                    "OWNED · plate ",
                                                    v.plate,
                                                    " · sells for ",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resaleValue"])(v.model, v.boughtDay, world.day))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                                lineNumber: 97,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                        lineNumber: 95,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>drive(v.model),
                                        className: "lko-press flex h-10 shrink-0 items-center gap-1 rounded-xl bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold text-white",
                                        children: "Drive"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                        lineNumber: 101,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "garage-sell",
                                        onClick: ()=>sell(v.id),
                                        "aria-label": `Sell ${def.short} for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resaleValue"])(v.model, v.boughtDay, world.day))}`,
                                        className: "lko-press flex h-10 shrink-0 items-center rounded-xl border border-black/10 bg-black/[0.04] px-3 text-[12px] font-extrabold text-[var(--lko-ink-soft)]",
                                        children: "Sell"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                        lineNumber: 107,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, v.id, true, {
                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                lineNumber: 91,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    owned.map((v)=>{
                        const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][v.model];
                        const fuel = typeof v.fuel === 'number' ? v.fuel : 1;
                        const condition = typeof v.condition === 'number' ? v.condition : 1;
                        const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["repairQuote"])(v.model, condition);
                        const pct = (frac)=>`${Math.max(0, Math.min(100, Math.round(frac * 100)))}%`;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lko-card mt-1.5 p-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                    children: [
                                        def.short,
                                        " — the tank + the mechanic"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 128,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-10 text-[10px] font-black text-[var(--lko-ink-soft)]",
                                            children: "Fuel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2.5 flex-1 overflow-hidden rounded-full bg-black/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full rounded-full",
                                                style: {
                                                    width: pct(fuel),
                                                    background: fuel < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DRY_TANK"] ? '#ff5040' : 'var(--lko-green)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                                lineNumber: 134,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 133,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "lko-num w-9 text-right text-[10px] font-black",
                                            children: pct(fuel)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 139,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `garage-fuel-${v.model}`,
                                            onClick: async ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelRequestRefuel"])(v.model, 2000, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z);
                                                const notify = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify;
                                                if (r.ok) notify({
                                                    icon: '⛽',
                                                    text: '₦2,000 fuel enter tank — the ledger don record am.',
                                                    tone: 'good'
                                                });
                                                else {
                                                    const why = {
                                                        'no-pump': 'No pump here — the Motor Park holds the pumps.',
                                                        'tank-full': 'The tank don full.',
                                                        insufficient: 'Your wallet no carry am — fund am first.',
                                                        'minors-no-money': 'Minors no dey touch money.'
                                                    };
                                                    notify({
                                                        icon: '🚫',
                                                        text: why[r.why ?? ''] ?? 'The pump no gree.',
                                                        tone: 'bad'
                                                    });
                                                }
                                            },
                                            className: "lko-press flex h-8 shrink-0 items-center rounded-xl border border-[#7ee2a8]/50 bg-[#146b3a]/85 px-2.5 text-[10.5px] font-extrabold text-[#eafff2]",
                                            children: "⛽ ₦2,000"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 140,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 131,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1.5 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-10 text-[10px] font-black text-[var(--lko-ink-soft)]",
                                            children: "Body"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2.5 flex-1 overflow-hidden rounded-full bg-black/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full rounded-full",
                                                style: {
                                                    width: pct(condition),
                                                    background: condition < 0.3 ? '#ff5040' : '#e8a317'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "lko-num w-9 text-right text-[10px] font-black",
                                            children: pct(condition)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 170,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `garage-service-${v.model}`,
                                            disabled: condition >= 0.999,
                                            onClick: async ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wheelRequestRepair"])(v.model, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z);
                                                const notify = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify;
                                                if (r.ok) notify({
                                                    icon: '🔧',
                                                    text: 'Full service done — the ledger don record am.',
                                                    tone: 'good'
                                                });
                                                else {
                                                    const why = {
                                                        'no-garage': 'The mechanic dey the Motor Park.',
                                                        'no-need': 'The body still sound — no service needed.',
                                                        insufficient: 'Your wallet no carry am — fund am first.',
                                                        'minors-no-money': 'Minors no dey touch money.'
                                                    };
                                                    notify({
                                                        icon: '🚫',
                                                        text: why[r.why ?? ''] ?? 'The mechanic no gree.',
                                                        tone: 'bad'
                                                    });
                                                }
                                            },
                                            className: "lko-press flex h-8 shrink-0 items-center rounded-xl border border-[#ffd88a]/50 bg-[#e8a317]/90 px-2.5 text-[10.5px] font-extrabold text-[#3d2a00] disabled:opacity-40",
                                            children: [
                                                "🔧 ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(quote)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 171,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-[9px] font-bold leading-tight text-[var(--lko-ink-soft)]",
                                    children: [
                                        "Full service ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FULL_SERVICE"][v.model] ?? 0),
                                        " · the metres you drive wear the body — the ledger pays once."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 194,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, `${v.id}-meters`, true, {
                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, this);
                    }),
                    owned.map((v)=>{
                        const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][v.model];
                        const vocab = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PAINT_VOCAB"][v.model] ?? [];
                        const current = v.paint ?? vocab[0] ?? 'stock';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lko-card mt-1.5 p-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                    children: [
                                        def.short,
                                        " — the face the street sees"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 207,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-1.5",
                                    children: [
                                        vocab.map((p)=>{
                                            const sw = PAINT_SWATCH[p] ?? PAINT_SWATCH.stock;
                                            const on = current === p;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "data-testid": `paint-${v.model}-${p}`,
                                                "aria-label": `Paint ${def.short} ${sw.label}`,
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    setVehicleStyle(v.id, {
                                                        paint: p
                                                    });
                                                },
                                                className: `lko-press h-7 w-7 rounded-full border-2 ${on ? 'border-[var(--lko-green)] ring-2 ring-[var(--lko-green)]/30' : 'border-black/10'}`,
                                                style: {
                                                    background: sw.css
                                                }
                                            }, p, false, {
                                                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                                lineNumber: 215,
                                                columnNumber: 23
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-1 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                                            children: (PAINT_SWATCH[current] ?? PAINT_SWATCH.stock).label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 228,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 210,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            "data-testid": `plate-${v.model}`,
                                            defaultValue: v.plate,
                                            maxLength: 10,
                                            "aria-label": `Custom plate for ${def.short}`,
                                            onChange: (e)=>{
                                                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                                            },
                                            className: "lko-num h-8 w-32 rounded-lg border border-black/10 bg-black/[0.03] px-2 text-[11.5px] font-extrabold tracking-wider text-[var(--lko-ink)] outline-none focus:border-[var(--lko-green)]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 233,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `plate-save-${v.model}`,
                                            onClick: (e)=>{
                                                const input = e.currentTarget.previousElementSibling?.value ?? v.plate;
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                setVehicleStyle(v.id, {
                                                    plate: input
                                                });
                                            },
                                            className: "lko-press flex h-8 items-center rounded-lg bg-black/[0.05] px-3 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: "Set plate"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                            lineNumber: 243,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 232,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, `${v.id}-style`, true, {
                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                            lineNumber: 206,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                children: "Showroom"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLES"].map((def)=>{
                const mine = owned.find((v)=>v.model === def.model);
                const afford = cash >= def.price;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `lko-card flex items-center gap-3 p-3 ${mine ? 'opacity-90' : ''}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[21px]",
                            children: def.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                            lineNumber: 270,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-[13.5px] font-extrabold leading-tight",
                                    children: def.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                    children: def.description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 275,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "lko-num mt-0.5 block text-[11.5px] font-extrabold text-[var(--lko-green-deep)]",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(def.price)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this),
                        mine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-8 shrink-0 items-center gap-1 rounded-full bg-[var(--lko-green)]/15 px-2.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                                    lineNumber: 284,
                                    columnNumber: 17
                                }, this),
                                " OWNED"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                            lineNumber: 283,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            disabled: !afford,
                            onClick: ()=>buy(def.model),
                            className: "lko-press flex h-10 shrink-0 items-center rounded-xl bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold text-white disabled:cursor-not-allowed disabled:bg-black/15",
                            children: afford ? 'Buy' : 'Save up'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                            lineNumber: 287,
                            columnNumber: 15
                        }, this)
                    ]
                }, def.model, true, {
                    fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                    lineNumber: 269,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                children: "One ride per model. Your rides run on FUEL on the map — no fare. Driving sip small energy — no be trekking."
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "lko-press mt-0.5 flex min-h-[44px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]",
                children: "Close"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/GaragePanel.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/GaragePanel.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/PerfChip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PerfChip",
    ()=>PerfChip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — PerfChip (M4: real-device FPS capture)
 * -----------------------------------------------------
 * A tiny live fps pill in the HUD's top-right column. Tap it and it
 * opens the diagnostics panel: live fps + p95 frame time, draw calls,
 * triangles, GPU name — and two honest buttons: CAPTURE (samples a
 * fresh 5-second window) and COPY REPORT (clipboard, with an execCommand
 * fallback for locked-down WebViews). The report is what a player on a
 * real phone sends back — the SwiftShader harness can never lie for them.
 *
 * Cost law: the chip re-renders 2×/s from the probe ring buffer — never
 * per frame, never through the store.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/perfProbe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function PerfChip() {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [report, setReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [capturing, setCapturing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        mounted.current = true;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startProbe"])();
        const id = setInterval(()=>{
            const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readFrameStats"])();
            if (mounted.current) setStats(s ? {
                fps: s.fps,
                p95ms: s.p95ms
            } : null);
        }, 500);
        return ()=>{
            mounted.current = false;
            clearInterval(id);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopProbe"])();
        };
    }, []);
    const copy = async (text)=>{
        let ok = false;
        try {
            await navigator.clipboard.writeText(text);
            ok = true;
        } catch  {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                ok = document.execCommand('copy');
                document.body.removeChild(ta);
            } catch  {
                ok = false;
            }
        }
        if (mounted.current) {
            setCopied(ok);
            setTimeout(()=>mounted.current && setCopied(false), 2200);
        }
    };
    const capture = async ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        setCapturing(true);
        setReport(null);
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleFor"])(5000, 'manual capture 5s');
        if (!mounted.current) return;
        setReport(r);
        setCapturing(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('chime');
    };
    const tone = stats == null ? 'text-white/80' : stats.fps >= 50 ? 'text-[#7dffa8]' : stats.fps >= 28 ? 'text-[#ffd88a]' : 'text-[#ff9a7d]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-auto flex flex-col items-end gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "data-testid": "perf-chip",
                onClick: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                    setOpen((o)=>!o);
                },
                "aria-label": "Performance diagnostics",
                className: "lko-press flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10.5px] font-extrabold backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `lko-num ${tone}`,
                    children: stats ? `${Math.round(stats.fps)} fps` : '— fps'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/PerfChip.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "perf-panel",
                className: "w-[228px] rounded-2xl border border-white/15 bg-black/70 p-3 text-white backdrop-blur-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-extrabold uppercase tracking-wide text-[#ffd88a]",
                        children: "Real-device diagnostics"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/PerfChip.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 space-y-0.5 text-[10.5px] font-semibold leading-snug text-white/85",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-num",
                                children: [
                                    "fps ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        className: tone,
                                        children: stats ? stats.fps.toFixed(1) : '…'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/PerfChip.tsx",
                                        lineNumber: 119,
                                        columnNumber: 19
                                    }, this),
                                    stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            ' ',
                                            "· p95 ",
                                            stats.p95ms.toFixed(0),
                                            "ms"
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "opacity-80",
                                children: "Numbers are sampled live on THIS device."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this),
                            report && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                "data-testid": "perf-report",
                                className: "mt-1.5 max-h-28 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white/10 p-1.5 text-[9px] leading-snug",
                                children: report
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/PerfChip.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: capturing,
                                onClick: capture,
                                className: "lko-press h-8 flex-1 rounded-lg bg-[var(--lko-green)] text-[10.5px] font-extrabold text-white disabled:opacity-60",
                                children: capturing ? 'Sampling…' : 'Capture 5s'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: !report,
                                onClick: ()=>report && copy(report),
                                className: "lko-press h-8 flex-1 rounded-lg bg-white/15 text-[10.5px] font-extrabold text-white disabled:opacity-40",
                                children: copied ? 'Copied ✓' : 'Copy report'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/PerfChip.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            setOpen(false);
                        },
                        className: "mt-1.5 w-full text-center text-[9.5px] font-bold uppercase tracking-wide text-white/60",
                        children: "close"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/PerfChip.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/world/PerfChip.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/PerfChip.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/WardrobePanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WardrobePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Wardrobe (Stage 5)
 * --------------------------------
 * Self-contained, mobile-first bottom sheet for the player's look:
 * skin tone, hair colour + hairstyle, outfit style + colour — with a
 * live 2D preview from the original SVG Avatar.
 *
 * Wiring contract (INTEGRATOR):
 *   - listens to `useWardrobeBus` (agent 5-b's interior hotspot calls
 *     `useWardrobeBus.getState().show()`; nothing else needed).
 *   - Mount ONCE anywhere above the world, e.g. in WorldTab:
 *       import WardrobePanel from './WardrobePanel'
 *       <WardrobePanel />
 *   - "Wear it" commits through useGameStore.setAvatar — no direct
 *     player-state mutation happens here, no economy logic either.
 *
 * House style: the same frosted-glass language the HUD uses over the 3D
 * world (lko-sheet slide, backdrop blur, 44px+ touch targets).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/Avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/ui/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$wardrobe$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/wardrobe-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-ssr] (ecmascript)");
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
/* ------------------------------ small controls ------------------------------ */ function Swatch({ color, active, label, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
            onSelect();
        },
        "aria-label": label,
        "aria-pressed": active,
        className: `lko-press h-11 w-11 shrink-0 rounded-full border-2 transition-shadow ${active ? 'border-[var(--lko-green)] shadow-[0_0_0_3px_var(--lko-green-soft)]' : 'border-black/15'}`,
        style: {
            background: color
        }
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
function StyleChip({ active, label, hint, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
            onSelect();
        },
        "aria-pressed": active,
        title: hint,
        className: `lko-press flex min-h-[44px] shrink-0 flex-col items-start justify-center rounded-xl border px-3.5 py-1.5 text-left ${active ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink)]'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[13px] font-extrabold leading-tight",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "max-w-[15rem] truncate text-[10.5px] font-semibold opacity-70",
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
function Section({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": label,
        className: "mt-4 first:mt-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-scroll-x flex gap-2 overflow-x-auto pb-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
function WardrobePanel() {
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$wardrobe$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWardrobeBus"])((s)=>s.open);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    if (!open || !player) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WardrobeSheet, {
        player: player
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
        lineNumber: 126,
        columnNumber: 10
    }, this);
}
function WardrobeSheet({ player }) {
    const hide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$wardrobe$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWardrobeBus"])((s)=>s.hide);
    // draft look — re-seeded from the real save each time the sheet opens
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>({
            ...player.avatar
        }));
    // M19 — the two tabs: the free look + the Bend-Down Select premium rail
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('look');
    const wardrobe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.wardrobe);
    const playerCash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player?.cash ?? 0);
    // Escape closes (desktop nicety, matches every other sheet — the sheet
    // only exists while the bus says open, so no gate needed here)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKey = (e)=>{
            if (e.key === 'Escape') hide();
        };
        window.addEventListener('keydown', onKey);
        return ()=>window.removeEventListener('keydown', onKey);
    }, [
        hide
    ]);
    const patch = (p)=>setDraft((d)=>({
                ...d,
                ...p
            }));
    const gender = player.gender;
    const styleLabel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].find((s)=>s.key === draft.clothingStyle)?.label ?? 'Custom';
    const wear = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().setAvatar({
            ...draft
        });
        hide();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50",
        role: "dialog",
        "aria-label": "Wardrobe",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Close wardrobe",
                onClick: hide,
                className: "lko-scrim absolute inset-0 bg-[rgba(14,20,15,0.42)] backdrop-blur-[2px]"
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-pop absolute inset-x-0 bottom-0 mx-auto w-full max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-sheet max-h-[84dvh] overflow-y-auto rounded-t-3xl border-t border-black/[0.08] bg-[var(--lko-surface)]/95 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] shadow-[var(--lko-shadow-lg)] backdrop-blur-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-0 z-10 rounded-t-3xl bg-[var(--lko-surface)]/95 px-4 pb-2 pt-2.5 backdrop-blur-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto mb-2.5 h-1 w-10 rounded-full bg-black/15",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "lko-display text-lg text-[var(--lko-green-deep)]",
                                                    children: "Wardrobe"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                                    children: tab === 'look' ? 'Fresh look — who dey show today?' : 'Bend-Down Select — walks + premium cloth'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: hide,
                                            "aria-label": "Close",
                                            className: "lko-press flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink)]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$ui$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "close",
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex gap-1.5",
                                    children: [
                                        'look',
                                        'shop'
                                    ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "data-testid": `wardrobe-tab-${t}`,
                                            onClick: ()=>{
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                setTab(t);
                                            },
                                            "aria-pressed": tab === t,
                                            className: `lko-press flex-1 rounded-lg py-1.5 text-[11px] font-extrabold uppercase tracking-wide ${tab === t ? 'bg-[var(--lko-green)] text-white' : 'border border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink-soft)]'}`,
                                            children: t === 'look' ? '🪞 Look' : '🛍️ Shop'
                                        }, t, false, {
                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                            lineNumber: 192,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4",
                            children: tab === 'shop' ? /* ---------------- M19 — THE BEND-DOWN SELECT SHOP ---------------- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "data-testid": "wardrobe-shop",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 rounded-lg bg-[var(--lko-gold-soft,#faf3df)] px-3 py-2 text-[11px] font-semibold leading-snug text-[#6b4e12]",
                                        children: [
                                            "Walks change how you MOVE — the 3D rig obeys. Premium cloth na real cloth: your 3D self wears it the moment you step out. Wallet: ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(playerCash),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Walk styles",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full space-y-2",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_STYLES"].map((w)=>{
                                                const owned = w.key === 'street' || wardrobe.ownedWalks.includes(w.key);
                                                const active = wardrobe.activeWalk === w.key;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "lko-card flex items-center justify-between gap-3 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[12px] font-extrabold",
                                                                    children: w.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                                                    children: w.blurb
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                                    lineNumber: 225,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 223,
                                                            columnNumber: 27
                                                        }, this),
                                                        active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            "data-testid": `walk-${w.key}`,
                                                            className: "shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                                            children: "WALKING"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 228,
                                                            columnNumber: 29
                                                        }, this) : owned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "data-testid": `walk-${w.key}`,
                                                            onClick: ()=>{
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().wardrobeEquipWalk(w.key);
                                                            },
                                                            className: "lko-press shrink-0 rounded-full bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white",
                                                            children: "Walk it"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "data-testid": `walk-${w.key}`,
                                                            onClick: ()=>{
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().wardrobeBuy('walk', w.key);
                                                            },
                                                            className: "lko-press shrink-0 rounded-full bg-[var(--lko-gold)] px-3 py-1.5 text-[10px] font-extrabold text-[#33230a]",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(w.price)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, w.key, true, {
                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Premium outfits",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full space-y-2",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PREMIUM_OUTFITS"].map((o)=>{
                                                const owned = wardrobe.ownedStyles.includes(o.key);
                                                const worn = draft.clothingStyle === o.key;
                                                const buyable = o.price > 0;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "lko-card flex items-center justify-between gap-3 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[12px] font-extrabold",
                                                                    children: o.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                                    lineNumber: 262,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                                                    children: o.blurb
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                                    lineNumber: 263,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 27
                                                        }, this),
                                                        owned ? worn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            "data-testid": `outfit-${o.key}`,
                                                            className: "shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                                            children: "ON YOU"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 267,
                                                            columnNumber: 31
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "data-testid": `outfit-${o.key}`,
                                                            onClick: ()=>{
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                                patch({
                                                                    clothingStyle: o.key
                                                                });
                                                                setTab('look');
                                                            },
                                                            className: "lko-press shrink-0 rounded-full bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white",
                                                            children: "Wear it"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 31
                                                        }, this) : buyable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "data-testid": `outfit-${o.key}`,
                                                            onClick: ()=>{
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().wardrobeBuy('outfit', o.key);
                                                            },
                                                            className: "lko-press shrink-0 rounded-full bg-[var(--lko-gold)] px-3 py-1.5 text-[10px] font-extrabold text-[#33230a]",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(o.price)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 279,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "shrink-0 rounded-full border border-[var(--lko-line)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                                            children: "EARN IT"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, o.key, true, {
                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 253,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this) : /* ------------------------- the free LOOK tab ------------------------ */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "lko-card shrink-0 p-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                                                    config: draft,
                                                    gender: gender,
                                                    className: "h-32 w-32"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                    lineNumber: 302,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 301,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "lko-display truncate text-base text-[var(--lko-ink)]",
                                                        children: player?.name ?? 'You'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-0.5 text-[12px] font-bold text-[var(--lko-gold-deep)]",
                                                        children: styleLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                                        children: "Preview shows the 2D portrait — your 3D self wears the same cloth the moment you step out."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 304,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Skin tone",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIN_TONES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Swatch, {
                                                color: s.value,
                                                label: s.label,
                                                active: draft.skinTone === s.value,
                                                onSelect: ()=>patch({
                                                        skinTone: s.value
                                                    })
                                            }, s.key, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 319,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 317,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Hair colour",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HAIR_COLORS"].map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Swatch, {
                                                color: h.value,
                                                label: h.label,
                                                active: draft.hairColor === h.value,
                                                onSelect: ()=>patch({
                                                        hairColor: h.value
                                                    })
                                            }, h.key, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 332,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Hairstyle",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATAR_HAIRSTYLES"].map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleChip, {
                                                label: h.label,
                                                hint: h.gender === 'all' ? 'Unisex' : h.gender === 'male' ? 'Male' : 'Female',
                                                active: draft.hairstyle === h.key,
                                                onSelect: ()=>patch({
                                                        hairstyle: h.key
                                                    })
                                            }, h.key, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 344,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Outfit style",
                                        children: [
                                            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].map((s)=>({
                                                    key: s.key,
                                                    label: s.label,
                                                    hint: s.description
                                                })),
                                            // M19 — owned premium outfits join the rail (wear what you own)
                                            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PREMIUM_OUTFITS"].filter((o)=>wardrobe.ownedStyles.includes(o.key)).map((o)=>({
                                                    key: o.key,
                                                    label: o.label,
                                                    hint: o.blurb
                                                }))
                                        ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleChip, {
                                                label: s.label,
                                                hint: s.hint,
                                                active: draft.clothingStyle === s.key,
                                                onSelect: ()=>patch({
                                                        clothingStyle: s.key
                                                    })
                                            }, s.key, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 361,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        label: "Outfit colour",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLOTHING_COLORS"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Swatch, {
                                                color: c.value,
                                                label: c.label,
                                                active: draft.clothingColor === c.value,
                                                onSelect: ()=>patch({
                                                        clothingColor: c.value
                                                    })
                                            }, c.key, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 373,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5 flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    hide();
                                                },
                                                className: "lko-press min-h-[46px] flex-1 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-surface)] text-sm font-bold text-[var(--lko-ink)]",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 385,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: wear,
                                                className: "lko-press min-h-[46px] flex-[1.4] rounded-xl bg-[var(--lko-green)] text-sm font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(16,101,61,0.65)]",
                                                children: "Wear it"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                                lineNumber: 395,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                                        lineNumber: 384,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/world/WardrobePanel.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/world/WorldTab.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldTab",
    ()=>WorldTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — World Tab (Stage 3D + INC 4)
 * -------------------------------------------
 * The container that mounts the 3D world: WebGL capability detection,
 * a first-frame loading veil, an error boundary so a failed 3D scene
 * can NEVER take the working 2D game down, and the HUD wiring between
 * the canvas and the store-driven sheets.
 *
 * INC 4 — interiors: the tab owns the exterior ⇄ interior swap with a
 * short fade. Interior state is presentation-only (never in the save);
 * leaving the world always returns you outside.
 *
 * Fallback contract: if the world can't start, the player gets a clear
 * explanation plus working buttons into the Map/Home tabs — the game
 * remains 100% usable without WebGL.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ambience$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/ambience.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$interiors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/interiors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)"); // W10-b/W10-c — the boarding + tank seams the witness reads
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/music.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/extras.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/patti.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$perfProbe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/perfProbe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$WorldScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/WorldScene.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$InteriorScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/InteriorScene.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HudOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/HudOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$WardrobePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/WardrobePanel.tsx [app-ssr] (ecmascript)");
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
/** M19 E2E — an honest snapshot of the extras-first state */ function extrasLevelSnapshot() {
    return {
        level: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].level,
        tier: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$extras$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasLive"].tier
    };
}
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
/* ------------------------------ capability check ------------------------------ */ function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch  {
        return false;
    }
}
/* -------------------------------- error boundary ------------------------------- */ class WorldErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            failed: false
        };
    }
    static getDerivedStateFromError() {
        return {
            failed: true
        };
    }
    componentDidCatch() {
        this.props.onFail();
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}
/* --------------------------------- fallback UI --------------------------------- */ function WorldFallback({ onExit }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-[#1d2a48] to-[#0e1524] p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "lko-card w-full max-w-sm p-6 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--lko-river-soft)] text-[var(--lko-river)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapIcon"], {
                        size: 26
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/world/WorldTab.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "lko-display text-xl",
                    children: "The 3D world can't open here"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]",
                    children: "This device or browser couldn't start WebGL, which powers the 3D Lokoja. Nothing is lost — the whole game continues on the classic map."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                        onExit();
                    },
                    className: "lko-press mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--lko-green)] text-sm font-extrabold text-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapIcon"], {
                            size: 17
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldTab.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        "Continue on the Map"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/world/WorldTab.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTab.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
function WorldTab({ onExit, onOpenWork, onOpenMap }) {
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const soundOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settings.sound);
    const [canWebGL, setCanWebGL] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>typeof document === 'undefined' ? null : webglAvailable());
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /** M7 — the GPU context was evicted (phone memory pressure); the scene rebuilds itself */ const [glLost, setGlLost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nearest, setNearest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [district, setDistrict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gistNpc, setGistNpc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // INC 4 — interior mode (presentation-only state, never in the save)
    const [interiorId, setInteriorId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hotspot, setHotspot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fade, setFade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const timers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const handleReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setReady(true), []);
    const handleFail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setFailed(true), []);
    const handleAnchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>setNearest(id), []);
    const handleDistrict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>setDistrict(id), []);
    const handleGist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>setGistNpc(id), []);
    const handleHotspot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>setHotspot(id), []);
    const handleGlLost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setGlLost(true), []);
    const handleGlBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setGlLost(false), []);
    // fade out → swap scene → fade back in
    const swapTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setFade(true);
        setNearest(null);
        setHotspot(null);
        timers.current.push(setTimeout(()=>{
            setInteriorId(id);
            setReady(false);
        }, 240));
        timers.current.push(setTimeout(()=>setFade(false), 620));
    }, []);
    const enterInterior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$interiors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERIOR_BY_ID"][id] || interiorId) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('chime');
        swapTo(id);
    }, [
        interiorId,
        swapTo
    ]);
    // E2E TEST HOOK — active ONLY when the URL carries ?e2e=1. Gives the
    // automated browser a honest steering wheel (travel / position / stick /
    // door list) because driving a follow-cam world blind with synthetic
    // keystrokes is impractical. Normal play never touches this.
    // The api lives in a ref that refreshes EVERY render, so a hook captured
    // earlier always reaches the live closure even across scene swaps.
    const e2eApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        enter: (_id)=>{},
        scene: ()=>'world',
        interior: ()=>null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        e2eApi.current.enter = (id)=>enterInterior(id);
        e2eApi.current.scene = ()=>interiorId ? 'interior' : 'world';
        e2eApi.current.interior = ()=>interiorId;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        enterInterior,
        interiorId
    ]);
    const exitInterior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!interiorId) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        swapTo(null);
    }, [
        interiorId,
        swapTo
    ]);
    // clear any pending swap timers on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = timers.current;
        return ()=>t.forEach(clearTimeout);
    }, []);
    // procedural ambience — starts with the world, follows the sound setting
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ambience$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ambience"].setEnabled(soundOn);
        if (soundOn) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ambience$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ambience"].start();
        return ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ambience$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ambience"].stop();
    }, [
        soundOn
    ]);
    // M19 — the afro-fusion soundtrack: starts with the world, follows
    // sound × music, and the mood answers the in-world clock. The engine
    // handles mood changes itself (crossfade on the same context).
    const musicOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settings.sound && s.settings.music);
    const tod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world?.timeOfDay);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].setEnabled(musicOn);
        if (musicOn) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].start((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moodForTimeOfDay"])(tod ?? 'morning'));
        else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].stop();
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].stop();
        };
    }, [
        musicOn
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (musicOn && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].isStarted()) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].setMood((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moodForTimeOfDay"])(tod ?? 'morning'));
    }, [
        tod,
        musicOn
    ]);
    // M19 — THE HILL'S WHISPER: a 2Hz poll for undiscovered Patti secrets
    // (rides the same cadence as the ambience blend — one cheap distance math
    // per tick, zero React churn unless a secret actually lands)
    const checkPatti = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.checkPatti);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const id = setInterval(()=>{
            if (document.hidden) return;
            checkPatti(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].x, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playerPos"].z);
        }, 2000);
        return ()=>clearInterval(id);
    }, [
        checkPatti
    ]);
    // settle walking energy no matter HOW the world closes (Exit path resets to
    // zero first, so this only ever catches abnormal unmounts — 0 m is a no-op)
    const settleWalk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.settleWorldWalk);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            settleWalk((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWalkedMeters"])());
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetWalkedMeters"])();
        };
    }, [
        settleWalk
    ]);
    // keep the "leave world" action reliable even if the scene died
    const exit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
        onExit();
    }, [
        onExit
    ]);
    const interiorDef = interiorId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$interiors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERIOR_BY_ID"][interiorId] ?? null : null;
    const scene = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (canWebGL !== true || failed) return null;
        if (interiorDef) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$InteriorScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InteriorScene"], {
                def: interiorDef,
                avatar: player.avatar,
                timeOfDay: world.timeOfDay,
                onReady: handleReady,
                onHotspot: handleHotspot
            }, void 0, false, {
                fileName: "[project]/src/components/game/world/WorldTab.tsx",
                lineNumber: 466,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$WorldScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorldScene"], {
            avatar: player.avatar,
            currentLocationId: world.currentLocation,
            timeOfDay: world.timeOfDay,
            weather: world.weather,
            onReady: handleReady,
            onNearestAnchor: handleAnchor,
            onDistrict: handleDistrict,
            onGist: handleGist,
            onContextLost: handleGlLost,
            onContextRestored: handleGlBack
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/WorldTab.tsx",
            lineNumber: 476,
            columnNumber: 7
        }, this);
    }, [
        canWebGL,
        failed,
        interiorDef,
        player.avatar,
        world.currentLocation,
        world.timeOfDay,
        world.weather,
        handleReady,
        handleAnchor,
        handleDistrict,
        handleGist,
        handleHotspot,
        handleGlLost,
        handleGlBack
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-30 bg-[#0e1524]",
        "aria-label": "3D Lokoja world",
        children: canWebGL === false || failed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorldFallback, {
            onExit: onExit
        }, void 0, false, {
            fileName: "[project]/src/components/game/world/WorldTab.tsx",
            lineNumber: 498,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorldErrorBoundary, {
                    onFail: handleFail,
                    children: scene
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 501,
                    columnNumber: 11
                }, this),
                !ready && !fade && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#f6d489] via-[#e8a355] to-[#1c6b5e]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lko-float flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--lko-surface)] shadow-[var(--lko-shadow-lg)]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PinIcon"], {
                                size: 26,
                                className: "text-[var(--lko-green)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/WorldTab.tsx",
                                lineNumber: 507,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldTab.tsx",
                            lineNumber: 506,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lko-display text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
                            children: interiorId ? 'Stepping inside…' : 'Entering Lokoja…'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldTab.tsx",
                            lineNumber: 509,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[12px] font-semibold text-white/85",
                            children: interiorId ? 'Opening the door' : 'Building the confluence, Mount Patti and your streets'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/world/WorldTab.tsx",
                            lineNumber: 512,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 505,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `pointer-events-none absolute inset-0 z-20 bg-[#100e0a] transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`,
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 519,
                    columnNumber: 11
                }, this),
                glLost && ready && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pointer-events-none absolute left-1/2 top-[calc(env(safe-area-inset-top)+14px)] z-30 -translate-x-1/2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 rounded-full bg-black/62 px-4 py-2 text-[12px] font-bold text-white backdrop-blur-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                className: "h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/world/WorldTab.tsx",
                                lineNumber: 530,
                                columnNumber: 17
                            }, this),
                            "Screen rebuild — recovering…"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/world/WorldTab.tsx",
                        lineNumber: 529,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 528,
                    columnNumber: 13
                }, this),
                ready && !failed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$HudOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HudOverlay"], {
                    nearestAnchor: interiorId ? null : nearest,
                    district: district,
                    gistNpc: gistNpc,
                    interior: interiorDef,
                    hotspot: hotspot,
                    onExit: exit,
                    onOpenWork: onOpenWork,
                    onOpenMap: onOpenMap,
                    onEnterInterior: enterInterior,
                    onExitInterior: exitInterior
                }, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 538,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$WardrobePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/game/world/WorldTab.tsx",
                    lineNumber: 553,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/components/game/world/WorldTab.tsx",
        lineNumber: 495,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_game_world_18d36f3e._.js.map