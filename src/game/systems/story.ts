/**
 * LOKOJA LIFE — M19: THE CONFLUENCE PATH (the story quest laws)
 * -------------------------------------------------------------
 * One deterministic five-chapter chain: the Crusher boy on the Patti
 * trail → the notebook → the fever night → the sponsorship desk → the
 * white coat. Lokoja's honest ladder — no lottery, no luck: the same
 * grind, the same day, the same naira, every player.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, ctx) → same verdict. No
 *    store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every number lives in the STORY table — nothing hard-coded inside
 *    a branch. NO money math happens here: the store wires
 *    removeMoney/addMoney around these validators.
 *  - One task at a time: currentTask() derives from state + ctx and
 *    the story panel just renders it. Energy is NEVER part of task
 *    readiness (the ctx carries no energy) — the task exposes its
 *    energy cost and the ACTION re-validates through canCarrySand at
 *    the store, where the live needs value lives.
 *  - The appliers return NEW state objects; the store drops them into
 *    set() — nothing here mutates the save.
 *  - Chapter 0 → 1 has no separate action: the MEETING is the first
 *    carry (day >= meetDay), exactly as the boy would have it.
 *
 * LOCATION TRUTH: the registry holds no 'fth' id (real ids: home,
 * kpata-market, ganaja-junction, confluence, mount-patti, historic-
 * lokoja, government-area, university-area, food-area, transport-area,
 * plus the school sites). The hospital beats — the fever night and the
 * white coat — therefore stand at 'government-area': the GRA, "where
 * paperwork can change your whole week", the honest civic stand-in for
 * a Federal Teaching Hospital. If a real FTH location is ever
 * registered, only the two constants below move.
 */

import type { StoryState } from '../types'

/* ------------------------------- the numbers -------------------------------- */

/**
 * THE CONFLUENCE PATH — every naira, every energy point, every gate.
 * Honest money: the boy pays 400 a carry, the levy is 3,500 (waived
 * when the school knows you), the fever night costs 2,000, the desk
 * takes 500 a day for six days. Nothing else moves.
 */
export const STORY = {
  meetDay: 3, // chapter 1 unlocks on absolute day >= 3
  sandCarries: 3, // distinct days of carrying sand
  sandEnergy: 14, // energy cost per carry
  sandPay: 400, // honest pay per carry (the boy shares his day's cut)
  meetPlace: 'mount-patti' as const, // location id — the trailhead (REAL registry id)
  notebookCost: 3500, // chapter 2: ₦ for the school levy + books
  notebookLevel: 5, // OR the player's level >= 5 covers it (the school knows you)
  feverCost: 2000, // chapter 3: the fever night
  feverPlace: 'government-area' as const, // REAL registry id — the GRA stands in for the FTH (see header)
  sponsorCost: 500, // per day, chapter 4
  sponsorDays: 6,
  graduateWaitDays: 4, // after the 6th sponsor day, the coat lands this many days later
  graduatePlace: 'government-area' as const, // REAL registry id — same GRA desk, now sewing (see header)
  whiteCoatRep: 15,
  whiteCoatCash: 0,
  whiteCoatOutfit: 'confluence-gold' as const, // the wardrobe drop granted (systems/wardrobe.ts, price 0 — "not sold, earned")
  whiteCoatWalk: 'strut' as const, // second drop: the Chairman Strut walk (systems/wardrobe.ts WALK_STYLES)
} as const

/* ------------------------------ the chapter law ------------------------------ */

export type StoryChapter = 0 | 1 | 2 | 3 | 4 | 5

/**
 * THE chapter is DERIVED from the save's progress flags — never
 * trusted from the stored number alone. The ladder is strict:
 * doctorDay > 0 → 5, feverPaid → 4, notePaid → 3, three sand days → 2,
 * any sand day (or a stored chapter ≥ 1: the boy has been met) → 1,
 * else 0 — not met.
 */
export function chapterOf(s: StoryState): StoryChapter {
  if (s.doctorDay > 0) return 5
  if (s.feverPaid) return 4
  if (s.notePaid) return 3
  if (s.sandDays >= STORY.sandCarries) return 2
  if (s.sandDays > 0 || s.chapter >= 1) return 1
  return 0
}

