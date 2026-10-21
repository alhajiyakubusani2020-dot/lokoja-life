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
 */

import type { GameSave, PlayerState, CivicState, FleetState, GameSettings, ChaosState, GoalState, OnboardingState, AccountState, CalendarState, RiversState, EducationState, HousingState, JapaState, ShieldState, FortressState } from '../types'
import { freshCivicState } from './civic'
import { freshChaosState } from './chaos'
import { freshGoalState } from './goals'
import { freshOnboardingState, freshAccountState } from './guest'
import { freshCalendarState } from './calendar'
import { freshRiversState } from './rivers'
import { freshEducationState } from './education'
import { freshHousingState } from './housing'
import { freshJapaState } from './japa'
import { freshShieldState } from './shield'
import { freshPulseState } from './pulse'
import { freshLiveState } from './live'
import { freshForgeState } from './citypack'
import { freshStoryState } from './story'
import { freshPattiState } from './patti'
import { freshWardrobeState } from './wardrobe'
import { freshNationState } from './nation'
import { freshFortressState, CHAIN_SEED, signPayload, verifyPayload, sha256, FORT_KEY_STORAGE, FORTRESS_KEYS } from './fortress'

const SAVE_KEY = FORTRESS_KEYS.primary
const SHADOW_KEY = FORTRESS_KEYS.shadow
/** The current save schema version. EXPORTED so the cloud vault's write
 *  door (/api/cloud/push) can refuse saves from NEWER app versions without
 *  hardcoding the number twice (F1 hardening). */
export const SAVE_VERSION = 20

/** M15 — THE DELTA LAW: the state fingerprint of the last payload that hit disk.
 *  Lives OUTSIDE the save (the fortress rule: the books live beside, not inside). */
const DELTA_HASH_KEY = 'lokoja-life:save-hash'
/** M15 — the fingerprint of the last payload the cloud vault accepted (the zero-byte push). */
export const PUSHED_HASH_KEY = 'lokoja-life:pushed-hash'
/** M20 — the EXACT string the vault last accepted (the binary delta's base). */
const LAST_PUSHED_ENV_KEY = 'lokoja-life:last-pushed-env'

/**
 * THE STATE FINGERPRINT — sha256 over the save with the timestamps
 * zeroed. Two saves whose ONLY difference is `updatedAt` are the SAME
 * life: the debounced autosave re-fires on an idle city every few
 * seconds, and the timestamps alone must never grind the disk (or the
 * cloud). The disk keeps the LAST REAL write's timestamp — an honest
 * "when your life last changed" line.
 */
function stateFingerprint(save: GameSave): string {
  return sha256(JSON.stringify({ ...save, createdAt: 0, updatedAt: 0 }))
}

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

/* ------------------------------ the device key ------------------------------ */

let cachedKey: string | null = null

/** Read (or create) the device-local fortress key. Test hook: setFortKey. */
function fortKey(): string | null {
  if (cachedKey) return cachedKey
  try {
    const existing = window.localStorage.getItem(FORT_KEY_STORAGE)
    if (existing && existing.length >= 32) {
      cachedKey = existing
      return cachedKey
    }
    // fresh device key — random bytes via crypto, Math.random as the honest fallback
    let hex = ''
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const bytes = new Uint8Array(24)
      crypto.getRandomValues(bytes)
      hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
    } else {
      for (let i = 0; i < 24; i++) hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    }
    window.localStorage.setItem(FORT_KEY_STORAGE, hex)
    cachedKey = hex
    return cachedKey
  } catch {
    return null
  }
}

/**
 * TEST HOOK — pin the device key deterministically (the suite signs and
 * tampers against a FIXED key so the vectors stay stable).
 */
function setFortKey(key: string): void {
  cachedKey = key
  try {
    window.localStorage.setItem(FORT_KEY_STORAGE, key)
  } catch {
    /* the caller owns storage in tests */
  }
}

/* --------------------------- serialize + envelope --------------------------- */

