/**
 * LOKOJA LIFE — Lokoja city data
 * -------------------------------
 * The ten launch locations. Stage 2 renders the interactive map straight
 * from this file: mapX/mapY drive the marker positions on the stylised
 * map canvas, `transport` lists which modes can reach the location, and
 * `travelModifier` scales trip time/energy (uphill, riverside roads…).
 *
 * Each location carries its own visual identity + activity catalogue so the
 * map screen stays 100% data-driven.
 */

import type { TransportId } from '../types'

export interface LocationActivity {
  key: string
  label: string
  /** arrives in stage N — used to honestly grey out not-yet-built content */
  stage: number
}

export interface LokojaLocation {
  id: string
  name: string
  /** compact label for map markers */
  shortName: string
  /** short flavour line shown on map pins */
  tagline: string
  description: string
  /** tailwind-friendly theme colours for the map pin / header */
  color: string
  accent: string
  emoji: string
  unlockLevel: number
  /** map layout position (0–100 percentage grid) on the stylised map canvas */
  mapX: number
  mapY: number
  /** transport modes that can reach this location */
  transport: TransportId[]
  /** multiplies trip minutes + energy (uphill trails, rough roads…) */
  travelModifier: number
  activities: LocationActivity[]
}

export const LOCATIONS: LokojaLocation[] = [
  {
    id: 'home',
    name: 'Your Place',
    shortName: 'Home',
    tagline: 'Where the hustle rests',
    description:
      'A basic room you can call your own. It is not much yet — but every big name in Lokoja started somewhere.',
    color: '#1B7A43',
    accent: '#0B3D22',
    emoji: '🏠',
    unlockLevel: 1,
    mapX: 35.4,
    mapY: 55.5,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'rest', label: 'Rest', stage: 1 },
      { key: 'sleep', label: 'Sleep till morning', stage: 1 },
      { key: 'upgrade', label: 'Upgrade home', stage: 4 },
    ],
  },
  {
    id: 'kpata-market',
    name: 'Kpata Market',
    shortName: 'Kpata',
    tagline: 'The heartbeat of Lokoja commerce',
    description:
      'Colourful stalls, loud traders, and the best pepper soup ingredients in Kogi State. Every hustle in this city passes through Kpata one way or another.',
    color: '#E8A317',
    accent: '#8A5A00',
    emoji: '🛒',
    unlockLevel: 1,
    mapX: 38.6,
    mapY: 56.8,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'shop-food', label: 'Buy food items', stage: 4 },
      { key: 'shop-general', label: 'General store', stage: 4 },
      { key: 'job-market-worker', label: 'Market worker shifts', stage: 3 },
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
    ],
  },
  {
    id: 'ganaja-junction',
    name: 'Ganaja Junction',
    shortName: 'Ganaja',
    tagline: 'Where every road meets',
    description:
      'The busy junction that connects Lokoja to the rest of Kogi. Keke horns, suya smoke, and delivery riders everywhere — the right place to hear today’s gist.',
    color: '#C4562A',
    accent: '#7C2D12',
    emoji: '🛺',
    unlockLevel: 1,
    mapX: 41.7,
    mapY: 64.4,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'transport-hub', label: 'Get transport anywhere', stage: 2 },
      { key: 'job-delivery', label: 'Delivery gigs', stage: 3 },
      { key: 'gist', label: 'Hear the latest gist', stage: 5 },
    ],
  },
  {
    id: 'confluence',
    name: 'The Confluence',
    shortName: 'Confluence',
    tagline: 'Where the Niger kisses the Benue',
    description:
      'The world-famous meeting point of two great rivers. Tourists come with cameras; fishermen come with nets. Lokoja’s proudest landmark — and your signature opportunity.',
    color: '#1F7A6D',
    accent: '#0C3B34',
    emoji: '🌊',
    unlockLevel: 1,
    mapX: 43.5,
    mapY: 74.8,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1.15,
    activities: [
      { key: 'fishing', label: 'Fishing', stage: 7 },
      { key: 'photography', label: 'Riverside photography', stage: 7 },
      { key: 'tourism', label: 'Guide tourists', stage: 7 },
      { key: 'boat', label: 'Boat rides', stage: 7 },
    ],
  },
  {
    id: 'mount-patti',
    name: 'Mount Patti',
    shortName: 'Mt. Patti',
    tagline: 'The giant that watches over Lokoja',
    description:
      'The hill that guards the city, covered in green and history. The climb is not easy — but the view from the top has humbled every visitor since 1860.',
    color: '#4C7A2E',
    accent: '#27401A',
    emoji: '⛰️',
    unlockLevel: 1,
    mapX: 36.3,
    mapY: 28.1,
    transport: ['walk', 'keke'],
    travelModifier: 1.5,
    activities: [
      { key: 'hiking', label: 'Hike the trail', stage: 7 },
      { key: 'photography', label: 'Photo spots', stage: 7 },
      { key: 'explore', label: 'Explore history', stage: 7 },
    ],
  },
  {
    id: 'historic-lokoja',
    name: 'Historic Lokoja',
    shortName: 'Historic',
    tagline: 'Old buildings, old stories',
    description:
      'Colonial-era relics, the old European cemetery, and Lord Lugard’s rest house. Lokoja was once the capital of the Northern Protectorate — the streets still remember.',
    color: '#8A6A3B',
    accent: '#4A3418',
    emoji: '🏛️',
    unlockLevel: 2,
    mapX: 39.0,
    mapY: 41.3,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'discover', label: 'Discover historical sites', stage: 7 },
      { key: 'tour', label: 'History tours', stage: 7 },
    ],
  },
  {
    id: 'government-area',
    name: 'Government Area',
    shortName: 'GRA',
    tagline: 'GRA — where things are official',
    description:
      'Quiet roads, low fences, and offices where paperwork can change your whole week. Government work is slow — but it is steady, and it comes with respect.',
    color: '#5C6E3A',
    accent: '#31401F',
    emoji: '🏢',
    unlockLevel: 3,
    mapX: 34.2,
    mapY: 53.0,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'job-govt', label: 'Government jobs', stage: 3 },
      { key: 'errands', label: 'Official errands', stage: 5 },
    ],
  },
  {
    id: 'university-area',
    name: 'University Area',
    shortName: 'Univ.',
    tagline: 'Book bright, street sharp',
    description:
      'Student hostels, cheap cafés, and copy-copy shops. The campus crowd has energy — and money-making ideas that usually need one more partner.',
    color: '#7C2D6E',
    accent: '#43143B',
    emoji: '🎓',
    unlockLevel: 2,
    mapX: 19.7,
    mapY: 45.5,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'job-tutorial', label: 'Tutorial gigs', stage: 3 },
      { key: 'network', label: 'Meet students', stage: 5 },
      { key: 'job-photographer', label: 'Photography jobs', stage: 3 },
    ],
  },
  {
    id: 'food-area',
    name: 'Mama’s Food Strip',
    shortName: 'Food Strip',
    tagline: 'Come hungry, leave happy',
    description:
      'Bukas, suya stands and cold drinks lined side by side. The aroma alone will reset your mood — and the traders here know everybody’s business.',
    color: '#D9522B',
    accent: '#7A2A10',
    emoji: '🍲',
    unlockLevel: 1,
    mapX: 41.0,
    mapY: 58.2,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'eat', label: 'Eat a proper meal', stage: 4 },
      { key: 'job-waiter', label: 'Restaurant shifts', stage: 3 },
      { key: 'hustle', label: 'Emergency delivery hustles', stage: 3 },
    ],
  },
  {
    id: 'transport-area',
    name: 'Motor Park',
    shortName: 'Motor Park',
    tagline: 'The city moves from here',
    description:
      'Taxi drivers argue, keke riders load passengers, and the last bus to Abuja is always “just leaving”. If you want to move, this is where you start.',
    color: '#B0812A',
    accent: '#5C3E12',
    emoji: '🚕',
    unlockLevel: 1,
    mapX: 41.7,
    mapY: 60.9,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    activities: [
      { key: 'travel', label: 'Take a ride', stage: 2 },
      { key: 'job-driver', label: 'Driver jobs', stage: 3 },
      { key: 'job-cleaner', label: 'Park cleaning', stage: 3 },
    ],
  },
]

