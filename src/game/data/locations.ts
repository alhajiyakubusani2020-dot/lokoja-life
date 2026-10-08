/**
 * LOKOJA LIFE — Lokoja city data
 * -------------------------------
 * The ten launch locations. Stage 1 uses `home` as the player's starting
 * location; the full interactive map arrives in Stage 2 and will render
 * straight from this file.
 *
 * Each location carries its own visual identity + activity catalogue so the
 * map screen stays 100% data-driven.
 */

export interface LocationActivity {
  key: string
  label: string
  /** arrives in stage N — used to honestly grey out not-yet-built content */
  stage: number
}

export interface LokojaLocation {
  id: string
  name: string
  /** short flavour line shown on map pins */
  tagline: string
  description: string
  /** tailwind-friendly theme colours for the map pin / header */
  color: string
  accent: string
  emoji: string
  unlockLevel: number
  /** map layout position (0–100 percentage grid) for the Stage 2 map canvas */
  mapX: number
  mapY: number
  activities: LocationActivity[]
}

export const LOCATIONS: LokojaLocation[] = [
  {
    id: 'home',
    name: 'Your Place',
    tagline: 'Where the hustle rests',
    description:
      'A basic room you can call your own. It is not much yet — but every big name in Lokoja started somewhere.',
    color: '#1B7A43',
    accent: '#0B3D22',
    emoji: '🏠',
    unlockLevel: 1,
    mapX: 50,
    mapY: 72,
    activities: [
      { key: 'rest', label: 'Rest', stage: 1 },
      { key: 'sleep', label: 'Sleep till morning', stage: 1 },
      { key: 'upgrade', label: 'Upgrade home', stage: 4 },
    ],
  },
  {
    id: 'kpata-market',
    name: 'Kpata Market',
    tagline: 'The heartbeat of Lokoja commerce',
    description:
      'Colourful stalls, loud traders, and the best pepper soup ingredients in Kogi State. Every hustle in this city passes through Kpata one way or another.',
    color: '#E8A317',
    accent: '#8A5A00',
    emoji: '🛒',
    unlockLevel: 1,
    mapX: 30,
    mapY: 52,
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
    tagline: 'Where every road meets',
    description:
      'The busy junction that connects Lokoja to the rest of Kogi. Keke horns, suya smoke, and delivery riders everywhere — the right place to hear today’s gist.',
    color: '#C4562A',
    accent: '#7C2D12',
    emoji: '🛺',
    unlockLevel: 1,
    mapX: 68,
    mapY: 44,
    activities: [
      { key: 'transport-hub', label: 'Get transport anywhere', stage: 2 },
      { key: 'job-delivery', label: 'Delivery gigs', stage: 3 },
      { key: 'gist', label: 'Hear the latest gist', stage: 5 },
    ],
  },
  {
    id: 'confluence',
    name: 'The Confluence',
    tagline: 'Where the Niger kisses the Benue',
    description:
      'The world-famous meeting point of two great rivers. Tourists come with cameras; fishermen come with nets. Lokoja’s proudest landmark — and your signature opportunity.',
    color: '#1F7A6D',
    accent: '#0C3B34',
    emoji: '🌊',
    unlockLevel: 1,
    mapX: 82,
    mapY: 68,
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
    tagline: 'The giant that watches over Lokoja',
    description:
      'The hill that guards the city, covered in green and history. The climb is not easy — but the view from the top has humbled every visitor since 1860.',
    color: '#4C7A2E',
    accent: '#27401A',
    emoji: '⛰️',
    unlockLevel: 1,
    mapX: 18,
    mapY: 20,
    activities: [
      { key: 'hiking', label: 'Hike the trail', stage: 7 },
      { key: 'photography', label: 'Photo spots', stage: 7 },
      { key: 'explore', label: 'Explore history', stage: 7 },
    ],
  },
  {
    id: 'historic-lokoja',
    name: 'Historic Lokoja',
    tagline: 'Old buildings, old stories',
    description:
      'Colonial-era relics, the old European cemetery, and Lord Lugard’s rest house. Lokoja was once the capital of the Northern Protectorate — the streets still remember.',
    color: '#8A6A3B',
    accent: '#4A3418',
    emoji: '🏛️',
    unlockLevel: 2,
    mapX: 42,
    mapY: 30,
    activities: [
      { key: 'discover', label: 'Discover historical sites', stage: 7 },
      { key: 'tour', label: 'History tours', stage: 7 },
    ],
  },
  {
    id: 'government-area',
    name: 'Government Area',
    tagline: 'GRA — where things are official',
    description:
      'Quiet roads, low fences, and offices where paperwork can change your whole week. Government work is slow — but it is steady, and it comes with respect.',
    color: '#5C6E3A',
    accent: '#31401F',
    emoji: '🏢',
    unlockLevel: 3,
    mapX: 58,
    mapY: 18,
    activities: [
      { key: 'job-govt', label: 'Government jobs', stage: 3 },
      { key: 'errands', label: 'Official errands', stage: 5 },
    ],
  },
  {
    id: 'university-area',
    name: 'University Area',
    tagline: 'Book bright, street sharp',
    description:
      'Student hostels, cheap cafés, and copy-copy shops. The campus crowd has energy — and money-making ideas that usually need one more partner.',
    color: '#7C2D6E',
    accent: '#43143B',
    emoji: '🎓',
    unlockLevel: 2,
    mapX: 74,
    mapY: 28,
    activities: [
      { key: 'job-tutorial', label: 'Tutorial gigs', stage: 3 },
      { key: 'network', label: 'Meet students', stage: 5 },
      { key: 'job-photographer', label: 'Photography jobs', stage: 3 },
    ],
  },
  {
    id: 'food-area',
    name: 'Mama’s Food Strip',
    tagline: 'Come hungry, leave happy',
    description:
      'Bukas, suya stands and cold drinks lined side by side. The aroma alone will reset your mood — and the traders here know everybody’s business.',
    color: '#D9522B',
    accent: '#7A2A10',
    emoji: '🍲',
    unlockLevel: 1,
    mapX: 46,
    mapY: 62,
    activities: [
      { key: 'eat', label: 'Eat a proper meal', stage: 4 },
      { key: 'job-waiter', label: 'Restaurant shifts', stage: 3 },
      { key: 'hustle', label: 'Emergency delivery hustles', stage: 3 },
    ],
  },
  {
    id: 'transport-area',
    name: 'Motor Park',
    tagline: 'The city moves from here',
    description:
      'Taxi drivers argue, keke riders load passengers, and the last bus to Abuja is always “just leaving”. If you want to move, this is where you start.',
    color: '#B0812A',
    accent: '#5C3E12',
    emoji: '🚕',
    unlockLevel: 1,
    mapX: 60,
    mapY: 80,
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