/** Serialize the save into the storage-safe JSON string. */
function serialize(save: GameSave): string {
  return JSON.stringify({ ...save, version: SAVE_VERSION })
}

interface Envelope {
  fmt: 2
  data: GameSave
  sig: string
}

function wrapEnvelope(dataStr: string): string {
  const key = fortKey()
  const sig = key ? signPayload(dataStr, key) : ''
  return JSON.stringify({ fmt: 2, data: JSON.parse(dataStr), sig })
}

/**
 * Parse + verify an envelope or a legacy bare save. Returns the save
 * (healed) plus the transport verdict the boot toast narrates.
 */
function unwrapEnvelope(raw: string): { save: GameSave | null; verdict: 'ok' | 'legacy' | 'missing-key' | 'tampered' | 'malformed' } {
  try {
    const parsed = JSON.parse(raw) as Partial<Envelope> & GameSave
    if (parsed && typeof parsed === 'object' && parsed.fmt === 2 && typeof parsed.sig === 'string') {
      // signed envelope — re-serialize the data slice EXACTLY as stored
      const dataStr = JSON.stringify(parsed.data)
      const key = fortKey()
      const v = verifyPayload(dataStr, parsed.sig, key)
      if (v.ok) {
        return parsed.data ? { save: parsed.data, verdict: 'ok' } : { save: null, verdict: 'malformed' }
      }
      if (v.why === 'missing-key') {
        return parsed.data ? { save: parsed.data, verdict: 'missing-key' } : { save: null, verdict: 'malformed' }
      }
      if (v.why === 'tampered') return { save: null, verdict: 'tampered' }
      return { save: null, verdict: 'malformed' }
    }
    // legacy bare save (pre-M14) — loads as legacy, re-signed on next write
    return { save: (parsed as GameSave) ?? null, verdict: 'legacy' }
  } catch {
    return { save: null, verdict: 'malformed' }
  }
}

/**
 * Parse + migrate an old save string into the current shape.
 * Each case below upgrades one version step; future versions
 * add their own `case N` — never break existing players.
 */
