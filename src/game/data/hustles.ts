/**
 * LOKOJA LIFE — Hustles (Stage 3)
 * --------------------------------
 * Small, personal, informal opportunities — the opposite of the formal
 * job board in jobs.ts. Each hustle belongs to a real NPC at a real
 * location (stable ids shared with the map + future 3D world), carries
 * its own requirements, risk (difficulty) and reward range.
 *
 * The opportunity SYSTEM (systems/opportunities.ts) reads this catalogue
 * and generates offer instances — nothing here knows about the UI.
 * When the phone/chat system arrives it will deliver these exact defs
 * as chat messages — same data, new transport.
 */

import type { SkillId } from '../types'
import type { OpportunitySource } from '../types'

export interface HustleDef {
  id: string
  /** who offers it — id from NPCS */
  npcId: string
  /** where it happens — stable id from LOCATIONS */
  locationId: string
  /** short offer title */
  title: string
  /** the personal message shown on the offer card (NPC voice) */
  message: string
  source: OpportunitySource
  /** 1–5 — compared against the hustle's skill for the outcome roll */
  difficulty: number
  /** skill trained + used for the success roll */
  skill: SkillId
  requirements: {
    minSkills?: Partial<Record<SkillId, number>>
    minReputation?: number
    minLevel?: number
  }
  reward: {
    /** ₦ range rolled on success */
    cashMin: number
    cashMax: number
    xp: number
    skillXp: number
    reputation: number
  }
  energyCost: number
  /** time slots consumed doing it (0 = quick errand, same slot) */
  timeSlots: number
  /** cooldown after completion, in absolute clock slots */
  cooldownSlots: number
  /** relative likelihood when the board picks offers */
  weight: number
}

