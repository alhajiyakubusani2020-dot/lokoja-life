/**
 * SAVEBOOT SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1247-1248, 1262-1264, 1267-1267, 1291-1303, 1307-1484, 4531-4786, 5471-5548.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, SaveBootSlice } from '../types'
import { DEFAULT_AVATAR } from '../../data/avatar'
import {
  STARTING,
  WORK,
  FORTRESS,
  BIZ,
  CHAOS,
  LADDER,
  SHIELD,
  PULSE,
} from '../../data/config'
import { audio, syncAudioWithSettings } from '../../systems/audio'
import { freshCalendarState } from '../../systems/calendar'
import { freshChaosState } from '../../systems/chaos'
import { freshForgeState } from '../../systems/citypack'
import { freshCivicState } from '../../systems/civic'
import { refreshDeviceProfile } from '../../systems/device'
import { freshEducationState } from '../../systems/education'
import {
  freshFortressState,
  verifyPayload,
  configFingerprint,
} from '../../systems/fortress'
import { freshGoalState } from '../../systems/goals'
import {
  gateVerdict,
  applyGrace,
  freshAccountState,
  freshOnboardingState,
  validateHandle,
  validatePin,
  validateContact,
  ageBandForYear,
  mergeVerdict,
  backupPayload,
  BACKUP_KEY,
} from '../../systems/guest'
import { haptics } from '../../systems/haptics'
import { freshHousingState } from '../../systems/housing'
import { freshJapaState } from '../../systems/japa'
import { freshLiveState } from '../../systems/live'
import { music } from '../../systems/music'
import { freshNationState } from '../../systems/nation'
import { stopNationSim } from '../../systems/nation-bridge'
import { freshPattiState } from '../../systems/patti'
import { freshPulseState } from '../../systems/pulse'
import { freshRiversState } from '../../systems/rivers'
import { SaveSystem } from '../../systems/save'
import { freshShieldState, validateParentPin } from '../../systems/shield'
import { freshStoryState } from '../../systems/story'
import { freshTelemetryBook } from '../../systems/telemetry'
import { decodeTeleport } from '../../systems/teleport'
import { freshWardrobeState } from '../../systems/wardrobe'
import { useMenuStore, menuSetScreen } from '../menu-store'
import {
  scheduleAutosave,
  applyArrival,
  cloudSaveGate,
  warnSaveFailure,
  startNationBridge,
} from '../shared'
import type {
  PlayerState,
  WorldState,
  AccountState,
} from '../../types'
import { useGameStore } from '../useGameStore' // PH2.5: the boot online-listener reads the composed hook (closure-only, cycle-safe)


/** M16 — the online listener wires itself exactly once. */
let cloudQueueWired = false