function deserialize(raw: string): GameSave | null {
  const { save: parsed, verdict } = unwrapEnvelope(raw)
  if (verdict === 'tampered' || verdict === 'malformed') return null
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
      // v12 → v13 (M12 — THE LADDER): the education, housing and japa
      // slices join the save — the FUL semester clock, the rent book,
      // and the JAPA document chain. Defaulted below — a v12 player
      // wakes up with the ladder waiting at the bottom rung.
      save.version = 13
      break
    case 13:
      // v13 → v14 (M13 — THE FAMILY SHIELD): the character gains a life
      // stage, the settings gain elder mode, and the shield slice joins
      // the save — the scammer game's book and the local parent gate.
      // Defaulted below — a v13 player wakes up as an adult (the honest
      // default for existing hustlers) with the literacy game waiting.
      save.version = 14
      break
    case 14:
      // v14 → v15 (M14 — THE FORTRESS): the fortress slice joins the
      // save — the anomaly counter, the income ledgers, the kobo-chain
      // tail. Defaulted below — a v14 player wakes up guarded, with a
      // clean ledger and their first entry chaining from the seed.
      save.version = 15
      break
    case 15:
      // v15 → v16 (M15 — TELEPORT & PULSE): the pulse slice joins the
      // save — the read book for the city paper, the arrival book for
      // teleport postcards, the share ledger. Defaulted below — a v15
      // player wakes up with the paper waiting and an empty mailbox.
      save.version = 16
      break
    case 16:
      // v16 → v17 (M17 — THE LIVE NATION): the live slice joins the
      // save — my event cursor, my voice opt-in, my memberships.
      // Defaulted below — a v16 player wakes up standing in the nation
      // with the mic ready and the cursor at zero.
      save.version = 17
      break
    case 17:
      // v17 → v18 (M18 — THE CITY FORGE): the forge slice joins the
      // save — the vote book and the ledger. Defaulted below — a v17
      // player wakes up holding a vote card and an empty ledger.
      save.version = 18
      break
    case 18:
      // v18 → v19 (M19 — NEXT-GEN POLISH): the story (THE CONFLUENCE PATH),
      // the Patti secrets and the wardrobe book join the save, plus the
      // settings.music / settings.haptics picks. All defaulted below — a
      // v18 player wakes up at chapter 0 with a dry hill, an empty
      // wardrobe, the soundtrack off until they turn it on, and haptics
      // humming on their phone.
      save.version = 19
      break
    case 19:
      // v19 → v20 (M20 — PLANET SCALE + OPS): the nation slice joins the
      // save — the crowd switch, the inflation ledger, the moderation
      // book and the telemetry opt-in (dark by default). Defaulted
      // below — a v19 player wakes up with the city alive, the books
      // empty and their data theirs.
      save.version = 20
      break
    case 20:
      // current version
      break
    default:
      // F1 HARDENING — a save from a NEWER app version is REFUSED, not
      // best-effort loaded: its shape is ahead of every migration here, and
      // the unconditional stamp-down below used to claim it as v20. null
      // sends the load descent to the shadow/backup rungs, then fresh —
      // continueGame (useGameStore) reads a null load as "no save" and falls
      // back to the new-game flow. Legacy bare saves (version undefined)
      // still pass: `undefined > SAVE_VERSION` is false.
      if (typeof save.version === 'number' && save.version > SAVE_VERSION) return null
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
  if (!save.settings) save.settings = { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true }
  if (typeof save.settings.sound !== 'boolean') save.settings.sound = true
  if (!['auto', 'low', 'mid', 'high'].includes(save.settings.graphics)) save.settings.graphics = 'auto'
  if (typeof save.settings.chill !== 'boolean') save.settings.chill = false
  if (typeof save.settings.elder !== 'boolean') save.settings.elder = false
  // M19 — music defaults OFF (respect data plans), haptics ON (touch is the point)
  if (typeof save.settings.music !== 'boolean') save.settings.music = false
  if (typeof save.settings.haptics !== 'boolean') save.settings.haptics = true

  // --- Stage 3 player fields (missing on v1 saves / corrupt data) ---
  const p = save.player as PlayerState
  if (!p.skillXp) p.skillXp = { hustle: 0, smart: 0, social: 0 }
  if (!p.activeOpportunities) p.activeOpportunities = []
  if (!p.cooldowns) p.cooldowns = {}
  if (!p.transactions) p.transactions = []
  if (!p.stats) {
    p.stats = { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }
  }
  // --- M13 family shield (missing on v13-and-older saves) ---
  if (p.ageBand !== 'kid' && p.ageBand !== 'teen' && p.ageBand !== 'adult') p.ageBand = 'adult'

  // --- Stage 5 player fields (missing on v2-and-older saves) ---
  if (!p.vehicles) p.vehicles = []
  // F1 HARDENING — the bank law: finite, non-negative, whole naira. The old
  // guard caught non-numbers only; Infinity/NaN/negative/fractional rode
  // straight into the engine.
  p.bankBalance = typeof p.bankBalance === 'number' && Number.isFinite(p.bankBalance) ? Math.max(0, Math.floor(p.bankBalance)) : 0
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

  // --- M12 ladder (missing on v12-and-older saves; partial data healed) ---
  const freshEd = freshEducationState()
  const ed: EducationState = save.education ?? freshEd
  if (typeof ed.enrolled !== 'boolean') ed.enrolled = false
  if (typeof ed.semester !== 'number' || ed.semester < 1) ed.semester = freshEd.semester
  if (typeof ed.semesterStartDay !== 'number') ed.semesterStartDay = 0
  if (typeof ed.lecturesDone !== 'number') ed.lecturesDone = 0
  if (typeof ed.lastLectureDay !== 'number') ed.lastLectureDay = 0
  if (typeof ed.lastGrantSemester !== 'number') ed.lastGrantSemester = 0
  if (typeof ed.examsPassed !== 'number') ed.examsPassed = 0
  if (typeof ed.failedExams !== 'number') ed.failedExams = 0
  if (typeof ed.graduated !== 'boolean') ed.graduated = false
  if (typeof ed.convocationDay !== 'number') ed.convocationDay = null
  if (typeof ed.convocationAttended !== 'boolean') ed.convocationAttended = false
  if (!ed.stats) ed.stats = freshEd.stats
  save.education = ed

  const freshHou = freshHousingState()
  const hou: HousingState = save.housing ?? freshHou
  if (hou.owned !== null && typeof hou.owned !== 'string') hou.owned = null
  if (!hou.furnishing || typeof hou.furnishing !== 'object') hou.furnishing = {}
  if (typeof hou.rentPaidThrough !== 'number') hou.rentPaidThrough = 0
  if (typeof hou.lastPostedDay !== 'number') hou.lastPostedDay = 0
  if (typeof hou.rentOwed !== 'number' || hou.rentOwed < 0) hou.rentOwed = 0
  if (!hou.wahala || typeof hou.wahala.kind !== 'string') hou.wahala = null
  if (!hou.stats) hou.stats = freshHou.stats
  save.housing = hou

  const freshJap = freshJapaState()
  const jap: JapaState = save.japa ?? freshJap
  for (const k of ['nimcReadyDay', 'nimcDay', 'passportReadyDay', 'passportDay', 'agentTries', 'agentScams', 'clearanceDay', 'policeDay', 'flownDay', 'remitDay', 'policeShifts', 'sirenUntilDay', 'lastEscortDay'] as const) {
    if (typeof jap[k] !== 'number') jap[k] = 0
  }
  if (!jap.stats) jap.stats = freshJap.stats
  save.japa = jap

  // --- M13 shield (missing on v13-and-older saves; partial data healed) ---
  const freshSh = freshShieldState()
  const sh: ShieldState = save.shield ?? freshSh
  if (typeof sh.scammerDay !== 'number') sh.scammerDay = freshSh.scammerDay
  if (typeof sh.scammerCorrect !== 'number') sh.scammerCorrect = freshSh.scammerCorrect
  if (typeof sh.scammerWrong !== 'number') sh.scammerWrong = freshSh.scammerWrong
  if (typeof sh.scammerStreak !== 'number') sh.scammerStreak = freshSh.scammerStreak
  if (typeof sh.parentPinHash !== 'string' && sh.parentPinHash !== null) sh.parentPinHash = null
  save.shield = sh

  // --- M14 fortress (missing on v14-and-older saves; partial data healed) ---
  const freshFt = freshFortressState()
  const ft: FortressState = save.fortress ?? freshFt
  if (typeof ft.anomalies !== 'number' || ft.anomalies < 0) ft.anomalies = freshFt.anomalies
  if (typeof ft.dayEarnedDay !== 'number') ft.dayEarnedDay = freshFt.dayEarnedDay
  if (typeof ft.dayEarned !== 'number' || ft.dayEarned < 0) ft.dayEarned = freshFt.dayEarned
  if (typeof ft.slotTxCount !== 'number' || ft.slotTxCount < 0) ft.slotTxCount = freshFt.slotTxCount
  if (typeof ft.slotTxSlot !== 'number') ft.slotTxSlot = freshFt.slotTxSlot
  if (typeof ft.chainTail !== 'string') ft.chainTail = CHAIN_SEED
  if (typeof ft.fingerprint !== 'string' && ft.fingerprint !== null) ft.fingerprint = null
  save.fortress = ft

  // --- M15 city pulse (missing on v15-and-older saves; partial data healed) ---
  const freshPl = freshPulseState()
  const pl = save.cityPulse ?? freshPl
  if (typeof pl.readDay !== 'number' || pl.readDay < 0) pl.readDay = freshPl.readDay
  if (!Array.isArray(pl.seen)) pl.seen = []
  if (!Array.isArray(pl.arrivals)) pl.arrivals = []
  pl.arrivals = pl.arrivals.filter((c) => typeof c === 'string' && c.startsWith('lkt1.')).slice(-20)
  pl.seen = pl.seen.filter((s) => typeof s === 'string').slice(-64)
  if (!pl.stats || typeof pl.stats !== 'object') pl.stats = freshPl.stats
  if (typeof pl.stats.shares !== 'number' || pl.stats.shares < 0) pl.stats.shares = 0
  if (typeof pl.stats.arrivalsIn !== 'number' || pl.stats.arrivalsIn < 0) pl.stats.arrivalsIn = 0
  save.cityPulse = pl

  // --- M17 live nation (missing on v16-and-older saves; partial data healed) ---
  const freshLv = freshLiveState()
  const lv = save.live ?? freshLv
  if (typeof lv.cursor !== 'number' || lv.cursor < 0) lv.cursor = freshLv.cursor
  if (typeof lv.voiceOn !== 'boolean') lv.voiceOn = freshLv.voiceOn
  if (typeof lv.assocId !== 'string' && lv.assocId !== null) lv.assocId = null
  if (!Array.isArray(lv.coSigned)) lv.coSigned = []
  lv.coSigned = lv.coSigned.filter((c) => typeof c === 'string').slice(-24)
  if (!Array.isArray(lv.circles)) lv.circles = []
  lv.circles = lv.circles.filter((c) => typeof c === 'string').slice(-12)
  if (!lv.stats || typeof lv.stats !== 'object') lv.stats = freshLv.stats
  for (const k of ['chats', 'emotes', 'streamsWatched', 'tradesDone'] as const) {
    if (typeof lv.stats[k] !== 'number' || lv.stats[k] < 0) lv.stats[k] = 0
  }
  if (typeof lv.finesPaid !== 'number' || lv.finesPaid < 0) lv.finesPaid = 0
  save.live = lv

  // --- M18 city forge (missing on v17-and-older saves; partial data healed) ---
  const freshFg = freshForgeState()
  const fg = save.forge ?? freshFg
  if (!fg.votes || typeof fg.votes !== 'object' || !fg.votes.counts || typeof fg.votes.counts !== 'object') fg.votes = freshFg.votes
  if (!Array.isArray(fg.votes.mine)) fg.votes.mine = []
  fg.votes.mine = fg.votes.mine.filter((c) => typeof c === 'string').slice(-3)
  for (const [k, n] of Object.entries(fg.votes.counts)) {
    if (typeof n !== 'number' || n < 0) delete fg.votes.counts[k]
  }
  if (!Array.isArray(fg.ledger)) fg.ledger = []
  fg.ledger = fg.ledger.filter((e) => e && typeof e.city === 'string').slice(-20)
  if (typeof fg.ranLokoja !== 'boolean') fg.ranLokoja = false
  save.forge = fg

  // --- M19 story / patti / wardrobe (missing on v18-and-older saves) ---
  const freshSt = freshStoryState()
  const st = save.story ?? freshSt
  if (typeof st.chapter !== 'number' || st.chapter < 0 || st.chapter > 5) st.chapter = freshSt.chapter
  if (typeof st.sandDays !== 'number' || st.sandDays < 0) st.sandDays = freshSt.sandDays
  if (typeof st.lastSandDay !== 'number' || st.lastSandDay < 0) st.lastSandDay = freshSt.lastSandDay
  if (typeof st.notePaid !== 'boolean') st.notePaid = freshSt.notePaid
  if (typeof st.feverPaid !== 'boolean') st.feverPaid = freshSt.feverPaid
  if (typeof st.sponsoredDays !== 'number' || st.sponsoredDays < 0) st.sponsoredDays = freshSt.sponsoredDays
  if (typeof st.lastSponsorDay !== 'number' || st.lastSponsorDay < 0) st.lastSponsorDay = freshSt.lastSponsorDay
  if (typeof st.doctorDay !== 'number' || st.doctorDay < 0) st.doctorDay = freshSt.doctorDay
  save.story = st

  const freshPt = freshPattiState()
  const pt = save.patti ?? freshPt
  if (!pt.found || typeof pt.found !== 'object') pt.found = freshPt.found
  for (const [k, n] of Object.entries(pt.found)) {
    if (typeof n !== 'number' || n < 0) delete pt.found[k]
  }
  save.patti = pt

  const freshWd = freshWardrobeState()
  const wd = save.wardrobe ?? freshWd
  if (!Array.isArray(wd.ownedStyles)) wd.ownedStyles = freshWd.ownedStyles
  if (!Array.isArray(wd.ownedWalks)) wd.ownedWalks = freshWd.ownedWalks
  wd.ownedStyles = wd.ownedStyles.filter((k) => typeof k === 'string')
  wd.ownedWalks = wd.ownedWalks.filter((k) => typeof k === 'string')
  if (typeof wd.activeWalk !== 'string' || !wd.ownedWalks.includes(wd.activeWalk)) {
    wd.activeWalk = wd.ownedWalks.includes('street') || wd.ownedWalks.length === 0 ? 'street' : wd.ownedWalks[0]
  }
  save.wardrobe = wd

  // --- M20 nation slice (missing on v19-and-older saves) ---
  if (!save.nation) {
    save.nation = freshNationState()
  } else {
    const fresh = freshNationState()
    const crowd = save.nation.crowd
    save.nation = {
      crowd: {
        seed: typeof crowd?.seed === 'number' && Number.isFinite(crowd.seed) ? crowd.seed : fresh.crowd.seed,
        count: typeof crowd?.count === 'number' && crowd.count > 0 && crowd.count <= 50_000 ? Math.floor(crowd.count) : fresh.crowd.count,
        on: typeof crowd?.on === 'boolean' ? crowd.on : fresh.crowd.on,
      },
      inflation: Array.isArray(save.nation.inflation)
        ? save.nation.inflation.filter((r) => r && typeof r.day === 'number' && typeof r.mult === 'number').slice(-12)
        : [],
      moderation: Array.isArray(save.nation.moderation)
        ? save.nation.moderation
            .filter((r) => r && typeof r.day === 'number' && typeof r.why === 'string' && typeof r.band === 'string')
            .slice(-40)
        : [],
      telemetryOptIn: save.nation.telemetryOptIn === true,
    }
  }

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

  // --- F1 HARDENING — the scalar sanitization pass ---
  // The heal blocks above fix MISSING objects only; crafted saves can ride
  // bad SCALARS straight into the engine (cash:-999999, cash:null,
  // day:"5" → "51" after +1, cash:1e308, Infinity → totalEarned:null).
  // Every successful load passes this law: money is a finite non-negative
  // whole naira, the day a finite integer ≥ 1, needs sit in [0,100], life
  // counters are finite. Valid saves already satisfy every rule here and
  // pass through byte-identical (verified by round-trip in the F1 battery).
  p.cash = typeof p.cash === 'number' && Number.isFinite(p.cash) ? Math.max(0, Math.floor(p.cash)) : 0
  if (save.world) {
    const d = Number(save.world.day)
    save.world.day = Number.isFinite(d) ? Math.max(1, Math.floor(d)) : 1
  }
  if (p.needs && typeof p.needs === 'object') {
    for (const k of ['health', 'energy', 'hunger', 'mood'] as const) {
      const v = p.needs[k]
      // a non-finite need loads at the fresh-game value — a corrupt save
      // must never boot its player starving, exhausted or dead
      p.needs[k] = typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 100
    }
  }
  if (p.stats && typeof p.stats === 'object') {
    for (const k of ['jobsCompleted', 'hustlesCompleted', 'totalEarned', 'totalSpent'] as const) {
      const v = p.stats[k]
      p.stats[k] = typeof v === 'number' && Number.isFinite(v) ? v : 0
    }
  }

  save.version = SAVE_VERSION
  return save
}