/** Fresh save memory — the store seeds this once, then only appliers touch it. */
export function freshStoryState(): StoryState {
  return {
    chapter: 0,
    sandDays: 0,
    lastSandDay: 0,
    notePaid: false,
    feverPaid: false,
    sponsoredDays: 0,
    lastSponsorDay: 0,
    doctorDay: 0,
  }
}

/* -------------------------------- the one task ------------------------------- */

/** The single thing the confluence path asks of you right now. */
export interface StoryTask {
  id: string
  label: string
  place: string
  kind: 'carry' | 'pay' | 'wait'
  cost?: number
  energy?: number
  ready: boolean
  hint: string
}

/**
 * ONE task at a time, deterministic from state + ctx. The panel reads
 * this and nothing else; the store still runs the can* validators
 * before any mutation (the task is the offer, the validator is the
 * door). Energy never gates readiness here — the carry task carries
 * its energy cost in `energy` for the UI to grey, and the honest door
 * is canCarrySand().
 */
export function currentTask(
  s: StoryState,
  ctx: { day: number; level: number; cash: number },
): StoryTask | null {
  const ch = chapterOf(s)

  if (ch === 0) {
    // The boy comes down the trail on meetDay — before that, silence.
    if (ctx.day < STORY.meetDay) return null
    return {
      id: 'meet-carry',
      label: 'Carry sand with the boy',
      place: STORY.meetPlace,
      kind: 'carry',
      energy: STORY.sandEnergy,
      ready: ctx.day > s.lastSandDay,
      hint: `A small boy on the Patti trail hails you — one honest carry, he shares his cut: ₦${STORY.sandPay} for ${STORY.sandEnergy} energy.`,
    }
  }

  if (ch === 1) {
    const left = STORY.sandCarries - s.sandDays
    return {
      id: 'carry-sand',
      label: left === 1 ? 'One last carry' : `Carry sand — ${left} days to go`,
      place: STORY.meetPlace,
      kind: 'carry',
      energy: STORY.sandEnergy,
      ready: ctx.day > s.lastSandDay,
      hint:
        left === 1
          ? `The last carry — finish it and the boy opens his notebook. ₦${STORY.sandPay} for ${STORY.sandEnergy} energy.`
          : `Bucket by bucket — one carry a day, ₦${STORY.sandPay} and ${STORY.sandEnergy} energy each. The boy counts days, not grammar.`,
    }
  }

  if (ch === 2) {
    // The school knows you: level >= notebookLevel waives the levy (cost 0).
    const cost = ctx.level >= STORY.notebookLevel ? 0 : STORY.notebookCost
    return {
      id: 'pay-notebook',
      label: cost === 0 ? 'Settle the notebook — waived' : 'Pay the school levy',
      place: STORY.meetPlace,
      kind: 'pay',
      cost,
      ready: ctx.cash >= cost,
      hint:
        cost === 0
          ? `The school knows your name — the ₦${STORY.notebookCost} levy is waved through. Walk it off the boy's head.`
          : `The boy's school levy and books: ₦${STORY.notebookCost}. Nobody lends it — you earned it on the trail.`,
    }
  }

  if (ch === 3) {
    return {
      id: 'pay-fever',
      label: 'Settle the fever night',
      place: STORY.feverPlace,
      kind: 'pay',
      cost: STORY.feverCost,
      ready: ctx.cash >= STORY.feverCost,
      hint: `The boy shakes with fever at the GRA hospital — ₦${STORY.feverCost} for the injections, tonight.`,
    }
  }

  if (ch === 4) {
    if (s.sponsoredDays < STORY.sponsorDays) {
      const left = STORY.sponsorDays - s.sponsoredDays
      return {
        id: 'sponsor-day',
        label: left === 1 ? 'Sponsor the last day' : `Sponsor the desk — ${left} days to go`,
        place: STORY.feverPlace,
        kind: 'pay',
        cost: STORY.sponsorCost,
        ready: ctx.cash >= STORY.sponsorCost && ctx.day > s.lastSponsorDay,
        hint: `₦${STORY.sponsorCost} a day, ${left} left of ${STORY.sponsorDays}. The desk keeps an honest book — one day at a time.`,
      }
    }
    return {
      id: 'wait-coat',
      label: 'Wait for the white coat',
      place: STORY.graduatePlace,
      kind: 'wait',
      ready: ctx.day >= coatDay(s),
      hint: `All six days banked — the tailor sews. Return on day ${coatDay(s)} and walk out a doctor.`,
    }
  }

  // Chapter 5: the confluence path is walked. The city moves on.
  return null
}

