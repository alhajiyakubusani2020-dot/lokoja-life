/**
 * LIFESTYLE SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1273-1275, 4305-4334, 4336-4464.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, LifestyleSlice } from '../types'
import { audio } from '../../systems/audio'
import { haptics } from '../../systems/haptics'
import { applyNeedsDelta } from '../../systems/needs'
import {
  freshPattiState,
  nearestSecret,
  discover,
} from '../../systems/patti'
import { formatNaira } from '../../systems/progression'
import {
  freshStoryState,
  canCarrySand,
  canPayNotebook,
  canPayFever,
  canSponsor as canSponsorStory,
  canGraduate,
  applyCarry,
  applyNotebook,
  applyFever,
  applySponsor,
  applyWhiteCoat,
  STORY,
} from '../../systems/story'
import {
  freshWardrobeState,
  shopBuy,
  equipWalk as equipWalkLaw,
  WALK_BY_KEY,
  PREMIUM_BY_KEY,
} from '../../systems/wardrobe'
import { scheduleAutosave } from '../shared'
import type { StoryChapter } from '../../systems/story'

export const lifestyleSlice: StateCreator<GameStore, [], [], LifestyleSlice> = (set, get) => ({
  story: freshStoryState(),
  patti: freshPattiState(),
  wardrobe: freshWardrobeState(),

  /* --------------------------- M19 — the wardrobe --------------------------- */

  /** THE SHOP DOOR: the law verdicts first, the wallet pays second. */
  wardrobeBuy: (kind, itemKey) => {
    const { player, wardrobe } = get()
    if (!player) return { ok: false, why: 'Start a life first.' }
    const v = shopBuy(wardrobe, kind, itemKey)
    if (!v.ok) return { ok: false, why: v.why }
    if (player.cash < v.price) return { ok: false, why: `You need ${formatNaira(v.price)} — the wallet no reach.` }
    get().removeMoney(v.price, { label: `${kind === 'walk' ? 'Walk style' : 'Outfit'} — ${kind === 'walk' ? WALK_BY_KEY.get(itemKey)?.label : PREMIUM_BY_KEY.get(itemKey)?.label ?? itemKey}`, category: 'shop' })
    const next = kind === 'walk'
      ? { ...wardrobe, ownedWalks: [...wardrobe.ownedWalks, v.itemKey] }
      : { ...wardrobe, ownedStyles: [...wardrobe.ownedStyles, v.itemKey] }
    set({ wardrobe: next })
    get().notify({ icon: kind === 'walk' ? '🕺' : '👑', text: `${kind === 'walk' ? 'Walk' : 'Outfit'} secured — ${v.itemKey} na yours now.`, tone: 'good' })
    haptics.fire('reward')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** THE EQUIP DOOR: an owned walk only — the rig never takes credit. */
  wardrobeEquipWalk: (walkKey) => {
    const { wardrobe } = get()
    const v = equipWalkLaw(wardrobe, walkKey)
    if (!v.ok) return { ok: false, why: v.why }
    set({ wardrobe: { ...wardrobe, activeWalk: v.walkKey } })
    audio.play('click')
    scheduleAutosave(get)
    return { ok: true }
  },

  /* ------------------------ M19 — THE CONFLUENCE PATH ----------------------- */

  /** Chapter 1: one carry of sand per day beside the crusher boy. */
  storyCarrySand: () => {
    const { player, world, story } = get()
    if (!player || !world) return { ok: false, why: 'Start a life first.' }
    if (world.currentLocation !== STORY.meetPlace) return { ok: false, why: 'Find the crusher boy at the Patti trail base.' }
    const v = canCarrySand(story, { day: world.day, chapter: story.chapter as StoryChapter, energy: player.needs.energy })
    if (!v.ok) return { ok: false, why: v.why }
    // the honest needs engine pays the sand's energy, the wallet pays the split
    set({ player: { ...player, needs: applyNeedsDelta(player.needs, { energy: -STORY.sandEnergy }) } })
    get().addMoney(STORY.sandPay, { label: 'Sand run with the crusher boy', category: 'hustle' })
    set({ story: applyCarry(story, world.day) })
    const after = get().story
    get().notify({
      icon: '⛏️',
      text: after.chapter >= 2
        ? `Three days of sand — the boy talk say him wan go school. Him name na Musa.`
        : `Sand carried — ${formatNaira(STORY.sandPay)} split. Musa nod for you.`,
      tone: 'good',
    })
    haptics.fire('quest')
    get().bumpGoal('work')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 2: the notebook — ₦3,500 or the school's own trust (level ≥ 5). */
  storyPayNotebook: () => {
    const { player, story } = get()
    if (!player) return { ok: false, why: 'Start a life first.' }
    const v = canPayNotebook(story, { chapter: story.chapter as StoryChapter, cash: player.cash, level: player.level })
    if (!v.ok) return { ok: false, why: v.why }
    if (v.cost > 0) get().removeMoney(v.cost, { label: "Musa's school levy + notebook", category: 'shop' })
    set({ story: applyNotebook(story) })
    get().addReputation(4)
    get().notify({ icon: '📒', text: v.cost > 0 ? `Notebook + levy paid — ${formatNaira(v.cost)}. Musa dey smile for the first time.` : 'Your word stand in for the levy — the school sabi your face.', tone: 'good' })
    haptics.fire('quest')
    get().bumpGoal('work')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 3: the fever night at the hospital — ₦2,000 or the story stops here. */
  storyPayFever: () => {
    const { player, story } = get()
    if (!player) return { ok: false, why: 'Start a life first.' }
    const v = canPayFever(story, { chapter: story.chapter as StoryChapter, cash: player.cash })
    if (!v.ok) return { ok: false, why: v.why }
    get().removeMoney(v.cost, { label: 'FTH fever night — Musa', category: 'shop' })
    set({ story: applyFever(story) })
    get().addReputation(5)
    get().notify({ icon: '🏥', text: `The fever break — ${formatNaira(v.cost)} settle am. Musa say he go become doctor, mark am.`, tone: 'good' })
    haptics.fire('quest')
    get().bumpGoal('work')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 4: ₦500 a day on the desk — six days. */
  storySponsor: () => {
    const { player, world, story } = get()
    if (!player || !world) return { ok: false, why: 'Start a life first.' }
    const v = canSponsorStory(story, { day: world.day, chapter: story.chapter as StoryChapter, cash: player.cash })
    if (!v.ok) return { ok: false, why: v.why }
    get().removeMoney(v.cost, { label: "Sponsor Musa's desk", category: 'shop' })
    set({ story: applySponsor(story, world.day) })
    const after = get().story
    get().notify({
      icon: '🪑',
      text: after.sponsoredDays >= STORY.sponsorDays
        ? `Six days complete — the exams dey come. Wait small.`
        : `Desk sponsored (${after.sponsoredDays}/${STORY.sponsorDays}) — ${formatNaira(v.cost)} well spent.`,
      tone: 'good',
    })
    haptics.fire('quest')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 5: the white coat — the wait served, the city celebrates. */
  storyGraduate: () => {
    const { player, world, story } = get()
    if (!player || !world) return { ok: false, why: 'Start a life first.' }
    const v = canGraduate(story, { day: world.day })
    if (!v.ok) return { ok: false, why: v.why }
    set({ story: applyWhiteCoat(story, world.day) })
    get().addReputation(STORY.whiteCoatRep)
    // THE DROPS: the earned agbada + the Chairman Strut — one clean set()
    const wd = get().wardrobe
    set({
      wardrobe: {
        ...wd,
        ownedStyles: [...new Set([...wd.ownedStyles, STORY.whiteCoatOutfit])],
        ownedWalks: [...new Set([...wd.ownedWalks, STORY.whiteCoatWalk])],
      },
    })
    get().notify({ icon: '🎓', text: `DR. MUSA! The white coat don land — Confluence Gold agbada + Chairman Strut na YOURS. Day ${world.day}.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** M19 — THE HILL'S WHISPER: the HUD poll asks; the law answers.
   *  Rewards pay through the honest engines; the discovery book is idempotent. */
  checkPatti: (x, z) => {
    const { world, patti } = get()
    if (!world) return null
    const hit = nearestSecret(x, z, patti)
    if (!hit) return null
    const res = discover(patti, hit.secret.id, world.day)
    if (!res.isNew) return null
    set({ patti: res.state })
    // the reward rides the SAME engines as every other naira/xp/rep
    const r = hit.secret.reward
    if (r.kind === 'cash' && r.amount) get().addMoney(r.amount, { label: `Patti secret — ${hit.secret.name}`, category: 'tip' })
    if (r.kind === 'xp' && r.amount) get().addXp(r.amount)
    if (r.kind === 'rep' && r.amount) get().addReputation(r.amount)
    if (r.kind === 'outfit' && r.item) {
      const wd = get().wardrobe
      set({ wardrobe: { ...wd, ownedStyles: [...new Set([...wd.ownedStyles, r.item])] } })
    }
    get().notify({ icon: '🗿', text: `SECRET FOUND — ${hit.secret.name}: ${hit.secret.line}`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('secret')
    scheduleAutosave(get)
    return hit.secret
  },
})