/** The last transport verdict (boot narrates a descent honestly). */
export let lastTransportVerdict: 'ok' | 'legacy' | 'missing-key' | 'recovered-shadow' | 'recovered-backup' | 'fresh' | 'none' = 'none'

/** The last write verdict (M15 — the delta law narrates its own skips). */
export let lastWriteVerdict: 'wrote' | 'skip' | 'failed' = 'failed'

export const SaveSystem = {
  SAVE_KEY,
  SAVE_VERSION,
  SHADOW_KEY,

  /** TEST HOOK — pin the device key (deterministic signing in the suite). */
  setFortKey(key: string): void {
    setFortKey(key)
  },

  /** The device fortress key (tests + the UI honesty row may read it). */
  fortKey(): string | null {
    return fortKey()
  },

  /** Does a local save exist? */
  hasSave(): boolean {
    if (!storageAvailable()) return false
    return window.localStorage.getItem(SAVE_KEY) !== null
  },

  /**
   * THE LOAD PLAN — primary → shadow → backup → fresh. The primary wins
   * when it parses AND verifies; a tampered/torn primary falls to the
   * shadow, then the M9 backup slot, then fresh. The last verdict lands
   * in lastTransportVerdict for the boot toast.
   */
  load(): GameSave | null {
    if (!storageAvailable()) return null
    // 1) the primary
    const primaryRaw = window.localStorage.getItem(SAVE_KEY)
    if (primaryRaw) {
      const { save, verdict } = unwrapEnvelope(primaryRaw)
      if (save) {
        const healed = deserialize(primaryRaw)
        if (healed) {
          lastTransportVerdict = verdict === 'legacy' ? 'legacy' : verdict === 'missing-key' ? 'missing-key' : 'ok'
          return healed
        }
      }
    }
    // 2) the shadow (the previous primary — a torn/tampered write's twin)
    const shadowRaw = window.localStorage.getItem(SHADOW_KEY)
    if (shadowRaw) {
      const { save: shadowSave } = unwrapEnvelope(shadowRaw)
      if (shadowSave) {
        const healed = deserialize(shadowRaw)
        if (healed) {
          lastTransportVerdict = 'recovered-shadow'
          // heal forward: drop the broken primary FIRST (never demote tampered
          // bytes into the shadow slot), then re-seal the honest save
          window.localStorage.removeItem(SAVE_KEY)
          this.write(healed, { force: true })
          return healed
        }
      }
    }
    // 3) the M9 backup slot (the guest loop's never-lose-progress copy)
    try {
      const backupRaw = window.localStorage.getItem('lokoja-life:backup')
      if (backupRaw) {
        const parsed = JSON.parse(backupRaw) as GameSave & { savedAs?: string }
        if (parsed && parsed.player) {
          const healed = deserialize(JSON.stringify(parsed))
          if (healed) {
            lastTransportVerdict = 'recovered-backup'
            window.localStorage.removeItem(SAVE_KEY)
            window.localStorage.removeItem(SHADOW_KEY)
            this.write(healed, { force: true })
            return healed
          }
        }
      }
    } catch {
      /* the backup slot is corrupt — the descent continues */
    }
    lastTransportVerdict = 'fresh'
    return null
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
   */
  write(save: GameSave, opts?: { force?: boolean }): boolean {
    if (!storageAvailable()) {
      lastWriteVerdict = 'failed'
      return false
    }
    try {
      const dataStr = serialize(save)
      const fingerprint = stateFingerprint(save)
      const primaryRaw = window.localStorage.getItem(SAVE_KEY)
      // THE SKIP LAW is strict: the skip is only safe when the recovery
      // ladder keeps ALL its rungs — the primary intact, the fingerprint
      // matching, AND the shadow already holding a twin. A first write
      // (no shadow yet) always lands for real, so the descent always
      // has somewhere honest to fall.
      if (
        !opts?.force && primaryRaw !== null &&
        window.localStorage.getItem(SHADOW_KEY) !== null &&
        window.localStorage.getItem(DELTA_HASH_KEY) === fingerprint
      ) {
        // the bytes on disk ARE this payload — verify the envelope still
        // stands (a tampered primary must never ride a delta skip)
        const { save: intact } = unwrapEnvelope(primaryRaw)
        if (intact) {
          lastWriteVerdict = 'skip'
          return true
        }
      }
      // 1) double-buffer: copy the current primary into the shadow
      if (primaryRaw !== null) {
        window.localStorage.setItem(SHADOW_KEY, primaryRaw)
      }
      // 2) serialize + sign + write the primary
      window.localStorage.setItem(SAVE_KEY, wrapEnvelope(dataStr))
      window.localStorage.setItem(DELTA_HASH_KEY, fingerprint)
      lastWriteVerdict = 'wrote'
      return true
    } catch {
      lastWriteVerdict = 'failed'
      return false
    }
  },

  /** The last write verdict ('wrote' | 'skip' | 'failed') — the delta law's honesty line. */
  writeVerdict(): typeof lastWriteVerdict {
    return lastWriteVerdict
  },

  /** M15 — the hash of the last payload that hit disk (the delta book). */
  lastWriteHash(): string | null {
    if (!storageAvailable()) return null
    return window.localStorage.getItem(DELTA_HASH_KEY)
  },

  /** M15 — the hash of the last payload the cloud accepted (zero-byte push law). */
  lastPushedHash(): string | null {
    if (!storageAvailable()) return null
    return window.localStorage.getItem(PUSHED_HASH_KEY)
  },

  /** M15 — record the pushed fingerprint after a successful vault write. */
  markPushed(save: GameSave): void {
    if (!storageAvailable()) return
    try {
      window.localStorage.setItem(PUSHED_HASH_KEY, stateFingerprint(save))
    } catch { /* storage full — the next push just sends the payload again */ }
  },

  /** M15 — the state fingerprint of a save (the delta book's own law). */
  fingerprintOf(save: GameSave): string {
    return stateFingerprint(save)
  },

  /** M20 — the exact string the vault last accepted (the delta's base; null on a fresh device). */
  lastPushedEnv(): string | null {
    if (!storageAvailable()) return null
    return window.localStorage.getItem(LAST_PUSHED_ENV_KEY)
  },

  /** M20 — record the accepted string after a successful vault write. */
  markPushedEnv(env: string): void {
    if (!storageAvailable()) return
    try {
      window.localStorage.setItem(LAST_PUSHED_ENV_KEY, env)
    } catch { /* storage full — the next push just goes whole-envelope */ }
  },

  /** M20 — sign an exact envelope string with the device key (the delta path's sig). */
  sigForString(envStr: string): string {
    const key = fortKey()
    return key ? signPayload(envStr, key) : ''
  },

  /** Remove the save (used by "Start Over"). */
  clear(): void {
    if (!storageAvailable()) return
    window.localStorage.removeItem(SAVE_KEY)
    window.localStorage.removeItem(SHADOW_KEY)
    window.localStorage.removeItem(DELTA_HASH_KEY)
    window.localStorage.removeItem(PUSHED_HASH_KEY)
    window.localStorage.removeItem(LAST_PUSHED_ENV_KEY)
  },

  /** The raw signed envelope of the primary (the cloud push carries it whole). */
  readEnvelope(): string | null {
    if (!storageAvailable()) return null
    return window.localStorage.getItem(SAVE_KEY)
  },

  /** The last transport verdict (the boot toast + the honesty row). */
  transportVerdict(): typeof lastTransportVerdict {
    return lastTransportVerdict
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
