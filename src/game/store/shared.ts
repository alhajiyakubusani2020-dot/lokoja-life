/**
 * SHARED STORE INTERNALS — moved VERBATIM from useGameStore.ts (PH2.5 split).
 * Source lines: 648-1243. The module-level mutable state (autosave timer,
 * id counters, the nation bridge, the self-referencing store ref) and the
 * cross-domain helpers (arrival, share, civic day-roll, autosave, pull gate)
 * live here so every slice imports ONE internals module (no slice↔slice
 * cycles). The composition file binds useGameStoreRef after create().
 */
import type { GameStore } from './types'
import {
  AUTOSAVE,
  GOALS,
  CHILL,
  CIVIC,
  CHAOS,
  FESTIVALS,
  RIVERS,
  LADDER,
  ELDER,
  PULSE,
} from '../data/config'
import { LOCATION_BY_ID } from '../data/locations'
import { audio } from '../systems/audio'
import { bizDayRoll } from '../systems/biz'
import {
  calendarDayRoll,
  calendarMarketMult,
  festivalForDay,
  weddingForCycle,
} from '../systems/calendar'
import { chaosDayRoll, liquidityMultFor } from '../systems/chaos'
import { freshForgeState } from '../systems/citypack'
import { civicDayRoll, efccRewardFor } from '../systems/civic'
import { readFlags } from '../systems/flags'
import { verifyPayload } from '../systems/fortress'
import { haptics } from '../systems/haptics'
import { housingDayRoll } from '../systems/housing'
import { remittanceLands, remittanceApply } from '../systems/japa'
import { freshLiveState } from '../systems/live'
import { freshNationState } from '../systems/nation'
import { startNationSim, stopNationSim } from '../systems/nation-bridge'
import { applyNeedsDelta, applySlotDecay } from '../systems/needs'
import { formatNaira } from '../systems/progression'
import { freshPulseState } from '../systems/pulse'
import {
  riversDayRoll,
  floodBizFactor,
  riverMarketMult,
} from '../systems/rivers'
import { SaveSystem } from '../systems/save'
import type { RegattaResult } from '../systems/calendar'
import type { WorldPulse } from '../systems/nation-sim'
import type { TeleportMoment } from '../systems/teleport'
import type {
  CivicState,
  GameSave,
  Transaction,
  ChaosState,
  CalendarState,
  RiversState,
  HousingState,
  JapaState,
  FestivalDay,
  WeddingDay,
} from '../types'

let saveTimer: ReturnType<typeof setTimeout> | null = null
/** F2 — a failed disk write announces itself ONCE per session (no spam wall). */
let quotaWarned = false
let notificationId = 0
let pulseId = 0
/* appliedTrades moved to slices/net.ts; cloudQueueWired moved to slices/saveBoot.ts (PH2.5) */

/**
 * M15 — THE ARRIVAL LAW: a verified postcard lands the walker on the
 * sender's street, free, no fare, no clock cost. The code joins the
 * arrival book (the ghost card reads it back), the URL cleans itself,
 * and the street credit is NEVER paid to the arrival — credit buys
 * shares, not landings.
 */
export function applyArrival(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  code: string,
  m: TeleportMoment,
  opts?: { silent?: boolean },
): void {
  const world = get().world
  if (!world) return
  const pl = get().cityPulse ?? freshPulseState()
  set({
    world: { ...world, currentLocation: m.locId },
    pendingArrival: null,
    cityPulse: {
      ...pl,
      arrivals: [...pl.arrivals, code].slice(-PULSE.arrivalCap),
      stats: { ...pl.stats, arrivalsIn: pl.stats.arrivalsIn + 1 },
    },
  })
  try {
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  } catch { /* the URL is cosmetic — the arrival already landed */ }
  if (!opts?.silent) {
    const place = LOCATION_BY_ID[m.locId]?.name ?? m.locId
    get().notify({ icon: '📍', text: `You land for ${place} — ${m.name}'s postcard, Day ${m.day}. No fare.`, tone: 'good' })
    audio.play('notify')
    haptics.fire('arrival') // M19 — the postcard buzzes in the pocket
  }
  scheduleAutosave(get)
}

