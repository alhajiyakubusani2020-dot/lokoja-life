/**
 * NET SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1270-1272, 1276-1280, 4881-5201, 5203-5291, 5293-5398.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 *
 * PH2.5 COMPLETION (Team Bravo, Task 5-b): the ONE deliberate logic change
 * post-split — the client trade/dues reconciliation. The server now holds
 * the trade giveCash (escrow) and the assoc-dues debit on its own purse
 * (WalletRow, live/action txs), so the client's pocket self-application of
 * those legs is gone; the purse mirror (systems/walletnet) takes the ack's
 * server balance instead. Markers: PH2.5-ESCROW-CLIENT / PH2.5-DUES-CLIENT.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, NetSlice } from '../types'
import { audio } from '../../systems/audio'
import { calendarMarketMult, festivalForDay } from '../../systems/calendar'
import { liquidityMultFor } from '../../systems/chaos'
import {
  freshForgeState,
  forgeCity,
  forgeVote as forgeVoteLaw,
  applyVote,
  recordBuild,
  voteWinner,
} from '../../systems/citypack'
import { civicDayRoll } from '../../systems/civic'
import { readFlags, setFlag } from '../../systems/flags'
import { haptics } from '../../systems/haptics'
import {
  freshLiveState,
  sanitizeChat,
  emoteById,
} from '../../systems/live'
import {
  freshNationState,
  recordInflation,
  recordModeration,
  crowdToggle,
  setLiveSnapshot,
} from '../../systems/nation'
import { stopNationSim } from '../../systems/nation-bridge'
import { riverLevelFor, riverMarketMult } from '../../systems/rivers'
import {
  freshTelemetryBook,
  telemetryPayload,
  telemetryDayRoll,
} from '../../systems/telemetry'
import {
  scheduleAutosave,
  startNationBridge,
  nationBridge,
  clearNationBridge,
} from '../shared'
import { useWalletNetStore, walletNetSync } from '../../systems/walletnet'
import type { OsmExtract } from '../../systems/citypack'
import type { WorldPulse } from '../../systems/nation-sim'

/** THE ONE APPLICATION LAW (hardening) — the ack-applied tradeIds: the 12s
 * sync's broadcast of the SAME trade must never pay a second time. Module
 * scope: the book outlives any single sync pass. */
const appliedTrades = new Set<string>()

/** PH2.5-ESCROW-CLIENT: the purse mirror's SERVER-WINS write — the ack's
 *  `balance` (the relay's WalletRow truth, read AFTER its escrow/credit/
 *  dues tx) replaces the mirror, exactly the applyAck law walletnet.ts
 *  already runs. Returns false when the ack carried no usable balance so
 *  the caller can fall back to a full walletNetSync() pull. */
function mirrorServerBalance(balance: unknown): boolean {
  if (typeof balance === 'number' && Number.isFinite(balance)) {
    useWalletNetStore.setState({ balance, syncedAt: Date.now(), lane: 'relay' })
    return true
  }
  return false
}

