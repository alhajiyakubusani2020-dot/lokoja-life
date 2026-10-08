/**
 * LOKOJA LIFE — NPC Registry (Stage 3)
 * -------------------------------------
 * The people of Lokoja. Stage 3 uses NPCs as the FACES of hustles —
 * every personal offer comes from a named person tied to a real
 * location id. Later stages reuse this exact registry for
 * relationships, phone contacts, chats and schedules — the data
 * shape is designed for that, nothing here is UI-specific.
 *
 * Rule: NPCs reference stable location ids (same ids the map and the
 * future 3D world use) so NPC → opportunity → location → 3D world
 * all stay connected.
 */

export interface NpcDef {
  id: string
  name: string
  emoji: string
  /** where they usually are — stable id from LOCATIONS */
  homeLocationId: string
  /** one-line personality, shown on offer cards and (later) chat headers */
  bio: string
  /** how they address the player — pidgin flavour, used in offer messages */
  speech: 'friendly' | 'business' | 'respectful' | 'playful'
}

export const NPCS: NpcDef[] = [
  {
    id: 'musa',
    name: 'Musa',
    emoji: '🧵',
    homeLocationId: 'kpata-market',
    bio: 'Fabric trader wey sabi everybody for Kpata.',
    speech: 'friendly',
  },
  {
    id: 'hajiya-amina',
    name: 'Hajiya Amina',
    emoji: '🌶️',
    homeLocationId: 'kpata-market',
    bio: 'Pepper queen of Kpata. Sharp eyes, kind heart.',
    speech: 'respectful',
  },
  {
    id: 'mama-ngozi',
    name: 'Mama Ngozi',
    emoji: '🍲',
    homeLocationId: 'food-area',
    bio: 'Runs the busiest buka on the Food Strip.',
    speech: 'friendly',
  },
  {
    id: 'emeka',
    name: 'Emeka Dispatch',
    emoji: '🏍️',
    homeLocationId: 'ganaja-junction',
    bio: 'Delivery rider. If e fit move, Emeka fit carry am.',
    speech: 'playful',
  },
  {
    id: 'baba-t',
    name: 'Baba T.',
    emoji: '🛺',
    homeLocationId: 'transport-area',
    bio: 'Keke unit leader at Motor Park. Order na im hobby.',
    speech: 'business',
  },
  {
    id: 'chantel',
    name: 'Chantel',
    emoji: '📚',
    homeLocationId: 'university-area',
    bio: 'Student rep wey always get one small plan.',
    speech: 'playful',
  },
  {
    id: 'alhaji-sule',
    name: 'Alhaji Sule',
    emoji: '🗂️',
    homeLocationId: 'government-area',
    bio: 'Office clerk. Paperwork na religion for am.',
    speech: 'business',
  },
  {
    id: 'uncle-ben',
    name: 'Uncle Ben',
    emoji: '🏛️',
    homeLocationId: 'historic-lokoja',
    bio: 'Self-appointed keeper of old Lokoja stories.',
    speech: 'respectful',
  },
  {
    id: 'idris',
    name: 'Idris',
    emoji: '🎣',
    homeLocationId: 'confluence',
    bio: 'Fisherman wey sabi every current of the two rivers.',
    speech: 'friendly',
  },
  {
    id: 'baba-danjuma',
    name: 'Baba Danjuma',
    emoji: '⛰️',
    homeLocationId: 'mount-patti',
    bio: 'Trail guide. Him leg don climb Patti ten thousand times.',
    speech: 'respectful',
  },
]

export const NPC_BY_ID = Object.fromEntries(NPCS.map((n) => [n.id, n])) as Record<string, NpcDef>
