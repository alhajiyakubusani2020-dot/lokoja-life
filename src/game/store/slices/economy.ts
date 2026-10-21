/**
 * ECONOMY SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1253-1253, 1255-1255, 1266-1266, 1287-1289, 1623-1741, 1743-1835, 1837-1913, 2251-2379, 3759-3896, 3914-3998, 4000-4189, 4191-4200.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, EconomySlice } from '../types'
import {
  WORK,
  HUSTLE,
  MEAL_BY_KEY,
  CHILL,
  FORTRESS,
  BIZ,
  CIVIC,
  CHAOS,
} from '../../data/config'
import { JOB_BY_ID } from '../../data/jobs'
import { LOCATION_BY_ID } from '../../data/locations'
import { audio } from '../../systems/audio'
import {
  bizDef,
  bizOwned,
  bizUpgradeCost,
  bizCollect,
  freshBusiness,
  staffCapFor,
} from '../../systems/biz'
import {
  freshChaosState,
  isScarcityDay,
  atmRemaining,
  applyAtmDraw,
  posFeeFor,
  canContribute,
  applyContribution,
} from '../../systems/chaos'
import {
  freshCivicState,
  nepaSettleCost,
  nepaApplyPayment,
  kgirsSettleCost,
  kgirsApplyPayment,
  efccFileTip,
  marketMealPrice,
  marketForDay,
} from '../../systems/civic'
import {
  recordTransaction,
  pushTransaction,
  canAfford,
  rewardCash,
  describeReward,
} from '../../systems/economy'
import {
  freshFortressState,
  incomeGuard,
  velocityGuard,
  chainNext,
} from '../../systems/fortress'
import { haptics } from '../../systems/haptics'
import { applyNeedsDelta, applySlotDecay } from '../../systems/needs'
import {
  generateHustleOffers,
  hustleDefFor,
  pruneExpiredOpportunities,
  resolveOpportunity,
} from '../../systems/opportunities'
import { formatNaira } from '../../systems/progression'
import { nightMealPrice, mealAvailableAt } from '../../systems/seasons'
import {
  checkRequirements,
  cooldownRemaining,
  resolveJob,
} from '../../systems/work'
import { advanceWorldClock, absoluteSlot } from '../../systems/world'
import {
  scheduleAutosave,
  bumpOnboarding,
  LEDGER_CAP,
  nextPulseId,
} from '../shared'
import type { SkillId } from '../../types'

export const economySlice: StateCreator<GameStore, [], [], EconomySlice> = (set, get) => ({
  civic: null,

  chaos: freshChaosState(),

  fortress: freshFortressState(),

  isWorking: false,
  workingLabel: null,
  offers: [],

  /* --------------------- M2 — the civic mesh actions --------------------- */

  /** Settle the electricity bill. In the GRA office it costs the debt
   *  (+ reconnection once cut); from the phone it adds the convenience fee. */
  payNepa: (channel) => {
    const { player, world, civic } = get()
    if (!player || !world || !civic) return false
    if (civic.nepa.owed <= 0 && !civic.nepa.shedding) {
      get().notify({ icon: '💡', text: 'You no owe NEPA anything. Enjoy the light.', tone: 'neutral' })
      return false
    }
    if (channel === 'office' && world.currentLocation !== 'government-area') {
      get().notify({ icon: '🏢', text: 'The NEPA counter is in the Government Area — or pay from your phone for a small fee.', tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    const cost = nepaSettleCost(civic) + fee
    if (!get().removeMoney(cost, {
      label: fee ? 'NEPA bill — online payment (incl. fee)' : civic.nepa.shedding ? 'NEPA bill + reconnection fee' : 'NEPA bill',
      category: 'other',
    })) {
      get().notify({ icon: '🧾', text: `You need ${formatNaira(cost)} to clear the disco.`, tone: 'bad' })
      return false
    }
    set({ civic: nepaApplyPayment(get().civic!, world.day) })
    get().notify({
      icon: '💡',
      text: civic?.nepa.shedding ? 'Light don come back! NEPA staff dey smile small.' : 'NEPA bill settled — meter dey smile.',
      tone: 'good',
    })
    get().bumpGoal('nepa')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Settle the KGIRS assessment. A clean assessment pays anywhere (office
   *  free / phone + fee); a WARRANT only clears at the police desk in the GRA,
   *  where the fine comes on top. */
  payKgirs: (channel) => {
    const { player, world, civic } = get()
    if (!player || !world || !civic) return false
    if (civic.kgirs.assessed <= 0) {
      get().notify({ icon: '🧮', text: 'No tax assessment dey wait. KGIRS dey sleep — for now.', tone: 'neutral' })
      return false
    }
    const warrant = civic.kgirs.warrant
    if (channel === 'phone' && warrant) {
      get().notify({ icon: '🚨', text: 'A warrant no fit clear by phone. Walk to the police station.', tone: 'bad' })
      return false
    }
    if (channel !== 'phone' && world.currentLocation !== 'government-area') {
      get().notify({ icon: '🏢', text: warrant ? 'The warrant desk is at the GRA police station.' : 'KGIRS office dey Government Area — or use the phone app (+fee).', tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    const cost = kgirsSettleCost(civic) + fee
    if (!get().removeMoney(cost, {
      label: warrant ? 'KGIRS tax + warrant fine (police)' : fee ? 'KGIRS tax — online payment (incl. fee)' : 'KGIRS tax assessment',
      category: 'other',
    })) {
      get().notify({ icon: '🧮', text: `You need ${formatNaira(cost)} to settle the taxman.`, tone: 'bad' })
      return false
    }
    set({ civic: kgirsApplyPayment(get().civic!, warrant) })
    get().notify({
      icon: '🧮',
      text: warrant ? 'Warrant cleared at the desk — the police sef smile.' : 'Tax settled. Your name clean for KGIRS book.',
      tone: 'good',
    })
    get().bumpGoal('tax')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** File a whistleblower tip at the EFCC zonal command (in person only). */
  fileEfccTip: () => {
    const { player, world, civic } = get()
    if (!player || !world || !civic) return false
    if (world.currentLocation !== 'government-area') {
      get().notify({ icon: '🏢', text: 'The commission sits in the Government Area. Carry your gist there.', tone: 'neutral' })
      return false
    }
    if (world.day - civic.efcc.lastTipDay < CIVIC.efcc.tipCooldownDays) {
      get().notify({ icon: '🕵️', text: 'The commission dey still investigate your last tip. Come back small later.', tone: 'neutral' })
      return false
    }
    const { next, tip } = efccFileTip(civic, world.day)
    set({ civic: next })
    get().notify({
      icon: '🕵️',
      text: `Tip filed: “${tip.label}”. If EFCC recover, your cut na ${Math.round(CIVIC.efcc.rewardRate * 100)}%.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Today's honest market price of a meal at a spot — the ONE source the
   *  menu rows and eatMeal both read, so display can never drift from charge.
   *  M6 — night dishes price by the night-market law: the seeded per-day
   *  discount at the food strip after dark, and NOWHERE else. */
  mealPriceAt: (mealKey, locationId) => {
    const { world, civic } = get()
    const meal = MEAL_BY_KEY[mealKey]
    if (!meal || !world) return meal?.price ?? 0
    if (meal.night) {
      return mealAvailableAt(true, locationId, world.timeOfDay)
        ? nightMealPrice(meal.price, world.day)
        : meal.price
    }
    const c = marketForDay(civic ?? freshCivicState(), world.day, world.weather)
    return marketMealPrice(meal.price, mealKey, locationId, c, world.day)
  },

  /* ---------------------- M3 — OWN THE CITY (biz) ---------------------- */

  buyBiz: (typeId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const def = bizDef(typeId)
    if (!def) return false
    if (bizOwned(player.businesses, typeId)) {
      get().notify({ icon: def.emoji, text: `You already run the ${def.name}. One per man for now.`, tone: 'neutral' })
      return false
    }
    if (player.level < def.unlockLevel) {
      get().notify({ icon: '🔒', text: `${def.name} opens at Level ${def.unlockLevel}. Keep pushing.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(def.buyCost, { label: `Bought: ${def.name}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `${def.name} costs ${formatNaira(def.buyCost)}. You no reach yet.`, tone: 'bad' })
      return false
    }
    const shop = freshBusiness(typeId, world.day)
    const p = get().player!
    set({ player: { ...p, businesses: [...p.businesses, shop] } })
    get().notify({ icon: def.emoji, text: `${def.name} na yours now! Income go dey enter the till daily.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  collectBiz: (typeId, channel) => {
    const { player, world } = get()
    if (!player || !world) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    if (!def || !shop) return false
    if (channel === 'shop' && world.currentLocation !== def.locationId) {
      const where = LOCATION_BY_ID[def.locationId]?.shortName ?? def.locationId
      get().notify({ icon: def.emoji, text: `The ${def.name} dey ${where} — the money dey wait for you there.`, tone: 'neutral' })
      return false
    }
    const gross = Math.round(shop.accrued)
    if (gross <= 0) {
      get().notify({ icon: '🧺', text: 'The till is empty — come back tomorrow.', tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    const net = Math.max(0, gross - fee)
    if (net <= 0) {
      get().notify({ icon: '📱', text: 'The money never even reach transfer fee. Wait small.', tone: 'neutral' })
      return false
    }
    const { next } = bizCollect(shop, world.day)
    const p = get().player!
    set({ player: { ...p, businesses: p.businesses.map((b) => (b.typeId === typeId ? next : b)) } })
    get().addMoney(net, {
      label: fee ? `${def.name} till (phone, incl. fee)` : `${def.name} till`,
      category: 'hustle',
    })
    get().notify({
      icon: def.emoji,
      text: fee ? `Collected ${formatNaira(net)} by transfer (₦${fee} fee don go).` : `Collected ${formatNaira(net)} from the till. Solid.`,
      tone: 'good',
    })
    get().bumpGoal('collect')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  upgradeBiz: (typeId) => {
    const { player } = get()
    if (!player) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    if (!def || !shop) return false
    const cost = bizUpgradeCost(typeId, shop.level)
    if (cost === null) {
      get().notify({ icon: def.emoji, text: `${def.name} don reach max level. Na big name you be.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(cost, { label: `Upgraded: ${def.name} → L${shop.level + 1}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `Upgrade costs ${formatNaira(cost)}. Gather am first.`, tone: 'bad' })
      return false
    }
    const p = get().player!
    set({ player: { ...p, businesses: p.businesses.map((b) => (b.typeId === typeId ? { ...b, level: b.level + 1 } : b)) } })
    get().notify({ icon: def.emoji, text: `${def.name} don level up to L${shop.level + 1} — income go show am.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* ------------------ M5 — staff, power & the fleet ------------------ */

  hireStaff: (typeId) => {
    const { player } = get()
    if (!player) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    if (!def || !shop) return false
    const cap = staffCapFor(shop.level)
    if (shop.staff >= cap) {
      get().notify({
        icon: '👥',
        text: `The ${def.name} no fit carry more hands at L${shop.level} — upgrade am first.`,
        tone: 'neutral',
      })
      return false
    }
    if (!get().removeMoney(BIZ.staffHireFee, { label: `Hired attendant — ${def.name}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `Hiring costs ${formatNaira(BIZ.staffHireFee)}. You no reach yet.`, tone: 'bad' })
      return false
    }
    const p = get().player!
    set({ player: { ...p, businesses: p.businesses.map((b) => (b.typeId === typeId ? { ...b, staff: b.staff + 1 } : b)) } })
    get().notify({
      icon: '👥',
      text: `One more attendant join the ${def.name} — income +${Math.round(BIZ.staffIncomeBoost * 100)}%, wage ${formatNaira(BIZ.staffWagePerDay)}/day from the till.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  fireStaff: (typeId) => {
    const { player } = get()
    if (!player) return false
    const shop = bizOwned(player.businesses, typeId)
    if (!shop || shop.staff <= 0) return false
    set({ player: { ...player, businesses: player.businesses.map((b) => (b.typeId === typeId ? { ...b, staff: b.staff - 1 } : b)) } })
    get().notify({ icon: '👋', text: 'You let one attendant go. The wage stops tomorrow.', tone: 'neutral' })
    scheduleAutosave(get)
    return true
  },

  installBizUpgrade: (typeId, upgradeId) => {
    const { player } = get()
    if (!player) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    const up = (BIZ.upgrades as Record<string, { label: string; emoji: string; cost: number } | undefined>)[upgradeId]
    if (!def || !shop || !up) return false
    if (shop.upgrades.includes(upgradeId)) {
      get().notify({ icon: up.emoji, text: `${up.label} already dey run for the ${def.name}.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(up.cost, { label: `${up.label} — ${def.name}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `${up.label} costs ${formatNaira(up.cost)}. Gather am first.`, tone: 'bad' })
      return false
    }
    const p = get().player!
    set({
      player: {
        ...p,
        businesses: p.businesses.map((b) => (b.typeId === typeId ? { ...b, upgrades: [...b.upgrades, upgradeId] } : b)),
      },
    })
    get().notify({
      icon: up.emoji,
      text: `${up.label} installed at the ${def.name} — ${upgradeId === 'solar' ? 'dark days no fit touch am again, and NEPA load don drop.' : 'NEPA fit cut the whole street — your shop go still glow.'}`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  bankDeposit: (amount) => {
    const { player, world } = get()
    if (!player || !world || amount <= 0) return false
    if (!canAfford(player.cash, amount)) {
      get().notify({ icon: '🏦', text: 'Cash wey dey your pocket no reach that amount.', tone: 'bad' })
      return false
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const tx = recordTransaction('Bank deposit', 'bank', -amount, world.day, slot)
    set({
      player: {
        ...player,
        cash: player.cash - amount,
        bankBalance: player.bankBalance + amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
      },
    })
    get().notify({ icon: '🏦', text: `${formatNaira(amount)} don enter bank. Money wey dey bank dey safe.`, tone: 'good' })
    get().bumpGoal('deposit')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  bankWithdraw: (amount, channel = 'atm') => {
    const { player, world } = get()
    if (!player || !world || amount <= 0) return false
    if (player.bankBalance < amount) {
      get().notify({ icon: '🏦', text: 'Your bank balance no reach that amount.', tone: 'bad' })
      return false
    }
    const day = world.day
    let net = amount
    let label = 'ATM withdrawal'
    let fee = 0
    if (channel === 'pos') {
      // M8 — the agent's levy: instant, no cap, the kiosk network always has cash
      fee = posFeeFor(amount)
      net = Math.max(0, amount - fee)
      label = `POS withdrawal (agent fee ${formatNaira(fee)})`
      const c0 = get().chaos
      set({ chaos: { ...c0, stats: { ...c0.stats, posFees: c0.stats.posFees + fee } } })
    } else if (isScarcityDay(day)) {
      // M8 — THE SCARCITY LAW: the ATM pays a capped trickle on dry days
      const remaining = atmRemaining(get().chaos, day)
      if (remaining <= 0) {
        get().notify({ icon: '🏧', text: 'ATM don dry for today — na only POS agent fit help you now.', tone: 'bad' })
        return false
      }
      if (amount > remaining) {
        get().notify({
          icon: '🏧',
          text: `Cash scarcity: the ATM fit pay ${formatNaira(remaining)} more today. Queue for tomorrow or take the POS agent levy.`,
          tone: 'neutral',
        })
        return false
      }
      set({ chaos: applyAtmDraw(get().chaos, day, amount) })
    }
    const slot = absoluteSlot(day, world.timeOfDay)
    const tx = recordTransaction(label, 'bank', net, day, slot)
    // F2 — the POS levy signs the kobo-chain too: a destroyed fee is a real
    // ledger event, not a silent shave. The entry chains from the fortress
    // tail exactly like every signed entry (chainNext → sig → chainTail),
    // recorded -fee per the ledger's outflow convention (bankDeposit writes
    // the pocket-outflow the same way); magnitude = the fee.
    let transactions = pushTransaction(player.transactions, tx, LEDGER_CAP)
    let fortress = get().fortress
    if (fee > 0) {
      const levySig = chainNext(fortress.chainTail, { day, slot, amount: -fee, category: 'bank', label: 'POS agent levy' })
      const levyTx = { ...recordTransaction('POS agent levy', 'bank', -fee, day, slot), sig: levySig }
      transactions = pushTransaction(transactions, levyTx, LEDGER_CAP)
      fortress = { ...fortress, slotTxSlot: slot, slotTxCount: (fortress.slotTxSlot === slot ? fortress.slotTxCount : 0) + 1, chainTail: levySig }
    }
    set({
      player: {
        ...player,
        cash: player.cash + net,
        bankBalance: player.bankBalance - amount,
        transactions,
      },
      ...(fee > 0 ? { fortress } : {}),
    })
    get().notify({
      icon: channel === 'pos' ? '🏧' : '🏦',
      text:
        channel === 'pos'
          ? `${formatNaira(net)} enter your hand — the agent don chop ${formatNaira(fee)}.`
          : `${formatNaira(net)} don comot from bank.`,
      tone: 'good',
    })
    audio.play('notify')
    scheduleAutosave(get)
    return true
  },

  /** M8 — drop your own naira into the community light fund. In person,
   *  once per dark day; when the pool fills, the technician comes overnight. */
  contributeToPool: (tier) => {
    const { player, world, chaos } = get()
    if (!player || !world) return false
    if (!(CHAOS.poolTiers as readonly number[]).includes(tier)) return false
    const gate = canContribute(chaos, world.currentLocation, world.day)
    if (!gate.ok) {
      get().notify({ icon: '💡', text: gate.why, tone: 'neutral' })
      return false
    }
    const zoneName = LOCATION_BY_ID[chaos.active!.zoneId]?.name ?? chaos.active!.zoneId
    if (!get().removeMoney(tier, { label: `Community light fund — ${zoneName}`, category: 'other' })) {
      get().notify({ icon: '⚡', text: `Contribution na ${formatNaira(tier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const after = applyContribution(get().chaos, world.day, tier)
    set({ chaos: after })
    const need = Math.max(0, CHAOS.poolTarget - after.active!.pool)
    get().notify({
      icon: '⚡',
      text:
        need <= 0
          ? `Pool don complete! Technician go reach ${zoneName} tomorrow morning.`
          : `You drop ${formatNaira(tier)} — ${formatNaira(need)} more and the technician go come.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* ------------------------ work & opportunities ------------------------ */

  addMoney: (amount, meta) => {
    const { player, world, fortress } = get()
    if (!player || !world || amount <= 0) return
    const slot = absoluteSlot(world.day, world.timeOfDay)

    // M14 — THE VELOCITY GUARD: no flood of micro-events in one clock slot
    const inSlot = fortress.slotTxSlot === slot ? fortress.slotTxCount : 0
    const vel = velocityGuard(inSlot, FORTRESS.velocityCap)
    if (!vel.allow) {
      set({ fortress: { ...fortress, anomalies: fortress.anomalies + 1, slotTxSlot: slot, slotTxCount: inSlot } })
      get().notify({ icon: '🛡️', text: 'The fortress shut the flood gate — too many money events in one slot.', tone: 'bad' })
      audio.play('notify')
      return
    }

    // M14 — THE INCOME GUARD: ceilings, not crashes; the overflow is clamped + counted
    const dayEarned = fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0
    const guard = incomeGuard(amount, dayEarned, FORTRESS)
    const paid = guard.allowed
    if (guard.clamped) {
      set({ fortress: { ...get().fortress, anomalies: get().fortress.anomalies + 1 } })
      get().notify({ icon: '🛡️', text: `The fortress clamped an impossible income to ${formatNaira(paid)} (${guard.law === 'single' ? 'single-event' : 'day'} ceiling).`, tone: 'bad' })
      audio.play('notify')
      if (paid <= 0) return
    }

    // M14 — THE KOBO-CHAIN: the entry signs onto the ledger's chain
    const sig = chainNext(get().fortress.chainTail, { day: world.day, slot, amount: paid, category: meta.category, label: meta.label })
    const tx = { ...recordTransaction(meta.label, meta.category, paid, world.day, slot), sig }
    set({
      player: {
        ...player,
        cash: player.cash + paid,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
        stats: { ...player.stats, totalEarned: player.stats.totalEarned + paid },
      },
      // the fortress ledgers ride along (day earnings + the slot flood counter + the chain tail)
      fortress: { ...get().fortress, dayEarnedDay: world.day, dayEarned: (fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0) + paid, slotTxSlot: slot, slotTxCount: inSlot + 1, chainTail: sig },
      // M9 — juice: every honest naira pops (transform/opacity only)
      pulse: { id: nextPulseId(), amount: paid },
    })
    // M9 — the first ₦500 earned completes the onboarding 'earn' step
    if (get().player!.stats.totalEarned >= 500) bumpOnboarding(get, set, 'earn')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
  },

  removeMoney: (amount, meta) => {
    const { player, world, fortress } = get()
    if (!player || !world || amount <= 0) return false
    if (!canAfford(player.cash, amount)) {
      get().notify({ icon: '💸', text: 'You no get that kind money.', tone: 'bad' })
      return false
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    // M14 — the velocity guard rides spending too (the flood gate is symmetric)
    const inSlot = fortress.slotTxSlot === slot ? fortress.slotTxCount : 0
    if (!velocityGuard(inSlot, FORTRESS.velocityCap).allow) {
      set({ fortress: { ...fortress, anomalies: fortress.anomalies + 1, slotTxSlot: slot, slotTxCount: inSlot } })
      get().notify({ icon: '🛡️', text: 'The fortress shut the flood gate — too many money events in one slot.', tone: 'bad' })
      return false
    }
    // M14 — the kobo-chain signs the spend too (a full ledger, not a half one)
    const sig = chainNext(fortress.chainTail, { day: world.day, slot, amount: -amount, category: meta.category, label: meta.label })
    const tx = { ...recordTransaction(meta.label, meta.category, -amount, world.day, slot), sig }
    set({
      player: {
        ...player,
        cash: player.cash - amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
        stats: { ...player.stats, totalSpent: player.stats.totalSpent + amount },
      },
      fortress: { ...fortress, slotTxSlot: slot, slotTxCount: inSlot + 1, chainTail: sig },
    })
    audio.play('notify')
    scheduleAutosave(get)
    return true
  },

  /**
   * Apply a full reward bundle (cash + xp + skill xp + reputation) through
   * the proper engine actions, with ONE ledger entry for the cash part.
   * Jobs, hustles, events and future systems all pay through here.
   */
  giveReward: (reward, meta) => {
    const { player, world, fortress } = get()
    if (!player || !world) return

    // 1) cash + ledger entry — M14: the SAME income guard + kobo-chain every payout rides
    const cash = rewardCash(reward)
    if (cash > 0) {
      const slot = absoluteSlot(world.day, world.timeOfDay)
      const dayEarned = fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0
      const guard = incomeGuard(cash, dayEarned, FORTRESS)
      const paid = guard.allowed
      if (guard.clamped) {
        set({ fortress: { ...fortress, anomalies: fortress.anomalies + 1 } })
        get().notify({ icon: '🛡️', text: `The fortress clamped an impossible income to ${formatNaira(paid)} (${guard.law === 'single' ? 'single-event' : 'day'} ceiling).`, tone: 'bad' })
      }
      if (paid > 0) {
        const sig = chainNext(fortress.chainTail, { day: world.day, slot, amount: paid, category: meta.category, label: meta.label })
        const tx = { ...recordTransaction(meta.label, meta.category, paid, world.day, slot), sig }
        set({
          player: {
            ...player,
            cash: player.cash + paid,
            transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
            stats: { ...player.stats, totalEarned: player.stats.totalEarned + paid },
          },
          fortress: { ...fortress, dayEarnedDay: world.day, dayEarned: dayEarned + paid, slotTxSlot: slot, slotTxCount: (fortress.slotTxSlot === slot ? fortress.slotTxCount : 0) + 1, chainTail: sig },
          pulse: { id: nextPulseId(), amount: paid },
        })
        audio.play('chime')
        haptics.fire('reward')
        if (get().player!.stats.totalEarned >= 500) bumpOnboarding(get, set, 'earn')
      }
    }

    // 2) player XP (level-ups handled by the existing engine action)
    if (reward.xp && reward.xp > 0) get().addXp(reward.xp)

    // 3) skill XP
    for (const [skill, amount] of Object.entries(reward.skillXp ?? {})) {
      if (amount && amount > 0) get().addSkillXp(skill as SkillId, amount)
    }

    // 4) reputation
    if (reward.reputation && reward.reputation !== 0) get().addReputation(reward.reputation)

    // 5) one compact summary toast
    const summary = describeReward(reward)
    if (summary) get().notify({ icon: '🧾', text: summary, tone: 'good' })

    scheduleAutosave(get)
  },

  /** Work a formal job shift — reliable pay, real time + energy cost. */
  workShift: (jobId) => {
    const { player, world, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return

    const job = JOB_BY_ID[jobId]
    if (!job) return

    // --- guards: location, requirements, cooldown, energy ---
    if (world.currentLocation !== job.locationId) {
      const loc = LOCATION_BY_ID[job.locationId]
      get().notify({
        icon: '📍',
        text: `This shift is at ${loc?.name ?? 'another part of Lokoja'}.`,
        tone: 'bad',
      })
      return
    }
    // M12 — the career gate reads the FUL certificate from the live slice
    const req = checkRequirements(player, job.requirements, { graduated: get().education.graduated && get().education.convocationAttended })
    if (!req.ok) {
      audio.play('notify')
      get().notify({ icon: '🔒', text: req.reasons[0], tone: 'bad' })
      return
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const cd = cooldownRemaining(player.cooldowns, job.id, slot)
    if (cd > 0) {
      audio.play('notify')
      get().notify({
        icon: '⏳',
        text: `${job.name} needs a breather — ready in ${cd} time slot${cd > 1 ? 's' : ''}.`,
        tone: 'bad',
      })
      return
    }
    if (player.needs.energy < job.energyCost) {
      audio.play('notify')
      get().notify({ icon: '🥵', text: 'You are too tired for this shift. Rest first.', tone: 'bad' })
      return
    }

    const result = resolveJob(job, player)
    set({ isWorking: true, workingLabel: job.name })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      const needs = applySlotDecay(applyNeedsDelta(p.needs, { energy: -job.energyCost }), job.timeSlots, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, job.timeSlots)
      const afterSlot = absoluteSlot(clock.day, clock.timeOfDay)
      const cooldownSlots = job.cooldownSlots ?? WORK.defaultCooldownSlots

      set({
        player: {
          ...p,
          needs,
          cooldowns: { ...p.cooldowns, [job.id]: afterSlot + cooldownSlots },
          stats: { ...p.stats, jobsCompleted: p.stats.jobsCompleted + 1 },
        },
        world: { ...w, ...clock },
        isWorking: false,
        workingLabel: null,
      })
      // M12 — the uniform builds the MOPOL trust ledger
      if (job.id === 'police-recruit') {
        set({ japa: { ...get().japa, policeShifts: get().japa.policeShifts + 1 } })
      }

      get().notify({
        icon: result.outcome === 'great' ? '🌟' : '💼',
        text: result.headline,
        tone: 'good',
      })
      get().giveReward(result.reward, { label: job.name, category: 'job' })
      get().bumpGoal('job')
      bumpOnboarding(get, set, 'work')
      if (result.outcome === 'great') audio.play('levelup')
    haptics.fire('levelup')
      scheduleAutosave(get)
    }

    setTimeout(applyDone, WORK.transitionMs)
  },

  /** Look around the current area for personal hustles (gist). */
  searchHustles: () => {
    const { player, world } = get()
    if (!player || !world) return

    const slot = absoluteSlot(world.day, world.timeOfDay)
    if (cooldownRemaining(player.cooldowns, 'hustle-search', slot) > 0) {
      audio.play('notify')
      get().notify({ icon: '⏳', text: 'You just checked around. Give the streets a moment.', tone: 'bad' })
      return
    }

    const generation = generateHustleOffers(world.currentLocation, player, slot)
    set({
      player: {
        ...player,
        cooldowns: { ...player.cooldowns, 'hustle-search': slot + HUSTLE.searchCooldownSlots },
      },
      offers: generation.offers,
    })

    if (generation.dry) {
      audio.play('notify')
      get().notify({ icon: '👀', text: 'You looked around but nothing came up this time.', tone: 'neutral' })
    } else {
      audio.play('notify')
      get().notify({
        icon: '🗣️',
        text: `Fresh gist! ${generation.offers.length} offer${generation.offers.length > 1 ? 's' : ''} came up.`,
        tone: 'good',
      })
    }
    scheduleAutosave(get)
  },

  /** Accept a hustle offer — it joins the player's active opportunities. */
  acceptOffer: (instanceId) => {
    const { player, offers } = get()
    if (!player) return
    const offer = offers.find((o) => o.instanceId === instanceId)
    if (!offer) return

    if (player.activeOpportunities.length >= HUSTLE.maxActive) {
      audio.play('notify')
      get().notify({
        icon: '🎒',
        text: `Your hands are full — finish or drop something first (max ${HUSTLE.maxActive}).`,
        tone: 'bad',
      })
      return
    }
    if (player.activeOpportunities.some((o) => o.defId === offer.defId)) {
      audio.play('notify')
      get().notify({ icon: '🤔', text: 'You already took this one.', tone: 'bad' })
      return
    }

    set({
      player: { ...player, activeOpportunities: [...player.activeOpportunities, offer] },
      offers: offers.filter((o) => o.instanceId !== instanceId),
    })
    audio.play('click')
    get().notify({ icon: '🤝', text: 'Offer accepted — it goes cold if you wait too long!', tone: 'good' })
    scheduleAutosave(get)
  },

  declineOffer: (instanceId) => {
    const { offers } = get()
    const offer = offers.find((o) => o.instanceId === instanceId)
    if (!offer) return
    set({ offers: offers.filter((o) => o.instanceId !== instanceId) })
    audio.play('click')
    get().notify({ icon: '🚶', text: 'You declined. No wahala.', tone: 'neutral' })
  },

  /** Do an accepted hustle at its real location — outcome rolls in work.ts. */
  completeOpportunity: (instanceId) => {
    const { player, world, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return

    const instance = player.activeOpportunities.find((o) => o.instanceId === instanceId)
    if (!instance) return
    const def = hustleDefFor(instance)
    if (!def) {
      // data changed between versions — drop the orphan quietly but honestly
      set({
        player: {
          ...player,
          activeOpportunities: player.activeOpportunities.filter((o) => o.instanceId !== instanceId),
        },
      })
      return
    }

    if (world.currentLocation !== instance.locationId) {
      const loc = LOCATION_BY_ID[instance.locationId]
      audio.play('notify')
      get().notify({
        icon: '📍',
        text: `This hustle is at ${loc?.name ?? 'another part of Lokoja'}.`,
        tone: 'bad',
      })
      return
    }
    if (player.needs.energy < def.energyCost) {
      audio.play('notify')
      get().notify({ icon: '🥵', text: 'Too tired for this hustle. Rest small first.', tone: 'bad' })
      return
    }

    const result = resolveOpportunity(instance, player)
    if (!result) return
    set({ isWorking: true, workingLabel: def.title })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      const needs = applySlotDecay(applyNeedsDelta(p.needs, {
        energy: -def.energyCost,
        mood: result.outcome === 'fail' ? WORK.fail.moodDelta : 0,
      }), def.timeSlots, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, def.timeSlots)
      const afterSlot = absoluteSlot(clock.day, clock.timeOfDay)

      set({
        player: {
          ...p,
          needs,
          cooldowns: { ...p.cooldowns, [def.id]: afterSlot + def.cooldownSlots },
          activeOpportunities: p.activeOpportunities.filter((o) => o.instanceId !== instanceId),
          stats: { ...p.stats, hustlesCompleted: p.stats.hustlesCompleted + 1 },
        },
        world: { ...w, ...clock },
        isWorking: false,
        workingLabel: null,
      })

      get().notify({
        icon: result.outcome === 'great' ? '🌟' : result.outcome === 'fail' ? '😐' : '🤝',
        text: result.headline,
        tone: result.outcome === 'fail' ? 'bad' : 'good',
      })
      get().giveReward(result.reward, { label: def.title, category: 'hustle' })
      get().bumpGoal('hustle')
      bumpOnboarding(get, set, 'work')
      audio.play(result.outcome === 'fail' ? 'notify' : result.outcome === 'great' ? 'levelup' : 'chime')
      scheduleAutosave(get)
    }

    setTimeout(applyDone, WORK.transitionMs)
  },

  dropOpportunity: (instanceId) => {
    const { player } = get()
    if (!player) return
    const dropped = player.activeOpportunities.find((o) => o.instanceId === instanceId)
    if (!dropped) return
    const def = hustleDefFor(dropped)
    set({
      player: {
        ...player,
        activeOpportunities: player.activeOpportunities.filter((o) => o.instanceId !== instanceId),
      },
    })
    audio.play('click')
    get().notify({ icon: '🚶', text: `You dropped “${def?.title ?? 'the offer'}”.`, tone: 'neutral' })
    scheduleAutosave(get)
  },

  /** Lazily remove expired offers — the Work screen calls this on mount. */
  pruneExpired: () => {
    const { player, world, offers } = get()
    if (!player || !world) return
    const slot = absoluteSlot(world.day, world.timeOfDay)

    const { kept, expired } = pruneExpiredOpportunities(player.activeOpportunities, slot)
    const keptOffers = offers.filter((o) => o.expiresAtSlot > slot)

    if (kept.length === player.activeOpportunities.length && keptOffers.length === offers.length) {
      return
    }

    set({ player: { ...player, activeOpportunities: kept }, offers: keptOffers })
    for (const o of expired) {
      const def = hustleDefFor(o)
      get().notify({ icon: '⌛', text: `“${def?.title ?? 'An offer'}” went cold.`, tone: 'neutral' })
    }
    scheduleAutosave(get)
  },

  /* -------------------------- engine actions ---------------------------- */

  addCash: (amount) => {
    const { player } = get()
    if (!player || amount === 0) return
    set({ player: { ...player, cash: Math.max(0, player.cash + amount) } })
    if (amount > 0) audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
  },
})