/* ------------------------------- the coat day -------------------------------- */

/**
 * The day the white coat lands: the 6th sponsorship stamps the wait —
 * lastSponsorDay + graduateWaitDays. Zero until all six days are
 * banked (no lastSponsorDay, no coat — the desk's book is the law).
 */
export function coatDay(s: StoryState): number {
  return s.lastSponsorDay > 0 && s.sponsoredDays >= STORY.sponsorDays
    ? s.lastSponsorDay + STORY.graduateWaitDays
    : 0
}

/* ----------------------------- action validators ----------------------------- */

/**
 * THE SAND DOOR — chapter 1 (or chapter 0 with day >= meetDay: the
 * meeting IS the first carry), energy >= sandEnergy, one carry per
 * day. The store calls this BEFORE touching money or needs.
 */
export function canCarrySand(
  s: StoryState,
  ctx: { day: number; chapter: StoryChapter; energy: number },
): { ok: true } | { ok: false; why: string } {
  if (ctx.chapter >= 2) return { ok: false, why: 'The sand phase is behind you — the boy remembers.' }
  if (ctx.chapter === 0 && ctx.day < STORY.meetDay) {
    return { ok: false, why: `The boy is still up the hill — he comes down on day ${STORY.meetDay}.` }
  }
  if (ctx.day <= s.lastSandDay) {
    return { ok: false, why: 'One carry a day — the boy shares his cut honestly, but only once.' }
  }
  if (ctx.energy < STORY.sandEnergy) {
    return { ok: false, why: `You need ${STORY.sandEnergy} energy for a carry up the trail. Rest first.` }
  }
  return { ok: true }
}

/**
 * THE NOTEBOOK DOOR — chapter 2 only; the levy is waived (cost 0)
 * when the school knows you (level >= notebookLevel). The store pays
 * this exact number through removeMoney.
 */
export function canPayNotebook(
  s: StoryState,
  ctx: { chapter: StoryChapter; cash: number; level: number },
): { ok: true; cost: number } | { ok: false; why: string } {
  // Defensive double-lock: a stale chapter ctx can never re-pay the levy.
  if (s.notePaid) return { ok: false, why: 'The notebook is already paid.' }
  if (ctx.chapter < 2) return { ok: false, why: 'The boy has not asked yet — the sand comes first.' }
  if (ctx.chapter > 2) return { ok: false, why: 'The notebook is already paid.' }
  const cost = ctx.level >= STORY.notebookLevel ? 0 : STORY.notebookCost
  if (ctx.cash < cost) {
    return {
      ok: false,
      why:
        cost === 0
          ? 'The levy is waived — walk it off the boy\'s head.'
          : `You need ₦${STORY.notebookCost} for the school levy and books.`,
    }
  }
  return { ok: true, cost }
}

/**
 * THE FEVER DOOR — chapter 3 only; the flat feverCost, no waivers.
 * Hospital nights do not bargain.
 */
export function canPayFever(
  s: StoryState,
  ctx: { chapter: StoryChapter; cash: number },
): { ok: true; cost: number } | { ok: false; why: string } {
  // Defensive double-lock: a stale chapter ctx can never re-pay the night.
  if (s.feverPaid) return { ok: false, why: 'The fever night is already settled.' }
  if (ctx.chapter < 3) return { ok: false, why: 'The fever has not come — the notebook comes first.' }
  if (ctx.chapter > 3) return { ok: false, why: 'The fever night is already settled.' }
  if (ctx.cash < STORY.feverCost) {
    return { ok: false, why: `You need ₦${STORY.feverCost} for the fever night — injections no less.` }
  }
  return { ok: true, cost: STORY.feverCost }
}

/**
 * THE DESK DOOR — chapter 4, one sponsorship a day, cash >= the daily
 * rate, and never past the six banked days (after that the honest
 * answer is the WAIT task, not another payment).
 */
