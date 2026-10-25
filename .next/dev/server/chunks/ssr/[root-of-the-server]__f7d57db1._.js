module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Audio Engine
 * ---------------------------
 * Lightweight synthesised sound (WebAudio, zero asset files) for the
 * small set of MVP sounds. Swappable later: Stage 9 can replace the
 * synth calls with sampled ambience (market, river) behind the same
 * `play(name)` interface, without touching UI code.
 *
 * Sounds: click, chime (money / reward), levelup, notify.
 */ __turbopack_context__.s([
    "audio",
    ()=>audio,
    "syncAudioWithSettings",
    ()=>syncAudioWithSettings
]);
class AudioEngine {
    ctx = null;
    enabled = true;
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    isEnabled() {
        return this.enabled;
    }
    /** Lazily create the AudioContext on first user gesture (browser policy). */ ensureCtx() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    /**
   * Play a short synthesised tone sequence.
   * Failures are silently ignored — audio must never break gameplay.
   */ play(name) {
        if (!this.enabled) return;
        try {
            const ctx = this.ensureCtx();
            if (!ctx) return;
            const now = ctx.currentTime;
            const sequences = {
                // short soft tick
                click: [
                    {
                        f: 660,
                        t: 0,
                        d: 0.05,
                        type: 'triangle',
                        g: 0.12
                    }
                ],
                // pleasant two-note reward
                chime: [
                    {
                        f: 784,
                        t: 0,
                        d: 0.09,
                        type: 'sine',
                        g: 0.16
                    },
                    {
                        f: 1175,
                        t: 0.09,
                        d: 0.14,
                        type: 'sine',
                        g: 0.16
                    }
                ],
                // little fanfare
                levelup: [
                    {
                        f: 523,
                        t: 0,
                        d: 0.1,
                        type: 'triangle',
                        g: 0.14
                    },
                    {
                        f: 659,
                        t: 0.1,
                        d: 0.1,
                        type: 'triangle',
                        g: 0.14
                    },
                    {
                        f: 784,
                        t: 0.2,
                        d: 0.18,
                        type: 'triangle',
                        g: 0.16
                    }
                ],
                // gentle pop for notifications
                notify: [
                    {
                        f: 880,
                        t: 0,
                        d: 0.07,
                        type: 'sine',
                        g: 0.12
                    },
                    {
                        f: 660,
                        t: 0.07,
                        d: 0.1,
                        type: 'sine',
                        g: 0.1
                    }
                ]
            };
            for (const note of sequences[name]){
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = note.type;
                osc.frequency.value = note.f;
                gain.gain.setValueAtTime(note.g, now + note.t);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + note.t);
                osc.stop(now + note.t + note.d + 0.02);
            }
        } catch  {
        // audio is best-effort; never crash the game for it
        }
    }
}
const audio = new AudioEngine();
function syncAudioWithSettings(settings) {
    audio.setEnabled(settings.sound);
}
}),
"[project]/src/game/data/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Central Game Configuration
 * -----------------------------------------
 * The ONE place to tune the economy and balance.
 * Game logic must read from here — never hard-code numbers in components.
 *
 * Sections marked "(future stage)" are consumed by systems that arrive
 * in later stages; they live here now so designers can pre-tune them.
 */ /* ------------------------------ Starting stats ------------------------------ */ __turbopack_context__.s([
    "AUTOSAVE",
    ()=>AUTOSAVE,
    "BIZ",
    ()=>BIZ,
    "CHAOS",
    ()=>CHAOS,
    "CHILL",
    ()=>CHILL,
    "CIVIC",
    ()=>CIVIC,
    "ECONOMY",
    ()=>ECONOMY,
    "ELDER",
    ()=>ELDER,
    "FESTIVALS",
    ()=>FESTIVALS,
    "FLEET",
    ()=>FLEET,
    "FOOD",
    ()=>FOOD,
    "FORTRESS",
    ()=>FORTRESS,
    "GAME_META",
    ()=>GAME_META,
    "GOALS",
    ()=>GOALS,
    "HUSTLE",
    ()=>HUSTLE,
    "INTERIOR",
    ()=>INTERIOR,
    "LADDER",
    ()=>LADDER,
    "LEVEL_UNLOCKS",
    ()=>LEVEL_UNLOCKS,
    "MEAL_BY_KEY",
    ()=>MEAL_BY_KEY,
    "NEEDS",
    ()=>NEEDS,
    "PROGRESSION",
    ()=>PROGRESSION,
    "PULSE",
    ()=>PULSE,
    "REPUTATION_TIERS",
    ()=>REPUTATION_TIERS,
    "RIVERS",
    ()=>RIVERS,
    "SHIELD",
    ()=>SHIELD,
    "SOCIAL",
    ()=>SOCIAL,
    "STARTING",
    ()=>STARTING,
    "TIME",
    ()=>TIME,
    "TRAVEL",
    ()=>TRAVEL,
    "WEATHER_META",
    ()=>WEATHER_META,
    "WORK",
    ()=>WORK,
    "WORLD3D",
    ()=>WORLD3D
]);
const STARTING = {
    cash: 5000,
    needs: {
        health: 100,
        energy: 100,
        hunger: 100,
        mood: 100
    },
    skills: {
        hustle: 1,
        smart: 1,
        social: 1
    },
    reputation: 0,
    level: 1,
    xp: 0,
    homeId: 'basic-room',
    jobId: null
};
const NEEDS = {
    /** Hard clamp for all need values. */ min: 0,
    max: 100,
    /** Below this hunger, mood starts draining each action. */ hungerCritical: 20,
    /** Below this energy, strenuous activities are blocked. */ energyCritical: 10,
    /** Mood drain per action while hunger is critical. */ hungryMoodDrain: 4,
    /** Health drain per action while hunger has hit 0. */ starvingHealthDrain: 3,
    /** Passive regen applied when a player rests. */ rest: {
        /** Short nap (advances one time slot). */ nap: {
            energy: 22,
            hunger: -8,
            mood: 4,
            health: 2
        },
        /** Full night sleep (advances to next morning). */ sleep: {
            energy: 100,
            hunger: -22,
            mood: 12,
            health: 8
        }
    },
    /**
   * INC 4 — living-world decay. Every time slot that passes OUTSIDE of
   * rest quietly drains the body: meals now matter on a schedule and a
   * full day of hustling leaves its mark. Applied by the store on the
   * non-rest clock paths (travel, work, eating, home downtime) through
   * systems/needs.applySlotDecay — never hand-rolled in components.
   */ decay: {
        hunger: 2,
        energy: 1,
        mood: 1,
        health: 0
    }
};
const INTERIOR = {
    /** interaction radius for furniture hotspots, in interior metres */ hotspotRadius: 2.1,
    /** unwind actions — each honestly advances one clock slot (time passes) */ relax: {
        tv: {
            mood: 8,
            energy: 3,
            hunger: -3
        },
        bath: {
            mood: 5,
            energy: 5,
            hunger: -3
        }
    },
    /** Stage 5 — gym session (one clock slot, leaves you properly tired) */ gym: {
        energy: -14,
        mood: 8,
        health: 6,
        hunger: -8
    },
    /** Stage 7 — school study hour (one clock slot, sharpens the mind) */ study: {
        energy: -7,
        mood: 3,
        health: 0,
        hunger: -6,
        smartXp: 14
    },
    /** Stage 5 — night out at the lounge: mood bomb, wallet hit (cash in NIGHT_OUT.cost) */ lounge: {
        energy: -6,
        mood: 14,
        hunger: -4
    },
    /** Stage 5 — night-out economy */ NIGHT_OUT: {
        cost: 2500,
        /** evening/night only — daytime visits cost the same but give half mood */ nightMoodBonus: 4
    },
    /** interior camera rig tuning (presentation-only) */ camera: {
        distance: 4.6,
        minDistance: 2.6,
        maxDistance: 7,
        height: 3.1,
        pitchMin: 0.22,
        pitchMax: 0.95
    },
    /** exterior door interact radius (world units) */ doorRadius: 3.2
};
const PROGRESSION = {
    /** xp needed to go from level L to L+1 = base * L^growth */ xpBase: 120,
    xpGrowth: 1.4,
    /** Cap keeps late-game numbers sane. */ maxLevel: 50,
    /** Skill XP converted to skill points at this many XP per point (future stage). */ skillXpPerPoint: 25,
    /** Starting skill cap grows with level: cap = base + level * perLevel. */ skillCapBase: 3,
    skillCapPerLevel: 2
};
const REPUTATION_TIERS = [
    {
        threshold: 0,
        name: 'Nobody',
        title: 'Just another face in Lokoja'
    },
    {
        threshold: 100,
        name: 'Known',
        title: 'People nod when you pass'
    },
    {
        threshold: 250,
        name: 'Hustler',
        title: 'Your name opens small doors'
    },
    {
        threshold: 500,
        name: 'Respected',
        title: 'Traders call you boss'
    },
    {
        threshold: 1000,
        name: 'Influential',
        title: 'Your word carries weight'
    },
    {
        threshold: 2500,
        name: 'Big Player',
        title: 'Lokoja knows your name'
    }
];
const LEVEL_UNLOCKS = {
    1: [
        'Basic jobs',
        'Kpata Market',
        'Ganaja Junction'
    ],
    2: [
        'Food stalls',
        'Photography gigs'
    ],
    3: [
        'Confluence activities',
        'Fishing'
    ],
    4: [
        'Mount Patti trails',
        'Tourist hustles'
    ],
    5: [
        'Market stall business'
    ],
    8: [
        'Food stand business'
    ],
    10: [
        'Historic Lokoja tours',
        'Delivery business'
    ]
};
const ECONOMY = {
    currencySymbol: '₦',
    /**
   * Transport (Stage 2). Fares scale with trip distance from these params:
   *   cost   = base + perKm × km  (rounded to TRAVEL.fareRounding)
   *   time   = minutesPerKm × km  (× location modifier × weather modifier)
   *   energy = energyPerKm × km   (× location modifier)
   * Tuned so a median trip (≈3 km) matches Lokoja-realistic fares:
   *   walk ₦0/15min/-10⚡, keke ≈₦300/8min/-2⚡, taxi ≈₦1,000/4min/-1⚡
   */ transport: {
        walk: {
            label: 'Walk',
            emoji: '🚶',
            cost: {
                base: 0,
                perKm: 0
            },
            minutesPerKm: 4.8,
            energyPerKm: 3.2
        },
        keke: {
            label: 'Keke',
            emoji: '🛺',
            cost: {
                base: 100,
                perKm: 60
            },
            minutesPerKm: 2.6,
            energyPerKm: 0.65
        },
        taxi: {
            label: 'Taxi',
            emoji: '🚕',
            cost: {
                base: 300,
                perKm: 220
            },
            minutesPerKm: 1.3,
            energyPerKm: 0.32
        },
        // M4 — THE GARAGE: your own rides. No fare — FUEL only, bought at the pump
        // on departure (the store charges it like a fare but the ledger says fuel).
        // Fuel < the public fare for the same trip: that is what ownership MEANS.
        'own-okada': {
            label: 'Your Okada',
            emoji: '🏍️',
            cost: {
                base: 0,
                perKm: 45
            },
            minutesPerKm: 2.0,
            energyPerKm: 0.55
        },
        'own-keke': {
            label: 'Your Keke',
            emoji: '🛺',
            cost: {
                base: 0,
                perKm: 40
            },
            minutesPerKm: 2.4,
            energyPerKm: 0.6
        },
        'own-taxi': {
            label: 'Your Taxi',
            emoji: '🚕',
            cost: {
                base: 0,
                perKm: 130
            },
            minutesPerKm: 1.2,
            energyPerKm: 0.32
        },
        'own-danfo': {
            label: 'Your Danfo',
            emoji: '🚐',
            cost: {
                base: 0,
                perKm: 85
            },
            minutesPerKm: 2.1,
            energyPerKm: 0.38
        }
    },
    /** Rent charged every N days per home (Stage 4). */ rent: {
        cycleDays: 7,
        homes: {
            'basic-room': 2500,
            apartment: 15000,
            house: 45000
        }
    },
    /** Starting prices for shops (Stage 4). Tunable per item in foods/items data. */ shopMargin: 1.15,
    /** Businesses (Stage 8): income per in-game day at level 1, upgrade multiplier. */ business: {
        baseIncome: {
            'food-stand': 1800,
            'market-stall': 1500
        },
        upgradeCostMultiplier: 1.8,
        collectIntervalDays: 1
    }
};
const TIME = {
    /** Order of the day. */ slots: [
        'morning',
        'afternoon',
        'evening',
        'night'
    ],
    /** Weighted weather for a new day. Night-clear only appears at night.
   *  M6 — harmattan dust, confluence thunderstorms and Niger/Benue flood
   *  days are rare, dramatic days: the whole city feels them. */ weatherWeights: {
        sunny: 55,
        cloudy: 25,
        rain: 14,
        harmattan: 3.5,
        storm: 1.8,
        flood: 0.7
    },
    /** Effects on the player per weather (travel modifiers live in TRAVEL below).
   *  M6 — actually APPLIED at the sleep day-roll: the sky sets the day's mood. */ weatherEffects: {
        sunny: {
            mood: 0
        },
        cloudy: {
            mood: 0
        },
        rain: {
            mood: -3
        },
        harmattan: {
            mood: -2
        },
        storm: {
            mood: -6
        },
        flood: {
            mood: -8
        }
    }
};
const WEATHER_META = {
    sunny: {
        icon: 'sunny',
        label: 'Sunny',
        tip: 'Clear skies — the city moves easy.',
        dayNote: null
    },
    cloudy: {
        icon: 'cloudy',
        label: 'Cloudy',
        tip: 'Cloud cover, cool air.',
        dayNote: null
    },
    rain: {
        icon: 'rain',
        label: 'Rain',
        tip: 'Rain is falling — trips take a bit longer.',
        dayNote: 'Rain fall this morning — carry body cover, journeys go slow small.'
    },
    'night-clear': {
        icon: 'night-clear',
        label: 'Clear night',
        tip: 'Quiet, starry night.',
        dayNote: null
    },
    harmattan: {
        icon: 'harmattan',
        label: 'Harmattan',
        tip: 'Dust haze everywhere — visibility low, throat dry.',
        dayNote: 'Harmattan dust don blow in — the whole town dey haze. Journeys slow small, price dey climb.'
    },
    storm: {
        icon: 'storm',
        label: 'Thunderstorm',
        tip: 'Heavy storm — okada dey suffer, roads don messy.',
        dayNote: 'Thunderstorm don land for the confluence — no waka comot unless e necessary.'
    },
    flood: {
        icon: 'flood',
        label: 'Flood watch',
        tip: 'Niger don overflow — the riverfront is closed, food prices climb.',
        dayNote: 'Flood alert! Niger/Benue don overflow — riverfront closed, food prices don climb.'
    }
};
const WORK = {
    /** default cooldown after a shift, if a job doesn't define its own */ defaultCooldownSlots: 1,
    /** pay bonus per relevant skill level above 1 (0.05 = +5%) */ payPerSkillLevel: 0.05,
    /** pay factor when mood is high / low — hustle rewards good vibes */ moodBonusHigh: {
        threshold: 70,
        factor: 1.08
    },
    moodPenaltyLow: {
        threshold: 25,
        factor: 0.9
    },
    /** base success chance for a hustle-style roll (jobs always succeed) */ baseSuccess: 0.72,
    /** success shift per (skill − difficulty) point, clamped below */ skillStep: 0.07,
    successClamp: {
        min: 0.15,
        max: 0.95
    },
    /** chance a success becomes a 'great' outcome (bigger payout + bonus rep) */ greatChance: 0.18,
    /** great outcomes multiply the payout by this */ greatPayFactor: 1.5,
    /** what a failed hustle still yields (lesson XP, mood hit) */ fail: {
        xpFactor: 0.5,
        cashFactor: 0,
        moodDelta: -6
    },
    /** pay rounding step (keeps naira amounts tidy) */ payRounding: 10,
    /** success chance bonus when mood is high (hustle rolls) */ moodChanceBonusHigh: 0.05,
    /** success chance penalty when mood is low (hustle rolls) */ moodChancePenaltyLow: 0.05,
    /** extra reputation a 'great' outcome adds */ greatBonusReputation: 2,
    /** how long the on-screen "working…" transition lasts (ms) */ transitionMs: 700
};
const HUSTLE = {
    /** max accepted-but-undone opportunities the player can hold */ maxActive: 3,
    /** generated offers expire after this many absolute slots */ expirySlots: 6,
    /** cooldown for "look around for hustles" searching */ searchCooldownSlots: 1,
    /** how many offers one search can produce (weighted random pick) */ maxPerSearch: 2,
    /** chance (0–1) that a search finds nothing — the streets are not always kind */ dryChance: 0.25
};
const TRAVEL = {
    /** Map units (0–100 grid) → kilometres. Lokoja core ≈ 11 km across. */ kmPerMapUnit: 0.16,
    /** Every completed trip advances this many time slots on the EXISTING clock. */ slotsPerTrip: 1,
    /** Minutes multiplier per transport in each weather (kept gentle by design).
   *  M6 rows: harmattan dust slows everyone a little; a confluence storm is
   *  rain turned to eleven; flood is the slowest day of the year. */ weatherMinutesMultiplier: {
        sunny: {
            walk: 1,
            keke: 1,
            taxi: 1,
            'own-okada': 1,
            'own-keke': 1,
            'own-taxi': 1,
            'own-danfo': 1
        },
        cloudy: {
            walk: 1,
            keke: 1,
            taxi: 1,
            'own-okada': 1,
            'own-keke': 1,
            'own-taxi': 1,
            'own-danfo': 1
        },
        rain: {
            walk: 1.4,
            keke: 1.15,
            taxi: 1.08,
            'own-okada': 1.35,
            'own-keke': 1.14,
            'own-taxi': 1.06,
            'own-danfo': 1.1
        },
        'night-clear': {
            walk: 1,
            keke: 1,
            taxi: 1,
            'own-okada': 1,
            'own-keke': 1,
            'own-taxi': 1,
            'own-danfo': 1
        },
        harmattan: {
            walk: 1.15,
            keke: 1.12,
            taxi: 1.08,
            'own-okada': 1.18,
            'own-keke': 1.12,
            'own-taxi': 1.08,
            'own-danfo': 1.1
        },
        storm: {
            walk: 1.75,
            keke: 1.35,
            taxi: 1.15,
            'own-okada': 1.65,
            'own-keke': 1.32,
            'own-taxi': 1.14,
            'own-danfo': 1.22
        },
        flood: {
            walk: 1.9,
            keke: 1.5,
            taxi: 1.25,
            'own-okada': 1.8,
            'own-keke': 1.45,
            'own-taxi': 1.24,
            'own-danfo': 1.35
        }
    },
    /** Chance (0–1) that a travel event rolls on a completed trip. */ eventChance: 0.3,
    /** Fares are rounded to the nearest naira step. */ fareRounding: 10,
    /** How long the on-screen "travelling…" transition lasts (ms). */ transitionMs: 850
};
const GAME_META = {
    title: 'Lokoja Life',
    tagline: 'Build your life at the Confluence.',
    version: '0.3.0',
    stage: 'Stage 3 — Economy, Work & Opportunities'
};
const AUTOSAVE = {
    /** Debounce window for autosave after state changes (ms). */ debounceMs: 1200
};
const WORLD3D = {
    /** energy cost per 100 m actually walked on foot */ energyPer100m: 0.55,
    /** metres per world visit that are always free (strolling one spot) */ freeMeters: 150,
    /** maximum energy one world visit can drain (anti-idle safety cap) */ maxEnergyPerVisit: 6,
    /** radius (m) at which a nearby NPC's gist chip appears */ npcGistRadius: 24,
    /** metres of road a keke/okada/danfo travels per second (traffic feel) */ trafficBaseSpeed: 7,
    /** localStorage key for the one-time 3D onboarding (NOT part of the save) */ onboardingKey: 'lko-world-tut-v1',
    /** localStorage key for district discovery progress (NOT part of the save) */ discoveryKey: 'lko-world-disc-v1',
    /** Stage 5 — driving your own vehicle: energy per km (much cheaper than walking) */ driveEnergyPerKm: 0.35
};
const FOOD = {
    meals: [
        {
            key: 'amala',
            label: 'Amala + ewedu + goat',
            detail: 'Mama T’s Thursday special — swallow that holds you',
            price: 450,
            hunger: 34,
            mood: 6,
            energy: 4
        },
        {
            key: 'jollof',
            label: 'Party jollof + chicken',
            detail: 'Smoky bottom-pot jollof, fried chicken on top',
            price: 700,
            hunger: 46,
            mood: 10,
            energy: 5
        },
        {
            key: 'suya',
            label: 'Suya wrap',
            detail: 'Hot off the grill, extra yaji pepper',
            price: 300,
            hunger: 18,
            mood: 8,
            energy: 2
        },
        {
            key: 'bread-akara',
            label: 'Bread + akara',
            detail: 'The classic roadside combo that never fails',
            price: 250,
            hunger: 20,
            mood: 4,
            energy: 3
        },
        {
            key: 'groceries',
            label: 'Fresh foodstuff basket',
            detail: 'Tomatoes, peppers, rice, groundnut oil — for the pot at home',
            price: 350,
            hunger: 26,
            mood: 3,
            energy: 2
        },
        /* ---- M6 — the night market menu: food strip stalls that only wake after dark ---- */ {
            key: 'night-suya',
            label: 'Night suya platter',
            detail: 'The grill that runs till the coals die — extra yaji, double onion',
            price: 400,
            hunger: 26,
            mood: 12,
            energy: 2,
            night: true
        },
        {
            key: 'boli-ekpa',
            label: 'Boli + groundnut',
            detail: 'Roasted plantain off the night coals, groundnut on the side',
            price: 220,
            hunger: 18,
            mood: 7,
            energy: 3,
            night: true
        },
        {
            key: 'peppersoup',
            label: 'Catfish pepper soup',
            detail: 'Steaming bowl at the corner table — night taste better',
            price: 650,
            hunger: 30,
            mood: 11,
            energy: 4,
            night: true
        }
    ]
};
const MEAL_BY_KEY = Object.fromEntries(FOOD.meals.map((m)=>[
        m.key,
        m
    ]));
const CIVIC = {
    /** NEPA — the disco. Bills post every cycleDays; debt past grace cuts light. */ nepa: {
        cycleDays: 5,
        /** metered flat for a basic room */ baseBill: 1400,
        /** seeded daily variance added on top (deterministic per billing day) */ billVariance: 900,
        /** days after a bill posts before load-shedding starts */ graceDays: 3,
        /** one-time mood hit the day the light goes */ sheddingMoodHit: 4,
        /** reconnection fee on top of the debt once shedding has started */ reconnectFee: 300
    },
    /** paying a civic bill remotely (phone) costs this convenience fee —
   *  walking into the government-area office is always free */ phonePayFee: 50,
    /** KGIRS — the state revenue service. Assesses a cut of what you EARNED. */ kgirs: {
        cycleDays: 10,
        /** flat share of the cycle's income (Nigeria-ish PAYE metaphor) */ rate: 0.075,
        /** even a hustler with ₦0 income files something small */ minAssessment: 300,
        /** days after assessment before the warrant issues */ graceDays: 4,
        /** extra share of the assessed tax when the police collects it */ warrantFineRate: 0.25,
        /** reputation hit the day the warrant issues */ warrantReputationHit: 5
    },
    /** EFCC — whistleblowers eat too: file a tip, the commission recovers. */ efcc: {
        tipCooldownDays: 3,
        /** your reward is this share of what the commission recovers */ rewardRate: 0.05,
        /** days until a filed tip resolves */ resolveDays: 2,
        /** seeded recovery amounts (deterministic per tip id) */ recoveries: [
            4000,
            9000,
            18000,
            42000,
            120000
        ]
    },
    /** the markets breathe: prices move daily, every 3rd day is market day */ market: {
        markets: [
            'kpata-market',
            'food-area'
        ],
        minMult: 0.85,
        maxMult: 1.35,
        /** every Nth day is a market day — blanket discount at both markets */ marketDayEvery: 3,
        marketDayMult: 0.9,
        /** seasonal flavour events (weighted pick, deterministic per day) */ events: [
            {
                icon: '🍅',
                label: 'Tomato glut',
                note: 'Tomatoes full everywhere — peppers dey almost free.',
                mealBias: 'groceries',
                biasMult: 0.82,
                weight: 3
            },
            {
                icon: '🛢️',
                label: 'Fuel scarcity',
                note: 'Queue for fuel reach two junctions — everything cost small more.',
                weight: 3
            },
            {
                icon: '🎉',
                label: 'Festive season',
                note: 'Ram and rice prices climb — everybody dey cook for somebody.',
                mealBias: 'jollof',
                biasMult: 1.25,
                weight: 2
            },
            {
                icon: '🐮',
                label: 'Suya rush',
                note: 'Wedding season — ram meat scarce round the grill.',
                mealBias: 'suya',
                biasMult: 1.2,
                weight: 2
            },
            {
                icon: '🌧️',
                label: 'Rain scatter market',
                note: 'Rain beat Kpata today — some traders no open at all.',
                weight: 2
            },
            {
                icon: '🚚',
                label: 'New supply enter',
                note: 'Fresh trailer offload — market soft small today.',
                mealBias: 'bread-akara',
                biasMult: 0.85,
                weight: 2
            }
        ],
        /** chance (0–1) a day rolls a flavour event at all */ eventChance: 0.55
    },
    /**
   * M6 — THE NIGHT MARKET. Every evening the Food Strip turns: the day
   * bukas wind down and the night stalls wake — suya coals, boli, pepper
   * soup. Night dishes price BELOW the day rate (night markets feed the
   * late hustler), the multiplier seeded per day so prices still breathe.
   */ nightMarket: {
        /** where the night stalls line up */ locationId: 'food-area',
        /** the slots the night market is open */ opensAt: [
            'evening',
            'night'
        ],
        /** seeded per-day discount band on night dishes */ minMult: 0.78,
        maxMult: 0.95
    }
};
const CHAOS = {
    /** chance (0–1) a heavy-sky day blows a transformer (rain alone never does) */ blowoutChance: {
        storm: 0.45,
        flood: 0.7
    },
    /** outage length band, in days (seeded per blowout) */ outageDays: {
        min: 1,
        max: 2
    },
    /** a shop caught in a BLACKOUT zone with no power backup earns this share
   *  (harsher than plain shedding — the whole feeder is down) */ blackoutIncomeFactor: 0.25,
    /** a generator shop burns this much fuel per dark day, drawn from the till
   *  like a wage (solar shops drink sunlight and pay nothing) */ generatorFuelPerDay: 600,
    /** chance (0–1) any day rolls a cash-scarcity morning (the naira dries up) */ scarcityChance: 0.18,
    /** scarcity law: the ATM pays out at most this per day */ atmCap: 5000,
    /** the POS agent's levy: this share of any instant withdrawal */ posFeeRate: 0.02,
    /** black-market fuel surge on scarcity days (personal-vehicle pump price) */ fuelSurgeMult: 1.6,
    /** POS-agent businesses earn this multiplier on scarcity days (commissions) */ posBoostMult: 1.35,
    /** market liquidity fold: a cash crunch lifts prices, an ajo payout softens them */ scarcityMarketMult: 1.12,
    payoutMarketMult: 0.92,
    /** every Nth day the ajo/esusu circles pay out (traders flush with cash) */ payoutEvery: 9,
    /** community fix pool: naira target before the technician is called */ poolTarget: 12000,
    /** seeded NPC daily contribution band into the pool */ poolNpcMin: 1500,
    poolNpcMax: 3500,
    /** what one player contribution costs (pick one per dark day) */ poolTiers: [
        500,
        1000,
        2500
    ],
    /** restoring the light pays the spirit and the street */ fixMood: 4,
    fixReputation: 3
};
const GOALS = {
    /** goals rolled per day */ perDay: 3,
    /** ₦1,000 when all four onboarding steps land (Street Certified) */ onboardingReward: 1000,
    /** the onboarding steps, in display order */ onboardingSteps: [
        {
            id: 'travel',
            label: 'Make your first journey',
            hint: 'Open the Map and ride somewhere.'
        },
        {
            id: 'work',
            label: 'Run your first hustle',
            hint: 'A shift, a hustle or a gig — anything that pays.'
        },
        {
            id: 'meal',
            label: 'Eat a real meal',
            hint: 'Hunger no dey hustle for anybody.'
        },
        {
            id: 'earn',
            label: 'Earn your first ₦500',
            hint: 'Every big name started from something small.'
        }
    ],
    pool: [
        {
            id: 'gig-run',
            kind: 'gig',
            label: 'Run a Motor Park gig',
            target: 1,
            cash: 500,
            xp: 15
        },
        {
            id: 'eat-well',
            kind: 'meal',
            label: 'Eat a proper meal',
            target: 1,
            cash: 250,
            xp: 8
        },
        {
            id: 'till-run',
            kind: 'collect',
            label: 'Collect your shop till',
            target: 1,
            cash: 400,
            xp: 12
        },
        {
            id: 'waka',
            kind: 'travel',
            label: 'Travel anywhere',
            target: 1,
            cash: 250,
            xp: 8
        },
        {
            id: 'gift-love',
            kind: 'gift',
            label: 'Gift a paddy',
            target: 1,
            cash: 400,
            xp: 12
        },
        {
            id: 'light-bill',
            kind: 'nepa',
            label: 'Settle the NEPA bill',
            target: 1,
            cash: 350,
            xp: 10
        },
        {
            id: 'tax-clean',
            kind: 'tax',
            label: 'Clear your KGIRS tax',
            target: 1,
            cash: 450,
            xp: 12
        },
        {
            id: 'street-smart',
            kind: 'hustle',
            label: 'Finish a street hustle',
            target: 1,
            cash: 450,
            xp: 12
        },
        {
            id: 'shift-go',
            kind: 'job',
            label: 'Work a job shift',
            target: 1,
            cash: 400,
            xp: 12
        },
        {
            id: 'gist-time',
            kind: 'chat',
            label: 'Catch gist with an NPC',
            target: 2,
            cash: 300,
            xp: 10
        },
        {
            id: 'gym-day',
            kind: 'workout',
            label: 'Hit the gym',
            target: 1,
            cash: 300,
            xp: 10
        },
        {
            id: 'book-smart',
            kind: 'study',
            label: 'Study for an hour',
            target: 1,
            cash: 300,
            xp: 10
        },
        {
            id: 'bank-move',
            kind: 'deposit',
            label: 'Bank some money',
            target: 1,
            cash: 250,
            xp: 8
        },
        {
            id: 'double-waka',
            kind: 'travel',
            label: 'Make two journeys',
            target: 2,
            cash: 500,
            xp: 15
        }
    ]
};
const CHILL = {
    /** needs decay multiplier while chill is on */ decayMult: 0.5,
    /** weather mood hits multiply by this */ weatherMoodMult: 0.5,
    /** KGIRS warrant grace multiplier */ warrantGraceMult: 3,
    /** NEPA shedding grace multiplier */ sheddingGraceMult: 2
};
const SHIELD = {
    /** smart-skill XP multiplier for kid + teen (education-first) */ studyBoost: 1.25,
    /** the scammer game pays once per in-game day */ scammer: {
        baseCash: 150,
        streakBonus: 25,
        /** streak bonus stops growing here (the honest ceiling) */ streakCap: 10,
        smartXp: 8,
        mood: 2
    },
    /** kid-band chat: preset emotes only (no free lines, ever) */ kidEmotes: [
        {
            id: 'wave',
            glyph: '👋',
            label: 'Greet',
            reply: 'Ah, you dey greet! Blessings, pikin.',
            fam: 1
        },
        {
            id: 'smile',
            glyph: '😊',
            label: 'Smile',
            reply: 'That your smile na free medicine.',
            fam: 1
        },
        {
            id: 'fire',
            glyph: '🔥',
            label: 'Hype',
            reply: 'Haha! You too much!',
            fam: 2
        },
        {
            id: 'clap',
            glyph: '👏',
            label: 'Applaud',
            reply: 'Thank you my dear. God go bless you.',
            fam: 2
        },
        {
            id: 'pray',
            glyph: '🙏',
            label: 'Pray',
            reply: 'Amen o! You be correct pikin.',
            fam: 2
        },
        {
            id: 'fist',
            glyph: '✊',
            label: 'Solidarity',
            reply: 'One love! We dey together.',
            fam: 1
        }
    ]
};
const ELDER = {
    decayMult: 0.75,
    /** travel/working transitions breathe longer (× on the ms) */ transitionMult: 1.4
};
const FORTRESS = {
    /** the biggest single income event the city can honestly pay */ singleCeiling: 1_500_000,
    /** the most naira one in-game day may honestly earn */ dayCeiling: 3_000_000,
    /** transactions per clock slot before the flood gate shuts */ velocityCap: 24
};
const FESTIVALS = {
    /** the length of one Lokoja year, in game days */ yearDays: 72,
    /** year-day anchors (1-based). The Eid family shifts by the drift. */ anchors: {
        newYear: 1,
        /** Eid-el-Fitr — day 1 of 2 (Ramadan fast runs the 10 days before it) */ eidFitr: 13,
        eidFitrDays: 2,
        ramadanDays: 10,
        workersDay: 27,
        childrensDay: 30,
        regatta: 37,
        regattaDays: 2,
        democracyDay: 43,
        /** Eid-el-Kabir — the ram market runs the 3 days before it */ eidKabir: 51,
        eidKabirDays: 2,
        ramMarketDays: 3,
        newYam: 57,
        independenceDay: 59,
        /** Detty December — the year's last 9 days */ dettyStart: 64
    },
    /** the Islamic-calendar drift: the Eid family slides this far per year,
   *  deterministically, bounded so it can never collide with the Regatta
   *  or Detty December */ eidDriftStep: 3,
    eidDriftMod: 9,
    /** day-festival market folds (ride the SAME market roll as everything) */ marketMult: {
        ramadan: 0.95,
        eid: 1.06,
        regatta: 1.1,
        ramMarket: 1.04,
        newYam: 1.08,
        independence: 1.05,
        detty: 1.2
    },
    /** the returnees' city: Motor Park gigs pay these festival premiums */ fleetMult: {
        detty: 1.35,
        regatta: 1.25,
        independence: 1.2
    },
    /** morning mood gifts on festival days */ mood: {
        newYear: 3,
        eid: 4,
        workers: 1,
        children: 2,
        regatta: 2,
        democracy: 1,
        newYam: 2,
        independence: 3,
        detty: 2,
        wedding: 1
    },
    /** attending a festival in person: mood / reputation / seeded spray */ attend: {
        mood: 4,
        repFestivals: [
            'eid-fitr',
            'eid-kabir',
            'independence'
        ],
        rep: 2,
        sprayMin: 100,
        sprayMax: 800
    },
    /** the regatta: four neighbourhood boat teams a year */ regattaTeams: [
        'Ganaja Lightning',
        'Kpata Warriors',
        'Patti Eagles',
        'Adankolo Sharks'
    ],
    sponsorFee: 2000,
    sponsorWinPayout: 6000,
    sponsorWinRep: 8,
    sponsorLoseRep: 2,
    betTiers: [
        500,
        1000,
        2000
    ],
    betOdds: 2.5,
    /** ram market: base price × proximity ladder (day 1 → Eid-eve) */ ramBasePrice: 40000,
    ramLadder: [
        0.9,
        1.0,
        1.15
    ],
    ramWobble: 0.06,
    /** one ram butchers into this many meat packs to share */ meatPacksPerRam: 6,
    meatShareFamiliarity: 12,
    meatShareMood: 4,
    meatShareRep: 1,
    /** aso-ebi: the wedding fabric, bought at Kpata */ asoEbiPrice: 1500,
    /** wedding gift tiers + the rewards (aso-ebi doubles the respect) */ weddingGiftTiers: [
        500,
        1000,
        2000
    ],
    weddingMood: 8,
    weddingRep: 2,
    weddingRepAsoEbi: 4,
    /** a wedding every N days, seeded inside day 1–7 of the cycle */ weddingEvery: 9,
    weddingVenues: [
        'historic-lokoja',
        'confluence',
        'kpata-market'
    ],
    /** town-union paving: a project every N days, one zone, community pool */ pavingEvery: 14,
    pavingTarget: 10000,
    pavingNpcMin: 800,
    pavingNpcMax: 1800,
    pavingTiers: [
        500,
        1000,
        2500
    ],
    /** a finished street stays smooth this many days — journeys in ×cheaper */ pavedDays: 20,
    pavedMinutesMult: 0.85,
    pavedRep: 4,
    pavedMood: 2,
    /** Ramadan: the iftar blessing on an evening/night meal */ iftarMood: 3,
    /** Ramadan's quieter days deepen the night market's discount */ ramadanNightMult: 0.92,
    /** weddings are seeded from the streets' name pool */ coupleFirstNames: [
        'Musa',
        'Hauwa',
        'Emeka',
        'Ngozi',
        'Abubakar',
        'Zainab',
        'Chidi',
        'Amaka',
        'Sule',
        'Blessing',
        'Ibrahim',
        'Halima',
        'Tunde',
        'Funke',
        'Yakubu',
        'Rukayya'
    ]
};
const BIZ = {
    /** unclaimed income stops accruing after this many days — go show your shop */ accrualCapDays: 7,
    /** each owned business adds this share to the NEPA bill (fridges, freezers) */ nepaLoadPerBiz: 0.22,
    /** income bonus: +1% per `repBonusDivisor` reputation above 500, capped */ repBonusDivisor: 100,
    repBonusBase: 500,
    repBonusCap: 0.25,
    /** upgrade: cost = buyCost × upgradeCostMult × currentLevel */ upgradeCostMult: 0.6,
    /** income multiplier per level: ×(1 + levelIncomeStep × (level−1)) */ levelIncomeStep: 0.35,
    maxLevel: 5,
    /** non-market shops wobble inside this seeded daily band instead of a market mult */ wobbleBand: 0.08,
    /* ---- M5 — staff & power (the shop as a small enterprise) ---- */ /** each attendant lifts income by this share (+22% each) */ staffIncomeBoost: 0.22,
    /** every attendant draws this daily wage straight from the till */ staffWagePerDay: 400,
    /** one-time hiring fee per attendant */ staffHireFee: 2000,
    /** a shop caught dark by load-shedding (no power backup) earns this share */ sheddingIncomeFactor: 0.75,
    /** a solar shop's share of the normal per-shop NEPA load */ nepaLoadWithSolar: 0.08,
    /** one-time installs — the power ladder + their honest trade-offs */ upgrades: {
        generator: {
            label: 'Generator',
            emoji: '🔌',
            cost: 28000,
            blurb: 'When NEPA cuts the city, your shop still glows — no dark-day penalty.'
        },
        solar: {
            label: 'Solar system',
            emoji: '☀️',
            cost: 65000,
            blurb: 'Silent power: shedding penalty gone, and your NEPA meter load drops to almost nothing.'
        }
    },
    types: {
        'kpata-stall': {
            name: 'Kpata Provisions Stall',
            locationId: 'kpata-market',
            emoji: '🧺',
            buyCost: 18000,
            baseIncome: 1100,
            unlockLevel: 1,
            blurb: 'A wooden stall in the row under the Kpata sheds. Rice in bags, groundnut in bottles.',
            /** which market engine row moves this shop's prices (null = seeded wobble) */ marketId: 'kpata-market'
        },
        'ganaja-kiosk': {
            name: 'Ganaja Phone Kiosk',
            locationId: 'ganaja-junction',
            emoji: '📱',
            buyCost: 22000,
            baseIncome: 1250,
            unlockLevel: 2,
            blurb: 'Glass kiosk at Ganaja Junction — chargers, earpieces, transfer POS.',
            marketId: null,
            /** M8 — this shop runs a terminal: cash-scarcity days are its harvest */ pos: true
        },
        'okada-stand': {
            name: 'Motor-Park Okada Stand',
            locationId: 'transport-area',
            emoji: '🛵',
            buyCost: 30000,
            baseIncome: 1450,
            unlockLevel: 3,
            blurb: 'Two bikes on your stand at the motor park. Riders bring the day’s take at night.',
            marketId: null
        },
        'food-joint': {
            name: 'Food-Strip Buka',
            locationId: 'food-area',
            emoji: '🍲',
            buyCost: 42000,
            baseIncome: 1900,
            unlockLevel: 4,
            blurb: 'A buka of your own on the food strip — amala that makes people cross town.',
            marketId: 'food-area'
        }
    }
};
const FLEET = {
    /** gig offers per owned vehicle per day */ gigsPerModelPerDay: 2,
    /** hired runs pay above the counter fare (you are the driver — no park cut) */ payoutMult: 1.18,
    /** rain premium per model — okada rain runs are misery, and misery pays */ rainPayout: {
        okada: 1.4,
        keke: 1.22,
        taxi: 1.12,
        danfo: 1.12
    },
    /**
   * M6 — rough-sky bonus on top of the rain premium. A confluence
   * thunderstorm is rain turned to eleven; a flood day is the hardest
   * driving of the year. Stacks multiplicatively with rainPayout — the
   * M4 margin law (payout − fuel > 0) only gets wider as the sky darkens.
   */ roughSkyBonus: {
        storm: 1.3,
        flood: 1.6
    },
    /** player XP per completed run */ gigXp: 8,
    /** hustle-skill XP per completed run */ gigHustleXp: 6
};
const SOCIAL = {
    /** buyable gifts — familiarity jumps scale with the price tag */ gifts: [
        {
            id: 'recharge-card',
            label: 'Recharge card',
            emoji: '📞',
            cost: 500,
            familiarity: 8,
            note: '₦500 airtime — small but always welcome.'
        },
        {
            id: 'suya-night',
            label: 'Suya wrap',
            emoji: '🍢',
            cost: 1500,
            familiarity: 16,
            note: 'Evening suya from the night grill — paddies first.'
        },
        {
            id: 'ankara',
            label: 'Ankara fabric',
            emoji: '🧵',
            cost: 4000,
            familiarity: 28,
            note: 'Six yards of good Ankara — na real gift be that.'
        }
    ],
    /** mood the PLAYER feels after giving (generosity warms the giver too) */ giftMood: 4,
    /** hangout — pull a paddy out for the evening */ hangout: {
        /** what a night out with a paddy costs you (on top of your own fun) */ cost: 1000,
        /** mood hit for the pair of you */ mood: 8,
        /** familiarity the evening earns */ familiarity: 6,
        /** days before you can hang out with the SAME npc again */ cooldownDays: 3,
        /** hangouts happen after work hours only */ slots: [
            'evening',
            'night'
        ]
    },
    /** chance (0–1) a paddy (familiarity ≥ favourTier) drops real gist on a chat */ favorChance: 0.3,
    /** minimum familiarity before favours start passing your way */ favorTierMin: 40
};
const RIVERS = {
    /** the river's year, on the SAME 72-day clock as the festivals */ season: {
        /** year-day the rise begins (dry season before it) */ riseStart: 41,
        /** rise ends → the water sits at its peak (Lokoja's Sept–Oct) */ peakStart: 55,
        /** the recede begins */ recedeStart: 63,
        /** year-day the river is fully back in its banks */ dryBy: 71
    },
    /** per-day seeded wobble on the level (the river breathes) */ wobble: 0.05,
    /** the level a low-lying zone goes under water (deeper city = higher bar) */ cutAt: {
        confluence: 0.35,
        'ganaja-junction': 0.55,
        'kpata-market': 0.75
    },
    /** the Crusher sells sand on the Patti road — a sack costs this much */ sackPrice: 600,
    /** sacks of sand + patience per walkway segment */ sacksPerSegment: 2,
    /** energy to lay one segment (wading with sand on your head) */ layEnergy: 8,
    /** walkway segments needed before a zone's crossing opens */ segments: {
        confluence: 4,
        'ganaja-junction': 5,
        'kpata-market': 6
    },
    /** where the Crusher's sand is sold (the Patti road quarry trailhead) */ sandVendorZone: 'mount-patti',
    /** a finished walkway rides SLOW (careful steps on wet bags) — minutes ×this */ walkwayMinutesMult: 1.35,
    /** crossing tolls: what one pedestrian pays (the player picks the tier) */ tollTiers: [
        30,
        60,
        120
    ],
    /** seeded NPC crossings/day band at full surge (scales with the level) */ tollCrossingsMin: 8,
    tollCrossingsMax: 26,
    /** the fishermen's price for a canoe of your own */ canoeCost: 18000,
    /** the ferry fare: counter fare × (fareMult + levelPremium × level) */ ferryFareMult: 2.2,
    ferryLevelPremium: 0.8,
    /** running a ferry gig costs this energy + one clock slot */ ferryEnergy: 10,
    /** ferry gigs a day (only while some zone is cut) */ ferryGigsPerDay: 2,
    /** the ferry jetty — where the canoes wait (the buses stop here) */ jettyId: 'transport-area',
    /** the return jetty inside a cut zone rows you back here */ cutReturnId: 'transport-area',
    /** the cold-room rescue: the deep surge's co-op quest */ rescue: {
        /** the level that wakes the rescue (the ice fish sellers start praying) */ triggerLevel: 0.7,
        /** the zone whose cold rooms need saving (Kpata's frozen stock) */ zoneId: 'kpata-market',
        /** pool target before the trucks roll */ poolTarget: 8000,
        npcMin: 600,
        npcMax: 1400,
        /** player contribution tiers (once/day, in person) */ tiers: [
            500,
            1000,
            2000
        ],
        /** a saved zone earns this share of normal income through the surge */ savedIncomeFactor: 0.9,
        /** a drowning zone earns this share (stock spoiling in the damp) */ floodIncomeFactor: 0.5,
        /** the street's thanks when the stock reaches high ground */ repReward: 4,
        moodReward: 3
    },
    /** market fold: the water lifts prices (supply cut) — ×(1 + perLevel × level) */ marketMultPerLevel: 0.25,
    marketMultCap: 1.25,
    /** living in the damp: daily mood cost when the river holds above this */ dampLevel: 0.55,
    dampMoodHit: 2,
    /** the day the river walks back into its banks, the city breathes */ reliefBelow: 0.35,
    reliefMood: 3
};
const LADDER = {
    education: {
        /** FUL enrollment: the fee, the level, the semester clock */ enrollFee: 25000,
        enrollLevel: 2,
        semesterDays: 18,
        examDays: 3,
        /** lectures a semester expects (the exam reads them) */ lecturesNeeded: 12,
        /** one lecture: smart-skill XP + the tutorial stipend */ lectureSmartXp: 12,
        lectureStipend: 150,
        /** the exam's honest bar: smart + lectures × 0.5 ≥ this */ examPassScore: 8,
        semestersToGraduate: 4,
        convocationInDays: 2,
        graduateRep: 12,
        graduateMood: 10,
        /** the Dean's hustle grant: 8 lectures in one semester pays once */ deansGrant: 2000,
        deansGrantRep: 3,
        deansLectures: 8,
        /** ASUU: the strike chance per semester + the length band */ strikeChance: 0.3,
        strikeMinDays: 5,
        strikeMaxDays: 8,
        /** the strike lands on this lecture-day of the semester */ strikeStartDay: 7
    },
    housing: {
        rentCycleDays: 6,
        baseRent: 900,
        lateFee: 400,
        /** chance a rent cycle lands the landlord's wahala */ wahalaChance: 0.35,
        properties: [
            {
                id: 'family-room',
                name: 'Family Room — Adankolo',
                locationId: 'university-area',
                price: 85000,
                level: 3,
                comfort: 1
            },
            {
                id: 'self-contain',
                name: 'Self-Contain — Ganaja',
                locationId: 'ganaja-junction',
                price: 180000,
                level: 5,
                comfort: 2
            },
            {
                id: 'flat-gra',
                name: 'Two-Bedroom Flat — GRA',
                locationId: 'government-area',
                price: 420000,
                level: 7,
                comfort: 3
            },
            {
                id: 'duplex',
                name: 'Duplex — Adankolo Layout',
                locationId: 'university-area',
                price: 950000,
                level: 9,
                comfort: 5
            }
        ],
        furnishTiers: [
            {
                tier: 1,
                cost: 15000,
                label: 'Fan + curtains',
                mood: 1
            },
            {
                tier: 2,
                cost: 40000,
                label: 'Generator + TV',
                mood: 2
            },
            {
                tier: 3,
                cost: 90000,
                label: 'Full AC + solar',
                mood: 3
            }
        ],
        /** the sleep law: +this energy per comfort point */ sleepEnergyPerComfort: 3
    },
    japa: {
        unlockLevel: 8,
        nimcFee: 3000,
        nimcQueueDays: 1,
        passportFee: 25000,
        passportQueueDays: 3,
        /** the street agent: cheaper, faster, and sometimes a wash */ agentFee: 12000,
        agentRealChance: 0.6,
        agentRepHit: 3,
        policeFee: 5000,
        ticketFee: 150000,
        repReward: 15,
        moodReward: 15,
        /** the morning after the send-off: the first remittance lands */ remittance: 50000
    },
    mopol: {
        /** police shifts before the escort detail trusts you */ shiftsToUnlock: 5,
        /** the detail runs every Nth day */ escortEvery: 3,
        escortPay: 8000,
        escortRep: 3,
        /** the siren: the next journeys ride ×this minutes while it lasts */ sirenMinutesMult: 0.8,
        sirenDays: 2
    }
};
const PULSE = {
    /** street credit (rep) a real share pays — once per in-game day */ shareStreetCredit: 2,
    /** the cooldown key on player.cooldowns (value = the in-game day it last paid) */ shareCooldownKey: 'pulse-share',
    /** the arrival book's cap (oldest postcards fall off) */ arrivalCap: 20
};
}),
"[project]/src/game/data/schools.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LEGACY_ANCHOR_XY",
    ()=>LEGACY_ANCHOR_XY,
    "SCHOOLS",
    ()=>SCHOOLS,
    "SCHOOL_BY_ID",
    ()=>SCHOOL_BY_ID,
    "SCHOOL_PLANS",
    ()=>SCHOOL_PLANS,
    "SCHOOL_SITES_PROJECTED",
    ()=>SCHOOL_SITES_PROJECTED,
    "WORLD_HALF",
    ()=>WORLD_HALF,
    "projectLatLon",
    ()=>projectLatLon
]);
/**
 * LOKOJA LIFE — The Schools of Lokoja (Stage 7)
 * -----------------------------------------------
 * Real schools of the real city, placed by their REAL coordinates:
 *  - OpenStreetMap ground truth (the dataset Google Maps/Earth render):
 *    Federal University Lokoja's Felele permanent site is mapped building by
 *    building (faculties, lecture theatres, gate) and Faithview Academy has
 *    its exact mapped campus polygon.
 *  - Google plus-code decodes: Crowther Memorial College (RP4R+9M8 260101)
 *    and Julitola International School (RMJ6+GF8) decode to real positions.
 *  - Directory/news verification: GYB Model Science Secondary School
 *    (Adankolo New Layout Rd), Al-Azhar International College (Okene road /
 *    Lokongoma), Kogi State Polytechnic (Lokoja–Abuja expressway, Felele),
 *    Salem University, Baptist High School, Christfield School, and the
 *    state College of Nursing Sciences (specialist-hospital quarter).
 *
 * The projection is the SAME one the geo pipeline uses (1 unit = 26 m,
 * north = -Z, world centre 6.753E 7.790N), so a school sits beside the same
 * real road it sits beside in Lokoja. Sites that fall outside the playable
 * circle (FUL's permanent site is ~10 km out, exactly like real life) are
 * pulled to the world rim ALONG their real access road — the game world
 * compresses the city, it does not move it.
 *
 * Pure data + deterministic derivation. No economy, no state.
 */ /* ------------------------------- projection --------------------------------- */ /** geo pipeline anchors — must match scripts/geo/pipeline.py exactly */ const LAT0 = 7.79;
const LON0 = 6.753;
const SCALE_M = 26.0;
const METERS_PER_DEG_LAT = 110540.0;
const METERS_PER_DEG_LON = 111320.0 * Math.cos(LAT0 * Math.PI / 180);
function projectLatLon(lat, lon) {
    const east = (lon - LON0) * METERS_PER_DEG_LON;
    const north = (lat - LAT0) * METERS_PER_DEG_LAT;
    return [
        east / SCALE_M,
        -north / SCALE_M
    ];
}
const SCHOOLS = [
    {
        id: 'ful-felele',
        name: 'Federal University Lokoja',
        shortName: 'FUL',
        kind: 'university',
        lat: 7.85343,
        lon: 6.68416,
        anchor: 'osm',
        sourceNote: 'OSM: gate + 12 faculty/LT buildings on the permanent site',
        founded: '2011',
        motto: 'Knowledge for Development',
        tagline: 'The permanent site — faculties, lecture theatres, ambition',
        description: 'The federal university on its Felele permanent site, off the Abuja expressway. Lecture theatres LT A and LT B, the Twin Theatre, faculty blocks and the e-learning centre stand along real mapped drives. It is a long ride from town — every student knows it.',
        color: '#1D5C8A',
        accent: '#0E3250',
        emoji: '🎓',
        w: 44,
        d: 34,
        plateauR: 30,
        blocks: 4,
        field: true,
        paint: '#e8e2d2',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.35
    },
    {
        id: 'ful-adankolo',
        name: 'FUL Adankolo Campus',
        shortName: 'FUL Adankolo',
        kind: 'university',
        lat: 7.7931,
        lon: 6.7621,
        anchor: 'district',
        sourceNote: 'OSM places the FUL node in the Adankolo side of town',
        founded: '2011',
        motto: 'Knowledge for Development',
        tagline: 'The old campus where it all began',
        description: 'The university’s first campus in Adankolo, before the permanent site. Smaller, older, closer to town — evening lectures spill out onto the Adankolo New Layout road.',
        color: '#2E6E8A',
        accent: '#173E50',
        emoji: '📚',
        w: 28,
        d: 22,
        plateauR: 18.5,
        blocks: 2,
        field: false,
        paint: '#e8e2d2',
        unlockLevel: 2,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'ksp-felele',
        name: 'Kogi State Polytechnic',
        shortName: 'KSP',
        kind: 'polytechnic',
        lat: 7.8495,
        lon: 6.7042,
        anchor: 'district',
        sourceNote: 'Institution address: "along Lokoja/Abuja Expressway" — snapped to the real A2',
        founded: '1993',
        motto: 'Technology for Self-Reliance',
        tagline: 'HND hustle on the expressway',
        description: 'The state polytechnic along the Abuja expressway at Felele. Engineering workshops, ND/HND lecture blocks, and the famous “poly” energy that spills onto the highway at closing time.',
        color: '#7A5A1D',
        accent: '#453209',
        emoji: '🛠️',
        w: 32,
        d: 26,
        plateauR: 21.5,
        blocks: 3,
        field: true,
        paint: '#e2d6b4',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.3
    },
    {
        id: 'salem-university',
        name: 'Salem University',
        shortName: 'Salem',
        kind: 'university',
        lat: 7.8378,
        lon: 6.7136,
        anchor: 'district',
        sourceNote: 'Directory-verified private university on the Abuja road corridor',
        founded: '2007',
        motto: 'Raising Leaders, Transforming Society',
        tagline: 'The private campus with the quiet gates',
        description: 'The mission-run private university on the Abuja road. Neat painted blocks, a Chapel on the lawn, and the quietest reading culture in Lokoja.',
        color: '#5C2D6E',
        accent: '#341542',
        emoji: '⛪',
        w: 28,
        d: 22,
        plateauR: 18.5,
        blocks: 2,
        field: false,
        paint: '#efe6d0',
        unlockLevel: 3,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.25
    },
    {
        id: 'college-nursing',
        name: 'College of Nursing Sciences',
        shortName: 'Nursing Schl.',
        kind: 'college',
        lat: 7.7968,
        lon: 6.7402,
        anchor: 'district',
        sourceNote: 'State school of nursing sits in the specialist-hospital quarter',
        founded: '1976',
        motto: 'Care, Competence, Compassion',
        tagline: 'White uniforms, steady hands',
        description: 'The state nursing college by the specialist hospital. Practical halls, demonstration dummies, and students in crisp white going for morning duty.',
        color: '#1F7A6D',
        accent: '#0C3B34',
        emoji: '🩺',
        w: 24,
        d: 18,
        plateauR: 15.5,
        blocks: 2,
        field: false,
        paint: '#f0ece0',
        unlockLevel: 3,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'crowther-memorial',
        name: 'Crowther Memorial College',
        shortName: 'Crowther',
        kind: 'secondary',
        lat: 7.80591,
        lon: 6.74163,
        anchor: 'plus-code',
        sourceNote: 'Google plus-code RP4R+9M8, Lokoja 260101 — decodes to this point',
        founded: '1956',
        motto: 'Knowledge, Discipline, Service',
        tagline: 'The old mission college under the hill',
        description: 'One of Lokoja’s heritage colleges, in the old GRA quarter beneath Mount Patti. Old students’ association still fights for its land — that is how much this school means.',
        color: '#8A3A28',
        accent: '#4A1D12',
        emoji: '🏫',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 2,
        field: true,
        paint: '#e8d8b8',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'gyb-model-adankolo',
        name: 'GYB Model Science Secondary School',
        shortName: 'GYB Model',
        kind: 'secondary',
        lat: 7.8009,
        lon: 6.7587,
        anchor: 'district',
        sourceNote: 'News-verified: GYB Model Science SS (ex-Government Day SS), Adankolo New Layout Rd',
        founded: '1992',
        motto: 'Science is Light',
        tagline: 'The science school of Adankolo',
        description: 'The model science secondary school on Adankolo New Layout road — MTN quiz finalist energy, laboratories, and morning assembly you can hear three streets away.',
        color: '#C4562A',
        accent: '#7C2D12',
        emoji: '🧪',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 2,
        field: true,
        paint: '#e4dcc4',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'faithview-academy',
        name: 'Faithview Academy',
        shortName: 'Faithview',
        kind: 'secondary',
        lat: 7.75337,
        lon: 6.73858,
        anchor: 'osm',
        sourceNote: 'OSM: amenity=school grounds mapped at this exact position',
        founded: '2003',
        motto: 'Faith. Knowledge. Vision.',
        tagline: 'The academy on the southern road',
        description: 'A private academy on the southern outskirts, mapped school grounds and all. Small classes, big dreams, and a compound that stays alive till prep time.',
        color: '#2E7D5B',
        accent: '#17402E',
        emoji: '✏️',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 1,
        field: false,
        paint: '#e0dcc8',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke'
        ],
        travelModifier: 1.1
    },
    {
        id: 'al-azhar-college',
        name: 'Al-Azhar International College',
        shortName: 'Al-Azhar',
        kind: 'secondary',
        lat: 7.7962,
        lon: 6.7265,
        anchor: 'district',
        sourceNote: 'Directory-verified international college, Okene-road corridor',
        founded: '2005',
        motto: 'Ilm and Akhlaq',
        tagline: 'The international college on Okene road',
        description: 'The international college along the Okene road after Lokongoma. Arabic and English side by side, green-and-white uniform, and some of the calmest students in the city.',
        color: '#2E7D5B',
        accent: '#173E2A',
        emoji: '🕌',
        w: 30,
        d: 24,
        plateauR: 19.5,
        blocks: 1,
        field: true,
        paint: '#e6e0cc',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.1
    },
    {
        id: 'baptist-high',
        name: 'Baptist High School',
        shortName: 'Baptist HS',
        kind: 'secondary',
        lat: 7.8022,
        lon: 6.7498,
        anchor: 'district',
        sourceNote: 'Directory-verified Baptist mission secondary school, central Lokoja quarter',
        founded: '1979',
        motto: 'The Truth Shall Set You Free',
        tagline: 'The mission school with the old choir',
        description: 'The Baptist mission secondary school in central Lokoja. Famous choir, famous discipline, and inter-house sports that stop the whole street.',
        color: '#3A5A8A',
        accent: '#1E3350',
        emoji: '📖',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 1,
        field: true,
        paint: '#e2dcc6',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'julitola-intl',
        name: 'Julitola International School',
        shortName: 'Julitola',
        kind: 'secondary',
        lat: 7.8313,
        lon: 6.6611,
        anchor: 'plus-code',
        sourceNote: 'Google plus-code RMJ6+GF8, Lokoja 264103 — Abuja-road corridor',
        founded: '2001',
        motto: 'Raising Champions',
        tagline: 'The international school by the expressway',
        description: 'The international school out on the Abuja road. Yellow school bus, intercom at the gate, and the sort of end-of-term parties that trend in Lokoja.',
        color: '#B0812A',
        accent: '#5C3E12',
        emoji: '🚌',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 1,
        field: false,
        paint: '#ece4c8',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.25
    },
    {
        id: 'christfield-school',
        name: 'Christfield School',
        shortName: 'Christfield',
        kind: 'secondary',
        lat: 7.7892,
        lon: 6.7442,
        anchor: 'district',
        sourceNote: 'Directory-verified nursery/primary/secondary, central-south Lokoja',
        founded: '2007',
        motto: 'Built on the Rock',
        tagline: 'Nursery bells to senior class',
        description: 'The all-through school in central-south Lokoja — tiny nursery chairs at one end, WAEC class at the other, and mothers at the gate from 1 pm.',
        color: '#C48A2A',
        accent: '#6E4A12',
        emoji: '🎒',
        w: 24,
        d: 18,
        plateauR: 15.5,
        blocks: 1,
        field: false,
        paint: '#e8e0c8',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    }
];
const SCHOOL_BY_ID = Object.fromEntries(SCHOOLS.map((s)=>[
        s.id,
        s
    ]));
const WORLD_HALF = 310;
/** pull any site inside this rim so the gate is reachable on foot (WALK_BOUND 292 − margin) */ const RIM_LIMIT = 272;
function buildSites() {
    return SCHOOLS.map((s)=>{
        const [x, z] = projectLatLon(s.lat, s.lon);
        const rim = Math.hypot(x, z);
        let px = x;
        let pz = z;
        let pulled = false;
        if (rim > RIM_LIMIT) {
            pulled = true;
            px = x / rim * RIM_LIMIT;
            pz = z / rim * RIM_LIMIT;
        }
        return {
            ...s,
            x: px,
            z: pz,
            rimPulled: pulled,
            mapX: 50 + px / (WORLD_HALF * 2 / 100),
            mapY: 50 + pz / (WORLD_HALF * 2 / 100)
        };
    });
}
const SCHOOL_SITES_PROJECTED = buildSites();
const LEGACY_ANCHOR_XY = [
    {
        id: 'home',
        x: -90.52,
        z: 34.1
    },
    {
        id: 'kpata-market',
        x: -70.68,
        z: 42.16
    },
    {
        id: 'ganaja-junction',
        x: -51.46,
        z: 89.28
    },
    {
        id: 'confluence',
        x: -40.3,
        z: 153.76
    },
    {
        id: 'mount-patti',
        x: -84.94,
        z: -135.78
    },
    {
        id: 'historic-lokoja',
        x: -68.2,
        z: -53.94
    },
    {
        id: 'government-area',
        x: -97.96,
        z: 18.6
    },
    {
        id: 'university-area',
        x: -187.86,
        z: -27.9
    },
    {
        id: 'food-area',
        x: -55.8,
        z: 50.84
    },
    {
        id: 'transport-area',
        x: -51.46,
        z: 67.58
    }
];
const SCHOOL_PLANS = {
    'ful-felele': [
        {
            kind: 'senate',
            name: 'The Senate Building',
            position: 'centrally on the main axis, straight past the grand entrance',
            inside: [
                "the Vice-Chancellor's executive suite",
                "the Registrar's corporate wing",
                'the central academic registry',
                'council chambers with the long meeting table'
            ],
            room: 'senate',
            lx: 0,
            lz: -12.2,
            studyLabel: "Greet the Vice-Chancellor's office"
        },
        {
            kind: 'library',
            name: 'The University Library',
            position: 'the heart of the central academic lawn',
            inside: [
                'book stack corridors cataloged by faculty',
                'the digital e-library network hub',
                'reference & serials sections',
                'student reading halls with long desks'
            ],
            room: 'library',
            lx: -13.2,
            lz: -12.2,
            studyLabel: 'Read in the main library'
        },
        {
            kind: 'faculty',
            name: 'Faculty of Arts',
            position: 'the north-east loop of the academic area',
            inside: [
                'English & Literary Studies, History, Theatre Arts wings',
                'the language laboratory with headset desks',
                'lecture rooms with rows of desks',
                'the staff common room'
            ],
            room: 'fac-arts',
            lx: -17.8,
            lz: -5.4,
            studyLabel: 'Practise in the language lab'
        },
        {
            kind: 'science-lab',
            name: 'Faculty of Science',
            position: 'on the western curve of the academic loop road',
            inside: [
                'advanced chemistry laboratories with fume hoods',
                'physics practical labs',
                'biological & geological workspaces with microscopes',
                'the faculty boardroom'
            ],
            room: 'fac-sci',
            lx: 14,
            lz: -5.4,
            studyLabel: 'Take a practical in the science labs'
        },
        {
            kind: 'faculty',
            name: 'Faculty of Social & Management Sciences',
            position: 'along the south-west academic corridor',
            inside: [
                'Economics, Political Science, Sociology offices',
                'Accounting & Business Administration wings',
                'computer simulation labs',
                'the GIS laboratory'
            ],
            room: 'lab',
            lx: 17.6,
            lz: -12.2,
            studyLabel: 'Book a GIS workstation'
        },
        {
            kind: 'lecture-theatre',
            name: 'Twin Lecture Theatre A',
            position: 'between the Faculty of Science and the Faculty of Arts',
            inside: [
                'a 250-seat stepped auditorium',
                'tiered theatre rows',
                'instructional podium with microphone',
                'ceiling projector brackets'
            ],
            room: 'theatre',
            lx: -5.4,
            lz: -5,
            studyLabel: 'Attend the lecture'
        },
        {
            kind: 'lecture-theatre',
            name: 'Twin Lecture Theatre B',
            position: 'shoulder to shoulder with Theatre A',
            inside: [
                'a 250-seat stepped auditorium',
                'tiered theatre rows',
                'instructional podium with microphone',
                'ceiling projector brackets'
            ],
            room: 'lt-b',
            lx: 4.8,
            lz: -5,
            studyLabel: 'Attend the lecture'
        },
        {
            kind: 'hostel',
            name: 'Felele Student Hostels',
            position: 'the south-eastern perimeter, zoned away from academic traffic',
            inside: [
                'shared rooms of metal bunk beds and personal lockers',
                'the common study lounge',
                'ablution blocks on every floor',
                "the porter's lodge at the steps"
            ],
            room: 'hostel',
            lx: -16,
            lz: 0.5,
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'Student Cafeteria',
            position: 'behind the central lawn, beside the faculties',
            inside: [
                'the serving counter with pots',
                'long dining benches',
                'the kitchen store'
            ],
            room: 'canteen',
            lx: 9,
            lz: -12.2
        },
        {
            kind: 'clinic',
            name: 'University Clinic',
            position: 'the quiet corner near the hostels',
            inside: [
                'consultation desk',
                'observation beds',
                'the medicine cabinet'
            ],
            room: 'clinic',
            lx: -17.4,
            lz: 14.4
        },
        {
            kind: 'watchtower',
            name: 'Security Watchtower',
            position: 'rising over the main gatehouse at the compound corner',
            inside: [
                'the elevated watch platform',
                'the perimeter radio base'
            ],
            lx: -19.5,
            lz: -12.2
        }
    ],
    'ful-adankolo': [
        {
            kind: 'health-sciences',
            name: 'College of Health Sciences',
            position: 'the primary northern block of the campus',
            inside: [
                'the gross anatomy laboratory with dissection tables',
                'histology & pathology viewing bays',
                'specimen preservation tanks and models',
                'clinical faculty offices'
            ],
            room: 'anatomy',
            studyLabel: 'Take the anatomy practical'
        },
        {
            kind: 'lecture-theatre',
            name: 'The Pre-Clinical Lecture Theatre',
            position: 'right beside the medical laboratory wing',
            inside: [
                'stepped seating facing the display board',
                'colour-coded medical posters',
                'the human skeletal model',
                'overhead projector screen'
            ],
            room: 'preclinic',
            studyLabel: 'Attend the pre-clinical lecture'
        },
        {
            kind: 'admin',
            name: 'The Adankolo Admin Block',
            position: 'beside the gate, where the old campus began',
            inside: [
                'the campus director’s office',
                'the old registry counters',
                'faculty notice boards'
            ],
            room: 'office',
            studyLabel: 'Greet the campus director'
        },
        {
            kind: 'canteen',
            name: 'The Old Campus Canteen',
            position: 'on the walk between lectures',
            inside: [
                'the jollof counter',
                'plastic tables and benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Campus Sick Bay',
            position: 'the shaded corner by the wall',
            inside: [
                'two observation beds',
                'the first-aid cabinet',
                'the nurse’s desk'
            ],
            room: 'clinic'
        }
    ],
    'ksp-felele': [
        {
            kind: 'workshop',
            name: 'The Engineering Workshops',
            position: 'the noisy row along the back fence',
            inside: [
                'machine benches with lathes and mills',
                'the electrical & electronics bay',
                'mechatronics rigs',
                'the tool store crates'
            ],
            room: 'workshop',
            studyLabel: 'Learn at the machines'
        },
        {
            kind: 'computer-lab',
            name: 'The DITRC Computer Centre',
            position: 'beside the lecture blocks — the ICT directorate',
            inside: [
                'bench rows of workstations',
                'the server stack',
                'the lab instructor desk'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'library',
            name: 'The Polytechnic Library',
            position: 'the quiet block behind the assembly yard',
            inside: [
                'shelf stacks by department',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'admin',
            name: 'The Rectory & Admin Block',
            position: 'the first building past the gate',
            inside: [
                "the Rector's office suite",
                'the records counters',
                'the bursary windows'
            ],
            room: 'office',
            studyLabel: 'Greet the Rector’s office'
        },
        {
            kind: 'hostel',
            name: 'The Poly Hostels',
            position: 'the residential corner of the compound',
            inside: [
                'bunk rooms with lockers',
                'the common lounge',
                'the ablution block'
            ],
            room: 'hostel',
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'The Poly Canteen',
            position: 'where the expressway noise meets the yard',
            inside: [
                'the rice and beans counter',
                'long benches',
                'the cold drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Poly Clinic',
            position: 'the small white block by the hostel fence',
            inside: [
                'observation beds',
                'the medicine shelf',
                'the nurse’s desk'
            ],
            room: 'clinic'
        }
    ],
    'salem-university': [
        {
            kind: 'chapel',
            name: 'The University Chapel',
            position: 'front and centre on the lawn',
            inside: [
                'wooden pews in columns',
                'the pulpit and altar table',
                'the choir bench',
                'the scripture shelf'
            ],
            room: 'chapel',
            studyLabel: 'Sit a moment in the chapel'
        },
        {
            kind: 'library',
            name: 'The Salem Library',
            position: 'beside the chapel on the central lawn',
            inside: [
                'shelf stacks by college',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'admin',
            name: 'The Administration Block',
            position: 'the first building past the gate',
            inside: [
                "the VC's office suite",
                'the registry counters',
                'the bursary windows'
            ],
            room: 'office',
            studyLabel: 'Greet the registry'
        },
        {
            kind: 'hostel',
            name: 'The Salem Hostels',
            position: 'the residential ring — every student lives on campus',
            inside: [
                'bunk rooms with lockers',
                'the common study lounge',
                'the ablution block'
            ],
            room: 'hostel',
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'The Dining Hall Canteen',
            position: 'between the hostels and the lawn',
            inside: [
                'the serving counter',
                'dining tables and benches',
                'the kitchen store'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Medical Centre',
            position: 'the quiet corner by the back fence',
            inside: [
                'observation beds',
                'the medicine cabinet',
                'the nurse’s desk'
            ],
            room: 'clinic'
        }
    ],
    'college-nursing': [
        {
            kind: 'demo-lab',
            name: 'The Demonstration Room',
            position: 'the practical wing beside the lecture hall',
            inside: [
                'demonstration beds with dummies',
                'the anatomy model and charts',
                'the scrub basins',
                'the procedure cabinet'
            ],
            room: 'demo',
            studyLabel: 'Practise at the demonstration beds'
        },
        {
            kind: 'library',
            name: 'The Nursing Library',
            position: 'the quiet block behind the classrooms',
            inside: [
                'shelf stacks of medical texts',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'admin',
            name: 'The Provost’s Office',
            position: 'the first block past the gate',
            inside: [
                "the Provost's office",
                'the admissions counters',
                'the notice board'
            ],
            room: 'office',
            studyLabel: 'Greet the Provost’s office'
        },
        {
            kind: 'clinic',
            name: 'The Practice Sick Bay',
            position: 'beside the demonstration wing',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        }
    ],
    'crowther-memorial': [
        {
            kind: 'assembly-hall',
            name: 'The Heritage Hall',
            position: 'the old hall facing the assembly ground',
            inside: [
                'the stage and podium',
                'long bench rows',
                'the honours board',
                'ceiling fans'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'science-lab',
            name: 'The Science Laboratory',
            position: 'behind the classroom block',
            inside: [
                'lab benches with gas taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'library',
            name: 'The Old Library',
            position: 'the mission-era block under the trees',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'beside the hall steps',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Principal’s Block',
            position: 'beside the gate where discipline is served',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'gyb-model-adankolo': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratories',
            position: 'the lab row behind the blocks — a science school must have them',
            inside: [
                'lab benches with gas taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the assembly ground — morning assembly you can hear three streets away',
            inside: [
                'the stage and podium',
                'long bench rows',
                'the prizes board',
                'ceiling fans'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'library',
            name: 'The Model School Library',
            position: 'behind the classroom block',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'canteen',
            name: 'The School Canteen',
            position: 'beside the hall',
            inside: [
                'the food counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Principal’s Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'faithview-academy': [
        {
            kind: 'science-lab',
            name: 'The Science Lab',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basin'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the yard',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'computer-lab',
            name: 'The ICT Lab',
            position: 'beside the hall',
            inside: [
                'bench rows of computers',
                'the instructor desk',
                'the UPS crate'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'by the gate road',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'al-azhar-college': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratory',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Main Hall',
            position: 'facing the yard',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'library',
            name: 'The Library',
            position: 'the quiet block — well stocked, the prospectus says',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'mosque',
            name: 'The Campus Mosque',
            position: 'the prayer block on the east side',
            inside: [
                'prayer mats in rows',
                'the mihrab niche',
                'the Quran shelves',
                'the ablution taps'
            ],
            room: 'mosque',
            studyLabel: 'Sit a moment in the mosque'
        },
        {
            kind: 'computer-lab',
            name: 'The Computer Lab',
            position: 'beside the library — internet-enabled, honestly',
            inside: [
                'bench rows of computers',
                'the instructor desk',
                'the UPS crate'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'hostel',
            name: 'The Boarding Hostels',
            position: 'the residential wing — a full boarding college',
            inside: [
                'bunk rooms with lockers',
                'the common lounge',
                'the ablution block'
            ],
            room: 'hostel',
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'The Dining Canteen',
            position: 'between the hostel wing and the classes',
            inside: [
                'the serving counter',
                'dining benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sickbay',
            position: 'by the hostel fence — qualified staff, the prospectus says',
            inside: [
                'observation beds',
                'the medicine cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'baptist-high': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratory',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'where the famous choir rehearses',
            inside: [
                'the stage and podium',
                'bench rows',
                'the choir corner',
                'ceiling fans'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'library',
            name: 'The Mission Library',
            position: 'the quiet block under the mango trees',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'beside the hall',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Principal’s Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'julitola-intl': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratories',
            position: 'the lab wing the prospectus calls state-of-the-art',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'computer-lab',
            name: 'The ICT Lab',
            position: 'hands-on training by IT professionals, the site says',
            inside: [
                'bench rows of computers',
                'the instructor desk',
                'the UPS crate'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the yard — end-of-term party central',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'canteen',
            name: 'The Canteen',
            position: 'beside the hall',
            inside: [
                'the food counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate — intercom and visitor book',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'christfield-school': [
        {
            kind: 'science-lab',
            name: 'The Science Lab',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basin'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the yard — nursery bells to senior class',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'where the mothers wait at the gate',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate',
            inside: [
                "the Head Teacher's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the head teacher'
        }
    ]
};
}),
"[project]/src/game/data/locations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Lokoja city data
 * -------------------------------
 * The ten launch locations. Stage 2 renders the interactive map straight
 * from this file: mapX/mapY drive the marker positions on the stylised
 * map canvas, `transport` lists which modes can reach the location, and
 * `travelModifier` scales trip time/energy (uphill, riverside roads…).
 *
 * Each location carries its own visual identity + activity catalogue so the
 * map screen stays 100% data-driven.
 */ __turbopack_context__.s([
    "LOCATIONS",
    ()=>LOCATIONS,
    "LOCATION_BY_ID",
    ()=>LOCATION_BY_ID
]);
/* ------------------------------ school locations -----------------------------
 * Stage 7 — the schools of Lokoja join the SAME registry (additive only —
 * every existing id keeps its exact identity). Geometry comes from
 * schools.ts (real coordinates, same projection as the 3D world), so the
 * map pin, the 3D gate and the travel fare can never disagree.
 * --------------------------------------------------------------------------- */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/schools.ts [app-ssr] (ecmascript)");
const LOCATIONS = [
    {
        id: 'home',
        name: 'Your Place',
        shortName: 'Home',
        tagline: 'Where the hustle rests',
        description: 'A basic room you can call your own. It is not much yet — but every big name in Lokoja started somewhere.',
        color: '#1B7A43',
        accent: '#0B3D22',
        emoji: '🏠',
        unlockLevel: 1,
        mapX: 35.4,
        mapY: 55.5,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'rest',
                label: 'Rest',
                stage: 1
            },
            {
                key: 'sleep',
                label: 'Sleep till morning',
                stage: 1
            },
            {
                key: 'upgrade',
                label: 'Upgrade home',
                stage: 4
            }
        ]
    },
    {
        id: 'kpata-market',
        name: 'Kpata Market',
        shortName: 'Kpata',
        tagline: 'The heartbeat of Lokoja commerce',
        description: 'Colourful stalls, loud traders, and the best pepper soup ingredients in Kogi State. Every hustle in this city passes through Kpata one way or another.',
        color: '#E8A317',
        accent: '#8A5A00',
        emoji: '🛒',
        unlockLevel: 1,
        mapX: 38.6,
        mapY: 56.8,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'shop-food',
                label: 'Buy food items',
                stage: 4
            },
            {
                key: 'shop-general',
                label: 'General store',
                stage: 4
            },
            {
                key: 'job-market-worker',
                label: 'Market worker shifts',
                stage: 3
            },
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            }
        ]
    },
    {
        id: 'ganaja-junction',
        name: 'Ganaja Junction',
        shortName: 'Ganaja',
        tagline: 'Where every road meets',
        description: 'The busy junction that connects Lokoja to the rest of Kogi. Keke horns, suya smoke, and delivery riders everywhere — the right place to hear today’s gist.',
        color: '#C4562A',
        accent: '#7C2D12',
        emoji: '🛺',
        unlockLevel: 1,
        mapX: 41.7,
        mapY: 64.4,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'transport-hub',
                label: 'Get transport anywhere',
                stage: 2
            },
            {
                key: 'job-delivery',
                label: 'Delivery gigs',
                stage: 3
            },
            {
                key: 'gist',
                label: 'Hear the latest gist',
                stage: 5
            }
        ]
    },
    {
        id: 'confluence',
        name: 'The Confluence',
        shortName: 'Confluence',
        tagline: 'Where the Niger kisses the Benue',
        description: 'The world-famous meeting point of two great rivers. Tourists come with cameras; fishermen come with nets. Lokoja’s proudest landmark — and your signature opportunity.',
        color: '#1F7A6D',
        accent: '#0C3B34',
        emoji: '🌊',
        unlockLevel: 1,
        mapX: 43.5,
        mapY: 74.8,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1.15,
        activities: [
            {
                key: 'fishing',
                label: 'Fishing',
                stage: 7
            },
            {
                key: 'photography',
                label: 'Riverside photography',
                stage: 7
            },
            {
                key: 'tourism',
                label: 'Guide tourists',
                stage: 7
            },
            {
                key: 'boat',
                label: 'Boat rides',
                stage: 7
            }
        ]
    },
    {
        id: 'mount-patti',
        name: 'Mount Patti',
        shortName: 'Mt. Patti',
        tagline: 'The giant that watches over Lokoja',
        description: 'The hill that guards the city, covered in green and history. The climb is not easy — but the view from the top has humbled every visitor since 1860.',
        color: '#4C7A2E',
        accent: '#27401A',
        emoji: '⛰️',
        unlockLevel: 1,
        mapX: 36.3,
        mapY: 28.1,
        transport: [
            'walk',
            'keke'
        ],
        travelModifier: 1.5,
        activities: [
            {
                key: 'hiking',
                label: 'Hike the trail',
                stage: 7
            },
            {
                key: 'photography',
                label: 'Photo spots',
                stage: 7
            },
            {
                key: 'explore',
                label: 'Explore history',
                stage: 7
            }
        ]
    },
    {
        id: 'historic-lokoja',
        name: 'Historic Lokoja',
        shortName: 'Historic',
        tagline: 'Old buildings, old stories',
        description: 'Colonial-era relics, the old European cemetery, and Lord Lugard’s rest house. Lokoja was once the capital of the Northern Protectorate — the streets still remember.',
        color: '#8A6A3B',
        accent: '#4A3418',
        emoji: '🏛️',
        unlockLevel: 2,
        mapX: 39.0,
        mapY: 41.3,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'discover',
                label: 'Discover historical sites',
                stage: 7
            },
            {
                key: 'tour',
                label: 'History tours',
                stage: 7
            }
        ]
    },
    {
        id: 'government-area',
        name: 'Government Area',
        shortName: 'GRA',
        tagline: 'GRA — where things are official',
        description: 'Quiet roads, low fences, and offices where paperwork can change your whole week. Government work is slow — but it is steady, and it comes with respect.',
        color: '#5C6E3A',
        accent: '#31401F',
        emoji: '🏢',
        unlockLevel: 3,
        mapX: 34.2,
        mapY: 53.0,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'job-govt',
                label: 'Government jobs',
                stage: 3
            },
            {
                key: 'errands',
                label: 'Official errands',
                stage: 5
            }
        ]
    },
    {
        id: 'university-area',
        name: 'University Area',
        shortName: 'Univ.',
        tagline: 'Book bright, street sharp',
        description: 'Student hostels, cheap cafés, and copy-copy shops. The campus crowd has energy — and money-making ideas that usually need one more partner.',
        color: '#7C2D6E',
        accent: '#43143B',
        emoji: '🎓',
        unlockLevel: 2,
        mapX: 19.7,
        mapY: 45.5,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'job-tutorial',
                label: 'Tutorial gigs',
                stage: 3
            },
            {
                key: 'network',
                label: 'Meet students',
                stage: 5
            },
            {
                key: 'job-photographer',
                label: 'Photography jobs',
                stage: 3
            }
        ]
    },
    {
        id: 'food-area',
        name: 'Mama’s Food Strip',
        shortName: 'Food Strip',
        tagline: 'Come hungry, leave happy',
        description: 'Bukas, suya stands and cold drinks lined side by side. The aroma alone will reset your mood — and the traders here know everybody’s business.',
        color: '#D9522B',
        accent: '#7A2A10',
        emoji: '🍲',
        unlockLevel: 1,
        mapX: 41.0,
        mapY: 58.2,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'eat',
                label: 'Eat a proper meal',
                stage: 4
            },
            {
                key: 'job-waiter',
                label: 'Restaurant shifts',
                stage: 3
            },
            {
                key: 'hustle',
                label: 'Emergency delivery hustles',
                stage: 3
            }
        ]
    },
    {
        id: 'transport-area',
        name: 'Motor Park',
        shortName: 'Motor Park',
        tagline: 'The city moves from here',
        description: 'Taxi drivers argue, keke riders load passengers, and the last bus to Abuja is always “just leaving”. If you want to move, this is where you start.',
        color: '#B0812A',
        accent: '#5C3E12',
        emoji: '🚕',
        unlockLevel: 1,
        mapX: 41.7,
        mapY: 60.9,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'travel',
                label: 'Take a ride',
                stage: 2
            },
            {
                key: 'job-driver',
                label: 'Driver jobs',
                stage: 3
            },
            {
                key: 'job-cleaner',
                label: 'Park cleaning',
                stage: 3
            }
        ]
    }
];
const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l)=>[
        l.id,
        l
    ]));
;
const SCHOOL_ACTIVITIES = {
    university: [
        {
            key: 'attend-lecture',
            label: 'Attend a lecture',
            stage: 3
        },
        {
            key: 'study-library',
            label: 'Read in the library',
            stage: 3
        },
        {
            key: 'network',
            label: 'Meet students',
            stage: 3
        }
    ],
    polytechnic: [
        {
            key: 'attend-lecture',
            label: 'Attend a lecture',
            stage: 3
        },
        {
            key: 'workshop',
            label: 'Hang around the workshops',
            stage: 3
        },
        {
            key: 'network',
            label: 'Meet students',
            stage: 3
        }
    ],
    secondary: [
        {
            key: 'attend-class',
            label: 'Attend a class',
            stage: 3
        },
        {
            key: 'gist',
            label: 'Hear the school gist',
            stage: 3
        }
    ],
    college: [
        {
            key: 'attend-class',
            label: 'Attend a class',
            stage: 3
        },
        {
            key: 'study-library',
            label: 'Study in the hall',
            stage: 3
        }
    ]
};
const SCHOOL_LOCATIONS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_SITES_PROJECTED"].map((s)=>({
        id: s.id,
        name: s.name,
        shortName: s.shortName,
        tagline: s.tagline,
        description: s.description,
        color: s.color,
        accent: s.accent,
        emoji: s.emoji,
        unlockLevel: s.unlockLevel,
        mapX: s.mapX,
        mapY: s.mapY,
        transport: s.transport,
        travelModifier: s.travelModifier,
        activities: SCHOOL_ACTIVITIES[s.kind]
    }));
LOCATIONS.push(...SCHOOL_LOCATIONS);
// rebuild the id map so schools are first-class citizens everywhere
for (const l of SCHOOL_LOCATIONS)LOCATION_BY_ID[l.id] = l;
/* ------------------------------ G2 — spaces breadth ----------------------------
 * Ten more real Lokoja spaces join the SAME registry (append-only law — the
 * ten launch rows + the school rows above keep their exact identity). Every
 * name below was mined from the repo's REAL geo data before it was added:
 *
 *   Adankolo / Emiwoziri / Filele / Numai / Kpatakpoli / Kpato
 *     → scripts/geo/network.json `places` (real OSM nodes, projected by the
 *       same pipeline as the 3D world — mapX/mapY below ARE that projection:
 *       mapX = 50 + x/6.2, mapY = 50 + z/6.2, rim-pulled past 272u).
 *   Maigari's Palace / Pati Ridge Hill / Sokamms Global Motel
 *     → the raw OSM tiles the pipeline was built from
 *       (scripts/geo/tiles/t_1_2d.osm, t_0_2.osm, t_1_0.osm).
 *   Township Stadium → the world's own 3D landmark
 *       (src/components/game/world/CityMesh.tsx — "Township Stadium — oval
 *       stands + green pitch + floodlights, south of the motor park"), the
 *       same facility the OSM tiles record as "Lokoja International Stadium".
 *
 * `district` claims the CHAOS zone each place honestly stands in
 * (src/game/systems/chaos.ts CHAOS_ZONE_IDS). The ten launch districts stay
 * covered by their own launch rows (id === zone id).
 * --------------------------------------------------------------------------- */ const G2_LOCATIONS = [
    {
        id: 'adankolo',
        name: 'Adankolo',
        shortName: 'Adankolo',
        tagline: 'The old campus quarter',
        description: 'A busy ward on the west side of town where student lodges squeeze between family compounds. Adankolo carries the university\u2019s first home in its name — half the okada men here know a lecturer by face.',
        color: '#2E7D5B',
        accent: '#14432E',
        emoji: '🏘️',
        unlockLevel: 1,
        mapX: 11.2,
        mapY: 40.9,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1.25,
        district: 'university-area',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'room-hunt',
                label: 'Hunt a student room',
                stage: 99
            },
            {
                key: 'campus-gist',
                label: 'Hear the campus gist',
                stage: 99
            }
        ]
    },
    {
        id: 'emiwoziri',
        name: 'Emiwoziri',
        shortName: 'Emiwoziri',
        tagline: 'Where the road kisses the river sand',
        description: 'A riverine settlement on the southern bank, past where the tar gives up. Canoes ride low with sand and firewood, and the fishermen read the water like a newspaper.',
        color: '#2C6E8A',
        accent: '#123B4C',
        emoji: '🛶',
        unlockLevel: 1,
        mapX: 57.9,
        mapY: 92.2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.3,
        district: 'confluence',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'net-mending',
                label: 'Help mend the nets',
                stage: 99
            },
            {
                key: 'sand-landing',
                label: 'Watch the sand landing',
                stage: 99
            }
        ]
    },
    {
        id: 'filele',
        name: 'Filele',
        shortName: 'Filele',
        tagline: 'The farm road\u2019s last stop',
        description: 'A village on the north-west flank under the Patti ridge, where the city noise fades into yam mounds and cassava rows. The air smells of woodsmoke and turned earth.',
        color: '#7A8A3A',
        accent: '#3D4519',
        emoji: '🌾',
        unlockLevel: 1,
        // pulled 6.9u north-west of the raw node onto the empty NW shoulder
        // (the node crowd sits on the Felele corridor pins; same honest pull
        // the schools use — "the farm road's last stop" IS the far corner)
        mapX: 25.0,
        mapY: 5.4,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.4,
        district: 'mount-patti',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'farm-shift',
                label: 'Farm work shifts',
                stage: 99
            },
            {
                key: 'harvest-market',
                label: 'Harvest-day market',
                stage: 99
            }
        ]
    },
    {
        id: 'numai',
        name: 'Numai',
        shortName: 'Numai',
        tagline: 'Quiet streets, loud goats',
        description: 'A small settlement north-east of the Adankolo side, all footpaths, low fences and front yards. Everybody knows whose goat ate whose vegetables — and they will tell you, at length.',
        color: '#A0672E',
        accent: '#4F3113',
        emoji: '🌳',
        unlockLevel: 1,
        // pulled 3u north-east of the raw node onto the dry shoulder of the
        // stream (same honest pull the schools use — node blocked by water)
        mapX: 62.4,
        mapY: 28.7,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.2,
        district: 'university-area',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'grazing-route',
                label: 'Walk the grazing route',
                stage: 99
            },
            {
                key: 'frontyard-league',
                label: 'Front-yard football league',
                stage: 99
            }
        ]
    },
    {
        id: 'kpatakpoli',
        name: 'Kpatakpoli',
        shortName: 'Kpatakpoli',
        tagline: 'East of the bustle',
        description: 'A village quarter east of town where the compounds spread out and the sky gets bigger. Keke men negotiate hard for the trip — the road back always takes longer than the road in.',
        color: '#3F7A5C',
        accent: '#1F4030',
        emoji: '🏡',
        unlockLevel: 1,
        mapX: 75.7,
        mapY: 64.5,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.35,
        district: 'ganaja-junction',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'compound-gist',
                label: 'Compound evening gist',
                stage: 99
            },
            {
                key: 'well-queue',
                label: 'Join the well queue',
                stage: 99
            }
        ]
    },
    {
        id: 'kpato',
        name: 'Kpato',
        shortName: 'Kpato',
        tagline: 'Far side of the Otukpo road',
        description: 'A village out along the south-east road where the Lokoja-Otukpo road carries traders, timber and long-suffering goats. The junction boys here wave down every keke like a celebrity.',
        color: '#B8763A',
        accent: '#5C3A1A',
        emoji: '🐐',
        unlockLevel: 1,
        mapX: 77.7,
        mapY: 84.0,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.4,
        district: 'ganaja-junction',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'roadside-roast',
                label: 'Roadside roast stand',
                stage: 99
            },
            {
                key: 'timber-load',
                label: 'Help load timber',
                stage: 99
            }
        ]
    },
    {
        id: 'township-stadium',
        name: 'Township Stadium',
        shortName: 'Stadium',
        tagline: 'The city\u2019s roaring bowl',
        description: 'The oval stands and green pitch south of the motor park, floodlights standing tall over matchday dust. Local clubs dream here, and the stall around the back sells the coldest minerals in town.',
        color: '#3D8A37',
        accent: '#1D4519',
        emoji: '🏟️',
        unlockLevel: 1,
        // pin sits in the open parkland pocket south-east of the Motor Park — the
        // 3D landmark (CityMesh.tsx) stands in the same transport-area parkland;
        // pulled east onto dry, unobstructed canvas like the schools' rim pull
        // (the raw OSM stadium node is blocked on the grid by the Julitola pin
        // and the real river channel). Evidence stays the landmark + OSM.
        mapX: 51.0,
        mapY: 67.8,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        district: 'transport-area',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'morning-drill',
                label: 'Join morning drill',
                stage: 99
            },
            {
                key: 'matchday-work',
                label: 'Matchday crowd work',
                stage: 99
            }
        ]
    },
    {
        id: 'maigari-palace',
        name: "Maigari's Palace",
        shortName: 'Palace',
        tagline: 'The throne of the old town',
        description: 'The Maigari\u2019s compound — turbaned chiefs, quiet courtyards, and greeting protocols older than the state itself. Arrive with respect and both hands visible; leave with your name remembered.',
        color: '#8A3A6E',
        accent: '#451D37',
        emoji: '👑',
        unlockLevel: 2,
        // pulled 2.3u south-west off the Crowther school pin (≥6u pin law) —
        // the old town between Patti's foot and the historic quarter
        mapX: 42.6,
        mapY: 30.4,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        district: 'historic-lokoja',
        activities: [
            {
                key: 'greeting',
                label: 'Pay your respect',
                stage: 99
            },
            {
                key: 'palace-errand',
                label: 'Palace errands',
                stage: 99
            },
            {
                key: 'festival-grounds',
                label: 'Walk the festival grounds',
                stage: 99
            }
        ]
    },
    {
        id: 'pati-ridge-hill',
        name: 'Pati Ridge Hill',
        shortName: 'Pati Ridge',
        tagline: 'Patti\u2019s quieter shoulder',
        description: 'The lesser shoulder of the great ridge, west of the main trail. No crowds, no vendors — just wind, grass and a view that makes the whole city look like a mat weave.',
        color: '#6E5A2E',
        accent: '#372D14',
        emoji: '🥾',
        unlockLevel: 2,
        mapX: 25.2,
        mapY: 31.7,
        transport: [
            'walk',
            'keke'
        ],
        travelModifier: 1.5,
        district: 'mount-patti',
        activities: [
            {
                key: 'trail-hike',
                label: 'Hike the ridge trail',
                stage: 99
            },
            {
                key: 'photo-walk',
                label: 'Photo walk',
                stage: 99
            },
            {
                key: 'bird-watch',
                label: 'Bird watching hour',
                stage: 99
            }
        ]
    },
    {
        id: 'sokamms-motel',
        name: 'Sokamms Global Motel',
        shortName: 'Sokamms',
        tagline: 'A soft bed on the south road',
        description: 'The traveller\u2019s stop on the southern approach — painted walls, a humming generator, and a night guard who doubles as the gist channel. When home is too far, Sokamms is home enough.',
        color: '#4A6E8A',
        accent: '#243745',
        emoji: '🛏️',
        unlockLevel: 1,
        mapX: 45.0,
        mapY: 88.3,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1.15,
        district: 'confluence',
        activities: [
            {
                key: 'day-rest',
                label: 'Take a day room',
                stage: 99
            },
            {
                key: 'gist-corner',
                label: 'Sit at the gist corner',
                stage: 99
            }
        ]
    }
];
LOCATIONS.push(...G2_LOCATIONS);
for (const l of G2_LOCATIONS)LOCATION_BY_ID[l.id] = l;
}),
"[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — NPC Registry (Stage 3)
 * -------------------------------------
 * The people of Lokoja. Stage 3 uses NPCs as the FACES of hustles —
 * every personal offer comes from a named person tied to a real
 * location id. Later stages reuse this exact registry for
 * relationships, phone contacts, chats and schedules — the data
 * shape is designed for that, nothing here is UI-specific.
 *
 * Rule: NPCs reference stable location ids (same ids the map and the
 * future 3D world use) so NPC → opportunity → location → 3D world
 * all stay connected.
 */ __turbopack_context__.s([
    "NPCS",
    ()=>NPCS,
    "NPC_BY_ID",
    ()=>NPC_BY_ID
]);
const NPCS = [
    {
        id: 'musa',
        name: 'Musa',
        emoji: '🧵',
        homeLocationId: 'kpata-market',
        bio: 'Fabric trader wey sabi everybody for Kpata.',
        speech: 'friendly'
    },
    {
        id: 'hajiya-amina',
        name: 'Hajiya Amina',
        emoji: '🌶️',
        homeLocationId: 'kpata-market',
        bio: 'Pepper queen of Kpata. Sharp eyes, kind heart.',
        speech: 'respectful'
    },
    {
        id: 'mama-ngozi',
        name: 'Mama Ngozi',
        emoji: '🍲',
        homeLocationId: 'food-area',
        bio: 'Runs the busiest buka on the Food Strip.',
        speech: 'friendly'
    },
    {
        id: 'emeka',
        name: 'Emeka Dispatch',
        emoji: '🏍️',
        homeLocationId: 'ganaja-junction',
        bio: 'Delivery rider. If e fit move, Emeka fit carry am.',
        speech: 'playful'
    },
    {
        id: 'baba-t',
        name: 'Baba T.',
        emoji: '🛺',
        homeLocationId: 'transport-area',
        bio: 'Keke unit leader at Motor Park. Order na im hobby.',
        speech: 'business'
    },
    {
        id: 'chantel',
        name: 'Chantel',
        emoji: '📚',
        homeLocationId: 'university-area',
        bio: 'Student rep wey always get one small plan.',
        speech: 'playful'
    },
    {
        id: 'alhaji-sule',
        name: 'Alhaji Sule',
        emoji: '🗂️',
        homeLocationId: 'government-area',
        bio: 'Office clerk. Paperwork na religion for am.',
        speech: 'business'
    },
    {
        id: 'uncle-ben',
        name: 'Uncle Ben',
        emoji: '🏛️',
        homeLocationId: 'historic-lokoja',
        bio: 'Self-appointed keeper of old Lokoja stories.',
        speech: 'respectful'
    },
    {
        id: 'idris',
        name: 'Idris',
        emoji: '🎣',
        homeLocationId: 'confluence',
        bio: 'Fisherman wey sabi every current of the two rivers.',
        speech: 'friendly'
    },
    {
        id: 'baba-danjuma',
        name: 'Baba Danjuma',
        emoji: '⛰️',
        homeLocationId: 'mount-patti',
        bio: 'Trail guide. Him leg don climb Patti ten thousand times.',
        speech: 'respectful'
    },
    // Stage 7 — the school crowd (same stable-location-id rule)
    {
        id: 'hauwa',
        name: 'Hauwa',
        emoji: '🧪',
        homeLocationId: 'gyb-model-adankolo',
        bio: 'Science student wey sabi every formula for WAEC.',
        speech: 'playful'
    },
    {
        id: 'chidi',
        name: 'Chidi',
        emoji: '🎓',
        homeLocationId: 'ful-felele',
        bio: 'FUL guy. Permanent site na him second house.',
        speech: 'friendly'
    },
    {
        id: 'miss-grace',
        name: 'Miss Grace',
        emoji: '📖',
        homeLocationId: 'crowther-memorial',
        bio: 'The strict-but-fair literature teacher under the hill.',
        speech: 'respectful'
    },
    {
        id: 'abubakar',
        name: 'Abubakar',
        emoji: '🛠️',
        homeLocationId: 'ksp-felele',
        bio: 'Poly student. Engine parts dey always for him pocket.',
        speech: 'business'
    }
];
const NPC_BY_ID = Object.fromEntries(NPCS.map((n)=>[
        n.id,
        n
    ]));
}),
"[project]/src/game/data/flavor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Flavour text
 * ---------------------------
 * Nigerian names for randomisation and loading tips for the main menu.
 * All content is original and written for this game.
 */ __turbopack_context__.s([
    "MENU_TIPS",
    ()=>MENU_TIPS,
    "NIGERIAN_FIRST_NAMES_FEMALE",
    ()=>NIGERIAN_FIRST_NAMES_FEMALE,
    "NIGERIAN_FIRST_NAMES_MALE",
    ()=>NIGERIAN_FIRST_NAMES_MALE,
    "NIGERIAN_SURNAMES",
    ()=>NIGERIAN_SURNAMES
]);
const NIGERIAN_FIRST_NAMES_MALE = [
    'Chinedu',
    'Emeka',
    'Musa',
    'Tunde',
    'Ibrahim',
    'Uche',
    'Segun',
    'Bello',
    'Femi',
    'Obinna',
    'Yusuf',
    'Ade',
    'Danjuma',
    'Kelechi',
    'Olu',
    'Sani'
];
const NIGERIAN_FIRST_NAMES_FEMALE = [
    'Aisha',
    'Funke',
    'Ngozi',
    'Hauwa',
    'Amaka',
    'Zainab',
    'Ronke',
    'Halima',
    'Yemi',
    'Adaeze',
    'Bisi',
    'Fatima',
    'Chidinma',
    'Lara',
    'Nneka',
    'Hadiza'
];
const NIGERIAN_SURNAMES = [
    'Okafor',
    'Adeyemi',
    'Bello',
    'Eze',
    'Abubakar',
    'Okonkwo',
    'Ibrahim',
    'Lawal',
    'Adebayo',
    'Musa',
    'Chukwu',
    'Olawale',
    'Danjuma',
    'Nwosu',
    'Ogunleye',
    'Suleiman'
];
const MENU_TIPS = [
    'The Niger and Benue meet at Lokoja — and so do opportunity and hustle.',
    'They say whoever climbs Mount Patti sees their whole future. Try it.',
    'Keke drivers know every shortcut in this city. Respect them.',
    'A trader at Kpata Market always has gist — and gist can be money.',
    'When rain falls, plans change. Smart hustlers carry Plan B.',
    'Your reputation walks into the room before you do. Build it well.',
    'Start small. Even the biggest shop in Lokoja started as one stall.',
    'Eat well today, hustle well tomorrow. Body no be firewood.'
];
}),
"[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M10: THE LIVING CALENDAR (pure rules)
 * ----------------------------------------------------
 * Lokoja runs on a 72-day year, and the year has a heartbeat:
 *   - The Confluence Regatta (the signature): four neighbourhood boat
 *     teams, shoreline crowds, naira spraying — sponsor a crew, back a
 *     boat, stand in the crowd.
 *   - The Eid family drifts a little every year (the Islamic calendar
 *     never sits still): the Ramadan fast, Eid-el-Fitr, the ram market,
 *     Eid-el-Kabir — buy a ram, butcher it, share the meat around.
 *   - The national days (Workers, Children, Democracy, Independence),
 *     New Yam, New Year, and Detty December when the returnees flood
 *     the city and every price knows it.
 *   - A wedding in somebody's compound every nine days — aso-ebi at
 *     Kpata, gift at the door, respect at the canopy.
 *   - The town union paving one street every fourteen days — gather the
 *     pool, and journeys into that zone ride a smooth road for a season.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (day, state) → same answer. Every
 *    "random" number is a hash of stable inputs — tests and replays
 *    can trust the year.
 *  - The SCHEDULE is derived from the day counter alone — zero state,
 *    reload-proof by construction. Only PARTICIPATION persists
 *    (meat packs, stakes, aso-ebi, attended lists, the paving pool).
 *  - The Eid family drifts ±4 year-days per year, deterministically —
 *    far enough to feel alive, never far enough to collide with the
 *    Regatta or New Yam.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the
 *    UI only reads them. Every naira constant lives in config.FESTIVALS.
 */ __turbopack_context__.s([
    "PAVING_ZONE_IDS",
    ()=>PAVING_ZONE_IDS,
    "absoluteDayOf",
    ()=>absoluteDayOf,
    "attendSprayFor",
    ()=>attendSprayFor,
    "attendWeddingApply",
    ()=>attendWeddingApply,
    "betApply",
    ()=>betApply,
    "buyAsoEbiApply",
    ()=>buyAsoEbiApply,
    "buyRamApply",
    ()=>buyRamApply,
    "calendarDayRoll",
    ()=>calendarDayRoll,
    "calendarFleetMult",
    ()=>calendarFleetMult,
    "calendarMarketMult",
    ()=>calendarMarketMult,
    "canAttendFestival",
    ()=>canAttendFestival,
    "canAttendWedding",
    ()=>canAttendWedding,
    "canBet",
    ()=>canBet,
    "canBuyAsoEbi",
    ()=>canBuyAsoEbi,
    "canBuyRam",
    ()=>canBuyRam,
    "canContributePaving",
    ()=>canContributePaving,
    "canShareMeat",
    ()=>canShareMeat,
    "canSponsor",
    ()=>canSponsor,
    "contributePavingApply",
    ()=>contributePavingApply,
    "eidDriftForYear",
    ()=>eidDriftForYear,
    "festivalForDay",
    ()=>festivalForDay,
    "freshCalendarState",
    ()=>freshCalendarState,
    "inDetty",
    ()=>inDetty,
    "inMeatSeason",
    ()=>inMeatSeason,
    "inRamadan",
    ()=>inRamadan,
    "isIftarHour",
    ()=>isIftarHour,
    "isPaved",
    ()=>isPaved,
    "nextFestivalFrom",
    ()=>nextFestivalFrom,
    "pavedMinutesMult",
    ()=>pavedMinutesMult,
    "pavingCycleOf",
    ()=>pavingCycleOf,
    "pavingNpcFlowFor",
    ()=>pavingNpcFlowFor,
    "pavingZoneFor",
    ()=>pavingZoneFor,
    "ramMarketDayIndex",
    ()=>ramMarketDayIndex,
    "ramPriceFor",
    ()=>ramPriceFor,
    "regattaResultDay",
    ()=>regattaResultDay,
    "regattaTeamsFor",
    ()=>regattaTeamsFor,
    "regattaWinnerFor",
    ()=>regattaWinnerFor,
    "setDebugYearDay",
    ()=>setDebugYearDay,
    "shareMeatApply",
    ()=>shareMeatApply,
    "sponsorApply",
    ()=>sponsorApply,
    "weddingForCycle",
    ()=>weddingForCycle,
    "wrapDay",
    ()=>wrapDay,
    "yearDayOf",
    ()=>yearDayOf,
    "yearOf",
    ()=>yearOf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
;
;
function freshCalendarState() {
    return {
        day: 0,
        meatPacks: 0,
        meatShares: [],
        sponsored: [],
        bets: [],
        asoEbi: [],
        attended: [],
        paved: [],
        paving: null,
        stats: {
            festivalsAttended: 0,
            ramsBought: 0,
            meatShared: 0,
            regattaWins: 0,
            weddings: 0,
            projectsDone: 0
        }
    };
}
/* ------------------------------ debug override ----------------------------- */ /**
 * An E2E/debug override for the year-day reading (1–72). Set ONLY through
 * the __lkl hook — normal play never touches it. When set, every calendar
 * law (festivals, Ramadan, Detty, ram prices, weddings) reads this
 * year-day instead of deriving one from the world clock.
 */ let debugYearDay = null;
function setDebugYearDay(n) {
    debugYearDay = n !== null ? Math.max(1, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays, Math.round(n))) : null;
}
/* ------------------------------- the year laws ------------------------------ */ const A = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors;
function yearOf(day) {
    return Math.floor((day - 1) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays) + 1;
}
function yearDayOf(day) {
    if (debugYearDay !== null) return debugYearDay;
    return (day - 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + 1;
}
function absoluteDayOf(year, yearDay) {
    return (year - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + yearDay;
}
function eidDriftForYear(year) {
    return (year - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].eidDriftStep % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].eidDriftMod - (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].eidDriftMod - 1) / 2;
}
const unit = (...nums)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])(...nums) / 0xffffffff;
/** Is `yearDay` inside the wrapped window [start, start+len)? */ function inWindow(yearDay, start, len) {
    for(let i = 0; i < len; i++){
        if (wrapDay(start + i) === yearDay) return true;
    }
    return false;
}
function wrapDay(n) {
    return ((n - 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + 1;
}
function inRamadan(day) {
    const yd = yearDayOf(day);
    const start = A.eidFitr - A.ramadanDays + eidDriftForYear(yearOf(day));
    return inWindow(yd, start, A.ramadanDays);
}
function inDetty(day) {
    return yearDayOf(day) >= A.dettyStart;
}
function ramMarketDayIndex(day) {
    const yd = yearDayOf(day);
    const start = A.eidKabir - A.ramMarketDays + eidDriftForYear(yearOf(day));
    for(let i = 0; i < A.ramMarketDays; i++){
        if (wrapDay(start + i) === yd) return i + 1;
    }
    return 0;
}
/**
 * The attendable day-festivals, in year order. The Eid pair shifts with
 * the drift; everything else holds its anchor. `len` counts days.
 */ function festivalDefsForYear(year) {
    const d = eidDriftForYear(year);
    return [
        {
            id: 'new-year',
            name: 'New Year',
            icon: '🎆',
            venueId: 'confluence',
            start: A.newYear,
            len: 1,
            note: 'Cross-over night crowd dey outside — the year don open.'
        },
        {
            id: 'eid-fitr',
            name: 'Eid-el-Fitr',
            icon: '🌙',
            venueId: 'historic-lokoja',
            start: A.eidFitr + d,
            len: A.eidFitrDays,
            note: 'The fast don complete — Ramadan blessings for everybody.'
        },
        {
            id: 'workers',
            name: "Workers' Day",
            icon: '🔨',
            venueId: 'government-area',
            start: A.workersDay,
            len: 1,
            note: 'The unions dey march — every hustle get value today.'
        },
        {
            id: 'children',
            name: "Children's Day",
            icon: '🎈',
            venueId: 'university-area',
            start: A.childrensDay,
            len: 1,
            note: 'The young ones own the streets today.'
        },
        {
            id: 'regatta',
            name: 'Confluence Regatta',
            icon: '🚤',
            venueId: 'confluence',
            start: A.regatta,
            len: A.regattaDays,
            note: 'Boat teams on the water, naira dey spray for shoreline.'
        },
        {
            id: 'democracy',
            name: 'Democracy Day',
            icon: '🗳️',
            venueId: 'government-area',
            start: A.democracyDay,
            len: 1,
            note: 'The town dey argue politics small small — join the gist.'
        },
        {
            id: 'eid-kabir',
            name: 'Eid-el-Kabir',
            icon: '🐏',
            venueId: 'historic-lokoja',
            start: A.eidKabir + d,
            len: A.eidKabirDays,
            note: 'Sallah! Meat dey share around every compound.'
        },
        {
            id: 'new-yam',
            name: 'New Yam Festival',
            icon: '🍠',
            venueId: 'historic-lokoja',
            start: A.newYam,
            len: 1,
            note: 'The first yam of the season don land — come chop.'
        },
        {
            id: 'independence',
            name: 'Independence Day',
            icon: '🇳🇬',
            venueId: 'government-area',
            start: A.independenceDay,
            len: 1,
            note: 'Green-white-green everywhere — Lokoja dey proud today.'
        },
        {
            id: 'detty',
            name: 'Detty December',
            icon: '🎉',
            venueId: 'food-area',
            start: A.dettyStart,
            len: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays - A.dettyStart + 1,
            note: 'Returnees don land — the city shine, price dey shine too.'
        }
    ];
}
function festivalForDay(day) {
    const yd = yearDayOf(day);
    const year = yearOf(day);
    for (const f of festivalDefsForYear(year)){
        for(let i = 0; i < f.len; i++){
            if (wrapDay(f.start + i) === yd) {
                return {
                    id: f.id,
                    name: f.name,
                    icon: f.icon,
                    venueId: f.venueId,
                    dayOfYear: wrapDay(f.start),
                    daysLeft: f.len - i,
                    note: f.note
                };
            }
        }
    }
    return null;
}
function nextFestivalFrom(day) {
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays; i++){
        const d = day + i;
        const f = festivalForDay(d);
        if (f) return {
            festival: f,
            inDays: i
        };
    }
    // unreachable — the year always contains a festival
    return {
        festival: festivalForDay(day),
        inDays: 0
    };
}
function calendarMarketMult(day) {
    let m = 1;
    if (inRamadan(day)) m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.ramadan;
    if (inDetty(day)) m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.detty;
    const rm = ramMarketDayIndex(day);
    if (rm > 0) m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.ramMarket;
    const f = festivalForDay(day);
    if (f) {
        if (f.id === 'eid-fitr' || f.id === 'eid-kabir') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.eid;
        else if (f.id === 'regatta') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.regatta;
        else if (f.id === 'new-yam') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.newYam;
        else if (f.id === 'independence') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.independence;
    }
    return m;
}
function calendarFleetMult(day) {
    if (inDetty(day)) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.detty;
    const f = festivalForDay(day);
    if (f?.id === 'regatta') return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.regatta;
    if (f?.id === 'independence') return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.independence;
    return 1;
}
function isIftarHour(day, timeOfDay) {
    return inRamadan(day) && (timeOfDay === 'evening' || timeOfDay === 'night');
}
function regattaTeamsFor(_year) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].regattaTeams;
}
function regattaWinnerFor(year) {
    const teams = regattaTeamsFor(year);
    return teams[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('regatta', year) % teams.length];
}
function regattaResultDay(year) {
    return absoluteDayOf(year, A.regatta + A.regattaDays);
}
function attendSprayFor(day, festivalId) {
    const u = unit('spray', day, festivalId);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.sprayMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.sprayMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.sprayMin)) / 10) * 10;
}
function ramPriceFor(day) {
    const idx = ramMarketDayIndex(day);
    if (idx === 0) return 0;
    const ladder = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].ramLadder[Math.min(idx - 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].ramLadder.length - 1)];
    const u = unit('ram', day);
    const wobble = 1 + (u * 2 - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].ramWobble;
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].ramBasePrice * ladder * wobble / 100) * 100;
}
function weddingForCycle(day) {
    const every = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingEvery;
    let cycle = Math.floor((day - 1) / every);
    const offsetFor = (c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('wedding-day', c) % 7;
    const weddingDayFor = (c)=>c * every + 1 + offsetFor(c);
    // if this cycle's wedding already passed, show the next one
    if (day > weddingDayFor(cycle)) cycle += 1;
    const weddingDay = weddingDayFor(cycle);
    const venueId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingVenues[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('wedding-venue', cycle) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingVenues.length];
    const names = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].coupleFirstNames;
    const a = names[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('wedding-a', cycle) % names.length];
    let bi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('wedding-b', cycle) % names.length;
    if (names[bi] === a) bi = (bi + 1) % names.length;
    const b = names[bi];
    return {
        id: `w${cycle}`,
        couple: `${a} & ${b}`,
        venueId,
        day: weddingDay,
        isToday: weddingDay === day,
        inDays: Math.max(0, weddingDay - day)
    };
}
/* ----------------------------- the paving season ---------------------------- */ /** The zones the town union paves — the 10 launch districts. */ const PAVING_ZONES = [
    'home',
    'kpata-market',
    'ganaja-junction',
    'confluence',
    'mount-patti',
    'historic-lokoja',
    'government-area',
    'university-area',
    'food-area',
    'transport-area'
];
const PAVING_ZONE_IDS = PAVING_ZONES;
function pavingZoneFor(cycle) {
    return PAVING_ZONES[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('paving-zone', cycle) % PAVING_ZONES.length];
}
function pavingNpcFlowFor(cycle, day) {
    const u = unit('paving-flow', cycle, day);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingNpcMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingNpcMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingNpcMin)) / 10) * 10;
}
function pavingCycleOf(day) {
    return Math.floor((day - 1) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingEvery);
}
function isPaved(cal, day, zoneId) {
    return cal.paved.some((r)=>r.zoneId === zoneId && day <= r.untilDay);
}
function pavedMinutesMult(cal, day, destId) {
    return isPaved(cal, day, destId) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedMinutesMult : 1;
}
function calendarDayRoll(cal, day) {
    if (day <= cal.day) {
        return {
            next: cal,
            pavingDone: null,
            pavingStalled: null,
            regattaResult: null
        };
    }
    let next = {
        ...cal,
        day
    };
    let pavingDone = null;
    let pavingStalled = null;
    let regattaResult = null;
    /* ---- the paving project lifecycle ---- */ const cycle = pavingCycleOf(day);
    const cycleStartDay = cycle * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingEvery + 1;
    let paving = next.paving ? {
        ...next.paving,
        contribDays: [
            ...next.paving.contribDays
        ]
    } : null;
    if (paving && paving.cycle !== cycle) {
        // a new cycle started and the old pool never filled — the union pauses
        pavingStalled = {
            zoneId: paving.zoneId
        };
        paving = null;
    }
    if (!paving && day === cycleStartDay) {
        // a fresh project breaks ground ONLY on its cycle's first day — one
        // project per season, even if an earlier one finished early
        paving = {
            cycle,
            zoneId: pavingZoneFor(cycle),
            pool: 0,
            contribDays: []
        };
    }
    // yesterday's community coins (only inside the project's own cycle)
    const yesterday = day - 1;
    if (paving && pavingCycleOf(yesterday) === cycle) {
        paving = {
            ...paving,
            pool: paving.pool + pavingNpcFlowFor(cycle, yesterday)
        };
    }
    if (paving && paving.pool >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget) {
        next.paved = [
            ...next.paved.filter((r)=>day <= r.untilDay),
            {
                zoneId: paving.zoneId,
                untilDay: day + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedDays - 1
            }
        ];
        next.stats = {
            ...next.stats,
            projectsDone: next.stats.projectsDone + 1
        };
        pavingDone = {
            zoneId: paving.zoneId
        };
        paving = null;
    }
    next.paving = paving;
    /* ---- the regatta's morning after ---- */ const year = yearOf(day);
    if (day === regattaResultDay(year)) {
        const winner = regattaWinnerFor(year);
        const sponsored = next.sponsored.filter((s)=>s.year <= year);
        const bets = next.bets.filter((b)=>b.year <= year);
        let sponsorWin = null;
        let sponsorLose = null;
        let betWin = null;
        let betLose = 0;
        for (const s of sponsored){
            if (s.teamId === winner) sponsorWin = {
                teamId: s.teamId,
                payout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorWinPayout
            };
            else sponsorLose = s.teamId;
        }
        for (const b of bets){
            if (b.teamId === winner) betWin = {
                teamId: b.teamId,
                payout: Math.round(b.amount * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].betOdds)
            };
            else betLose += b.amount;
        }
        if (sponsored.length > 0 || bets.length > 0) {
            regattaResult = {
                year,
                winner,
                sponsorWin,
                sponsorLose,
                betWin,
                betLose
            };
            next.sponsored = next.sponsored.filter((s)=>s.year > year);
            next.bets = next.bets.filter((b)=>b.year > year);
            if (sponsorWin) next.stats = {
                ...next.stats,
                regattaWins: next.stats.regattaWins + 1
            };
        }
    }
    /* ---- housekeeping: expire old paved records, prune share keys ---- */ if (next.paved.length > 0) next.paved = next.paved.filter((r)=>day <= r.untilDay + 1);
    if (next.meatShares.length > 60) next.meatShares = next.meatShares.slice(-60);
    if (next.attended.length > 60) next.attended = next.attended.slice(-60);
    return {
        next,
        pavingDone,
        pavingStalled,
        regattaResult
    };
}
function canAttendFestival(cal, day, locationId) {
    const festival = festivalForDay(day);
    if (!festival) return {
        ok: false,
        why: 'No festival today.',
        festival: null
    };
    if (locationId !== festival.venueId) return {
        ok: false,
        why: 'The party is at another venue.',
        festival
    };
    if (cal.attended.includes(`${day}:${festival.id}`)) return {
        ok: false,
        why: 'You don already attend today — enjoy the street.',
        festival
    };
    return {
        ok: true,
        why: '',
        festival
    };
}
function inMeatSeason(day) {
    const yd = yearDayOf(day);
    const d = eidDriftForYear(yearOf(day));
    const start = A.eidKabir - A.ramMarketDays + d;
    const end = A.eidKabir + d + A.eidKabirDays - 1;
    // both ends wrap inside a 72-day year and the whole span (≤9 days)
    // never crosses more than one wrap — walk it
    for(let i = 0; i <= end - start; i++){
        if (wrapDay(start + i) === yd) return true;
    }
    return false;
}
function canShareMeat(cal, day, npcId) {
    if (cal.meatPacks < 1) return {
        ok: false,
        why: 'You no get meat pack — go buy ram at the ram market.'
    };
    if (!inMeatSeason(day)) return {
        ok: false,
        why: 'Meat sharing na Sallah season thing.'
    };
    const year = yearOf(day);
    if (cal.meatShares.includes(`${year}:${npcId}`)) return {
        ok: false,
        why: 'You don share meat for this paddy this Eid.'
    };
    return {
        ok: true,
        why: ''
    };
}
function shareMeatApply(cal, day, npcId) {
    const year = yearOf(day);
    return {
        ...cal,
        meatPacks: cal.meatPacks - 1,
        meatShares: [
            ...cal.meatShares,
            `${year}:${npcId}`
        ],
        stats: {
            ...cal.stats,
            meatShared: cal.stats.meatShared + 1
        }
    };
}
function canBuyRam(day, locationId, cash) {
    const price = ramPriceFor(day);
    if (ramMarketDayIndex(day) === 0) return {
        ok: false,
        why: 'The ram market no dey today.',
        price: 0
    };
    if (locationId !== 'kpata-market') return {
        ok: false,
        why: 'The rams dey Kpata market.',
        price
    };
    if (cash < price) return {
        ok: false,
        why: `You need ${price} naira for this ram.`,
        price
    };
    return {
        ok: true,
        why: '',
        price
    };
}
function buyRamApply(cal) {
    return {
        ...cal,
        meatPacks: cal.meatPacks + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].meatPacksPerRam,
        stats: {
            ...cal.stats,
            ramsBought: cal.stats.ramsBought + 1
        }
    };
}
function canSponsor(cal, day, locationId, teamId) {
    const f = festivalForDay(day);
    if (!f || f.id !== 'regatta') return {
        ok: false,
        why: 'Sponsorship opens at the Regatta.'
    };
    if (locationId !== 'confluence') return {
        ok: false,
        why: 'You must stand at the Confluence shoreline.'
    };
    const year = yearOf(day);
    if (cal.sponsored.some((s)=>s.year === year)) return {
        ok: false,
        why: 'You don sponsor a team this year — stand by am.'
    };
    if (!regattaTeamsFor(year).includes(teamId)) return {
        ok: false,
        why: 'That crew no dey race this year.'
    };
    return {
        ok: true,
        why: ''
    };
}
function sponsorApply(cal, day, teamId) {
    const year = yearOf(day);
    return {
        ...cal,
        sponsored: [
            ...cal.sponsored,
            {
                year,
                teamId
            }
        ]
    };
}
function canBet(cal, day, locationId, ageBand) {
    const f = festivalForDay(day);
    if (!f || f.id !== 'regatta' || f.daysLeft !== A.regattaDays) return {
        ok: false,
        why: 'Bets close before the race — day one only.'
    };
    if (locationId !== 'confluence') return {
        ok: false,
        why: 'You must stand at the Confluence shoreline.'
    };
    // M13 — THE FAMILY SHIELD: race-eve betting is crime-adjacent — 18+ only.
    if (ageBand !== 'adult') return {
        ok: false,
        why: 'Betting na 18+ — small paddies dey sponsor team, that one better pass.'
    };
    const year = yearOf(day);
    if (cal.bets.some((b)=>b.year === year)) return {
        ok: false,
        why: 'One bet per year — you don carry stake already.'
    };
    return {
        ok: true,
        why: ''
    };
}
function betApply(cal, day, teamId, amount) {
    const year = yearOf(day);
    return {
        ...cal,
        bets: [
            ...cal.bets,
            {
                year,
                teamId,
                amount
            }
        ]
    };
}
function canBuyAsoEbi(cal, day, locationId, wedding) {
    if (locationId !== 'kpata-market') return {
        ok: false,
        why: 'The fabric dey Kpata market.'
    };
    if (wedding.inDays > 2 && !wedding.isToday) return {
        ok: false,
        why: 'Aso-ebi opens two days to the wedding.'
    };
    if (cal.asoEbi.includes(wedding.id)) return {
        ok: false,
        why: 'You don already buy this wedding aso-ebi.'
    };
    return {
        ok: true,
        why: ''
    };
}
function buyAsoEbiApply(cal, weddingId) {
    return {
        ...cal,
        asoEbi: [
            ...cal.asoEbi,
            weddingId
        ]
    };
}
function canAttendWedding(cal, locationId, wedding) {
    if (!wedding.isToday) return {
        ok: false,
        why: 'The wedding no dey today.'
    };
    if (locationId !== wedding.venueId) return {
        ok: false,
        why: 'The canopies dey another compound.'
    };
    if (cal.attended.includes(wedding.id)) return {
        ok: false,
        why: 'You don attend — the couple don see you.'
    };
    return {
        ok: true,
        why: ''
    };
}
function attendWeddingApply(cal, weddingId) {
    return {
        ...cal,
        attended: [
            ...cal.attended,
            weddingId
        ],
        stats: {
            ...cal.stats,
            weddings: cal.stats.weddings + 1
        }
    };
}
function canContributePaving(cal, day, locationId) {
    const p = cal.paving;
    if (!p) return {
        ok: false,
        why: 'No paving project today.'
    };
    if (p.zoneId !== locationId) return {
        ok: false,
        why: 'The project dey another zone — go there in person.'
    };
    if (p.contribDays.includes(day)) return {
        ok: false,
        why: 'You don give today — the union dey grateful.'
    };
    return {
        ok: true,
        why: ''
    };
}
function contributePavingApply(cal, day, amount) {
    if (!cal.paving) return cal;
    return {
        ...cal,
        paving: {
            ...cal.paving,
            pool: cal.paving.pool + amount,
            contribDays: [
                ...cal.paving.contribDays,
                day
            ]
        }
    };
}
}),
"[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M6: LIVING WORLD (pure weather laws)
 * ---------------------------------------------------
 * The sky beyond rain. Harmattan dust off the Sahara, confluence
 * thunderstorms and the Niger/Benue flood days are REAL Lokoja weather,
 * and the whole city answers to them: journeys slow, food prices climb,
 * the riverfront closes, and misery on the road pays the riders extra.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (weather, day, location) → same answer.
 *    No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every constant lives in config (TIME.WEATHER_META, CIVIC.nightMarket,
 *    FLEET.roughSkyBonus, SOCIAL) — nothing hard-coded.
 *  - A weather day is ONE day: the roll happens once (systems/world.ts),
 *    everything here derives from the weather value itself. Reload-proof
 *    by construction — no extra state to persist.
 */ __turbopack_context__.s([
    "FLOODED_LOCATION_IDS",
    ()=>FLOODED_LOCATION_IDS,
    "NIGHT_MARKET_LOCATION_ID",
    ()=>NIGHT_MARKET_LOCATION_ID,
    "isHeavySky",
    ()=>isHeavySky,
    "isNightMarketOpen",
    ()=>isNightMarketOpen,
    "isRainSky",
    ()=>isRainSky,
    "mealAvailableAt",
    ()=>mealAvailableAt,
    "nightMarketMultFor",
    ()=>nightMarketMultFor,
    "nightMealPrice",
    ()=>nightMealPrice,
    "weatherBlocksLocation",
    ()=>weatherBlocksLocation,
    "weatherMarketMult",
    ()=>weatherMarketMult,
    "weatherMinutesMult",
    ()=>weatherMinutesMult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
;
;
;
/* ------------------------------ the rain family ----------------------------- */ /**
 * The wet-sky family: plain rain, a confluence thunderstorm and a flood
 * day all read as "rain" to the systems that already respect it — rain
 * premiums, rain audio, rain particles. One family, three intensities.
 */ const RAIN_FAMILY = new Set([
    'rain',
    'storm',
    'flood'
]);
function isRainSky(weather) {
    return RAIN_FAMILY.has(weather);
}
function isHeavySky(weather) {
    return weather === 'storm' || weather === 'flood';
}
const FLOODED_LOCATION_IDS = [
    'confluence'
];
function weatherBlocksLocation(weather, locationId) {
    return weather === 'flood' && FLOODED_LOCATION_IDS.includes(locationId);
}
function weatherMinutesMult(weather, transport) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].weatherMinutesMultiplier[weather]?.[transport] ?? 1;
}
function weatherMarketMult(weather) {
    switch(weather){
        case 'harmattan':
            return 1.08;
        case 'storm':
            return 1.15;
        case 'flood':
            return 1.3;
        default:
            return 1;
    }
}
function isNightMarketOpen(timeOfDay) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.opensAt.includes(timeOfDay);
}
const NIGHT_MARKET_LOCATION_ID = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.locationId;
function nightMarketMultFor(day) {
    const u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('night-mkt', day) / 0xffffffff;
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.minMult + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.maxMult - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.minMult);
    return base * ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inRamadan"])(day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FESTIVALS"].ramadanNightMult : 1);
}
function nightMealPrice(base, day) {
    return Math.max(10, Math.round(base * nightMarketMultFor(day) / 10) * 10);
}
function mealAvailableAt(mealNight, locationId, timeOfDay) {
    if (!mealNight) return true;
    return locationId === NIGHT_MARKET_LOCATION_ID && isNightMarketOpen(timeOfDay);
}
}),
"[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M2: the civic mesh (pure rules)
 * ----------------------------------------------
 * The state machinery: NEPA bills that really post, KGIRS taxes that really
 * assess what you EARNED, a warrant that really escalates to the police,
 * whistleblower tips that really pay, and a market whose prices really
 * breathe day by day.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, day) → same outcome. Every
 *    "random" number is a hash of stable inputs (day / tip id), so tests
 *    and replays can trust the world.
 *  - No store, no React, no DOM — the store EXECUTES these rules and the
 *    UI only reads them.
 *  - Every naira constant lives in config.CIVIC — nothing is hard-coded.
 */ __turbopack_context__.s([
    "civicDayRoll",
    ()=>civicDayRoll,
    "civicHash",
    ()=>civicHash,
    "efccDayRoll",
    ()=>efccDayRoll,
    "efccFileTip",
    ()=>efccFileTip,
    "efccRewardFor",
    ()=>efccRewardFor,
    "freshCivicState",
    ()=>freshCivicState,
    "isMarketDay",
    ()=>isMarketDay,
    "kgirsApplyPayment",
    ()=>kgirsApplyPayment,
    "kgirsDayRoll",
    ()=>kgirsDayRoll,
    "kgirsSettleCost",
    ()=>kgirsSettleCost,
    "marketDayRoll",
    ()=>marketDayRoll,
    "marketEventFor",
    ()=>marketEventFor,
    "marketForDay",
    ()=>marketForDay,
    "marketMealPrice",
    ()=>marketMealPrice,
    "nepaApplyPayment",
    ()=>nepaApplyPayment,
    "nepaBillDueToday",
    ()=>nepaBillDueToday,
    "nepaBillFor",
    ()=>nepaBillFor,
    "nepaDayRoll",
    ()=>nepaDayRoll,
    "nepaSettleCost",
    ()=>nepaSettleCost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
;
;
function civicHash(...nums) {
    let h = 0x811c9dc5;
    const mix = (v)=>{
        h ^= v & 0xff;
        h = Math.imul(h, 0x01000193);
        h ^= v >>> 8 & 0xff;
        h = Math.imul(h, 0x01000193);
    };
    for (const n of nums){
        if (typeof n === 'number') {
            mix(n);
            mix(n >>> 8);
            mix(n >>> 16);
            mix(n >>> 24);
        } else {
            for(let i = 0; i < n.length; i++)mix(n.charCodeAt(i));
        }
    }
    return h >>> 0;
}
/** deterministic 0..1 from the hash */ const unit = (...nums)=>civicHash(...nums) / 0xffffffff;
function freshCivicState() {
    return {
        nepa: {
            cycleStart: 1,
            owed: 0,
            paidThrough: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa.cycleDays,
            shedding: false,
            totalPaid: 0
        },
        kgirs: {
            lastSeenEarned: 0,
            assessed: 0,
            dueDay: 0,
            paid: 0,
            warrant: false
        },
        police: {
            fines: 0,
            paid: 0
        },
        efcc: {
            pending: [],
            rewardsTotal: 0,
            lastTipDay: -99
        },
        market: {
            rolledDay: 0,
            prices: {},
            event: null,
            marketDay: false
        }
    };
}
function nepaBillFor(day, bizCount = 0, solarCount = 0) {
    const { baseBill, billVariance } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa;
    const flat = baseBill + unit('nepa', day) * billVariance;
    const grid = Math.max(0, bizCount - solarCount);
    const sunny = Math.min(Math.max(0, solarCount), Math.max(0, bizCount));
    const load = grid * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].nepaLoadPerBiz + sunny * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].nepaLoadWithSolar;
    const loaded = flat * (1 + load);
    return Math.round(loaded / 10) * 10;
}
function nepaBillDueToday(civic, day) {
    return day > civic.nepa.paidThrough;
}
function nepaDayRoll(civic, day, bizCount = 0, solarCount = 0, chill = false) {
    let nepa = {
        ...civic.nepa
    };
    let posted = 0;
    let shed = false;
    // M9 — Chill Mode doubles the disco's patience before the cutter
    const grace = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa.graceDays * (chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHILL"].sheddingGraceMult : 1);
    if (nepaBillDueToday(civic, day)) {
        posted = nepaBillFor(day, bizCount, solarCount);
        nepa.owed += posted;
        nepa.cycleStart = day;
        nepa.paidThrough = day + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa.cycleDays - 1;
    }
    // debt past the grace window cuts the light — exactly once
    if (nepa.owed > 0 && !nepa.shedding && day - nepa.cycleStart >= grace) {
        nepa.shedding = true;
        shed = true;
    }
    return {
        next: {
            ...civic,
            nepa
        },
        posted,
        shed
    };
}
function nepaSettleCost(civic) {
    return civic.nepa.owed + (civic.nepa.shedding ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa.reconnectFee : 0);
}
function nepaApplyPayment(civic, day) {
    return {
        ...civic,
        nepa: {
            ...civic.nepa,
            owed: 0,
            paidThrough: Math.max(civic.nepa.paidThrough, day + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].nepa.cycleDays - 1),
            shedding: false,
            totalPaid: civic.nepa.totalPaid + nepaSettleCost(civic)
        }
    };
}
function kgirsDayRoll(civic, totalEarned, day, chill = false) {
    const k = {
        ...civic.kgirs
    };
    let assessedNow = 0;
    let warrantIssued = false;
    // M9 — Chill Mode gives the taxman 3× the patience before the warrant
    const grace = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.graceDays * (chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHILL"].warrantGraceMult : 1);
    // assessment day — every cycleDays from the game start
    if (day > 1 && (day - 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.cycleDays === 0 && k.assessed === 0) {
        const income = Math.max(0, totalEarned - k.lastSeenEarned);
        assessedNow = Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.minAssessment, Math.round(income * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.rate / 10) * 10);
        k.assessed = assessedNow;
        k.dueDay = day;
        k.lastSeenEarned = totalEarned;
    }
    // warrant — past the grace window with an unpaid assessment
    if (k.assessed > 0 && !k.warrant && day > k.dueDay + grace) {
        k.warrant = true;
        warrantIssued = true;
    }
    return {
        next: {
            ...civic,
            kgirs: k
        },
        assessed: assessedNow,
        warrantIssued
    };
}
function kgirsSettleCost(civic) {
    const k = civic.kgirs;
    if (k.assessed <= 0) return 0;
    return k.warrant ? Math.round(k.assessed * (1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.warrantFineRate) / 10) * 10 : k.assessed;
}
function kgirsApplyPayment(civic, viaWarrant) {
    const k = civic.kgirs;
    return {
        ...civic,
        kgirs: {
            ...k,
            assessed: 0,
            dueDay: 0,
            warrant: false,
            paid: k.paid + (viaWarrant ? 1 : 1)
        },
        police: viaWarrant ? {
            ...civic.police,
            paid: civic.police.paid + 1
        } : civic.police
    };
}
/* ---------------------------------- EFCC ------------------------------------- */ const TIP_CASES = [
    'Ghost workers on a ministry payroll',
    'Cartel hoarding fertiliser subsidies',
    'Diverted road-project funds',
    'Fake contract executions',
    'Stolen palliative warehouse',
    'Bribe list at a licence office'
];
function efccFileTip(civic, day) {
    const id = `tip-${day}-${civic.efcc.pending.length + 1}`;
    const recovery = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].efcc.recoveries[civicHash('efcc', id) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].efcc.recoveries.length];
    const label = TIP_CASES[civicHash('case', id) % TIP_CASES.length];
    const tip = {
        id,
        filedDay: day,
        recovery,
        label
    };
    return {
        next: {
            ...civic,
            efcc: {
                ...civic.efcc,
                pending: [
                    ...civic.efcc.pending,
                    tip
                ],
                lastTipDay: day
            }
        },
        tip
    };
}
function efccRewardFor(tip) {
    return Math.max(100, Math.round(tip.recovery * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].efcc.rewardRate / 10) * 10);
}
function efccDayRoll(civic, day) {
    const ready = civic.efcc.pending.filter((t)=>day >= t.filedDay + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].efcc.resolveDays);
    const kept = civic.efcc.pending.filter((t)=>day < t.filedDay + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].efcc.resolveDays);
    const totalReward = ready.reduce((sum, t)=>sum + efccRewardFor(t), 0);
    return {
        next: {
            ...civic,
            efcc: {
                ...civic.efcc,
                pending: kept,
                rewardsTotal: civic.efcc.rewardsTotal + totalReward
            }
        },
        resolved: ready,
        totalReward
    };
}
function isMarketDay(day) {
    return day >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayEvery && day % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayEvery === 0;
}
function marketEventFor(day) {
    if (unit('event', day) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.eventChance) return null;
    const events = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.events;
    const total = events.reduce((s, e)=>s + e.weight, 0);
    let pick = unit('eventpick', day) * total;
    for (const e of events){
        pick -= e.weight;
        if (pick <= 0) {
            const { weight: _w, ...rest } = e;
            return rest;
        }
    }
    return null;
}
function marketDayRoll(civic, day, weather, liquidityMult = 1) {
    if (civic.market.rolledDay === day) return {
        next: civic,
        rolled: false
    };
    const stress = (weather ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weatherMarketMult"])(weather) : 1) * liquidityMult;
    const prices = {};
    for (const m of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.markets){
        const u = unit('mkt', m, day);
        prices[m] = Math.min(2, Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.minMult + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.maxMult - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.minMult)) * stress * 100) / 100);
    }
    return {
        next: {
            ...civic,
            market: {
                rolledDay: day,
                prices,
                event: marketEventFor(day),
                marketDay: isMarketDay(day)
            }
        },
        rolled: true
    };
}
function marketForDay(civic, day, weather, liquidityMult = 1) {
    const { next } = marketDayRoll(civic, day, weather, liquidityMult);
    return next;
}
function marketMealPrice(base, mealKey, locationId, civic, day) {
    const m = civic.market;
    const MARKET_IDS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.markets;
    if (!MARKET_IDS.includes(locationId)) return base;
    let mult = m.prices[locationId] ?? 1;
    if (m.marketDay) mult *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayMult;
    if (m.event && m.event.mealBias === mealKey && typeof m.event.biasMult === 'number') {
        mult *= m.event.biasMult;
    }
    return Math.max(10, Math.round(base * mult / 10) * 10);
}
function civicDayRoll(civic, totalEarned, day, bizCount = 0, solarCount = 0, weather, liquidityMult = 1, chill = false) {
    const nepa = nepaDayRoll(civic, day, bizCount, solarCount, chill);
    const kgirs = kgirsDayRoll(nepa.next, totalEarned, day, chill);
    const efcc = efccDayRoll(kgirs.next, day);
    const market = marketDayRoll(efcc.next, day, weather, liquidityMult);
    return {
        next: market.next,
        nepaPosted: nepa.posted,
        nepaShed: nepa.shed,
        taxAssessed: kgirs.assessed,
        warrantIssued: kgirs.warrantIssued,
        tipsResolved: efcc.resolved,
        tipReward: efcc.totalReward
    };
}
}),
"[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M8: THE CHAOS ENGINE (pure rules)
 * ------------------------------------------------
 * The grid is alive and the naira has moods:
 *   - On a heavy-sky day (storm/flood) a zone transformer can blow: the
 *     whole area goes dark, shops without backup starve, generator shops
 *     burn fuel, and the community gathers naira for the technician.
 *   - Independent of the sky, some mornings the cash simply dries up:
 *     the ATM pays a capped trickle, POS agents charge their levy,
 *     black-market fuel doubles, and market prices climb — while the
 *     ajo payout days soften everything again.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, day, weather) → same outcome.
 *    Every "random" number is a hash of stable inputs (day / zone / kind),
 *    so tests and replays can trust the world.
 *  - Scarcity and payout days are DERIVED from the day number alone —
 *    reload-proof, zero state. Blowouts are rolled ONCE at the day roll
 *    and persisted (the sky history is not), exactly like weather.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every naira constant lives in config.CHAOS — nothing is hard-coded.
 */ __turbopack_context__.s([
    "CHAOS_ZONE_IDS",
    ()=>CHAOS_ZONE_IDS,
    "applyAtmDraw",
    ()=>applyAtmDraw,
    "applyContribution",
    ()=>applyContribution,
    "atmRemaining",
    ()=>atmRemaining,
    "blackoutAt",
    ()=>blackoutAt,
    "blowoutToday",
    ()=>blowoutToday,
    "blowoutZoneFor",
    ()=>blowoutZoneFor,
    "canContribute",
    ()=>canContribute,
    "chaosDayRoll",
    ()=>chaosDayRoll,
    "freshChaosState",
    ()=>freshChaosState,
    "fuelMultFor",
    ()=>fuelMultFor,
    "isPayoutDay",
    ()=>isPayoutDay,
    "isScarcityDay",
    ()=>isScarcityDay,
    "liquidityMultFor",
    ()=>liquidityMultFor,
    "outageDurationFor",
    ()=>outageDurationFor,
    "playerZoneDark",
    ()=>playerZoneDark,
    "poolNpcContributionFor",
    ()=>poolNpcContributionFor,
    "posFeeFor",
    ()=>posFeeFor,
    "setDebugScarcity",
    ()=>setDebugScarcity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
;
;
;
function freshChaosState() {
    return {
        day: 0,
        active: null,
        recent: [],
        atmDrawnDay: 0,
        atmDrawn: 0,
        stats: {
            blowouts: 0,
            fixes: 0,
            contributed: 0,
            posFees: 0
        }
    };
}
/* ------------------------------ derived laws ------------------------------- */ const unit = (...nums)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])(...nums) / 0xffffffff;
function blowoutToday(weather, day) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHeavySky"])(weather)) return false;
    const chance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].blowoutChance[weather] ?? 0;
    return unit('blowout', day, weather) < chance;
}
function blowoutZoneFor(day, weather) {
    const zones = CHAOS_ZONES;
    return zones[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('zone', day, weather) % zones.length];
}
function outageDurationFor(day, weather) {
    const span = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].outageDays.max - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].outageDays.min;
    const u = unit('outage-len', day, weather);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].outageDays.min + Math.floor(u * (span + 1));
}
/**
 * The zones that share one transformer each — the 10 LAUNCH districts.
 * Schools ride their district's grid: a school street is not its own
 * feeder, and every zone here is walkable/rideable from the core map.
 */ const CHAOS_ZONES = [
    'home',
    'kpata-market',
    'ganaja-junction',
    'confluence',
    'mount-patti',
    'historic-lokoja',
    'government-area',
    'university-area',
    'food-area',
    'transport-area'
];
const CHAOS_ZONE_IDS = CHAOS_ZONES;
/**
 * Is today a cash-scarcity morning? Derived from the day alone — the
 * naira's mood needs no memory. A debug override exists ONLY for E2E
 * determinism (set through the __lkl hook, never by game code).
 */ let debugScarcity = null;
function setDebugScarcity(v) {
    debugScarcity = v;
}
function isScarcityDay(day) {
    if (debugScarcity !== null) return debugScarcity;
    return unit('scarcity', day) < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].scarcityChance;
}
function isPayoutDay(day) {
    return day > 1 && day % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].payoutEvery === 0;
}
function liquidityMultFor(day) {
    if (isScarcityDay(day)) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].scarcityMarketMult;
    if (isPayoutDay(day)) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].payoutMarketMult;
    return 1;
}
function fuelMultFor(day) {
    return isScarcityDay(day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].fuelSurgeMult : 1;
}
function poolNpcContributionFor(startedDay, day) {
    const u = unit('pool', startedDay, day);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolNpcMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolNpcMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolNpcMin)) / 10) * 10;
}
function blackoutAt(chaos, locationId, day) {
    if (chaos.active) {
        const a = chaos.active;
        if (a.zoneId === locationId && day >= a.startedDay && day <= chaos.day) {
            // an active outage darkens every day from its blow day through
            // yesterday inclusive (today may still be fixed tomorrow morning)
            return day < Math.max(a.minUntilDay, chaos.day);
        }
    }
    return chaos.recent.some((r)=>r.zoneId === locationId && day >= r.startedDay && day <= r.untilDay);
}
function chaosDayRoll(chaos, day, weather) {
    if (day <= chaos.day) {
        return {
            next: chaos,
            blowout: null,
            fixed: null,
            scarcity: isScarcityDay(day),
            payout: isPayoutDay(day)
        };
    }
    let active = chaos.active ? {
        ...chaos.active,
        playerContribDays: [
            ...chaos.active.playerContribDays
        ]
    } : null;
    let recent = [
        ...chaos.recent
    ];
    let fixed = null;
    // 1 + 2 — settle yesterday's darkness
    if (active) {
        const endedYesterday = day - 1;
        if (endedYesterday >= active.startedDay) {
            active = {
                ...active,
                pool: active.pool + poolNpcContributionFor(active.startedDay, endedYesterday)
            };
        }
        // the disco repairs THROUGH the night before minUntilDay — power returns
        // that morning; a full pool calls the technician even earlier
        if (active.pool >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget || day >= active.minUntilDay) {
            const record = {
                zoneId: active.zoneId,
                startedDay: active.startedDay,
                untilDay: endedYesterday,
                fixedBy: active.pool >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget ? 'community' : 'disco'
            };
            recent = [
                ...recent,
                record
            ];
            fixed = {
                zoneId: record.zoneId,
                fixedBy: record.fixedBy
            };
            active = null;
        }
    }
    // 3 — a heavy sky can blow the next one (never two dark zones at once)
    let blowout = null;
    if (!active && blowoutToday(weather, day)) {
        const zoneId = blowoutZoneFor(day, weather);
        active = {
            zoneId,
            startedDay: day,
            minUntilDay: day + outageDurationFor(day, weather),
            pool: 0,
            playerContribDays: []
        };
        blowout = {
            zoneId
        };
    }
    // prune the recent records to the last few days (they only exist so
    // multi-day sleeps can still price dark shops)
    recent = recent.filter((r)=>r.untilDay >= day - 6);
    return {
        next: {
            ...chaos,
            day,
            active,
            recent,
            atmDrawnDay: day,
            atmDrawn: chaos.atmDrawnDay === day ? chaos.atmDrawn : 0,
            stats: {
                ...chaos.stats,
                blowouts: chaos.stats.blowouts + (blowout ? 1 : 0),
                fixes: chaos.stats.fixes + (fixed ? 1 : 0)
            }
        },
        blowout,
        fixed,
        scarcity: isScarcityDay(day),
        payout: isPayoutDay(day)
    };
}
function canContribute(chaos, locationId, day) {
    const a = chaos.active;
    if (!a) return {
        ok: false,
        why: 'No outage — the grid is holding.'
    };
    if (a.zoneId !== locationId) return {
        ok: false,
        why: 'The dark zone is elsewhere — go there in person.'
    };
    if (a.playerContribDays.includes(day)) return {
        ok: false,
        why: 'You don give today — the community dey grateful.'
    };
    return {
        ok: true,
        why: ''
    };
}
function applyContribution(chaos, day, amount) {
    if (!chaos.active) return chaos;
    return {
        ...chaos,
        active: {
            ...chaos.active,
            pool: chaos.active.pool + amount,
            playerContribDays: [
                ...chaos.active.playerContribDays,
                day
            ]
        },
        stats: {
            ...chaos.stats,
            contributed: chaos.stats.contributed + amount
        }
    };
}
function atmRemaining(chaos, day) {
    if (!isScarcityDay(day)) return Number.POSITIVE_INFINITY;
    const drawn = chaos.atmDrawnDay === day ? chaos.atmDrawn : 0;
    return Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].atmCap - drawn);
}
function applyAtmDraw(chaos, day, amount) {
    return {
        ...chaos,
        atmDrawnDay: day,
        atmDrawn: (chaos.atmDrawnDay === day ? chaos.atmDrawn : 0) + amount
    };
}
function posFeeFor(amount) {
    return Math.min(Math.ceil(amount * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].posFeeRate / 10) * 10, 2000);
}
function playerZoneDark(chaos, locationId) {
    return blackoutAt(chaos, locationId, chaos.day);
}
}),
"[project]/src/game/systems/goals.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M9: THE CASUAL SHELL (pure rules)
 * ------------------------------------------------
 * The daily goal engine: every morning rolls THREE honest goals from the
 * life the player actually leads — one gig, one meal, one collection —
 * each worth real naira and real XP, with a streak that remembers.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the goals for (day, index) are hash-picked
 *    from the pool — same day, same goals, reload-proof.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the
 *    UI only reads them.
 *  - Every naira/XP constant lives in config.GOALS — nothing hard-coded.
 */ __turbopack_context__.s([
    "GOAL_POOL",
    ()=>GOAL_POOL,
    "bumpGoal",
    ()=>bumpGoal,
    "dailyGoals",
    ()=>dailyGoals,
    "ensureGoals",
    ()=>ensureGoals,
    "freshGoalState",
    ()=>freshGoalState,
    "goalsFor",
    ()=>goalsFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
;
;
function freshGoalState() {
    return {
        day: 0,
        ids: [],
        progress: {},
        done: [],
        streak: 0,
        lastDoneDay: 0
    };
}
const GOAL_POOL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].pool;
function dailyGoals(day) {
    const picked = [];
    const used = new Set();
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].perDay && picked.length < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].perDay; i++){
        let idx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('goal', day, i) % GOAL_POOL.length;
        // walk forward off already-picked rows so one day never repeats a goal
        let tries = 0;
        while(used.has(idx) && tries < GOAL_POOL.length){
            idx = (idx + 1) % GOAL_POOL.length;
            tries++;
        }
        if (used.has(idx)) continue;
        used.add(idx);
        picked.push(GOAL_POOL[idx]);
    }
    return picked;
}
function ensureGoals(state, day) {
    if (state.day === day && state.ids.length === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GOALS"].perDay) return state;
    const goals = dailyGoals(day);
    return {
        day,
        ids: goals.map((g)=>g.id),
        progress: {},
        done: goals.map(()=>false),
        streak: state.streak,
        lastDoneDay: state.lastDoneDay
    };
}
function goalsFor(state) {
    return state.ids.map((id)=>GOAL_POOL.find((g)=>g.id === id)).filter((g)=>!!g);
}
function bumpGoal(state, kind, day) {
    const ensured = ensureGoals(state, day);
    const defs = goalsFor(ensured);
    const completed = [];
    let perfectDay = false;
    const progress = {
        ...ensured.progress
    };
    const done = [
        ...ensured.done
    ];
    defs.forEach((def, i)=>{
        if (def.kind !== kind || done[i]) return;
        const next = (progress[def.id] ?? 0) + 1;
        progress[def.id] = next;
        if (next >= def.target) {
            done[i] = true;
            completed.push(def);
        }
    });
    let streak = ensured.streak;
    let lastDoneDay = ensured.lastDoneDay;
    if (completed.length > 0 && done.every(Boolean) && !ensured.done.every(Boolean)) {
        // the full set just completed — the streak continues only off yesterday
        streak = ensured.lastDoneDay === day - 1 || ensured.lastDoneDay === day ? streak + 1 : 1;
        lastDoneDay = day;
        perfectDay = true;
    }
    return {
        next: {
            ...ensured,
            progress,
            done,
            streak,
            lastDoneDay
        },
        completed,
        perfectDay
    };
}
}),
"[project]/src/game/systems/guest.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M9: THE GUEST LOOP (pure rules)
 * ----------------------------------------------
 * Play first, login to continue. Every new user plays INSTANTLY as a
 * guest — no wall, no form. The GATE fires only when they try to move
 * forward past the starter environment: a friendly "Lokoja knows your
 * face. Claim your name to keep going." with a one-day grace when they
 * ask for it ("Maybe later" buys the rest of TODAY — never a dead end).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. The network
 *    lives in the API routes; the merge law lives here so no surface can
 *    disagree about what "never lose progress" means.
 *  - The merge law: the FURTHER save wins by (day, then totalEarned);
 *    the loser is KEPT as a backup, never deleted. Nobody ever loses
 *    a single naira to the guest loop.
 */ __turbopack_context__.s([
    "BACKUP_KEY",
    ()=>BACKUP_KEY,
    "STARTER_ZONE_IDS",
    ()=>STARTER_ZONE_IDS,
    "ageBandForYear",
    ()=>ageBandForYear,
    "applyGrace",
    ()=>applyGrace,
    "backupPayload",
    ()=>backupPayload,
    "freshAccountState",
    ()=>freshAccountState,
    "freshOnboardingState",
    ()=>freshOnboardingState,
    "gateVerdict",
    ()=>gateVerdict,
    "inStarterZone",
    ()=>inStarterZone,
    "mergeVerdict",
    ()=>mergeVerdict,
    "validateContact",
    ()=>validateContact,
    "validateHandle",
    ()=>validateHandle,
    "validatePin",
    ()=>validatePin
]);
function freshAccountState() {
    return {
        linked: false,
        handle: null,
        token: null,
        ageBand: null,
        gateGraceDay: 0,
        displayName: null,
        avatarLook: null,
        bio: null
    };
}
function freshOnboardingState() {
    return {
        done: [],
        rewarded: false
    };
}
const STARTER_ZONE_IDS = [
    'home',
    'kpata-market',
    'ganaja-junction'
];
function inStarterZone(locationId) {
    return STARTER_ZONE_IDS.includes(locationId);
}
function gateVerdict(account, destinationId, day) {
    if (account.linked) return {
        blocked: false,
        reason: 'graced'
    };
    if (inStarterZone(destinationId)) return {
        blocked: false,
        reason: 'graced'
    };
    if (account.gateGraceDay === day) return {
        blocked: false,
        reason: 'graced'
    };
    return {
        blocked: true,
        reason: 'claim'
    };
}
function applyGrace(account, day) {
    return {
        ...account,
        gateGraceDay: day
    };
}
function validateHandle(handle) {
    const h = handle.trim();
    if (h.length < 3 || h.length > 16) return {
        ok: false,
        why: 'Name must be 3–16 characters.'
    };
    if (!/^[a-zA-Z0-9_]+$/.test(h)) return {
        ok: false,
        why: 'Letters, numbers and underscore only.'
    };
    return {
        ok: true,
        why: ''
    };
}
function validatePin(pin) {
    if (!/^\d{4,8}$/.test(pin)) return {
        ok: false,
        why: 'PIN must be 4–8 digits.'
    };
    return {
        ok: true,
        why: ''
    };
}
function validateContact(contact) {
    const c = contact.trim();
    if (/^\+?\d{7,15}$/.test(c)) return {
        ok: true,
        why: ''
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return {
        ok: true,
        why: ''
    };
    return {
        ok: false,
        why: 'Enter a phone number or an email.'
    };
}
function ageBandForYear(birthYear, nowYear) {
    const age = nowYear - birthYear;
    if (age < 6 || age > 120) return null;
    if (age <= 12) return 'kid';
    if (age <= 17) return 'teen';
    return 'adult';
}
/** Progress distance: the day leads, the ledger breaks ties. */ function progressScore(save) {
    return save.world.day * 1_000_000_000 + Math.min(save.player.stats.totalEarned, 999_999_999);
}
function mergeVerdict(local, cloud) {
    const l = progressScore(local);
    const c = progressScore(cloud);
    if (l > c) return {
        winner: 'local',
        why: `This device is further (Day ${local.world.day} vs Day ${cloud.world.day}) — your guest hustle stays.`,
        backup: cloud
    };
    return {
        winner: 'cloud',
        why: `Your cloud save is further (Day ${cloud.world.day} vs Day ${local.world.day}) — it continues. This device's progress is kept as a backup.`,
        backup: local
    };
}
const BACKUP_KEY = 'lokoja-life:backup';
function backupPayload(save) {
    return JSON.stringify({
        ...save,
        savedAs: 'backup',
        backupAt: Date.now()
    });
}
}),
"[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M11: THE RIVERS AWAKE (pure rules)
 * -------------------------------------------------
 * The Niger has a year of its own. The green-season rains fill the river
 * through the middle of the Lokoja year, it peaks late, and the low-lying
 * city pays: the Confluence riverfront, the Ganaja road and (in the worst
 * surges) the Kpata market go under water. The city answers like the real
 * one — canoes become public transport, sandbag walkways rise from the
 * Crusher's sand, cold-room owners pass the bowl for the rescue trucks,
 * and a deep crossing earns an honest toll.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (day, state) → same answer. The river
 *    LEVEL is a pure function of the day counter (the water keeps its own
 *    calendar) — reload-proof, zero state. Only the player's fight against
 *    the water persists (sandbags, walkways, tolls, the canoe, the bowl).
 *  - The M6 flood WEATHER law stays independent: a cloudburst closes the
 *    riverfront for a day; the river season holds it for weeks. The store
 *    refuses travel if EITHER law says so — the stronger water wins.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them. Every naira constant lives in config.RIVERS.
 */ __turbopack_context__.s([
    "JETTY_ID",
    ()=>JETTY_ID,
    "RIVER_ZONES",
    ()=>RIVER_ZONES,
    "availableFerryGigs",
    ()=>availableFerryGigs,
    "canContributeRescue",
    ()=>canContributeRescue,
    "canLaySegment",
    ()=>canLaySegment,
    "contributeRescueApply",
    ()=>contributeRescueApply,
    "counterFareBetween",
    ()=>counterFareBetween,
    "crossingsFor",
    ()=>crossingsFor,
    "cutZonesFor",
    ()=>cutZonesFor,
    "ferryBoard",
    ()=>ferryBoard,
    "ferryFareBetween",
    ()=>ferryFareBetween,
    "ferryFareFor",
    ()=>ferryFareFor,
    "floodBizFactor",
    ()=>floodBizFactor,
    "freshRiversState",
    ()=>freshRiversState,
    "isSurge",
    ()=>isSurge,
    "laySegmentApply",
    ()=>laySegmentApply,
    "rescueNpcFlowFor",
    ()=>rescueNpcFlowFor,
    "rescueWakes",
    ()=>rescueWakes,
    "riverLevelFor",
    ()=>riverLevelFor,
    "riverMarketMult",
    ()=>riverMarketMult,
    "riversDayRoll",
    ()=>riversDayRoll,
    "runFerryApply",
    ()=>runFerryApply,
    "segmentsLeft",
    ()=>segmentsLeft,
    "setDebugRiverLevel",
    ()=>setDebugRiverLevel,
    "setTollTierApply",
    ()=>setTollTierApply,
    "tollIncomeFor",
    ()=>tollIncomeFor,
    "walkAllowed",
    ()=>walkAllowed,
    "walkwayOpen",
    ()=>walkwayOpen,
    "zoneCut",
    ()=>zoneCut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
;
;
;
;
function freshRiversState() {
    return {
        day: 0,
        sandbags: 0,
        canoe: false,
        walkways: {},
        rescue: null,
        rescuedYear: 0,
        ferryDay: 0,
        ferryDone: [],
        stats: {
            sandBought: 0,
            segmentsLaid: 0,
            tollsCollected: 0,
            ferryRuns: 0,
            ferryEarned: 0,
            rescues: 0
        }
    };
}
/* --------------------------- the river's own year -------------------------- */ const S = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].season;
/**
 * The season base level for a year-day (1–72): dry through the first
 * stretch, a steady green-season rise, the peak sits through Lokoja's
 * flood months, then the river walks back into its banks before the
 * year turns. Deterministic and wrap-safe — New Year's Day is DRY, so
 * the calendar's festivals never drown.
 */ function seasonBaseFor(yearDay) {
    if (yearDay < S.riseStart) return 0;
    if (yearDay < S.peakStart) {
        const t = (yearDay - S.riseStart) / (S.peakStart - S.riseStart);
        return t * t * (3 - 2 * t) // smoothstep — the rise gathers itself
        ;
    }
    if (yearDay < S.recedeStart) return 1;
    if (yearDay < S.dryBy) {
        const t = (yearDay - S.recedeStart) / (S.dryBy - S.recedeStart);
        return 1 - t * t * (3 - 2 * t) // smoothstep — the water lets go
        ;
    }
    return 0;
}
const unit = (...nums)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])(...nums) / 0xffffffff;
/** A debug override for E2E determinism ONLY (never game code). */ let debugLevel = null;
function setDebugRiverLevel(v) {
    debugLevel = v;
}
function riverLevelFor(day) {
    if (debugLevel !== null) return Math.min(1, Math.max(0, debugLevel));
    const base = seasonBaseFor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yearDayOf"])(day));
    if (base <= 0) return 0;
    const breath = (unit('river', day) * 2 - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].wobble;
    return Math.min(1, Math.max(0, base + breath));
}
const RIVER_ZONES = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutAt);
function zoneCut(day, zoneId) {
    const cutAt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutAt[zoneId];
    if (cutAt === undefined) return false;
    return riverLevelFor(day) >= cutAt;
}
function cutZonesFor(day) {
    return RIVER_ZONES.filter((z)=>zoneCut(day, z));
}
function isSurge(day) {
    return cutZonesFor(day).length > 0;
}
/* ------------------------------- walkway laws ------------------------------ */ function walkwayFor(rivers, zoneId) {
    return rivers.walkways[zoneId] ?? {
        laid: 0,
        tollTier: 0,
        pot: 0,
        tollDay: 0
    };
}
function segmentsLeft(rivers, zoneId) {
    const need = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].segments[zoneId] ?? 0;
    return Math.max(0, need - walkwayFor(rivers, zoneId).laid);
}
function walkwayOpen(rivers, zoneId) {
    return segmentsLeft(rivers, zoneId) === 0 && (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].segments[zoneId] ?? 0) > 0;
}
function walkAllowed(rivers, day, zoneId) {
    return zoneCut(day, zoneId) && walkwayOpen(rivers, zoneId);
}
function canLaySegment(rivers, day, zoneId, standingIn, sacks) {
    if (standingIn !== zoneId) return {
        ok: false,
        why: 'You have to stand in the water to lay the bags.'
    };
    if (!zoneCut(day, zoneId)) return {
        ok: false,
        why: 'The river is in its banks here — no bags needed.'
    };
    if (walkwayOpen(rivers, zoneId)) return {
        ok: false,
        why: 'This crossing is already open — the bags dey hold.'
    };
    if (sacks < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment) return {
        ok: false,
        why: `One segment needs ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment} sacks of Crusher sand.`
    };
    return {
        ok: true,
        why: ''
    };
}
function laySegmentApply(rivers, zoneId) {
    const w = walkwayFor(rivers, zoneId);
    return {
        ...rivers,
        sandbags: rivers.sandbags - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment,
        walkways: {
            ...rivers.walkways,
            [zoneId]: {
                ...w,
                laid: w.laid + 1
            }
        },
        stats: {
            ...rivers.stats,
            segmentsLaid: rivers.stats.segmentsLaid + 1
        }
    };
}
function crossingsFor(zoneId, day) {
    const level = riverLevelFor(day);
    const u = unit('toll', zoneId, day);
    return Math.max(0, Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollCrossingsMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollCrossingsMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollCrossingsMin) * level));
}
function tollIncomeFor(rivers, zoneId, day) {
    if (!zoneCut(day, zoneId) || !walkwayOpen(rivers, zoneId)) return 0;
    const w = walkwayFor(rivers, zoneId);
    const tier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[w.tollTier] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[0];
    return crossingsFor(zoneId, day) * tier;
}
function setTollTierApply(rivers, zoneId, tierIndex) {
    const w = walkwayFor(rivers, zoneId);
    const clamped = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers.length - 1, Math.max(0, tierIndex));
    return {
        ...rivers,
        walkways: {
            ...rivers.walkways,
            [zoneId]: {
                ...w,
                tollTier: clamped
            }
        }
    };
}
function counterFareBetween(fromId, toId) {
    const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][fromId];
    const b = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][toId];
    if (!a || !b) return 0;
    const params = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ECONOMY"].transport['taxi'];
    const km = Math.hypot(b.mapX - a.mapX, b.mapY - a.mapY) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].kmPerMapUnit;
    return params.cost.base + params.cost.perKm * km;
}
function ferryFareBetween(fromId, toId, day) {
    return ferryFareFor(counterFareBetween(fromId, toId), day);
}
function ferryFareFor(counterFare, day) {
    const level = riverLevelFor(day);
    const mult = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].ferryFareMult + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].ferryLevelPremium * level;
    return Math.max(10, Math.round(counterFare * mult / 10) * 10);
}
const JETTY_ID = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].jettyId;
function ferryBoard(day, cutZones) {
    if (cutZones.length === 0) return [];
    const gigs = [];
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].ferryGigsPerDay; i++){
        const idx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('ferry', day, i) % cutZones.length;
        const zoneId = cutZones[idx];
        gigs.push({
            id: `ferry-${day}-${i}`,
            day,
            toId: zoneId,
            payout: ferryFareBetween(JETTY_ID, zoneId, day),
            energyCost: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].ferryEnergy,
            level: riverLevelFor(day)
        });
    }
    return gigs;
}
function rescueWakes(day) {
    return riverLevelFor(day) >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.triggerLevel;
}
function canContributeRescue(rivers, day, standingIn) {
    const r = rivers.rescue;
    if (!r) return {
        ok: false,
        why: 'No rescue running — the water has not reached the freezers.'
    };
    if (r.zoneId !== standingIn) return {
        ok: false,
        why: 'The bowl passes at the cold rooms — go there in person.'
    };
    if (r.contribDays.includes(day)) return {
        ok: false,
        why: 'You don give today — the cold-room owners dey grateful.'
    };
    return {
        ok: true,
        why: ''
    };
}
function contributeRescueApply(rivers, day, amount) {
    if (!rivers.rescue) return rivers;
    return {
        ...rivers,
        rescue: {
            ...rivers.rescue,
            pool: rivers.rescue.pool + amount,
            contribDays: [
                ...rivers.rescue.contribDays,
                day
            ]
        }
    };
}
function rescueNpcFlowFor(year, day) {
    const u = unit('rescue', year, day);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.npcMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.npcMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.npcMin)) / 10) * 10;
}
function floodBizFactor(rivers, zoneId, day) {
    const cutAt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutAt[zoneId];
    if (cutAt === undefined) return 1;
    const level = riverLevelFor(day);
    if (level < cutAt) return 1;
    const saved = rivers.rescuedYear === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yearOf"])(day);
    return saved ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.savedIncomeFactor : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.floodIncomeFactor;
}
function riverMarketMult(day) {
    const level = riverLevelFor(day);
    if (level <= 0) return 1;
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].marketMultCap, 1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].marketMultPerLevel * level);
}
function riversDayRoll(rivers, day) {
    if (day <= rivers.day) {
        return {
            next: rivers,
            flooded: null,
            drained: null,
            rescueDone: null,
            rescueWake: null,
            damp: riverLevelFor(day) >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].dampLevel,
            relief: false
        };
    }
    const prev = rivers.day > 0 ? rivers.day : day - 1;
    const levelToday = riverLevelFor(day);
    const levelYesterday = riverLevelFor(prev);
    const year = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yearOf"])(day);
    let next = {
        ...rivers,
        walkways: {
            ...rivers.walkways
        }
    };
    let flooded = null;
    let drained = null;
    let rescueDone = null;
    let rescueWake = null;
    // cut/drain narrations — a zone crossing its line is a city event
    for (const zoneId of RIVER_ZONES){
        const cutAt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].cutAt[zoneId];
        const wasCut = levelYesterday >= cutAt && riverLevelFor(prev) >= cutAt;
        const isCut = levelToday >= cutAt;
        if (isCut && !wasCut) flooded = {
            zoneId
        };
        if (!isCut && wasCut && levelYesterday >= cutAt) drained = {
            zoneId
        };
    }
    // 1 + 2 — the rescue bowl
    const r = next.rescue;
    if (r) {
        const stillDeep = levelYesterday >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.triggerLevel && year === r.year;
        if (stillDeep) {
            const pooled = r.pool + rescueNpcFlowFor(r.year, prev);
            if (pooled >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget) {
                rescueDone = {
                    zoneId: r.zoneId
                };
                next = {
                    ...next,
                    rescue: null,
                    rescuedYear: r.year,
                    stats: {
                        ...next.stats,
                        rescues: next.stats.rescues + 1
                    }
                };
            } else {
                next = {
                    ...next,
                    rescue: {
                        ...r,
                        pool: pooled
                    }
                };
            }
        } else {
            // the surge ended (or the year turned) — the bowl dissolves, honest
            next = {
                ...next,
                rescue: null
            };
        }
    }
    if (!next.rescue && rescueWakes(day) && next.rescuedYear !== year) {
        next = {
            ...next,
            rescue: {
                zoneId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.zoneId,
                year,
                pool: 0,
                contribDays: []
            }
        };
        rescueWake = {
            zoneId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].rescue.zoneId
        };
    }
    // 3 — the toll bowls take yesterday's crossings (while the water held)
    for (const [zoneId, w] of Object.entries(next.walkways)){
        const income = tollIncomeFor(next, zoneId, prev);
        if (income > 0) {
            next.walkways[zoneId] = {
                ...w,
                pot: w.pot + income,
                tollDay: prev
            };
        }
    }
    const damp = levelToday >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].dampLevel;
    const relief = levelYesterday >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].reliefBelow && levelToday < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RIVERS"].reliefBelow;
    return {
        next: {
            ...next,
            day
        },
        flooded,
        drained,
        rescueDone,
        rescueWake,
        damp,
        relief
    };
}
function runFerryApply(rivers, day, gigId) {
    const done = rivers.ferryDay === day ? rivers.ferryDone : [];
    return {
        ...rivers,
        ferryDay: day,
        ferryDone: [
            ...done,
            gigId
        ],
        stats: {
            ...rivers.stats,
            ferryRuns: rivers.stats.ferryRuns + 1
        }
    };
}
function availableFerryGigs(rivers, day, cutZones) {
    const done = rivers.ferryDay === day ? rivers.ferryDone : [];
    return ferryBoard(day, cutZones).filter((g)=>!done.includes(g.id));
}
}),
"[project]/src/game/systems/education.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M12: THE LADDER — EDUCATION (pure rules)
 * -------------------------------------------------------
 * FUL runs a semester clock: enroll → attend lectures (real smart-skill
 * XP + the tutorial stipend) → the ASUU strike freezes the gate
 * (deterministic per semester — the union never asks permission) → the
 * exam window reads the semester's work (smart + lectures, an honest
 * bar, no dice) → pass climbs the ladder, fail repeats the semester →
 * the fourth pass calls the convocation → the certificate opens the
 * career jobs. Eight lectures in one semester earns the Dean's hustle
 * grant — the marketing ground zero pays its students.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the semester's phase, the strike, and the
 *    exam verdict are DERIVED from (day, semesterStartDay, smart) — zero
 *    strike state, reload-proof by construction.
 *  - The exam is not a lottery: it reads the semester's work. Skipped
 *    lectures are failed exam questions.
 *  - No store, no React, no DOM. Every constant lives in config.LADDER.
 */ __turbopack_context__.s([
    "absoluteSemesterIndex",
    ()=>absoluteSemesterIndex,
    "attendLectureApply",
    ()=>attendLectureApply,
    "canAttendConvocation",
    ()=>canAttendConvocation,
    "canAttendLecture",
    ()=>canAttendLecture,
    "canEnroll",
    ()=>canEnroll,
    "canSitExam",
    ()=>canSitExam,
    "convocationApply",
    ()=>convocationApply,
    "earnsDeansGrant",
    ()=>earnsDeansGrant,
    "enrollApply",
    ()=>enrollApply,
    "examApply",
    ()=>examApply,
    "examPasses",
    ()=>examPasses,
    "examScore",
    ()=>examScore,
    "freshEducationState",
    ()=>freshEducationState,
    "grantApply",
    ()=>grantApply,
    "isExamWindow",
    ()=>isExamWindow,
    "isLectureWindow",
    ()=>isLectureWindow,
    "isStrikeDay",
    ()=>isStrikeDay,
    "semesterDayOf",
    ()=>semesterDayOf,
    "strikeDaysLeft",
    ()=>strikeDaysLeft,
    "strikeForSemester",
    ()=>strikeForSemester
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
;
;
const E = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].education;
function freshEducationState() {
    return {
        enrolled: false,
        semester: 1,
        semesterStartDay: 0,
        lecturesDone: 0,
        lastLectureDay: 0,
        lastGrantSemester: 0,
        examsPassed: 0,
        failedExams: 0,
        graduated: false,
        convocationDay: null,
        convocationAttended: false,
        stats: {
            lectures: 0,
            semestersPassed: 0,
            examSits: 0
        }
    };
}
function absoluteSemesterIndex(ed) {
    return ed.examsPassed + ed.semester;
}
function semesterDayOf(ed, day) {
    if (!ed.enrolled || ed.graduated) return 0;
    return Math.max(0, day - ed.semesterStartDay + 1);
}
function isLectureWindow(ed, day) {
    const d = semesterDayOf(ed, day);
    return d >= 1 && d <= E.semesterDays - E.examDays;
}
function isExamWindow(ed, day) {
    const d = semesterDayOf(ed, day);
    return d > E.semesterDays - E.examDays && d <= E.semesterDays;
}
function strikeForSemester(semesterIndex) {
    const roll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('asuu', semesterIndex) / 0xffffffff;
    if (roll >= E.strikeChance) return {
        active: false
    };
    const lenRoll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('asuu-len', semesterIndex) / 0xffffffff;
    const length = E.strikeMinDays + Math.floor(lenRoll * (E.strikeMaxDays - E.strikeMinDays + 1));
    return {
        active: true,
        length
    };
}
function isStrikeDay(ed, day) {
    if (!ed.enrolled) return false;
    const s = strikeForSemester(absoluteSemesterIndex(ed));
    if (!s.active) return false;
    const start = ed.semesterStartDay + E.strikeStartDay - 1;
    return day >= start && day < start + s.length;
}
function strikeDaysLeft(ed, day) {
    if (!ed.enrolled) return 0;
    const s = strikeForSemester(absoluteSemesterIndex(ed));
    if (!s.active) return 0;
    const start = ed.semesterStartDay + E.strikeStartDay - 1;
    return Math.max(0, start + s.length - day);
}
function canAttendLecture(ed, day, standingAtUniversity) {
    if (!ed.enrolled) return {
        ok: false,
        why: 'You no be student yet — the FUL gate takes the enrollment fee.'
    };
    if (ed.graduated) return {
        ok: false,
        why: 'You don graduate — the certificate dey your hand already.'
    };
    if (!standingAtUniversity) return {
        ok: false,
        why: 'The lectures dey hold at FUL — travel there first.'
    };
    if (!isLectureWindow(ed, day)) return {
        ok: false,
        why: isExamWindow(ed, day) ? 'Exam season — the halls are quiet for the papers.' : 'The semester has not started yet.'
    };
    if (isStrikeDay(ed, day)) return {
        ok: false,
        why: `ASUU don lock gate — ${strikeDaysLeft(ed, day)} day${strikeDaysLeft(ed, day) === 1 ? '' : 's'} more.`
    };
    if (ed.lastLectureDay === day) return {
        ok: false,
        why: 'You don attend today one lecture already — the body needs rest.'
    };
    if (ed.lecturesDone >= E.lecturesNeeded) return {
        ok: false,
        why: 'You don cover the whole syllabus — go and write the exam.'
    };
    return {
        ok: true,
        why: ''
    };
}
function attendLectureApply(ed, day) {
    return {
        ...ed,
        lecturesDone: ed.lecturesDone + 1,
        lastLectureDay: day,
        stats: {
            ...ed.stats,
            lectures: ed.stats.lectures + 1
        }
    };
}
function earnsDeansGrant(ed) {
    return ed.lecturesDone === E.deansLectures && ed.lastGrantSemester !== absoluteSemesterIndex(ed);
}
function grantApply(ed) {
    return {
        ...ed,
        lastGrantSemester: absoluteSemesterIndex(ed)
    };
}
function examScore(smart, lecturesDone) {
    return smart + lecturesDone * 0.5;
}
function examPasses(smart, lecturesDone) {
    return examScore(smart, lecturesDone) >= E.examPassScore;
}
function canSitExam(ed, day, standingAtUniversity) {
    if (!ed.enrolled) return {
        ok: false,
        why: 'The exam hall is for students.'
    };
    if (ed.graduated) return {
        ok: false,
        why: 'You don graduate — leave the hall for those still climbing.'
    };
    if (!standingAtUniversity) return {
        ok: false,
        why: 'The exam dey hold at FUL — travel there first.'
    };
    if (!isExamWindow(ed, day)) return {
        ok: false,
        why: `The exam window opens on lecture-day ${E.semesterDays - E.examDays + 1}.`
    };
    return {
        ok: true,
        why: ''
    };
}
function examApply(ed, day, smart) {
    const passed = examPasses(smart, ed.lecturesDone);
    if (!passed) {
        return {
            next: {
                ...ed,
                failedExams: ed.failedExams + 1,
                semesterStartDay: day + 1,
                lecturesDone: 0,
                stats: {
                    ...ed.stats,
                    examSits: ed.stats.examSits + 1
                }
            },
            passed: false,
            graduatedNow: false
        };
    }
    const graduating = ed.semester >= E.semestersToGraduate;
    if (graduating) {
        return {
            next: {
                ...ed,
                examsPassed: ed.examsPassed + 1,
                graduated: true,
                convocationDay: day + E.convocationInDays,
                semesterStartDay: day + 1,
                stats: {
                    ...ed.stats,
                    examSits: ed.stats.examSits + 1,
                    semestersPassed: ed.stats.semestersPassed + 1
                }
            },
            passed: true,
            graduatedNow: true
        };
    }
    return {
        next: {
            ...ed,
            examsPassed: ed.examsPassed + 1,
            semester: ed.semester + 1,
            semesterStartDay: day + 1,
            lecturesDone: 0,
            stats: {
                ...ed.stats,
                examSits: ed.stats.examSits + 1,
                semestersPassed: ed.stats.semestersPassed + 1
            }
        },
        passed: true,
        graduatedNow: false
    };
}
function canAttendConvocation(ed, day, standingAtUniversity) {
    if (!ed.graduated) return {
        ok: false,
        why: 'The convocation is for graduates only.'
    };
    if (ed.convocationAttended) return {
        ok: false,
        why: 'You don collect the certificate — once is once.'
    };
    if (ed.convocationDay === null || day < ed.convocationDay) return {
        ok: false,
        why: `The ceremony holds in ${ed.convocationDay !== null ? Math.max(0, ed.convocationDay - day) : E.convocationInDays} day(s) — the gown dey press.`
    };
    if (!standingAtUniversity) return {
        ok: false,
        why: 'The ceremony dey at FUL — travel there first.'
    };
    return {
        ok: true,
        why: ''
    };
}
function convocationApply(ed) {
    return {
        ...ed,
        convocationAttended: true
    };
}
function canEnroll(ed, level) {
    if (ed.enrolled) return {
        ok: false,
        why: 'You dey school already — face your books.'
    };
    if (ed.graduated) return {
        ok: false,
        why: 'You don graduate — FUL no dey re-admit the certified.'
    };
    if (level < E.enrollLevel) return {
        ok: false,
        why: `The gate opens at Level ${E.enrollLevel}.`
    };
    return {
        ok: true,
        why: ''
    };
}
function enrollApply(ed, day) {
    return {
        ...freshEducationState(),
        enrolled: true,
        semester: 1,
        semesterStartDay: day + 1
    };
}
}),
"[project]/src/game/systems/housing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M12: THE LADDER — HOUSING (pure rules)
 * -----------------------------------------------------
 * The roof over the hustle: the basic room starts as a RENT (a cycle
 * posts every N days, the landlord's wahala lands on a seeded share of
 * cycles — the spike, the leaking roof, the inspecting son), and the
 * ladder climbs by BUYING: family room → self-contain → GRA flat → the
 * Adankolo duplex. Every property carries a comfort rating that warms
 * the sleep law; furnishing tiers (fan → generator → AC) warm it further.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the wahala pick is a hash of the cycle —
 *    same cycle, same wahala, reload-proof.
 *  - The rent book is the only state: paidThrough, owed, the live
 *    wahala. Everything else derives.
 *  - No store, no React, no DOM. Every naira constant lives in config.LADDER.
 */ __turbopack_context__.s([
    "PROPERTIES",
    ()=>PROPERTIES,
    "buyPropertyApply",
    ()=>buyPropertyApply,
    "canBuyProperty",
    ()=>canBuyProperty,
    "canFurnish",
    ()=>canFurnish,
    "canPayRent",
    ()=>canPayRent,
    "canResolveWahala",
    ()=>canResolveWahala,
    "freshHousingState",
    ()=>freshHousingState,
    "furnishApply",
    ()=>furnishApply,
    "homeComfort",
    ()=>homeComfort,
    "housingDayRoll",
    ()=>housingDayRoll,
    "payRentApply",
    ()=>payRentApply,
    "propertyFor",
    ()=>propertyFor,
    "resolveWahalaApply",
    ()=>resolveWahalaApply,
    "wahalaForCycle",
    ()=>wahalaForCycle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
;
;
const H = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].housing;
function freshHousingState() {
    return {
        owned: null,
        furnishing: {},
        rentPaidThrough: 0,
        lastPostedDay: 0,
        rentOwed: 0,
        wahala: null,
        stats: {
            rentPaid: 0,
            wahalaResolved: 0,
            cyclesLate: 0
        }
    };
}
const PROPERTIES = H.properties;
function propertyFor(id) {
    return PROPERTIES.find((p)=>p.id === id) ?? null;
}
function homeComfort(housing) {
    if (!housing.owned) return 0;
    const prop = propertyFor(housing.owned);
    if (!prop) return 0;
    const tier = housing.furnishing[housing.owned] ?? 0;
    const tierDef = H.furnishTiers.find((f)=>f.tier === tier);
    return prop.comfort + (tierDef?.mood ?? 0);
}
function canBuyProperty(housing, propertyId, level, cash) {
    const prop = propertyFor(propertyId);
    if (!prop) return {
        ok: false,
        why: 'No such property.'
    };
    if (housing.owned === propertyId) return {
        ok: false,
        why: 'You already own this one.'
    };
    if (level < prop.level) return {
        ok: false,
        why: `${prop.name} unlocks at Level ${prop.level}.`
    };
    if (cash < prop.price) return {
        ok: false,
        why: `The agent wants ${prop.price.toLocaleString()} naira for ${prop.name}.`
    };
    return {
        ok: true,
        why: ''
    };
}
function buyPropertyApply(housing, propertyId) {
    return {
        ...housing,
        owned: propertyId
    };
}
function canFurnish(housing, tier) {
    if (!housing.owned) return {
        ok: false,
        why: 'Furnishing is for owners — the landlord no go gree.',
        cost: 0
    };
    const current = housing.furnishing[housing.owned] ?? 0;
    if (tier !== current + 1) return {
        ok: false,
        why: current === 0 ? 'Start with tier 1 — the fan and the curtains.' : `Finish tier ${current} first.`,
        cost: 0
    };
    const def = H.furnishTiers.find((f)=>f.tier === tier);
    if (!def) return {
        ok: false,
        why: 'No such tier.',
        cost: 0
    };
    return {
        ok: true,
        why: '',
        cost: def.cost
    };
}
function furnishApply(housing, tier) {
    if (!housing.owned) return housing;
    return {
        ...housing,
        furnishing: {
            ...housing.furnishing,
            [housing.owned]: tier
        }
    };
}
function wahalaForCycle(cycle) {
    const roll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('wahala', cycle) / 0xffffffff;
    if (roll >= H.wahalaChance) return null;
    const pick = Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('wahala-kind', cycle) / 0xffffffff * 3);
    if (pick === 0) return {
        kind: 'spike',
        cost: 0,
        note: 'The landlord don raise rent this cycle — "the dollar don enter"'
    };
    if (pick === 1) return {
        kind: 'repair',
        cost: 2000,
        note: 'The roof dey leak — the plumber wants his own money'
    };
    return {
        kind: 'inspection',
        cost: 1000,
        note: 'The landlord\'s son dey inspect — "settle small make we no stress"'
    };
}
function housingDayRoll(housing, day) {
    let next = {
        ...housing
    };
    let rentPosted = null;
    let wahalaArrived = null;
    let lateNotice = false;
    if (!next.owned) {
        // every MISSED cycle posts exactly once (a 20-day sleep lands them all)
        while(!next.owned && day > next.lastPostedDay && day >= next.lastPostedDay + H.rentCycleDays){
            const dueDay = next.lastPostedDay + H.rentCycleDays;
            const cycle = Math.floor(dueDay / H.rentCycleDays) + (dueDay % H.rentCycleDays === 0 ? 0 : 1) || Math.round(dueDay / H.rentCycleDays);
            const w = wahalaForCycle(cycle);
            const amount = w?.kind === 'spike' ? Math.round(H.baseRent * 1.15) : H.baseRent;
            next = {
                ...next,
                rentOwed: next.rentOwed + amount,
                lastPostedDay: dueDay,
                wahala: w ? {
                    day,
                    kind: w.kind,
                    cost: w.cost,
                    note: w.note
                } : null
            };
            rentPosted = {
                amount,
                cycle
            };
            if (w) wahalaArrived = w;
        }
        // the notice: two cycles behind and the landlord is done smiling
        if (next.rentOwed >= H.baseRent * 2) {
            next = {
                ...next,
                stats: {
                    ...next.stats,
                    cyclesLate: next.stats.cyclesLate + 1
                }
            };
            lateNotice = true;
        }
    }
    return {
        next,
        rentPosted,
        wahalaArrived,
        lateNotice
    };
}
function canPayRent(housing, cash) {
    if (housing.owned) return {
        ok: false,
        why: 'You own your roof — the landlord no dey your account again.',
        amount: 0
    };
    if (housing.rentOwed <= 0) return {
        ok: false,
        why: 'The rent book is clean — nothing due.',
        amount: 0
    };
    const amount = Math.min(housing.rentOwed, H.baseRent);
    if (cash < amount) return {
        ok: false,
        why: `One cycle na ${H.baseRent.toLocaleString()} — your pocket no carry am.`,
        amount
    };
    return {
        ok: true,
        why: '',
        amount
    };
}
function payRentApply(housing, amount) {
    return {
        ...housing,
        rentOwed: Math.max(0, housing.rentOwed - amount),
        rentPaidThrough: housing.rentPaidThrough + H.rentCycleDays,
        stats: {
            ...housing.stats,
            rentPaid: housing.stats.rentPaid + amount
        }
    };
}
function canResolveWahala(housing, cash) {
    if (!housing.wahala) return {
        ok: false,
        why: 'The compound is quiet — no wahala today.',
        cost: 0
    };
    if (housing.wahala.cost <= 0) return {
        ok: false,
        why: 'This wahala na rent problem — pay the rent book.',
        cost: 0
    };
    if (cash < housing.wahala.cost) return {
        ok: false,
        why: `The settlement na ${housing.wahala.cost.toLocaleString()} — your pocket no carry am.`,
        cost: housing.wahala.cost
    };
    return {
        ok: true,
        why: '',
        cost: housing.wahala.cost
    };
}
function resolveWahalaApply(housing) {
    return {
        ...housing,
        wahala: null,
        stats: {
            ...housing.stats,
            wahalaResolved: housing.stats.wahalaResolved + 1
        }
    };
}
}),
"[project]/src/game/systems/japa.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M12: THE LADDER — JAPA (pure rules)
 * --------------------------------------------------
 * The endgame gauntlet, played at the real desks: the NIMC slip at the
 * GRA office (a queue with an honest tomorrow), the passport (the
 * official window takes three days — or the street agent at Ganaja
 * takes half the money and sometimes disappears), the KGIRS clearance
 * (the taxman's signature reads your record), the police character
 * certificate (a clean fine book), and the send-off at the Motor Park
 * when the Abuja motor loads. The morning after, the first remittance
 * lands — the japa is real, and the city still needs you.
 *
 * THE MOPOL DETAIL: serve enough police shifts and the VIP escort
 * calls — every third day, the siren clears the road for your next
 * journeys (×0.8 minutes while it lasts).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the agent's honesty is a hash of
 *    (day, handle) — same day, same agent, same character.
 *  - The gauntlet is a chain: every desk refuses without the previous
 *    paper. The state is a progress ledger; nothing else persists.
 *  - No store, no React, no DOM. Every naira constant lives in config.LADDER.
 */ __turbopack_context__.s([
    "agentDelivers",
    ()=>agentDelivers,
    "canClearKgirs",
    ()=>canClearKgirs,
    "canCollectNimc",
    ()=>canCollectNimc,
    "canCollectPassport",
    ()=>canCollectPassport,
    "canGetPoliceCertificate",
    ()=>canGetPoliceCertificate,
    "canRequestNimc",
    ()=>canRequestNimc,
    "canRequestPassport",
    ()=>canRequestPassport,
    "canRunEscort",
    ()=>canRunEscort,
    "canTakeFlight",
    ()=>canTakeFlight,
    "canTryAgent",
    ()=>canTryAgent,
    "clearanceApply",
    ()=>clearanceApply,
    "collectNimcApply",
    ()=>collectNimcApply,
    "collectPassportApply",
    ()=>collectPassportApply,
    "escortAvailable",
    ()=>escortAvailable,
    "freshJapaState",
    ()=>freshJapaState,
    "hasPaper",
    ()=>hasPaper,
    "papersComplete",
    ()=>papersComplete,
    "policeCertificateApply",
    ()=>policeCertificateApply,
    "remittanceApply",
    ()=>remittanceApply,
    "remittanceLands",
    ()=>remittanceLands,
    "requestNimcApply",
    ()=>requestNimcApply,
    "requestPassportApply",
    ()=>requestPassportApply,
    "runEscortApply",
    ()=>runEscortApply,
    "sirenMinutesMult",
    ()=>sirenMinutesMult,
    "takeFlightApply",
    ()=>takeFlightApply,
    "tryAgentApply",
    ()=>tryAgentApply
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
;
;
const J = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].japa;
const M = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LADDER"].mopol;
function freshJapaState() {
    return {
        nimcReadyDay: 0,
        nimcDay: 0,
        passportReadyDay: 0,
        passportDay: 0,
        agentTries: 0,
        agentScams: 0,
        clearanceDay: 0,
        policeDay: 0,
        flownDay: 0,
        remitDay: 0,
        policeShifts: 0,
        sirenUntilDay: 0,
        lastEscortDay: 0,
        stats: {
            escorts: 0,
            escortEarned: 0
        }
    };
}
function hasPaper(japa, step) {
    switch(step){
        case 'nimc':
            return japa.nimcDay > 0;
        case 'passport':
            return japa.passportDay > 0;
        case 'clearance':
            return japa.clearanceDay > 0;
        case 'police':
            return japa.policeDay > 0;
        case 'flight':
            return japa.flownDay > 0;
    }
}
function papersComplete(japa) {
    return hasPaper(japa, 'nimc') && hasPaper(japa, 'passport') && hasPaper(japa, 'clearance') && hasPaper(japa, 'police');
}
function canRequestNimc(japa, level, standingAtGrades) {
    if (hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'You get your NIMC slip already.'
    };
    if (level < J.unlockLevel) return {
        ok: false,
        why: `The JAPA desks open at Level ${J.unlockLevel}.`
    };
    if (japa.nimcReadyDay > 0) return {
        ok: false,
        why: `The slip dey print — come back in ${Math.max(1, japa.nimcReadyDay)} day(s)... the queue no dey forget anybody.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The NIMC desk dey at the Government Area — go there in person.'
    };
    return {
        ok: true,
        why: ''
    };
}
function requestNimcApply(japa, day) {
    return {
        ...japa,
        nimcReadyDay: day + J.nimcQueueDays
    };
}
function canCollectNimc(japa, day, standingAtGrades) {
    if (hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'You don collect am already.'
    };
    if (japa.nimcReadyDay === 0) return {
        ok: false,
        why: 'You never request the slip.'
    };
    if (day < japa.nimcReadyDay) return {
        ok: false,
        why: `Come back tomorrow — the queue dey move slow.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The slip collects at the Government Area desk.'
    };
    return {
        ok: true,
        why: ''
    };
}
function collectNimcApply(japa, day) {
    return {
        ...japa,
        nimcDay: day
    };
}
function canRequestPassport(japa, cash, standingAtGrades) {
    if (hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'Your passport dey your hand already.'
    };
    if (!hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'The window wants your NIMC slip first — the chain no dey skip.'
    };
    if (japa.passportReadyDay > 0) return {
        ok: false,
        why: `The passport dey process — the official window takes ${J.passportQueueDays} days.`
    };
    if (cash < J.passportFee) return {
        ok: false,
        why: `The official fee na ${J.passportFee.toLocaleString()}.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The passport window dey at the Government Area.'
    };
    return {
        ok: true,
        why: ''
    };
}
function requestPassportApply(japa, day) {
    return {
        ...japa,
        passportReadyDay: day + J.passportQueueDays
    };
}
function canCollectPassport(japa, day, standingAtGrades) {
    if (hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'You don collect am already.'
    };
    if (japa.passportReadyDay === 0) return {
        ok: false,
        why: 'You never apply.'
    };
    if (day < japa.passportReadyDay) return {
        ok: false,
        why: `The book dey print — ${japa.passportReadyDay - day} day(s) more.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The passport collects at the Government Area window.'
    };
    return {
        ok: true,
        why: ''
    };
}
function collectPassportApply(japa, day) {
    return {
        ...japa,
        passportDay: day
    };
}
function agentDelivers(day, handle) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('japa-agent', day, handle ?? 'guest') / 0xffffffff < J.agentRealChance;
}
function canTryAgent(japa, cash, standingAtGanaja) {
    if (hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'You get passport already — the agent no fit help you.'
    };
    if (!hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'Even the agent wants your NIMC slip first.'
    };
    if (japa.passportReadyDay > 0) return {
        ok: false,
        why: 'Your official passport dey process — no double-book am.'
    };
    if (cash < J.agentFee) return {
        ok: false,
        why: `The agent wants ${J.agentFee.toLocaleString()} up front.`
    };
    if (!standingAtGanaja) return {
        ok: false,
        why: 'The agent dey hustle at Ganaja Junction.'
    };
    return {
        ok: true,
        why: ''
    };
}
function tryAgentApply(japa, day, handle) {
    const real = agentDelivers(day, handle);
    return {
        next: {
            ...japa,
            passportDay: real ? day : japa.passportDay,
            agentTries: japa.agentTries + 1,
            agentScams: japa.agentScams + (real ? 0 : 1)
        },
        real
    };
}
function canClearKgirs(japa, warrant, standingAtGrades) {
    if (hasPaper(japa, 'clearance')) return {
        ok: false,
        why: 'The clearance dey your file already.'
    };
    if (!hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'The clearance wants your passport in the file first.'
    };
    if (warrant) return {
        ok: false,
        why: 'A tax warrant dey your name — the KGIRS pen no go move. Settle am first.'
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The clearance desk dey at the Government Area.'
    };
    return {
        ok: true,
        why: ''
    };
}
function clearanceApply(japa, day) {
    return {
        ...japa,
        clearanceDay: day
    };
}
function canGetPoliceCertificate(japa, fines, cash, standingAtGrades) {
    if (hasPaper(japa, 'police')) return {
        ok: false,
        why: 'The certificate dey your file already.'
    };
    if (!hasPaper(japa, 'clearance')) return {
        ok: false,
        why: 'The police wants the KGIRS clearance in the file first.'
    };
    if (fines > 0) return {
        ok: false,
        why: 'Your fine book no clean — settle the police first.'
    };
    if (cash < J.policeFee) return {
        ok: false,
        why: `The certificate na ${J.policeFee.toLocaleString()}.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The police desk dey at the Government Area.'
    };
    return {
        ok: true,
        why: ''
    };
}
function policeCertificateApply(japa, day) {
    return {
        ...japa,
        policeDay: day
    };
}
function canTakeFlight(japa, cash, standingAtPark) {
    if (japa.flownDay > 0) return {
        ok: false,
        why: 'You don fly already — the send-off na once in a life.'
    };
    if (!papersComplete(japa)) return {
        ok: false,
        why: 'The motor dey wait for the complete file — check the missing papers.'
    };
    if (cash < J.ticketFee) return {
        ok: false,
        why: `The ticket na ${J.ticketFee.toLocaleString()} — the Abuja motor no dey take credit.`
    };
    if (!standingAtPark) return {
        ok: false,
        why: 'The send-off dey at the Motor Park — where every journey starts.'
    };
    return {
        ok: true,
        why: ''
    };
}
function takeFlightApply(japa, day) {
    return {
        ...japa,
        flownDay: day
    };
}
function remittanceLands(japa, day) {
    return japa.flownDay > 0 && japa.remitDay === 0 && day > japa.flownDay;
}
function remittanceApply(japa, day) {
    return {
        ...japa,
        remitDay: day
    };
}
function escortAvailable(japa, day, warrant) {
    if (japa.policeShifts < M.shiftsToUnlock) return false;
    if (warrant) return false;
    return day % M.escortEvery === 0 && day > japa.lastEscortDay;
}
function canRunEscort(japa, day, warrant, standingAtGrades) {
    if (japa.policeShifts < M.shiftsToUnlock) return {
        ok: false,
        why: `The detail wants ${M.shiftsToUnlock} police shifts of trust — you carry ${japa.policeShifts}.`
    };
    if (warrant) return {
        ok: false,
        why: 'No escort for a wanted man — settle the taxman.'
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The convoy assembles at the Government Area.'
    };
    if (!escortAvailable(japa, day, warrant)) return {
        ok: false,
        why: `The detail no dey today — the convoy moves every ${M.escortEvery} days.`
    };
    return {
        ok: true,
        why: ''
    };
}
function runEscortApply(japa, day) {
    return {
        ...japa,
        lastEscortDay: day,
        sirenUntilDay: day + M.sirenDays,
        stats: {
            ...japa.stats,
            escorts: japa.stats.escorts + 1,
            escortEarned: japa.stats.escortEarned + M.escortPay
        }
    };
}
function sirenMinutesMult(japa, day) {
    return japa.sirenUntilDay >= day ? M.sirenMinutesMult : 1;
}
}),
"[project]/src/game/systems/shield.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M13: THE FAMILY SHIELD (pure rules)
 * --------------------------------------------------
 * One download, three generations — Lagos Life structurally cannot
 * follow. Kids (6–12) walk a safer Lokoja: no crime road, light hustles
 * only, preset-emote socials, and the Spot-the-Scammer literacy game.
 * Teens (13–17) hustle freely but the crime road stays locked and school
 * pays better. Adults see everything. Elder mode is an accessibility
 * toggle, not a third life.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. Content
 *    gates answer honest questions; every action surface asks before it
 *    offers a band something the shield refuses.
 *  - The graph block: an adult account can NEVER contact a minor
 *    account. Not "we try to prevent" — canContact() is the single
 *    function every present and future social surface must pass through,
 *    and it is structurally false for adult→minor.
 *  - Zero minor data collection: the minor register path (server side)
 *    stores no contact and no recovery line. The parent PIN is the only
 *    key a minor account answers to.
 */ __turbopack_context__.s([
    "AGE_LAW",
    ()=>AGE_LAW,
    "CRIME_CONTENT_IDS",
    ()=>CRIME_CONTENT_IDS,
    "CRIME_REFUSALS",
    ()=>CRIME_REFUSALS,
    "HONEST_LINES",
    ()=>HONEST_LINES,
    "SCAM_LINES",
    ()=>SCAM_LINES,
    "canContact",
    ()=>canContact,
    "canHustle",
    ()=>canHustle,
    "canJapa",
    ()=>canJapa,
    "canPlayScammer",
    ()=>canPlayScammer,
    "crimeAllowed",
    ()=>crimeAllowed,
    "elderClass",
    ()=>elderClass,
    "freshShieldState",
    ()=>freshShieldState,
    "localPinHash",
    ()=>localPinHash,
    "makeLocalSalt",
    ()=>makeLocalSalt,
    "scamAnswerApply",
    ()=>scamAnswerApply,
    "scamReward",
    ()=>scamReward,
    "scamRound",
    ()=>scamRound,
    "tierGateVerdict",
    ()=>tierGateVerdict,
    "validateParentPin",
    ()=>validateParentPin
]);
const AGE_LAW = {
    kid: {
        crime: false,
        hustle: 'light',
        social: 'emotes',
        scammerFeatured: true,
        studyBoost: 1.25,
        japa: false
    },
    teen: {
        crime: false,
        hustle: 'all',
        social: 'full',
        scammerFeatured: true,
        studyBoost: 1.25,
        japa: true
    },
    adult: {
        crime: true,
        hustle: 'all',
        social: 'full',
        scammerFeatured: false,
        studyBoost: 1,
        japa: true
    }
};
const CRIME_CONTENT_IDS = [
    'night-out',
    'regatta-bet',
    'japa-agent'
];
const CRIME_REFUSALS = {
    'night-out': 'The lounge na 18+ matter — go school tomorrow, the street go wait.',
    'regatta-bet': 'Race-eve betting na 18+. Small paddies dey sponsor boat — that one better pass.',
    'japa-agent': 'No waka enter that agent office — na adult paperwork, and some of dem na 419.'
};
function crimeAllowed(band, content) {
    void content;
    return AGE_LAW[band].crime;
}
function canHustle(band, def) {
    return AGE_LAW[band].hustle === 'all' || def.kidSafe;
}
function canJapa(band) {
    return AGE_LAW[band].japa;
}
function canContact(from, to) {
    if (from === 'adult' && (to === 'kid' || to === 'teen')) return false;
    return true;
}
function validateParentPin(pin) {
    if (!/^\d{6}$/.test(pin)) return {
        ok: false,
        why: 'Parent PIN must be exactly 6 digits.'
    };
    return {
        ok: true,
        why: ''
    };
}
function localPinHash(pin, salt) {
    let h = 0x811c9dc5;
    const material = `${salt}:${pin}`;
    for(let round = 0; round < 600; round++){
        for(let i = 0; i < material.length; i++){
            h ^= material.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        h = h + round >>> 0;
    }
    return h.toString(16).padStart(8, '0') + salt;
}
function makeLocalSalt() {
    // deterministic-safe salt for guests: mixes clock with entropy when present
    const rnd = typeof crypto !== 'undefined' && 'getRandomValues' in crypto ? Array.from(crypto.getRandomValues(new Uint8Array(6))).map((b)=>b.toString(16).padStart(2, '0')).join('') : Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    return rnd;
}
/** The tier ladder order — kid climbs to teen climbs to adult. */ const TIER_ORDER = [
    'kid',
    'teen',
    'adult'
];
function tierGateVerdict(from, to, parentPinOk) {
    if (from === to) return {
        allowed: false,
        why: 'You don dey that tier already.'
    };
    const up = TIER_ORDER.indexOf(to) > TIER_ORDER.indexOf(from);
    if (up && from !== 'adult') {
        return parentPinOk ? {
            allowed: true,
            why: ''
        } : {
            allowed: false,
            why: 'A parent must unlock that tier — enter the Parent PIN.'
        };
    }
    return {
        allowed: true,
        why: ''
    };
}
function elderClass(on) {
    return on ? 'elder-mode' : null;
}
const SCAM_LINES = [
    {
        text: 'You don win MTN promo! Send ₦2,000 activation fee make I release the ₦500,000.',
        why: 'No real promo asks you to PAY to collect a prize. Na advance-fee fraud.'
    },
    {
        text: 'I be bank official — give me your BVN and card PIN make I clear the ₦750,000 wey dey hang.',
        why: 'Your bank will NEVER ask for your BVN or PIN. Na account takeover.'
    },
    {
        text: 'Your uncle send package from abroad — pay customs fee ₦15,000 to this personal account.',
        why: 'Customs fees no ever enter personal account. Na fake delivery scam.'
    },
    {
        text: 'Click this link sharp sharp make you claim your JAMB refund before 6pm.',
        why: 'Strange links = phishing. Dem go harvest your details. Type the site yourself or no go.'
    },
    {
        text: 'Send the naira first, the dollar go land for you tomorrow — black market rate, no inspection.',
        why: 'Nobody honest collects money before you see the goods. Na 419.'
    },
    {
        text: 'Your account go block in 24 hours unless you update am with your card PIN for this app.',
        why: 'Threat + urgency + PIN request = scam. Bank block no dey come like WhatsApp message.'
    },
    {
        text: 'I be army officer — seized phones dey sell half price, pay today, no receipt, no inspection.',
        why: 'Stolen goods + no receipt + pressure = you go lose your money (or worse).'
    },
    {
        text: 'Send me the OTP wey just enter your phone make I finish the transfer — I go send am back.',
        why: 'Your OTP na the last lock. ANYBODY wey ask for am na thief.'
    },
    {
        text: 'Pay ₦5,000 for immigration form — I go link you visa wey no get interview at all.',
        why: 'No visa skip interview by magic. Na japa scam — dem dey sweep boys with am.'
    },
    {
        text: 'Send any amount, in 30 minutes e go double — na village power from my grandfather.',
        why: 'Money no dey double by mouth. Ponzi + juju story = 419 classic.'
    },
    {
        text: 'iPhone 15 Pro ₦90k — pay today, pickup tomorrow, no come inspect am before payment o.',
        why: 'Cheap flagship + no inspection + pay-first = wrong marketplace triangle.'
    },
    {
        text: 'Your NECO result fail — pay ₦8,000 make I upgrade am for CBT office before dem seal am.',
        why: 'Result upgrade na scam AND offence — dem go collect the ₦8k plus your future.'
    }
];
const HONEST_LINES = [
    {
        text: 'Kpata market dey open every third day — the fresh pepper land that morning.',
        why: 'True market gist — no payment, no urgency, no personal account.'
    },
    {
        text: 'Make you save ₦500 every week for the bank — small drops fill big buckets.',
        why: 'Honest advice no ever ask for YOUR money to move first.'
    },
    {
        text: 'NEPA bill don land — pay am for the office for GRA, the desk no dey collect extra.',
        why: 'Real bills dey get real offices. You go see the receipt.'
    },
    {
        text: 'If anybody ask for your OTP — even if dem say na bank — block am and report.',
        why: 'This na the lesson itself: OTP na last lock, nobody legit dey ask.'
    },
    {
        text: 'Always collect your school fee receipt the same day you pay.',
        why: 'Paperwork advice — receipt dey protect you, scam dey avoid paper.'
    },
    {
        text: 'Register your SIM with your NIN at the approved centre — the service dey free.',
        why: 'Real registrations happen at centres, never by transfer to strangers.'
    },
    {
        text: 'The canoe ferry dey charge flat fare — count your change before you waka.',
        why: 'Honest street math — counting change no be crime.'
    },
    {
        text: 'The Motor Park job board dey refresh every morning — check am early.',
        why: 'Work gist wey you fit verify with your own eye.'
    },
    {
        text: 'Harmattan sun dey harsh — carry water, wear face cap.',
        why: 'Care advice. Scams dey always carry money directions, no be water.'
    },
    {
        text: 'Keep your rent receipt safe — landlord wahala dey always come one day.',
        why: 'Receipt na shield. 419 no like anything wey leave paper trail.'
    },
    {
        text: 'Baba T dey wash keke for the compound — ₦800, ask anybody for there.',
        why: 'Real service = real place + verifiable person + agreed price.'
    },
    {
        text: 'The library dey open till evening — free past questions dey the shelf.',
        why: 'Free, checkable, no money path. That na honest street offer.'
    }
];
/** mulberry32 — tiny deterministic PRNG (fixed seed keeps the lesson stable). */ function mulberry32(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function scamRound(day) {
    const rng = mulberry32(Math.imul(day + 1, 2654435761) >>> 0);
    const scam = SCAM_LINES[Math.floor(rng() * SCAM_LINES.length)];
    const h1 = HONEST_LINES[Math.floor(rng() * HONEST_LINES.length)];
    let h2 = HONEST_LINES[Math.floor(rng() * HONEST_LINES.length)];
    if (h2.text === h1.text) h2 = HONEST_LINES[(HONEST_LINES.indexOf(h2) + 3) % HONEST_LINES.length];
    const cards = [
        {
            text: scam.text,
            scam: true,
            why: scam.why
        },
        {
            text: h1.text,
            scam: false,
            why: h1.why
        },
        {
            text: h2.text,
            scam: false,
            why: h2.why
        }
    ];
    // seeded shuffle (Fisher–Yates with the same rng — deterministic)
    for(let i = cards.length - 1; i > 0; i--){
        const j = Math.floor(rng() * (i + 1));
        [cards[i], cards[j]] = [
            cards[j],
            cards[i]
        ];
    }
    return {
        day,
        options: cards,
        scamIndex: cards.findIndex((c)=>c.scam)
    };
}
function scamReward(streakBefore) {
    const capped = Math.min(streakBefore, 10);
    const cash = 150 + 25 * capped;
    return {
        cash,
        smartXp: 8,
        mood: 2
    };
}
function canPlayScammer(lastPlayedDay, day) {
    return lastPlayedDay !== day;
}
function freshShieldState() {
    return {
        scammerDay: 0,
        scammerCorrect: 0,
        scammerWrong: 0,
        scammerStreak: 0,
        parentPinHash: null
    };
}
function scamAnswerApply(state, round, pickIndex, day) {
    const picked = round.options[pickIndex];
    if (picked.scam) {
        const reward = scamReward(state.scammerStreak);
        return {
            next: {
                ...state,
                scammerDay: day,
                scammerCorrect: state.scammerCorrect + 1,
                scammerStreak: state.scammerStreak + 1
            },
            correct: true,
            reward,
            lesson: picked.why
        };
    }
    const honest = round.options[round.scamIndex];
    return {
        next: {
            ...state,
            scammerDay: day,
            scammerWrong: state.scammerWrong + 1,
            scammerStreak: 0
        },
        correct: false,
        reward: null,
        lesson: honest.why
    };
}
}),
"[project]/src/game/systems/pulse.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M15: THE CITY PULSE (pure rules)
 * ------------------------------------------------
 * The civic mesh already LIVES — transformers blow (M8), the Niger
 * rises (M11), the calendar dances (M10), the market breathes (M2).
 * The Pulse is the city's own newspaper: the SAME deterministic facts,
 * rewritten as shareable news. Zero new simulation, zero new state —
 * the feed derives from the day + the slices the game already keeps.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the same city state yields the same
 *    feed, byte for byte. A test can pin a day and know the news.
 *  - The city's PRIVATE books stay OUT of the paper: bills, taxes,
 *    fines and the player's wallet never become headlines. The Pulse
 *    reports the city (outages, rivers, festivals, market, scarcity),
 *    not the player.
 *  - Weight law: a blown transformer outranks a flood warning, which
 *    outranks a festival, which outranks the market. Ties break by id
 *    (a total order — the feed is sortable and testable).
 *  - Read-marking is idempotent: marking a feed you already marked
 *    changes nothing, and the unread count never counts yesterday.
 *  - KNOW YOUR CITY: the share card's percent reads REAL persisted
 *    facts only (biz, garage, festivals, rivers, school, home, JAPA,
 *    MOPOL, the ledger). No invented progress, no vanity rounding.
 */ __turbopack_context__.s([
    "cityChecklist",
    ()=>cityChecklist,
    "cityGrade",
    ()=>cityGrade,
    "cityKnowledge",
    ()=>cityKnowledge,
    "freshPulseState",
    ()=>freshPulseState,
    "markPulseRead",
    ()=>markPulseRead,
    "pulseForDay",
    ()=>pulseForDay,
    "pulseUnread",
    ()=>pulseUnread
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const zoneName = (zoneId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.name ?? zoneId;
function pulseForDay(input) {
    const { day, weather, chaos, civic, rivers, calendar } = input;
    const items = [];
    // 1) THE BLAST — a transformer is dark RIGHT NOW (the M8 outage law)
    if (chaos.active && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, chaos.active.zoneId, day)) {
        const z = chaos.active.zoneId;
        items.push({
            id: `${day}:blast:${z}`,
            kind: 'blast',
            icon: '⚡',
            headline: `Transformer don blow for ${zoneName(z)}!`,
            body: `The whole area don go dark. Community dey gather ₦${chaos.active.pool.toLocaleString('en-NG')} for the technician — ₦500/₦1k/₦2.5k in person.`,
            zoneId: z,
            w: 100
        });
    }
    // 2) UP NEPA — the light came back THIS morning (the M8 fix book)
    const backToday = chaos.recent.find((r)=>r.untilDay === day - 1);
    if (backToday) {
        items.push({
            id: `${day}:upnepa:${backToday.zoneId}`,
            kind: 'upnepa',
            icon: '💡',
            headline: `UP NEPA! ${zoneName(backToday.zoneId)} don get light back`,
            body: backToday.fixedBy === 'community' ? 'The community pool paid the technician — the street dey shine again.' : 'The disco finally rolled the truck — the street dey shine again.',
            zoneId: backToday.zoneId,
            w: 80
        });
    }
    // 3) THE FLOOD — the Niger speaks for itself (the M11 cut law)
    const cuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cutZonesFor"])(day);
    if (weather === 'flood' || cuts.length > 0) {
        items.push({
            id: `${day}:flood`,
            kind: 'flood',
            icon: '🌊',
            headline: cuts.length > 0 ? `The Niger don rise — ${cuts.map(zoneName).join(' + ')} dey cut` : 'The Niger don rise — watch the low streets',
            body: cuts.length > 0 ? `Land transport no go pass there today. The canoe ferry dey run from the jetty — river level ${Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverLevelFor"])(day) * 100)}%.` : `River level ${Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverLevelFor"])(day) * 100)}% — the low streets go cut soon. Buy sand early.`,
            zoneId: cuts[0] ?? null,
            w: 95
        });
    }
    // 4) THE STORM — heavy sky warning (the M8 blowout window)
    if (weather === 'storm') {
        items.push({
            id: `${day}:storm`,
            kind: 'storm',
            icon: '⛈️',
            headline: 'Heavy sky dey hang over the city',
            body: 'Storm days don blow transformers before. Hold your people close — and maybe drop ₦500 in the light fund early.',
            zoneId: null,
            w: 70
        });
    }
    // 5) THE FUEL PAPER — scarcity is public math (the M8 scarcity law)
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isScarcityDay"])(day)) {
        items.push({
            id: `${day}:fuel`,
            kind: 'fuel',
            icon: '⛽',
            headline: 'Fuel scarce today — pump don dry for Ganaja',
            body: `Black market dey sell ×${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fuelMultFor"])(day).toFixed(1)}. ATM dey cap ₦${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].atmCap.toLocaleString('en-NG')} — POS agents don price am.`,
            zoneId: 'ganaja-junction',
            w: 85
        });
    }
    // 6) THE MARKET — market day + the day's flavour event (the M2 roll)
    if (civic.market.marketDay) {
        items.push({
            id: `${day}:market`,
            kind: 'market',
            icon: '🧺',
            headline: 'Market day for Kpata — prices don soft',
            body: 'The whole street don turn bazaar. Same goods, softer prices — carry your bag.',
            zoneId: 'kpata-market',
            w: 50
        });
    } else if (civic.market.event) {
        items.push({
            id: `${day}:market-event`,
            kind: 'market',
            icon: civic.market.event.icon || '🧺',
            headline: civic.market.event.label,
            body: civic.market.event.note,
            zoneId: 'kpata-market',
            w: 55
        });
    }
    // 7) THE FESTIVAL — today's day-festival (the M10 calendar)
    const fest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["festivalForDay"])(day);
    if (fest && fest.daysLeft <= 1) {
        items.push({
            id: `${day}:festival:${fest.id}`,
            kind: 'festival',
            icon: fest.icon,
            headline: `${fest.name} dey ${zoneName(fest.venueId)} today!`,
            body: fest.note,
            zoneId: fest.venueId,
            w: 60
        });
    }
    // 8) THE WEDDING — the compound with canopies (the M10 cycle law)
    const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weddingForCycle"])(day);
    if (wedding.isToday) {
        items.push({
            id: `${day}:wedding:${wedding.id}`,
            kind: 'wedding',
            icon: '💍',
            headline: `${wedding.couple} dey wed for ${zoneName(wedding.venueId)} today!`,
            body: 'Aso-ebi dey Kpata — gift well and the respect go follow you.',
            zoneId: wedding.venueId,
            w: 55
        });
    }
    // 9) THE PAVING — the town union's live project (the M10 season)
    if (calendar.paving && calendar.paving.zoneId && calendar.paving.cycle === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pavingCycleOf"])(day)) {
        items.push({
            id: `${day}:paving:${calendar.paving.zoneId}`,
            kind: 'paving',
            icon: '🛣️',
            headline: `Town union dey pave ${zoneName(calendar.paving.zoneId)}`,
            body: `₦${calendar.paving.pool.toLocaleString('en-NG')} don enter the project pool — the street go ride smooth for 20 days when e finish.`,
            zoneId: calendar.paving.zoneId,
            w: 40
        });
    }
    // 10) AJO DAY — the circles settle (the M8 payout law)
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPayoutDay"])(day)) {
        items.push({
            id: `${day}:ajo`,
            kind: 'ajo',
            icon: '🤝',
            headline: 'Ajo payout day — the circles don settle',
            body: `Every ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].payoutEvery} days the ajo lands. Market go busy (softer prices), and pockets go full.`,
            zoneId: null,
            w: 45
        });
    }
    // the weight law: louder first, ties break by id — a total order
    items.sort((a, b)=>b.w - a.w || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    if (items.length === 0) {
        items.push({
            id: `${day}:quiet`,
            kind: 'quiet',
            icon: '🌤️',
            headline: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSurge"])(day) ? 'The river dey watch — quiet day for the city' : 'Nothing dey shake the city today',
            body: 'Quiet days na for hustle. The pulse go shout when the city shake.',
            zoneId: null,
            w: 0
        });
    }
    return items;
}
function markPulseRead(pulse, day, items) {
    const ids = items.map((i)=>i.id);
    const seen = new Set(pulse.seen);
    for (const id of ids)seen.add(id);
    return {
        ...pulse,
        readDay: day,
        seen: [
            ...seen
        ].slice(-64)
    };
}
function pulseUnread(pulse, items) {
    const seen = new Set(pulse.seen);
    return items.filter((i)=>!seen.has(i.id)).length;
}
function cityChecklist(player, slices) {
    const p = player;
    const c = slices.calendar;
    const r = slices.rivers;
    return [
        {
            id: 'biz',
            label: 'Open your own shop',
            done: p.businesses.length > 0
        },
        {
            id: 'vehicle',
            label: 'Own a ride',
            done: p.vehicles.length > 0
        },
        {
            id: 'job',
            label: 'Finish a real job',
            done: p.stats.jobsCompleted > 0
        },
        {
            id: 'hustle',
            label: 'Finish a street hustle',
            done: p.stats.hustlesCompleted > 0
        },
        {
            id: 'earned',
            label: 'Earn ₦50k lifetime',
            done: p.stats.totalEarned >= 50_000
        },
        {
            id: 'bank',
            label: 'Keep money in the bank',
            done: p.bankBalance > 0
        },
        {
            id: 'friends',
            label: 'Know 3 people by name',
            done: Object.keys(p.relationships).length >= 3
        },
        {
            id: 'festival',
            label: 'Attend a festival',
            done: c.stats.festivalsAttended > 0
        },
        {
            id: 'wedding',
            label: 'Attend a wedding',
            done: c.stats.weddings > 0
        },
        {
            id: 'regatta',
            label: 'Back a regatta crew',
            done: c.sponsored.length > 0 || c.stats.regattaWins > 0
        },
        {
            id: 'paving',
            label: 'Help pave a street',
            done: c.stats.projectsDone > 0
        },
        {
            id: 'surge',
            label: 'Fight the river surge',
            done: r.stats.sandBought > 0 || Object.keys(r.walkways).length > 0
        },
        {
            id: 'ferry',
            label: 'Run the canoe ferry',
            done: r.stats.ferryRuns > 0
        },
        {
            id: 'rescue',
            label: 'Save the cold rooms',
            done: r.stats.rescues > 0
        },
        {
            id: 'school',
            label: 'Sit a FUL exam',
            done: slices.education.examsPassed > 0 || slices.education.graduated
        },
        {
            id: 'home',
            label: 'Own your own place',
            done: slices.housing.owned !== null
        },
        {
            id: 'papers',
            label: 'Start the JAPA papers',
            done: slices.japa.passportDay > 0 || slices.japa.nimcDay > 0
        },
        {
            id: 'mopol',
            label: 'Serve a MOPOL shift',
            done: slices.japa.policeShifts > 0
        },
        {
            id: 'grid',
            label: 'Feed the light fund',
            done: slices.chaos.stats.contributed > 0
        }
    ];
}
function cityGrade(percent) {
    if (percent >= 100) return 'Confluence Legend';
    if (percent >= 75) return 'Indigene';
    if (percent >= 50) return 'Waka Rider';
    if (percent >= 25) return 'Walker';
    return 'Visitor';
}
function cityKnowledge(player, slices) {
    const checks = cityChecklist(player, slices);
    const checked = checks.filter((c)=>c.done).length;
    const percent = Math.round(checked / checks.length * 100);
    return {
        percent,
        grade: cityGrade(percent),
        checked,
        total: checks.length,
        checks
    };
}
function freshPulseState() {
    return {
        readDay: 0,
        seen: [],
        arrivals: [],
        stats: {
            shares: 0,
            arrivalsIn: 0
        }
    };
}
}),
"[project]/src/game/systems/fortress.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHAIN_SEED",
    ()=>CHAIN_SEED,
    "FORTRESS_KEYS",
    ()=>FORTRESS_KEYS,
    "FORT_KEY_STORAGE",
    ()=>FORT_KEY_STORAGE,
    "anomalyVerdict",
    ()=>anomalyVerdict,
    "benchSign",
    ()=>benchSign,
    "chainHash",
    ()=>chainHash,
    "chainNext",
    ()=>chainNext,
    "configFingerprint",
    ()=>configFingerprint,
    "freshFortressState",
    ()=>freshFortressState,
    "hmacSha256",
    ()=>hmacSha256,
    "incomeGuard",
    ()=>incomeGuard,
    "loadPlan",
    ()=>loadPlan,
    "sha256",
    ()=>sha256,
    "signPayload",
    ()=>signPayload,
    "utf8Bytes",
    ()=>utf8Bytes,
    "velocityGuard",
    ()=>velocityGuard,
    "verifyChain",
    ()=>verifyChain,
    "verifyPayload",
    ()=>verifyPayload,
    "writePlan",
    ()=>writePlan
]);
/**
 * LOKOJA LIFE — M14: THE FORTRESS (pure rules)
 * ---------------------------------------------
 * Prerequisite for virality + trading: the save is SIGNED, the ledger
 * is a CHAIN, the income is GUARDED, and the writes are DOUBLE-BUFFERED.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic. The SHA-256 + HMAC live here in pure TS so
 *    the signing is SYNCHRONOUS everywhere (browser autosave, bun tests,
 *    node) — no async WebCrypto in the save path, no dependency drift.
 *  - The signature is HMAC-SHA256 over the EXACT serialized save string,
 *    keyed by a device-local key stored OUTSIDE the save. A player who
 *    hex-edits their save in localStorage breaks the signature; re-signing
 *    requires the key. (An honest note: anything client-side is a barrier,
 *    not a vault — the barriers here stop casual cheats, memory editors
 *    and shared save hacks, and make tampering LOUD.)
 *  - The kobo-chain: every ledger entry carries hash = H(prevHash | day |
 *    slot | amount | category | label). The chain anchors at 'seed' and
 *    walks oldest→newest; any edited amount, category or order breaks it.
 *  - The income guard: no single event may exceed the ceiling, no day may
 *    out-earn the day cap — an overflow is CLAMPED (never crashed) and
 *    flagged as an anomaly for the honest toast + the anomaly counter.
 *  - Double-buffer: the previous primary payload is copied to the shadow
 *    key BEFORE the primary is overwritten; a torn primary write falls
 *    back to the shadow, then the M9 backup slot, then fresh. Nobody
 *    ever loses a save to a crashed tab mid-write.
 */ /* --------------------------------- SHA-256 ---------------------------------- */ /** Pure TS SHA-256 core over RAW BYTES — returns the digest as 32 raw bytes. */ function sha256BytesRaw(msg) {
    const K = [
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0x0fc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x06ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
    ];
    const rr = (x, n)=>x >>> n | x << 32 - n;
    const bytes = [
        ...msg
    ];
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while(bytes.length % 64 !== 56)bytes.push(0);
    // big-endian 64-bit length (we never exceed 2^32 bits — push hi then lo)
    bytes.push(0, 0, 0, 0, bitLen >>> 24 & 255, bitLen >>> 16 & 255, bitLen >>> 8 & 255, bitLen & 255);
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    const w = new Array(64);
    for(let off = 0; off < bytes.length; off += 64){
        for(let i = 0; i < 16; i++){
            w[i] = bytes[off + i * 4] << 24 | bytes[off + i * 4 + 1] << 16 | bytes[off + i * 4 + 2] << 8 | bytes[off + i * 4 + 3];
        }
        for(let i = 16; i < 64; i++){
            const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ w[i - 15] >>> 3;
            const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ w[i - 2] >>> 10;
            w[i] = w[i - 16] + s0 + w[i - 7] + s1 | 0;
        }
        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
        for(let i = 0; i < 64; i++){
            const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
            const ch = e & f ^ ~e & g;
            const t1 = h + S1 + ch + K[i] + w[i] | 0;
            const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
            const maj = a & b ^ a & c ^ b & c;
            const t2 = S0 + maj | 0;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
        }
        h0 = h0 + a | 0;
        h1 = h1 + b | 0;
        h2 = h2 + c | 0;
        h3 = h3 + d | 0;
        h4 = h4 + e | 0;
        h5 = h5 + f | 0;
        h6 = h6 + g | 0;
        h7 = h7 + h | 0;
    }
    const out = [];
    for (const x of [
        h0,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        h7
    ]){
        out.push(x >>> 24 & 255, x >>> 16 & 255, x >>> 8 & 255, x & 255);
    }
    return out;
}
function utf8Bytes(msg) {
    const bytes = [];
    for(let i = 0; i < msg.length; i++){
        let c = msg.charCodeAt(i);
        if (c < 0x80) bytes.push(c);
        else if (c < 0x800) bytes.push(0xc0 | c >> 6, 0x80 | c & 63);
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < msg.length) {
            const c2 = msg.charCodeAt(++i);
            c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
            bytes.push(0xf0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
        } else bytes.push(0xe0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    }
    return bytes;
}
function sha256(msg) {
    return sha256BytesRaw(utf8Bytes(msg)).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
function hmacSha256(key, msg) {
    const block = 64;
    let kBytes = utf8Bytes(key);
    if (kBytes.length > block) {
        kBytes = utf8Bytes(sha256BytesRaw(kBytes).map((b)=>b.toString(16).padStart(2, '0')).join('')); // keyed-longer law: H(key) as hex, utf8
    }
    const kPadded = new Array(block).fill(0);
    for(let i = 0; i < kBytes.length; i++)kPadded[i] = kBytes[i];
    const oKey = kPadded.map((b)=>b ^ 0x5c);
    const iKey = kPadded.map((b)=>b ^ 0x36);
    const innerDigest = sha256BytesRaw([
        ...iKey,
        ...utf8Bytes(msg)
    ]) // 32 RAW bytes
    ;
    return sha256BytesRaw([
        ...oKey,
        ...innerDigest
    ]).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
const FORT_KEY_STORAGE = 'lokoja-life:fortkey';
function signPayload(payload, key) {
    return hmacSha256(key, payload);
}
function verifyPayload(payload, sig, key) {
    if (typeof sig !== 'string' || sig.length === 0) return {
        ok: false,
        why: 'malformed'
    };
    if (key === null || key.length === 0) return {
        ok: false,
        why: 'missing-key'
    };
    const expect = signPayload(payload, key);
    // constant-time-ish compare (length + xor walk)
    if (expect.length !== sig.length) return {
        ok: false,
        why: 'tampered'
    };
    let diff = 0;
    for(let i = 0; i < expect.length; i++)diff |= expect.charCodeAt(i) ^ sig.charCodeAt(i);
    return diff === 0 ? {
        ok: true
    } : {
        ok: false,
        why: 'tampered'
    };
}
const CHAIN_SEED = 'lko-chain-seed';
function chainHash(prev, tx) {
    return sha256(`${prev}|${tx.day}|${tx.slot}|${tx.amount}|${tx.category}|${tx.label}`);
}
function chainNext(prevHash, tx) {
    return chainHash(prevHash, tx);
}
function verifyChain(txs) {
    let prev = CHAIN_SEED;
    let anchoring = true;
    for(let i = 0; i < txs.length; i++){
        const t = txs[i];
        if (typeof t.sig !== 'string') {
            // legacy entry: before the first signed link the chain is not live yet
            if (anchoring) continue;
            return {
                ok: false,
                brokenAt: i
            };
        }
        anchoring = false;
        const expect = chainHash(prev, t);
        if (expect !== t.sig) return {
            ok: false,
            brokenAt: i
        };
        prev = t.sig;
    }
    return {
        ok: true,
        brokenAt: -1
    };
}
function incomeGuard(amount, dayEarned, cfg) {
    if (amount <= 0) return {
        allowed: 0,
        clamped: false,
        law: null
    };
    if (amount > cfg.singleCeiling) {
        return {
            allowed: cfg.singleCeiling,
            clamped: true,
            law: 'single'
        };
    }
    const room = cfg.dayCeiling - dayEarned;
    if (room <= 0) return {
        allowed: 0,
        clamped: true,
        law: 'day'
    };
    if (amount > room) return {
        allowed: room,
        clamped: true,
        law: 'day'
    };
    return {
        allowed: amount,
        clamped: false,
        law: null
    };
}
function velocityGuard(txCountThisSlot, cap) {
    return {
        allow: txCountThisSlot < cap,
        cap
    };
}
function anomalyVerdict(anomalyFlag) {
    return anomalyFlag ? 'continue' : 'continue';
}
function configFingerprint(tables) {
    let json;
    try {
        json = JSON.stringify(tables);
    } catch  {
        json = 'unserializable';
    }
    return sha256(json).slice(0, 16);
}
function freshFortressState() {
    return {
        anomalies: 0,
        dayEarnedDay: 0,
        dayEarned: 0,
        slotTxCount: 0,
        slotTxSlot: 0,
        chainTail: CHAIN_SEED,
        fingerprint: null
    };
}
const FORTRESS_KEYS = {
    primary: 'lokoja-life:save',
    shadow: 'lokoja-life:save-b'
};
function loadPlan(primaryOk, shadowExists, shadowOk, backupExists, backupOk, primaryWhy, shadowWhy) {
    if (primaryOk) return {
        step: 'primary'
    };
    if (shadowExists) {
        if (shadowOk) return {
            step: 'shadow',
            why: primaryWhy
        };
    }
    if (backupExists) {
        if (backupOk) return {
            step: 'backup',
            why: shadowExists ? shadowWhy : primaryWhy
        };
    }
    return {
        step: 'fresh',
        why: primaryWhy
    };
}
function writePlan(currentPrimary) {
    return {
        shadowPayload: currentPrimary,
        overwritePrimary: true
    };
}
function benchSign(key, sizeBytes = 8192) {
    const payload = 'x'.repeat(sizeBytes);
    const t0 = Date.now();
    signPayload(payload, key);
    return Date.now() - t0;
}
}),
"[project]/src/game/systems/live.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AJO_MAX_MEMBERS",
    ()=>AJO_MAX_MEMBERS,
    "AJO_PANIC_GRACE_DAYS",
    ()=>AJO_PANIC_GRACE_DAYS,
    "ASSOC_DUES",
    ()=>ASSOC_DUES,
    "ASSOC_MIN_MEMBERS",
    ()=>ASSOC_MIN_MEMBERS,
    "COURT_FEE",
    ()=>COURT_FEE,
    "EMOTE_LIBRARY",
    ()=>EMOTE_LIBRARY,
    "EVENT_PAYLOAD_CAP",
    ()=>EVENT_PAYLOAD_CAP,
    "PRESENCE_TTL_MS",
    ()=>PRESENCE_TTL_MS,
    "ajoCourtFine",
    ()=>ajoCourtFine,
    "ajoIdFor",
    ()=>ajoIdFor,
    "ajoNextBeneficiary",
    ()=>ajoNextBeneficiary,
    "ajoPanicCheck",
    ()=>ajoPanicCheck,
    "ajoRoundReady",
    ()=>ajoRoundReady,
    "assocChainLink",
    ()=>assocChainLink,
    "assocIdFor",
    ()=>assocIdFor,
    "broadcastPayout",
    ()=>broadcastPayout,
    "canFoundAssociation",
    ()=>canFoundAssociation,
    "canLive",
    ()=>canLive,
    "cityBroadcastFor",
    ()=>cityBroadcastFor,
    "contractIdFor",
    ()=>contractIdFor,
    "courtPenalty",
    ()=>courtPenalty,
    "courtVerdict",
    ()=>courtVerdict,
    "crowdMult",
    ()=>crowdMult,
    "emoteById",
    ()=>emoteById,
    "freshLiveState",
    ()=>freshLiveState,
    "joinTeleportEvent",
    ()=>joinTeleportEvent,
    "presenceAlive",
    ()=>presenceAlive,
    "presenceRoster",
    ()=>presenceRoster,
    "sanitizeChat",
    ()=>sanitizeChat,
    "tradeIdFor",
    ()=>tradeIdFor,
    "tradeVerdict",
    ()=>tradeVerdict,
    "validateEvent",
    ()=>validateEvent,
    "voiceAllowed",
    ()=>voiceAllowed,
    "withdrawVerdict",
    ()=>withdrawVerdict
]);
/**
 * LOKOJA LIFE — M17: THE LIVE NATION
 * ----------------------------------
 * Identity arrives FREE from the Guest Loop: every claimed account is
 * multiplayer-ready — no separate signup, ever. This system holds the
 * LAWS of the nation; the relay (two thin API routes) only ever
 * DISTRIBUTES the events these laws produce — it never simulates.
 *
 * LAWS OF THIS FILE:
 *  - THE IDENTITY LAW: a claimed account plays the nation; an unclaimed
 *    guest spectates (reads everything) but the mic stays dark until
 *    claim. No second signup exists anywhere in the app.
 *  - THE TIERED CHAT LAW (rides the M13 bands): kids speak in preset
 *    emotes ONLY; teens speak moderated text (the word wall, 140 chars);
 *    adults speak full text (280 chars) but NO EXTERNAL LINKS EVER —
 *    URLs, phone numbers and wallet addresses are stripped before the
 *    relay ever sees them.
 *  - THE PRESENCE LAW: a live walker is a record with a TTL — a stale
 *    ping is an absent neighbor; presence never lies.
 *  - THE JOIN-TELEPORT LAW: a live invite is an M15 postcard (the SAME
 *    signed code) — arrival is free, landings never pay street credit.
 *  - THE STREAM LAW: anyone may broadcast a stall/regatta/wedding;
 *    viewers BECOME the crowd (an honest multiplier, capped); the city
 *    itself broadcasts on a deterministic civic schedule.
 *  - THE ASSOCIATION LAW: a shared treasury where every move is a
 *    kobo-chain link (M14 fortress math) — and the co-op books never
 *    move on one man's word (the two-key law).
 *  - THE COURT LAW: contracts and disputes land before the Market Union
 *    Court, whose verdict is a HASH of (day, contract, evidence) —
 *    deterministic, reload-proof, bribe-proof.
 *  - THE TRADE LAW: a trade is a signed ledger event both sides apply
 *    through their own honest engines; the relay just carries it.
 *  - THE AJO LAW: real-player rotating savings with THE DEFAULT PANIC
 *    and the court guarantee — a defaulter is fined, the round still
 *    pays; nobody's money dies with a stranger's empty pocket.
 *  - THE VOICE LAW: adults, opt-in, same street — minors NEVER
 *    (structurally false, the M13 graph-block doctrine).
 *  - THE RELAY DOCTRINE: events are validated shapes on channels; the
 *    nation's memory lives in the relay, the simulation lives at home.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-ssr] (ecmascript)");
;
/**
 * THE IDENTITY LAW + THE TIERED CHAT LAW, one table.
 *  guest  → read-only spectate (the mic is dark until claim)
 *  kid    → emotes only
 *  teen   → moderated text
 *  adult  → full text
 * Hosting/assoc/trade/ajo are grown-folk law: adults only. (Teens may
 * read every room; the nation keeps its money tables adult-hands-only,
 * the same doctrine the M13 shield set for crime and japa.)
 */ const CAPABILITY_TABLE = {
    guest: [
        'read'
    ],
    kid: [
        'read',
        'emote'
    ],
    teen: [
        'read',
        'emote',
        'text'
    ],
    adult: [
        'read',
        'emote',
        'text',
        'host',
        'assoc',
        'trade',
        'ajo',
        'voice'
    ]
};
function canLive(identity, cap) {
    return CAPABILITY_TABLE[identity.band].includes(cap);
}
const EMOTE_LIBRARY = [
    {
        id: 'up-nepa',
        glyph: '💡',
        phrase: 'Up NEPA!'
    },
    {
        id: 'howfar',
        glyph: '👋',
        phrase: 'How far!'
    },
    {
        id: 'lol',
        glyph: '😂',
        phrase: 'Lol'
    },
    {
        id: 'hot',
        glyph: '🔥',
        phrase: 'Fire!'
    },
    {
        id: 'strong',
        glyph: '💪',
        phrase: 'Strong thing'
    },
    {
        id: 'abeg',
        glyph: '🙏',
        phrase: 'Abeg oo'
    },
    {
        id: 'oya',
        glyph: '⭐',
        phrase: 'Oya!'
    },
    {
        id: 'choi',
        glyph: '😮',
        phrase: 'Choi!'
    },
    {
        id: 'welldone',
        glyph: '🎁',
        phrase: 'Well done oo'
    },
    {
        id: 'tired',
        glyph: '😴',
        phrase: 'Body dey pain me'
    },
    {
        id: 'correct',
        glyph: '🤝',
        phrase: 'Correct!'
    },
    {
        id: 'nice',
        glyph: '❤️',
        phrase: 'Nice one'
    }
];
function emoteById(id) {
    return EMOTE_LIBRARY.find((e)=>e.id === id) ?? null;
}
/** THE TEEN WORD WALL — moderation as a pure law. A small honest
 *  blocklist of the classic 419/harassment openers; the list is data,
 *  so it grows without touching any law. */ const WORD_WALL = [
    '419',
    'yahoo boy',
    'blood money',
    'send ur pics',
    'send pictures',
    'credit card',
    'bank pin',
    'atm pin',
    'one chance',
    'kill',
    'stupid fool'
];
/** THE ADULT LINK LAW — no external links ever, in ANY room. URLs,
 *  www hosts, common TLDs, phone numbers and crypto/transfer handles
 *  are stripped; what survives is honest street talk. */ const LINK_PATTERNS = [
    /https?:\/\/\S+/gi,
    /\bwww\.\S+/gi,
    /[\w.-]+\.(com|net|org|ng|io|xyz|link|me|tv)\b/gi,
    /(?:\+?234|0)[789]\d{9}/g,
    /\b0[789]\d{9}\b/g,
    /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g
];
const KID_MAX = 0 // kids never type — the lexicon speaks
;
const TEEN_MAX = 140;
const ADULT_MAX = 280;
function sanitizeChat(identity, raw) {
    // THE IDENTITY LAW at the mic: a guest's mic is dark, full stop
    if (identity.band === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (identity.band === 'kid') return {
        ok: false,
        why: 'kid-text-refused'
    };
    const text = raw.trim();
    if (!text) return {
        ok: false,
        why: 'empty'
    };
    if (identity.band === 'teen') {
        if (text.length > TEEN_MAX) return {
            ok: false,
            why: 'too-long'
        };
        const low = text.toLowerCase();
        if (WORD_WALL.some((w)=>low.includes(w))) return {
            ok: false,
            why: 'word-wall'
        };
        // teens inherit the link law too — moderation is the floor, not the ceiling
        if (LINK_PATTERNS.some((r)=>r.test(text))) return {
            ok: false,
            why: 'no-links-ever'
        };
        return {
            ok: true,
            text
        };
    }
    // adult: full text, the link law, the length cap
    if (text.length > ADULT_MAX) return {
        ok: false,
        why: 'too-long'
    };
    let out = text;
    let stripped = false;
    for (const r of LINK_PATTERNS){
        if (r.test(out)) {
            // the link DIES — nothing stands in for it (an only-link message
            // leaves nothing honest, and nothing honest never crosses)
            out = out.replace(r, '');
            stripped = true;
        }
        r.lastIndex = 0;
    }
    if (!out.trim()) return {
        ok: false,
        why: 'no-links-ever'
    };
    return {
        ok: true,
        text: out.replace(/\s{2,}/g, ' ').trim(),
        stripped
    };
}
const PRESENCE_TTL_MS = 90_000;
function presenceAlive(p, now) {
    return now - p.ts <= PRESENCE_TTL_MS;
}
function presenceRoster(all, now) {
    return all.filter((p)=>presenceAlive(p, now)).sort((a, b)=>a.handle.localeCompare(b.handle));
}
function joinTeleportEvent(handle, street, code) {
    return {
        id: `jt:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(`${handle}|${street}|${code}`).slice(0, 16)}`,
        kind: 'join',
        channel: 'global',
        actor: handle,
        payload: {
            street,
            code
        }
    };
}
function crowdMult(viewerCount) {
    return 1 + Math.min(viewerCount, 40) * 0.0125;
}
function broadcastPayout(base, viewerCount) {
    return Math.round(base * crowdMult(viewerCount));
}
function cityBroadcastFor(yearDay) {
    if (yearDay === 1) return {
        kind: 'address',
        title: "The Governor's New Year Address"
    };
    if (yearDay === 36) return {
        kind: 'address',
        title: 'The Mid-Year Address'
    };
    if (yearDay === 60) return {
        kind: 'election',
        title: 'Election Night — the results walk home'
    };
    return null;
}
const ASSOC_DUES = 500;
const ASSOC_MIN_MEMBERS = 3;
function assocIdFor(name, founder, day) {
    return `asc:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(`${name}|${founder}|${day}`).slice(0, 16)}`;
}
function canFoundAssociation(identity) {
    return canLive(identity, 'assoc');
}
function withdrawVerdict(assoc, requester, coSigner, amount) {
    const row = assoc.members.find((m)=>m.handle === requester);
    if (!row) return {
        ok: false,
        why: 'not-member'
    };
    if (row.role !== 'president') return {
        ok: false,
        why: 'not-president'
    };
    if (!coSigner || coSigner === requester || !assoc.members.some((m)=>m.handle === coSigner)) {
        return {
            ok: false,
            why: 'two-key'
        };
    }
    if (!Number.isFinite(amount) || amount <= 0) return {
        ok: false,
        why: 'bad-amount'
    };
    if (amount > assoc.treasury) return {
        ok: false,
        why: 'empty-treasury'
    };
    return {
        ok: true
    };
}
function assocChainLink(prevSig, day, amount, category, label) {
    // the assoc books chain on the SAME ChainTx law; slot 0 is the
    // association's own counter slot (the day-slot pair stays unique per move)
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chainHash"])(prevSig, {
        day,
        slot: 0,
        amount,
        category,
        label
    });
}
function contractIdFor(terms, parties, day) {
    return `ctr:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(`${terms}|${parties.join('+')}|${day}`).slice(0, 16)}`;
}
function courtVerdict(contract, evidence) {
    const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(`${contract.id}|${evidence}|${contract.day}`);
    // the honest bias: a contract with no evidence against it stands
    return parseInt(h.slice(0, 2), 16) % 4 === 0 ? 'broken' : 'kept';
}
const COURT_FEE = 200;
function courtPenalty(contract) {
    if (contract.status !== 'disputed' || !contract.verdict) return null;
    if (contract.verdict === 'kept') return null;
    const liable = contract.parties[1] ?? contract.parties[0];
    const winner = contract.parties[0];
    return {
        liable,
        penalty: contract.stake,
        winner
    };
}
function tradeIdFor(from, to, day, offerSeq) {
    return `trd:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(`${from}|${to}|${day}|${offerSeq}`).slice(0, 16)}`;
}
function tradeVerdict(offer, acceptor, roster, now) {
    if (offer.status !== 'offered') return {
        ok: false,
        why: 'not-offered'
    };
    if (offer.from === offer.to) return {
        ok: false,
        why: 'self-trade'
    };
    if (acceptor !== offer.to) return {
        ok: false,
        why: 'wrong-party'
    };
    const partner = roster.find((p)=>p.handle === offer.from);
    if (!partner || !presenceAlive(partner, now)) return {
        ok: false,
        why: 'partner-gone'
    };
    return {
        ok: true
    };
}
const AJO_MAX_MEMBERS = 12;
const AJO_PANIC_GRACE_DAYS = 2;
function ajoIdFor(name, founder, day) {
    return `ajo:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(`${name}|${founder}|${day}`).slice(0, 16)}`;
}
function ajoRoundReady(circle) {
    return circle.order.every((m)=>circle.paidThisRound.includes(m));
}
function ajoNextBeneficiary(circle) {
    for (const m of circle.order){
        if (!Object.values(circle.paid).includes(m)) return m;
    }
    return null;
}
function ajoPanicCheck(circle, day) {
    if (circle.status === 'panic') return {
        panic: true,
        defaulter: circle.defaulters[0] ?? null
    };
    const next = ajoNextBeneficiary(circle);
    if (!next) return {
        panic: false,
        defaulter: null
    };
    const pending = circle.order.filter((m)=>!circle.paidThisRound.includes(m));
    if (circle.paidThisRound.length === 0 || pending.length === 0) return {
        panic: false,
        defaulter: null
    };
    if (day - circle.roundStartDay > AJO_PANIC_GRACE_DAYS) {
        return {
            panic: true,
            defaulter: pending[0]
        };
    }
    return {
        panic: false,
        defaulter: null
    };
}
function ajoCourtFine(circle, handle) {
    return {
        fine: Math.round(circle.contribution * 1.5),
        repHit: 5
    };
}
function voiceAllowed(identity, voiceOn, myStreet, theirStreet) {
    if (identity.band !== 'adult') return false;
    if (!voiceOn) return false;
    if (!myStreet || !theirStreet) return false;
    return myStreet === theirStreet;
}
const EVENT_PAYLOAD_CAP = 2048;
function validateEvent(e) {
    const ev = e;
    if (!ev || typeof ev !== 'object' || typeof ev.id !== 'string' || typeof ev.actor !== 'string') return {
        ok: false,
        why: 'shape'
    };
    const kinds = [
        'chat',
        'emote',
        'join',
        'stream',
        'assoc',
        'trade',
        'ajo',
        'city',
        'court'
    ];
    if (!kinds.includes(ev.kind)) return {
        ok: false,
        why: 'kind'
    };
    if (typeof ev.channel !== 'string' || ev.channel.length === 0 || ev.channel.length > 64) return {
        ok: false,
        why: 'channel'
    };
    if (ev.channel !== 'global' && !/^(street|assoc|circle|stream):[\w:-]{1,48}$/.test(ev.channel)) return {
        ok: false,
        why: 'channel'
    };
    if (JSON.stringify(ev.payload ?? {}).length > EVENT_PAYLOAD_CAP) return {
        ok: false,
        why: 'payload-cap'
    };
    return {
        ok: true
    };
}
function freshLiveState() {
    return {
        cursor: 0,
        voiceOn: false,
        assocId: null,
        coSigned: [],
        circles: [],
        stats: {
            chats: 0,
            emotes: 0,
            streamsWatched: 0,
            tradesDone: 0
        },
        finesPaid: 0
    };
}
}),
"[project]/src/game/systems/citypack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M18: THE CITY FORGE
 * ---------------------------------
 * A city = content pack, not a program. One pipeline turns an OSM
 * extract into a shippable city pack inside the 3-HOUR SLA, and a QA
 * battery stands between every pack and the nation.
 *
 * LAWS OF THIS FILE:
 *  - THE PACK LAW: a city is DATA — streets, locations, culture,
 *    economy, civic blueprints — versioned, loadable, swappable. The
 *    engine never forks per city; the pack carries the city.
 *  - THE PHANTOM-ID LAW: every id a pack mints carries its city's
 *    brand at the TYPE level (CityId<'kano'> is not CityId<'lokoja'>)
 *    AND a runtime prefix guard — zero cross-contamination, in the
 *    compiler and at the door.
 *  - THE PIPELINE LAW: five stages, each with an honest minute budget
 *    — OSM import (0–45), auto-classify + interiors (45–90), civic
 *    blueprints + economy + culture (90–150), the QA battery (150–170),
 *    the PWA ship (170–180). A stage that overshoots its budget fails
 *    the SLA honestly. Deterministic: the same extract forges the same
 *    pack twice.
 *  - THE QA BATTERY: id hygiene, coordinate bounds, economy sanity (a
 *    meal cannot cost more than a roof), culture completeness, and
 *    street-graph connectivity (every location reachable) — a pack
 *    ships ONLY on a green battery.
 *  - THE PILOT LADDER: Abuja pilots first, then Kano/Enugu/PH/Ibadan,
 *    then Accra — and "YOUR CITY NEXT?" is a real vote book, counted
 *    deterministically.
 *  - THE LOKOJA BRIDGE: the living city ships as a pack too — the
 *    default lokoja-v1 derives from the game's own data, proving packs
 *    and the running city speak one shape.
 */ /* ============================ phantom-typed ids ============================ */ /** THE PHANTOM-ID LAW, type level: a city's id is branded with its
 *  city name — the compiler refuses a Kano street where a Lokoja
 *  street is promised. (Zero runtime cost: the brand is phantom.) */ __turbopack_context__.s([
    "CITY_PREFIX_SEP",
    ()=>CITY_PREFIX_SEP,
    "CITY_SLA_MINUTES",
    ()=>CITY_SLA_MINUTES,
    "MY_VOTE_CAP",
    ()=>MY_VOTE_CAP,
    "PACK_BYTE_BUDGET",
    ()=>PACK_BYTE_BUDGET,
    "PILOT_LADDER",
    ()=>PILOT_LADDER,
    "PIPELINE",
    ()=>PIPELINE,
    "applyVote",
    ()=>applyVote,
    "belongsTo",
    ()=>belongsTo,
    "cityOf",
    ()=>cityOf,
    "civicFor",
    ()=>civicFor,
    "classify",
    ()=>classify,
    "cultureFor",
    ()=>cultureFor,
    "economyFor",
    ()=>economyFor,
    "forgeCity",
    ()=>forgeCity,
    "forgeVote",
    ()=>forgeVote,
    "freshForgeState",
    ()=>freshForgeState,
    "lokojaDefaultPack",
    ()=>lokojaDefaultPack,
    "mintLocation",
    ()=>mintLocation,
    "mintStreet",
    ()=>mintStreet,
    "osmImport",
    ()=>osmImport,
    "qaBounds",
    ()=>qaBounds,
    "qaConnectivity",
    ()=>qaConnectivity,
    "qaCulture",
    ()=>qaCulture,
    "qaEconomy",
    ()=>qaEconomy,
    "qaIdHygiene",
    ()=>qaIdHygiene,
    "recordBuild",
    ()=>recordBuild,
    "runQaBattery",
    ()=>runQaBattery,
    "shipPack",
    ()=>shipPack,
    "slaVerdict",
    ()=>slaVerdict,
    "voteWinner",
    ()=>voteWinner,
    "walkMinutesFor",
    ()=>walkMinutesFor
]);
const CITY_PREFIX_SEP = ':';
function mintStreet(city, slug) {
    return `${city}${CITY_PREFIX_SEP}${slug}`;
}
function mintLocation(city, slug) {
    return `${city}${CITY_PREFIX_SEP}${slug}`;
}
function cityOf(branded) {
    return branded.split(CITY_PREFIX_SEP)[0] ?? '';
}
function belongsTo(id, city) {
    return cityOf(id) === city;
}
const PIPELINE = [
    {
        key: 'osm',
        label: 'OSM import',
        budgetMinutes: 45,
        startsAtMinute: 0
    },
    {
        key: 'classify',
        label: 'Auto-classify + interiors',
        budgetMinutes: 45,
        startsAtMinute: 45
    },
    {
        key: 'blueprint',
        label: 'Civic + economy + culture',
        budgetMinutes: 60,
        startsAtMinute: 90
    },
    {
        key: 'qa',
        label: 'QA battery',
        budgetMinutes: 20,
        startsAtMinute: 150
    },
    {
        key: 'ship',
        label: 'PWA ship',
        budgetMinutes: 10,
        startsAtMinute: 170
    }
];
const CITY_SLA_MINUTES = 180;
function slaVerdict(stageMinutes) {
    let total = 0;
    for (const stage of PIPELINE){
        const spent = stageMinutes[stage.key] ?? 0;
        total += spent;
        if (spent > stage.budgetMinutes) return {
            ok: false,
            brokenStage: stage.key,
            total
        };
    }
    if (total > CITY_SLA_MINUTES) return {
        ok: false,
        brokenStage: 'sla',
        total
    };
    return {
        ok: true,
        brokenStage: null,
        total
    };
}
function osmImport(extract) {
    const nodeById = new Map(extract.nodes.map((n)=>[
            n.id,
            n
        ]));
    const features = [];
    let refused = 0;
    for (const way of extract.ways){
        const name = way.tags.name ?? way.tags.amenity ?? way.tags.shop;
        const first = nodeById.get(way.nodes[0] ?? '');
        if (!name || !first) {
            refused++;
            continue;
        }
        features.push({
            wayId: way.id,
            name,
            tags: way.tags,
            lat: first.lat,
            lon: first.lon
        });
    }
    return {
        features,
        refused
    };
}
function classify(feature) {
    const t = feature.tags;
    if (t.waterway || t.natural === 'water') return {
        as: 'street',
        kind: 'waterfront',
        hasInterior: false
    };
    if (t.amenity || t.shop || t.office || t.tourism) {
        const a = t.amenity ?? '';
        const s = t.shop ?? '';
        if (a === 'marketplace') return {
            as: 'location',
            kind: 'market',
            hasInterior: true
        };
        if (a === 'bank' || s === 'money_transfer') return {
            as: 'location',
            kind: 'bank',
            hasInterior: true
        };
        if (a === 'clinic' || a === 'hospital' || a === 'pharmacy') return {
            as: 'location',
            kind: 'clinic',
            hasInterior: true
        };
        if (a === 'school' || a === 'college' || a === 'university') return {
            as: 'location',
            kind: 'school',
            hasInterior: true
        };
        if (a === 'bus_station' || a === 'ferry_terminal' || a === 'fuel') return {
            as: 'location',
            kind: 'transport',
            hasInterior: false
        };
        if (a === 'restaurant' || a === 'cafe' || a === 'fast_food' || s === 'restaurant') return {
            as: 'location',
            kind: 'food',
            hasInterior: true
        };
        if (t.office) return {
            as: 'location',
            kind: 'work',
            hasInterior: true
        };
        return {
            as: 'location',
            kind: 'shop',
            hasInterior: true
        };
    }
    const hw = t.highway ?? '';
    if (hw === 'primary' || hw === 'trunk' || hw === 'secondary') return {
        as: 'street',
        kind: 'arterial',
        hasInterior: false
    };
    if (hw === 'service') return {
        as: 'street',
        kind: 'service',
        hasInterior: false
    };
    if (t.shop || t.building === 'retail') return {
        as: 'street',
        kind: 'highstreet',
        hasInterior: false
    };
    return {
        as: 'street',
        kind: 'residential',
        hasInterior: false
    };
}
function walkMinutesFor(kind, nodeCount) {
    const base = {
        arterial: 4,
        highstreet: 6,
        residential: 8,
        service: 3,
        waterfront: 10
    };
    return Math.max(1, Math.round(base[kind] + nodeCount * 0.5));
}
function economyFor(colIndex) {
    return {
        colIndex,
        mealBase: Math.round(450 * colIndex / 100),
        fareBase: Math.round(120 * colIndex / 100),
        wageBase: Math.round(3000 * colIndex / 100)
    };
}
function cultureFor(city, country) {
    const table = {
        lokoja: {
            greetings: [
                'How far!',
                'You welcome',
                'Abeg oo'
            ],
            dishes: [
                {
                    name: 'Roasted fish',
                    price: 1500
                },
                {
                    name: 'Egusi and pounded yam',
                    price: 800
                },
                {
                    name: 'Suya',
                    price: 600
                }
            ],
            festivals: [
                {
                    name: 'Confluence Regatta',
                    yearDay: 20
                },
                {
                    name: "Governor's New Year Address",
                    yearDay: 1
                }
            ],
            languageNote: 'Pidgin rides the confluence — Igala, Nupe and Ebira under it.',
            currency: 'NGN'
        },
        abuja: {
            greetings: [
                'How far!',
                'Fine morning',
                'Wetin dey happen'
            ],
            dishes: [
                {
                    name: 'Masa',
                    price: 700
                },
                {
                    name: 'Tuwo and miyan kuka',
                    price: 1200
                },
                {
                    name: 'Grilled catfish',
                    price: 2500
                }
            ],
            festivals: [
                {
                    name: 'City Durbar',
                    yearDay: 33
                }
            ],
            languageNote: 'The capital speaks every tongue — Hausa carries the market.',
            currency: 'NGN'
        },
        kano: {
            greetings: [
                'Sannu!',
                'Ina kwana',
                'Na gode'
            ],
            dishes: [
                {
                    name: 'Masa',
                    price: 400
                },
                {
                    name: 'Tuwo dawa',
                    price: 600
                },
                {
                    name: 'Kilishi',
                    price: 900
                }
            ],
            festivals: [
                {
                    name: 'Durbar',
                    yearDay: 28
                }
            ],
            languageNote: 'Hausa first, the old city walls still carry it.',
            currency: 'NGN'
        },
        accra: {
            greetings: [
                'Ette sen?',
                'Akwaaba!',
                'Charley!'
            ],
            dishes: [
                {
                    name: 'Jollof and chicken',
                    price: 45
                },
                {
                    name: 'Banku and tilapia',
                    price: 60
                },
                {
                    name: 'Waakye',
                    price: 25
                }
            ],
            festivals: [
                {
                    name: 'Chale Wote',
                    yearDay: 50
                }
            ],
            languageNote: 'Twi under the English, Ga by the sea.',
            currency: 'GHS'
        }
    };
    return table[city] ?? {
        greetings: [
            'How far!'
        ],
        dishes: [
            {
                name: 'Street rice',
                price: Math.round(500 * (city === 'accra' ? 0.09 : 1))
            }
        ],
        festivals: [
            {
                name: `${city} Day`,
                yearDay: 15
            }
        ],
        languageNote: `${city} speaks for itself — the Culture Pack collects it.`,
        currency: country === 'Ghana' ? 'GHS' : 'NGN'
    };
}
function civicFor(packed) {
    const kinds = new Set(packed.locations.map((l)=>l.kind));
    const offices = [];
    if (kinds.has('bank')) offices.push('bank');
    if (kinds.has('clinic')) offices.push('clinic');
    if (kinds.has('school')) offices.push('school');
    offices.push('kgirs', 'nepa');
    // the grid zones follow the arterial streets (one transformer each)
    const powerZones = packed.streets.filter((s)=>s.kind === 'arterial').map((s)=>s.id);
    return {
        powerZones: powerZones.length > 0 ? powerZones : [
            packed.streets[0]?.id ?? 'zone-0'
        ],
        marketDayEvery: 5,
        offices
    };
}
function qaIdHygiene(pack) {
    const all = [
        ...pack.streets.map((s)=>s.id),
        ...pack.locations.map((l)=>l.id)
    ];
    const badPrefix = all.filter((id)=>!belongsTo(id, pack.id));
    const dupes = all.filter((id, i)=>all.indexOf(id) !== i);
    const ok = badPrefix.length === 0 && dupes.length === 0;
    return {
        law: 'id-hygiene',
        ok,
        detail: ok ? `${all.length} ids branded + unique` : `foreign: ${badPrefix.length}, dupes: ${dupes.length}`
    };
}
function qaBounds(pack, bbox, coords) {
    const outside = [
        ...coords.values()
    ].filter((c)=>c.lat < bbox.minLat || c.lat > bbox.maxLat || c.lon < bbox.minLon || c.lon > bbox.maxLon).length;
    return {
        law: 'map-bounds',
        ok: outside === 0,
        detail: outside === 0 ? 'all nodes inside the box' : `${outside} nodes outside the box`
    };
}
function qaEconomy(pack) {
    const meal = pack.economy.mealBase;
    const fare = pack.economy.fareBase;
    const weeklyWage = pack.economy.wageBase * 6;
    const ok = meal < weeklyWage && fare <= meal && pack.economy.colIndex > 0;
    return {
        law: 'economy-sanity',
        ok,
        detail: ok ? `meal ${meal} < weekly wage ${weeklyWage}, fare ${fare} ≤ meal` : 'the ratios broke'
    };
}
function qaCulture(pack) {
    const c = pack.culture;
    const ok = c.greetings.length >= 3 && c.dishes.length >= 3 && c.festivals.length >= 1 && c.languageNote.length > 5 && c.currency.length === 3;
    return {
        law: 'culture-complete',
        ok,
        detail: ok ? `${c.greetings.length} greetings, ${c.dishes.length} dishes, ${c.festivals.length} festivals` : 'the culture pack is thin'
    };
}
function qaConnectivity(pack) {
    const streetIds = new Set(pack.streets.map((s)=>s.id));
    const ghostDoors = pack.locations.filter((l)=>!streetIds.has(l.street)).length;
    const orphans = pack.streets.length === 0 ? 1 : 0;
    const emptyStreets = pack.streets.filter((s)=>!pack.locations.some((l)=>l.street === s.id) && s.kind !== 'waterfront' && s.kind !== 'service').length;
    const ok = ghostDoors === 0 && orphans === 0;
    return {
        law: 'connectivity',
        ok,
        detail: ok ? `${pack.locations.length} doors on ${pack.streets.length} streets${emptyStreets > 0 ? ` (${emptyStreets} quiet)` : ''}` : `${ghostDoors} ghost doors, ${orphans} orphans`
    };
}
function runQaBattery(pack, bbox, coords) {
    const findings = [
        qaIdHygiene(pack),
        qaBounds(pack, bbox, coords),
        qaEconomy(pack),
        qaCulture(pack),
        qaConnectivity(pack)
    ];
    const okAll = findings.every((f)=>f.ok);
    const score = Math.round(findings.filter((f)=>f.ok).length / findings.length * 100);
    return {
        ok: okAll,
        findings,
        score
    };
}
const PACK_BYTE_BUDGET = 512 * 1024 // 512KB — a city is data, not a program
;
function shipPack(pack, qa, stageMinutes) {
    if (!qa.ok) return {
        ok: false,
        why: `QA red — ${qa.findings.filter((f)=>!f.ok).map((f)=>f.law).join(', ')}`
    };
    const sla = slaVerdict(stageMinutes);
    if (!sla.ok) return {
        ok: false,
        why: `SLA broken at ${sla.brokenStage}`
    };
    const packBytes = JSON.stringify(pack).length;
    if (packBytes > PACK_BYTE_BUDGET) return {
        ok: false,
        why: `pack too fat (${packBytes}B > ${PACK_BYTE_BUDGET}B)`
    };
    return {
        ok: true,
        manifest: {
            packId: pack.id,
            name: pack.name,
            version: pack.version,
            qaScore: qa.score,
            shippedAtStageMinute: sla.total,
            packBytes
        }
    };
}
function forgeCity(extract, opts) {
    // stage 1 — import
    const { features, refused } = osmImport(extract);
    // stage 2 — classify + interiors
    const streets = [];
    const locations = [];
    const coords = new Map();
    for (const f of features){
        coords.set(f.wayId, {
            lat: f.lat,
            lon: f.lon
        });
        const verdict = classify(f);
        if (verdict.as === 'street') {
            const kind = verdict.kind;
            const id = mintStreet(opts.city, f.name.toLowerCase().replace(/\s+/g, '-'));
            const nodeCount = extract.ways.find((w)=>w.id === f.wayId)?.nodes.length ?? 1;
            streets.push({
                id,
                name: f.name,
                kind,
                walkMinutes: walkMinutesFor(kind, nodeCount),
                fromWays: [
                    f.wayId
                ]
            });
        } else {
            const id = mintLocation(opts.city, f.name.toLowerCase().replace(/\s+/g, '-'));
            const onStreet = streets[streets.length - 1]?.id ?? mintStreet(opts.city, 'main-street');
            locations.push({
                id,
                name: f.name,
                street: onStreet,
                kind: verdict.kind,
                hasInterior: verdict.hasInterior
            });
        }
    }
    // the doors law: a location needs a real street — the first street anchors
    if (streets.length === 0 && locations.length > 0) {
        streets.push({
            id: mintStreet(opts.city, 'main-street'),
            name: 'Main Street',
            kind: 'residential',
            walkMinutes: 5,
            fromWays: []
        });
    }
    // stage 3 — blueprints + economy + culture
    const economy = economyFor(opts.colIndex);
    const culture = cultureFor(opts.city, opts.country);
    const civic = civicFor({
        locations,
        streets
    });
    const pack = {
        id: opts.city,
        name: opts.name,
        country: opts.country,
        version: opts.version,
        streets,
        locations,
        culture,
        economy,
        civic
    };
    // stage 4 — QA
    const qa = runQaBattery(pack, opts.bbox, coords);
    // stage 5 — ship
    const ship = shipPack(pack, qa, opts.stageMinutes);
    return {
        city: opts.city,
        pack: ship.ok ? pack : pack,
        qa,
        manifest: ship.manifest ?? null,
        stageMinutes: opts.stageMinutes,
        sla: slaVerdict(opts.stageMinutes),
        refusedFeatures: refused
    };
}
const PILOT_LADDER = [
    {
        city: 'abuja',
        name: 'Abuja',
        country: 'Nigeria',
        colIndex: 165,
        status: 'piloting'
    },
    {
        city: 'kano',
        name: 'Kano',
        country: 'Nigeria',
        colIndex: 95,
        status: 'queued'
    },
    {
        city: 'enugu',
        name: 'Enugu',
        country: 'Nigeria',
        colIndex: 88,
        status: 'queued'
    },
    {
        city: 'port-harcourt',
        name: 'Port Harcourt',
        country: 'Nigeria',
        colIndex: 118,
        status: 'queued'
    },
    {
        city: 'ibadan',
        name: 'Ibadan',
        country: 'Nigeria',
        colIndex: 85,
        status: 'queued'
    },
    {
        city: 'accra',
        name: 'Accra',
        country: 'Ghana',
        colIndex: 130,
        status: 'voting'
    }
];
const MY_VOTE_CAP = 3;
function forgeVote(book, city) {
    if (book.mine.length >= MY_VOTE_CAP && !book.mine.includes(city)) return {
        ok: false,
        why: 'capped'
    };
    if (book.mine.includes(city)) return {
        ok: false,
        why: 'duplicate'
    };
    return {
        ok: true
    };
}
function applyVote(book, city) {
    return {
        counts: {
            ...book.counts,
            [city]: (book.counts[city] ?? 0) + 1
        },
        mine: [
            ...book.mine,
            city
        ]
    };
}
function voteWinner(book) {
    const entries = Object.entries(book.counts).filter(([, n])=>n > 0);
    if (entries.length === 0) return null;
    entries.sort((a, b)=>b[1] - a[1] || a[0].localeCompare(b[0]));
    return entries[0][0];
}
function lokojaDefaultPack() {
    const city = 'lokoja';
    const roster = [
        [
            'home',
            'Home Quarters',
            'residential'
        ],
        [
            'kpata-market',
            'Kpata Market Road',
            'highstreet'
        ],
        [
            'ganaja-junction',
            'Ganaja Junction',
            'arterial'
        ],
        [
            'confluence',
            'The Confluence',
            'waterfront'
        ],
        [
            'patti-ridge',
            'Mount Patti Ridge',
            'residential'
        ],
        [
            'ful-road',
            'FUL Road',
            'arterial'
        ],
        [
            'adankolo',
            'Adankolo Avenue',
            'residential'
        ],
        [
            'cantonment',
            'Cantonment Street',
            'service'
        ],
        [
            'nigeria-roads',
            'Nigeria Roads Yard',
            'service'
        ],
        [
            'transport-area',
            'Motor Park',
            'highstreet'
        ]
    ];
    const streets = roster.map(([slug, name, kind])=>({
            id: mintStreet(city, slug),
            name,
            kind,
            walkMinutes: walkMinutesFor(kind, 6),
            fromWays: [
                `lko-way-${slug}`
            ]
        }));
    const locations = [
        {
            id: mintLocation(city, 'kpata-market-stalls'),
            name: 'Kpata Market',
            street: mintStreet(city, 'kpata-market'),
            kind: 'market',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'night-food-strip'),
            name: 'Night Food Strip',
            street: mintStreet(city, 'kpata-market'),
            kind: 'food',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'main-bank'),
            name: 'The Bank',
            street: mintStreet(city, 'ganaja-junction'),
            kind: 'bank',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'clinic'),
            name: 'The Clinic',
            street: mintStreet(city, 'adankolo'),
            kind: 'clinic',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'ful-campus'),
            name: 'FUL Campus',
            street: mintStreet(city, 'ful-road'),
            kind: 'school',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'motor-park'),
            name: 'Motor Park',
            street: mintStreet(city, 'transport-area'),
            kind: 'transport',
            hasInterior: false
        }
    ];
    return {
        id: city,
        name: 'Lokoja',
        country: 'Nigeria',
        version: 'lokoja-v1',
        streets,
        locations,
        culture: cultureFor('lokoja', 'Nigeria'),
        economy: economyFor(100),
        civic: civicFor({
            locations,
            streets
        })
    };
}
function recordBuild(ledger, run, atDay) {
    const entry = {
        city: run.city,
        version: run.pack?.version ?? 'none',
        verdict: run.manifest ? 'shipped' : 'refused',
        qaScore: run.qa?.score ?? 0,
        totalMinutes: run.sla.total,
        atDay
    };
    return [
        ...ledger.slice(-19),
        entry
    ];
}
function freshForgeState() {
    return {
        votes: {
            counts: {
                accra: 41,
                kano: 17,
                enugu: 9,
                'port-harcourt': 6,
                ibadan: 5
            },
            mine: []
        },
        ledger: [],
        ranLokoja: false
    };
}
}),
"[project]/src/game/systems/story.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M19: THE CONFLUENCE PATH (the story quest laws)
 * -------------------------------------------------------------
 * One deterministic five-chapter chain: the Crusher boy on the Patti
 * trail → the notebook → the fever night → the sponsorship desk → the
 * white coat. Lokoja's honest ladder — no lottery, no luck: the same
 * grind, the same day, the same naira, every player.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, ctx) → same verdict. No
 *    store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every number lives in the STORY table — nothing hard-coded inside
 *    a branch. NO money math happens here: the store wires
 *    removeMoney/addMoney around these validators.
 *  - One task at a time: currentTask() derives from state + ctx and
 *    the story panel just renders it. Energy is NEVER part of task
 *    readiness (the ctx carries no energy) — the task exposes its
 *    energy cost and the ACTION re-validates through canCarrySand at
 *    the store, where the live needs value lives.
 *  - The appliers return NEW state objects; the store drops them into
 *    set() — nothing here mutates the save.
 *  - Chapter 0 → 1 has no separate action: the MEETING is the first
 *    carry (day >= meetDay), exactly as the boy would have it.
 *
 * LOCATION TRUTH: the registry holds no 'fth' id (real ids: home,
 * kpata-market, ganaja-junction, confluence, mount-patti, historic-
 * lokoja, government-area, university-area, food-area, transport-area,
 * plus the school sites). The hospital beats — the fever night and the
 * white coat — therefore stand at 'government-area': the GRA, "where
 * paperwork can change your whole week", the honest civic stand-in for
 * a Federal Teaching Hospital. If a real FTH location is ever
 * registered, only the two constants below move.
 */ __turbopack_context__.s([
    "STORY",
    ()=>STORY,
    "STORY_BEATS",
    ()=>STORY_BEATS,
    "applyCarry",
    ()=>applyCarry,
    "applyFever",
    ()=>applyFever,
    "applyNotebook",
    ()=>applyNotebook,
    "applySponsor",
    ()=>applySponsor,
    "applyWhiteCoat",
    ()=>applyWhiteCoat,
    "canCarrySand",
    ()=>canCarrySand,
    "canGraduate",
    ()=>canGraduate,
    "canPayFever",
    ()=>canPayFever,
    "canPayNotebook",
    ()=>canPayNotebook,
    "canSponsor",
    ()=>canSponsor,
    "chapterOf",
    ()=>chapterOf,
    "coatDay",
    ()=>coatDay,
    "currentTask",
    ()=>currentTask,
    "freshStoryState",
    ()=>freshStoryState
]);
const STORY = {
    meetDay: 3,
    sandCarries: 3,
    sandEnergy: 14,
    sandPay: 400,
    meetPlace: 'mount-patti',
    notebookCost: 3500,
    notebookLevel: 5,
    feverCost: 2000,
    feverPlace: 'government-area',
    sponsorCost: 500,
    sponsorDays: 6,
    graduateWaitDays: 4,
    graduatePlace: 'government-area',
    whiteCoatRep: 15,
    whiteCoatCash: 0,
    whiteCoatOutfit: 'confluence-gold',
    whiteCoatWalk: 'strut'
};
function chapterOf(s) {
    if (s.doctorDay > 0) return 5;
    if (s.feverPaid) return 4;
    if (s.notePaid) return 3;
    if (s.sandDays >= STORY.sandCarries) return 2;
    if (s.sandDays > 0 || s.chapter >= 1) return 1;
    return 0;
}
function freshStoryState() {
    return {
        chapter: 0,
        sandDays: 0,
        lastSandDay: 0,
        notePaid: false,
        feverPaid: false,
        sponsoredDays: 0,
        lastSponsorDay: 0,
        doctorDay: 0
    };
}
function currentTask(s, ctx) {
    const ch = chapterOf(s);
    if (ch === 0) {
        // The boy comes down the trail on meetDay — before that, silence.
        if (ctx.day < STORY.meetDay) return null;
        return {
            id: 'meet-carry',
            label: 'Carry sand with the boy',
            place: STORY.meetPlace,
            kind: 'carry',
            energy: STORY.sandEnergy,
            ready: ctx.day > s.lastSandDay,
            hint: `A small boy on the Patti trail hails you — one honest carry, he shares his cut: ₦${STORY.sandPay} for ${STORY.sandEnergy} energy.`
        };
    }
    if (ch === 1) {
        const left = STORY.sandCarries - s.sandDays;
        return {
            id: 'carry-sand',
            label: left === 1 ? 'One last carry' : `Carry sand — ${left} days to go`,
            place: STORY.meetPlace,
            kind: 'carry',
            energy: STORY.sandEnergy,
            ready: ctx.day > s.lastSandDay,
            hint: left === 1 ? `The last carry — finish it and the boy opens his notebook. ₦${STORY.sandPay} for ${STORY.sandEnergy} energy.` : `Bucket by bucket — one carry a day, ₦${STORY.sandPay} and ${STORY.sandEnergy} energy each. The boy counts days, not grammar.`
        };
    }
    if (ch === 2) {
        // The school knows you: level >= notebookLevel waives the levy (cost 0).
        const cost = ctx.level >= STORY.notebookLevel ? 0 : STORY.notebookCost;
        return {
            id: 'pay-notebook',
            label: cost === 0 ? 'Settle the notebook — waived' : 'Pay the school levy',
            place: STORY.meetPlace,
            kind: 'pay',
            cost,
            ready: ctx.cash >= cost,
            hint: cost === 0 ? `The school knows your name — the ₦${STORY.notebookCost} levy is waved through. Walk it off the boy's head.` : `The boy's school levy and books: ₦${STORY.notebookCost}. Nobody lends it — you earned it on the trail.`
        };
    }
    if (ch === 3) {
        return {
            id: 'pay-fever',
            label: 'Settle the fever night',
            place: STORY.feverPlace,
            kind: 'pay',
            cost: STORY.feverCost,
            ready: ctx.cash >= STORY.feverCost,
            hint: `The boy shakes with fever at the GRA hospital — ₦${STORY.feverCost} for the injections, tonight.`
        };
    }
    if (ch === 4) {
        if (s.sponsoredDays < STORY.sponsorDays) {
            const left = STORY.sponsorDays - s.sponsoredDays;
            return {
                id: 'sponsor-day',
                label: left === 1 ? 'Sponsor the last day' : `Sponsor the desk — ${left} days to go`,
                place: STORY.feverPlace,
                kind: 'pay',
                cost: STORY.sponsorCost,
                ready: ctx.cash >= STORY.sponsorCost && ctx.day > s.lastSponsorDay,
                hint: `₦${STORY.sponsorCost} a day, ${left} left of ${STORY.sponsorDays}. The desk keeps an honest book — one day at a time.`
            };
        }
        return {
            id: 'wait-coat',
            label: 'Wait for the white coat',
            place: STORY.graduatePlace,
            kind: 'wait',
            ready: ctx.day >= coatDay(s),
            hint: `All six days banked — the tailor sews. Return on day ${coatDay(s)} and walk out a doctor.`
        };
    }
    // Chapter 5: the confluence path is walked. The city moves on.
    return null;
}
function coatDay(s) {
    return s.lastSponsorDay > 0 && s.sponsoredDays >= STORY.sponsorDays ? s.lastSponsorDay + STORY.graduateWaitDays : 0;
}
function canCarrySand(s, ctx) {
    if (ctx.chapter >= 2) return {
        ok: false,
        why: 'The sand phase is behind you — the boy remembers.'
    };
    if (ctx.chapter === 0 && ctx.day < STORY.meetDay) {
        return {
            ok: false,
            why: `The boy is still up the hill — he comes down on day ${STORY.meetDay}.`
        };
    }
    if (ctx.day <= s.lastSandDay) {
        return {
            ok: false,
            why: 'One carry a day — the boy shares his cut honestly, but only once.'
        };
    }
    if (ctx.energy < STORY.sandEnergy) {
        return {
            ok: false,
            why: `You need ${STORY.sandEnergy} energy for a carry up the trail. Rest first.`
        };
    }
    return {
        ok: true
    };
}
function canPayNotebook(s, ctx) {
    // Defensive double-lock: a stale chapter ctx can never re-pay the levy.
    if (s.notePaid) return {
        ok: false,
        why: 'The notebook is already paid.'
    };
    if (ctx.chapter < 2) return {
        ok: false,
        why: 'The boy has not asked yet — the sand comes first.'
    };
    if (ctx.chapter > 2) return {
        ok: false,
        why: 'The notebook is already paid.'
    };
    const cost = ctx.level >= STORY.notebookLevel ? 0 : STORY.notebookCost;
    if (ctx.cash < cost) {
        return {
            ok: false,
            why: cost === 0 ? 'The levy is waived — walk it off the boy\'s head.' : `You need ₦${STORY.notebookCost} for the school levy and books.`
        };
    }
    return {
        ok: true,
        cost
    };
}
function canPayFever(s, ctx) {
    // Defensive double-lock: a stale chapter ctx can never re-pay the night.
    if (s.feverPaid) return {
        ok: false,
        why: 'The fever night is already settled.'
    };
    if (ctx.chapter < 3) return {
        ok: false,
        why: 'The fever has not come — the notebook comes first.'
    };
    if (ctx.chapter > 3) return {
        ok: false,
        why: 'The fever night is already settled.'
    };
    if (ctx.cash < STORY.feverCost) {
        return {
            ok: false,
            why: `You need ₦${STORY.feverCost} for the fever night — injections no less.`
        };
    }
    return {
        ok: true,
        cost: STORY.feverCost
    };
}
function canSponsor(s, ctx) {
    if (ctx.chapter < 4) return {
        ok: false,
        why: 'No desk knows your name yet.'
    };
    if (ctx.chapter > 4) return {
        ok: false,
        why: 'The sponsorship chapter is closed.'
    };
    if (s.sponsoredDays >= STORY.sponsorDays) {
        return {
            ok: false,
            why: `All ${STORY.sponsorDays} days are banked — wait for the coat.`
        };
    }
    if (ctx.day <= s.lastSponsorDay) {
        return {
            ok: false,
            why: 'One sponsorship a day — the desk keeps an honest book.'
        };
    }
    if (ctx.cash < STORY.sponsorCost) {
        return {
            ok: false,
            why: `You need ₦${STORY.sponsorCost} for the day's sponsorship.`
        };
    }
    return {
        ok: true,
        cost: STORY.sponsorCost
    };
}
function canGraduate(s, ctx) {
    if (s.doctorDay > 0) return {
        ok: false,
        why: 'You already wear the coat.'
    };
    const coat = coatDay(s);
    if (coat === 0) return {
        ok: false,
        why: 'The coat is not earned yet — the sponsorship desk is waiting.'
    };
    if (ctx.day < coat) return {
        ok: false,
        why: `The tailor still sews — return on day ${coat}.`
    };
    return {
        ok: true
    };
}
function applyCarry(s, day) {
    const sandDays = s.sandDays + 1;
    return {
        ...s,
        sandDays,
        lastSandDay: day,
        chapter: Math.max(s.chapter, sandDays >= STORY.sandCarries ? 2 : 1)
    };
}
function applyNotebook(s) {
    return {
        ...s,
        notePaid: true,
        chapter: Math.max(s.chapter, 3)
    };
}
function applyFever(s) {
    return {
        ...s,
        feverPaid: true,
        chapter: Math.max(s.chapter, 4)
    };
}
function applySponsor(s, day) {
    return {
        ...s,
        sponsoredDays: s.sponsoredDays + 1,
        lastSponsorDay: day
    };
}
function applyWhiteCoat(s, day) {
    return {
        ...s,
        doctorDay: day,
        chapter: Math.max(s.chapter, 5)
    };
}
const STORY_BEATS = [
    {
        chapter: 0,
        title: 'Patti Base',
        line: 'Patti base — a small boy hails you: "Abeg, help me carry sand. I go share my cut. No be scam."'
    },
    {
        chapter: 1,
        title: 'The Sand Days',
        line: 'Bucket by bucket, day by day — the boy counts your days, not your grammar. Three honest carries and he opens his notebook.'
    },
    {
        chapter: 2,
        title: 'The Notebook',
        line: '"My school fee don spoil my head," he says. ₦3,500 — or the school knows your name and waves the levy.'
    },
    {
        chapter: 3,
        title: 'The Fever Night',
        line: 'The GRA hospital by night — the boy shakes with fever and the bill is ₦2,000. You pay. Nobody forgets who stood there.'
    },
    {
        chapter: 4,
        title: 'The Sponsorship Desk',
        line: '₦500 a day, six days straight at the GRA desk. Government work is slow — but it is steady, and it comes with respect.'
    },
    {
        chapter: 5,
        title: 'The White Coat',
        line: 'The white coat fits. Confluence gold under the collar, and the Chairman Strut walks out through the hospital doors.'
    }
];
}),
"[project]/src/game/systems/patti.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M19: MT PATTI SECRETS (the hill's five honest spots)
 * ------------------------------------------------------------------
 * Five seeded hidden places on the guardian hill, discovered the old
 * way: you WALK there. No minigame, no lottery — the ground itself is
 * the game. The HUD polls nearestSecret() with the player's position
 * at ~2Hz; one step inside DISCOVERY_RADIUS and the spot is yours
 * forever (the save records the day it was found).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (position, state) → same answer.
 *    No store, no React, no DOM.
 *  - Discovery is IDEMPOTENT: finding a found secret returns the same
 *    state and isNew:false — a reward can never double-pay. (The store
 *    wires the drop through its own honest engines exactly once, on
 *    isNew:true — cash/xp/rep via addMoney & co, outfit/walk via the
 *    wardrobe's append-only grant.)
 *  - Rewards ride as DATA (kind + amount/item) — no money moves here.
 *
 * PLACEMENT MATH (authored once from world3d/layout.ts — do not re-derive):
 *  layout.ts's PATTI_TRAIL is a PRIVATE polyline of 7 points from the
 *  trailhead (-51.7,-85.2) to the summit (-85,-136) — and importing
 *  layout.ts would drag the 432KB generated geo.ts into every systems
 *  consumer. So the five secrets are FIXED CONSTANTS, placed (at
 *  authoring time, computed to 1 decimal) as a trail vertex/segment
 *  midpoint plus a fixed PERPENDICULAR offset:
 *    mast         = midpoint(P0→P1) + 6u perpendicular   (west of the track)
 *    baobab       = P2 bend         + 7u perpendicular   (uphill side)
 *    quarry-cave  = P3 bend         + 8u perpendicular   (east slope face)
 *    rest-house   = MOUNT_PATTI anchor (-84.94,-135.78) + (8,-4)
 *    summit-stone = MOUNT_PATTI anchor + (-5,4)          (the summit core)
 *  Every perpendicular offset is < DISCOVERY_RADIUS, so walking the
 *  real trail discovers every secret honestly (trailDist ≤ 8.9);
 *  pairwise spread ≥ 15.3u so two secrets never share one footstep.
 *
 * THE Y LAW: y is 0 everywhere on purpose. Terrain heightAt() lives in
 * the heavy world3d/layout.ts (the 432KB geo chain) — the 3D layer
 * samples heightAt(x, z) itself when it plants the markers; this file
 * never guesses a height.
 */ __turbopack_context__.s([
    "DISCOVERY_RADIUS",
    ()=>DISCOVERY_RADIUS,
    "PATTI_SECRETS",
    ()=>PATTI_SECRETS,
    "discover",
    ()=>discover,
    "freshPattiState",
    ()=>freshPattiState,
    "isDiscovered",
    ()=>isDiscovered,
    "nearestSecret",
    ()=>nearestSecret,
    "secretsFound",
    ()=>secretsFound
]);
const PATTI_SECRETS = [
    {
        id: 'mast',
        name: 'The Climbers\' Mast',
        line: 'An old mast hums on the lower slope — ₦800 tucked under the generator house. "Them no go miss am," you tell yourself.',
        x: -59.3,
        y: 0,
        z: -83.2,
        reward: {
            kind: 'cash',
            amount: 800
        }
    },
    {
        id: 'baobab',
        name: 'The Granddaddy Baobab',
        line: 'The granddaddy baobab — your palm finds the old carved steps. The hill names you friend (rep +3).',
        x: -73.9,
        y: 0,
        z: -95.1,
        reward: {
            kind: 'rep',
            amount: 3
        }
    },
    {
        id: 'quarry-cave',
        name: 'The Quarry Cut',
        line: 'A cool quarry cut hides behind the trail bend — ₦1,200 in a rusted kerosene tin. The hill pays in silence.',
        x: -58.3,
        y: 0,
        z: -108.9,
        reward: {
            kind: 'cash',
            amount: 1200
        }
    },
    {
        id: 'rest-house',
        name: 'Lugard\'s Rest House',
        line: 'Lugard\'s rest house — the walls still stand. Inside, a folded match jersey the hill wind forgot. Na your size.',
        x: -76.9,
        y: 0,
        z: -139.8,
        reward: {
            kind: 'outfit',
            item: 'jersey'
        }
    },
    {
        id: 'summit-stone',
        name: 'The Summit Stone',
        line: 'The summit stone — whole Lokoja at your feet, the two rivers writing one name. +120 XP to your soul.',
        x: -89.9,
        y: 0,
        z: -131.8,
        reward: {
            kind: 'xp',
            amount: 120
        }
    }
];
const DISCOVERY_RADIUS = 9;
const SECRET_BY_ID = new Map(PATTI_SECRETS.map((sec)=>[
        sec.id,
        sec
    ]));
function freshPattiState() {
    return {
        found: {}
    };
}
function secretsFound(s) {
    return PATTI_SECRETS.reduce((n, sec)=>s.found[sec.id] !== undefined ? n + 1 : n, 0);
}
function isDiscovered(s, id) {
    return s.found[id] !== undefined;
}
function nearestSecret(x, z, s) {
    let best = null;
    for (const sec of PATTI_SECRETS){
        if (s.found[sec.id] !== undefined) continue;
        const dist = Math.hypot(x - sec.x, z - sec.z);
        if (dist <= DISCOVERY_RADIUS && (best === null || dist < best.dist)) {
            best = {
                secret: sec,
                dist
            };
        }
    }
    return best;
}
function discover(s, id, day) {
    if (!SECRET_BY_ID.has(id)) return {
        state: s,
        isNew: false
    };
    if (s.found[id] !== undefined) return {
        state: s,
        isNew: false
    };
    return {
        state: {
            ...s,
            found: {
                ...s.found,
                [id]: day
            }
        },
        isNew: true
    };
}
}),
"[project]/src/game/systems/wardrobe.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M19: THE WARDROBE LAWS (walk-cycle shop + outfit drops)
 * ----------------------------------------------------------------------
 * The fashion layer becomes a real market: premium outfits and walk
 * styles are bought with NAIRA through the honest wallet engines, or
 * GRANTED as drops (quests, festivals, the hill). Pure + deterministic —
 * the same purchase decision is legal or illegal everywhere, and the
 * store only executes what these laws allow.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, action) → same verdict. No
 *    store, no React, no DOM.
 *  - Money NEVER moves here — the store calls removeMoney/addMoney and
 *    then these laws validate the book change.
 *  - 'street' walk and the six base clothing styles are owned by birth;
 *    only premium goods touch the wardrobe book.
 *  - Drops are append-only: an owned item can never be granted twice
 *    (idempotent), and an unknown key is refused at the door.
 *  - The equipped walk must be an OWNED walk — the law refuses to equip
 *    what the wardrobe does not hold (a bare CityId-style door guard).
 */ __turbopack_context__.s([
    "BASE_STYLE_KEYS",
    ()=>BASE_STYLE_KEYS,
    "PREMIUM_BY_KEY",
    ()=>PREMIUM_BY_KEY,
    "PREMIUM_OUTFITS",
    ()=>PREMIUM_OUTFITS,
    "STREET_WALK",
    ()=>STREET_WALK,
    "WALK_BY_KEY",
    ()=>WALK_BY_KEY,
    "WALK_STYLES",
    ()=>WALK_STYLES,
    "equipWalk",
    ()=>equipWalk,
    "freshWardrobeState",
    ()=>freshWardrobeState,
    "grantDrop",
    ()=>grantDrop,
    "isSaneWalk",
    ()=>isSaneWalk,
    "ownsStyle",
    ()=>ownsStyle,
    "shopBuy",
    ()=>shopBuy,
    "walkRigFor",
    ()=>walkRigFor
]);
const WALK_STYLES = [
    {
        key: 'street',
        label: 'Street Walk',
        blurb: 'The classic Lokoja stride you were born with.',
        price: 0,
        rig: {
            freq: 1,
            swing: 1,
            bob: 1,
            sway: 1,
            lean: 0,
            shin: 1
        }
    },
    {
        key: 'strut',
        label: 'Chairman Strut',
        blurb: 'Shoulders back, chin up — the GRA walk that owns the road.',
        price: 1200,
        rig: {
            freq: 0.86,
            swing: 1.22,
            bob: 1.5,
            sway: 1.6,
            lean: -0.03,
            shin: 0.86
        }
    },
    {
        key: 'swagger',
        label: 'Patti Swagger',
        blurb: 'A rolling hip sway learnt on the mountain trails.',
        price: 1800,
        rig: {
            freq: 0.92,
            swing: 1.1,
            bob: 1.25,
            sway: 2.1,
            lean: 0.01,
            shin: 0.95
        }
    },
    {
        key: 'hustle',
        label: 'Hustle Rush',
        blurb: 'Fast, forward-leaning — POS deadline energy.',
        price: 1500,
        rig: {
            freq: 1.28,
            swing: 1.35,
            bob: 1.15,
            sway: 0.7,
            lean: 0.09,
            shin: 1.15
        }
    },
    {
        key: 'glide',
        label: 'Confluence Glide',
        blurb: 'Smooth as the Niger at dawn — barely a bob.',
        price: 2200,
        rig: {
            freq: 0.78,
            swing: 0.78,
            bob: 0.45,
            sway: 0.9,
            lean: 0,
            shin: 0.8
        }
    },
    {
        key: 'bata',
        label: 'Bata Step',
        blurb: 'The festival drum in your feet — every walk a small dance.',
        price: 2600,
        rig: {
            freq: 1.12,
            swing: 1.45,
            bob: 1.8,
            sway: 1.8,
            lean: 0.02,
            shin: 1.3
        }
    }
];
const PREMIUM_OUTFITS = [
    {
        key: 'agbada',
        label: 'Agbada Royale',
        blurb: 'Three-piece flowing grandeur — owambe law.',
        price: 8500
    },
    {
        key: 'confluence-gold',
        label: 'Confluence Gold',
        blurb: 'The white-coat gift: gold-threaded agbada. Not sold — earned.',
        price: 0
    },
    {
        key: 'jersey',
        label: 'Match Jersey',
        blurb: 'Number 10 — the street named you.',
        price: 3200
    },
    {
        key: 'lab-coat',
        label: 'The White Coat',
        blurb: 'A dream pressed clean. Not sold — earned.',
        price: 0
    }
];
const WALK_BY_KEY = new Map(WALK_STYLES.map((w)=>[
        w.key,
        w
    ]));
const PREMIUM_BY_KEY = new Map(PREMIUM_OUTFITS.map((o)=>[
        o.key,
        o
    ]));
const BASE_STYLE_KEYS = new Set([
    'tshirt',
    'kaftan',
    'ankara',
    'senator',
    'hoodie',
    'lace'
]);
const STREET_WALK = 'street';
/* ----------------------------------- laws ----------------------------------- */ const RIG_BOUNDS = {
    freq: [
        0.6,
        1.5
    ],
    swing: [
        0.5,
        1.6
    ],
    bob: [
        0.2,
        2.0
    ],
    sway: [
        0.4,
        2.4
    ],
    lean: [
        -0.05,
        0.12
    ],
    shin: [
        0.6,
        1.4
    ]
};
function isSaneWalk(w) {
    const r = w.rig;
    return r.freq >= RIG_BOUNDS.freq[0] && r.freq <= RIG_BOUNDS.freq[1] && r.swing >= RIG_BOUNDS.swing[0] && r.swing <= RIG_BOUNDS.swing[1] && r.bob >= RIG_BOUNDS.bob[0] && r.bob <= RIG_BOUNDS.bob[1] && r.sway >= RIG_BOUNDS.sway[0] && r.sway <= RIG_BOUNDS.sway[1] && r.lean >= RIG_BOUNDS.lean[0] && r.lean <= RIG_BOUNDS.lean[1] && r.shin >= RIG_BOUNDS.shin[0] && r.shin <= RIG_BOUNDS.shin[1];
}
function freshWardrobeState() {
    return {
        ownedStyles: [],
        ownedWalks: [],
        activeWalk: STREET_WALK
    };
}
function shopBuy(state, kind, itemKey) {
    if (kind === 'walk') {
        const w = WALK_BY_KEY.get(itemKey);
        if (!w) return {
            ok: false,
            why: 'We no sell that walk for this market.'
        };
        if (w.key === STREET_WALK) return {
            ok: false,
            why: 'Street Walk na your birthright — e no dey cost.'
        };
        if (w.price <= 0) return {
            ok: false,
            why: 'This one na gift — no price tag.'
        };
        if (state.ownedWalks.includes(w.key)) return {
            ok: false,
            why: 'You don already own this walk.'
        };
        return {
            ok: true,
            itemKey: w.key,
            price: w.price,
            kind: 'walk'
        };
    }
    const o = PREMIUM_BY_KEY.get(itemKey);
    if (!o) return {
        ok: false,
        why: 'We no sell that cloth for this market.'
    };
    if (o.price <= 0) return {
        ok: false,
        why: 'This one na gift — you must earn am.'
    };
    if (state.ownedStyles.includes(o.key)) return {
        ok: false,
        why: 'You don already own this outfit.'
    };
    return {
        ok: true,
        itemKey: o.key,
        price: o.price,
        kind: 'outfit'
    };
}
function equipWalk(state, walkKey) {
    if (!WALK_BY_KEY.has(walkKey)) return {
        ok: false,
        why: 'That walk no exist.'
    };
    if (walkKey !== STREET_WALK && !state.ownedWalks.includes(walkKey)) {
        return {
            ok: false,
            why: 'Buy the walk first — the rig no dey take credit.'
        };
    }
    return {
        ok: true,
        walkKey
    };
}
function grantDrop(state, kind, itemKey) {
    if (kind === 'walk') {
        if (!WALK_BY_KEY.has(itemKey)) return {
            ok: false,
            why: 'Unknown walk drop.'
        };
        if (state.ownedWalks.includes(itemKey)) return {
            ok: true,
            added: null
        };
        state.ownedWalks.push(itemKey);
        return {
            ok: true,
            added: itemKey
        };
    }
    if (!PREMIUM_BY_KEY.has(itemKey) && !BASE_STYLE_KEYS.has(itemKey)) return {
        ok: false,
        why: 'Unknown outfit drop.'
    };
    if (BASE_STYLE_KEYS.has(itemKey)) return {
        ok: true,
        added: null
    } // base styles need no book
    ;
    if (state.ownedStyles.includes(itemKey)) return {
        ok: true,
        added: null
    };
    state.ownedStyles.push(itemKey);
    return {
        ok: true,
        added: itemKey
    };
}
function ownsStyle(state, styleKey) {
    return BASE_STYLE_KEYS.has(styleKey) || state.ownedStyles.includes(styleKey);
}
function walkRigFor(state) {
    const w = state ? WALK_BY_KEY.get(state.activeWalk) : undefined;
    return w && isSaneWalk(w) ? w.rig : WALK_STYLES[0].rig;
}
}),
"[project]/src/game/systems/nation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * M20 — THE NATION SLICE (the ops books)
 * ---------------------------------------
 * Pure laws + the fresh state for the Nation Dashboard. The store
 * executes, the UI reads — the same doctrine as every systems module.
 *
 * THE NO-TEXT LAW: the moderation book stores {day, why, band} ONLY —
 * never a word of what anybody typed. The M17 word wall already
 * refused the text; this book counts the refusals, it does not
 * archive them. The type system enforces it: there is no field the
 * text could even live in.
 *
 * THE ONE-CHANNEL LAW: the inflation book records the SAME liquidity
 * multiplier the day roll folded into marketDayRoll (civic.ts) — the
 * dashboard reads the city's real ledger, it invents nothing.
 */ __turbopack_context__.s([
    "MODERATION_WHYS",
    ()=>MODERATION_WHYS,
    "crowdToggle",
    ()=>crowdToggle,
    "freshNationState",
    ()=>freshNationState,
    "getLiveSnapshot",
    ()=>getLiveSnapshot,
    "inflationTrend",
    ()=>inflationTrend,
    "moderationScore",
    ()=>moderationScore,
    "recordInflation",
    ()=>recordInflation,
    "recordModeration",
    ()=>recordModeration,
    "setLiveSnapshot",
    ()=>setLiveSnapshot
]);
function freshNationState() {
    return {
        crowd: {
            seed: 20261017,
            count: 10_000,
            on: true
        },
        inflation: [],
        moderation: [],
        telemetryOptIn: false
    };
}
function recordInflation(book, day, mult) {
    const d = Math.max(1, Math.floor(day));
    const m = Math.max(0.5, Math.min(3, Number.isFinite(mult) ? mult : 1));
    if (book.some((row)=>row.day === d)) return {
        next: book,
        recorded: false
    };
    const next = [
        ...book,
        {
            day: d,
            mult: Math.round(m * 1000) / 1000
        }
    ];
    return {
        next: next.slice(-12),
        recorded: true
    };
}
function inflationTrend(book) {
    if (book.length === 0) return {
        avg: 1,
        hot: false,
        rows: 0
    };
    const avg = book.reduce((a, r)=>a + r.mult, 0) / book.length;
    return {
        avg: Math.round(avg * 1000) / 1000,
        hot: avg >= 1.1,
        rows: book.length
    };
}
const MODERATION_WHYS = [
    'kid-text-refused',
    'word-wall',
    'no-links-ever',
    'too-long',
    'empty',
    'guest-mic-dark'
];
function recordModeration(book, day, why, band) {
    if (!MODERATION_WHYS.includes(why)) return {
        next: book,
        recorded: false
    };
    const b = band === 'kid' || band === 'teen' || band === 'adult' ? band : 'unknown';
    const next = [
        ...book,
        {
            day: Math.max(1, Math.floor(day)),
            why,
            band: b
        }
    ];
    return {
        next: next.slice(-40),
        recorded: true
    };
}
function moderationScore(book) {
    const counts = new Map();
    for (const row of book)counts.set(row.why, (counts.get(row.why) ?? 0) + 1);
    return MODERATION_WHYS.filter((w)=>counts.has(w)).map((why)=>({
            why,
            count: counts.get(why) ?? 0
        }));
}
function crowdToggle(state, on) {
    return {
        ...state,
        crowd: {
            ...state.crowd,
            on
        }
    };
}
/* --------------------------- the snapshot holder ---------------------------- */ /**
 * The session-only live snapshot (never persisted — the wire is the
 * worker's, the save keeps only the switch). The store mirrors the
 * bridge's latest aggregate here for the dashboard.
 */ let liveSnapshot = null;
function setLiveSnapshot(s) {
    liveSnapshot = s;
}
function getLiveSnapshot() {
    return liveSnapshot;
}
}),
"[project]/src/game/systems/save.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Save System (M14 FORTRESS transport)
 * ---------------------------------------------------
 * Versioned persistence with a migration hook, a SIGNED envelope, and
 * ATOMIC DOUBLE-BUFFER writes.
 *
 * The envelope: the primary key carries `{"fmt":2,"data":<save>,"sig":<hmac>}`.
 * The signature is HMAC-SHA256 over the EXACT serialized save string,
 * keyed by a device-local key stored OUTSIDE the save (FORT_KEY_STORAGE).
 * The shadow key (`save-b`) holds the PREVIOUS primary payload before
 * every overwrite — a torn write falls back to it, then the M9 backup
 * slot, then fresh. Nobody ever loses a save to a crashed tab.
 *
 * Honest scope: client-side signing is a BARRIER, not a vault. It stops
 * casual cheats, memory editors and shared save hacks, and makes any
 * tampering LOUD (the load narrates every descent).
 *
 * Legacy law: a bare (pre-Fortress) payload loads as legacy and gets the
 * envelope on its next write; a signed payload whose key went missing
 * re-keys as legacy — the device lost its key, not the player's honesty.
 */ __turbopack_context__.s([
    "PUSHED_HASH_KEY",
    ()=>PUSHED_HASH_KEY,
    "SAVE_VERSION",
    ()=>SAVE_VERSION,
    "SaveSystem",
    ()=>SaveSystem,
    "lastTransportVerdict",
    ()=>lastTransportVerdict,
    "lastWriteVerdict",
    ()=>lastWriteVerdict
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/goals.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/citypack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/story.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/patti.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-ssr] (ecmascript)");
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
const SAVE_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORTRESS_KEYS"].primary;
const SHADOW_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORTRESS_KEYS"].shadow;
const SAVE_VERSION = 20;
/** M15 — THE DELTA LAW: the state fingerprint of the last payload that hit disk.
 *  Lives OUTSIDE the save (the fortress rule: the books live beside, not inside). */ const DELTA_HASH_KEY = 'lokoja-life:save-hash';
const PUSHED_HASH_KEY = 'lokoja-life:pushed-hash';
/** M20 — the EXACT string the vault last accepted (the binary delta's base). */ const LAST_PUSHED_ENV_KEY = 'lokoja-life:last-pushed-env';
/**
 * THE STATE FINGERPRINT — sha256 over the save with the timestamps
 * zeroed. Two saves whose ONLY difference is `updatedAt` are the SAME
 * life: the debounced autosave re-fires on an idle city every few
 * seconds, and the timestamps alone must never grind the disk (or the
 * cloud). The disk keeps the LAST REAL write's timestamp — an honest
 * "when your life last changed" line.
 */ function stateFingerprint(save) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(JSON.stringify({
        ...save,
        createdAt: 0,
        updatedAt: 0
    }));
}
/** Check localStorage availability without throwing (private mode etc). */ function storageAvailable() {
    try {
        const probe = '__lko_probe__';
        window.localStorage.setItem(probe, '1');
        window.localStorage.removeItem(probe);
        return true;
    } catch  {
        return false;
    }
}
/* ------------------------------ the device key ------------------------------ */ let cachedKey = null;
/** Read (or create) the device-local fortress key. Test hook: setFortKey. */ function fortKey() {
    if (cachedKey) return cachedKey;
    try {
        const existing = window.localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORT_KEY_STORAGE"]);
        if (existing && existing.length >= 32) {
            cachedKey = existing;
            return cachedKey;
        }
        // fresh device key — random bytes via crypto, Math.random as the honest fallback
        let hex = '';
        if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
            const bytes = new Uint8Array(24);
            crypto.getRandomValues(bytes);
            hex = Array.from(bytes).map((b)=>b.toString(16).padStart(2, '0')).join('');
        } else {
            for(let i = 0; i < 24; i++)hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        }
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORT_KEY_STORAGE"], hex);
        cachedKey = hex;
        return cachedKey;
    } catch  {
        return null;
    }
}
/**
 * TEST HOOK — pin the device key deterministically (the suite signs and
 * tampers against a FIXED key so the vectors stay stable).
 */ function setFortKey(key) {
    cachedKey = key;
    try {
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORT_KEY_STORAGE"], key);
    } catch  {
    /* the caller owns storage in tests */ }
}
/* --------------------------- serialize + envelope --------------------------- */ /** Serialize the save into the storage-safe JSON string. */ function serialize(save) {
    return JSON.stringify({
        ...save,
        version: SAVE_VERSION
    });
}
function wrapEnvelope(dataStr) {
    const key = fortKey();
    const sig = key ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signPayload"])(dataStr, key) : '';
    return JSON.stringify({
        fmt: 2,
        data: JSON.parse(dataStr),
        sig
    });
}
/**
 * Parse + verify an envelope or a legacy bare save. Returns the save
 * (healed) plus the transport verdict the boot toast narrates.
 */ function unwrapEnvelope(raw) {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.fmt === 2 && typeof parsed.sig === 'string') {
            // signed envelope — re-serialize the data slice EXACTLY as stored
            const dataStr = JSON.stringify(parsed.data);
            const key = fortKey();
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verifyPayload"])(dataStr, parsed.sig, key);
            if (v.ok) {
                return parsed.data ? {
                    save: parsed.data,
                    verdict: 'ok'
                } : {
                    save: null,
                    verdict: 'malformed'
                };
            }
            if (v.why === 'missing-key') {
                return parsed.data ? {
                    save: parsed.data,
                    verdict: 'missing-key'
                } : {
                    save: null,
                    verdict: 'malformed'
                };
            }
            if (v.why === 'tampered') return {
                save: null,
                verdict: 'tampered'
            };
            return {
                save: null,
                verdict: 'malformed'
            };
        }
        // legacy bare save (pre-M14) — loads as legacy, re-signed on next write
        return {
            save: parsed ?? null,
            verdict: 'legacy'
        };
    } catch  {
        return {
            save: null,
            verdict: 'malformed'
        };
    }
}
/**
 * Parse + migrate an old save string into the current shape.
 * Each case below upgrades one version step; future versions
 * add their own `case N` — never break existing players.
 */ function deserialize(raw) {
    const { save: parsed, verdict } = unwrapEnvelope(raw);
    if (verdict === 'tampered' || verdict === 'malformed') return null;
    if (!parsed || typeof parsed !== 'object' || !parsed.player) return null;
    let save = parsed;
    switch(save.version){
        case 1:
            // v1 → v2 (Stage 3): economy/work fields added to the player.
            // All are defaulted below — nothing a v1 player had is lost.
            save.version = 2;
            break;
        case 2:
            // v2 → v3 (Stage 5): vehicles, bank balance, NPC relationships.
            // Defaults applied below — a v2 player wakes up with an empty
            // garage, an empty bank account, and strangers for friends.
            save.version = 3;
            break;
        case 3:
            // v3 → v4 (M2): the civic mesh — NEPA/KGIRS/police/EFCC/market.
            // freshCivicState() below gives a v3 player a clean civic slate:
            // no bills owed, no warrant, a rolled market for their current day.
            save.version = 4;
            break;
        case 4:
            // v4 → v5 (M3 — OWN THE CITY): businesses gain the accrual fields
            // (accrued till, lastAccrualDay, openedDay). Any biz entry a v4 save
            // somehow carries is defaulted below; normal v4 saves carry an
            // empty array, which is already the correct v5 shape.
            save.version = 5;
            break;
        case 5:
            // v5 → v6 (M5 — WORK & FLEET): businesses gain staff + installed
            // upgrades, and the save carries the fleet's done-gig ledger. Both
            // default below — a v5 player wakes up with no attendants hired,
            // no generator/solar fitted, and a clean Motor Park board.
            save.version = 6;
            break;
        case 6:
            // v6 → v7 (M6 — LIVING WORLD): the relationship track gains the
            // gift/hangout cooldowns (lastGiftDay / lastHangoutDay). Optional
            // fields defaulted below — a v6 player wakes up with no gifts
            // given and no hangouts owed, everything else untouched.
            save.version = 7;
            break;
        case 7:
            // v7 → v8 (M7 — RUN ON ANY DEVICE): settings gains the graphics
            // pick ('auto' | 'low' | 'mid' | 'high'). Defaulted below — a v7
            // player wakes up on Auto and the device law decides for them.
            save.version = 8;
            break;
        case 8:
            // v8 → v9 (M8 — THE CHAOS ENGINE): the chaos slice joins the save —
            // transformer outages, the community fix pool, scarcity bookkeeping.
            // Defaulted below — a v8 player wakes up on a quiet grid.
            save.version = 9;
            break;
        case 9:
            // v9 → v10 (M9 — THE CASUAL SHELL): daily goals, the onboarding
            // arc, the Guest Loop account line, and settings.chill join the
            // schema. All defaulted below — a v9 player wakes up as a guest
            // with today's goals waiting and the city at normal pressure.
            save.version = 10;
            break;
        case 10:
            // v10 → v11 (M10 — THE LIVING CALENDAR): the calendar slice joins
            // the save — festival participation, ram meat, regatta stakes,
            // aso-ebi, the paving projects. Defaulted below — a v10 player
            // wakes up with the year's celebrations waiting, nothing owed.
            save.version = 11;
            break;
        case 11:
            // v11 → v12 (M11 — THE RIVERS AWAKE): the rivers slice joins the
            // save — sandbags, walkways, tolls, the canoe, the rescue bowl.
            // Defaulted below — a v11 player wakes up on a dry-season river.
            save.version = 12;
            break;
        case 12:
            // v12 → v13 (M12 — THE LADDER): the education, housing and japa
            // slices join the save — the FUL semester clock, the rent book,
            // and the JAPA document chain. Defaulted below — a v12 player
            // wakes up with the ladder waiting at the bottom rung.
            save.version = 13;
            break;
        case 13:
            // v13 → v14 (M13 — THE FAMILY SHIELD): the character gains a life
            // stage, the settings gain elder mode, and the shield slice joins
            // the save — the scammer game's book and the local parent gate.
            // Defaulted below — a v13 player wakes up as an adult (the honest
            // default for existing hustlers) with the literacy game waiting.
            save.version = 14;
            break;
        case 14:
            // v14 → v15 (M14 — THE FORTRESS): the fortress slice joins the
            // save — the anomaly counter, the income ledgers, the kobo-chain
            // tail. Defaulted below — a v14 player wakes up guarded, with a
            // clean ledger and their first entry chaining from the seed.
            save.version = 15;
            break;
        case 15:
            // v15 → v16 (M15 — TELEPORT & PULSE): the pulse slice joins the
            // save — the read book for the city paper, the arrival book for
            // teleport postcards, the share ledger. Defaulted below — a v15
            // player wakes up with the paper waiting and an empty mailbox.
            save.version = 16;
            break;
        case 16:
            // v16 → v17 (M17 — THE LIVE NATION): the live slice joins the
            // save — my event cursor, my voice opt-in, my memberships.
            // Defaulted below — a v16 player wakes up standing in the nation
            // with the mic ready and the cursor at zero.
            save.version = 17;
            break;
        case 17:
            // v17 → v18 (M18 — THE CITY FORGE): the forge slice joins the
            // save — the vote book and the ledger. Defaulted below — a v17
            // player wakes up holding a vote card and an empty ledger.
            save.version = 18;
            break;
        case 18:
            // v18 → v19 (M19 — NEXT-GEN POLISH): the story (THE CONFLUENCE PATH),
            // the Patti secrets and the wardrobe book join the save, plus the
            // settings.music / settings.haptics picks. All defaulted below — a
            // v18 player wakes up at chapter 0 with a dry hill, an empty
            // wardrobe, the soundtrack off until they turn it on, and haptics
            // humming on their phone.
            save.version = 19;
            break;
        case 19:
            // v19 → v20 (M20 — PLANET SCALE + OPS): the nation slice joins the
            // save — the crowd switch, the inflation ledger, the moderation
            // book and the telemetry opt-in (dark by default). Defaulted
            // below — a v19 player wakes up with the city alive, the books
            // empty and their data theirs.
            save.version = 20;
            break;
        case 20:
            break;
        default:
            // F1 HARDENING — a save from a NEWER app version is REFUSED, not
            // best-effort loaded: its shape is ahead of every migration here, and
            // the unconditional stamp-down below used to claim it as v20. null
            // sends the load descent to the shadow/backup rungs, then fresh —
            // continueGame (useGameStore) reads a null load as "no save" and falls
            // back to the new-game flow. Legacy bare saves (version undefined)
            // still pass: `undefined > SAVE_VERSION` is false.
            if (typeof save.version === 'number' && save.version > SAVE_VERSION) return null;
            break;
    }
    // --- defensive defaults (never break a loadable save) ---
    if (!save.world) {
        save.world = {
            day: 1,
            timeOfDay: 'morning',
            weather: 'sunny',
            currentLocation: 'home'
        };
    }
    if (!save.world.currentLocation) save.world.currentLocation = 'home';
    if (!save.settings) save.settings = {
        sound: true,
        graphics: 'auto',
        chill: false,
        elder: false,
        music: false,
        haptics: true
    };
    if (typeof save.settings.sound !== 'boolean') save.settings.sound = true;
    if (![
        'auto',
        'low',
        'mid',
        'high'
    ].includes(save.settings.graphics)) save.settings.graphics = 'auto';
    if (typeof save.settings.chill !== 'boolean') save.settings.chill = false;
    if (typeof save.settings.elder !== 'boolean') save.settings.elder = false;
    // M19 — music defaults OFF (respect data plans), haptics ON (touch is the point)
    if (typeof save.settings.music !== 'boolean') save.settings.music = false;
    if (typeof save.settings.haptics !== 'boolean') save.settings.haptics = true;
    // --- Stage 3 player fields (missing on v1 saves / corrupt data) ---
    const p = save.player;
    if (!p.skillXp) p.skillXp = {
        hustle: 0,
        smart: 0,
        social: 0
    };
    if (!p.activeOpportunities) p.activeOpportunities = [];
    if (!p.cooldowns) p.cooldowns = {};
    if (!p.transactions) p.transactions = [];
    if (!p.stats) {
        p.stats = {
            jobsCompleted: 0,
            hustlesCompleted: 0,
            totalEarned: 0,
            totalSpent: 0
        };
    }
    // --- M13 family shield (missing on v13-and-older saves) ---
    if (p.ageBand !== 'kid' && p.ageBand !== 'teen' && p.ageBand !== 'adult') p.ageBand = 'adult';
    // --- Stage 5 player fields (missing on v2-and-older saves) ---
    if (!p.vehicles) p.vehicles = [];
    // F1 HARDENING — the bank law: finite, non-negative, whole naira. The old
    // guard caught non-numbers only; Infinity/NaN/negative/fractional rode
    // straight into the engine.
    p.bankBalance = typeof p.bankBalance === 'number' && Number.isFinite(p.bankBalance) ? Math.max(0, Math.floor(p.bankBalance)) : 0;
    if (!p.relationships) p.relationships = {};
    // --- M6 social-depth fields (missing on v6-and-older saves) ---
    for (const key of Object.keys(p.relationships)){
        const r = p.relationships[key];
        if (typeof r.lastGiftDay !== 'number') r.lastGiftDay = 0;
        if (typeof r.lastHangoutDay !== 'number') r.lastHangoutDay = 0;
    }
    // --- M3 businesses (missing on v4-and-older saves; legacy entries upgraded) ---
    if (!p.businesses) p.businesses = [];
    p.businesses = p.businesses.map((b)=>({
            ...b,
            accrued: typeof b.accrued === 'number' ? b.accrued : 0,
            lastAccrualDay: typeof b.lastAccrualDay === 'number' ? b.lastAccrualDay : save.world?.day ?? 1,
            openedDay: typeof b.openedDay === 'number' ? b.openedDay : save.world?.day ?? 1,
            // M5 — staff & power (missing on v5-and-older saves)
            staff: typeof b.staff === 'number' && b.staff > 0 ? b.staff : 0,
            upgrades: Array.isArray(b.upgrades) ? b.upgrades : []
        }));
    // --- M5 fleet ledger (missing on v5-and-older saves) ---
    const fleet = save.fleet && Array.isArray(save.fleet.done) ? save.fleet : {
        day: save.world?.day ?? 1,
        done: []
    };
    if (typeof fleet.day !== 'number') fleet.day = save.world?.day ?? 1;
    save.fleet = fleet;
    // --- M8 chaos engine (missing on v8-and-older saves; partial data healed) ---
    const fresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshChaosState"])();
    const chaos = save.chaos ?? fresh;
    if (typeof chaos.day !== 'number') chaos.day = fresh.day;
    if (!Array.isArray(chaos.recent)) chaos.recent = fresh.recent;
    if (!chaos.active || typeof chaos.active.zoneId !== 'string') chaos.active = null;
    if (typeof chaos.atmDrawnDay !== 'number') chaos.atmDrawnDay = fresh.atmDrawnDay;
    if (typeof chaos.atmDrawn !== 'number') chaos.atmDrawn = fresh.atmDrawn;
    if (!chaos.stats) chaos.stats = fresh.stats;
    save.chaos = chaos;
    // --- M9 casual shell (missing on v9-and-older saves; partial data healed) ---
    if (!save.goals || !Array.isArray(save.goals.ids) || save.goals.ids.length !== 3) save.goals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshGoalState"])();
    if (!Array.isArray(save.goals.done)) save.goals.done = [
        false,
        false,
        false
    ];
    if (!save.onboarding || !Array.isArray(save.onboarding.done)) save.onboarding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshOnboardingState"])();
    if (typeof save.onboarding.rewarded !== 'boolean') save.onboarding.rewarded = false;
    if (!save.account) save.account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshAccountState"])();
    if (typeof save.account.linked !== 'boolean') save.account.linked = false;
    if (typeof save.account.gateGraceDay !== 'number') save.account.gateGraceDay = 0;
    // --- M10 living calendar (missing on v10-and-older saves; partial data healed) ---
    const freshCal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshCalendarState"])();
    const cal = save.calendar ?? freshCal;
    if (typeof cal.day !== 'number') cal.day = freshCal.day;
    if (typeof cal.meatPacks !== 'number') cal.meatPacks = 0;
    if (!Array.isArray(cal.meatShares)) cal.meatShares = [];
    if (!Array.isArray(cal.sponsored)) cal.sponsored = [];
    if (!Array.isArray(cal.bets)) cal.bets = [];
    if (!Array.isArray(cal.asoEbi)) cal.asoEbi = [];
    if (!Array.isArray(cal.attended)) cal.attended = [];
    if (!Array.isArray(cal.paved)) cal.paved = [];
    if (!cal.paving || typeof cal.paving.zoneId !== 'string') cal.paving = null;
    if (!cal.stats) cal.stats = freshCal.stats;
    cal.paved = cal.paved.filter((r)=>typeof r.zoneId === 'string' && typeof r.untilDay === 'number');
    save.calendar = cal;
    // --- M11 rivers (missing on v11-and-older saves; partial data healed) ---
    const freshRiv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshRiversState"])();
    const rivers = save.rivers ?? freshRiv;
    if (typeof rivers.day !== 'number') rivers.day = freshRiv.day;
    if (typeof rivers.sandbags !== 'number') rivers.sandbags = 0;
    if (typeof rivers.canoe !== 'boolean') rivers.canoe = false;
    if (!rivers.walkways || typeof rivers.walkways !== 'object') rivers.walkways = {};
    for (const [zoneId, w] of Object.entries(rivers.walkways)){
        if (typeof w.laid !== 'number' || w.laid < 0) w.laid = 0;
        if (typeof w.tollTier !== 'number') w.tollTier = 0;
        if (typeof w.pot !== 'number') w.pot = 0;
        if (typeof w.tollDay !== 'number') w.tollDay = 0;
        rivers.walkways[zoneId] = w;
    }
    if (!rivers.rescue || typeof rivers.rescue.zoneId !== 'string' || typeof rivers.rescue.year !== 'number') rivers.rescue = null;
    if (typeof rivers.rescuedYear !== 'number') rivers.rescuedYear = 0;
    if (typeof rivers.ferryDay !== 'number') rivers.ferryDay = 0;
    if (!Array.isArray(rivers.ferryDone)) rivers.ferryDone = [];
    if (!rivers.stats) rivers.stats = freshRiv.stats;
    save.rivers = rivers;
    // --- M12 ladder (missing on v12-and-older saves; partial data healed) ---
    const freshEd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshEducationState"])();
    const ed = save.education ?? freshEd;
    if (typeof ed.enrolled !== 'boolean') ed.enrolled = false;
    if (typeof ed.semester !== 'number' || ed.semester < 1) ed.semester = freshEd.semester;
    if (typeof ed.semesterStartDay !== 'number') ed.semesterStartDay = 0;
    if (typeof ed.lecturesDone !== 'number') ed.lecturesDone = 0;
    if (typeof ed.lastLectureDay !== 'number') ed.lastLectureDay = 0;
    if (typeof ed.lastGrantSemester !== 'number') ed.lastGrantSemester = 0;
    if (typeof ed.examsPassed !== 'number') ed.examsPassed = 0;
    if (typeof ed.failedExams !== 'number') ed.failedExams = 0;
    if (typeof ed.graduated !== 'boolean') ed.graduated = false;
    if (typeof ed.convocationDay !== 'number') ed.convocationDay = null;
    if (typeof ed.convocationAttended !== 'boolean') ed.convocationAttended = false;
    if (!ed.stats) ed.stats = freshEd.stats;
    save.education = ed;
    const freshHou = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshHousingState"])();
    const hou = save.housing ?? freshHou;
    if (hou.owned !== null && typeof hou.owned !== 'string') hou.owned = null;
    if (!hou.furnishing || typeof hou.furnishing !== 'object') hou.furnishing = {};
    if (typeof hou.rentPaidThrough !== 'number') hou.rentPaidThrough = 0;
    if (typeof hou.lastPostedDay !== 'number') hou.lastPostedDay = 0;
    if (typeof hou.rentOwed !== 'number' || hou.rentOwed < 0) hou.rentOwed = 0;
    if (!hou.wahala || typeof hou.wahala.kind !== 'string') hou.wahala = null;
    if (!hou.stats) hou.stats = freshHou.stats;
    save.housing = hou;
    const freshJap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshJapaState"])();
    const jap = save.japa ?? freshJap;
    for (const k of [
        'nimcReadyDay',
        'nimcDay',
        'passportReadyDay',
        'passportDay',
        'agentTries',
        'agentScams',
        'clearanceDay',
        'policeDay',
        'flownDay',
        'remitDay',
        'policeShifts',
        'sirenUntilDay',
        'lastEscortDay'
    ]){
        if (typeof jap[k] !== 'number') jap[k] = 0;
    }
    if (!jap.stats) jap.stats = freshJap.stats;
    save.japa = jap;
    // --- M13 shield (missing on v13-and-older saves; partial data healed) ---
    const freshSh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshShieldState"])();
    const sh = save.shield ?? freshSh;
    if (typeof sh.scammerDay !== 'number') sh.scammerDay = freshSh.scammerDay;
    if (typeof sh.scammerCorrect !== 'number') sh.scammerCorrect = freshSh.scammerCorrect;
    if (typeof sh.scammerWrong !== 'number') sh.scammerWrong = freshSh.scammerWrong;
    if (typeof sh.scammerStreak !== 'number') sh.scammerStreak = freshSh.scammerStreak;
    if (typeof sh.parentPinHash !== 'string' && sh.parentPinHash !== null) sh.parentPinHash = null;
    save.shield = sh;
    // --- M14 fortress (missing on v14-and-older saves; partial data healed) ---
    const freshFt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshFortressState"])();
    const ft = save.fortress ?? freshFt;
    if (typeof ft.anomalies !== 'number' || ft.anomalies < 0) ft.anomalies = freshFt.anomalies;
    if (typeof ft.dayEarnedDay !== 'number') ft.dayEarnedDay = freshFt.dayEarnedDay;
    if (typeof ft.dayEarned !== 'number' || ft.dayEarned < 0) ft.dayEarned = freshFt.dayEarned;
    if (typeof ft.slotTxCount !== 'number' || ft.slotTxCount < 0) ft.slotTxCount = freshFt.slotTxCount;
    if (typeof ft.slotTxSlot !== 'number') ft.slotTxSlot = freshFt.slotTxSlot;
    if (typeof ft.chainTail !== 'string') ft.chainTail = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAIN_SEED"];
    if (typeof ft.fingerprint !== 'string' && ft.fingerprint !== null) ft.fingerprint = null;
    save.fortress = ft;
    // --- M15 city pulse (missing on v15-and-older saves; partial data healed) ---
    const freshPl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshPulseState"])();
    const pl = save.cityPulse ?? freshPl;
    if (typeof pl.readDay !== 'number' || pl.readDay < 0) pl.readDay = freshPl.readDay;
    if (!Array.isArray(pl.seen)) pl.seen = [];
    if (!Array.isArray(pl.arrivals)) pl.arrivals = [];
    pl.arrivals = pl.arrivals.filter((c)=>typeof c === 'string' && c.startsWith('lkt1.')).slice(-20);
    pl.seen = pl.seen.filter((s)=>typeof s === 'string').slice(-64);
    if (!pl.stats || typeof pl.stats !== 'object') pl.stats = freshPl.stats;
    if (typeof pl.stats.shares !== 'number' || pl.stats.shares < 0) pl.stats.shares = 0;
    if (typeof pl.stats.arrivalsIn !== 'number' || pl.stats.arrivalsIn < 0) pl.stats.arrivalsIn = 0;
    save.cityPulse = pl;
    // --- M17 live nation (missing on v16-and-older saves; partial data healed) ---
    const freshLv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshLiveState"])();
    const lv = save.live ?? freshLv;
    if (typeof lv.cursor !== 'number' || lv.cursor < 0) lv.cursor = freshLv.cursor;
    if (typeof lv.voiceOn !== 'boolean') lv.voiceOn = freshLv.voiceOn;
    if (typeof lv.assocId !== 'string' && lv.assocId !== null) lv.assocId = null;
    if (!Array.isArray(lv.coSigned)) lv.coSigned = [];
    lv.coSigned = lv.coSigned.filter((c)=>typeof c === 'string').slice(-24);
    if (!Array.isArray(lv.circles)) lv.circles = [];
    lv.circles = lv.circles.filter((c)=>typeof c === 'string').slice(-12);
    if (!lv.stats || typeof lv.stats !== 'object') lv.stats = freshLv.stats;
    for (const k of [
        'chats',
        'emotes',
        'streamsWatched',
        'tradesDone'
    ]){
        if (typeof lv.stats[k] !== 'number' || lv.stats[k] < 0) lv.stats[k] = 0;
    }
    if (typeof lv.finesPaid !== 'number' || lv.finesPaid < 0) lv.finesPaid = 0;
    save.live = lv;
    // --- M18 city forge (missing on v17-and-older saves; partial data healed) ---
    const freshFg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshForgeState"])();
    const fg = save.forge ?? freshFg;
    if (!fg.votes || typeof fg.votes !== 'object' || !fg.votes.counts || typeof fg.votes.counts !== 'object') fg.votes = freshFg.votes;
    if (!Array.isArray(fg.votes.mine)) fg.votes.mine = [];
    fg.votes.mine = fg.votes.mine.filter((c)=>typeof c === 'string').slice(-3);
    for (const [k, n] of Object.entries(fg.votes.counts)){
        if (typeof n !== 'number' || n < 0) delete fg.votes.counts[k];
    }
    if (!Array.isArray(fg.ledger)) fg.ledger = [];
    fg.ledger = fg.ledger.filter((e)=>e && typeof e.city === 'string').slice(-20);
    if (typeof fg.ranLokoja !== 'boolean') fg.ranLokoja = false;
    save.forge = fg;
    // --- M19 story / patti / wardrobe (missing on v18-and-older saves) ---
    const freshSt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshStoryState"])();
    const st = save.story ?? freshSt;
    if (typeof st.chapter !== 'number' || st.chapter < 0 || st.chapter > 5) st.chapter = freshSt.chapter;
    if (typeof st.sandDays !== 'number' || st.sandDays < 0) st.sandDays = freshSt.sandDays;
    if (typeof st.lastSandDay !== 'number' || st.lastSandDay < 0) st.lastSandDay = freshSt.lastSandDay;
    if (typeof st.notePaid !== 'boolean') st.notePaid = freshSt.notePaid;
    if (typeof st.feverPaid !== 'boolean') st.feverPaid = freshSt.feverPaid;
    if (typeof st.sponsoredDays !== 'number' || st.sponsoredDays < 0) st.sponsoredDays = freshSt.sponsoredDays;
    if (typeof st.lastSponsorDay !== 'number' || st.lastSponsorDay < 0) st.lastSponsorDay = freshSt.lastSponsorDay;
    if (typeof st.doctorDay !== 'number' || st.doctorDay < 0) st.doctorDay = freshSt.doctorDay;
    save.story = st;
    const freshPt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshPattiState"])();
    const pt = save.patti ?? freshPt;
    if (!pt.found || typeof pt.found !== 'object') pt.found = freshPt.found;
    for (const [k, n] of Object.entries(pt.found)){
        if (typeof n !== 'number' || n < 0) delete pt.found[k];
    }
    save.patti = pt;
    const freshWd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshWardrobeState"])();
    const wd = save.wardrobe ?? freshWd;
    if (!Array.isArray(wd.ownedStyles)) wd.ownedStyles = freshWd.ownedStyles;
    if (!Array.isArray(wd.ownedWalks)) wd.ownedWalks = freshWd.ownedWalks;
    wd.ownedStyles = wd.ownedStyles.filter((k)=>typeof k === 'string');
    wd.ownedWalks = wd.ownedWalks.filter((k)=>typeof k === 'string');
    if (typeof wd.activeWalk !== 'string' || !wd.ownedWalks.includes(wd.activeWalk)) {
        wd.activeWalk = wd.ownedWalks.includes('street') || wd.ownedWalks.length === 0 ? 'street' : wd.ownedWalks[0];
    }
    save.wardrobe = wd;
    // --- M20 nation slice (missing on v19-and-older saves) ---
    if (!save.nation) {
        save.nation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshNationState"])();
    } else {
        const fresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshNationState"])();
        const crowd = save.nation.crowd;
        save.nation = {
            crowd: {
                seed: typeof crowd?.seed === 'number' && Number.isFinite(crowd.seed) ? crowd.seed : fresh.crowd.seed,
                count: typeof crowd?.count === 'number' && crowd.count > 0 && crowd.count <= 50_000 ? Math.floor(crowd.count) : fresh.crowd.count,
                on: typeof crowd?.on === 'boolean' ? crowd.on : fresh.crowd.on
            },
            inflation: Array.isArray(save.nation.inflation) ? save.nation.inflation.filter((r)=>r && typeof r.day === 'number' && typeof r.mult === 'number').slice(-12) : [],
            moderation: Array.isArray(save.nation.moderation) ? save.nation.moderation.filter((r)=>r && typeof r.day === 'number' && typeof r.why === 'string' && typeof r.band === 'string').slice(-40) : [],
            telemetryOptIn: save.nation.telemetryOptIn === true
        };
    }
    // --- M2 civic mesh (missing on v3-and-older saves) ---
    if (!save.civic) {
        save.civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshCivicState"])();
    } else {
        // defensive merge — a partially-written civic slice still loads
        const fresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freshCivicState"])();
        save.civic = {
            nepa: {
                ...fresh.nepa,
                ...save.civic.nepa
            },
            kgirs: {
                ...fresh.kgirs,
                ...save.civic.kgirs
            },
            police: {
                ...fresh.police,
                ...save.civic.police
            },
            efcc: {
                ...fresh.efcc,
                ...save.civic.efcc,
                pending: save.civic.efcc?.pending ?? []
            },
            market: {
                ...fresh.market,
                ...save.civic.market
            }
        };
    }
    // --- F1 HARDENING — the scalar sanitization pass ---
    // The heal blocks above fix MISSING objects only; crafted saves can ride
    // bad SCALARS straight into the engine (cash:-999999, cash:null,
    // day:"5" → "51" after +1, cash:1e308, Infinity → totalEarned:null).
    // Every successful load passes this law: money is a finite non-negative
    // whole naira, the day a finite integer ≥ 1, needs sit in [0,100], life
    // counters are finite. Valid saves already satisfy every rule here and
    // pass through byte-identical (verified by round-trip in the F1 battery).
    // PH2.5 (Bravo25): the heal also caps the CEILING — a hand-edited save
    // with cash:1e308 is finite and passed the floor-only law. Load-side
    // ceiling = ₦1bn, the same ceiling the cloud-push law enforces.
    p.cash = typeof p.cash === 'number' && Number.isFinite(p.cash) ? Math.min(1_000_000_000, Math.max(0, Math.floor(p.cash))) : 0;
    if (typeof p.bankBalance === 'number' && Number.isFinite(p.bankBalance)) {
        p.bankBalance = Math.min(1_000_000_000, Math.max(0, Math.floor(p.bankBalance)));
    }
    if (save.world) {
        const d = Number(save.world.day);
        save.world.day = Number.isFinite(d) ? Math.max(1, Math.floor(d)) : 1;
    }
    if (p.needs && typeof p.needs === 'object') {
        for (const k of [
            'health',
            'energy',
            'hunger',
            'mood'
        ]){
            const v = p.needs[k];
            // a non-finite need loads at the fresh-game value — a corrupt save
            // must never boot its player starving, exhausted or dead
            p.needs[k] = typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 100;
        }
    }
    if (p.stats && typeof p.stats === 'object') {
        for (const k of [
            'jobsCompleted',
            'hustlesCompleted',
            'totalEarned',
            'totalSpent'
        ]){
            const v = p.stats[k];
            p.stats[k] = typeof v === 'number' && Number.isFinite(v) ? v : 0;
        }
    }
    save.version = SAVE_VERSION;
    return save;
}
let lastTransportVerdict = 'none';
let lastWriteVerdict = 'failed';
const SaveSystem = {
    SAVE_KEY,
    SAVE_VERSION,
    SHADOW_KEY,
    /** TEST HOOK — pin the device key (deterministic signing in the suite). */ setFortKey (key) {
        setFortKey(key);
    },
    /** The device fortress key (tests + the UI honesty row may read it). */ fortKey () {
        return fortKey();
    },
    /** Does a local save exist? */ hasSave () {
        if (!storageAvailable()) return false;
        return window.localStorage.getItem(SAVE_KEY) !== null;
    },
    /**
   * THE LOAD PLAN — primary → shadow → backup → fresh. The primary wins
   * when it parses AND verifies; a tampered/torn primary falls to the
   * shadow, then the M9 backup slot, then fresh. The last verdict lands
   * in lastTransportVerdict for the boot toast.
   */ load () {
        if (!storageAvailable()) return null;
        // 1) the primary
        const primaryRaw = window.localStorage.getItem(SAVE_KEY);
        if (primaryRaw) {
            const { save, verdict } = unwrapEnvelope(primaryRaw);
            if (save) {
                const healed = deserialize(primaryRaw);
                if (healed) {
                    lastTransportVerdict = verdict === 'legacy' ? 'legacy' : verdict === 'missing-key' ? 'missing-key' : 'ok';
                    return healed;
                }
            }
        }
        // 2) the shadow (the previous primary — a torn/tampered write's twin)
        const shadowRaw = window.localStorage.getItem(SHADOW_KEY);
        if (shadowRaw) {
            const { save: shadowSave } = unwrapEnvelope(shadowRaw);
            if (shadowSave) {
                const healed = deserialize(shadowRaw);
                if (healed) {
                    lastTransportVerdict = 'recovered-shadow';
                    // heal forward: drop the broken primary FIRST (never demote tampered
                    // bytes into the shadow slot), then re-seal the honest save
                    window.localStorage.removeItem(SAVE_KEY);
                    this.write(healed, {
                        force: true
                    });
                    return healed;
                }
            }
        }
        // 3) the M9 backup slot (the guest loop's never-lose-progress copy)
        try {
            const backupRaw = window.localStorage.getItem('lokoja-life:backup');
            if (backupRaw) {
                const parsed = JSON.parse(backupRaw);
                if (parsed && parsed.player) {
                    const healed = deserialize(JSON.stringify(parsed));
                    if (healed) {
                        lastTransportVerdict = 'recovered-backup';
                        window.localStorage.removeItem(SAVE_KEY);
                        window.localStorage.removeItem(SHADOW_KEY);
                        this.write(healed, {
                            force: true
                        });
                        return healed;
                    }
                }
            }
        } catch  {
        /* the backup slot is corrupt — the descent continues */ }
        lastTransportVerdict = 'fresh';
        return null;
    },
    /**
   * THE WRITE PLAN — the shadow receives the CURRENT primary BEFORE the
   * primary is overwritten (double-buffer), then the new payload lands
   * signed. Torn writes leave the shadow holding the last good save.
   *
   * M15 — THE DELTA LAW: if the serialized payload is byte-identical to
   * the last write AND the primary on disk is intact, the write SKIPS —
   * no re-sign, no shadow churn, zero bytes. A debounced autosave that
   * fires on an idle city no longer grinds the disk. Recovery writes
   * (the load descent) pass { force: true } — a broken primary must be
   * overwritten even when the honest payload hashes the same as the
   * last write (the broken bytes never wrote the hash themselves).
   */ write (save, opts) {
        if (!storageAvailable()) {
            lastWriteVerdict = 'failed';
            return false;
        }
        try {
            const dataStr = serialize(save);
            const fingerprint = stateFingerprint(save);
            const primaryRaw = window.localStorage.getItem(SAVE_KEY);
            // THE SKIP LAW is strict: the skip is only safe when the recovery
            // ladder keeps ALL its rungs — the primary intact, the fingerprint
            // matching, AND the shadow already holding a twin. A first write
            // (no shadow yet) always lands for real, so the descent always
            // has somewhere honest to fall.
            if (!opts?.force && primaryRaw !== null && window.localStorage.getItem(SHADOW_KEY) !== null && window.localStorage.getItem(DELTA_HASH_KEY) === fingerprint) {
                // the bytes on disk ARE this payload — verify the envelope still
                // stands (a tampered primary must never ride a delta skip)
                const { save: intact } = unwrapEnvelope(primaryRaw);
                if (intact) {
                    lastWriteVerdict = 'skip';
                    return true;
                }
            }
            // 1) double-buffer: copy the current primary into the shadow
            if (primaryRaw !== null) {
                window.localStorage.setItem(SHADOW_KEY, primaryRaw);
            }
            // 2) serialize + sign + write the primary
            window.localStorage.setItem(SAVE_KEY, wrapEnvelope(dataStr));
            window.localStorage.setItem(DELTA_HASH_KEY, fingerprint);
            lastWriteVerdict = 'wrote';
            return true;
        } catch  {
            lastWriteVerdict = 'failed';
            return false;
        }
    },
    /** The last write verdict ('wrote' | 'skip' | 'failed') — the delta law's honesty line. */ writeVerdict () {
        return lastWriteVerdict;
    },
    /** M15 — the hash of the last payload that hit disk (the delta book). */ lastWriteHash () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(DELTA_HASH_KEY);
    },
    /** M15 — the hash of the last payload the cloud accepted (zero-byte push law). */ lastPushedHash () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(PUSHED_HASH_KEY);
    },
    /** M15 — record the pushed fingerprint after a successful vault write. */ markPushed (save) {
        if (!storageAvailable()) return;
        try {
            window.localStorage.setItem(PUSHED_HASH_KEY, stateFingerprint(save));
        } catch  {}
    },
    /** M15 — the state fingerprint of a save (the delta book's own law). */ fingerprintOf (save) {
        return stateFingerprint(save);
    },
    /** M20 — the exact string the vault last accepted (the delta's base; null on a fresh device). */ lastPushedEnv () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(LAST_PUSHED_ENV_KEY);
    },
    /** M20 — record the accepted string after a successful vault write. */ markPushedEnv (env) {
        if (!storageAvailable()) return;
        try {
            window.localStorage.setItem(LAST_PUSHED_ENV_KEY, env);
        } catch  {}
    },
    /** M20 — sign an exact envelope string with the device key (the delta path's sig). */ sigForString (envStr) {
        const key = fortKey();
        return key ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signPayload"])(envStr, key) : '';
    },
    /** Remove the save (used by "Start Over"). */ clear () {
        if (!storageAvailable()) return;
        window.localStorage.removeItem(SAVE_KEY);
        window.localStorage.removeItem(SHADOW_KEY);
        window.localStorage.removeItem(DELTA_HASH_KEY);
        window.localStorage.removeItem(PUSHED_HASH_KEY);
        window.localStorage.removeItem(LAST_PUSHED_ENV_KEY);
    },
    /** The raw signed envelope of the primary (the cloud push carries it whole). */ readEnvelope () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(SAVE_KEY);
    },
    /** The last transport verdict (the boot toast + the honesty row). */ transportVerdict () {
        return lastTransportVerdict;
    },
    /**
   * M7 — patch ONLY the settings slice of an existing save (or seed it if
   * a save exists but the game isn't live). This is how a graphics pick
   * made on the MAIN MENU (before any game runs, so the debounced
   * autosave is dormant) still reaches disk. No save = nothing to patch.
   */ patchSettings (settings) {
        if (!storageAvailable()) return false;
        const save = this.load();
        if (!save) return false;
        return this.write({
            ...save,
            settings
        });
    },
    /**
   * Shape a save for future cloud upload (Supabase row).
   * Kept as a pure function so the online migration is a transport swap.
   */ toCloudPayload (save) {
        return {
            schema_version: save.version,
            data: save,
            updated_at: new Date(save.updatedAt).toISOString()
        };
    }
};
}),
"[project]/src/game/systems/haptics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Haptics (M19)
 * ---------------------------
 * Tiny vibration pulses for the moments that deserve one. THE HAPTIC
 * LAW: fire(event) calls navigator.vibrate at most ONCE per event,
 * guarded — desktop (no vibrate) is a no-op by nature, every failure is
 * swallowed, and Elder mode is structurally still (belt + braces: the
 * store also gates, but the engine refuses on its own). Zero timers,
 * zero state beyond two booleans — haptics can never break gameplay.
 */ __turbopack_context__.s([
    "HAPTIC_PATTERNS",
    ()=>HAPTIC_PATTERNS,
    "haptics",
    ()=>haptics
]);
const HAPTIC_PATTERNS = {
    reward: 18,
    levelup: [
        30,
        40,
        60
    ],
    arrival: [
        15,
        30,
        15
    ],
    festival: [
        20,
        30,
        20,
        30,
        40
    ],
    quest: [
        25,
        25,
        25
    ],
    secret: [
        10,
        20,
        10,
        20,
        50
    ]
};
class Haptics {
    enabled = true;
    elder = false;
    setEnabled(on) {
        this.enabled = on;
    }
    isEnabled() {
        return this.enabled;
    }
    /** Elder mode force-mutes REGARDLESS of enabled — the still hand law. */ setElder(on) {
        this.elder = on;
    }
    /**
   * Fire one haptic event — at most one navigator.vibrate call, guarded,
   * silent no-op anywhere vibration doesn't exist. Never throws.
   */ fire(event) {
        if (!this.enabled || this.elder) return;
        try {
            if (typeof navigator === 'undefined') return;
            if (typeof navigator.vibrate !== 'function') return;
            navigator.vibrate(HAPTIC_PATTERNS[event]);
        } catch  {
        // haptics are best-effort; never crash the game for them
        }
    }
}
const haptics = new Haptics();
}),
"[project]/src/game/systems/music.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Procedural Afro-Fusion Soundtrack (M19)
 * ------------------------------------------------------
 * A synthesised soundtrack in the audio.ts spirit: WebAudio only, ZERO
 * asset files (the data-economy law). Four moods follow the day:
 *
 *   • morning   — bright highlife lift (lead an octave up, 108 bpm)
 *   • afternoon — steady market groove (100 bpm)
 *   • evening   — warm mid slowdown (92 bpm)
 *   • night     — lofi hush: softer gains, a lead that breathes (78 bpm)
 *
 * Everything is deterministic: the pattern for a (mood, bar) pair is a
 * PURE function seeded by a hash of both, so the same bar of the same
 * mood always plays the same music — testable with no AudioContext at
 * all (see patternFor()).
 *
 * House laws (audio.ts): failures silently swallowed, audio never
 * breaks gameplay, the AudioContext is created lazily after a user
 * gesture, and THE VOICE CAP — never more than MUSIC.maxVoices live
 * synth voices; when the cap binds the quietest layer drops first
 * (hat → shaker → lead). setIntensity() is the frame-stress governor's
 * extras-first hook: level 0 = bass+lead only, level 1 = no shaker,
 * level 2 = full kit.
 */ /* --------------------------------- exports --------------------------------- */ __turbopack_context__.s([
    "MUSIC",
    ()=>MUSIC,
    "moodForTimeOfDay",
    ()=>moodForTimeOfDay,
    "music",
    ()=>music
]);
const MUSIC = {
    scaleHz: [
        261.63,
        293.66,
        329.63,
        392.0,
        440.0
    ],
    bpm: {
        morning: 108,
        afternoon: 100,
        evening: 92,
        night: 78
    },
    maxVoices: 8,
    lookaheadS: 0.3,
    tickMs: 100
};
/* --------------------------- deterministic helpers ------------------------- */ /** mulberry32 — tiny deterministic PRNG (the world3d/layout.ts pattern) */ function makeRng(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
/** FNV-1a — a stable string hash so (mood, bar) always seeds the same bar */ function hashSeed(s) {
    let h = 0x811c9dc5;
    for(let i = 0; i < s.length; i++){
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}
/** root degrees per bar, counted inside the pentatonic itself: I–I–V–IV (C, C, A, G) */ const PROGRESSION = [
    0,
    0,
    4,
    3
];
/** per-mood playback softness — night is the lofi hush */ const MOOD_GAIN = {
    morning: 1.12,
    afternoon: 1,
    evening: 0.92,
    night: 0.7
};
/** lead rest probability — the melody breathes more as the day cools */ const LEAD_REST = {
    morning: 0.42,
    afternoon: 0.5,
    evening: 0.56,
    night: 0.68
};
/** seeded sixteenth-fill chance for hats */ const HAT_FILL = {
    morning: 0.28,
    afternoon: 0.2,
    evening: 0.16,
    night: 0.08
};
/* --------------------------------- engine ---------------------------------- */ class MusicEngine {
    ctx = null;
    master = null;
    noiseBuf = null;
    bassFilter = null;
    hatFilter = null;
    shakerFilter = null;
    timer = null;
    enabled = true;
    started = false;
    mood = 'morning';
    intensity = 2;
    step = 0;
    nextNoteTime = 0;
    voiceEnds = [];
    liveVoices = 0;
    pat = null;
    patBar = -1;
    patMood = null;
    patIntensity = 2;
    setEnabled(on) {
        this.enabled = on;
        if (!on) this.stop();
    }
    isEnabled() {
        return this.enabled;
    }
    /** Lazy ctx creation (must follow a user gesture). Idempotent per mood; a mood change crossfades on the SAME ctx. */ start(mood) {
        if (!this.enabled) return;
        if (this.started) {
            if (mood !== this.mood) this.applyMood(mood);
            return;
        }
        try {
            const ctx = this.ensureCtx();
            if (!ctx) return;
            this.mood = mood;
            const master = ctx.createGain();
            master.gain.value = 0;
            master.connect(ctx.destination);
            this.master = master;
            // shared noise — one buffer feeds hats + shaker, created once
            const len = Math.floor(ctx.sampleRate * 1.5);
            const buf = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for(let i = 0; i < len; i++)data[i] = Math.random() * 2 - 1;
            this.noiseBuf = buf;
            // shared filters — no per-note filters where avoidable
            const bassFilter = ctx.createBiquadFilter();
            bassFilter.type = 'lowpass';
            bassFilter.frequency.value = 400;
            bassFilter.connect(master);
            this.bassFilter = bassFilter;
            const hatFilter = ctx.createBiquadFilter();
            hatFilter.type = 'highpass';
            hatFilter.frequency.value = 6000;
            hatFilter.connect(master);
            this.hatFilter = hatFilter;
            const shakerFilter = ctx.createBiquadFilter();
            shakerFilter.type = 'bandpass';
            shakerFilter.frequency.value = 2000;
            shakerFilter.Q.value = 1.4;
            shakerFilter.connect(master);
            this.shakerFilter = shakerFilter;
            // fade in over ~1.2s, then let the grid roll
            master.gain.setValueAtTime(0, ctx.currentTime);
            master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.2);
            this.step = 0;
            this.nextNoteTime = ctx.currentTime + 0.12;
            this.started = true;
            this.timer = setInterval(()=>this.tick(), MUSIC.tickMs);
        } catch  {
        // audio is best-effort; never crash the game for it
        }
    }
    setMood(mood) {
        if (!this.started) {
            this.mood = mood;
            return;
        }
        if (mood !== this.mood) this.applyMood(mood);
    }
    stop() {
        if (this.timer !== null) clearInterval(this.timer);
        this.timer = null;
        try {
            this.master?.disconnect();
        } catch  {
        /* ignore */ }
        try {
            void this.ctx?.close();
        } catch  {
        /* ignore */ }
        this.ctx = null;
        this.master = null;
        this.noiseBuf = null;
        this.bassFilter = null;
        this.hatFilter = null;
        this.shakerFilter = null;
        this.voiceEnds = [];
        this.liveVoices = 0;
        this.pat = null;
        this.patBar = -1;
        this.patMood = null;
        this.started = false;
    }
    isStarted() {
        return this.started;
    }
    /** THE EXTRAS-FIRST hook — the frame-stress governor thins the music here before touching anything else. */ setIntensity(level) {
        this.intensity = level;
    }
    /**
   * PURE — the deterministic pattern for one (mood, bar). No AudioContext,
   * no state, no side effects: the same arguments always return the same
   * music, so the tests can call this directly.
   */ patternFor(mood, bar) {
        const rng = makeRng(hashSeed(mood + ':' + bar));
        const scale = MUSIC.scaleHz;
        const kick = [];
        const hat = [];
        const bass = [];
        const lead = [];
        // root for this bar — I–I–V–IV-style walk through the pentatonic
        const root = PROGRESSION[(bar % PROGRESSION.length + PROGRESSION.length) % PROGRESSION.length];
        for(let i = 0; i < 16; i++){
            // kick — the afro bedrock on 0/7/10, seeded ghost notes at the edges
            let k = i === 0 || i === 7 || i === 10;
            if ((i === 3 || i === 13) && rng() < 0.3) k = true;
            kick.push(k);
            // hats — off-beat eighths, seeded sixteenth fills (night barely fills)
            let h = i % 4 === 2;
            if (!h && i % 2 === 0 && rng() < HAT_FILL[mood]) h = true;
            hat.push(h);
            // bass — syncopated roots, mostly the bar's root, occasionally a step up
            let b = 0;
            if (i === 0 || i === 3 || i === 6 || i === 8 || i === 11 || i === 14) {
                if (rng() > 0.12) {
                    const deg = rng() < 0.18 ? (root + 1) % scale.length : root;
                    b = scale[deg] / 2;
                }
            }
            bass.push(b);
            // lead — the kalimba breathes: seeded picks, rests allowed, ±1 octave only
            if (rng() > LEAD_REST[mood]) {
                const deg = Math.floor(rng() * scale.length) % scale.length;
                const r = rng();
                let oct = 1;
                if (mood === 'morning') oct = r < 0.7 ? 2 : 1;
                else oct = r < 0.14 ? 2 : r < 0.88 ? 1 : 0.5;
                lead.push({
                    step: i,
                    hz: scale[deg] * oct
                });
            }
        }
        return {
            kick,
            hat,
            bass,
            lead
        };
    }
    /* ------------------------------ internals ------------------------------ */ /** Lazily create the AudioContext on first user gesture (browser policy). */ ensureCtx() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    /** Mood change mid-play: old-pattern scheduling stops, the grid resets, the master ducks and rises. The ctx is reused, never closed. */ applyMood(mood) {
        this.mood = mood;
        this.step = 0;
        this.pat = null;
        this.patBar = -1;
        this.patMood = null;
        const ctx = this.ctx;
        if (!ctx || !this.master) return;
        try {
            const now = ctx.currentTime;
            this.nextNoteTime = Math.max(this.nextNoteTime, now + 0.1);
            const g = this.master.gain;
            g.cancelScheduledValues(now);
            g.setTargetAtTime(0, now, 0.12);
            g.setTargetAtTime(0.14, now + 0.5, 0.3);
        } catch  {
        /* ignore */ }
    }
    /** ONE timer — schedules up to MUSIC.lookaheadS ahead on the 16th-note grid. */ tick() {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.started) return;
            const now = ctx.currentTime;
            // retire finished voices — the cap counts the LIVE ones
            if (this.voiceEnds.length > 0) {
                this.voiceEnds = this.voiceEnds.filter((e)=>e > now);
                this.liveVoices = this.voiceEnds.length;
            }
            if (typeof document !== 'undefined' && document.hidden) {
                // silent while hidden — the timer keeps running but nothing is
                // scheduled, and the grid never falls behind reality
                this.nextNoteTime = Math.max(this.nextNoteTime, now + 0.06);
                return;
            }
            const horizon = now + MUSIC.lookaheadS;
            let guard = 0;
            while(this.nextNoteTime < horizon && guard < 32){
                guard++;
                const stepDur = 60 / MUSIC.bpm[this.mood] / 4;
                const bar = Math.floor(this.step / 16);
                const inBar = this.step % 16;
                this.triggerStep(this.nextNoteTime, bar, inBar);
                this.nextNoteTime += stepDur;
                this.step++;
            }
        } catch  {
        // audio is best-effort; never crash the game for it
        }
    }
    /**
   * Trigger one 16th-step. The scheduling order IS the drop order: kick
   * and bass (the loud frame) claim cap slots first, so when the cap
   * binds the quiet layers — hat → shaker → lead — are the ones that
   * never start. THE VOICE CAP is never exceeded.
   */ triggerStep(t, bar, i) {
        if (bar !== this.patBar || this.mood !== this.patMood || !this.pat) {
            this.pat = this.patternFor(this.mood, bar);
            this.patBar = bar;
            this.patMood = this.mood;
            this.patIntensity = this.intensity; // the governor's level is read per bar
        }
        const pat = this.pat;
        const mg = MOOD_GAIN[this.mood];
        const cap = MUSIC.maxVoices;
        if (pat.kick[i] && this.patIntensity >= 1 && this.liveVoices < cap) this.playKick(t, mg);
        const bassHz = pat.bass[i];
        if (bassHz > 0 && this.liveVoices < cap) this.playBass(t, bassHz, mg);
        for (const n of pat.lead){
            if (n.step === i && this.liveVoices < cap) this.playLead(t, n.hz, mg);
        }
        // shaker — a steady off-beat tremolo, full kit only
        if (i % 4 === 2 && this.patIntensity >= 2 && this.liveVoices < cap) this.playShaker(t, mg);
        if (pat.hat[i] && this.patIntensity >= 1 && this.liveVoices < cap) this.playHat(t, mg);
    }
    countVoice(end) {
        this.voiceEnds.push(end);
        this.liveVoices++;
    }
    /** kick — sine 150→50Hz pitch drop, 0.12s */ playKick(t, mg) {
        const ctx = this.ctx;
        if (!ctx || !this.master) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);
        g.gain.setValueAtTime(0.55 * mg, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(this.master);
        osc.start(t);
        osc.stop(t + 0.14);
        this.countVoice(t + 0.14);
    }
    /** bass — triangle through the one shared lowpass (400Hz) */ playBass(t, hz, mg) {
        const ctx = this.ctx;
        if (!ctx || !this.master || !this.bassFilter) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = hz;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.2 * mg, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g);
        g.connect(this.bassFilter);
        osc.start(t);
        osc.stop(t + 0.32);
        this.countVoice(t + 0.32);
    }
    /** lead — kalimba/marimba feel: sine + 2nd harmonic at lower gain, short pluck decay */ playLead(t, hz, mg) {
        const ctx = this.ctx;
        if (!ctx || !this.master) return;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = hz;
        const harm = ctx.createOscillator();
        harm.type = 'sine';
        harm.frequency.value = hz * 2;
        const hGain = ctx.createGain();
        hGain.gain.value = 0.35;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.16 * mg, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(g);
        harm.connect(hGain);
        hGain.connect(g);
        g.connect(this.master);
        osc.start(t);
        harm.start(t);
        osc.stop(t + 0.38);
        harm.stop(t + 0.38);
        this.countVoice(t + 0.38);
    }
    /** hat — short white-noise burst through the one shared highpass (6kHz), quiet */ playHat(t, mg) {
        const ctx = this.ctx;
        if (!ctx || !this.master || !this.hatFilter || !this.noiseBuf) return;
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.06 * mg, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        src.connect(g);
        g.connect(this.hatFilter);
        src.start(t, Math.random() * 1.2);
        src.stop(t + 0.05);
        this.countVoice(t + 0.05);
    }
    /** shaker — bandpass noise (2kHz) with a two-bump tremolo "shake" envelope */ playShaker(t, mg) {
        const ctx = this.ctx;
        if (!ctx || !this.master || !this.shakerFilter || !this.noiseBuf) return;
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.045 * mg, t + 0.015);
        g.gain.linearRampToValueAtTime(0.012 * mg, t + 0.032);
        g.gain.linearRampToValueAtTime(0.04 * mg, t + 0.048);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
        src.connect(g);
        g.connect(this.shakerFilter);
        src.start(t, Math.random() * 1.2);
        src.stop(t + 0.09);
        this.countVoice(t + 0.09);
    }
}
const music = new MusicEngine();
function moodForTimeOfDay(t) {
    return t;
}
}),
"[project]/src/game/systems/device.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M7: RUN ON ANY DEVICE
 * ------------------------------------
 * Pure, deterministic device intelligence. This module is the LAW for
 * how the game looks on every phone, laptop and potato it meets:
 *
 *   signals  →  tier (low / mid / high)  →  render preset  →  live tuning
 *
 * Every decision is a named rule with a reason string (shown in the
 * settings UI — the player deserves to know WHY their game looks the
 * way it does), and every function takes its world as arguments so the
 * whole file tests without a browser.
 *
 * The companion hooks in here:
 *   - probeWebGL()      can the device do 3D at all? which GPU?
 *   - nextDynRes()      the dynamic-resolution hysteresis law — drops
 *                       render resolution under sustained frame stress,
 *                       climbs back when there is headroom, never
 *                       oscillates.
 */ /* --------------------------------- signals ---------------------------------- */ /** Everything detection needs, gathered from ONE device. All optional —
 *  Safari hides most of these, and the law must still hold. */ __turbopack_context__.s([
    "DYNRES",
    ()=>DYNRES,
    "QUALITY_PRESETS",
    ()=>QUALITY_PRESETS,
    "buildProfile",
    ()=>buildProfile,
    "detectTier",
    ()=>detectTier,
    "deviceLine",
    ()=>deviceLine,
    "extrasVerdict",
    ()=>extrasVerdict,
    "getDeviceProfile",
    ()=>getDeviceProfile,
    "nextDynRes",
    ()=>nextDynRes,
    "probeWebGL",
    ()=>probeWebGL,
    "readDeviceSignals",
    ()=>readDeviceSignals,
    "refreshDeviceProfile",
    ()=>refreshDeviceProfile,
    "resetDeviceProfile",
    ()=>resetDeviceProfile,
    "resolveQuality",
    ()=>resolveQuality
]);
const SOFTWARE_GPU = /swiftshader|llvmpipe|softpipe|software|basic ?render/i;
function detectTier(s) {
    if (!s.webgl1) return {
        tier: 'low',
        reasons: [
            'no WebGL — the game runs in Map Mode'
        ]
    };
    if (SOFTWARE_GPU.test(s.gpu)) {
        return {
            tier: 'low',
            reasons: [
                `software GPU (${s.gpu.slice(0, 40)})`
            ]
        };
    }
    if (s.memoryGB > 0 && s.memoryGB <= 2) return {
        tier: 'low',
        reasons: [
            `~${s.memoryGB}GB RAM`
        ]
    };
    if (s.cores > 0 && s.cores <= 2) return {
        tier: 'low',
        reasons: [
            `${s.cores} cores`
        ]
    };
    if (s.memoryGB >= 6 && s.cores >= 6) {
        return {
            tier: 'high',
            reasons: [
                `${s.memoryGB}GB RAM · ${s.cores} cores`
            ]
        };
    }
    if (!s.coarsePointer && !s.mobileUA && s.cores >= 4 && (s.memoryGB === 0 || s.memoryGB >= 4)) {
        return {
            tier: 'high',
            reasons: [
                `${s.cores} cores · desktop`
            ]
        };
    }
    if (s.memoryGB > 0 && s.memoryGB <= 4) return {
        tier: 'mid',
        reasons: [
            `~${s.memoryGB}GB RAM`
        ]
    };
    if (s.cores > 0 && s.cores <= 4) return {
        tier: 'mid',
        reasons: [
            `${s.cores} cores`
        ]
    };
    if (s.coarsePointer || s.mobileUA) {
        return {
            tier: 'mid',
            reasons: [
                'touch device — specs hidden, safe middle'
            ]
        };
    }
    return {
        tier: 'mid',
        reasons: [
            'unknown specs — safe middle'
        ]
    };
}
const QUALITY_PRESETS = {
    high: {
        shadows: true,
        antialias: true,
        dprCap: 1.75,
        dprFloor: 1.0,
        far: 900,
        frameHz: 0,
        fogPush: 0
    },
    mid: {
        shadows: false,
        antialias: true,
        dprCap: 1.4,
        dprFloor: 0.85,
        far: 820,
        frameHz: 0,
        fogPush: 0
    },
    low: {
        shadows: false,
        antialias: false,
        dprCap: 1.05,
        dprFloor: 0.65,
        far: 720,
        frameHz: 30,
        fogPush: 0.12
    }
};
function resolveQuality(setting, tier) {
    return setting === 'auto' ? tier : setting;
}
function extrasVerdict(tier, p95ms, dynresDir) {
    if (tier === 'low') return 0 // the tier gate law: low receives base beauty only
    ;
    if (p95ms !== null && p95ms >= DYNRES.hotP95) return 0 // struggling right now — strip to floor
    ;
    if (dynresDir === 'hot') return 0 // the governor is already walking down — yield early
    ;
    if (p95ms !== null && p95ms >= 32) return 1 // warm — keep mid polish only
    ;
    if (dynresDir === 'steady' && p95ms !== null && p95ms > 26) return 1 // hovering — hold mid
    ;
    return 2 // comfortable — the full show
    ;
}
const DYNRES = {
    /** evaluate every ~2s (the HUD chip's cadence) */ sampleMs: 2000,
    /** sustained p95 above this = the device is struggling */ hotP95: 40,
    /** p95 under this = headroom, may climb back */ coolP95: 22,
    /** hot dwell before dropping a step (ignore one-off hitches) */ hotDwellMs: 4000,
    /** cool dwell before climbing a step (longer — flapping looks worse than sag) */ coolDwellMs: 8000,
    stepDown: 0.15,
    stepUp: 0.1
};
function nextDynRes(state, sample, b) {
    const { hotP95, coolP95, hotDwellMs, coolDwellMs, stepDown, stepUp } = DYNRES;
    // --- heating ---------------------------------------------------------------
    if (sample.p95ms > hotP95) {
        const since = state.dir === 'hot' ? state.sinceMs + DYNRES.sampleMs : 0;
        if (since >= hotDwellMs && state.cap > b.floor) {
            const cap = Math.max(b.floor, round2(state.cap - stepDown));
            return {
                state: {
                    cap,
                    dir: 'steady',
                    sinceMs: 0,
                    changes: state.changes + 1
                },
                action: 'drop',
                reason: `p95 ${sample.p95ms.toFixed(0)}ms → cap ${cap.toFixed(2)}`
            };
        }
        return {
            state: {
                ...state,
                dir: 'hot',
                sinceMs: since
            },
            action: 'hold',
            reason: `hot ${since}ms`
        };
    }
    // --- cooling ---------------------------------------------------------------
    if (sample.p95ms < coolP95) {
        const since = state.dir === 'cool' ? state.sinceMs + DYNRES.sampleMs : 0;
        if (since >= coolDwellMs && state.cap < b.initialCap) {
            const cap = Math.min(b.initialCap, round2(state.cap + stepUp));
            return {
                state: {
                    cap,
                    dir: 'steady',
                    sinceMs: 0,
                    changes: state.changes + 1
                },
                action: 'raise',
                reason: `p95 ${sample.p95ms.toFixed(0)}ms → cap ${cap.toFixed(2)}`
            };
        }
        return {
            state: {
                ...state,
                dir: 'cool',
                sinceMs: since
            },
            action: 'hold',
            reason: `cool ${since}ms`
        };
    }
    // --- steady band (nothing acts between 22-40ms — that IS the target) --------
    return {
        state: {
            ...state,
            dir: 'steady',
            sinceMs: 0
        },
        action: 'hold',
        reason: 'steady'
    };
}
function round2(n) {
    return Math.round(n * 100) / 100;
}
const GL_CONTEXTS = [
    'webgl2',
    'webgl'
];
const UNMASKED = 0x9246 // UNMASKED_RENDERER_WEBGL constant (avoids a GL header import)
;
function probeWebGL(createCtx = defaultGlFactory) {
    const out = {
        webgl1: false,
        webgl2: false,
        gpu: ''
    };
    for (const type of GL_CONTEXTS){
        try {
            const gl = createCtx(type);
            if (!gl) continue;
            if (type === 'webgl2') out.webgl2 = true;
            else out.webgl1 = true;
            if (!out.gpu) {
                try {
                    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                    const name = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(UNMASKED);
                    out.gpu = typeof name === 'string' ? name : '';
                } catch  {
                /* GPU name is a nicety, never a requirement */ }
            }
            lose(gl);
        } catch  {
        /* context creation threw — treat as unsupported for this type */ }
    }
    return out;
}
function lose(gl) {
    try {
        ;
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch  {
    /* best effort */ }
}
function defaultGlFactory(type) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    return canvas.getContext(type);
}
function readDeviceSignals() {
    let cores = 0;
    let memoryGB = 0;
    let coarsePointer = false;
    let mobileUA = false;
    let gl = {
        webgl1: true,
        webgl2: true,
        gpu: ''
    } // assume yes when probe impossible — never block on this
    ;
    try {
        if (typeof navigator !== 'undefined') {
            const nav = navigator;
            cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 0;
            memoryGB = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : 0;
            mobileUA = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
            try {
                coarsePointer = window.matchMedia('(pointer: coarse)').matches;
            } catch  {
            /* matchMedia can throw in exotic embeds */ }
        }
        gl = probeWebGL();
    } catch  {
    /* signals are best-effort */ }
    return {
        cores,
        memoryGB,
        gpu: gl.gpu,
        coarsePointer,
        mobileUA,
        webgl1: gl.webgl1,
        webgl2: gl.webgl2
    };
}
let cached = null;
function buildProfile(signals, setting) {
    const verdict = detectTier(signals);
    const effective = resolveQuality(setting, verdict.tier);
    return {
        tier: verdict.tier,
        reasons: verdict.reasons,
        preset: QUALITY_PRESETS[effective],
        setting,
        effective,
        gl: {
            webgl1: signals.webgl1,
            webgl2: signals.webgl2,
            gpu: signals.gpu
        }
    };
}
function getDeviceProfile(setting = 'auto') {
    if (cached && cached.setting === setting) return cached;
    cached = buildProfile(readDeviceSignals(), setting);
    return cached;
}
function refreshDeviceProfile(setting) {
    cached = buildProfile(readDeviceSignals(), setting);
    return cached;
}
function resetDeviceProfile() {
    cached = null;
}
function deviceLine(p) {
    const gl = p.gl.webgl2 ? 'WebGL2' : p.gl.webgl1 ? 'WebGL1' : 'no WebGL';
    const gpu = p.gl.gpu ? p.gl.gpu.slice(0, 32) : 'gpu hidden';
    return `${p.effective.toUpperCase()} tier (${p.setting}) · ${gl} · ${gpu}${p.reasons.length ? ` · ${p.reasons[0]}` : ''}`;
}
}),
"[project]/src/game/store/menu-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "menuSetScreen",
    ()=>menuSetScreen,
    "useMenuStore",
    ()=>useMenuStore
]);
/**
 * LOKOJA LIFE — THE MENU STORE (SILK II deferred work #2: the store slice)
 * ------------------------------------------------------------------------
 * The audit found the entry chunk carrying the ENTIRE 213KB game store for
 * the menu's five values. This module is the slice: screen, boot, hasSave,
 * settings — and NOTHING else. It statically imports only the save system
 * and the small engines (audio/haptics/music/device); the fat game store
 * (`useGameStore.ts`, every slice and every action) is reached through
 * DYNAMIC imports inside the click handlers, so the menu never pays for
 * the game and the game never disagrees with the menu.
 *
 * THE OWNERSHIP LAW:
 *  - `screen` is OWNED here. The fat store MIRRORS it via a subscription
 *    wired in its own module scope, and every fat screen write routes
 *    through `setScreen` — one writer, one mirror, zero drift.
 *  - `settings` are DISK truth at every boundary: menu toggles patch the
 *    save directly (`SaveSystem.patchSettings` — the same primitive the
 *    fat store uses when autosave is dormant); returning to the game and
 *    back re-reads the disk (`refreshFromDisk`, called by returnToMenu).
 *  - `continueGame`/`resetGame` delegate into the fat store at click time —
 *    by then the dashboard preload has usually already fetched it.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/save.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/music.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const DEFAULT_SETTINGS = {
    sound: true,
    graphics: 'auto',
    chill: false,
    elder: false,
    music: false,
    haptics: true
};
const useMenuStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        screen: 'menu',
        booted: false,
        hasSave: false,
        settings: {
            ...DEFAULT_SETTINGS
        },
        boot: ()=>{
            const save = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].load();
            const settings = save?.settings ?? {
                ...DEFAULT_SETTINGS
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncAudioWithSettings"])(settings);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["haptics"].setEnabled(settings.haptics);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["haptics"].setElder(settings.elder);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["music"].setEnabled(settings.sound && settings.music);
            set({
                booted: true,
                hasSave: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].hasSave(),
                settings
            });
        },
        setScreen: (screen)=>set({
                screen
            }),
        toggleSound: ()=>{
            const settings = {
                ...get().settings,
                sound: !get().settings.sound
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncAudioWithSettings"])(settings);
            set({
                settings
            });
            // the debounced autosave only runs inside a live game — on the menu, patch the save directly
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
            // if a live session exists in memory, bring it along (the fat chunk is
            // already loaded in that case — the import resolves instantly)
            void __turbopack_context__.A("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript, async loader)").then((m)=>{
                const gs = m.useGameStore.getState();
                if (gs.player) m.useGameStore.setState({
                    settings
                });
            }).catch(()=>{});
        },
        setGraphics: (q)=>{
            const settings = {
                ...get().settings,
                graphics: q
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["refreshDeviceProfile"])(q); // the session profile re-resolves against the pick
            set({
                settings
            });
            // M7: a pick made on the MAIN MENU must survive — autosave is dormant there
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
            void __turbopack_context__.A("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript, async loader)").then((m)=>{
                const gs = m.useGameStore.getState();
                if (gs.player) m.useGameStore.setState({
                    settings
                });
            }).catch(()=>{});
        },
        refreshFromDisk: ()=>{
            const save = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].load();
            set({
                hasSave: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].hasSave(),
                settings: save?.settings ?? get().settings
            });
        },
        continueGame: async ()=>{
            const { useGameStore } = await __turbopack_context__.A("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript, async loader)");
            const ok = useGameStore.getState().continueGame();
            if (ok) get().setScreen('game');
            return ok;
        },
        resetGame: async ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SaveSystem"].clear();
            set({
                hasSave: false
            });
            try {
                const { useGameStore } = await __turbopack_context__.A("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript, async loader)");
                useGameStore.getState().resetGame();
            } catch  {
            /* the fat chunk not being loaded is fine — the disk is already clean */ }
        }
    }));
const menuSetScreen = (s)=>useMenuStore.getState().setScreen(s);
}),
"[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Icon system (R1)
 * ------------------------------
 * One coherent, hand-drawn SVG icon set for the whole game.
 * • 24×24 grid, 1.9px rounded strokes, currentColor — tinted by context.
 * • Replaces oversized emoji previously used as interface art (nav, needs,
 *   skills, jobs, places, transport). Emojis stay only where they are
 *   game-world flavour (NPC chat messages, food items, toasts).
 */ __turbopack_context__.s([
    "AlertIcon",
    ()=>AlertIcon,
    "ArrowLeftIcon",
    ()=>ArrowLeftIcon,
    "ArrowRightIcon",
    ()=>ArrowRightIcon,
    "BagIcon",
    ()=>BagIcon,
    "BankIcon",
    ()=>BankIcon,
    "BasketIcon",
    ()=>BasketIcon,
    "BoxIcon",
    ()=>BoxIcon,
    "BroomIcon",
    ()=>BroomIcon,
    "CameraIcon",
    ()=>CameraIcon,
    "CheckIcon",
    ()=>CheckIcon,
    "ChevronRightIcon",
    ()=>ChevronRightIcon,
    "ClockIcon",
    ()=>ClockIcon,
    "CloudIcon",
    ()=>CloudIcon,
    "CoinsIcon",
    ()=>CoinsIcon,
    "CompassIcon",
    ()=>CompassIcon,
    "ConfluenceIcon",
    ()=>ConfluenceIcon,
    "DiceIcon",
    ()=>DiceIcon,
    "EnergyIcon",
    ()=>EnergyIcon,
    "ExitIcon",
    ()=>ExitIcon,
    "FireIcon",
    ()=>FireIcon,
    "FishIcon",
    ()=>FishIcon,
    "FoodIcon",
    ()=>FoodIcon,
    "GradCapIcon",
    ()=>GradCapIcon,
    "HealthIcon",
    ()=>HealthIcon,
    "HomeIcon",
    ()=>HomeIcon,
    "HourglassIcon",
    ()=>HourglassIcon,
    "HustleIcon",
    ()=>HustleIcon,
    "JobIcon",
    ()=>JobIcon,
    "KekeIcon",
    ()=>KekeIcon,
    "LandmarkIcon",
    ()=>LandmarkIcon,
    "LockIcon",
    ()=>LockIcon,
    "MapIcon",
    ()=>MapIcon,
    "MoodIcon",
    ()=>MoodIcon,
    "MoonIcon",
    ()=>MoonIcon,
    "MountainIcon",
    ()=>MountainIcon,
    "NavIcon",
    ()=>NavIcon,
    "NeedIcon",
    ()=>NeedIcon,
    "OfficeIcon",
    ()=>OfficeIcon,
    "PhoneIcon",
    ()=>PhoneIcon,
    "PinIcon",
    ()=>PinIcon,
    "PlaceIcon",
    ()=>PlaceIcon,
    "PotIcon",
    ()=>PotIcon,
    "ProfileIcon",
    ()=>ProfileIcon,
    "RainIcon",
    ()=>RainIcon,
    "SaveIcon",
    ()=>SaveIcon,
    "SearchIcon",
    ()=>SearchIcon,
    "SettingsIcon",
    ()=>SettingsIcon,
    "ShieldIcon",
    ()=>ShieldIcon,
    "ShopIcon",
    ()=>ShopIcon,
    "SignpostIcon",
    ()=>SignpostIcon,
    "SkillIcon",
    ()=>SkillIcon,
    "SmartIcon",
    ()=>SmartIcon,
    "SocialIcon",
    ()=>SocialIcon,
    "SoundIcon",
    ()=>SoundIcon,
    "SparkleIcon",
    ()=>SparkleIcon,
    "StallIcon",
    ()=>StallIcon,
    "StarIcon",
    ()=>StarIcon,
    "SteeringIcon",
    ()=>SteeringIcon,
    "SunIcon",
    ()=>SunIcon,
    "SunriseIcon",
    ()=>SunriseIcon,
    "SunsetIcon",
    ()=>SunsetIcon,
    "TargetIcon",
    ()=>TargetIcon,
    "TaxiIcon",
    ()=>TaxiIcon,
    "ThumbsUpIcon",
    ()=>ThumbsUpIcon,
    "TimeIcon",
    ()=>TimeIcon,
    "TransportIcon",
    ()=>TransportIcon,
    "TrashIcon",
    ()=>TrashIcon,
    "TrendDownIcon",
    ()=>TrendDownIcon,
    "TrendUpIcon",
    ()=>TrendUpIcon,
    "WalkIcon",
    ()=>WalkIcon,
    "WeatherIcon",
    ()=>WeatherIcon,
    "WorkIcon",
    ()=>WorkIcon,
    "WorldIcon",
    ()=>WorldIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function Svg({ size = 20, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.9,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        focusable: "false",
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
function HomeIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 10.5 12 4l8 6.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 9.5V20h12V9.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 20v-5h4v5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
function MapIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 4v14M15 6v14"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
function WorldIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.8 12h16.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3.8c2.5 2.3 3.8 5.1 3.8 8.2s-1.3 5.9-3.8 8.2c-2.5-2.3-3.8-5.1-3.8-8.2s1.3-5.9 3.8-8.2Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
function WorkIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3.5",
                y: "7.5",
                width: "17",
                height: "12",
                rx: "2.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.5 12.5h17"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.5 12.5v2h3v-2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
function BagIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 8.5a5 5 0 0 1 10 0"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "4",
                y: "8.5",
                width: "16",
                height: "11.5",
                rx: "3"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 12.5h6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
function ProfileIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "8.2",
                r: "3.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 20c.8-3.4 3.6-5.3 7-5.3s6.2 1.9 7 5.3"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
function PhoneIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "7",
                y: "2.8",
                width: "10",
                height: "18.4",
                rx: "2.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.4 5.2h3.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 18.6h2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
function HealthIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 20s-7.2-4.4-8.8-9.1C2.1 7.7 4 5 6.9 5c2 0 3.6 1.1 5.1 3 1.5-1.9 3-3 5.1-3 2.9 0 4.8 2.7 3.7 5.9C19.2 15.6 12 20 12 20Z"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
function EnergyIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
function FoodIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 11h16a8 8 0 0 1-16 0Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 7.5c0-1 .8-1.2.8-2M13.7 7.5c0-1 .8-1.2.8-2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 20h12"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
function MoodIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 10h.01M15 10h.01",
                strokeWidth: 2.4
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.6 14.2c.9 1.1 2 1.7 3.4 1.7s2.5-.6 3.4-1.7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
function HustleIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.5 6.5 17 4l3 3-2.5 2.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13 8 4.5 16.5 7.5 19.5 16 11"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12.5 5.5 15 8",
                transform: "translate(1.5 1.5)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m15 9 1.5 1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
function SmartIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 18.5c-1.8 1-4.5 1-5.5.5V5c1 .5 3.7.5 5.5-.5 1.8 1 4.5 1 5.5.5v14c-1 .5-3.7.5-5.5-.5Z",
                transform: "translate(3.5 0)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 18.5c-1.8 1-4.5 1-5.5.5V5c1 .5 3.7.5 5.5-.5 1.8 1 4.5 1 5.5.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
function SocialIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3H6.5A2.5 2.5 0 0 1 4 10.5v-4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.5 9.5c1.4.3 2.5 1.5 2.5 3v3.2c0 1.7-1.4 3.1-3 3.1H16v2.2L13 18.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
function SunIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "4.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
function CloudIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M7 18a4 4 0 0 1-.6-7.9A5.5 5.5 0 0 1 17 9.6 3.8 3.8 0 0 1 17.5 18H7Z"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 191,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, this);
}
function RainIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 14a4 4 0 0 1-.6-7.9A5.5 5.5 0 0 1 17 5.6 3.8 3.8 0 0 1 17.5 14H7Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 17l-.8 2.4M13 17l-.8 2.4M17 17l-.8 2.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
function MoonIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19.5 14.5A8 8 0 0 1 9.5 4.6a8 8 0 1 0 10 9.9Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16.8 4.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z",
                fill: "currentColor",
                strokeWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
function SunriseIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7.5 15a4.5 4.5 0 0 1 9 0"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 4.5V7M5.2 8.2l1.4 1.4M18.8 8.2l-1.4 1.4M3 15h2M19 15h2M4 19h16"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
function SunsetIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7.5 13a4.5 4.5 0 0 1 9 0"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7V4.5M5.2 6.2l1.4 1.4M18.8 6.2l-1.4 1.4M3 13h2M19 13h2M4 18.5h16"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
function ClockIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7.5V12l3 2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
function StallIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 4h16l1 4a2.6 2.6 0 0 1-5.2 0 2.6 2.6 0 0 1-5.2 0 2.6 2.6 0 0 1-5.2 0L4 4Z",
                transform: "translate(1 0) scale(0.92)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.5 11v9h13v-9"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 20v-5h4v5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
function SignpostIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3v18"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 5h6.5l2 2.5-2 2.5H12V5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 12H5.5l-2 2.5 2 2.5H12V12Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 255,
        columnNumber: 5
    }, this);
}
function ConfluenceIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 6c4 0 6 2.4 8 6s4 6 8 6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 6c-4 0-6 2.4-8 6s-4 6-8 6",
                opacity: 0.55
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 265,
        columnNumber: 5
    }, this);
}
function MountainIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m3 19 6-10 4 6 2.5-3.5L21 19H3Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 9V5.5l2.4 1-2.4 1",
                fill: "currentColor",
                strokeWidth: 1.4
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 274,
        columnNumber: 5
    }, this);
}
function LandmarkIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 9.5 12 5l8 4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 284,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.5 10.5V17M9.8 10.5V17M14.2 10.5V17M18.5 10.5V17"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 19.5h16M4 17h16"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 286,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 283,
        columnNumber: 5
    }, this);
}
function OfficeIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "5",
                y: "4",
                width: "14",
                height: "16",
                rx: "1.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
function GradCapIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m2.8 9.5 9.2-4 9.2 4-9.2 4-9.2-4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.5 11.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 9.5v4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 302,
        columnNumber: 5
    }, this);
}
function ShieldIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2.8 4.5 5.6v5.2c0 4.6 3 8.8 7.5 10.4 4.5-1.6 7.5-5.8 7.5-10.4V5.6L12 2.8Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10.2",
                r: "1.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 11.8v3.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}
function PotIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.5 10.5h15v3.5a5.5 5.5 0 0 1-5.5 5.5h-4a5.5 5.5 0 0 1-5.5-5.5v-3.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 10.5h18"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 7.5c0-1 .8-1.2.8-2M13.7 7.5c0-1 .8-1.2.8-2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 326,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 323,
        columnNumber: 5
    }, this);
}
function TaxiIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 13.5 6.6 9a2 2 0 0 1 1.9-1.4h7A2 2 0 0 1 17.4 9L19 13.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3.5",
                y: "13.5",
                width: "17",
                height: "5.5",
                rx: "1.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 335,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 19v1.6M17 19v1.6M6.8 16.2h.01M17.2 16.2h.01",
                strokeWidth: 2.2
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.5 7.5V6a1.2 1.2 0 0 1 1.2-1.2h.6a1.2 1.2 0 0 1 1.2 1.2v1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 333,
        columnNumber: 5
    }, this);
}
function WalkIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "13",
                cy: "4.6",
                r: "1.9"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 347,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 21l2.2-5.5-2.4-2.5 1.4-5 3.3 1.6 2.5 2.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.7 8 8 10.5l-.6 3M13 15.5 14.5 21"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 346,
        columnNumber: 5
    }, this);
}
function KekeIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.5 15.5v-2A7.5 7.5 0 0 1 12 6h1a6 6 0 0 1 6 6v3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.5 13.5h9.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 358,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "7",
                cy: "17",
                r: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 359,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "17",
                cy: "17",
                r: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 360,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11.5 6.2 10 3.5h3.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 361,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 356,
        columnNumber: 5
    }, this);
}
function BasketIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 9.5h16l-1.6 8a2.4 2.4 0 0 1-2.4 2H8a2.4 2.4 0 0 1-2.4-2L4 9.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m8.5 9.5 2-5M15.5 9.5l-2-5M9.8 13v3.2M14.2 13v3.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 372,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 370,
        columnNumber: 5
    }, this);
}
function BoxIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3 20 7v10l-8 4-8-4V7l8-4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.4 7.2 12 11l7.6-3.8M12 11v9.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 381,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 379,
        columnNumber: 5
    }, this);
}
function SteeringIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 11c2.5 1 5.3 1.6 8 1.6s5.5-.6 8-1.6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 14.5 9 19.6M13 14.5l2 5.1"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
function FishIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 12c2.6-3.4 6-5 9.2-5 3 0 5.6 1.6 7.8 5-2.2 3.4-4.8 5-7.8 5C9 17 5.6 15.4 3 12Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 400,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 12c1.5 1 3 1.5 4.6 1.7M20 12l1.6-2.6M20 12l1.6 2.6",
                transform: "translate(-1 0)"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 10.8h.01",
                strokeWidth: 2.4
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 402,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 399,
        columnNumber: 5
    }, this);
}
function CameraIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3.5",
                y: "7",
                width: "17",
                height: "12.5",
                rx: "2.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 410,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 7 10 4.5h4L15.5 7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "13",
                r: "3.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 412,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.5 10h.01",
                strokeWidth: 2.4
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 413,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 409,
        columnNumber: 5
    }, this);
}
function ShopIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.5 9 6 4h12l1.5 5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 421,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.5 9v11h13V9"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9",
                y: "13",
                width: "6",
                height: "7",
                rx: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 420,
        columnNumber: 5
    }, this);
}
function BroomIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m13.5 10 5-7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 431,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13 9.8c-3 .5-5.6 2.4-7.3 5.4L4 18.5l7.5-1.7c3-.7 5.2-2.8 6-5.8l-4.5-1.2Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 432,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 430,
        columnNumber: 5
    }, this);
}
function CompassIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "8.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 440,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m15.5 8.5-2 5-5 2 2-5 5-2Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 441,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 439,
        columnNumber: 5
    }, this);
}
function BankIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 9 12 4.5 20 9"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.5 9.5V17M10 9.5V17M14 9.5V17M18.5 9.5V17"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 450,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 19.5h16"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 451,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 448,
        columnNumber: 5
    }, this);
}
function TrendUpIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 17l5.5-5.5 3.5 3.5L20 8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 459,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.5 8H20v4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 460,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 458,
        columnNumber: 5
    }, this);
}
function PinIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21s-6.5-5.4-6.5-10.2A6.4 6.4 0 0 1 12 4.5a6.4 6.4 0 0 1 6.5 6.3C18.5 15.6 12 21 12 21Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 470,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10.6",
                r: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 471,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 469,
        columnNumber: 5
    }, this);
}
function StarIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4Z"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 479,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 478,
        columnNumber: 5
    }, this);
}
function LockIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "5.5",
                y: "10.5",
                width: "13",
                height: "9",
                rx: "2.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 487,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 14v2.4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 486,
        columnNumber: 5
    }, this);
}
function CheckIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m5 12.5 4.5 4.5L19 7.5"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 497,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 496,
        columnNumber: 5
    }, this);
}
function ChevronRightIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m9.5 5.5 6.5 6.5-6.5 6.5"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 505,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 504,
        columnNumber: 5
    }, this);
}
function ArrowLeftIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M19 12H5M11 6l-6 6 6 6"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 513,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 512,
        columnNumber: 5
    }, this);
}
function ArrowRightIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M5 12h14M13 6l6 6-6 6"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 521,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 520,
        columnNumber: 5
    }, this);
}
function SearchIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "11",
                cy: "11",
                r: "6.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 529,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m16 16 4.5 4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 530,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 528,
        columnNumber: 5
    }, this);
}
function DiceIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "4",
                y: "4",
                width: "16",
                height: "16",
                rx: "3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.8 8.8h.01M15.2 8.8h.01M12 12h.01M8.8 15.2h.01M15.2 15.2h.01",
                strokeWidth: 2.5
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 539,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 537,
        columnNumber: 5
    }, this);
}
function SparkleIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 4.5 13.8 10l5.5 1.8-5.5 1.8L12 19.5l-1.8-5.9L4.7 11.8 10.2 10 12 4.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 4.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z",
                fill: "currentColor",
                strokeWidth: 1
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 548,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 546,
        columnNumber: 5
    }, this);
}
function TargetIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "7.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 557,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "1",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 558,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 555,
        columnNumber: 5
    }, this);
}
function HourglassIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M7 4h10M7 20h10M8 4c0 4 3 5 4 8-1 3-4 4-4 8M16 4c0 4-3 5-4 8 1 3 4 4 4 8"
        }, void 0, false, {
            fileName: "[project]/src/components/game/icons.tsx",
            lineNumber: 566,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 565,
        columnNumber: 5
    }, this);
}
function CoinsIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "9",
                cy: "7.5",
                rx: "5.5",
                ry: "2.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 574,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.5 7.5v4c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 575,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 14.4v2.1c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4c0-1.3-1.6-2.4-3.8-2.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 576,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 573,
        columnNumber: 5
    }, this);
}
function TrendDownIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 7l5.5 5.5 3.5-3.5L20 16"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 584,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.5 16H20v-4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 583,
        columnNumber: 5
    }, this);
}
function SoundIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 9.5v5h3.5L12 19V5L7.5 9.5H4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 593,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.5 9c1 .8 1.6 1.8 1.6 3s-.6 2.2-1.6 3M18 6.5c1.7 1.3 2.7 3.2 2.7 5.5s-1 4.2-2.7 5.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 594,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 592,
        columnNumber: 5
    }, this);
}
function SaveIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 4.5h11L19.5 8v11.5h-15V4.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 602,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 4.5V9h7V4.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 603,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "8",
                y: "13",
                width: "8",
                height: "6.5",
                rx: "0.8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 604,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 601,
        columnNumber: 5
    }, this);
}
function ExitIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.5 4.5h-8v15h8"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 613,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 611,
        columnNumber: 5
    }, this);
}
function SettingsIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3.2"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 621,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3.2v2.3M12 18.5v2.3M4.9 7.9l2 1.15M17.1 15l2 1.15M4.9 16.1l2-1.15M17.1 9l2-1.15"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 622,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 620,
        columnNumber: 5
    }, this);
}
function TrashIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 630,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.5 6.5 7.4 19c.1 1 .9 1.5 1.8 1.5h5.6c.9 0 1.7-.5 1.8-1.5l.9-12.5"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 631,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 10.5v6M14 10.5v6"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 632,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 629,
        columnNumber: 5
    }, this);
}
function AlertIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 4 21 19.5H3L12 4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 640,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 10v4M12 16.8h.01",
                strokeWidth: 2.3
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 641,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 639,
        columnNumber: 5
    }, this);
}
function ThumbsUpIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 11v9H4.5a.5.5 0 0 1-.5-.5V11.5a.5.5 0 0 1 .5-.5H7Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 649,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 11.5 11 3.5c1.6 0 2.6 1 2.6 2.4 0 .9-.6 2.6-1 3.6h5.6c1.1 0 1.9 1 1.6 2.1l-1.6 6.4a2 2 0 0 1-1.9 1.5H7"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 650,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 648,
        columnNumber: 5
    }, this);
}
function FireIcon(p) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Svg, {
        ...p,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21c-3.6 0-6-2.3-6-5.6 0-2.4 1.5-4.4 3-6.4.4 1 1.1 1.9 2 2.3C11 8.6 11.4 5.4 14 3c-.3 2.3.6 3.6 1.9 5.2 1.3 1.7 2.1 3.4 2.1 5.4 0 4.1-2.4 7.4-6 7.4Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 658,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 21c-1.4 0-2.4-1-2.4-2.5 0-1.6 1.4-2.5 2.4-4.3 1 1.8 2.4 2.7 2.4 4.3 0 1.5-1 2.5-2.4 2.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/game/icons.tsx",
                lineNumber: 659,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 657,
        columnNumber: 5
    }, this);
}
const NAV_ICONS = {
    home: HomeIcon,
    world: WorldIcon,
    map: MapIcon,
    work: WorkIcon,
    phone: PhoneIcon,
    bag: BagIcon,
    profile: ProfileIcon
};
function NavIcon({ name, ...p }) {
    const C = NAV_ICONS[name];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 680,
        columnNumber: 10
    }, this);
}
const NEED_ICONS = {
    health: HealthIcon,
    energy: EnergyIcon,
    hunger: FoodIcon,
    mood: MoodIcon
};
function NeedIcon({ name, ...p }) {
    const C = NEED_ICONS[name];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 696,
        columnNumber: 10
    }, this);
}
const SKILL_ICONS = {
    hustle: HustleIcon,
    smart: SmartIcon,
    social: SocialIcon
};
function SkillIcon({ name, ...p }) {
    const C = SKILL_ICONS[name];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 711,
        columnNumber: 10
    }, this);
}
const WEATHER_ICONS = {
    sunny: SunIcon,
    cloudy: CloudIcon,
    rain: RainIcon,
    'night-clear': MoonIcon,
    // M6 — the living sky: harmattan reads as a hazy sun, a thunderstorm as
    // heavy rain, a flood day as the water that owns the riverfront
    harmattan: SunIcon,
    storm: RainIcon,
    flood: ConfluenceIcon
};
function WeatherIcon({ name, ...p }) {
    const C = WEATHER_ICONS[name];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 732,
        columnNumber: 10
    }, this);
}
const TIME_ICONS = {
    morning: SunriseIcon,
    afternoon: SunIcon,
    evening: SunsetIcon,
    night: MoonIcon
};
function TimeIcon({ name, ...p }) {
    const C = TIME_ICONS[name];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 748,
        columnNumber: 10
    }, this);
}
/* ------------------------------ place icons ----------------------------- */ const PLACE_ICONS = {
    home: HomeIcon,
    'kpata-market': StallIcon,
    'ganaja-junction': SignpostIcon,
    confluence: ConfluenceIcon,
    'mount-patti': MountainIcon,
    'historic-lokoja': LandmarkIcon,
    'government-area': OfficeIcon,
    'university-area': GradCapIcon,
    'food-area': PotIcon,
    'transport-area': TaxiIcon
};
function PlaceIcon({ id, ...p }) {
    const C = PLACE_ICONS[id] ?? PinIcon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 768,
        columnNumber: 10
    }, this);
}
/* ------------------------------- job icons ------------------------------ */ const JOB_ICONS = {
    'market-worker': BasketIcon,
    'delivery-worker': BoxIcon,
    driver: SteeringIcon,
    fisherman: FishIcon,
    photographer: CameraIcon,
    'shop-assistant': ShopIcon,
    cleaner: BroomIcon,
    'tour-guide': CompassIcon,
    'government-worker': BankIcon,
    entrepreneur: TrendUpIcon
};
function JobIcon({ id, ...p }) {
    const C = JOB_ICONS[id] ?? WorkIcon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 788,
        columnNumber: 10
    }, this);
}
const TRANSPORT_ICONS = {
    walk: WalkIcon,
    keke: KekeIcon,
    taxi: TaxiIcon
};
function TransportIcon({ name, ...p }) {
    const C = TRANSPORT_ICONS[name];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(C, {
        ...p
    }, void 0, false, {
        fileName: "[project]/src/components/game/icons.tsx",
        lineNumber: 803,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/components/ui/dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/components/ui/switch.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Switch",
    ()=>Switch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-switch/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function Switch({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "switch",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Thumb"], {
            "data-slot": "switch-thumb",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")
        }, void 0, false, {
            fileName: "[project]/src/components/ui/switch.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/switch.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/components/game/screens/GraphicsPicker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GraphicsPicker",
    ()=>GraphicsPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — M7 Graphics Picker
 * ---------------------------------
 * The one settings row that makes "run on any device" a promise the
 * player can see: Auto (trust the device law) or force Low / Mid / High.
 * Shows the device verdict underneath — WHAT this device is, and WHY it
 * got its tier — so the choice is informed, not superstitious. The pick
 * persists in the save (settings.graphics, v8) and is applied on the
 * next world entry.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const OPTIONS = [
    {
        value: 'auto',
        label: 'Auto'
    },
    {
        value: 'low',
        label: 'Low'
    },
    {
        value: 'mid',
        label: 'Mid'
    },
    {
        value: 'high',
        label: 'High'
    }
];
function GraphicsPicker() {
    /* SILK II — the picker reads the MENU SLICE (this dialog lives on the
   * menu; the pick patches the save on disk and the next world entry obeys) */ const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.settings);
    const setGraphics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.setGraphics);
    const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDeviceProfile"])(settings.graphics);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-black/[0.06] px-4 py-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm font-bold",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 24 24",
                        width: 16,
                        height: 16,
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: 1.9,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        "aria-hidden": true,
                        className: "text-[var(--lko-ink-soft)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M3.5 17.5 8 9.5l3.5 5 2.5-3.5 6.5 6.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M2.5 4.5h19v15h-19z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    "Graphics"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2.5 grid grid-cols-4 gap-1",
                role: "radiogroup",
                "aria-label": "Graphics quality",
                children: OPTIONS.map((o)=>{
                    const active = settings.graphics === o.value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        role: "radio",
                        "aria-checked": active,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                            setGraphics(o.value);
                        },
                        className: `lko-press min-h-[38px] rounded-lg border text-[12px] font-extrabold transition-colors ${active ? 'border-[var(--lko-green)] bg-[var(--lko-green)] text-white' : 'border-black/[0.08] bg-white text-[var(--lko-ink)]'}`,
                        children: o.label
                    }, o.value, false, {
                        fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-[11px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                "data-testid": "device-line",
                children: [
                    settings.graphics === 'auto' ? 'Auto · ' : '',
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deviceLine"])(profile),
                    !profile.gl.webgl1 && !profile.gl.webgl2 ? ' — the world opens in Map Mode' : ''
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-[10px] leading-relaxed text-[var(--lko-ink-soft)] opacity-75",
                children: "Applied on the next world entry. The game also tunes itself while you play — if frames sag, it quietly lowers render detail, and climbs back when there is headroom."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/GraphicsPicker.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/screens/MainMenu.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainMenu",
    ()=>MainMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — Main Menu (R2-ART)
 * ---------------------------------
 * The world IS the menu: a full-bleed original painted key art of Lokoja
 * (Mount Patti + the Niger–Benue confluence + a keke on the laterite road)
 * with a slow Ken Burns drift, so the first screen feels alive — you are
 * looking INTO a world you are about to enter, not reading a webpage.
 * R1's LivingScene continues to render the in-game home hero.
 * No fake features: only New Game / Continue / Settings exist here.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$flavor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/flavor.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/switch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$GraphicsPicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/GraphicsPicker.tsx [app-ssr] (ecmascript)");
;
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
/* DELTA 5-d — THE AUTH SHEET IS NOT THE MENU: MenuAuthSheet statically
 * imported the FAT GAME STORE (its register/login/notify hooks), which
 * silently hauled every slice + walletnet + the wire (socket.io) + npcChat
 * + hustles into the menu's first load — and crashed the "/" prerender
 * with a circular-init TDZ inside saveBootSlice. The sheet only mounts
 * when authOpen flips true (a click — never during first paint or SSR),
 * so it rides its own chunk and the store leaves the entry for good. */ const MenuAuthSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/components/game/screens/MenuAuthSheet.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
function PlayMark({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: className,
        "aria-hidden": true,
        fill: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M8 5.6c0-1.2 1.3-1.9 2.3-1.3l9 5.9c.9.6.9 2 0 2.6l-9 5.9c-1 .6-2.3-.1-2.3-1.3V5.6Z"
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
function MainMenu() {
    /* SILK II — the menu reads the MENU SLICE: continue/reset reach the fat
   * game store through dynamic imports at click time, so the entry chunk
   * never carries the game. */ const hasSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.hasSave);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.settings);
    const toggleSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.toggleSound);
    const setScreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.setScreen);
    const continueGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.continueGame);
    const resetGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.resetGame);
    const [tipIndex, setTipIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [authOpen, setAuthOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // M24-UI wave 2 — THE LIVE RIBBON'S TRUTH: the ribbon no longer claims
    // the wire, it ASKS. One deferred fetch to the honest pass-through door;
    // a quiet wire renders as a quiet wire, never as a promise.
    const [wire, setWire] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // rotate the loading tips gently
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = setInterval(()=>setTipIndex((i)=>(i + 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$flavor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MENU_TIPS"].length), 5000);
        return ()=>clearInterval(t);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let dead = false;
        fetch('/api/wire-status').then((r)=>r.ok ? r.json() : null).then((d)=>{
            if (!dead && d) setWire(d);
        }).catch(()=>{});
        return ()=>{
            dead = true;
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-dvh overflow-hidden",
        style: {
            background: 'linear-gradient(180deg, #f9bd77 0%, #f4925a 62%, #e56f4d 100%)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0",
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: "/art/menu-hero.webp",
                    alt: "",
                    fill: true,
                    priority: true,
                    sizes: "100vw",
                    className: "lko-kenburns object-cover"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#123528]/80"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 hidden bg-gradient-to-r from-[#123528]/55 via-transparent to-transparent lg:block"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex min-h-dvh flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2 px-5 pt-[max(env(safe-area-inset-top),0.9rem)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PinIcon"], {
                                        size: 13,
                                        className: "text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    "Lokoja • Kogi State • Nigeria"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-testid": "menu-live-ribbon",
                                className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-sm ${wire?.live ? 'border-[#ffd88a]/30 bg-black/30 text-[#ffd88a]' : 'border-white/20 bg-black/25 text-white/70'}`,
                                children: wire === null ? 'Checking the wire…' : wire.live ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative flex h-2 w-2",
                                            "aria-hidden": true,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffd88a] opacity-60"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "relative inline-flex h-2 w-2 rounded-full bg-[#ffd88a]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, this),
                                        `The wire dey live · ${wire.online} on now`
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative flex h-2 w-2",
                                            "aria-hidden": true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "relative inline-flex h-2 w-2 rounded-full bg-white/40"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 139,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this),
                                        "The wire dey quiet from here"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto mt-auto w-full max-w-md px-5 pb-[max(env(safe-area-inset-bottom),1.4rem)] pt-6 lg:mx-0 lg:ml-14 lg:max-w-lg lg:pb-14",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-center gap-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    viewBox: "0 0 48 48",
                                                    className: "h-7 w-7",
                                                    "aria-hidden": true,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M8 8 C 20 13 23 22 24 36",
                                                            stroke: "#1f7a6d",
                                                            strokeWidth: "6",
                                                            fill: "none",
                                                            strokeLinecap: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M41 17 C 31 20 26 26 24 36",
                                                            stroke: "#e8a317",
                                                            strokeWidth: "6",
                                                            fill: "none",
                                                            strokeLinecap: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "24",
                                                            cy: "37.5",
                                                            r: "4",
                                                            fill: "#146b3a"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 153,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm",
                                                children: "A Nigerian life sim"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 160,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "lko-display text-[2.9rem] leading-[0.95] text-white sm:text-6xl",
                                        children: [
                                            "LOKOJA",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-[#ffd88a]",
                                                children: "LIFE"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 166,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2.5 max-w-[30ch] text-sm font-semibold leading-snug text-white/90",
                                        children: "Build your life at the meeting point of the Niger and Benue."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/15 bg-black/25 px-3.5 py-2 backdrop-blur-sm",
                                "aria-live": "polite",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SparkleIcon"], {
                                        size: 15,
                                        className: "shrink-0 text-[#ffd88a]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[12.5px] font-medium leading-snug text-white/90",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$flavor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MENU_TIPS"][tipIndex]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex flex-wrap gap-1.5",
                                children: [
                                    '26 phone apps',
                                    `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].length} real locations`,
                                    '10,000-soul nation sim',
                                    `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPCS"].length} paddy dem to meet`
                                ].map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-extrabold text-white/85 backdrop-blur-sm",
                                        children: chip
                                    }, chip, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 flex w-full flex-col gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            setScreen('creation');
                                        },
                                        className: "lko-press group flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-white text-lg font-extrabold tracking-wide text-[var(--lko-green-deep)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlayMark, {
                                                className: "h-5 w-5 text-[var(--lko-terra)] transition-transform group-hover:scale-110"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this),
                                            "START YOUR LIFE"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        "data-testid": "menu-preview-note",
                                        className: "-mt-1 px-1 text-[10.5px] font-bold text-white/55",
                                        children: "60-second free look — claim a name to keep the life you build."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            void continueGame();
                                        },
                                        disabled: !hasSave,
                                        className: "lko-press flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/12 text-base font-extrabold tracking-wide text-white backdrop-blur-sm disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/40",
                                        children: "Continue your life"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "menu-auth-open",
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            setAuthOpen(true);
                                        },
                                        className: "lko-press flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[#ffd88a]/40 bg-[#ffd88a]/15 text-base font-extrabold tracking-wide text-[#ffd88a] backdrop-blur-sm",
                                        children: "🔑 Log in / Sign up — claim your name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('click'),
                                                    className: "lko-press mx-auto flex min-h-[44px] items-center gap-1.5 px-4 text-sm font-bold text-white/85",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsIcon"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Settings"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 246,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                                                className: "max-w-[calc(100vw-2rem)] rounded-2xl sm:max-w-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                                className: "lko-display",
                                                                children: "Settings"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 257,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                                                children: "Fine-tune your Lokoja Life experience."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-bold",
                                                                        children: "Sound"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                        lineNumber: 263,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-[var(--lko-ink-soft)]",
                                                                        children: "Clicks, chimes & alerts"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                        lineNumber: 264,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 262,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                                                checked: settings.sound,
                                                                onCheckedChange: toggleSound,
                                                                "aria-label": "Toggle sound"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 266,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$GraphicsPicker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphicsPicker"], {}, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl border border-black/[0.06] px-4 py-3 text-xs leading-relaxed text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mb-1 font-bold text-[var(--lko-ink)]",
                                                                children: [
                                                                    "Lokoja Life ",
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GAME_META"].version
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 273,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GAME_META"].stage,
                                                                    " — more life is coming to the city soon: shops, homes, the phone and beyond."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 274,
                                                                columnNumber: 19
                                                            }, this),
                                                            hasSave && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    if (window.confirm('Delete your save and start fresh? This cannot be undone.')) {
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["audio"].play('notify');
                                                                        void resetGame();
                                                                    }
                                                                },
                                                                className: "lko-press mt-3 min-h-[40px] w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600",
                                                                children: "Delete save & start fresh"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                                lineNumber: 279,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                                lineNumber: 255,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                        lineNumber: 245,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-5 text-center text-[11px] font-medium text-white/60 lg:text-left",
                                children: "An original Nigerian life sim • Made for Lokoja"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            authOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuAuthSheet, {
                onClose: ()=>setAuthOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MainMenu.tsx",
                lineNumber: 302,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MainMenu.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/game/screens/dashboard-chunk.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PERF (M3 + SILK II): preload hook for the Dashboard (game) chunk.
 * Lives in its own tiny module so importing this does NOT pull the
 * Dashboard module graph (the fat store, three.js, the 3D world) into the
 * entry bundle. The menu calls this once it is interactive; the browser
 * then fetches the game bundle in the background while the player reads
 * the menu — and once it lands, the fat store's world-boot hooks (the
 * postcard decode + the offline queue) run, so a continue click is instant.
 */ __turbopack_context__.s([
    "preloadDashboard",
    ()=>preloadDashboard
]);
function preloadDashboard() {
    void __turbopack_context__.A("[project]/src/components/game/screens/Dashboard.tsx [app-ssr] (ecmascript, async loader)").then(()=>__turbopack_context__.A("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript, async loader)")).then((m)=>m.useGameStore.getState().bootWorldHooks()).catch(()=>{
    /* the dynamic import happens again on demand — a failed prefetch is harmless */ });
}
}),
"[project]/src/components/game/GameSkeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameSkeleton",
    ()=>GameSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
/**
 * LOKOJA LIFE — M16: THE SILK SKELETON
 * -------------------------------------
 * The branded loading skeleton for every lazy chunk: the app's own
 * cream-and-green dress, breathing blocks only — transform/opacity
 * animations (the device law: no layout thrash on weak phones).
 *
 * THE HONESTY LAW: a skeleton never lies about progress — it shows
 * the shape of the screen that is coming, nothing more.
 */ const breathe = (delay)=>({
        animation: `lko-breathe 1.6s ease-in-out ${delay} infinite`
    });
function GameSkeleton({ label = 'Opening Lokoja…' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-dvh flex-col bg-[#f5edd8]",
        "aria-busy": "true",
        role: "status",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 pt-5 pb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-28 rounded-lg bg-[var(--lko-green-deep)] opacity-90",
                        style: breathe('0s')
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/GameSkeleton.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-8 rounded-full bg-[var(--lko-green-deep)] opacity-60",
                        style: breathe('0.2s')
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/GameSkeleton.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/GameSkeleton.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-36 w-full rounded-2xl bg-gradient-to-br from-[#e7dcc0] to-[#ddd0ae]",
                        style: breathe('0.1s')
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/GameSkeleton.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 h-4 w-3/5 rounded bg-[#e0d4b6]",
                        style: breathe('0.3s')
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/GameSkeleton.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 h-4 w-2/5 rounded bg-[#e0d4b6]",
                        style: breathe('0.5s')
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/GameSkeleton.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/GameSkeleton.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 grid grid-cols-2 gap-3 px-4",
                children: [
                    0.15,
                    0.35,
                    0.25,
                    0.45
                ].map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-20 rounded-xl bg-[#e7dcc0]",
                        style: breathe(`${d}s`)
                    }, i, false, {
                        fileName: "[project]/src/components/game/GameSkeleton.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/GameSkeleton.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lko-display mt-auto pb-8 text-center text-sm text-[var(--lko-green-deep)] opacity-80",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/GameSkeleton.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@keyframes lko-breathe { 0%,100% { opacity: .45 } 50% { opacity: 1 } }`
            }, void 0, false, {
                fileName: "[project]/src/components/game/GameSkeleton.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/GameSkeleton.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — App Shell
 * A single-page game shell: the only route is `/`, screens are
 * switched in-app (menu → creation → game) exactly like a game client.
 * Handles boot (save detection) and auto-save on exit.
 *
 * PERF (M3): the game screens (Dashboard → 3D world → three.js) are
 * dynamically imported, so the first paint is the lightweight menu shell
 * alone. The chunk is preloaded in the background the moment the menu is
 * interactive, so tapping "start" lands on an already-cached bundle.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$MainMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/MainMenu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$dashboard$2d$chunk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/dashboard-chunk.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GameSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/GameSkeleton.tsx [app-ssr] (ecmascript)");
;
;
'use client';
;
;
;
;
;
;
;
const CharacterCreation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/components/game/screens/CharacterCreation.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GameSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GameSkeleton"], {
            label: "Shaping your walker…"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 24,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0))
});
const Dashboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/components/game/screens/Dashboard.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GameSkeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GameSkeleton"], {
            label: "warming the Confluence"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 28,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0))
});
function Home() {
    /* SILK II — the shell reads the MENU SLICE only: the entry chunk carries
   * the menu store, not the 213KB game store. The game screens stay
   * dynamic-imported below, and the fat store is reached at click time. */ const screen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.screen);
    const booted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.booted);
    const boot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.boot);
    const elder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"])((s)=>s.settings.elder);
    // M13 — ELDER MODE: one root class drives the accessibility law
    // (large text, high contrast, reduced motion) for the WHOLE app.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.documentElement.classList.toggle('elder-mode', elder);
    }, [
        elder
    ]);
    // boot once on mount: detect existing save, sync audio settings
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        boot();
        // PERF: warm the game bundle while the menu is on screen (idle — never
        // competes with the first paint or the menu's own hydration)
        const w = window;
        let idleHandle = 0;
        const timeout = window.setTimeout(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$dashboard$2d$chunk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["preloadDashboard"], 1200);
        if (typeof w.requestIdleCallback === 'function') {
            window.clearTimeout(timeout);
            idleHandle = w.requestIdleCallback(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$dashboard$2d$chunk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["preloadDashboard"])(), {
                timeout: 2500
            });
        }
        return ()=>{
            window.clearTimeout(timeout);
            if (idleHandle) w.cancelIdleCallback?.(idleHandle);
        };
    }, [
        boot
    ]);
    // flush the autosave when the tab/app is hidden or closed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const flush = ()=>{
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMenuStore"].getState().screen !== 'game') return;
            // the fat chunk is loaded whenever the game screen is live — the
            // import resolves instantly and the save rides out
            void __turbopack_context__.A("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript, async loader)").then((m)=>m.useGameStore.getState().saveNow()).catch(()=>{});
        };
        const onVisibility = ()=>{
            if (document.visibilityState === 'hidden') flush();
        };
        window.addEventListener('pagehide', flush);
        document.addEventListener('visibilitychange', onVisibility);
        return ()=>{
            window.removeEventListener('pagehide', flush);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);
    // brief boot splash — avoids save-detection flicker on first paint
    if (!booted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-dvh flex-col items-center justify-center gap-4",
            style: {
                background: 'linear-gradient(180deg, #fbe7b7 0%, #f9d489 46%, #2a8a7a 46%, #1c6b5e 100%)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-float flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--lko-surface)] shadow-[var(--lko-shadow-lg)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 48 48",
                        className: "h-11 w-11",
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M6 12 C 18 16 22 24 24 36",
                                stroke: "#1f7a6d",
                                strokeWidth: "5",
                                fill: "none",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M42 20 C 32 22 27 27 24 36",
                                stroke: "#e8a317",
                                strokeWidth: "5",
                                fill: "none",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "24",
                                cy: "37",
                                r: "3.4",
                                fill: "#146b3a"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lko-display text-2xl tracking-tight text-[var(--lko-green-deep)]",
                    children: "LOKOJA LIFE"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-semibold text-[var(--lko-ink-soft)]",
                    children: "Loading the Confluence…"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            screen === 'menu' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$MainMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MainMenu"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 114,
                columnNumber: 29
            }, this),
            screen === 'creation' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CharacterCreation, {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 115,
                columnNumber: 33
            }, this),
            screen === 'game' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Dashboard, {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 116,
                columnNumber: 29
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f7d57db1._.js.map