/**
 * M15 — THE DAY TALLY: the ghost card's honest numbers, read off the
 * ledger (the deterministic kernel's own record of the day).
 */
export function dayTally(transactions: Transaction[], day: number): { earned: number; moves: number; trail: number[] } {
  const today = transactions.filter((t) => t.day === day)
  const earned = today.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const cats = new Set<string>()
  const ordered: string[] = []
  for (const t of today) {
    if (!cats.has(t.category)) {
      cats.add(t.category)
      ordered.push(t.category)
    }
  }
  const CATS = ['job', 'hustle', 'transport', 'shop', 'tip', 'other', 'bank', 'fun']
  const trail = ordered.slice(-3).map((c) => Math.max(0, CATS.indexOf(c)))
  while (trail.length < 3) trail.push(0)
  return { earned, moves: today.length, trail }
}

/**
 * M15 — THE SHARE LAW: the Web Share sheet first (WhatsApp sits right
 * there), the clipboard catches the fall. A share only counts when a
 * channel actually accepted it — and the street credit pays once per
 * in-game day, whatever was shared.
 */
export async function shareText(get: () => GameStore, title: string, body: string, url: string): Promise<{ ok: boolean; why?: string }> {
  const text = `${title}\n${body}\n${url}`
  let shared = false
  try {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await navigator.share({ title: 'Lokoja Life', text, url })
      shared = true
    }
  } catch { /* the user closed the sheet — not a share */ }
  if (!shared) {
    try {
      await navigator.clipboard.writeText(text)
      shared = true
      get().notify({ icon: '📋', text: 'Copied — paste am for WhatsApp.', tone: 'good' })
    } catch {
      return { ok: false, why: 'share-refused' }
    }
  }
  return { ok: shared }
}

/**
 * M15 — THE STREET CREDIT: a real share pays +2 rep once per in-game
 * day, through the reward engine (the kobo-chain records it, the
 * income guard watches it). The second share of the day is free
 * labour — the city respects the first one.
 */
export function payStreetCredit(get: () => GameStore, set: (partial: Partial<GameStore>) => void): void {
  const p = get().player
  const world = get().world
  if (!p || !world) return
  // the share book counts every real share — the credit only pays once a day
  const pl0 = get().cityPulse ?? freshPulseState()
  set({ cityPulse: { ...pl0, stats: { ...pl0.stats, shares: pl0.stats.shares + 1 } } })
  const key = PULSE.shareCooldownKey
  if (p.cooldowns[key] === world.day) return
  get().giveReward({ reputation: PULSE.shareStreetCredit }, { label: 'Street credit — shared the city', category: 'other' })
  set({ player: { ...get().player!, cooldowns: { ...get().player!.cooldowns, [key]: world.day } } })
  get().notify({ icon: '🌆', text: `Street credit +${PULSE.shareStreetCredit} — the city hears you.`, tone: 'good' })
}

/** Ledger cap — newest entries survive, old ones fall off. */
export const LEDGER_CAP = 50

/** M9 — the store-wide decay law: Chill Mode runs the body at half drain.
 *  M13 — Elder mode runs it at 0.75×; the kinder law wins when both on. */
export function slotDecay(get: () => GameStore, needs: import('../types').Needs, slots: number) {
  const chill = get().settings.chill ? CHILL.decayMult : 1
  const elder = get().settings.elder ? ELDER.decayMult : 1
  return applySlotDecay(needs, slots, Math.min(chill, elder))
}

