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
  /** G2 — which CHAOS zone (src/game/systems/chaos.ts CHAOS_ZONE_IDS) this
   *  location stands in. Optional: the ten launch entries ARE the zones
   *  themselves (id === zone id), so only newer entries need to claim one. */
  district?: string
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

/* ------------------------------ G2 — spaces breadth ----------------------------
 * Ten more real Lokoja spaces join the SAME registry (append-only law — the
 * ten launch rows + the school rows above keep their exact identity). Every
 * name below was mined from the repo's REAL geo data before it was added:
 *
 *   Adankolo / Emiwoziri / Filele / Numai / Kpatakpoli / Kpato
 *     → scripts/geo/network.json `places` (real OSM nodes, projected by the
 *       same pipeline as the 3D world — mapX/mapY below ARE that projection:
 *       mapX = 50 + x/6.2, mapY = 50 + z/6.2, rim-pulled past 272u).
 *   Maigari's Palace / Pati Ridge Hill / Sokamms Global Motel
 *     → the raw OSM tiles the pipeline was built from
 *       (scripts/geo/tiles/t_1_2d.osm, t_0_2.osm, t_1_0.osm).
 *   Township Stadium → the world's own 3D landmark
 *       (src/components/game/world/CityMesh.tsx — "Township Stadium — oval
 *       stands + green pitch + floodlights, south of the motor park"), the
 *       same facility the OSM tiles record as "Lokoja International Stadium".
 *
 * `district` claims the CHAOS zone each place honestly stands in
 * (src/game/systems/chaos.ts CHAOS_ZONE_IDS). The ten launch districts stay
 * covered by their own launch rows (id === zone id).
 * --------------------------------------------------------------------------- */

