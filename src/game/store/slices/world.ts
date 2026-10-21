/**
 * WORLD SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1252-1252, 1256-1257, 1286-1286, 2381-2635, 2637-2904, 3562-3757.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, WorldSlice } from '../types'
import {
  TRAVEL,
  WORK,
  CHILL,
  FLEET,
  FESTIVALS,
  RIVERS,
} from '../../data/config'
import { LOCATION_BY_ID } from '../../data/locations'
import { NPC_BY_ID } from '../../data/npcs'
import { VEHICLE_BY_MODEL } from '../../data/vehicles'
import { audio } from '../../systems/audio'
import {
  freshCalendarState,
  weddingForCycle,
  attendSprayFor,
  canAttendFestival,
  canBuyRam,
  buyRamApply,
  canShareMeat,
  shareMeatApply,
  canSponsor,
  sponsorApply,
  canBet,
  betApply,
  canBuyAsoEbi,
  buyAsoEbiApply,
  canAttendWedding,
  attendWeddingApply,
  canContributePaving,
  contributePavingApply,
  pavedMinutesMult,
} from '../../systems/calendar'
import { fuelMultFor } from '../../systems/chaos'
import { recordTransaction } from '../../systems/economy'
import { personalModelOf, transportAllowed } from '../../systems/garage'
import { gateVerdict } from '../../systems/guest'
import { haptics } from '../../systems/haptics'
import { sirenMinutesMult } from '../../systems/japa'
import { applyNeedsDelta, applySlotDecay } from '../../systems/needs'
import { formatNaira } from '../../systems/progression'
import {
  freshRiversState,
  zoneCut,
  walkwayOpen,
  segmentsLeft,
  canLaySegment,
  laySegmentApply,
  setTollTierApply,
  canContributeRescue,
  contributeRescueApply,
  availableFerryGigs,
  ferryFareBetween,
  runFerryApply,
  cutZonesFor,
  JETTY_ID,
} from '../../systems/rivers'
import { weatherBlocksLocation } from '../../systems/seasons'
import { calculateTravel, rollTravelEvent } from '../../systems/travel'
import { advanceWorldClock, absoluteSlot } from '../../systems/world'
import {
  scheduleAutosave,
  commitCivicDays,
  bumpOnboarding,
  applyArrival,
  LEDGER_CAP,
} from '../shared'
import type { Transaction } from '../../types'

export const worldSlice: StateCreator<GameStore, [], [], WorldSlice> = (set, get) => ({
  world: null,

  calendar: freshCalendarState(),
  rivers: freshRiversState(),

  isTravelling: false,

  /* --------------------- M10 — the living calendar ---------------------- */

  /** Join today's festival in person — mood, rep where it is due, and the
   *  crowd's seeded naira spray. Venue-gated, once per festival-day. */
  attendFestival: () => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const gate = canAttendFestival(calendar, world.day, world.currentLocation)
    if (!gate.ok || !gate.festival) {
      get().notify({ icon: '🎉', text: gate.why, tone: 'neutral' })
      return false
    }
    const f = gate.festival
    const after = {
      ...calendar,
      attended: [...calendar.attended, `${world.day}:${f.id}`],
      stats: { ...calendar.stats, festivalsAttended: calendar.stats.festivalsAttended + 1 },
    }
    set({ calendar: after })
    const p0 = get().player!
    const rep = FESTIVALS.attend.repFestivals.includes(f.id) ? FESTIVALS.attend.rep : 0
    const spray = attendSprayFor(world.day, f.id)
    set({
      player: {
        ...p0,
        needs: applyNeedsDelta(p0.needs, { mood: FESTIVALS.attend.mood }),
        reputation: Math.max(0, p0.reputation + rep),
        cash: p0.cash + spray,
        transactions: [recordTransaction(`Naira spray — ${f.name}`, 'tip', spray, world.day, absoluteSlot(world.day, world.timeOfDay)), ...p0.transactions].slice(0, LEDGER_CAP),
        stats: { ...p0.stats, totalEarned: p0.stats.totalEarned + spray },
      },
    })
    get().notify({
      icon: f.icon,
      text: rep > 0
        ? `You don attend ${f.name}! The street see you — +${rep} rep, and the crowd spray ${formatNaira(spray)}.`
        : `You don attend ${f.name}! Mood don lift, and the crowd spray ${formatNaira(spray)}.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('festival') // F2 — the spray rides its own pattern ('festival' was defined in haptics.ts:19 but never fired)
    get().bumpGoal('festival')
    scheduleAutosave(get)
    return true
  },

  /** Buy a ram at the Kpata ram market — the butcher cuts 6 meat packs. */
  buyRam: () => {
    const { player, world } = get()
    if (!player || !world) return false
    const gate = canBuyRam(world.day, world.currentLocation, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🐏', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gate.price, { label: 'Ram — Sallah', category: 'shop' })) {
      get().notify({ icon: '🐏', text: `The ram na ${formatNaira(gate.price)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: buyRamApply(get().calendar) })
    get().notify({
      icon: '🐏',
      text: `Ram don land — ${FESTIVALS.meatPacksPerRam} meat packs ready. Share am around before the season pass.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Share a meat pack with a paddy — +familiarity, +mood, +rep, once each. */
  shareMeat: (npcId) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const gate = canShareMeat(calendar, world.day, npcId)
    if (!gate.ok) {
      get().notify({ icon: '🍖', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ calendar: shareMeatApply(calendar, world.day, npcId) })
    const rel = player.relationships[npcId]
    const nextFam = Math.min(100, (rel?.familiarity ?? 0) + FESTIVALS.meatShareFamiliarity)
    const p0 = get().player!
    set({
      player: {
        ...p0,
        needs: applyNeedsDelta(p0.needs, { mood: FESTIVALS.meatShareMood }),
        reputation: p0.reputation + FESTIVALS.meatShareRep,
        relationships: {
          ...p0.relationships,
          [npcId]: { familiarity: nextFam, lastChatDay: rel?.lastChatDay ?? 0, lastGiftDay: rel?.lastGiftDay ?? 0, lastHangoutDay: rel?.lastHangoutDay ?? 0 },
        },
      },
    })
    const npcName = NPC_BY_ID[npcId]?.name ?? npcId
    get().notify({
      icon: '🍖',
      text: `Meat don reach ${npcName} hand — blessing dey flow. (+${FESTIVALS.meatShareFamiliarity} familiarity)`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Sponsor a regatta crew — ₦2k on the shoreline, the trophy pays back. */
  sponsorBoat: (teamId) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const gate = canSponsor(calendar, world.day, world.currentLocation, teamId)
    if (!gate.ok) {
      get().notify({ icon: '🚤', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(FESTIVALS.sponsorFee, { label: `Regatta sponsorship — ${teamId}`, category: 'fun' })) {
      get().notify({ icon: '🚤', text: `Sponsorship na ${formatNaira(FESTIVALS.sponsorFee)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: sponsorApply(get().calendar, world.day, teamId) })
    get().notify({
      icon: '🚤',
      text: `You don sponsor ${teamId}! If they carry the trophy, ${formatNaira(FESTIVALS.sponsorWinPayout)} dey wait you.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Back a boat on race-eve — adults only; the bookie settles the morning after. */
  betBoat: (teamId, tier) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.betTiers as readonly number[]).includes(tier)) return false
    // M13 — the family shield reads the CHARACTER's life stage (the honest law)
    const gate = canBet(calendar, world.day, world.currentLocation, player.ageBand)
    if (!gate.ok) {
      get().notify({ icon: '🎲', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(tier, { label: `Regatta bet — ${teamId}`, category: 'fun' })) {
      get().notify({ icon: '🎲', text: `The stake na ${formatNaira(tier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: betApply(get().calendar, world.day, teamId, tier) })
    get().notify({
      icon: '🎲',
      text: `Stake don drop on ${teamId} — if they win, ${formatNaira(Math.round(tier * FESTIVALS.betOdds))} dey wait you tomorrow morning.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Buy the wedding fabric at Kpata — the aunties respect the uniform. */
  buyAsoEbi: () => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const wedding = weddingForCycle(world.day)
    const gate = canBuyAsoEbi(calendar, world.day, world.currentLocation, wedding)
    if (!gate.ok) {
      get().notify({ icon: '👗', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(FESTIVALS.asoEbiPrice, { label: `Aso-ebi — ${wedding.couple} wedding`, category: 'shop' })) {
      get().notify({ icon: '👗', text: `The fabric na ${formatNaira(FESTIVALS.asoEbiPrice)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: buyAsoEbiApply(get().calendar, wedding.id) })
    get().notify({
      icon: '👗',
      text: `Aso-ebi don set for ${wedding.couple} wedding — you go shine for the canopy.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Attend today's wedding with a gift — aso-ebi doubles the respect. */
  attendWedding: (giftTier) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.weddingGiftTiers as readonly number[]).includes(giftTier)) return false
    const wedding = weddingForCycle(world.day)
    const gate = canAttendWedding(calendar, world.currentLocation, wedding)
    if (!gate.ok) {
      get().notify({ icon: '💍', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(giftTier, { label: `Wedding gift — ${wedding.couple}`, category: 'fun' })) {
      get().notify({ icon: '💍', text: `The gift na ${formatNaira(giftTier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const hasAsoEbi = calendar.asoEbi.includes(wedding.id)
    const rep = hasAsoEbi ? FESTIVALS.weddingRepAsoEbi : FESTIVALS.weddingRep
    set({ calendar: attendWeddingApply(get().calendar, wedding.id) })
    const p0 = get().player!
    set({
      player: {
        ...p0,
        needs: applyNeedsDelta(p0.needs, { mood: FESTIVALS.weddingMood }),
        reputation: p0.reputation + rep,
      },
    })
    get().notify({
      icon: '💍',
      text: hasAsoEbi
        ? `You don flex the aso-ebi at ${wedding.couple} wedding — the aunties dey nod. (+${rep} rep, mood don high)`
        : `You don attend ${wedding.couple} wedding. Next time buy the aso-ebi — the aunties dey look.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    get().bumpGoal('festival')
    scheduleAutosave(get)
    return true
  },

  /** Give to the town union's paving pool — a smooth road repays everybody. */
  contributePaving: (tier) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.pavingTiers as readonly number[]).includes(tier)) return false
    const gate = canContributePaving(calendar, world.day, world.currentLocation)
    if (!gate.ok) {
      get().notify({ icon: '🛣️', text: gate.why, tone: 'neutral' })
      return false
    }
    const zoneName = LOCATION_BY_ID[calendar.paving!.zoneId]?.name ?? calendar.paving!.zoneId
    if (!get().removeMoney(tier, { label: `Street paving fund — ${zoneName}`, category: 'other' })) {
      get().notify({ icon: '🛣️', text: `Contribution na ${formatNaira(tier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const after = contributePavingApply(get().calendar, world.day, tier)
    set({ calendar: after })
    const need = Math.max(0, FESTIVALS.pavingTarget - after.paving!.pool)
    get().notify({
      icon: '🛣️',
      text: need <= 0
        ? `Pool don complete! The union crew go finish ${zoneName} tomorrow morning.`
        : `You drop ${formatNaira(tier)} — ${formatNaira(need)} more and ${zoneName} road go smooth.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* --------------------- M11 — THE RIVERS AWAKE --------------------- */

  /** The Crusher sells sand on the Patti road — sacks for the walkways. */
  buySand: (sacks) => {
    const { player, world } = get()
    if (!player || !world) return false
    const count = Math.max(1, Math.min(10, Math.floor(sacks)))
    if (world.currentLocation !== RIVERS.sandVendorZone) {
      get().notify({ icon: '⛰️', text: 'The Crusher dey sell sand for the Patti road — go there in person.', tone: 'bad' })
      return false
    }
    const cost = count * RIVERS.sackPrice
    if (!get().removeMoney(cost, { label: `Crusher sand ×${count}`, category: 'shop' })) {
      get().notify({ icon: '💸', text: `${count} sack${count > 1 ? 's' : ''} na ${formatNaira(cost)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const riv = get().rivers
    set({
      rivers: {
        ...riv,
        sandbags: riv.sandbags + count,
        stats: { ...riv.stats, sandBought: riv.stats.sandBought + count },
      },
    })
    get().notify({ icon: '🧱', text: `${count} sack${count > 1 ? 's' : ''} of Crusher sand don land for your compound — the walkway dey wait.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Lay one walkway segment in the cut zone you stand in. */
  laySegment: () => {
    const { player, world, rivers } = get()
    if (!player || !world) return false
    const zoneId = world.currentLocation
    const gate = canLaySegment(rivers, world.day, zoneId, world.currentLocation, rivers.sandbags)
    if (!gate.ok) {
      get().notify({ icon: '🌊', text: gate.why, tone: 'neutral' })
      return false
    }
    if (player.needs.energy < RIVERS.layEnergy) {
      get().notify({ icon: '🥵', text: 'Wading with sand on your head dey chop energy — rest small first.', tone: 'bad' })
      return false
    }
    const p0 = get().player!
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { energy: -RIVERS.layEnergy }) } })
    const after = laySegmentApply(get().rivers, zoneId)
    set({ rivers: after })
    const zoneName = LOCATION_BY_ID[zoneId]?.name ?? zoneId
    if (segmentsLeft(after, zoneId) === 0) {
      get().notify({ icon: '🛤️', text: `THE WALKWAY DEY OPEN! ${zoneName} crossing don complete — set your toll and collect.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().notify({ icon: '🧱', text: `One more segment stand — ${segmentsLeft(after, zoneId)} left for ${zoneName}.`, tone: 'neutral' })
    }
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Set the crossing toll tier on the walkway you stand on. */
  setTollTier: (tierIndex) => {
    const { world, rivers } = get()
    if (!world) return false
    const zoneId = world.currentLocation
    if (!walkwayOpen(rivers, zoneId)) {
      get().notify({ icon: '🛤️', text: 'Finish the walkway first — then the toll bowl dey open.', tone: 'bad' })
      return false
    }
    set({ rivers: setTollTierApply(rivers, zoneId, tierIndex) })
    const tier = RIVERS.tollTiers[Math.min(RIVERS.tollTiers.length - 1, Math.max(0, tierIndex))]
    get().notify({ icon: '🎫', text: `Crossing toll na ${formatNaira(tier)} now — the walkers go pay into your bowl.`, tone: 'good' })
    audio.play('click')
    scheduleAutosave(get)
    return true
  },

  /** Collect the toll bowl of the walkway you stand on. */
  collectTolls: () => {
    const { world, rivers } = get()
    if (!world) return false
    const zoneId = world.currentLocation
    const w = rivers.walkways[zoneId]
    if (!w || w.pot <= 0) {
      get().notify({ icon: '🎫', text: 'The toll bowl dey empty — the crossings go fill am.', tone: 'neutral' })
      return false
    }
    const amount = Math.round(w.pot)
    set({
      rivers: { ...rivers, walkways: { ...rivers.walkways, [zoneId]: { ...w, pot: 0 } }, stats: { ...rivers.stats, tollsCollected: rivers.stats.tollsCollected + amount } },
    })
    get().addMoney(amount, { label: `Crossing tolls — ${LOCATION_BY_ID[zoneId]?.name ?? zoneId} walkway`, category: 'hustle' })
    get().notify({ icon: '💰', text: `You collect ${formatNaira(amount)} from the toll bowl — the walkers dey pay.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Buy the fishermen's canoe at the jetty (unlocks the ferry gigs). */
  buyCanoe: () => {
    const { player, world, rivers } = get()
    if (!player || !world) return false
    if (world.currentLocation !== JETTY_ID) {
      get().notify({ icon: '🛶', text: 'The fishermen dey sell canoes at the Motor Park jetty.', tone: 'bad' })
      return false
    }
    if (rivers.canoe) {
      get().notify({ icon: '🛶', text: 'You already get canoe — one boat, one hustler.', tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(RIVERS.canoeCost, { label: 'Fisherman’s canoe', category: 'shop' })) {
      get().notify({ icon: '💸', text: `The canoe na ${formatNaira(RIVERS.canoeCost)} — the fishermen no dey take credit.`, tone: 'bad' })
      return false
    }
    set({ rivers: { ...rivers, canoe: true } })
    get().notify({ icon: '🛶', text: 'The canoe don land! When the river rise, the ferry board go pay you like a landlord.', tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Ride the canoe ferry across the water (jetty ↔ a cut zone). */
  takeFerry: (toId) => {
    const { player, world } = get()
    if (!player || !world) return
    // busy-guard: no clock-advancing actions mid-shift/mid-travel
    if (get().isWorking || get().isTravelling) return
    const from = world.currentLocation
    const destination = LOCATION_BY_ID[toId]
    if (!destination || from === toId) return

    // the water's route law: jetty → a cut zone, or a cut zone → the return jetty
    const goingIn = from === JETTY_ID && zoneCut(world.day, toId)
    const goingOut = zoneCut(world.day, from) && toId === RIVERS.cutReturnId
    if (!goingIn && !goingOut) {
      get().notify({ icon: '🛶', text: zoneCut(world.day, toId) ? 'The canoes dey wait at the Motor Park jetty.' : 'The canoe no dey go there — that road dey dry, waka or ride.', tone: 'neutral' })
      return
    }

    const fare = ferryFareBetween(from, toId, world.day)
    const energyCost = Math.ceil(RIVERS.ferryEnergy / 2)
    if (player.cash < fare) {
      audio.play('notify')
      get().notify({ icon: '💸', text: `The fishermen want ${formatNaira(fare)} for the crossing — water no dey take credit.`, tone: 'bad' })
      return
    }
    if (player.needs.energy < energyCost) {
      get().notify({ icon: '🥵', text: 'You are too tired for the crossing. Rest small.', tone: 'bad' })
      return
    }

    set({ isTravelling: true })
    const applyArrival = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return
      const needs = applySlotDecay(applyNeedsDelta(p.needs, { energy: -energyCost }), 1, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, 1)
      const slot = absoluteSlot(clock.day, clock.timeOfDay)
      const tx = recordTransaction(`Canoe ferry — ${LOCATION_BY_ID[from]?.shortName ?? from} → ${destination.shortName}`, 'transport', -fare, clock.day, slot)
      set({
        player: {
          ...p,
          cash: Math.max(0, p.cash - fare),
          needs,
          transactions: [tx, ...p.transactions].slice(0, LEDGER_CAP),
          stats: { ...p.stats, totalSpent: p.stats.totalSpent + fare },
        },
        world: { ...w, currentLocation: toId, ...clock },
        isTravelling: false,
        offers: [],
      })
      // a crossing can cross midnight — the whole mesh follows the day
      commitCivicDays(get, set, w.day, clock.day)
      get().notify({ icon: '🛶', text: `The canoe land you for ${destination.name} — the water still dey, hold the rail.`, tone: 'neutral' })
      audio.play('notify')
      scheduleAutosave(get)
    }
    setTimeout(applyArrival, TRAVEL.transitionMs)
  },

  /** Run a ferry gig with your own canoe (passengers pay the surge fare). */
  runFerryGig: (gigId) => {
    const { player, world, rivers, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return false
    if (!rivers.canoe) {
      get().notify({ icon: '🛶', text: 'You need your own canoe — the fishermen dey sell at the jetty.', tone: 'bad' })
      return false
    }
    const cut = availableFerryGigs(rivers, world.day, cutZonesFor(world.day))
    const gig = cut.find((g) => g.id === gigId)
    if (!gig) return false
    if (world.currentLocation !== JETTY_ID) {
      get().notify({ icon: '📍', text: 'The passengers dey wait at the Motor Park jetty — the bus go stop there.', tone: 'bad' })
      return false
    }
    if (player.needs.energy < gig.energyCost) {
      get().notify({ icon: '🥵', text: 'You are too tired to paddle a loaded canoe. Rest small first.', tone: 'bad' })
      return false
    }

    const destName = LOCATION_BY_ID[gig.toId]?.name ?? gig.toId
    set({ isWorking: true, workingLabel: `Ferry — crossing to ${destName}` })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return
      get().addMoney(gig.payout, { label: `Ferry run — boatload to ${destName}`, category: 'hustle' })
      const paid = get().player!
      const needs = applySlotDecay(applyNeedsDelta(paid.needs, { energy: -gig.energyCost }), 1, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, 1)
      set({
        player: { ...paid, needs, stats: { ...paid.stats, jobsCompleted: paid.stats.jobsCompleted + 1 } },
        world: { ...w, currentLocation: gig.toId, ...clock },
        rivers: runFerryApply(get().rivers, w.day, gig.id),
        isWorking: false,
        workingLabel: null,
        offers: [],
      })
      const riv = get().rivers
      set({ rivers: { ...riv, stats: { ...riv.stats, ferryEarned: riv.stats.ferryEarned + gig.payout } } })
      get().addXp(FLEET.gigXp)
      get().addSkillXp('hustle', FLEET.gigHustleXp)
      get().notify({ icon: '🛶', text: `Boatload done — the passengers pay ${formatNaira(gig.payout)} at ${destName}. The water dey pay today.`, tone: 'good' })
      get().bumpGoal('gig')
      bumpOnboarding(get, set, 'work')
      commitCivicDays(get, set, w.day, clock.day)
      audio.play('chime')
      haptics.fire('reward')
      scheduleAutosave(get)
    }
    setTimeout(applyDone, WORK.transitionMs)
    return true
  },

  /** Give to the cold-room rescue bowl while standing at the zone. */
  contributeRescue: (tier) => {
    const { player, world, rivers } = get()
    if (!player || !world) return false
    if (!(RIVERS.rescue.tiers as readonly number[]).includes(tier)) return false
    const gate = canContributeRescue(rivers, world.day, world.currentLocation)
    if (!gate.ok) {
      get().notify({ icon: '🧊', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(tier, { label: 'Cold-room rescue bowl', category: 'other' })) {
      get().notify({ icon: '💸', text: `The bowl dey take ${formatNaira(tier)} tiers — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const after = contributeRescueApply(rivers, world.day, tier)
    set({ rivers: after })
    const need = Math.max(0, RIVERS.rescue.poolTarget - after.rescue!.pool)
    get().notify({
      icon: '🧊',
      text: need <= 0
        ? 'Bowl don full! The rescue trucks go roll tomorrow morning.'
        : `You drop ${formatNaira(tier)} — ${formatNaira(need)} more and the trucks go roll.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* ------------------------------- travel ------------------------------- */

  travel: (destinationId, transportId) => {
    const { player, world, isTravelling } = get()
    if (!player || !world || isTravelling) return

    const origin = LOCATION_BY_ID[world.currentLocation]
    const destination = LOCATION_BY_ID[destinationId]
    if (!origin || !destination || origin.id === destination.id) return

    // --- guards (all feedback through notifications, never silent) ---
    if (player.level < destination.unlockLevel) {
      audio.play('notify')
      get().notify({
        icon: '🔒',
        text: `${destination.name} unlocks at Level ${destination.unlockLevel}.`,
        tone: 'bad',
      })
      return
    }
    // M6 — THE FLOOD LAW: a flood day closes the riverfront. Nobody wades
    // into the Confluence while the Niger owns it.
    if (weatherBlocksLocation(world.weather, destinationId)) {
      audio.play('notify')
      get().notify({
        icon: '🌊',
        text: `Flood don close ${destination.name} — the water don take the riverfront. Try tomorrow.`,
        tone: 'bad',
      })
      return
    }
    // M11 — THE RIVER LAW: the water owns the low ground. Land transport
    // refuses a cut zone in EITHER direction; a finished sandbag walkway
    // carries pedestrians only (slow, careful steps), and the canoe ferry
    // is its own action — the water never quotes the land sheets' fares.
    if (zoneCut(world.day, destinationId) && !(transportId === 'walk' && walkwayOpen(get().rivers, destinationId))) {
      audio.play('notify')
      get().notify({
        icon: '🌊',
        text: `The river don take ${destination.name} — the road dey under water. Canoe ferry dey run from the Motor Park.`,
        tone: 'bad',
      })
      return
    }
    if (zoneCut(world.day, origin.id) && !(transportId === 'walk' && walkwayOpen(get().rivers, origin.id))) {
      audio.play('notify')
      get().notify({
        icon: '🌊',
        text: `The water don lock ${origin.name} in — you go need the canoe ferry or the sandbag walkway.`,
        tone: 'bad',
      })
      return
    }
    // M4 — personal transport: the ride must be IN the garage first
    const ownModel = personalModelOf(transportId)
    if (ownModel && !player.vehicles.some((v) => v.model === ownModel)) {
      audio.play('notify')
      get().notify({
        icon: '🔑',
        text: `You no own that ride yet — the Motor Park sells them.`,
        tone: 'bad',
      })
      return
    }
    // the ONE offer law: location data for public modes, ownership + road
    // access for personal modes (a danfo cannot follow a keke trail)
    if (!transportAllowed(destination, transportId, player.vehicles)) return

    // M9 — THE GUEST LOOP: the gate stands before forward travel. Linked
    // accounts and the starter trio ride free; anywhere else asks for a name
    // (with an honest one-day grace when they ask for it).
    const verdict = gateVerdict(get().account, destinationId, world.day)
    if (verdict.blocked) {
      set({ gateOpen: true })
      audio.play('notify')
      return
    }

    // pure calculation — same inputs always give the same plan
    // M8 — the pump surges on scarcity days (personal rides pay black-market)
    // M10 — a paved destination rides the union's smooth road (minutes ×0.85)
    // M11 — a walkway crossing rides slow and careful (minutes ×1.35, walk only)
    const plan = calculateTravel(
      origin,
      destination,
      transportId,
      world.weather,
      world.timeOfDay,
      fuelMultFor(world.day),
      pavedMinutesMult(get().calendar, world.day, destinationId) *
        (transportId === 'walk' && zoneCut(world.day, destinationId) && walkwayOpen(get().rivers, destinationId) ? RIVERS.walkwayMinutesMult : 1) *
        sirenMinutesMult(get().japa, world.day),
    )
    const event = rollTravelEvent(transportId, world.weather)

    if (player.cash < plan.cost) {
      audio.play('notify')
      get().notify({
        icon: '💸',
        text: `The fare is ${formatNaira(plan.cost)} — you no get am.`,
        tone: 'bad',
      })
      return
    }
    if (player.needs.energy < plan.energyCost) {
      audio.play('notify')
      get().notify({
        icon: '🥵',
        text: 'You are too tired for that journey. Rest first.',
        tone: 'bad',
      })
      return
    }

    // travelling state drives the 📍 HUD + map transition
    set({ isTravelling: true })

    // apply the completed trip on the EXISTING clock through proper systems
    const applyArrival = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      const cash = Math.max(0, p.cash - plan.cost + (event?.cashDelta ?? 0))
      const needs = applySlotDecay(applyNeedsDelta(p.needs, {
        energy: -(plan.energyCost + (event?.energyDelta ?? 0)),
        mood: event?.moodDelta ?? 0,
      }), plan.slots, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, plan.slots)

      // Stage 3: record the fare (and any event tip) in the player's ledger
      const arrivalSlot = absoluteSlot(clock.day, clock.timeOfDay)
      const txs: Transaction[] = []
      if (plan.cost > 0) {
        txs.push(
          recordTransaction(
            ownModel
              ? `Fuel — ${VEHICLE_BY_MODEL[ownModel].short} to ${destination.name}`
              : `Fare to ${destination.name}`,
            'transport',
            -plan.cost,
            clock.day,
            arrivalSlot,
          ),
        )
      }
      if (event?.cashDelta && event.cashDelta > 0) {
        txs.push(recordTransaction(event.title, 'tip', event.cashDelta, clock.day, arrivalSlot))
      }
      const stats = {
        ...p.stats,
        totalEarned:
          p.stats.totalEarned + (event?.cashDelta && event.cashDelta > 0 ? event.cashDelta : 0),
        totalSpent: p.stats.totalSpent + plan.cost,
      }

      set({
        player: {
          ...p,
          cash,
          needs,
          transactions: [...txs, ...p.transactions].slice(0, LEDGER_CAP),
          stats,
        },
        world: { ...w, currentLocation: destination.id, ...clock },
        isTravelling: false,
        offers: [], // left the area — unclaimed gist goes cold
      })

      // M2 — a trip can cross midnight; the civic mesh follows the day
      commitCivicDays(get, set, w.day, clock.day)

      // M9 — the journey lands on the daily goals + the onboarding arc
      get().bumpGoal('travel')
      bumpOnboarding(get, set, 'travel')

      // arrival feedback: destination + a compact time/money/energy summary
      get().notify({
        icon: destination.emoji,
        text: `You arrived at ${destination.name}.`,
        tone: 'neutral',
      })
      get().notify({
        icon: '🧾',
        text: `${formatNaira(cash)} • ⚡ ${Math.round(needs.energy)}`,
        tone: 'neutral',
      })
      if (event) {
        get().notify({ icon: event.icon, text: event.description, tone: event.tone })
        if (event.xpDelta && event.xpDelta > 0) get().addXp(event.xpDelta)
      }
      audio.play('notify')
      scheduleAutosave(get)
    }

    setTimeout(applyArrival, TRAVEL.transitionMs)
  },
})