/** M9 — the onboarding bump: steps land once, the ₦1,000 lands once. */
export function bumpOnboarding(
  get: () => GameStore,
  set: (partial: Partial<GameStore>) => void,
  step: string,
): void {
  const ob = get().onboarding
  if (ob.done.includes(step)) return
  const done = [...ob.done, step]
  set({ onboarding: { ...ob, done } })
  if (done.length >= GOALS.onboardingSteps.length && !get().onboarding.rewarded) {
    set({ onboarding: { ...get().onboarding, rewarded: true } })
    get().addMoney(GOALS.onboardingReward, { label: 'Street Certified — onboarding complete', category: 'tip' })
    get().notify({ icon: '🏅', text: `STREET CERTIFIED! You don learn the ropes — ${formatNaira(GOALS.onboardingReward)} don land.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
  }
}

/* ------------------------- M2 — civic day machinery ------------------------- */

/** Aggregated results of rolling the civic mesh across one or more days. */
interface CivicAgg {
  nepaPosted: number
  nepaShed: boolean
  taxAssessed: number
  warrantIssued: boolean
  tipsResolved: import('../types').EfccTip[]
  tipReward: number
  /** M8 — chaos narration flags */
  blowoutZone: string | null
  outageFixed: { zoneId: string; fixedBy: 'community' | 'disco' } | null
  scarcityDay: boolean
  payoutDay: boolean
  /** M10 — calendar narration flags */
  festivalMorning: FestivalDay | null
  weddingToday: WeddingDay | null
  pavingDone: { zoneId: string } | null
  pavingStalled: { zoneId: string } | null
  regattaResult: RegattaResult | null
  /** M11 — river narration flags */
  floodedZone: string | null
  drainedZone: string | null
  rescueWake: string | null
  rescueDone: string | null
  riverDamp: boolean
  riverRelief: boolean
  /** M12 — ladder narration flags */
  rentPosted: { amount: number; cycle: number } | null
  wahalaArrived: { kind: string; cost: number; note: string } | null
  lateNotice: boolean
  remittance: boolean
}

/** Pure: roll the civic mesh + the chaos engine + the calendar + the rivers
 *  forward day by day (assessments land on exact days). M6 — the NEW day's
 *  weather rides in so the market roll folds weather stress. M8 — the chaos
 *  roll runs in the SAME loop and its liquidity fold (crunch / payout) rides
 *  into the SAME prices. M10 — the calendar's festival folds ride the SAME
 *  channel too, and the year's parties narrate themselves at the day
 *  crossings. M11 — the river rolls in the SAME loop: the surge lifts every
 *  price through the SAME channel, the bowls take yesterday's crossings and
 *  the deep water wakes the cold-room rescue. */
function civicRollForDays(
  civic: CivicState,
  chaos: ChaosState,
  calendar: CalendarState,
  rivers: RiversState,
  housing: HousingState,
  japa: JapaState,
  totalEarned: number,
  prevDay: number,
  newDay: number,
  bizCount = 0,
  solarCount = 0,
  weather?: import('../types').Weather,
  liquidityMultOverride?: number,
  chill = false,
): { civic: CivicState; chaos: ChaosState; calendar: CalendarState; rivers: RiversState; housing: HousingState; japa: JapaState; agg: CivicAgg } {
  let cur = civic
  let curChaos = chaos
  let curCal = calendar
  let curRiv = rivers
  let curHou = housing
  let curJap = japa
  const agg: CivicAgg = { nepaPosted: 0, nepaShed: false, taxAssessed: 0, warrantIssued: false, tipsResolved: [], tipReward: 0, blowoutZone: null, outageFixed: null, scarcityDay: false, payoutDay: false, festivalMorning: null, weddingToday: null, pavingDone: null, pavingStalled: null, regattaResult: null, floodedZone: null, drainedZone: null, rescueWake: null, rescueDone: null, riverDamp: false, riverRelief: false, rentPosted: null, wahalaArrived: null, lateNotice: false, remittance: false }
  for (let d = prevDay + 1; d <= newDay; d++) {
    // chaos first: today's grid + naira mood decide the market's liquidity
    const c = chaosDayRoll(curChaos, d, weather ?? 'sunny')
    curChaos = c.next
    if (c.blowout) agg.blowoutZone = c.blowout.zoneId
    if (c.fixed) agg.outageFixed = c.fixed
    agg.scarcityDay = agg.scarcityDay || c.scarcity
    agg.payoutDay = agg.payoutDay || c.payout
    // M10 — the year turns: paving lifecycle, regatta stakes, festivals
    const cal = calendarDayRoll(curCal, d)
    curCal = cal.next
    if (cal.pavingDone) agg.pavingDone = cal.pavingDone
    if (cal.pavingStalled) agg.pavingStalled = cal.pavingStalled
    if (cal.regattaResult) agg.regattaResult = cal.regattaResult
    const todayFestival = festivalForDay(d)
    if (todayFestival) agg.festivalMorning = todayFestival
    const wedding = weddingForCycle(d)
    if (wedding.isToday) agg.weddingToday = wedding
    // M11 — the river turns: bowls, rescue, the flood narrations
    const riv = riversDayRoll(curRiv, d)
    curRiv = riv.next
    if (riv.flooded) agg.floodedZone = riv.flooded.zoneId
    if (riv.drained) agg.drainedZone = riv.drained.zoneId
    if (riv.rescueWake) agg.rescueWake = riv.rescueWake.zoneId
    if (riv.rescueDone) agg.rescueDone = riv.rescueDone.zoneId
    agg.riverDamp = agg.riverDamp || riv.damp
    agg.riverRelief = agg.riverRelief || riv.relief
    // M12 — the ladder turns: the rent book, the landlord, the remittance
    const hou = housingDayRoll(curHou, d)
    curHou = hou.next
    if (hou.rentPosted) agg.rentPosted = hou.rentPosted
    if (hou.wahalaArrived) agg.wahalaArrived = hou.wahalaArrived
    agg.lateNotice = agg.lateNotice || hou.lateNotice
    if (remittanceLands(curJap, d)) {
      curJap = remittanceApply(curJap, d)
      agg.remittance = true
    }
    // the water lifts the SAME roll the weather, chaos and calendar ride
    const r = civicDayRoll(cur, totalEarned, d, bizCount, solarCount, weather, liquidityMultOverride ?? liquidityMultFor(d) * calendarMarketMult(d) * riverMarketMult(d), chill)
    cur = r.next
    agg.nepaPosted += r.nepaPosted
    agg.nepaShed = agg.nepaShed || r.nepaShed
    agg.taxAssessed += r.taxAssessed
    agg.warrantIssued = agg.warrantIssued || r.warrantIssued
    agg.tipsResolved = [...agg.tipsResolved, ...r.tipsResolved]
    agg.tipReward += r.tipReward
  }
  return { civic: cur, chaos: curChaos, calendar: curCal, rivers: curRiv, housing: curHou, japa: curJap, agg }
}

/** Execute a civic day crossing: set the slice, pay whistleblower rewards,
 *  apply the shedding mood hit and the warrant reputation hit, narrate it. */
export function commitCivicDays(
  get: () => GameStore,
  set: (partial: Partial<GameStore>) => void,
  prevDay: number,
  newDay: number,
): void {
  const { civic, chaos, calendar, rivers, housing, japa, player, world } = get()
  if (!civic || !player || !world || newDay <= prevDay) return
  const bizCount = player.businesses.length
  // M5 — solar shops draw from the sun: their share of the meter load drops
  const solarCount = player.businesses.filter((b) => b.upgrades.includes('solar')).length
  // M6 — the NEW day's weather (already set by the clock before this call)
  // folds its market stress into the day's prices
  const newWeather = get().world?.weather
  // M9 — Chill Mode runs the whole civic roll kinder (2× disco grace, 3× warrant)
  const chill = get().settings.chill
  const { civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv, housing: rolledHou, japa: rolledJap, agg } = civicRollForDays(civic, chaos, calendar, rivers, housing, japa, player.stats.totalEarned, prevDay, newDay, bizCount, solarCount, newWeather, undefined, chill)
  set({ civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv, housing: rolledHou, japa: rolledJap })

  // M20 — the nation's books + the crowd sim ride the SAME day crossing
  for (let d = prevDay + 1; d <= newDay; d++) get().nationPulseDay(d)

  // M3 — the shops earn while the city turns: accrue into each till (market
  // multipliers read the ALREADY-ROLLED civic slice; M8 — the chaos thread
  // prices the dark days and the scarcity harvest). Tax only sees this
  // money when it is collected (addMoney → ledger → totalEarned).
  if (player.businesses.length > 0) {
    // M11 — the flood crush folds with the grid laws: the worse water wins,
    // the rescue trucks soften the saved zones for the rest of the surge-year
    const bizRes = bizDayRoll(player.businesses, prevDay, newDay, rolled, player.reputation, rolledChaos, (zoneId, day) => floodBizFactor(rolledRiv, zoneId, day))
    if (bizRes.total > 0) {
      const p0 = get().player!
      set({ player: { ...p0, businesses: bizRes.next } })
      get().notify({ icon: '🧺', text: `Your shop${player.businesses.length > 1 ? 's' : ''} made ${formatNaira(bizRes.total)} — go collect am.`, tone: 'good' })
    } else {
      const p0 = get().player!
      set({ player: { ...p0, businesses: bizRes.next } })
    }
  }

  // whistleblower rewards land as honest hustle income (ledger remembers)
  if (agg.tipReward > 0) {
    get().addMoney(agg.tipReward, {
      label: `Whistleblower reward — ${agg.tipsResolved.map((t) => t.label).join(', ')}`,
      category: 'hustle',
    })
  }
  // the day the light goes stings a little
  if (agg.nepaShed) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -CIVIC.nepa.sheddingMoodHit }) } })
  }  // a warrant makes the state learn your name — the wrong way
  if (agg.warrantIssued) {
    get().addReputation(-CIVIC.kgirs.warrantReputationHit)
  }

  // M8 — chaos narration: the boom, the light, the dry naira, the payout
  if (agg.blowoutZone) {
    const zoneName = LOCATION_BY_ID[agg.blowoutZone]?.name ?? agg.blowoutZone
    const p = get().player
    const inZone = world.currentLocation === agg.blowoutZone
    if (p && inZone) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -CHAOS.fixMood }) } })
    get().notify({
      icon: '⚡',
      text: inZone
        ? `BOOM! Transformer don blow for ${zoneName} — your area don go dark!`
        : `Transformer don blow for ${zoneName} — the whole area don go dark.`,
      tone: 'bad',
    })
  }
  if (agg.outageFixed) {
    const zoneName = LOCATION_BY_ID[agg.outageFixed.zoneId]?.name ?? agg.outageFixed.zoneId
    const contributed = agg.outageFixed.fixedBy === 'community'
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: CHAOS.fixMood }) } })
    if (contributed) get().addReputation(CHAOS.fixReputation)
    get().notify({
      icon: '💡',
      text: contributed
        ? `UP NEPA! Community power don return to ${zoneName} — the street go remember you.`
        : `UP NEPA! NEPA don repair the ${zoneName} transformer.`,
      tone: 'good',
    })
  }
  if (agg.scarcityDay) {
    get().notify({ icon: '💸', text: 'Cash scarcity today — ATM dey dry, POS agents don increase price, fuel na black market.', tone: 'neutral' })
  }
  if (agg.payoutDay) {
    get().notify({ icon: '🐷', text: 'Ajo payout day — market traders carry cash today, prices soft small.', tone: 'neutral' })
  }

  // M10 — the calendar narrates itself: festivals, weddings, streets, stakes
  if (agg.festivalMorning) {
    const f = agg.festivalMorning
    const p = get().player
    const mood = FESTIVALS.mood[f.id] ?? 0
    if (p && mood > 0) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood }) } })
    get().notify({ icon: f.icon, text: `${f.name}${f.daysLeft > 1 ? ' (final day)' : ''} — ${f.note}`, tone: 'good' })
  }
  if (agg.weddingToday) {
    const w = agg.weddingToday
    const p = get().player
    const venueName = LOCATION_BY_ID[w.venueId]?.name ?? w.venueId
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: FESTIVALS.mood.wedding }) } })
    get().notify({ icon: '💍', text: `Wedding today! ${w.couple} don tie knot at ${venueName} — aso-ebi dey Kpata.`, tone: 'good' })
  }
  if (agg.pavingDone) {
    const zoneName = LOCATION_BY_ID[agg.pavingDone.zoneId]?.name ?? agg.pavingDone.zoneId
    get().addReputation(FESTIVALS.pavedRep)
    get().notify({ icon: '🛣️', text: `The union don finish paving ${zoneName} — smooth road for the next ${FESTIVALS.pavedDays} days!`, tone: 'good' })
  }
  if (agg.pavingStalled) {
    const zoneName = LOCATION_BY_ID[agg.pavingStalled.zoneId]?.name ?? agg.pavingStalled.zoneId
    get().notify({ icon: '🧱', text: `The ${zoneName} paving pool never full — the union don carry am go next project.`, tone: 'neutral' })
  }
  if (agg.regattaResult) {
    const rr = agg.regattaResult
    if (rr.sponsorWin) {
      get().addMoney(rr.sponsorWin.payout, { label: `Regatta sponsor payout — ${rr.sponsorWin.teamId} win the trophy`, category: 'hustle' })
      get().addReputation(FESTIVALS.sponsorWinRep)
      get().notify({ icon: '🏆', text: `${rr.winner} don win the Regatta! Your sponsorship pay ${formatNaira(rr.sponsorWin.payout)} — the whole shoreline dey call your name.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else if (rr.sponsorLose) {
      get().addReputation(FESTIVALS.sponsorLoseRep)
      get().notify({ icon: '🚤', text: `${rr.winner} carry the Regatta trophy. Your crew no win but the street respect the support.`, tone: 'neutral' })
    }
    if (rr.betWin) {
      get().addMoney(rr.betWin.payout, { label: `Regatta bet won — ${rr.betWin.teamId} at ${FESTIVALS.betOdds}×`, category: 'other' })
      get().notify({ icon: '💸', text: `Your bet don land! ${formatNaira(rr.betWin.payout)} from the shoreline bookie.`, tone: 'good' })
    } else if (rr.betLose > 0) {
      get().notify({ icon: '🎲', text: `Your boat no win — ${formatNaira(rr.betLose)} stay for the bookie hand. Next year again.`, tone: 'bad' })
    }
  }

  // M11 — the river narrates itself: the water, the bowls, the damp
  if (agg.floodedZone) {
    const zoneName = LOCATION_BY_ID[agg.floodedZone]?.name ?? agg.floodedZone
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -2 }) } })
    get().notify({
      icon: '🌊',
      text: `The Niger don rise — ${zoneName} road don go under water. Canoe ferry dey run from the Motor Park.`,
      tone: 'bad',
    })
  }
  if (agg.drainedZone) {
    const zoneName = LOCATION_BY_ID[agg.drainedZone]?.name ?? agg.drainedZone
    get().notify({ icon: '💧', text: `The water don leave ${zoneName} — the road dey open again.`, tone: 'good' })
  }
  if (agg.rescueWake) {
    get().notify({ icon: '🧊', text: `Deep water don reach the cold rooms — the street don pass the rescue bowl for ${LOCATION_BY_ID[agg.rescueWake]?.name ?? agg.rescueWake}.`, tone: 'neutral' })
  }
  if (agg.rescueDone) {
    const zoneName = LOCATION_BY_ID[agg.rescueDone]?.name ?? agg.rescueDone
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: RIVERS.rescue.moodReward }) } })
    get().addReputation(RIVERS.rescue.repReward)
    get().notify({ icon: '🛻', text: `COLD-ROOM RESCUE COMPLETE! The trucks don move the stock to the Patti road high ground — ${zoneName} go hear am for the season.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
  }
  if (agg.riverRelief) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: RIVERS.reliefMood }) } })
    get().notify({ icon: '☀️', text: 'The river don enter back inside him banks — the whole city dey breathe.', tone: 'good' })
  } else if (agg.riverDamp) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -RIVERS.dampMoodHit }) } })
  }

  // M12 — the ladder narrates itself: the rent book, the wahala, the japa money
  if (agg.rentPosted) {
    get().notify({ icon: '🏠', text: `Rent cycle posted — ${formatNaira(agg.rentPosted.amount)} due for the room.`, tone: 'neutral' })
  }
  if (agg.wahalaArrived) {
    get().notify({ icon: '🔑', text: `Landlord wahala: ${agg.wahalaArrived.note}.`, tone: 'neutral' })
  }
  if (agg.lateNotice) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -4 }) } })
    get().addReputation(-2)
    get().notify({ icon: '📄', text: 'QUIT NOTICE: the rent book don fall two cycles behind — the landlord no dey smile again.', tone: 'bad' })
  }
  if (agg.remittance) {
    get().addMoney(LADDER.japa.remittance, { label: 'First remittance — from abroad', category: 'tip' })
    get().notify({ icon: '💸', text: `The first remittance don land — ${formatNaira(LADDER.japa.remittance)} from abroad. The village dey proud of you.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
  }

  if (agg.nepaPosted > 0) {
    get().notify({ icon: '🧾', text: `NEPA bill posted — ${formatNaira(agg.nepaPosted)} due.`, tone: 'neutral' })
  }
  if (agg.nepaShed) {
    get().notify({ icon: '🔌', text: 'Load-shedding: NEPA don cut your light. Settle the bill to reconnect.', tone: 'bad' })
  }
  if (agg.taxAssessed > 0) {
    get().notify({ icon: '🧮', text: `KGIRS assessment: ${formatNaira(agg.taxAssessed)} tax due.`, tone: 'neutral' })
  }
  if (agg.warrantIssued) {
    get().notify({ icon: '🚨', text: 'Tax warrant issued — settle it at the police station.', tone: 'bad' })
  }
  for (const t of agg.tipsResolved) {
    get().notify({ icon: '🕵️', text: `EFCC recovered funds from “${t.label}” — your share: ${formatNaira(efccRewardFor(t))}.`, tone: 'good' })
  }
}