const G2_LOCATIONS: LokojaLocation[] = [
  {
    id: 'adankolo',
    name: 'Adankolo',
    shortName: 'Adankolo',
    tagline: 'The old campus quarter',
    description:
      'A busy ward on the west side of town where student lodges squeeze between family compounds. Adankolo carries the university\u2019s first home in its name — half the okada men here know a lecturer by face.',
    color: '#2E7D5B',
    accent: '#14432E',
    emoji: '🏘️',
    unlockLevel: 1,
    mapX: 11.2,
    mapY: 40.9,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1.25,
    district: 'university-area',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'room-hunt', label: 'Hunt a student room', stage: 99 },
      { key: 'campus-gist', label: 'Hear the campus gist', stage: 99 },
    ],
  },
  {
    id: 'emiwoziri',
    name: 'Emiwoziri',
    shortName: 'Emiwoziri',
    tagline: 'Where the road kisses the river sand',
    description:
      'A riverine settlement on the southern bank, past where the tar gives up. Canoes ride low with sand and firewood, and the fishermen read the water like a newspaper.',
    color: '#2C6E8A',
    accent: '#123B4C',
    emoji: '🛶',
    unlockLevel: 1,
    mapX: 57.9,
    mapY: 92.2,
    transport: ['keke', 'taxi'],
    travelModifier: 1.3,
    district: 'confluence',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'net-mending', label: 'Help mend the nets', stage: 99 },
      { key: 'sand-landing', label: 'Watch the sand landing', stage: 99 },
    ],
  },
  {
    id: 'filele',
    name: 'Filele',
    shortName: 'Filele',
    tagline: 'The farm road\u2019s last stop',
    description:
      'A village on the north-west flank under the Patti ridge, where the city noise fades into yam mounds and cassava rows. The air smells of woodsmoke and turned earth.',
    color: '#7A8A3A',
    accent: '#3D4519',
    emoji: '🌾',
    unlockLevel: 1,
    // pulled 6.9u north-west of the raw node onto the empty NW shoulder
    // (the node crowd sits on the Felele corridor pins; same honest pull
    // the schools use — "the farm road's last stop" IS the far corner)
    mapX: 25.0,
    mapY: 5.4,
    transport: ['keke', 'taxi'],
    travelModifier: 1.4,
    district: 'mount-patti',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'farm-shift', label: 'Farm work shifts', stage: 99 },
      { key: 'harvest-market', label: 'Harvest-day market', stage: 99 },
    ],
  },
  {
    id: 'numai',
    name: 'Numai',
    shortName: 'Numai',
    tagline: 'Quiet streets, loud goats',
    description:
      'A small settlement north-east of the Adankolo side, all footpaths, low fences and front yards. Everybody knows whose goat ate whose vegetables — and they will tell you, at length.',
    color: '#A0672E',
    accent: '#4F3113',
    emoji: '🌳',
    unlockLevel: 1,
    // pulled 3u north-east of the raw node onto the dry shoulder of the
    // stream (same honest pull the schools use — node blocked by water)
    mapX: 62.4,
    mapY: 28.7,
    transport: ['keke', 'taxi'],
    travelModifier: 1.2,
    district: 'university-area',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'grazing-route', label: 'Walk the grazing route', stage: 99 },
      { key: 'frontyard-league', label: 'Front-yard football league', stage: 99 },
    ],
  },
  {
    id: 'kpatakpoli',
    name: 'Kpatakpoli',
    shortName: 'Kpatakpoli',
    tagline: 'East of the bustle',
    description:
      'A village quarter east of town where the compounds spread out and the sky gets bigger. Keke men negotiate hard for the trip — the road back always takes longer than the road in.',
    color: '#3F7A5C',
    accent: '#1F4030',
    emoji: '🏡',
    unlockLevel: 1,
    mapX: 75.7,
    mapY: 64.5,
    transport: ['keke', 'taxi'],
    travelModifier: 1.35,
    district: 'ganaja-junction',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'compound-gist', label: 'Compound evening gist', stage: 99 },
      { key: 'well-queue', label: 'Join the well queue', stage: 99 },
    ],
  },
  {
    id: 'kpato',
    name: 'Kpato',
    shortName: 'Kpato',
    tagline: 'Far side of the Otukpo road',
    description:
      'A village out along the south-east road where the Lokoja-Otukpo road carries traders, timber and long-suffering goats. The junction boys here wave down every keke like a celebrity.',
    color: '#B8763A',
    accent: '#5C3A1A',
    emoji: '🐐',
    unlockLevel: 1,
    mapX: 77.7,
    mapY: 84.0,
    transport: ['keke', 'taxi'],
    travelModifier: 1.4,
    district: 'ganaja-junction',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'roadside-roast', label: 'Roadside roast stand', stage: 99 },
      { key: 'timber-load', label: 'Help load timber', stage: 99 },
    ],
  },
  {
    id: 'township-stadium',
    name: 'Township Stadium',
    shortName: 'Stadium',
    tagline: 'The city\u2019s roaring bowl',
    description:
      'The oval stands and green pitch south of the motor park, floodlights standing tall over matchday dust. Local clubs dream here, and the stall around the back sells the coldest minerals in town.',
    color: '#3D8A37',
    accent: '#1D4519',
    emoji: '🏟️',
    unlockLevel: 1,
    // pin sits in the open parkland pocket south-east of the Motor Park — the
    // 3D landmark (CityMesh.tsx) stands in the same transport-area parkland;
    // pulled east onto dry, unobstructed canvas like the schools' rim pull
    // (the raw OSM stadium node is blocked on the grid by the Julitola pin
    // and the real river channel). Evidence stays the landmark + OSM.
    mapX: 51.0,
    mapY: 67.8,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    district: 'transport-area',
    activities: [
      { key: 'hustle', label: 'Pick up hustles', stage: 3 },
      { key: 'morning-drill', label: 'Join morning drill', stage: 99 },
      { key: 'matchday-work', label: 'Matchday crowd work', stage: 99 },
    ],
  },
  {
    id: 'maigari-palace',
    name: "Maigari's Palace",
    shortName: 'Palace',
    tagline: 'The throne of the old town',
    description:
      'The Maigari\u2019s compound — turbaned chiefs, quiet courtyards, and greeting protocols older than the state itself. Arrive with respect and both hands visible; leave with your name remembered.',
    color: '#8A3A6E',
    accent: '#451D37',
    emoji: '👑',
    unlockLevel: 2,
    // pulled 2.3u south-west off the Crowther school pin (≥6u pin law) —
    // the old town between Patti's foot and the historic quarter
    mapX: 42.6,
    mapY: 30.4,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
    district: 'historic-lokoja',
    activities: [
      { key: 'greeting', label: 'Pay your respect', stage: 99 },
      { key: 'palace-errand', label: 'Palace errands', stage: 99 },
      { key: 'festival-grounds', label: 'Walk the festival grounds', stage: 99 },
    ],
  },
  {
    id: 'pati-ridge-hill',
    name: 'Pati Ridge Hill',
    shortName: 'Pati Ridge',
    tagline: 'Patti\u2019s quieter shoulder',
    description:
      'The lesser shoulder of the great ridge, west of the main trail. No crowds, no vendors — just wind, grass and a view that makes the whole city look like a mat weave.',
    color: '#6E5A2E',
    accent: '#372D14',
    emoji: '🥾',
    unlockLevel: 2,
    mapX: 25.2,
    mapY: 31.7,
    transport: ['walk', 'keke'],
    travelModifier: 1.5,
    district: 'mount-patti',
    activities: [
      { key: 'trail-hike', label: 'Hike the ridge trail', stage: 99 },
      { key: 'photo-walk', label: 'Photo walk', stage: 99 },
      { key: 'bird-watch', label: 'Bird watching hour', stage: 99 },
    ],
  },
  {
    id: 'sokamms-motel',
    name: 'Sokamms Global Motel',
    shortName: 'Sokamms',
    tagline: 'A soft bed on the south road',
    description:
      'The traveller\u2019s stop on the southern approach — painted walls, a humming generator, and a night guard who doubles as the gist channel. When home is too far, Sokamms is home enough.',
    color: '#4A6E8A',
    accent: '#243745',
    emoji: '🛏️',
    unlockLevel: 1,
    mapX: 45.0,
    mapY: 88.3,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1.15,
    district: 'confluence',
    activities: [
      { key: 'day-rest', label: 'Take a day room', stage: 99 },
      { key: 'gist-corner', label: 'Sit at the gist corner', stage: 99 },
    ],
  },
]

LOCATIONS.push(...G2_LOCATIONS)
for (const l of G2_LOCATIONS) LOCATION_BY_ID[l.id] = l
