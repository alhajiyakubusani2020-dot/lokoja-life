/**
 * LOKOJA LIFE — Jobs data (Stage 3 consumes this)
 * ------------------------------------------------
 * Ten launch jobs, fully data-driven per the design doc.
 * Requirements are checked by the job system; rewards are tuned here.
 * Reputation requirements gate the "prestige" jobs.
 */

export interface JobDef {
  id: string
  name: string
  description: string
  emoji: string
  locationId: string
  unlockLevel: number
  /** energy cost per shift */
  energyCost: number
  /** how many time slots one shift takes */
  timeSlots: number
  /** ₦ base pay — scaled slightly by skills at runtime */
  basePay: number
  xpReward: number
  /** which skill the job trains + how much */
  skillTraining: { skill: 'hustle' | 'smart' | 'social'; xp: number }
  reputationReward: number
  /** cooldown after a shift, in absolute clock slots (Stage 3; default from WORK config) */
  cooldownSlots?: number
  /** hard requirements checked before the job can start */
  requirements: {
    minSkills?: Partial<{ hustle: number; smart: number; social: number }>
    minReputation?: number
  }
}

export const JOBS: JobDef[] = [
  {
    id: 'market-worker',
    name: 'Market Worker',
    description: 'Help traders carry goods and watch stalls at Kpata Market.',
    emoji: '🛒',
    locationId: 'kpata-market',
    unlockLevel: 1,
    energyCost: 18,
    timeSlots: 1,
    basePay: 900,
    xpReward: 20,
    skillTraining: { skill: 'hustle', xp: 10 },
    reputationReward: 2,
    requirements: {},
  },
  {
    id: 'delivery-worker',
    name: 'Delivery Worker',
    description: 'Run packages across town on foot, keke or bike.',
    emoji: '📦',
    locationId: 'ganaja-junction',
    unlockLevel: 1,
    energyCost: 22,
    timeSlots: 1,
    basePay: 1100,
    xpReward: 24,
    skillTraining: { skill: 'hustle', xp: 12 },
    reputationReward: 3,
    requirements: {},
  },
  {
    id: 'driver',
    name: 'Driver',
    description: 'Drive a taxi or private car for people who pay better than you sweat.',
    emoji: '🚕',
    locationId: 'transport-area',
    unlockLevel: 2,
    energyCost: 20,
    timeSlots: 2,
    basePay: 1600,
    xpReward: 30,
    skillTraining: { skill: 'social', xp: 8 },
    reputationReward: 4,
    requirements: { minSkills: { hustle: 2 } },
  },
  {
    id: 'fisherman',
    name: 'Fisherman',
    description: 'Cast your nets where the Niger meets the Benue.',
    emoji: '🎣',
    locationId: 'confluence',
    unlockLevel: 2,
    energyCost: 25,
    timeSlots: 2,
    basePay: 1400,
    xpReward: 28,
    skillTraining: { skill: 'hustle', xp: 12 },
    reputationReward: 3,
    requirements: {},
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Shoot tourists at the Confluence and events around town.',
    emoji: '📸',
    locationId: 'university-area',
    unlockLevel: 3,
    energyCost: 15,
    timeSlots: 1,
    basePay: 1800,
    xpReward: 32,
    skillTraining: { skill: 'smart', xp: 10 },
    reputationReward: 5,
    cooldownSlots: 2,
    requirements: { minSkills: { smart: 2 } },
  },
  {
    id: 'shop-assistant',
    name: 'Shop Assistant',
    description: 'Keep a shop neat, mind the counter, charm the customers.',
    emoji: '🏪',
    locationId: 'kpata-market',
    unlockLevel: 2,
    energyCost: 16,
    timeSlots: 2,
    basePay: 1300,
    xpReward: 26,
    skillTraining: { skill: 'social', xp: 12 },
    reputationReward: 3,
    requirements: {},
  },
  {
    id: 'cleaner',
    name: 'Cleaner',
    description: 'Honest work at offices and the motor park. Nobody claps — but they pay.',
    emoji: '🧹',
    locationId: 'transport-area',
    unlockLevel: 1,
    energyCost: 20,
    timeSlots: 1,
    basePay: 800,
    xpReward: 18,
    skillTraining: { skill: 'hustle', xp: 8 },
    reputationReward: 1,
    requirements: {},
  },
  {
    id: 'tour-guide',
    name: 'Tour Guide',
    description: 'Show visitors the Confluence, Mount Patti and the old town stories.',
    emoji: '🗺️',
    locationId: 'confluence',
    unlockLevel: 4,
    energyCost: 18,
    timeSlots: 2,
    basePay: 2200,
    xpReward: 40,
    skillTraining: { skill: 'social', xp: 14 },
    reputationReward: 8,
    requirements: { minSkills: { social: 3 } },
  },
  {
    id: 'government-worker',
    name: 'Government Worker',
    description: 'A desk, a stamp, and a steady salary at the Secretariat.',
    emoji: '🏢',
    locationId: 'government-area',
    unlockLevel: 5,
    energyCost: 14,
    timeSlots: 2,
    basePay: 2600,
    xpReward: 45,
    skillTraining: { skill: 'smart', xp: 16 },
    reputationReward: 10,
    requirements: { minSkills: { smart: 4 }, minReputation: 100 },
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Run your own thing full-time. Risky — but the ceiling is sky high.',
    emoji: '💼',
    locationId: 'ganaja-junction',
    unlockLevel: 6,
    energyCost: 24,
    timeSlots: 2,
    basePay: 2400,
    xpReward: 50,
    skillTraining: { skill: 'smart', xp: 18 },
    reputationReward: 12,
    requirements: { minReputation: 250 },
  },
]

export const JOB_BY_ID = Object.fromEntries(JOBS.map((j) => [j.id, j])) as Record<string, JobDef>