/** F2 — a failed autosave never dies silent: SaveSystem.write returns false on
 *  a full/quota-blocked disk (save.ts catches the setItem throw and reports
 *  failure). The honest message fires once per session, then the flag holds. */
export function warnSaveFailure(get: () => GameStore): void {
  if (quotaWarned) return
  quotaWarned = true
  get().notify({ icon: '💾', text: 'Disk full — progress at risk. Free some space so the city fit save your hustle.', tone: 'bad' })
  audio.play('notify')
}

/** F2 — THE PULL GATE: the same defensive verdict a local load gets, applied
 *  to the vault row BEFORE login may merge it. verifyPayload is the fortress
 *  HMAC over the exact payload under THIS device's key (a foreign envelope
 *  never verifies); the version + shape + scalar gates mirror the deserialize
 *  reject law (F1 hardening lives inside save.ts where deserialize stays
 *  private, so the gate enforces the same law through the public surface:
 *  a future version, a missing player or an insane scalar REFUSES instead
 *  of applying raw). */
export type CloudSaveProbe = {
  version?: unknown
  player?: { cash?: unknown; bankBalance?: unknown; needs?: Partial<Record<'health' | 'energy' | 'hunger' | 'mood', unknown>>; stats?: Partial<Record<'totalEarned' | 'totalSpent', unknown>> } | null
  world?: { day?: unknown } | null
}

