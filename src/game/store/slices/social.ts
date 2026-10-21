/**
 * SOCIAL SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1265-1265, 3300-3371, 3373-3474, 4466-4529.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, SocialSlice } from '../types'
import {
  HUSTLE,
  SOCIAL,
  CHILL,
  SHIELD,
} from '../../data/config'
import { HUSTLE_BY_ID } from '../../data/hustles'
import { NPC_CHAT } from '../../data/npcChat'
import { NPC_BY_ID } from '../../data/npcs'
import { audio } from '../../systems/audio'
import { haptics } from '../../systems/haptics'
import { applyNeedsDelta, applySlotDecay } from '../../systems/needs'
import { makeOpportunityInstance, isEligible } from '../../systems/opportunities'
import { formatNaira } from '../../systems/progression'
import {
  freshShieldState,
  canPlayScammer,
  scamRound,
  scamAnswerApply,
  validateParentPin,
  localPinHash,
  makeLocalSalt,
  tierGateVerdict,
} from '../../systems/shield'
import {
  canChat,
  relationshipFor,
  tierFor,
  pickLine,
  afterChat,
  canGift,
  canHangout,
  afterGift,
  afterHangout,
  favorRollsToday,
  giftById,
  TIER_META,
} from '../../systems/social'
import { advanceWorldClock, absoluteSlot } from '../../systems/world'
import { scheduleAutosave } from '../shared'
import type { ActiveOpportunity } from '../../types'

export const socialSlice: StateCreator<GameStore, [], [], SocialSlice> = (set, get) => ({
  shield: freshShieldState(),

  chatNpc: (npcId) => {
    const { player, world } = get()
    if (!player || !world) return null
    const npc = NPC_BY_ID[npcId]
    if (!npc) return null
    const today = world.day
    const rel = relationshipFor(player.relationships, npcId)
    if (!canChat(rel, today)) {
      get().notify({
        icon: '💬',
        text: `You don talk with ${npc.name} today. Tomorrow another level.`,
        tone: 'neutral',
      })
      return null
    }
    const next = afterChat(rel, today)
    const tier = tierFor(next.familiarity)
    const pool = NPC_CHAT[npcId]
    const firstMeeting = rel.familiarity === 0
    const reply = pool
      ? firstMeeting
        ? pool.stranger[0]
        : pickLine(pool[tier], rel.familiarity, today)
      : npc.bio

    // M6 — a paddy pays back: on a lucky (deterministic) day, a real paddy
    // drops REAL gist — an eligible hustle from THEIR OWN offers, through
    // the SAME opportunity pipeline. Transient: accept now or it goes cold.
    let favorOffer: ActiveOpportunity | undefined
    if (favorRollsToday(next.familiarity, npcId, today)) {
      const slot = absoluteSlot(today, world.timeOfDay)
      const def = Object.values(HUSTLE_BY_ID).find(
        (d) => d.npcId === npcId && isEligible(d, player, slot, player.activeOpportunities),
      )
      if (def) favorOffer = { ...makeOpportunityInstance(def, slot), source: 'gist' }
    }

    set({ player: { ...player, relationships: { ...player.relationships, [npcId]: next } } })
    get().addSkillXp('social', 2)
    get().bumpGoal('chat')
    if (favorOffer) {
      get().notify({ icon: '🤝', text: `${npc.name} get small work for you — check the chat.`, tone: 'good' })
    }
    scheduleAutosave(get)
    return { npcId, tier, familiarity: next.familiarity, reply, firstMeeting, favorOffer }
  },

  /** M13 — KID SOCIALS: the emote road. Same relationship clock, same
   *  cooldown law, same familiarity ledger — but the words are preset
   *  emotes and the replies are preset warmth. No free text, ever. */
  emoteChat: (npcId, emoteId) => {
    const { player, world } = get()
    if (!player || !world) return null
    if (player.ageBand !== 'kid') return null
    const npc = NPC_BY_ID[npcId]
    const emote = SHIELD.kidEmotes.find((e) => e.id === emoteId)
    if (!npc || !emote) return null
    const rel = relationshipFor(player.relationships, npcId)
    if (!canChat(rel, world.day)) {
      get().notify({ icon: '💬', text: `You don greet ${npc.name} today — tomorrow another level.`, tone: 'neutral' })
      return null
    }
    const next = afterChat(rel, world.day)
    next.familiarity = Math.min(100, rel.familiarity + emote.fam)
    const tier = tierFor(next.familiarity)
    set({ player: { ...player, relationships: { ...player.relationships, [npcId]: next } } })
    get().addSkillXp('social', 1)
    get().bumpGoal('chat')
    audio.play('click')
    scheduleAutosave(get)
    return { npcId, tier, familiarity: next.familiarity, reply: emote.reply, firstMeeting: rel.familiarity === 0 }
  },

  /* --------------------- M6 — social depth (gifts / hangout) --------------------- */

  giveGift: (npcId, giftId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const npc = NPC_BY_ID[npcId]
    const gift = giftById(giftId)
    if (!npc || !gift) return false
    const rel = relationshipFor(player.relationships, npcId)
    if (!canGift(rel, world.day)) {
      get().notify({ icon: '🎁', text: `You don give ${npc.name} gift today — no overdo am.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gift.cost, { label: `Gift — ${gift.label} for ${npc.name}`, category: 'other' })) {
      get().notify({ icon: '🎁', text: `${gift.label} costs ${formatNaira(gift.cost)} — you no carry am.`, tone: 'bad' })
      return false
    }
    const paid = get().player!
    const next = afterGift(rel, gift, world.day)
    const beforeTier = tierFor(rel.familiarity)
    const afterTier = tierFor(next.familiarity)
    set({
      player: {
        ...paid,
        needs: applyNeedsDelta(paid.needs, { mood: SOCIAL.giftMood }),
        relationships: { ...paid.relationships, [npcId]: next },
      },
    })
    get().notify({
      icon: gift.emoji,
      text: `${npc.name} collect the ${gift.label} — familiarity +${gift.familiarity}.${afterTier !== beforeTier ? ` You two na ${TIER_META[afterTier].label} now!` : ''}`,
      tone: 'good',
    })
    get().bumpGoal('gift')
    audio.play(afterTier !== beforeTier ? 'levelup' : 'chime')
    scheduleAutosave(get)
    return true
  },

  hangout: (npcId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const npc = NPC_BY_ID[npcId]
    if (!npc) return false
    const rel = relationshipFor(player.relationships, npcId)
    if (!(SOCIAL.hangout.slots as readonly string[]).includes(world.timeOfDay)) {
      get().notify({ icon: '🌙', text: 'Hangout na after-work something — evening or night.', tone: 'neutral' })
      return false
    }
    if (!canHangout(rel, world.day)) {
      get().notify({ icon: '🍻', text: `You and ${npc.name} just hang out — give am small space (every ${SOCIAL.hangout.cooldownDays} days).`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(SOCIAL.hangout.cost, { label: `Night out with ${npc.name}`, category: 'fun' })) {
      get().notify({ icon: '🍻', text: `Pulling ${npc.name} out costs ${formatNaira(SOCIAL.hangout.cost)} — you no reach.`, tone: 'bad' })
      return false
    }
    const paid = get().player!
    const next = afterHangout(rel, world.day)
    set({
      player: {
        ...paid,
        needs: applyNeedsDelta(applySlotDecay(paid.needs, 1, get().settings.chill ? CHILL.decayMult : 1), { mood: SOCIAL.hangout.mood }),
        relationships: { ...paid.relationships, [npcId]: next },
      },
      world: { ...world, ...advanceWorldClock(world.timeOfDay, world.day, world.weather, 1) },
    })
    get().notify({
      icon: '🍻',
      text: `You and ${npc.name} catch evening together — mood +${SOCIAL.hangout.mood}, familiarity +${SOCIAL.hangout.familiarity}.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Accept a paddy's favour — the acceptOffer guards (hands-full, duplicate)
   *  apply exactly; only the transport differs (chat hands the instance over). */
  acceptFavorOffer: (offer) => {
    const { player } = get()
    if (!player) return
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
    set({ player: { ...player, activeOpportunities: [...player.activeOpportunities, offer] } })
    audio.play('click')
    get().notify({ icon: '🤝', text: 'Favour accepted — it goes cold if you wait too long!', tone: 'good' })
    scheduleAutosave(get)
  },

  /** M13 — SPOT THE SCAMMER: one round per day, honest money for sharp eyes. */
  playScammer: (pickIndex) => {
    const { player, world, shield } = get()
    if (!player || !world) return
    if (!canPlayScammer(shield.scammerDay, world.day)) {
      get().notify({ icon: '⏳', text: 'The street teaches once a day — come back tomoro.', tone: 'neutral' })
      audio.play('notify')
      return
    }
    const round = scamRound(world.day)
    const res = scamAnswerApply(shield, round, pickIndex, world.day)
    set({ shield: res.next })
    if (res.correct && res.reward) {
      get().addMoney(res.reward.cash, { label: 'Spot the Scammer — sharp eye', category: 'tip' })
      get().addSkillXp('smart', res.reward.smartXp)
      set({ player: { ...get().player!, needs: applyNeedsDelta(get().player!.needs, { mood: res.reward.mood }) } })
      get().notify({ icon: '🛡️', text: `Correct! ${res.lesson} (+${formatNaira(res.reward.cash)})`, tone: 'good' })
      audio.play('chime')
      haptics.fire('reward')
      get().bumpGoal('study')
    } else {
      get().notify({ icon: '📚', text: `That one na honest talk. Lesson: ${res.lesson}`, tone: 'neutral' })
      audio.play('notify')
    }
    scheduleAutosave(get)
  },

  /** M13 — the local parent-PIN gate (guests): first set stores the salted hash. */
  setLocalParentPin: (pin) => {
    const v = validateParentPin(pin)
    if (!v.ok) {
      get().notify({ icon: '🔒', text: v.why, tone: 'bad' })
      audio.play('notify')
      return false
    }
    if (get().shield.parentPinHash) {
      get().notify({ icon: '🔒', text: 'A parent PIN already guards this device.', tone: 'bad' })
      return false
    }
    set({ shield: { ...get().shield, parentPinHash: localPinHash(pin, makeLocalSalt()) } })
    get().notify({ icon: '🛡️', text: 'Parent PIN set — the tier ladder dey under your watch now.', tone: 'good' })
    scheduleAutosave(get)
    return true
  },

  /** M13 — the local tier gate: climb kid→teen→adult with the parent's yes. */
  unlockTierLocal: (to, parentPin) => {
    const { player, shield } = get()
    if (!player) return false
    const from = player.ageBand
    const pinOk = shield.parentPinHash !== null && localPinHash(parentPin, shield.parentPinHash.slice(8)) === shield.parentPinHash
    const verdict = tierGateVerdict(from, to, pinOk)
    if (!verdict.allowed) {
      get().notify({ icon: '🔒', text: verdict.why, tone: 'bad' })
      audio.play('notify')
      return false
    }
    set({ player: { ...player, ageBand: to } })
    get().notify({ icon: '🛡️', text: `Life stage moved to ${to.toUpperCase()} — the city adjusts to you.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },
})