export const netSlice: StateCreator<GameStore, [], [], NetSlice> = (set, get) => ({
  live: null,
  liveWire: null,
  forge: null,

  nation: freshNationState(),
  nationSnapshot: null,
  nationPath: null,
  opsFlags: readFlags(),
  telemetry: freshTelemetryBook(),

  /* --------------------------- M17 — the live nation --------------------------- */

  /** THE IDENTITY LAW, client side: the mic and the money tables open at
   *  claim. A guest syncs nothing — spectating happens in the UI. */
  liveSync: async () => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    try {
      const res = await fetch('/api/live/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify({
          since: live?.cursor ?? 0,
          presence: { street: world?.currentLocation ?? 'home', status: 'hustling' },
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean; why?: string; cursor?: number
        events?: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[]
        roster?: { handle: string; band: string; street: string; status: string }[]
      }
      if (!res.ok || !data.ok) return { ok: false, why: data.why ?? 'relay no gree' }
      const me = account.handle
      const lv = get().live ?? freshLiveState()
      const moves: { cash: number; why: string; fine?: boolean }[] = []
      let tradeTouchedPurse = false
      for (const ev of data.events ?? []) {
/**
 * THE TRADE LAW: each side applies the accepted trade through its
 * OWN honest engines (the kobo-chain + the income guard chain it)
 */
        if (ev.kind === 'trade' && ev.payload?.accepted) {
          const t = ev.payload as { tradeId?: number | string; from: string; to: string; giveCash: number; wantCash: number }
          // THE ONE APPLICATION LAW (hardening): the accepter already paid
          // and was paid through the ack's own engines — the 12s sync's
          // broadcast of the SAME tradeId must never pay twice (the audit
          // caught the double-credit: ack path + sync path, no book).
          const alreadyApplied = t.to === me && t.tradeId !== undefined && appliedTrades.has(String(t.tradeId))
          if (!alreadyApplied) {
            // PH2.5-ESCROW-CLIENT: the server holds the giveCash leg now —
            // escrowed from the offerer's PURSE at offer, credited to the
            // recipient's PURSE at accept (live/action escrow txs). The sync
            // applies only the client-held wantCash leg; the purse mirror
            // re-pulls server truth after the loop.
            if (t.from === me && (t.wantCash ?? 0) > 0) moves.push({ cash: t.wantCash ?? 0, why: `trade with ${t.to}` })
            if (t.to === me && (t.wantCash ?? 0) > 0) moves.push({ cash: -(t.wantCash ?? 0), why: `paid for trade from ${t.from}` })
            tradeTouchedPurse = true
          }
        }
        // THE COURT GUARANTEE: a fine against me lands through my engines
        if (ev.kind === 'court' && ev.payload?.defaulter === me) {
          const fine = Number(ev.payload.fine ?? 0)
          if (fine > 0) moves.push({ cash: -fine, why: 'Market Union fine — the round still paid', fine: true })
        }
      }
      set({
        live: { ...lv, cursor: data.cursor ?? lv.cursor },
        liveWire: { roster: data.roster ?? [], events: data.events ?? [] },
      })
      for (const m of moves) {
        if (m.cash > 0) get().addMoney(m.cash, { label: m.why, category: 'other' })
        else if (m.cash < 0) {
          // PH2.5-ESCROW-CLIENT: the negative leg labels ITSELF now — the
          // finesPaid bump + ⚖️ court notify ride m.fine only, so a synced
          // trade payment is no longer booked as a Market Union fine.
          const ok = get().removeMoney(-m.cash, { label: m.why, category: 'other' })
          if (ok && m.fine) {
            const cur = get().live ?? freshLiveState()
            set({ live: { ...cur, finesPaid: cur.finesPaid + -m.cash } })
            get().notify({ icon: '⚖️', text: `The court collected ₦${(-m.cash).toLocaleString()} — the circle still paid.`, tone: 'bad' })
          }
        }
      }
      // PH2.5-ESCROW-CLIENT: a synced accept moved PURSE naira server-side —
      // the mirror re-pulls server truth (THE SERVER WINS, walletnet.ts).
      if (tradeTouchedPurse) void walletNetSync().catch(() => {})
      return { ok: true, roster: data.roster ?? [], events: data.events ?? [] }
    } catch {
      return { ok: false, why: 'offline — the nation waits' }
    }
  },

  /** a raw relay read (boards + inboxes) — thin, tokened, honest */
  liveAction: async (action, payload = {}) => {
    const { account } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    try {
      const res = await fetch('/api/live/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify({ action, payload }),
      })
      const data = (await res.json()) as { ok?: boolean; why?: string } & Record<string, unknown>
      return res.ok && data.ok ? { ok: true, ...data } : { ok: false, why: data.why ?? 'relay no gree' }
    } catch {
      return { ok: false, why: 'offline' }
    }
  },

  /** THE TIERED CHAT LAW, client side first (the relay re-judges). */
  liveSendChat: async (text, channel = 'global') => {
    const { account, live, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'guest-mic-dark' }
    const band = (account.ageBand ?? 'adult') as 'kid' | 'teen' | 'adult'
    const verdict = sanitizeChat({ handle: account.handle, band }, text)
    if (!verdict.ok) {
      if (verdict.why) get().recordModerationHit(verdict.why) // M20 — the ops book counts the refusal (no text, by type)
      return { ok: false, why: verdict.why }
    }
    const res = await get().liveAction('chat', { text: verdict.text, channel })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, stats: { ...lv.stats, chats: lv.stats.chats + 1 } } })
    if (verdict.stripped) {
      get().notify({ icon: '🚫', text: 'Link no dey pass for here — the words went, the talk stayed.', tone: 'neutral' })
    }
    void world
    return { ok: true, stripped: verdict.stripped }
  },

  liveSendEmote: async (emoteId, channel = 'global') => {
    const { account, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'guest-mic-dark' }
    const emote = emoteById(emoteId)
    if (!emote) return { ok: false, why: 'no-such-emote' }
    const res = await get().liveAction('emote', { emoteId, channel })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, stats: { ...lv.stats, emotes: lv.stats.emotes + 1 } } })
    return { ok: true }
  },

  /** THE JOIN-TELEPORT LAW: my street travels as an M15 postcard. */
  liveShareJoin: async (code) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const street = world?.currentLocation ?? 'home'
    const res = await get().liveAction('join', { code, street })
    return res.ok ? { ok: true } : { ok: false, why: res.why }
  },

  liveOpenStream: async (kind, title) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('stream-open', { kind, title, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    get().notify({ icon: '📡', text: `You dey live — ${String((res as { title?: string }).title ?? title)}. Viewers na crowd!`, tone: 'good' })
    return { ok: true, streamId: (res as { streamId?: string }).streamId }
  },

  liveViewStream: async (streamId) => {
    const { live } = get()
    const res = await get().liveAction('stream-view', { streamId })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, stats: { ...lv.stats, streamsWatched: lv.stats.streamsWatched + 1 } } })
    return { ok: true, viewers: (res as { viewers?: number }).viewers }
  },

  liveCloseStream: async (streamId) => {
    const res = await get().liveAction('stream-close', { streamId })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true, peakViewers: (res as { peakViewers?: number }).peakViewers }
  },

  liveFoundAssoc: async (name, motto) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-found', { name, motto, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const assocId = (res as { assocId?: string }).assocId ?? null
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, assocId } })
    get().notify({ icon: '🏛️', text: `${name} don stand — the books dey sealed.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    return { ok: true, assocId: assocId ?? undefined }
  },

  liveJoinAssoc: async (assocId) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-join', { assocId, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, assocId } })
    return { ok: true }
  },

  /** THE TREASURY LAW: the relay books the move — the SERVER purse pays it. */
  livePayDues: async (assocId, amount) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, why: 'bad-amount' }
    const res = await get().liveAction('assoc-dues', { assocId, amount, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    // PH2.5-DUES-CLIENT: the relay debited my SERVER purse inside the dues
    // tx (live/action 'assoc-dues' → conditional WalletRow decrement) — the
    // client removeMoney here was a SECOND, pocket-side debit. The ack's
    // `balance` is server truth: the mirror takes it, sync-pull only if absent.
    if (!mirrorServerBalance((res as { balance?: number }).balance)) void walletNetSync().catch(() => {})
    get().notify({ icon: '🤝', text: `₦${amount.toLocaleString()} dues land for the union books.`, tone: 'neutral' })
    return { ok: true }
  },

  /** THE TWO-KEY LAW: president + one officer, or the books don't move. */
  liveWithdrawAssoc: async (assocId, amount, coSigner) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-withdraw', { assocId, amount, coSigner, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    get().addMoney(amount, { label: `union withdrawal (co-signed by ${coSigner})`, category: 'other' })
    const lv = get().live ?? freshLiveState()
    set({ live: { ...lv, coSigned: [...lv.coSigned, `${amount}:${coSigner}`].slice(-24) } })
    get().notify({ icon: '🏛️', text: `₦${amount.toLocaleString()} out of the union books — two keys turned.`, tone: 'good' })
    return { ok: true }
  },

  liveFileContract: async (assocId, terms, stake, parties) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-contract', { assocId, terms, stake, parties, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true }
  },

  /** THE COURT LAW: file it, the hash judges it. */
  liveFileDispute: async (assocId, contractId, evidence) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-dispute', { assocId, contractId, evidence, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const verdict = (res as { verdict?: string }).verdict
    get().notify({ icon: '⚖️', text: `The Market Union talk: ${verdict === 'broken' ? 'THE CONTRACT BREAK — the liable party pays the stake.' : 'the contract stands.'}`, tone: verdict === 'broken' ? 'neutral' : 'good' })
    return { ok: true, verdict }
  },

  liveOfferTrade: async (to, giveCash, wantCash, terms) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('trade-offer', { to, giveCash, wantCash, terms, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    // PH2.5-ESCROW-CLIENT: the relay took the escrow from my SERVER purse
    // inside the offer tx (conditional giveCash debit) — the pocket owes
    // nothing at offer; the mirror takes the ack's post-escrow `balance`.
    if (!mirrorServerBalance((res as { balance?: number }).balance)) void walletNetSync().catch(() => {})
    return { ok: true }
  },

  /** THE TRADE LAW: the relay books the giveCash leg server-side (escrow
   *  in at offer, credit out at accept); MY pocket pays only the one
   *  client-held leg (wantCash) — and a replayed ack moves nothing. */
  liveAcceptTrade: async (tradeId) => {
    const { account } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('trade-accept', { tradeId })
    if (!res.ok) return { ok: false, why: res.why }
    const t = (res as { trade?: { id?: number | string; from: string; to: string; giveCash: number; wantCash: number; terms: string } }).trade
    const replayed = (res as { replayed?: boolean }).replayed === true
    if (t && t.to === account.handle) {
      // THE ONE APPLICATION LAW (hardening): this ack is THE application —
      // the tradeId joins the book so the 12s sync's broadcast of the same
      // trade is recognized and skipped, never a double credit/debit
      if (t.id !== undefined) {
        if (appliedTrades.size > 200) appliedTrades.clear()
        appliedTrades.add(String(t.id))
      }
      if (!replayed) {
        // PH2.5-ESCROW-CLIENT: the relay credited my SERVER purse inside the
        // accept tx (exactly once, idempotent by the offered→accepted flip) —
        // the client addMoney(giveCash) double-paid it. The pocket's only leg
        // is the wantCash payment (its escrow is the documented debt); the
        // mirror takes the ack's post-credit `balance` (THE SERVER WINS).
        if (t.wantCash > 0) get().removeMoney(t.wantCash, { label: `paid for trade from ${t.from}`, category: 'other' })
        if (!mirrorServerBalance((res as { balance?: number }).balance)) void walletNetSync().catch(() => {})
        const lv = get().live ?? freshLiveState()
        set({ live: { ...lv, stats: { ...lv.stats, tradesDone: lv.stats.tradesDone + 1 } } })
        get().notify({ icon: '🤝', text: `Trade sealed with ${t.from} — ₦${t.giveCash.toLocaleString()} don enter your nation purse.`, tone: 'good' })
        audio.play('chime')
        haptics.fire('reward')
      }
    }
    return { ok: true }
  },

  liveFoundAjo: async (name, contribution) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('ajo-found', { name, contribution, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const ajoId = (res as { ajoId?: string }).ajoId ?? null
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, circles: [...lv.circles, ajoId ?? ''].filter(Boolean).slice(-12) } })
    get().notify({ icon: '♻️', text: `${name} don open — the ladder don set, nobody dey skip.`, tone: 'good' })
    return { ok: true, ajoId: ajoId ?? undefined }
  },

  liveJoinAjo: async (ajoId) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('ajo-join', { ajoId, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    if (!lv.circles.includes(ajoId)) set({ live: { ...lv, circles: [...lv.circles, ajoId].slice(-12) } })
    return { ok: true }
  },

  /** THE ROUND LAW: my contribution leaves my pocket through the honest
   *  engines (the relay counts the pot, MY wallet pays for it); when the
   *  ladder completes and the pot walks to ME, the payout lands too. */
  livePayAjo: async (ajoId) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const board = await get().liveAction('ajos', {})
    const circles = (board as { circles?: { id: string; contribution: number; name: string }[] }).circles ?? []
    const mine = circles.find((c) => c.id === ajoId)
    if (!mine) return { ok: false, why: 'no-circle' }
    const res = await get().liveAction('ajo-pay', { ajoId, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    get().removeMoney(mine.contribution, { label: `${mine.name} contribution`, category: 'other' })
    get().notify({ icon: '♻️', text: `₦${mine.contribution.toLocaleString()} enter the ${mine.name} pot.`, tone: 'neutral' })
    // the ladder completed and the pot walked to ME (the relay says so)
    if ((res as { paidOut?: string }).paidOut === account.handle) {
      const payout = Number((res as { payout?: number }).payout ?? 0)
      if (payout > 0) {
        get().addMoney(payout, { label: `${mine.name} round payout`, category: 'other' })
        get().notify({ icon: '🎉', text: `${mine.name} pays YOU ₦${payout.toLocaleString()} — the ladder reach your turn!`, tone: 'good' })
        audio.play('chime')
        haptics.fire('reward')
      }
    }
    return { ok: true, paidOut: (res as { paidOut?: string }).paidOut, payout: (res as { payout?: number }).payout }
  },

  liveCourtAjo: async (ajoId) => {
    const { account } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('ajo-court', { ajoId, day: get().world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true }
  },

  liveToggleVoice: () => {
    const lv = get().live ?? freshLiveState()
    const band = get().account.ageBand ?? 'adult'
    if (band !== 'adult') {
      get().notify({ icon: '🎙️', text: 'Voice na adult table — the shield holds.', tone: 'bad' })
      return
    }
    set({ live: { ...lv, voiceOn: !lv.voiceOn } })
    get().notify({ icon: '🎙️', text: !lv.voiceOn ? 'Voice dey ON — same-street proximity only.' : 'Voice don off.', tone: 'neutral' })
  },

  /* --------------------------- M18 — the city forge --------------------------- */

  /** THE FORGE, live on the sample extract: the same honest pipeline the
   *  pilots ride — import → classify → blueprint → QA → ship. The run
   *  records its ledger entry whether it ships or refuses. */
  runForge: () => {
    const world = get().world
    const day = world?.day ?? 1
    // the honest sample extract: a small Lokoja-shaped wire (the same
    // shape a real OSM pull lands in — nodes + ways + tags)
    const extract: OsmExtract = {
      city: 'lokoja',
      nodes: [
        { id: 'n1', lat: 7.79, lon: 6.73 },
        { id: 'n2', lat: 7.80, lon: 6.74 },
        { id: 'n3', lat: 7.81, lon: 6.75 },
        { id: 'n4', lat: 7.795, lon: 6.745 },
        { id: 'n5', lat: 7.785, lon: 6.735 },
        { id: 'n6', lat: 7.805, lon: 6.752 },
      ],
      ways: [
        { id: 'w1', nodes: ['n1', 'n2'], tags: { highway: 'primary', name: 'Ganaja Road' } },
        { id: 'w2', nodes: ['n2', 'n3'], tags: { highway: 'residential', name: 'Zango Street' } },
        { id: 'w3', nodes: ['n4'], tags: { amenity: 'marketplace', name: 'New Market' } },
        { id: 'w4', nodes: ['n5'], tags: { amenity: 'bank', name: 'Community Bank' } },
        { id: 'w5', nodes: ['n6'], tags: { amenity: 'restaurant', name: 'Mama Put' } },
        { id: 'w6', nodes: ['n5', 'n6'], tags: { waterway: 'river', name: 'The Niger' } },
        { id: 'w7', nodes: ['n3'], tags: { building: 'yes' }, }, // unnamed — the import refuses it honestly
      ],
    }
    // the honest stage wall-clock (recorded, never faked — the SLA law
    // audits these against the budgets)
    const stageMinutes = { osm: 12, classify: 31, blueprint: 44, qa: 9, ship: 6 }
    const run = forgeCity(extract, {
      city: 'lokoja' as import('../../systems/citypack').CityId<'lokoja'>,
      name: 'Lokoja',
      country: 'Nigeria',
      version: `lokoja-v1.${day}`,
      colIndex: 100,
      bbox: { minLat: 7.75, maxLat: 7.85, minLon: 6.70, maxLon: 6.80 },
      stageMinutes,
    })
    const fg = get().forge ?? freshForgeState()
    const ledger = recordBuild(fg.ledger, run, day)
    set({ forge: { ...fg, ledger, ranLokoja: true } })
    get().notify(run.manifest
      ? { icon: '🏗️', text: `${run.pack?.name ?? 'Lokoja'} don SHIP — QA ${run.qa?.score ?? 0}/100 in ${run.sla.total} min. A city na data!`, tone: 'good' }
      : { icon: '🚫', text: 'The forge refuse the pack — the QA battery no gree.', tone: 'bad' })
    audio.play(run.manifest ? 'chime' : 'notify')
    return ledger
  },

  /** THE VOTE: the local book moves at once; the ballot box (the relay)
   *  gets it whenever the connection appears — the offline-first law. */
  forgeVote: async (city) => {
    const fg = get().forge ?? freshForgeState()
    const verdict = forgeVoteLaw(fg.votes, city)
    if (!verdict.ok) {
      get().notify({ icon: '🗳️', text: verdict.why === 'capped' ? `Your vote card full — ${fg.votes.mine.length} cities dey your heart already.` : 'You don vote this city before.', tone: 'bad' })
      return { ok: false, why: verdict.why }
    }
    set({ forge: { ...fg, votes: applyVote(fg.votes, city) } })
    get().notify({ icon: '🗳️', text: `Your vote land for ${city} — ${voteWinner(get().forge?.votes ?? fg.votes) === city ? 'and e dey lead!' : 'the race still open.'}`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    // the relay vote rides when claimed (the ballot box keeps the world book)
    const { account } = get()
    if (account.linked && account.token) {
      try {
        await fetch('/api/forge/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
          body: JSON.stringify({ city }),
        })
      } catch { /* offline: the local book holds, the box waits */ }
    }
    return { ok: true }
  },

  /** pull the world's counts (the local seed stays until the box talks) */
  forgeVotesPull: async () => {
    try {
      const res = await fetch('/api/forge/vote')
      const data = (await res.json()) as { ok?: boolean; counts?: Record<string, number> }
      if (!res.ok || !data.ok || !data.counts) return
      const fg = get().forge ?? freshForgeState()
      set({ forge: { ...fg, votes: { ...fg.votes, counts: { ...fg.votes.counts, ...data.counts } } } })
    } catch { /* offline — the seeded book reads */ }
  },

  /* ---------------------- M20 — planet scale + ops ---------------------- */

  nationPulseDay: (newDay) => {
    const world = get().world
    if (!world) return
    const d = Math.max(1, Math.floor(newDay))
    // THE ONE-CHANNEL LAW: the book records the SAME liquidity product
    // the day roll folded into the market (civic.ts's civicDayRoll input)
    const mult = liquidityMultFor(d) * calendarMarketMult(d) * riverMarketMult(d)
    const nation0 = get().nation ?? freshNationState()
    const inf = recordInflation(nation0.inflation, d, mult)
    const nation = inf.recorded ? { ...nation0, inflation: inf.next } : nation0
    if (inf.recorded) set({ nation })
    // the sim hears the day's real facts (weather, the river, the calendar)
    if (nationBridge && nationBridge.alive()) {
      const festival = festivalForDay(d)
      nationBridge.pulse({
        day: d,
        weather: (world.weather ?? 'sunny') as WorldPulse['weather'],
        floodLevel: riverLevelFor(d),
        marketMult: mult,
        festival: festival ? String((festival as { id?: string }).id ?? festival) : null,
      })
    }
    // the telemetry book crosses the day too (its own 30-day window law)
    const tel0 = get().telemetry ?? freshTelemetryBook()
    const tel = telemetryDayRoll(tel0, d)
    if (tel.day !== tel0.day) set({ telemetry: tel })
    // the daily flush — opt-in gated inside the endpoint AND the book
    void get().telemetryFlush()
  },

  recordModerationHit: (why) => {
    const world = get().world
    if (!world) return
    const band = (get().account.ageBand ?? 'adult') as string
    const nation0 = get().nation ?? freshNationState()
    const res = recordModeration(nation0.moderation, world.day, why, band)
    if (!res.recorded) return
    set({ nation: { ...nation0, moderation: res.next } })
  },

  setTelemetryOptIn: (on) => {
    const nation0 = get().nation ?? freshNationState()
    set({ nation: { ...nation0, telemetryOptIn: on }, telemetry: { ...(get().telemetry ?? freshTelemetryBook()), optIn: on } })
    const flags = setFlag('telemetryAsk', true)
    set({ opsFlags: flags })
    get().notify({ icon: '📊', text: on ? 'The city counts quiet numbers for itself — never words, never a child.' : 'Telemetry dark. Your city, your books.' , tone: 'good' })
    scheduleAutosave(get)
  },

  telemetryFlush: async () => {
    const { account, world } = get()
    const book = get().telemetry ?? freshTelemetryBook()
    const payload = telemetryPayload(book)
    if (!payload) return { ok: false, why: 'dark' }
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const band = (account.ageBand ?? 'adult') as 'kid' | 'teen' | 'adult'
    if (band === 'kid') return { ok: false, why: 'no-minor-data' }
    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify({ ...payload, band }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; why?: string }
      if (!res.ok || !data.ok) return { ok: false, why: data.why ?? 'the counter box no gree' }
      return { ok: true }
    } catch {
      return { ok: false, why: 'offline' }
    }
  },

  nationSetCrowd: (on) => {
    const nation0 = get().nation ?? freshNationState()
    const nation = crowdToggle(nation0, on)
    set({ nation })
    if (!on) {
      stopNationSim()
      // PH2.5: the bridge book lives in shared.ts
      clearNationBridge()
      set({ nationSnapshot: null, nationPath: null })
    } else if (get().world) {
      startNationBridge(get)
    }
    get().notify({ icon: '🏙️', text: on ? `The nation breathes — ${nation.crowd.count.toLocaleString()} souls on the thread.` : 'The crowd sleeps — the city is yours alone.', tone: 'good' })
    scheduleAutosave(get)
  },

  opsSetFlag: (key, value) => {
    const flags = setFlag(key, value)
    set({ opsFlags: flags })
    if (key === 'crowdSim') {
      if (!value) {
        stopNationSim()
        // PH2.5: the bridge book lives in shared.ts
        clearNationBridge()
        set({ nationSnapshot: null, nationPath: null })
      } else if (get().world && (get().nation ?? freshNationState()).crowd.on) {
        startNationBridge(get)
      }
    }
  },

  nationSnapshotIngest: (s) => {
    setLiveSnapshot(s)
    set({ nationSnapshot: s })
  },
})