export function cloudSaveGate(cloud: GameSave, sig: string, key: string | null): { ok: true } | { ok: false; why: string } {
  const probe = cloud as unknown as CloudSaveProbe
  const verify = verifyPayload(JSON.stringify(cloud), sig, key)
  if (!verify.ok) return { ok: false, why: verify.why }
  if (typeof probe.version !== 'number' || !Number.isFinite(probe.version) || probe.version < 1 || probe.version > SaveSystem.SAVE_VERSION) {
    return { ok: false, why: 'future version' }
  }
  if (!probe.player || !probe.world) return { ok: false, why: 'malformed' }
  const num = (v: unknown, min: number): v is number => typeof v === 'number' && Number.isFinite(v) && v >= min
  if (!num(probe.player.cash, 0) || !num(probe.player.bankBalance, 0)) return { ok: false, why: 'insane money' }
  if (!num(probe.world.day, 1)) return { ok: false, why: 'insane day' }
  for (const v of Object.values(probe.player.needs ?? {})) {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 100) return { ok: false, why: 'insane needs' }
  }
  if (!num(probe.player.stats?.totalEarned ?? 0, 0) || !num(probe.player.stats?.totalSpent ?? 0, 0)) return { ok: false, why: 'insane stats' }
  return { ok: true }
}

