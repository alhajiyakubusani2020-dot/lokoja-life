/**
 * PULSE SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1269-1269, 1281-1282, 4788-4879, 5400-5469.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, PulseSlice } from '../types'
import { audio } from '../../systems/audio'
import { deltaPushFields } from '../../systems/binarydelta'
import { gateVerdict } from '../../systems/guest'
import {
  freshPulseState,
  pulseForDay,
  markPulseRead,
} from '../../systems/pulse'
import { SaveSystem } from '../../systems/save'
import {
  encodeTeleport,
  decodeTeleport,
  postcardFor,
} from '../../systems/teleport'
import {
  scheduleAutosave,
  applyArrival,
  dayTally,
  shareText,
  payStreetCredit,
} from '../shared'
import type { TeleportMoment } from '../../systems/teleport'

export const pulseSlice: StateCreator<GameStore, [], [], PulseSlice> = (set, get) => ({
  cityPulse: null,

  pendingArrival: null,
  cloudPending: false,

  /* --------------------------- M15 — the city pulse --------------------------- */

  /** Opening the paper marks today's feed read — the unread dot dies honestly. */
  openCityPulse: () => {
    const { player, world, civic, chaos, rivers, calendar, cityPulse } = get()
    if (!player || !world || !civic) return
    const items = pulseForDay({ day: world.day, weather: world.weather, chaos, civic, rivers, calendar })
    set({ cityPulse: markPulseRead(cityPulse ?? freshPulseState(), world.day, items) })
    scheduleAutosave(get)
  },

  /** THE POSTCARD: this moment, signed, ~100 bytes, WhatsApp-ready. */
  shareTeleport: async () => {
    const { player, world } = get()
    if (!player || !world) return { ok: false, why: 'no game' }
    const tally = dayTally(player.transactions, world.day)
    const moment: TeleportMoment = {
      v: 1,
      day: world.day,
      locId: world.currentLocation,
      name: player.name,
      level: player.level,
      rep: player.reputation,
      earned: tally.earned,
      moves: tally.moves,
      trail: tally.trail,
    }
    const enc = encodeTeleport(moment)
    if (!enc.ok) return { ok: false, why: enc.why }
    const card = postcardFor(moment)
    const share = await shareText(get, card.title, card.body, enc.url)
    if (!share.ok) return { ok: false, why: share.why }
    payStreetCredit(get, set)
    scheduleAutosave(get)
    return { ok: true, url: enc.url }
  },

  /** THE HEADLINE: a City Pulse item rides the same share law. */
  sharePulseCard: async (item) => {
    const { world } = get()
    if (!world) return { ok: false, why: 'no game' }
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : ''
    const share = await shareText(get, `${item.icon} ${item.headline}`, item.body, origin || 'Lokoja Life')
    if (!share.ok) return { ok: false, why: share.why }
    payStreetCredit(get, set)
    scheduleAutosave(get)
    return { ok: true }
  },

  /** THE ARRIVAL: a verified postcard lands you on the sender's street — free. */
  arriveByTeleport: (code) => {
    const dec = decodeTeleport(code)
    if (!dec.ok) {
      get().notify({
        icon: '📩',
        text: dec.why === 'tampered'
          ? 'This postcard don break — somebody don edit am. E no go load.'
          : 'This postcard no readable — the code cut off for road.',
        tone: 'bad',
      })
      audio.play('notify')
      return { ok: false, why: dec.why }
    }
    const m = dec.moment
    const { player, world, account } = get()
    if (!player || !world) {
      // a fresh arrival — the postcard waits for the creation flow
      set({ pendingArrival: { code: code.trim(), moment: m } })
      return { ok: true }
    }
    // THE GUEST LAW: the gate stands before a forward leap, even by postcard
    const verdict = gateVerdict(account, m.locId, world.day)
    if (verdict.blocked) {
      set({ gateOpen: true, pendingArrival: { code: code.trim(), moment: m } })
      return { ok: false, why: 'gate' }
    }
    applyArrival(set, get, code.trim(), m)
    return { ok: true }
  },

  /** THE OFFLINE LAW: the queued push rides again the moment the network returns. */
  flushCloudQueue: async () => {
    const { cloudPending, account } = get()
    if (!cloudPending || !account.linked) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return
    const res = await get().pushCloud()
    if (res.ok) {
      set({ cloudPending: false })
      try { window.localStorage.removeItem('lokoja-life:cloud-queue') } catch { /* the flag is cosmetic now */ }
      get().notify({ icon: '☁️', text: 'Network don come back — your save don reach the cloud.', tone: 'good' })
    }
  },

  /** M9 — push the current save to the cloud (linked accounts only). M14: the
   *  envelope's signature rides along. M15: THE ZERO-BYTE PUSH — an unchanged
   *  life costs the network nothing; M16: an offline push QUEUES, it never dies. */
  pushCloud: async () => {
    const { player, world, civic, account } = get()
    if (!player || !world || !civic) return { ok: false, why: 'no game' }
    if (!account.linked || !account.token) return { ok: false, why: 'not linked' }
    // M16 — THE OFFLINE LAW: the queue flag lights NOW (the flush rides the
    // 'online' event), and the honest toast says the network, not the player.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      set({ cloudPending: true })
      try { window.localStorage.setItem('lokoja-life:cloud-queue', '1') } catch { /* the flag rides the session */ }
      return { ok: false, why: 'offline' }
    }
    get().saveNow()
    const save = SaveSystem.load()
    if (!save) return { ok: false, why: 'no save' }
    // M15 — THE ZERO-BYTE PUSH: the vault already holds this exact life
    const pushed = SaveSystem.lastPushedHash()
    if (pushed && pushed === SaveSystem.fingerprintOf(save)) {
      return { ok: true, why: 'delta-skip' }
    }
    // M14 — the signed envelope's sig: the vault stores it beside the save
    let sig = ''
    try {
      const env = JSON.parse(SaveSystem.readEnvelope() ?? '{}') as { sig?: string }
      sig = typeof env.sig === 'string' ? env.sig : ''
    } catch { /* unsigned legacy — the pull treats it as legacy-ok */ }
    // M20 — THE BINARY DELTA PUSH: the wire carries the CHANGE against the
    // exact string the vault accepted last time. A refused patch (a stranger's
    // base, an older server, a torn codec) falls back to the whole envelope —
    // the M9 transport is the fallback, never a wall.
    const nextEnv = JSON.stringify(save)
    const deltaFields = deltaPushFields(SaveSystem.lastPushedEnv(), nextEnv)
    try {
      let res: Response
      if (deltaFields) {
        res = await fetch('/api/cloud/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
          body: JSON.stringify({ schema_version: save.version, patch: deltaFields.patch, sig: SaveSystem.sigForString(nextEnv) }),
        })
      } else {
        res = await fetch('/api/cloud/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
          body: JSON.stringify({ ...SaveSystem.toCloudPayload(save), sig }),
        })
      }
      if (!res.ok && deltaFields) {
        // THE FALLBACK LAW — one honest retry, whole envelope
        res = await fetch('/api/cloud/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
          body: JSON.stringify({ ...SaveSystem.toCloudPayload(save), sig }),
        })
      }
      if (!res.ok) return { ok: false, why: 'cloud refused' }
      SaveSystem.markPushed(save)
      SaveSystem.markPushedEnv(nextEnv)
      set({ cloudPending: false })
      try { window.localStorage.removeItem('lokoja-life:cloud-queue') } catch { /* done */ }
      return { ok: true }
    } catch {
      // M16 — a network failure queues the push; it never dies silently
      set({ cloudPending: true })
      try { window.localStorage.setItem('lokoja-life:cloud-queue', '1') } catch { /* the flag rides the session */ }
      return { ok: false, why: 'network' }
    }
  },
})
