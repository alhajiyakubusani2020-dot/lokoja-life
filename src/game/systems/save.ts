/**
 * LOKOJA LIFE — Save System
 * --------------------------
 * Versioned localStorage persistence with a migration hook.
 *
 * The schema (GameSave) maps 1:1 to a future Supabase table —
 * switching to cloud saves later means swapping the transport
 * functions below for async Supabase calls, nothing else.
 */

import type { GameSave, PlayerState, CivicState, FleetState, GameSettings, ChaosState, GoalState, OnboardingState, AccountState, CalendarState, RiversState } from '../types'
import { freshCivicState } from './civic'
import { freshChaosState } from './chaos'
import { freshGoalState } from './goals'
import { freshOnboardingState, freshAccountState } from './guest'
import { freshCalendarState } from './calendar'
import { freshRiversState } from './rivers'

const SAVE_KEY = 'lokoja-life:save'
const SAVE_VERSION = 12

/** Check localStorage availability without throwing (private mode etc). */
function storageAvailable(): boolean {
  try {
    const probe = '__lko_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/** Serialize the save into the storage-safe JSON string. */
function serialize(save: GameSave): string {
  return JSON.stringify({ ...save, version: SAVE_VERSION })
}

/**
 * Parse + migrate an old save string into the current shape.
 * Each case below upgrades one version step; future versions
 * add their own `case N` — never break existing players.
 */
function deserialize(raw: string): GameSave | null {
  try {
    const parsed = JSON.parse(raw) as GameSave

    if (!parsed || typeof parsed !== 'object' || !parsed.player) return null

    let save = parsed
    switch (save.version) {
      case 1:
        // v1 → v2 (Stage 3): economy/work fields added to the player.
        // All are defaulted below — nothing a v1 player had is lost.
        save.version = 2
        break
      case 2:
        // v2 → v3 (Stage 5): vehicles, bank balance, NPC relationships.
        // Defaults applied below — a v2 player wakes up with an empty
        // garage, an empty bank account, and strangers for friends.
        save.version = 3
        break
      case 3:
        // v3 → v4 (M2): the civic mesh — NEPA/KGIRS/police/EFCC/market.
        // freshCivicState() below gives a v3 player a clean civic slate:
        // no bills owed, no warrant, a rolled market for their current day.
        save.version = 4
        break
      case 4:
        // v4 → v5 (M3 — OWN THE CITY): businesses gain the accrual fields
        // (accrued till, lastAccrualDay, openedDay). Any biz entry a v4 save
        // somehow carries is defaulted below; normal v4 saves carry an
        // empty array, which is already the correct v5 shape.
        save.version = 5
        break
      case 5:
        // v5 → v6 (M5 — WORK & FLEET): businesses gain staff + installed
        // upgrades, and the save carries the fleet's done-gig ledger. Both
        // default below — a v5 player wakes up with no attendants hired,
        // no generator/solar fitted, and a clean Motor Park board.
        save.version = 6
        break
      case 6:
        // v6 → v7 (M6 — LIVING WORLD): the relationship track gains the
        // gift/hangout cooldowns (lastGiftDay / lastHangoutDay). Optional
        // fields defaulted below — a v6 player wakes up with no gifts
        // given and no hangouts owed, everything else untouched.
        save.version = 7
        break
      case 7:
        // v7 → v8 (M7 — RUN ON ANY DEVICE): settings gains the graphics
        // pick ('auto' | 'low' | 'mid' | 'high'). Defaulted below — a v7
        // player wakes up on Auto and the device law decides for them.
        save.version = 8
        break
      case 8:
        // v8 → v9 (M8 — THE CHAOS ENGINE): the chaos slice joins the save —
        // transformer outages, the community fix pool, scarcity bookkeeping.
        // Defaulted below — a v8 player wakes up on a quiet grid.
        save.version = 9
        break
      case 9:
        // v9 → v10 (M9 — THE CASUAL SHELL): daily goals, the onboarding
        // arc, the Guest Loop account line, and settings.chill join the
        // schema. All defaulted below — a v9 player wakes up as a guest
        // with today's goals waiting and the city at normal pressure.
        save.version = 10
        break
      case 10:
        // v10 → v11 (M10 — THE LIVING CALENDAR): the calendar slice joins
        // the save — festival participation, ram meat, regatta stakes,
        // aso-ebi, the paving projects. Defaulted below — a v10 player
        // wakes up with the year's celebrations waiting, nothing owed.
        save.version = 11
        break
      case 11:
        // v11 → v12 (M11 — THE RIVERS AWAKE): the rivers slice joins the
        // save — sandbags, walkways, tolls, the canoe, the rescue bowl.
        // Defaulted below — a v11 player wakes up on a dry-season river.
        save.version = 12
        break
      case 12:
        // current version
        break
      default:
        // Unknown / newer save from a newer app version — keep it, best effort.
        break
    }

    // --- defensive defaults (never break a loadable save) ---
    if (!save.world) {
      save.world = {
        day: 1,
        timeOfDay: 'morning',
        weather: 'sunny',
        currentLocation: 'home',
      }
    }
    if (!save.world.currentLocation) save.world.currentLocation = 'home'
    if (!save.settings) save.settings = { sound: true, graphics: 'auto', chill: false }
    if (typeof save.settings.sound !== 'boolean') save.settings.sound = true
    if (!['auto', 'low', 'mid', 'high'].includes(save.settings.graphics)) save.settings.graphics = 'auto'
    if (typeof save.settings.chill !== 'boolean') save.settings.chill = false

    // --- Stage 3 player fields (missing on v1 saves / corrupt data) ---
    const p = save.player as PlayerState
    if (!p.skillXp) p.skillXp = { hustle: 0, smart: 0, social: 0 }
    if (!p.activeOpportunities) p.activeOpportunities = []
    if (!p.cooldowns) p.cooldowns = {}
    if (!p.transactions) p.transactions = []
    if (!p.stats) {
      p.stats = { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }
    }

    // --- Stage 5 player fields (missing on v2-and-older saves) ---
    if (!p.vehicles) p.vehicles = []
    if (typeof p.bankBalance !== 'number') p.bankBalance = 0
    if (!p.relationships) p.relationships = {}

    // --- M6 social-depth fields (missing on v6-and-older saves) ---
    for (const key of Object.keys(p.relationships)) {
      const r = p.relationships[key]
      if (typeof r.lastGiftDay !== 'number') r.lastGiftDay = 0
      if (typeof r.lastHangoutDay !== 'number') r.lastHangoutDay = 0
    }

    // --- M3 businesses (missing on v4-and-older saves; legacy entries upgraded) ---
    if (!p.businesses) p.businesses = []
    p.businesses = p.businesses.map((b) => ({
      ...b,
      accrued: typeof b.accrued === 'number' ? b.accrued : 0,
      lastAccrualDay: typeof b.lastAccrualDay === 'number' ? b.lastAccrualDay : save.world?.day ?? 1,
      openedDay: typeof b.openedDay === 'number' ? b.openedDay : save.world?.day ?? 1,
      // M5 — staff & power (missing on v5-and-older saves)
      staff: typeof b.staff === 'number' && b.staff > 0 ? b.staff : 0,
      upgrades: Array.isArray(b.upgrades) ? b.upgrades : [],
    }))

    // --- M5 fleet ledger (missing on v5-and-older saves) ---
    const fleet: FleetState = save.fleet && Array.isArray(save.fleet.done)
      ? save.fleet
      : { day: save.world?.day ?? 1, done: [] }
    if (typeof fleet.day !== 'number') fleet.day = save.world?.day ?? 1
    save.fleet = fleet

    // --- M8 chaos engine (missing on v8-and-older saves; partial data healed) ---
    const fresh = freshChaosState()
    const chaos: ChaosState = save.chaos ?? fresh
    if (typeof chaos.day !== 'number') chaos.day = fresh.day
    if (!Array.isArray(chaos.recent)) chaos.recent = fresh.recent
    if (!chaos.active || typeof chaos.active.zoneId !== 'string') chaos.active = null
    if (typeof chaos.atmDrawnDay !== 'number') chaos.atmDrawnDay = fresh.atmDrawnDay
    if (typeof chaos.atmDrawn !== 'number') chaos.atmDrawn = fresh.atmDrawn
    if (!chaos.stats) chaos.stats = fresh.stats
    save.chaos = chaos

    // --- M9 casual shell (missing on v9-and-older saves; partial data healed) ---
    if (!save.goals || !Array.isArray(save.goals.ids) || save.goals.ids.length !== 3) save.goals = freshGoalState()
    if (!Array.isArray((save.goals as GoalState).done)) (save.goals as GoalState).done = [false, false, false]
    if (!save.onboarding || !Array.isArray(save.onboarding.done)) save.onboarding = freshOnboardingState()
    if (typeof save.onboarding.rewarded !== 'boolean') save.onboarding.rewarded = false
    if (!save.account) save.account = freshAccountState()
    if (typeof save.account.linked !== 'boolean') save.account.linked = false
    if (typeof save.account.gateGraceDay !== 'number') save.account.gateGraceDay = 0

    // --- M10 living calendar (missing on v10-and-older saves; partial data healed) ---
    const freshCal = freshCalendarState()
    const cal: CalendarState = save.calendar ?? freshCal
    if (typeof cal.day !== 'number') cal.day = freshCal.day
    if (typeof cal.meatPacks !== 'number') cal.meatPacks = 0
    if (!Array.isArray(cal.meatShares)) cal.meatShares = []
    if (!Array.isArray(cal.sponsored)) cal.sponsored = []
    if (!Array.isArray(cal.bets)) cal.bets = []
    if (!Array.isArray(cal.asoEbi)) cal.asoEbi = []
    if (!Array.isArray(cal.attended)) cal.attended = []
    if (!Array.isArray(cal.paved)) cal.paved = []
    if (!cal.paving || typeof cal.paving.zoneId !== 'string') cal.paving = null
    if (!cal.stats) cal.stats = freshCal.stats
    cal.paved = cal.paved.filter((r) => typeof r.zoneId === 'string' && typeof r.untilDay === 'number')
    save.calendar = cal

    // --- M11 rivers (missing on v11-and-older saves; partial data healed) ---
    const freshRiv = freshRiversState()
    const rivers: RiversState = save.rivers ?? freshRiv
    if (typeof rivers.day !== 'number') rivers.day = freshRiv.day
    if (typeof rivers.sandbags !== 'number') rivers.sandbags = 0
    if (typeof rivers.canoe !== 'boolean') rivers.canoe = false
    if (!rivers.walkways || typeof rivers.walkways !== 'object') rivers.walkways = {}
    for (const [zoneId, w] of Object.entries(rivers.walkways)) {
      if (typeof w.laid !== 'number' || w.laid < 0) w.laid = 0
      if (typeof w.tollTier !== 'number') w.tollTier = 0
      if (typeof w.pot !== 'number') w.pot = 0
      if (typeof w.tollDay !== 'number') w.tollDay = 0
      rivers.walkways[zoneId] = w
    }
    if (!rivers.rescue || typeof rivers.rescue.zoneId !== 'string' || typeof rivers.rescue.year !== 'number') rivers.rescue = null
    if (typeof rivers.rescuedYear !== 'number') rivers.rescuedYear = 0
    if (typeof rivers.ferryDay !== 'number') rivers.ferryDay = 0
    if (!Array.isArray(rivers.ferryDone)) rivers.ferryDone = []
    if (!rivers.stats) rivers.stats = freshRiv.stats
    save.rivers = rivers

    // --- M2 civic mesh (missing on v3-and-older saves) ---
    if (!save.civic) {
      save.civic = freshCivicState()
    } else {
      // defensive merge — a partially-written civic slice still loads
      const fresh = freshCivicState()
      save.civic = {
        nepa: { ...fresh.nepa, ...save.civic.nepa },
        kgirs: { ...fresh.kgirs, ...save.civic.kgirs },
        police: { ...fresh.police, ...save.civic.police },
        efcc: { ...fresh.efcc, ...save.civic.efcc, pending: save.civic.efcc?.pending ?? [] },
        market: { ...fresh.market, ...save.civic.market },
      }
    }

    save.version = SAVE_VERSION
    return save
  } catch {
    return null
  }
}

export const SaveSystem = {
  SAVE_KEY,
  SAVE_VERSION,

  /** Does a local save exist? */
  hasSave(): boolean {
    if (!storageAvailable()) return false
    return window.localStorage.getItem(SAVE_KEY) !== null
  },

  /** Load and validate the save, or null if none / corrupt. */
  load(): GameSave | null {
    if (!storageAvailable()) return null
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return deserialize(raw)
  },

  /** Persist the save. Returns false if storage is unavailable. */
  write(save: GameSave): boolean {
    if (!storageAvailable()) return false
    try {
      window.localStorage.setItem(SAVE_KEY, serialize(save))
      return true
    } catch {
      return false
    }
  },

  /** Remove the save (used by "Start Over"). */
  clear(): void {
    if (!storageAvailable()) return
    window.localStorage.removeItem(SAVE_KEY)
  },

  /**
   * M7 — patch ONLY the settings slice of an existing save (or seed it if
   * a save exists but the game isn't live). This is how a graphics pick
   * made on the MAIN MENU (before any game runs, so the debounced
   * autosave is dormant) still reaches disk. No save = nothing to patch.
   */
  patchSettings(settings: GameSettings): boolean {
    if (!storageAvailable()) return false
    const save = this.load()
    if (!save) return false
    return this.write({ ...save, settings })
  },

  /**
   * Shape a save for future cloud upload (Supabase row).
   * Kept as a pure function so the online migration is a transport swap.
   */
  toCloudPayload(save: GameSave) {
    return {
      schema_version: save.version,
      data: save,
      updated_at: new Date(save.updatedAt).toISOString(),
    }
  },
}
