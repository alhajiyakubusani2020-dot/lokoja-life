(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/game/workers/nation.worker.ts (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/nation.worker.9a20a346.ts");}),
"[project]/src/game/workers/nation.worker.ts [app-client] (ecmascript, worker loader)", ((__turbopack_context__) => {

__turbopack_context__.v(__turbopack_context__.b([
  "static/chunks/src_game_5bc749c1._.js",
  "static/chunks/src_game_workers_nation_worker_ts_b3f8fcd6._.js",
  "static/chunks/turbopack-src_game_workers_nation_worker_ts_1ab33372._.js"
]));
}),
"[project]/src/game/data/avatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/vehicles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Vehicle Catalog (Stage 5)
 * ----------------------------------------
 * What you can own and drive in the 3D world. Prices are calibrated to
 * the existing hustle/job economy (₦350–₦800 per hustle, jobs a few
 * thousand a shift) — an okada is a real mid-game goal, a danfo is a
 * late-game flex. All presentation (meshes, speed feel, sounds) lives
 * in the 3D layer; this file is pure data + purchase authority.
 */ __turbopack_context__.s([
    "VEHICLES",
    ()=>VEHICLES,
    "VEHICLE_BY_MODEL",
    ()=>VEHICLE_BY_MODEL,
    "generatePlate",
    ()=>generatePlate
]);
const VEHICLES = [
    {
        model: 'okada',
        label: 'Okada (Motorcycle)',
        short: 'Okada',
        emoji: '🏍️',
        price: 85_000,
        description: 'The people\'s engine. Slip through traffic, own the back streets.',
        topSpeed: 9.5,
        accel: 6.5,
        handling: 1.25
    },
    {
        model: 'keke',
        label: 'Keke Napep (Tricycle)',
        short: 'Keke',
        emoji: '🛺',
        price: 180_000,
        description: 'Yellow-and-green hustle. Steady, honest, everywhere welcome.',
        topSpeed: 7.5,
        accel: 4.2,
        handling: 1.0
    },
    {
        model: 'taxi',
        label: 'Taxi (Saloon Car)',
        short: 'Taxi',
        emoji: '🚕',
        price: 420_000,
        description: 'Four doors and a meter. Respect arrives before you do.',
        topSpeed: 11,
        accel: 5.0,
        handling: 0.9
    },
    {
        model: 'danfo',
        label: 'Danfo (Minibus)',
        short: 'Danfo',
        emoji: '🚐',
        price: 750_000,
        description: 'A moving enterprise. When you buy this one, Lokoja knows your name.',
        topSpeed: 9,
        accel: 3.4,
        handling: 0.72
    }
];
const VEHICLE_BY_MODEL = Object.fromEntries(_c1 = VEHICLES.map(_c = (v)=>[
        v.model,
        v
    ]));
_c2 = VEHICLE_BY_MODEL;
function generatePlate(model, day, index) {
    void model;
    void day;
    void index;
    const letters = 'ABCDEFGHJKLMN';
    const l1 = letters[Math.floor(Math.random() * letters.length)];
    const l2 = letters[Math.floor(Math.random() * letters.length)];
    const digits = 100 + Math.floor(Math.random() * 900);
    return `LKO-${digits}-${l1}${l2}`;
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "VEHICLE_BY_MODEL$Object.fromEntries$VEHICLES.map");
__turbopack_context__.k.register(_c1, "VEHICLE_BY_MODEL$Object.fromEntries");
__turbopack_context__.k.register(_c2, "VEHICLE_BY_MODEL");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/travelEvents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Travel Events
 * ----------------------------
 * Small flavour occurrences that can roll during any completed trip
 * (Stage 2). This is the seed of the reusable event framework — Stage 3's
 * hustle/opportunity system and Stage 5's gist system will extend this
 * same shape with their own catalogues.
 *
 * Rules:
 *  - effects are small and configured here, never hard-coded in UI
 *  - `requiresWeather` / `requiresTransport` gate eligibility
 *  - `weight` drives the weighted random pick
 */ __turbopack_context__.s([
    "TRAVEL_EVENTS",
    ()=>TRAVEL_EVENTS
]);
const TRAVEL_EVENTS = [
    {
        id: 'rain-delay',
        icon: '🌧️',
        title: 'Rain on the road',
        description: 'Rain started while you were travelling. You sheltered small before continuing.',
        tone: 'bad',
        weight: 3,
        requiresWeather: [
            'rain'
        ],
        extraMinutes: 10,
        energyDelta: -2
    },
    {
        id: 'traffic',
        icon: '🚗',
        title: 'Go-slow',
        description: 'Traffic slowed your journey near the junction. Lokoja go-slow is not Lagos own — but it still bites.',
        tone: 'bad',
        weight: 3,
        extraMinutes: 8,
        moodDelta: -2
    },
    {
        id: 'keke-stop',
        icon: '🛺',
        title: 'Keke refuel stop',
        description: 'The keke driver stopped to buy fuel mid-road. You waited, legs pressed against the rail.',
        tone: 'neutral',
        weight: 2,
        requiresTransport: [
            'keke'
        ],
        extraMinutes: 6
    },
    {
        id: 'quick-tip',
        icon: '🙌',
        title: 'Quick help, quick tip',
        description: 'Someone nearby needed help with a heavy load. You assisted small — and they gave you a tip.',
        tone: 'good',
        weight: 2,
        extraMinutes: 5,
        cashDelta: 250,
        xpDelta: 8,
        moodDelta: 3
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/jobs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Jobs data (Stage 3 consumes this)
 * ------------------------------------------------
 * Ten launch jobs, fully data-driven per the design doc.
 * Requirements are checked by the job system; rewards are tuned here.
 * Reputation requirements gate the "prestige" jobs.
 */ __turbopack_context__.s([
    "JOBS",
    ()=>JOBS,
    "JOB_BY_ID",
    ()=>JOB_BY_ID
]);
const JOBS = [
    {
        id: 'market-worker',
        name: 'Market Worker',
        description: 'Help traders carry goods and watch stalls at Kpata Market.',
        emoji: '🛒',
        locationId: 'kpata-market',
        unlockLevel: 1,
        energyCost: 18,
        timeSlots: 1,
        basePay: 900,
        xpReward: 20,
        skillTraining: {
            skill: 'hustle',
            xp: 10
        },
        reputationReward: 2,
        requirements: {}
    },
    {
        id: 'delivery-worker',
        name: 'Delivery Worker',
        description: 'Run packages across town on foot, keke or bike.',
        emoji: '📦',
        locationId: 'ganaja-junction',
        unlockLevel: 1,
        energyCost: 22,
        timeSlots: 1,
        basePay: 1100,
        xpReward: 24,
        skillTraining: {
            skill: 'hustle',
            xp: 12
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'driver',
        name: 'Driver',
        description: 'Drive a taxi or private car for people who pay better than you sweat.',
        emoji: '🚕',
        locationId: 'transport-area',
        unlockLevel: 2,
        energyCost: 20,
        timeSlots: 2,
        basePay: 1600,
        xpReward: 30,
        skillTraining: {
            skill: 'social',
            xp: 8
        },
        reputationReward: 4,
        requirements: {
            minSkills: {
                hustle: 2
            }
        }
    },
    {
        id: 'fisherman',
        name: 'Fisherman',
        description: 'Cast your nets where the Niger meets the Benue.',
        emoji: '🎣',
        locationId: 'confluence',
        unlockLevel: 2,
        energyCost: 25,
        timeSlots: 2,
        basePay: 1400,
        xpReward: 28,
        skillTraining: {
            skill: 'hustle',
            xp: 12
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'photographer',
        name: 'Photographer',
        description: 'Shoot tourists at the Confluence and events around town.',
        emoji: '📸',
        locationId: 'university-area',
        unlockLevel: 3,
        energyCost: 15,
        timeSlots: 1,
        basePay: 1800,
        xpReward: 32,
        skillTraining: {
            skill: 'smart',
            xp: 10
        },
        reputationReward: 5,
        cooldownSlots: 2,
        requirements: {
            minSkills: {
                smart: 2
            }
        }
    },
    {
        id: 'shop-assistant',
        name: 'Shop Assistant',
        description: 'Keep a shop neat, mind the counter, charm the customers.',
        emoji: '🏪',
        locationId: 'kpata-market',
        unlockLevel: 2,
        energyCost: 16,
        timeSlots: 2,
        basePay: 1300,
        xpReward: 26,
        skillTraining: {
            skill: 'social',
            xp: 12
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'cleaner',
        name: 'Cleaner',
        description: 'Honest work at offices and the motor park. Nobody claps — but they pay.',
        emoji: '🧹',
        locationId: 'transport-area',
        unlockLevel: 1,
        energyCost: 20,
        timeSlots: 1,
        basePay: 800,
        xpReward: 18,
        skillTraining: {
            skill: 'hustle',
            xp: 8
        },
        reputationReward: 1,
        requirements: {}
    },
    {
        id: 'tour-guide',
        name: 'Tour Guide',
        description: 'Show visitors the Confluence, Mount Patti and the old town stories.',
        emoji: '🗺️',
        locationId: 'confluence',
        unlockLevel: 4,
        energyCost: 18,
        timeSlots: 2,
        basePay: 2200,
        xpReward: 40,
        skillTraining: {
            skill: 'social',
            xp: 14
        },
        reputationReward: 8,
        requirements: {
            minSkills: {
                social: 3
            }
        }
    },
    {
        id: 'government-worker',
        name: 'Government Worker',
        description: 'A desk, a stamp, and a steady salary at the Secretariat.',
        emoji: '🏢',
        locationId: 'government-area',
        unlockLevel: 5,
        energyCost: 14,
        timeSlots: 2,
        basePay: 2600,
        xpReward: 45,
        skillTraining: {
            skill: 'smart',
            xp: 16
        },
        reputationReward: 10,
        requirements: {
            minSkills: {
                smart: 4
            },
            minReputation: 100
        }
    },
    {
        id: 'entrepreneur',
        name: 'Entrepreneur',
        description: 'Run your own thing full-time. Risky — but the ceiling is sky high.',
        emoji: '💼',
        locationId: 'ganaja-junction',
        unlockLevel: 6,
        energyCost: 24,
        timeSlots: 2,
        basePay: 2400,
        xpReward: 50,
        skillTraining: {
            skill: 'smart',
            xp: 18
        },
        reputationReward: 12,
        requirements: {
            minReputation: 250
        }
    },
    /* ------------------------- school jobs (Stage 7) ------------------------- */ {
        id: 'evening-tutor',
        name: 'Evening Class Tutor',
        description: 'Take the evening lesson at the FUL Adankolo old campus — earn and revise at once.',
        emoji: '📔',
        locationId: 'ful-adankolo',
        unlockLevel: 3,
        energyCost: 12,
        timeSlots: 1,
        basePay: 1500,
        xpReward: 30,
        skillTraining: {
            skill: 'smart',
            xp: 14
        },
        reputationReward: 4,
        cooldownSlots: 2,
        requirements: {
            minSkills: {
                smart: 2
            }
        }
    },
    {
        id: 'clinic-errand-runner',
        name: 'Clinic Errand Runner',
        description: 'Run case notes and supplies around the nursing college and the hospital quarter.',
        emoji: '🩺',
        locationId: 'college-nursing',
        unlockLevel: 2,
        energyCost: 14,
        timeSlots: 1,
        basePay: 1200,
        xpReward: 24,
        skillTraining: {
            skill: 'hustle',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'campus-caretaker',
        name: 'Campus Caretaker',
        description: 'Keep the quiet Salem campus neat — hedges, chapel pews, and the notice board.',
        emoji: '⛪',
        locationId: 'salem-university',
        unlockLevel: 2,
        energyCost: 15,
        timeSlots: 1,
        basePay: 1150,
        xpReward: 22,
        skillTraining: {
            skill: 'hustle',
            xp: 9
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'afterschool-supervisor',
        name: 'After-School Supervisor',
        description: 'Watch the Faithview kids till last pickup — patience pays, literally.',
        emoji: '✏️',
        locationId: 'faithview-academy',
        unlockLevel: 2,
        energyCost: 11,
        timeSlots: 1,
        basePay: 1050,
        xpReward: 24,
        skillTraining: {
            skill: 'social',
            xp: 12
        },
        reputationReward: 4,
        requirements: {}
    },
    {
        id: 'class-assistant',
        name: 'Class Assistant',
        description: 'Assist the teachers at Al-Azhar — handouts, uniforms, and very polite children.',
        emoji: '🕌',
        locationId: 'al-azhar-college',
        unlockLevel: 2,
        energyCost: 12,
        timeSlots: 1,
        basePay: 1100,
        xpReward: 25,
        skillTraining: {
            skill: 'social',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'choir-practice-assistant',
        name: 'Choir Practice Assistant',
        description: 'Arrange hymn books and chairs for Baptist High’s famous choir practice.',
        emoji: '🎶',
        locationId: 'baptist-high',
        unlockLevel: 2,
        energyCost: 10,
        timeSlots: 1,
        basePay: 1000,
        xpReward: 22,
        skillTraining: {
            skill: 'social',
            xp: 11
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'school-bus-conductor',
        name: 'School Bus Conductor',
        description: 'Call names, count heads, mind the gate — the Julitola yellow bus runs on order.',
        emoji: '🚌',
        locationId: 'julitola-intl',
        unlockLevel: 2,
        energyCost: 14,
        timeSlots: 1,
        basePay: 1250,
        xpReward: 26,
        skillTraining: {
            skill: 'hustle',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'nursery-assistant',
        name: 'Nursery Assistant',
        description: 'Help the tiny Christfield pupils with their letters — and their crayons.',
        emoji: '🎒',
        locationId: 'christfield-school',
        unlockLevel: 1,
        energyCost: 10,
        timeSlots: 1,
        basePay: 900,
        xpReward: 20,
        skillTraining: {
            skill: 'social',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    /* ---------------- M12 — THE LADDER: the careers the certificate opens ---------------- */ {
        id: 'govt-officer',
        name: 'Civil Servant — GRA',
        description: 'A desk of your own at the Government Area: files, stamps, and steady respect. The FUL certificate opened this door.',
        emoji: '🏢',
        locationId: 'government-area',
        unlockLevel: 5,
        energyCost: 22,
        timeSlots: 1,
        basePay: 3800,
        xpReward: 40,
        skillTraining: {
            skill: 'smart',
            xp: 14
        },
        reputationReward: 5,
        requirements: {
            minReputation: 300,
            requiresDegree: true
        }
    },
    {
        id: 'lec-assistant',
        name: 'Tutorial Assistant — FUL',
        description: 'Take the smaller groups in LT B and mark their quizzes. The campus dey call you abeg now.',
        emoji: '🎓',
        locationId: 'ful-felele',
        unlockLevel: 4,
        energyCost: 20,
        timeSlots: 1,
        basePay: 3200,
        xpReward: 36,
        skillTraining: {
            skill: 'smart',
            xp: 16
        },
        reputationReward: 4,
        requirements: {
            minReputation: 150,
            requiresDegree: true
        }
    },
    /* ------------- M12 — the uniform: the police recruit (no degree, pure respect) ------------- */ {
        id: 'police-recruit',
        name: 'Police Recruit',
        description: 'The uniform earns the street’s respect — checkpoints, patrols, and the MOPOL detail watching your record.',
        emoji: '👮',
        locationId: 'government-area',
        unlockLevel: 6,
        energyCost: 24,
        timeSlots: 1,
        basePay: 2800,
        xpReward: 34,
        skillTraining: {
            skill: 'social',
            xp: 12
        },
        reputationReward: 4,
        requirements: {
            minReputation: 200
        }
    }
];
const JOB_BY_ID = Object.fromEntries(_c1 = JOBS.map(_c = (j)=>[
        j.id,
        j
    ]));
_c2 = JOB_BY_ID;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "JOB_BY_ID$Object.fromEntries$JOBS.map");
__turbopack_context__.k.register(_c1, "JOB_BY_ID$Object.fromEntries");
__turbopack_context__.k.register(_c2, "JOB_BY_ID");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/hustles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Hustles (Stage 3)
 * --------------------------------
 * Small, personal, informal opportunities — the opposite of the formal
 * job board in jobs.ts. Each hustle belongs to a real NPC at a real
 * location (stable ids shared with the map + future 3D world), carries
 * its own requirements, risk (difficulty) and reward range.
 *
 * The opportunity SYSTEM (systems/opportunities.ts) reads this catalogue
 * and generates offer instances — nothing here knows about the UI.
 * When the phone/chat system arrives it will deliver these exact defs
 * as chat messages — same data, new transport.
 */ __turbopack_context__.s([
    "HUSTLES",
    ()=>HUSTLES,
    "HUSTLE_BY_ID",
    ()=>HUSTLE_BY_ID,
    "hustlesAt",
    ()=>hustlesAt
]);
const HUSTLES = [
    /* ------------------------------ Kpata Market ------------------------------ */ {
        id: 'musa-fabric-carry',
        npcId: 'musa',
        locationId: 'kpata-market',
        title: 'Carry fabric bundles',
        message: 'Guy, you dey around Kpata? I get small work for you — help me carry this fabric reach my shop.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 400,
            cashMax: 700,
            xp: 16,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 12,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'hajiya-pepper-bags',
        npcId: 'hajiya-amina',
        locationId: 'kpata-market',
        title: 'Bag fresh peppers',
        message: 'My customer dey wait. Come help me bag this pepper before afternoon market rush, abeg.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 350,
            cashMax: 550,
            xp: 14,
            skillXp: 9,
            reputation: 2
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'kpata-price-runner',
        npcId: 'musa',
        locationId: 'kpata-market',
        title: 'Market price run',
        message: 'I wan send somebody go check tomoro price for three stalls. You get sharp mouth — you fit talk price.',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 800,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ------------------------------ Food Strip ------------------------------- */ {
        id: 'mama-ngozi-soup-run',
        npcId: 'mama-ngozi',
        locationId: 'food-area',
        title: 'Deliver soup parcels',
        message: 'My customer for Government Area don order soup since morning. Help me run this delivery — no spill am o!',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 850,
            xp: 18,
            skillXp: 11,
            reputation: 3
        },
        energyCost: 14,
        timeSlots: 1,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: false
    },
    {
        id: 'mama-ngozi-basins',
        npcId: 'mama-ngozi',
        locationId: 'food-area',
        title: 'Wash evening basins',
        message: 'Evening rush dey come. Wash these basins make shine and I go pay you sharp sharp.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 300,
            cashMax: 500,
            xp: 12,
            skillXp: 8,
            reputation: 1
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    /* ---------------------------- Ganaja Junction ----------------------------- */ {
        id: 'emeka-sort-packages',
        npcId: 'emeka',
        locationId: 'ganaja-junction',
        title: 'Sort dispatch packages',
        message: 'Wahala dey — my packages don mix like jollof. Help me sort am by street, make we dey go.',
        source: 'npc',
        difficulty: 1,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 450,
            cashMax: 700,
            xp: 16,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'emeka-last-mile',
        npcId: 'emeka',
        locationId: 'ganaja-junction',
        title: 'Last-mile drop',
        message: 'One last drop for Low-Cost side. I go give you the address — your leg fast pass my fuel gauge.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 600,
            cashMax: 950,
            xp: 22,
            skillXp: 13,
            reputation: 3
        },
        energyCost: 16,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: false
    },
    /* ------------------------------ Motor Park -------------------------------- */ {
        id: 'baba-t-keke-wash',
        npcId: 'baba-t',
        locationId: 'transport-area',
        title: 'Wash the kekes',
        message: 'Park dey judge cleanliness tomorrow. Wash these kekes make dem brown like new kobo.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 350,
            cashMax: 600,
            xp: 14,
            skillXp: 9,
            reputation: 2
        },
        energyCost: 13,
        timeSlots: 1,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'baba-t-fare-collect',
        npcId: 'baba-t',
        locationId: 'transport-area',
        title: 'Collect park fares',
        message: 'Follow me collect loading fares for one round. No let them shake hand for you — talk am well.',
        source: 'npc',
        difficulty: 2,
        skill: 'social',
        requirements: {},
        reward: {
            cashMin: 550,
            cashMax: 900,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ---------------------------- University Area ----------------------------- */ {
        id: 'chantel-flyers',
        npcId: 'chantel',
        locationId: 'university-area',
        title: 'Share tutorial flyers',
        message: 'Hey! Help me share tutorial flyers for hostel side — na per hand I dey pay o.',
        source: 'npc',
        difficulty: 1,
        skill: 'social',
        requirements: {},
        reward: {
            cashMin: 400,
            cashMax: 650,
            xp: 15,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 11,
        timeSlots: 1,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'chantel-laptop-fix',
        npcId: 'chantel',
        locationId: 'university-area',
        title: 'Fix a student laptop',
        message: 'My coursemate laptop dey craze — e no dey boot. You sabi computer small? They will pay better.',
        source: 'npc',
        difficulty: 3,
        skill: 'smart',
        requirements: {
            minSkills: {
                smart: 2
            }
        },
        reward: {
            cashMin: 900,
            cashMax: 1500,
            xp: 30,
            skillXp: 16,
            reputation: 4
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ---------------------------- Government Area ----------------------------- */ {
        id: 'alhaji-sule-files',
        npcId: 'alhaji-sule',
        locationId: 'government-area',
        title: 'Arrange office files',
        message: 'These files must enter shelf alphabetically before oga arrive. Steady hand, steady pay.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 600,
            cashMax: 950,
            xp: 22,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'alhaji-sule-errand',
        npcId: 'alhaji-sule',
        locationId: 'government-area',
        title: 'Official errand run',
        message: 'Take this envelope across the secretariat. Stamp am here, sign am there. No open am!',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {
            minSkills: {
                smart: 2
            }
        },
        reward: {
            cashMin: 700,
            cashMax: 1100,
            xp: 26,
            skillXp: 14,
            reputation: 4
        },
        energyCost: 13,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ---------------------------- Historic Lokoja ----------------------------- */ {
        id: 'uncle-ben-cleanup',
        npcId: 'uncle-ben',
        locationId: 'historic-lokoja',
        title: 'Clear the old path',
        message: 'Tourists dey come tomorrow. Help me clear the cemetery path — history must look presentable.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 800,
            xp: 18,
            skillXp: 11,
            reputation: 3
        },
        energyCost: 15,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ------------------------------- Confluence ------------------------------- */ {
        id: 'idris-net-pull',
        npcId: 'idris',
        locationId: 'confluence',
        title: 'Pull the fishing net',
        message: 'The current strong today. Pull this net with me — whatever fish enter, na split we go share.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 550,
            cashMax: 900,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 16,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ------------------------------ Mount Patti ------------------------------- */ {
        id: 'baba-danjuma-trail',
        npcId: 'baba-danjuma',
        locationId: 'mount-patti',
        title: 'Clear the hiking trail',
        message: 'Branch fall for trail after the rain. Help me clear am — climbers go thank you, I go pay you.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 850,
            xp: 19,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 15,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* --------------------------- The Schools (Stage 7) ------------------------ */ {
        id: 'hauwa-assignment-run',
        npcId: 'hauwa',
        locationId: 'gyb-model-adankolo',
        title: 'Deliver assignment scripts',
        message: 'Ah, you came at the right time! Help me carry this whole class’s scripts to the staff room before the bell.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 350,
            cashMax: 600,
            xp: 15,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'chidi-notes-run',
        npcId: 'chidi',
        locationId: 'ful-felele',
        title: 'Photocopy lecture notes run',
        message: 'Guy, the whole 200 level needs these notes before tomorrow’s test. Business centre run — I go cover the copies.',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 550,
            cashMax: 900,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 14,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'abubakar-workshop-tidy',
        npcId: 'abubakar',
        locationId: 'ksp-felele',
        title: 'Tidy the mechanical workshop',
        message: 'Oga say make the workshop clean before inspection. Spanner no go arrange itself — I go split the pay.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 450,
            cashMax: 750,
            xp: 17,
            skillXp: 11,
            reputation: 2
        },
        energyCost: 16,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'miss-grace-library-sort',
        npcId: 'miss-grace',
        locationId: 'crowther-memorial',
        title: 'Sort the library shelves',
        message: 'The library shelves have slipped into chaos again. Alphabetical order, young lady or young man — there is ₦ in the envelope.',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 400,
            cashMax: 700,
            xp: 18,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 10,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    }
];
const HUSTLE_BY_ID = Object.fromEntries(_c1 = HUSTLES.map(_c = (h)=>[
        h.id,
        h
    ]));
_c2 = HUSTLE_BY_ID;
function hustlesAt(locationId) {
    return HUSTLES.filter((h)=>h.locationId === locationId);
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "HUSTLE_BY_ID$Object.fromEntries$HUSTLES.map");
__turbopack_context__.k.register(_c1, "HUSTLE_BY_ID$Object.fromEntries");
__turbopack_context__.k.register(_c2, "HUSTLE_BY_ID");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/npcChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — NPC Chat Lines (Stage 5)
 * ---------------------------------------
 * What each NPC says when you chat with them, by familiarity tier.
 * The phone app and the 3D "talk" interaction both read from here —
 * the social SYSTEM decides WHICH line, this file only holds the words.
 *
 * Tiers: stranger → acquaintance → paddy → close-paddy
 * Voice rule: warm Nigerian pidgin, every line is safe, in-character,
 * and tied to the NPC's home location / hustle world.
 */ __turbopack_context__.s([
    "NPC_CHAT",
    ()=>NPC_CHAT
]);
const NPC_CHAT = {
    musa: {
        stranger: [
            'Ah, welcome! You wan buy cloth? Everything good fabric dey here.',
            'Kpata market na my home. Anywhere you wan go, ask me.'
        ],
        acquaintance: [
            'Ah na you! How the hustle dey go today?',
            'If you wan get fine fabric cheap, na me you go meet. No wahala.'
        ],
        paddy: [
            'My paddy! Come make we plan something — market dey pay people wey sabi look well.',
            'You don dey move up o. I dey always talk am — na so e go continue.'
        ],
        'close-paddy': [
            'See am! My guy for life. Anything wey you need for Kpata, na family price.',
            'One day we go open shop together. I get the fabric, you get the sense.'
        ]
    },
    'hajiya-amina': {
        stranger: [
            'You are welcome. Fresh pepper from the farm — look well before you price am.',
            'Market respect people wey get patience. Wetin you dey find?'
        ],
        acquaintance: [
            'Ah, my customer. Your eye don sharp well well since you dey come.',
            'I keep the best tomatoes for people wey no go waste my time.'
        ],
        paddy: [
            'My dear, come sit. Any good gist from the other side of market?',
            'You dey do well. God go continue to bless this your hustle.'
        ],
        'close-paddy': [
            'Come, come! I don cook extra — you must eat before you leave today.',
            'You be like pikin to me now. Anything wey you wan do, I dey support.'
        ]
    },
    'mama-ngozi': {
        stranger: [
            'Welcome! You look hungry — the pot is still hot, no worry.',
            'First time here? Order anything, you go come back tomorrow by yourself.'
        ],
        acquaintance: [
            'My regular! The usual, or you wan try today\'s special?',
            'Sit down, sit down. Somebody wey dey always smile like you no fit palava.'
        ],
        paddy: [
            'Ah my pikin! I don tell everybody for this food strip about you.',
            'Today your food na family treat — no talk am loud o!'
        ],
        'close-paddy': [
            'You don eat? You sure? I no go hear story o — sit, food dey come.',
            'When you go open your own place, na my recipe you go use o! I dey joke… partially.'
        ]
    },
    emeka: {
        stranger: [
            'Oboi! You wan learn okada work? E no easy but e dey pay small small.',
            'If e fit move, I fit carry am. Wetin be your own talent?'
        ],
        acquaintance: [
            'My guy! Road today dey free — no police wahala, no fuel wahala.',
            'You dey look sharper ah ah. Money dey your pocket small small, e dey show!'
        ],
        paddy: [
            'Oboi we go run delivery together one day. You bring customers, I bring wheel.',
            'Any route you wan sabi for this Lokoja, just ask. I don wear all the road like cloth.'
        ],
        'close-paddy': [
            'Na you be my manager for future o! When I buy second bike, na you go ride am.',
            'From Kpata to Ganaja, nobody sabi road like we two. Team no dey disappoint.'
        ]
    },
    'baba-t': {
        stranger: [
            'Welcome to Motor Park. Everything here na order — that\'s why we dey move.',
            'You wan join transport work? Come with patience, leave with sense.'
        ],
        acquaintance: [
            'Ah my friend. Your level don dey rise for this park, I dey watch you.',
            'Keke unit dey always need sharp people. Keep your record clean.'
        ],
        paddy: [
            'My guy, seat dey wait you. Even keke sef know your face now.',
            'We go talk business soon. Park get level, and you don almost reach.'
        ],
        'close-paddy': [
            'Chairman! Park dey respect you now. Anything you wan run, I go open door.',
            'You remember when you first come? Now even danfo drivers dey greet you first.'
        ]
    },
    chantel: {
        stranger: [
            'Hey! You look like you get sense. You dey do anything with the students here?',
            'Campus dey burst with small small opportunities. You just need eye.'
        ],
        acquaintance: [
            'Ah my personal person! I get one small plan — you go like am.',
            'Exams dey come o, but hustle no dey wait exam. Balance am well!'
        ],
        paddy: [
            'My guy! I don draft the whole plan — Monday morning, we go talk am.',
            'You dey move like person wey go far. I wan dey your circle when e happen.'
        ],
        'close-paddy': [
            'Day-one paddy! We go build something wey this campus go remember.',
            'Any gig wey you dey run, count me in. Paddy no dey watch paddy suffa.'
        ]
    },
    'alhaji-sule': {
        stranger: [
            'Good day. If your papers complete, the process is simple. If not… e go take time.',
            'Office na office — but I fit tell you the correct way to file anything.'
        ],
        acquaintance: [
            'Ah, my reliable friend. Your files dey always complete. I respect that.',
            'The secretariat get plenty opportunity for person wey sabi read the room.'
        ],
        paddy: [
            'My friend, come. I go show you the correct office for that your plan.',
            'You dey rise well. Government work like steady people like you.'
        ],
        'close-paddy': [
            'Chairman! I don arrange the file — you only need to sign, sign.',
            'One day we go laugh inside one correct office. Just keep your name clean.'
        ]
    },
    'uncle-ben': {
        stranger: [
            'Young man, do you know this town get the FIRST secondary school in Nigeria? Come, I go tell you.',
            'History dey everywhere for this Lokoja — na only eye we no dey open.'
        ],
        acquaintance: [
            'Ah my student! Today I go show you the other side of the old town.',
            'You dey listen well. Na so history dey enter person body.'
        ],
        paddy: [
            'My dear, the stories wey I no tell tourists, na you I dey tell them.',
            'One day you go carry this town story go far places. Mark my word.'
        ],
        'close-paddy': [
            'My pikin! Sit down. Today na the day I tell you about Lord Lugroad… e get why we dey call am so.',
            'When they write the new history of Lokoja, your name go dey inside. I don see am.'
        ]
    },
    idris: {
        stranger: [
            'The rivers dey generous today. You wan see the confluence? Na God work.',
            'Fishing na patience work. Anybody wey no fit wait no go sabi this water.'
        ],
        acquaintance: [
            'My friend! The fish dey bite better for evening — come with me one day.',
            'You dey grow o. Even the river dey notice people wey dey try.'
        ],
        paddy: [
            'Come make we sit for the bank. The water get way of answering questions.',
            'You be my people now. When catch plenty, na we two go share am.'
        ],
        'close-paddy': [
            'My brother from the land! Today the river go provide — I don already ask am.',
            'This confluence na our office now. Any big decision, come here first.'
        ]
    },
    'baba-danjuma': {
        stranger: [
            'Patti no be small hill o. You wan climb? Go slow, drink water, respect the rock.',
            'From up there you go see where two rivers become one. Na blessing to see am.'
        ],
        acquaintance: [
            'Ah, my climber! Your leg don dey strong. Next time we go reach the summit.',
            'The hill like you small small. E dey test person before e show am everything.'
        ],
        paddy: [
            'My friend, today we go the quiet path. Na there the real Patti dey hide.',
            'You don climb am many times now. The hill don accept you.'
        ],
        'close-paddy': [
            'Welcome, son of the hill! Come, the morning wind dey fresh for the top.',
            'I don climb Patti ten thousand times — but with you, e still dey sweet me.'
        ]
    },
    hauwa: {
        stranger: [
            'Ah-ah, visitor for our school! You wan see the chemistry lab or you dey find somebody?',
            'I no waste time o — break don nearly finish. Wetin you want?'
        ],
        acquaintance: [
            'Na you again! How market? I hope say you bring gist, no be only books.',
            'Our WAEC prep na fire these days. Sometimes I go just dey dream of formulas.'
        ],
        paddy: [
            'My friend! Come make we sit under the mango tree — the gist plenty today.',
            'You sabi say after WAEC, na university next. FUL or nothing!'
        ],
        'close-paddy': [
            'See my day-one paddy! When I turn scientist, no forget say na here we start.',
            'I even keep jollof for you from the social. You too no dey come school on time!'
        ]
    },
    chidi: {
        stranger: [
            'Welcome to the permanent site o. The sun no dey pity anybody here — carry water.',
            'You be fresh student? Abeg no miss LT B, that lecturer no dey forgive.'
        ],
        acquaintance: [
            'My guy! You don dey adapt to campus life. The shuttle wahala no easy sha.',
            'Exams dey come. Library go full this week — if you see seat, hold am tight.'
        ],
        paddy: [
            'Padi mi! Come make we hustle this school life together — notes, runs, everything.',
            'One day after NYSC, na big things we go do. Just dey watch.'
        ],
        'close-paddy': [
            'My brother from another mother! Anything for FUL, I get plug.',
            'Graduation go sweet — and you must sit front row that day. Na family matter.'
        ]
    },
    'miss-grace': {
        stranger: [
            'Good day. This is a place of learning — please keep your voice low and your manners high.',
            'Visitors sign at the office first. That is how we have run this college since 1956.'
        ],
        acquaintance: [
            'Ah, our friend again. The students behave better when you are around — interesting.',
            'Crowther built this college on discipline. I am only keeping the flame.'
        ],
        paddy: [
            'Come in, come in. You know you are always welcome in this compound.',
            'I have watched many children pass through these gates. Some of them now greet ME as colleagues.'
        ],
        'close-paddy': [
            'My dear! Sit. The kettle is on. Even principals need somebody to talk to.',
            'When they write the history of this school, your name will be in the kind part.'
        ]
    },
    abubakar: {
        stranger: [
            'You reach the poly? Mind the generators — the workshop boys dey weld.',
            'ND or HND? Everybody for this road na one family, no shy.'
        ],
        acquaintance: [
            'Ah my guy! See the engine wey we rebuild yesterday — she dey sound like new.',
            'Poly no be joke o, but the hands-on sense? Nobody fit beat am.'
        ],
        paddy: [
            'Come make we check this alternator — you go learn something wey go serve you for life.',
            'When my workshop open for real, na you be my first customer. I swear.'
        ],
        'close-paddy': [
            'My paddy for life! Any vehicle wahala, bring am — family work, family price.',
            'We go blow together — you with your sense, me with my hands. Watch us.'
        ]
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_game_91d57b4d._.js.map