export const saveBootSlice: StateCreator<GameStore, [], [], SaveBootSlice> = (set, get) => ({
  booted: false,
  hasSave: false,

  onboarding: freshOnboardingState(),
  account: freshAccountState(),
  guestPreviewStartedAt: null,

  gateOpen: false,

  /* ----------------------------- lifecycle ----------------------------- */

  boot: () => {
    const save = SaveSystem.load()
    const bootSettings = save?.settings ?? { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true }
    syncAudioWithSettings(bootSettings)
    // M19 — the audio/haptic engines ride the settings at boot
    haptics.setEnabled(bootSettings.haptics)
    haptics.setElder(bootSettings.elder)
    music.setEnabled(bootSettings.sound && bootSettings.music)
    set({ booted: true, hasSave: SaveSystem.hasSave(), settings: bootSettings })
    get().bootWorldHooks()
  },

  /** M15/M16 world-boot hooks — the parts of boot() that only matter once
   *  the FAT store exists (postcard decode + the offline queue). Idempotent:
   *  the postcard decode just re-sets the same value, the listener wires
   *  itself exactly once. boot() runs it; the dashboard idle preload and
   *  continueGame run it too, so the menu-only boot can stay thin. */
  bootWorldHooks: () => {
    // M15 — a postcard in the URL: decode it now, land when the city opens
    try {
      const t = new URLSearchParams(window.location.search).get('t')
      if (t) {
        const dec = decodeTeleport(t)
        if (dec.ok) set({ pendingArrival: { code: t.trim(), moment: dec.moment } })
        else set({ pendingArrival: null })
      }
    } catch { /* no window (tests) — the boot continues without a postcard */ }
    // M16 — the offline law: a queued push rides again when the network returns
    try {
      const queued = window.localStorage.getItem('lokoja-life:cloud-queue') === '1'
      if (queued) set({ cloudPending: true })
      if (!cloudQueueWired) {
        cloudQueueWired = true
        window.addEventListener('online', () => { void useGameStore.getState().flushCloudQueue() })
      }
      if (queued && navigator.onLine) void get().flushCloudQueue()
    } catch { /* no window — the queue law sleeps */ }
  },

  /* ---------------------------- core actions ---------------------------- */

  startNewGame: (name, gender, avatar, ageBand = 'adult') => {
    const player: PlayerState = {
      name: name.trim() || 'New Hustler',
      gender,
      avatar: { ...DEFAULT_AVATAR, ...avatar },
      ageBand,
      cash: STARTING.cash,
      needs: { ...STARTING.needs },
      skills: { ...STARTING.skills },
      reputation: STARTING.reputation,
      level: STARTING.level,
      xp: STARTING.xp,
      homeId: STARTING.homeId,
      jobId: STARTING.jobId,
      skillXp: { hustle: 0, smart: 0, social: 0 },
      activeOpportunities: [],
      cooldowns: {},
      transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 },
      inventory: [],
      businesses: [],
      missions: {},
      achievements: [],
      discoveries: [],
      vehicles: [],
      bankBalance: 0,
      relationships: {},
    }
    const world: WorldState = {
      day: 1,
      timeOfDay: 'morning',
      weather: 'sunny',
      currentLocation: 'home',
    }
    set({
      player,
      world,
      civic: freshCivicState(),
      chaos: freshChaosState(),
      calendar: freshCalendarState(),
      rivers: freshRiversState(),
      education: freshEducationState(),
      housing: freshHousingState(),
      japa: freshJapaState(),
      goals: freshGoalState(),
      onboarding: freshOnboardingState(),
      // M24-UI — THE IDENTITY SURVIVES THE NEW LIFE: a claim made on the
      // landing rides into the game (the M9 identity IS the player, not
      // the save). An unclaimed start stays unclaimed, exactly as before;
      // resetGame keeps its full wipe — that one is the honest delete.
      account: get().account.linked ? get().account : freshAccountState(),
      shield: freshShieldState(),
      fortress: freshFortressState(),
      cityPulse: freshPulseState(),
      live: freshLiveState(),
      forge: freshForgeState(),
      nation: freshNationState(),
      nationSnapshot: null,
      telemetry: freshTelemetryBook(),
      pendingArrival: get().pendingArrival,
      gateOpen: false,
      fleet: { day: 1, done: [] },
      offers: [],
      // THE RESET IS TOTAL (hardening): the new life is born NEW — the old
      // life's quest book, Patti secrets and wardrobe died with it (the
      // audit caught graduate Musa reborn with chapter 5 done and the
      // white agbada already owned), and no stale transition walks in.
      story: freshStoryState(),
      patti: freshPattiState(),
      wardrobe: freshWardrobeState(),
      isTravelling: false,
      isWorking: false,
      workingLabel: null,
    })
    startNationBridge(get)
    // M15 — a postcard was waiting for a fresh life: land at that street
    const pending = get().pendingArrival
    if (pending) {
      applyArrival(set, get, pending.code, pending.moment, { silent: true })
    }
    scheduleAutosave(get)
    menuSetScreen('game') // the menu store owns screen — this is the writer
  },

  continueGame: () => {
    const save = SaveSystem.load()
    if (!save) return false
    get().bootWorldHooks() // the postcard must exist before the landing reads it
    // M7: defensive graphics default (saves restored from older backups)
    const settings = { ...save.settings, graphics: save.settings.graphics ?? 'auto' }
    syncAudioWithSettings(settings)
    refreshDeviceProfile(settings.graphics)
    set({
      player: save.player,
      world: save.world,
      civic: save.civic,
      chaos: save.chaos ?? freshChaosState(),
      calendar: save.calendar ?? freshCalendarState(),
      rivers: save.rivers ?? freshRiversState(),
      education: save.education ?? freshEducationState(),
      housing: save.housing ?? freshHousingState(),
      japa: save.japa ?? freshJapaState(),
      goals: save.goals ?? freshGoalState(),
      onboarding: save.onboarding ?? freshOnboardingState(),
      // W1-b — THE LOGIN SURVIVES THE LOAD: a just-claimed/logged-in account's
      // token is FRESHER than the save's own line (the register rotates the
      // key; the save was written with the previous one). The save restores
      // the IDENTITY; a live linked session keeps its own key — otherwise
      // every return-login re-enters the wire as a guest (the W10-b
      // reload witness caught this: guest-dark at the parked door).
      account:
        get().account.linked && save.account && save.account.handle === get().account.handle
          ? get().account
          : save.account
            ? { ...freshAccountState(), ...save.account }
            : freshAccountState(),
      shield: save.shield ?? freshShieldState(),
      fortress: save.fortress ?? freshFortressState(),
      cityPulse: save.cityPulse ?? freshPulseState(),
      live: save.live ?? freshLiveState(),
      forge: save.forge ?? freshForgeState(),
      nation: save.nation ?? freshNationState(),
      fleet: save.fleet,
      settings,
      // THE BOUNDARY LAW (hardening): the old session's transition timers
      // and flags die at the load — a travel that was mid-flight in the
      // PREVIOUS life never lands its cash in this one
      isTravelling: false,
      isWorking: false,
      workingLabel: null,
    })
    startNationBridge(get)
    // M15 — a postcard came with the boot URL: land the moment the city opens
    const pendingBoot = get().pendingArrival
    if (pendingBoot) {
      const verdict = gateVerdict(get().account, pendingBoot.moment.locId, save.world.day)
      if (!verdict.blocked) applyArrival(set, get, pendingBoot.code, pendingBoot.moment)
      else set({ gateOpen: true })
    }
    menuSetScreen('game') // the menu store owns screen — this is the writer
    return true
  },

  returnToMenu: () => {
    get().saveNow()
    set({ hasSave: SaveSystem.hasSave() })
    menuSetScreen('menu') // the menu store owns screen — this is the writer
    useMenuStore.getState().refreshFromDisk() // the menu re-reads disk truth
  },

  /** M13 — THE FAMILY SHIELD register law: a minor account only exists
   *  behind a parent's PIN and collects NOTHING — no contact, no recovery
   *  line. The birth year is the honest truth: if it yields a different
   *  band than the character's, the birth year wins (and the city tells you). */
  registerAccount: async (input) => {
    const vHandle = validateHandle(input.handle)
    if (!vHandle.ok) return { ok: false, why: vHandle.why }
    const vPin = validatePin(input.pin)
    if (!vPin.ok) return { ok: false, why: vPin.why }
    const year = new Date().getFullYear()
    const band = ageBandForYear(input.birthYear, year)
    if (!band) return { ok: false, why: 'Enter the year you were born.' }
    const minor = band !== 'adult'
    // M13 — zero collection: minors answer to the parent PIN alone
    let contact = input.contact.trim()
    let parentPin: string | undefined
    if (minor) {
      if (!input.parentPin) return { ok: false, why: 'A parent must set the shield PIN — minors dey register behind a parent.' }
      const vParent = validateParentPin(input.parentPin)
      if (!vParent.ok) return { ok: false, why: vParent.why }
      parentPin = input.parentPin
      contact = '' // never stored for a minor — zero data collection
    } else if (input.contact.trim()) {
      // W1 — the v2 register law: contact optional, validated-if-present
      const vContact = validateContact(input.contact)
      if (!vContact.ok) return { ok: false, why: vContact.why }
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: input.handle.trim(),
          contact,
          pin: input.pin,
          ageBand: band,
          parentPin,
          // W1 — the whole face rides the claim: display name, look, bio
          displayName: input.displayName,
          avatarLook: input.avatarLook,
          bio: input.bio ?? '',
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        why?: string
        token?: string
        profile?: { handle: string; displayName: string; avatarLook: string; bio: string | null } | null
      }
      if (!res.ok || !data.ok || !data.token) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      // the birth year is the law: the character's band syncs to it
      const p = get().player
      const changed = p && p.ageBand !== band
      if (p && changed) set({ player: { ...p, ageBand: band } })
      set({
        account: {
          linked: true,
          handle: input.handle.trim(),
          token: data.token,
          ageBand: band,
          gateGraceDay: get().world?.day ?? 0,
          // W1 — the ProfileRow mirror lands with the token (server truth)
          displayName: data.profile?.displayName ?? null,
          avatarLook: data.profile?.avatarLook ?? null,
          bio: data.profile?.bio ?? null,
        },
        gateOpen: false,
      })
      get().notify({ icon: '🪪', text: changed
        ? `You don claim your name — welcome, ${input.handle.trim()}! (Birth year say ${band.toUpperCase()} — the city adjust to am.)`
        : `You don claim your name — welcome, ${input.handle.trim()}! Your hustle don dey cloud now.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
      scheduleAutosave(get)
      void get().pushCloud()
      // M15 — the postcard the gate held lands behind the claimed name
      const pendingReg = get().pendingArrival
      const worldReg = get().world
      if (pendingReg && worldReg) applyArrival(set, get, pendingReg.code, pendingReg.moment)
      return { ok: true }
    } catch {
      return { ok: false, why: 'Network no gree — check connection and try again.' }
    }
  },

  /**
   * W1 — THE FACE EDITS ITSELF. PATCH /api/profile with the bearer;
   * the server's verdict wins and the mirror lands in the account.
   * Unlinked faces edit device-side through the creation flow — the
   * street only sees claimed profiles.
   */
  updateProfile: async (input) => {
    const acct = get().account
    if (!acct.linked || !acct.token) return { ok: false, why: 'Claim your name first — the street sees claimed faces only.' }
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${acct.token}` },
        body: JSON.stringify(input),
      })
      const data = (await res.json()) as {
        ok?: boolean
        why?: string
        profile?: { handle: string; displayName: string; avatarLook: string; bio: string | null } | null
      }
      if (!res.ok || !data.ok) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      set({
        account: {
          ...get().account,
          displayName: data.profile?.displayName ?? get().account.displayName,
          avatarLook: data.profile?.avatarLook ?? get().account.avatarLook,
          bio: data.profile?.bio ?? null,
        },
      })
      get().notify({ icon: '🪪', text: 'Your face don update — the city go see am.', tone: 'good' })
      return { ok: true }
    } catch {
      return { ok: false, why: 'Network no gree — check connection and try again.' }
    }
  },

  /**
   * W1 — THE PREVIEW CLOCK. Called once at world entry by the diegetic
   * layer when the player walks UNLINKED; the second call is a no-op
   * (the clock starts once, honestly). Session-scope — never saved.
   */
  markGuestPreview: () => {
    if (get().account.linked) return
    if (get().guestPreviewStartedAt) return
    set({ guestPreviewStartedAt: Date.now() })
  },

  /** M9 — return to a claimed name: the merge law decides, nothing is lost. */
  loginAccount: async (input) => {
    const vHandle = validateHandle(input.handle)
    if (!vHandle.ok) return { ok: false, why: vHandle.why }
    const vPin = validatePin(input.pin)
    if (!vPin.ok) return { ok: false, why: vPin.why }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: input.handle.trim(), pin: input.pin }),
      })
      const data = (await res.json()) as { ok?: boolean; why?: string; token?: string; save?: import('../../types').GameSave | null; sig?: string | null; band?: string | null; profile?: { handle: string; displayName: string; avatarLook: string; bio: string | null } | null }
      if (!res.ok || !data.ok || !data.token) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      const local = SaveSystem.load()
      let cloud = data.save ?? null
      // F2 — THE PULL GATE: the vault row is client-authored data and used to
      // ride RAW into set() (a crafted/foreign save booted straight in). It now
      // passes the same defensive path as a local load: the fortress HMAC
      // (verifyPayload under THIS device's key), then the deserialize reject
      // law mirrored through the public surface (future version / missing
      // player / insane scalar → refuse). A refused row NEVER touches the
      // store: it lands in the backup slot (never-lose-progress) and the
      // login falls back to the device's own books — fresh/guest when
      // nothing local exists.
      if (cloud) {
        const gate = cloudSaveGate(cloud, typeof data.sig === 'string' ? data.sig : '', SaveSystem.fortKey())
        if (!gate.ok) {
          try { localStorage.setItem(BACKUP_KEY, backupPayload(cloud)) } catch { /* storage full — the refusal stands */ }
          get().notify({ icon: '🛡️', text: `Cloud save no pass the gate (${gate.why}) — this device dey continue with him own books.`, tone: 'bad' })
          audio.play('notify')
          cloud = null
        }
      }
      // M17 — the account row's band is the canonical tier law (the
      // register stored it; the save's player band is the fallback)
      const bandFromRegister = (['kid', 'teen', 'adult'].includes(String(data.band)) ? data.band : null) as AccountState['ageBand']
      if (cloud && local) {
        const verdict = mergeVerdict(local, cloud)
        const winner = verdict.winner === 'cloud' ? cloud : local
        const loser = verdict.backup
        if (loser) {
          // never-lose-progress: the loser lands in the backup slot, byte-safe
          try { localStorage.setItem(BACKUP_KEY, backupPayload(loser)) } catch { /* storage full — the save itself still loads */ }
        }
        set({
          account: {
            linked: true,
            handle: input.handle.trim(),
            token: data.token,
            ageBand: bandFromRegister ?? (cloud.player as unknown as { ageBand?: AccountState['ageBand'] }).ageBand ?? null,
            gateGraceDay: get().world?.day ?? 0,
            // W1 — the face rides home (server truth; pre-W1 names stay null)
            displayName: data.profile?.displayName ?? null,
            avatarLook: data.profile?.avatarLook ?? null,
            bio: data.profile?.bio ?? null,
          },
          player: winner.player,
          world: winner.world,
          civic: winner.civic,
          chaos: winner.chaos ?? freshChaosState(),
          calendar: winner.calendar ?? freshCalendarState(),
          rivers: winner.rivers ?? freshRiversState(),
          education: winner.education ?? freshEducationState(),
          housing: winner.housing ?? freshHousingState(),
          japa: winner.japa ?? freshJapaState(),
          fleet: winner.fleet ?? { day: winner.world.day, done: [] },
          goals: winner.goals ?? freshGoalState(),
          onboarding: winner.onboarding ?? freshOnboardingState(),
          shield: winner.shield ?? freshShieldState(),
          fortress: winner.fortress ?? freshFortressState(),
          cityPulse: winner.cityPulse ?? freshPulseState(),
          live: winner.live ?? freshLiveState(),
          forge: winner.forge ?? freshForgeState(),
          story: winner.story ?? freshStoryState(),
          patti: winner.patti ?? freshPattiState(),
          wardrobe: winner.wardrobe ?? freshWardrobeState(),
          nation: winner.nation ?? freshNationState(),
          gateOpen: false,
        })
        get().notify({ icon: '🪪', text: `Welcome back, ${input.handle.trim()}! ${verdict.why}`, tone: 'good' })
      } else {
        set({
          account: {
            linked: true,
            handle: input.handle.trim(),
            token: data.token,
            ageBand: bandFromRegister,
            gateGraceDay: get().world?.day ?? 0,
            displayName: data.profile?.displayName ?? null,
            avatarLook: data.profile?.avatarLook ?? null,
            bio: data.profile?.bio ?? null,
          },
          gateOpen: false,
        })
        get().notify({ icon: '🪪', text: `Welcome back, ${input.handle.trim()}!`, tone: 'good' })
      }
      audio.play('chime')
      haptics.fire('reward')
      scheduleAutosave(get)
      void get().pushCloud()
      // M15 — the postcard the gate held lands behind the claimed name
      const pendingLog = get().pendingArrival
      const worldLog = get().world
      if (pendingLog && worldLog) applyArrival(set, get, pendingLog.code, pendingLog.moment)
      return { ok: true }
    } catch {
      return { ok: false, why: 'Network no gree — check connection and try again.' }
    }
  },

  /** M9 — "Maybe later": today rides free, tomorrow the gate stands again. */
  acceptGateGrace: () => {
    const day = get().world?.day ?? 0
    set({ account: applyGrace(get().account, day), gateOpen: false })
    get().notify({ icon: '🤝', text: 'Today na free ride — tomorrow, come claim your name.', tone: 'neutral' })
    audio.play('notify')
    // M15 — a postcard the gate was holding lands the moment the grace lands
    const pending = get().pendingArrival
    const world = get().world
    if (pending && world) applyArrival(set, get, pending.code, pending.moment)
  },

  closeGate: () => set({ gateOpen: false }),

  saveNow: () => {
    const { player, world, civic, fleet, chaos, calendar, rivers, education, housing, japa, goals, onboarding, account, settings } = get()
    if (!player || !world || !civic) return
    const existing = SaveSystem.load()
    const wrote = SaveSystem.write({
      version: SaveSystem.SAVE_VERSION,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      player,
      world,
      civic,
      fleet,
      chaos,
      calendar,
      rivers,
      education,
      housing,
      japa,
      goals,
      onboarding,
      account,
      shield: get().shield,
      fortress: { ...get().fortress, fingerprint: configFingerprint({ STARTING, WORK, BIZ, CHAOS, LADDER, FORTRESS, PULSE }) },
      cityPulse: get().cityPulse ?? freshPulseState(),
      live: get().live ?? freshLiveState(),
      forge: get().forge ?? freshForgeState(),
      story: get().story,
      patti: get().patti,
      wardrobe: get().wardrobe,
      nation: get().nation ?? freshNationState(),
      settings,
    })
    set({ hasSave: true })
    if (!wrote) warnSaveFailure(get)
  },

  resetGame: () => {
    SaveSystem.clear()
    stopNationSim()
    set({
      player: null,
      world: null,
      civic: null,
      fleet: { day: 1, done: [] },
      chaos: freshChaosState(),
      calendar: freshCalendarState(),
      rivers: freshRiversState(),
      education: freshEducationState(),
      housing: freshHousingState(),
      japa: freshJapaState(),
      goals: freshGoalState(),
      onboarding: freshOnboardingState(),
      account: freshAccountState(),
      shield: freshShieldState(),
      fortress: freshFortressState(),
      cityPulse: freshPulseState(),
      live: freshLiveState(),
      forge: freshForgeState(),
      nation: freshNationState(),
      nationSnapshot: null,
      nationPath: null,
      telemetry: freshTelemetryBook(),
      liveWire: null,
      pendingArrival: null,
      cloudPending: false,
      gateOpen: false,
      screen: 'menu',
      hasSave: false,
      // THE RESET IS TOTAL here too: Start Over leaves NOTHING of the old
      // life standing (story/patti/wardrobe/transients — see startNewGame)
      story: freshStoryState(),
      patti: freshPattiState(),
      wardrobe: freshWardrobeState(),
      isTravelling: false,
      isWorking: false,
      workingLabel: null,
    })
  },
})