export function canSponsor(
  s: StoryState,
  ctx: { day: number; chapter: StoryChapter; cash: number },
): { ok: true; cost: number } | { ok: false; why: string } {
  if (ctx.chapter < 4) return { ok: false, why: 'No desk knows your name yet.' }
  if (ctx.chapter > 4) return { ok: false, why: 'The sponsorship chapter is closed.' }
  if (s.sponsoredDays >= STORY.sponsorDays) {
    return { ok: false, why: `All ${STORY.sponsorDays} days are banked — wait for the coat.` }
  }
  if (ctx.day <= s.lastSponsorDay) {
    return { ok: false, why: 'One sponsorship a day — the desk keeps an honest book.' }
  }
  if (ctx.cash < STORY.sponsorCost) {
    return { ok: false, why: `You need ₦${STORY.sponsorCost} for the day's sponsorship.` }
  }
  return { ok: true, cost: STORY.sponsorCost }
}

/**
 * THE GRADUATION DOOR — the coat APPLIES only when the player returns
 * to claim it: day >= coatDay(s) and doctorDay still 0. The store
 * offers the graduation action exactly when this says ok.
 */
export function canGraduate(s: StoryState, ctx: { day: number }): { ok: true } | { ok: false; why: string } {
  if (s.doctorDay > 0) return { ok: false, why: 'You already wear the coat.' }
  const coat = coatDay(s)
  if (coat === 0) return { ok: false, why: 'The coat is not earned yet — the sponsorship desk is waiting.' }
  if (ctx.day < coat) return { ok: false, why: `The tailor still sews — return on day ${coat}.` }
  return { ok: true }
}

/* ---------------------------- pure state transformers ------------------------ */

/**
 * One honest carry: sandDays+1, lastSandDay stamped. The first carry
 * IS the meeting (chapter 0 → 1); the third closes the sand phase
 * (→ 2). The store pays sandPay through addMoney around this.
 */
export function applyCarry(s: StoryState, day: number): StoryState {
  const sandDays = s.sandDays + 1
  return {
    ...s,
    sandDays,
    lastSandDay: day,
    chapter: Math.max(s.chapter, sandDays >= STORY.sandCarries ? 2 : 1),
  }
}

/** The notebook is settled (levy paid or waived): the story walks to chapter 3. */
export function applyNotebook(s: StoryState): StoryState {
  return { ...s, notePaid: true, chapter: Math.max(s.chapter, 3) }
}

/** The fever night is settled: the story walks to chapter 4. */
export function applyFever(s: StoryState): StoryState {
  return { ...s, feverPaid: true, chapter: Math.max(s.chapter, 4) }
}

/** One sponsorship day banked at the desk — the chapter holds at 4 until all six. */
export function applySponsor(s: StoryState, day: number): StoryState {
  return { ...s, sponsoredDays: s.sponsoredDays + 1, lastSponsorDay: day }
}

/** The white coat lands on doctorDay — chapter 5, the path complete. */
export function applyWhiteCoat(s: StoryState, day: number): StoryState {
  return { ...s, doctorDay: day, chapter: Math.max(s.chapter, 5) }
}

/* ------------------------------ the six beats -------------------------------- */

/** The flavour the story panel shows per chapter — six honest lines, no more. */
export const STORY_BEATS: ReadonlyArray<{ chapter: StoryChapter; title: string; line: string }> = [
  {
    chapter: 0,
    title: 'Patti Base',
    line: 'Patti base — a small boy hails you: "Abeg, help me carry sand. I go share my cut. No be scam."',
  },
  {
    chapter: 1,
    title: 'The Sand Days',
    line: 'Bucket by bucket, day by day — the boy counts your days, not your grammar. Three honest carries and he opens his notebook.',
  },
  {
    chapter: 2,
    title: 'The Notebook',
    line: '"My school fee don spoil my head," he says. ₦3,500 — or the school knows your name and waves the levy.',
  },
  {
    chapter: 3,
    title: 'The Fever Night',
    line: 'The GRA hospital by night — the boy shakes with fever and the bill is ₦2,000. You pay. Nobody forgets who stood there.',
  },
  {
    chapter: 4,
    title: 'The Sponsorship Desk',
    line: '₦500 a day, six days straight at the GRA desk. Government work is slow — but it is steady, and it comes with respect.',
  },
  {
    chapter: 5,
    title: 'The White Coat',
    line: 'The white coat fits. Confluence gold under the collar, and the Chairman Strut walks out through the hospital doors.',
  },
]