/** Debounced autosave — called after every state-mutating action. */
export function scheduleAutosave(get: () => GameStore) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const { player, world, civic, settings } = get()
    if (!player || !world || !civic) return
    const existing = SaveSystem.load()
    const wrote = SaveSystem.write({
      version: SaveSystem.SAVE_VERSION,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      player,
      world,
      civic,
      fleet: get().fleet,
      chaos: get().chaos,
      calendar: get().calendar,
      rivers: get().rivers,
      education: get().education,
      housing: get().housing,
      japa: get().japa,
      goals: get().goals,
      onboarding: get().onboarding,
      account: get().account,
      shield: get().shield,
      fortress: get().fortress,
      cityPulse: get().cityPulse ?? freshPulseState(),
      live: get().live ?? freshLiveState(),
      forge: get().forge ?? freshForgeState(),
      story: get().story,
      patti: get().patti,
      wardrobe: get().wardrobe,
      nation: get().nation ?? freshNationState(),
      settings,
    })
    if (!wrote) warnSaveFailure(get)
  }, AUTOSAVE.debounceMs)
}

/** M20 — the crowd sim's lifecycle owner (the worker-or-main bridge). */
export let nationBridge: ReturnType<typeof startNationSim> | null = null

export function startNationBridge(get: () => GameStore): void {
  const nation = get().nation ?? freshNationState()
  const flags = get().opsFlags ?? readFlags()
  stopNationSim()
  nationBridge = null
  if (!nation.crowd.on || flags.crowdSim === false) {
    useGameStoreRef.setState({ nationSnapshot: null, nationPath: null })
    return
  }
  const world = get().world
  nationBridge = startNationSim({
    seed: nation.crowd.seed,
    count: nation.crowd.count,
    allowWorker: flags.workerSim !== false,
    initialPulse: {
      day: world?.day ?? 1,
      weather: (world?.weather ?? 'sunny') as WorldPulse['weather'],
      floodLevel: 0,
      marketMult: 1,
      festival: null,
    },
    onSnapshot: (snap) => {
      const st = useGameStoreRef.getState()
      if (st.nationSnapshot?.tick === snap.tick) return
      st.nationSnapshotIngest(snap)
    },
  })
  useGameStoreRef.setState({ nationPath: nationBridge.path() })
}

/** the store's own ref — the bridge callback reads the freshest state */
export const useGameStoreRef: { getState: () => GameStore; setState: (partial: Partial<GameStore>) => void } = {
  getState: () => { throw new Error('nation bridge: store not ready') },
  setState: () => { throw new Error('nation bridge: store not ready') },
}
/* PH2.5: the three counters below moved here from the monolith's module scope;
 * slices cannot assign imported bindings, so the increments/assigns became
 * these mechanical wrappers. Same arithmetic, same live book. */
export function nextNotificationId(): number {
  notificationId += 1
  return notificationId
}

export function nextPulseId(): number {
  pulseId += 1
  return pulseId
}

export function clearNationBridge(): void {
  nationBridge = null
}