export const HUSTLES: HustleDef[] = [
  /* ------------------------------ Kpata Market ------------------------------ */
  {
    id: 'musa-fabric-carry',
    npcId: 'musa',
    locationId: 'kpata-market',
    title: 'Carry fabric bundles',
    message: 'Guy, you dey around Kpata? I get small work for you — help me carry this fabric reach my shop.',
    source: 'npc',
    difficulty: 1,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 400, cashMax: 700, xp: 16, skillXp: 10, reputation: 2 },
    energyCost: 12,
    timeSlots: 0,
    cooldownSlots: 1,
    weight: 3,
  },
  {
    id: 'hajiya-pepper-bags',
    npcId: 'hajiya-amina',
    locationId: 'kpata-market',
    title: 'Bag fresh peppers',
    message: 'My customer dey wait. Come help me bag this pepper before afternoon market rush, abeg.',
    source: 'npc',
    difficulty: 1,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 350, cashMax: 550, xp: 14, skillXp: 9, reputation: 2 },
    energyCost: 10,
    timeSlots: 0,
    cooldownSlots: 1,
    weight: 3,
  },
  {
    id: 'kpata-price-runner',
    npcId: 'musa',
    locationId: 'kpata-market',
    title: 'Market price run',
    message: 'I wan send somebody go check tomoro price for three stalls. You get sharp mouth — you fit talk price.',
    source: 'npc',
    difficulty: 2,
    skill: 'smart',
    requirements: {},
    reward: { cashMin: 500, cashMax: 800, xp: 20, skillXp: 12, reputation: 3 },
    energyCost: 12,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ------------------------------ Food Strip ------------------------------- */
  {
    id: 'mama-ngozi-soup-run',
    npcId: 'mama-ngozi',
    locationId: 'food-area',
    title: 'Deliver soup parcels',
    message: 'My customer for Government Area don order soup since morning. Help me run this delivery — no spill am o!',
    source: 'npc',
    difficulty: 2,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 500, cashMax: 850, xp: 18, skillXp: 11, reputation: 3 },
    energyCost: 14,
    timeSlots: 1,
    cooldownSlots: 1,
    weight: 3,
  },
  {
    id: 'mama-ngozi-basins',
    npcId: 'mama-ngozi',
    locationId: 'food-area',
    title: 'Wash evening basins',
    message: 'Evening rush dey come. Wash these basins make shine and I go pay you sharp sharp.',
    source: 'npc',
    difficulty: 1,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 300, cashMax: 500, xp: 12, skillXp: 8, reputation: 1 },
    energyCost: 10,
    timeSlots: 0,
    cooldownSlots: 1,
    weight: 3,
  },

  /* ---------------------------- Ganaja Junction ----------------------------- */
  {
    id: 'emeka-sort-packages',
    npcId: 'emeka',
    locationId: 'ganaja-junction',
    title: 'Sort dispatch packages',
    message: 'Wahala dey — my packages don mix like jollof. Help me sort am by street, make we dey go.',
    source: 'npc',
    difficulty: 1,
    skill: 'smart',
    requirements: {},
    reward: { cashMin: 450, cashMax: 700, xp: 16, skillXp: 10, reputation: 2 },
    energyCost: 10,
    timeSlots: 0,
    cooldownSlots: 1,
    weight: 3,
  },
  {
    id: 'emeka-last-mile',
    npcId: 'emeka',
    locationId: 'ganaja-junction',
    title: 'Last-mile drop',
    message: 'One last drop for Low-Cost side. I go give you the address — your leg fast pass my fuel gauge.',
    source: 'npc',
    difficulty: 2,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 600, cashMax: 950, xp: 22, skillXp: 13, reputation: 3 },
    energyCost: 16,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ------------------------------ Motor Park -------------------------------- */
  {
    id: 'baba-t-keke-wash',
    npcId: 'baba-t',
    locationId: 'transport-area',
    title: 'Wash the kekes',
    message: 'Park dey judge cleanliness tomorrow. Wash these kekes make dem brown like new kobo.',
    source: 'npc',
    difficulty: 1,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 350, cashMax: 600, xp: 14, skillXp: 9, reputation: 2 },
    energyCost: 13,
    timeSlots: 1,
    cooldownSlots: 1,
    weight: 3,
  },
  {
    id: 'baba-t-fare-collect',
    npcId: 'baba-t',
    locationId: 'transport-area',
    title: 'Collect park fares',
    message: 'Follow me collect loading fares for one round. No let them shake hand for you — talk am well.',
    source: 'npc',
    difficulty: 2,
    skill: 'social',
    requirements: {},
    reward: { cashMin: 550, cashMax: 900, xp: 20, skillXp: 12, reputation: 3 },
    energyCost: 12,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ---------------------------- University Area ----------------------------- */
  {
    id: 'chantel-flyers',
    npcId: 'chantel',
    locationId: 'university-area',
    title: 'Share tutorial flyers',
    message: 'Hey! Help me share tutorial flyers for hostel side — na per hand I dey pay o.',
    source: 'npc',
    difficulty: 1,
    skill: 'social',
    requirements: {},
    reward: { cashMin: 400, cashMax: 650, xp: 15, skillXp: 10, reputation: 2 },
    energyCost: 11,
    timeSlots: 1,
    cooldownSlots: 1,
    weight: 3,
  },
  {
    id: 'chantel-laptop-fix',
    npcId: 'chantel',
    locationId: 'university-area',
    title: 'Fix a student laptop',
    message: 'My coursemate laptop dey craze — e no dey boot. You sabi computer small? They will pay better.',
    source: 'npc',
    difficulty: 3,
    skill: 'smart',
    requirements: { minSkills: { smart: 2 } },
    reward: { cashMin: 900, cashMax: 1500, xp: 30, skillXp: 16, reputation: 4 },
    energyCost: 12,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ---------------------------- Government Area ----------------------------- */
  {
    id: 'alhaji-sule-files',
    npcId: 'alhaji-sule',
    locationId: 'government-area',
    title: 'Arrange office files',
    message: 'These files must enter shelf alphabetically before oga arrive. Steady hand, steady pay.',
    source: 'npc',
    difficulty: 2,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 600, cashMax: 950, xp: 22, skillXp: 12, reputation: 3 },
    energyCost: 12,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },
  {
    id: 'alhaji-sule-errand',
    npcId: 'alhaji-sule',
    locationId: 'government-area',
    title: 'Official errand run',
    message: 'Take this envelope across the secretariat. Stamp am here, sign am there. No open am!',
    source: 'npc',
    difficulty: 2,
    skill: 'smart',
    requirements: { minSkills: { smart: 2 } },
    reward: { cashMin: 700, cashMax: 1100, xp: 26, skillXp: 14, reputation: 4 },
    energyCost: 13,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ---------------------------- Historic Lokoja ----------------------------- */
  {
    id: 'uncle-ben-cleanup',
    npcId: 'uncle-ben',
    locationId: 'historic-lokoja',
    title: 'Clear the old path',
    message: 'Tourists dey come tomorrow. Help me clear the cemetery path — history must look presentable.',
    source: 'npc',
    difficulty: 2,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 500, cashMax: 800, xp: 18, skillXp: 11, reputation: 3 },
    energyCost: 15,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ------------------------------- Confluence ------------------------------- */
  {
    id: 'idris-net-pull',
    npcId: 'idris',
    locationId: 'confluence',
    title: 'Pull the fishing net',
    message: 'The current strong today. Pull this net with me — whatever fish enter, na split we go share.',
    source: 'npc',
    difficulty: 2,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 550, cashMax: 900, xp: 20, skillXp: 12, reputation: 3 },
    energyCost: 16,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* ------------------------------ Mount Patti ------------------------------- */
  {
    id: 'baba-danjuma-trail',
    npcId: 'baba-danjuma',
    locationId: 'mount-patti',
    title: 'Clear the hiking trail',
    message: 'Branch fall for trail after the rain. Help me clear am — climbers go thank you, I go pay you.',
    source: 'npc',
    difficulty: 2,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 500, cashMax: 850, xp: 19, skillXp: 12, reputation: 3 },
    energyCost: 15,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },

  /* --------------------------- The Schools (Stage 7) ------------------------ */
  {
    id: 'hauwa-assignment-run',
    npcId: 'hauwa',
    locationId: 'gyb-model-adankolo',
    title: 'Deliver assignment scripts',
    message: 'Ah, you came at the right time! Help me carry this whole class’s scripts to the staff room before the bell.',
    source: 'npc',
    difficulty: 1,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 350, cashMax: 600, xp: 15, skillXp: 10, reputation: 2 },
    energyCost: 10,
    timeSlots: 0,
    cooldownSlots: 1,
    weight: 2,
  },
  {
    id: 'chidi-notes-run',
    npcId: 'chidi',
    locationId: 'ful-felele',
    title: 'Photocopy lecture notes run',
    message: 'Guy, the whole 200 level needs these notes before tomorrow’s test. Business centre run — I go cover the copies.',
    source: 'npc',
    difficulty: 2,
    skill: 'smart',
    requirements: {},
    reward: { cashMin: 550, cashMax: 900, xp: 20, skillXp: 12, reputation: 3 },
    energyCost: 14,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },
  {
    id: 'abubakar-workshop-tidy',
    npcId: 'abubakar',
    locationId: 'ksp-felele',
    title: 'Tidy the mechanical workshop',
    message: 'Oga say make the workshop clean before inspection. Spanner no go arrange itself — I go split the pay.',
    source: 'npc',
    difficulty: 1,
    skill: 'hustle',
    requirements: {},
    reward: { cashMin: 450, cashMax: 750, xp: 17, skillXp: 11, reputation: 2 },
    energyCost: 16,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },
  {
    id: 'miss-grace-library-sort',
    npcId: 'miss-grace',
    locationId: 'crowther-memorial',
    title: 'Sort the library shelves',
    message: 'The library shelves have slipped into chaos again. Alphabetical order, young lady or young man — there is ₦ in the envelope.',
    source: 'npc',
    difficulty: 2,
    skill: 'smart',
    requirements: {},
    reward: { cashMin: 400, cashMax: 700, xp: 18, skillXp: 12, reputation: 3 },
    energyCost: 10,
    timeSlots: 1,
    cooldownSlots: 2,
    weight: 2,
  },
]

export const HUSTLE_BY_ID = Object.fromEntries(HUSTLES.map((h) => [h.id, h])) as Record<
  string,
  HustleDef
>

/** All hustles available at one location — used by the generator. */
export function hustlesAt(locationId: string): HustleDef[] {
  return HUSTLES.filter((h) => h.locationId === locationId)
}