export const LOCATION_BY_ID = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l]),
) as Record<string, LokojaLocation>

/* ------------------------------ school locations -----------------------------
 * Stage 7 — the schools of Lokoja join the SAME registry (additive only —
 * every existing id keeps its exact identity). Geometry comes from
 * schools.ts (real coordinates, same projection as the 3D world), so the
 * map pin, the 3D gate and the travel fare can never disagree.
 * --------------------------------------------------------------------------- */

import { SCHOOL_SITES_PROJECTED, type SchoolKind } from './schools'

const SCHOOL_ACTIVITIES: Record<SchoolKind, LocationActivity[]> = {
  university: [
    { key: 'attend-lecture', label: 'Attend a lecture', stage: 3 },
    { key: 'study-library', label: 'Read in the library', stage: 3 },
    { key: 'network', label: 'Meet students', stage: 3 },
  ],
  polytechnic: [
    { key: 'attend-lecture', label: 'Attend a lecture', stage: 3 },
    { key: 'workshop', label: 'Hang around the workshops', stage: 3 },
    { key: 'network', label: 'Meet students', stage: 3 },
  ],
  secondary: [
    { key: 'attend-class', label: 'Attend a class', stage: 3 },
    { key: 'gist', label: 'Hear the school gist', stage: 3 },
  ],
  college: [
    { key: 'attend-class', label: 'Attend a class', stage: 3 },
    { key: 'study-library', label: 'Study in the hall', stage: 3 },
  ],
}

const SCHOOL_LOCATIONS: LokojaLocation[] = SCHOOL_SITES_PROJECTED.map((s) => ({
  id: s.id,
  name: s.name,
  shortName: s.shortName,
  tagline: s.tagline,
  description: s.description,
  color: s.color,
  accent: s.accent,
  emoji: s.emoji,
  unlockLevel: s.unlockLevel,
  mapX: s.mapX,
  mapY: s.mapY,
  transport: s.transport,
  travelModifier: s.travelModifier,
  activities: SCHOOL_ACTIVITIES[s.kind],
}))

LOCATIONS.push(...SCHOOL_LOCATIONS)

// rebuild the id map so schools are first-class citizens everywhere
for (const l of SCHOOL_LOCATIONS) LOCATION_BY_ID[l.id] = l
