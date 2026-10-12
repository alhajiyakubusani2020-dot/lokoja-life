/**
 * LOKOJA LIFE — The Schools of Lokoja (Stage 7)
 * -----------------------------------------------
 * Real schools of the real city, placed by their REAL coordinates:
 *  - OpenStreetMap ground truth (the dataset Google Maps/Earth render):
 *    Federal University Lokoja's Felele permanent site is mapped building by
 *    building (faculties, lecture theatres, gate) and Faithview Academy has
 *    its exact mapped campus polygon.
 *  - Google plus-code decodes: Crowther Memorial College (RP4R+9M8 260101)
 *    and Julitola International School (RMJ6+GF8) decode to real positions.
 *  - Directory/news verification: GYB Model Science Secondary School
 *    (Adankolo New Layout Rd), Al-Azhar International College (Okene road /
 *    Lokongoma), Kogi State Polytechnic (Lokoja–Abuja expressway, Felele),
 *    Salem University, Baptist High School, Christfield School, and the
 *    state College of Nursing Sciences (specialist-hospital quarter).
 *
 * The projection is the SAME one the geo pipeline uses (1 unit = 26 m,
 * north = -Z, world centre 6.753E 7.790N), so a school sits beside the same
 * real road it sits beside in Lokoja. Sites that fall outside the playable
 * circle (FUL's permanent site is ~10 km out, exactly like real life) are
 * pulled to the world rim ALONG their real access road — the game world
 * compresses the city, it does not move it.
 *
 * Pure data + deterministic derivation. No economy, no state.
 */

/* ------------------------------- projection --------------------------------- */

/** geo pipeline anchors — must match scripts/geo/pipeline.py exactly */
const LAT0 = 7.79
const LON0 = 6.753
const SCALE_M = 26.0
const METERS_PER_DEG_LAT = 110540.0
const METERS_PER_DEG_LON = 111320.0 * Math.cos((LAT0 * Math.PI) / 180)

/** project a real lat/lon into game world units (x east, -z north) */
export function projectLatLon(lat: number, lon: number): [number, number] {
  const east = (lon - LON0) * METERS_PER_DEG_LON
  const north = (lat - LAT0) * METERS_PER_DEG_LAT
  return [east / SCALE_M, -north / SCALE_M]
}

/* --------------------------------- registry ---------------------------------- */

export type SchoolKind = 'university' | 'polytechnic' | 'secondary' | 'college'

/** how true the position is — shown honestly in the data, not faked */
export type AnchorSource =
  | 'osm' // exact from OpenStreetMap (Google's own ground-truth dataset)
  | 'plus-code' // decoded Google plus-code of the real campus
  | 'district' // verified school, position snapped to its real district road

export interface SchoolSpec {
  id: string
  name: string
  shortName: string
  kind: SchoolKind
  /** real campus latitude / longitude */
  lat: number
  lon: number
  anchor: AnchorSource
  /** real-world anchor note (shown nowhere — documentation + tests) */
  sourceNote: string
  founded: string
  motto: string
  tagline: string
  description: string
  /** pin / gate-paint colours */
  color: string
  accent: string
  emoji: string
  /** compound footprint (world units; 1u = 26 m) — big campuses are big */
  w: number
  d: number
  /** flat plateau radius the terrain carves for the site */
  plateauR: number
  /** classroom blocks (each 4 classrooms + veranda) */
  blocks: number
  /** has a big assembly field with running track corners */
  field: boolean
  /** campus accents (walls painted in school colours, like the real ones) */
  paint: string
  unlockLevel: number
  transport: ('walk' | 'keke' | 'taxi')[]
  travelModifier: number
}

export const SCHOOLS: SchoolSpec[] = [
  {
    id: 'ful-felele',
    name: 'Federal University Lokoja',
    shortName: 'FUL',
    kind: 'university',
    lat: 7.85343, // the real main gate node (OSM way), permanent site, Felele
    lon: 6.68416,
    anchor: 'osm',
    sourceNote: 'OSM: gate + 12 faculty/LT buildings on the permanent site',
    founded: '2011',
    motto: 'Knowledge for Development',
    tagline: 'The permanent site — faculties, lecture theatres, ambition',
    description:
      'The federal university on its Felele permanent site, off the Abuja expressway. Lecture theatres LT A and LT B, the Twin Theatre, faculty blocks and the e-learning centre stand along real mapped drives. It is a long ride from town — every student knows it.',
    color: '#1D5C8A',
    accent: '#0E3250',
    emoji: '🎓',
    w: 44,
    d: 34,
    plateauR: 30,
    blocks: 4,
    field: true,
    paint: '#e8e2d2',
    unlockLevel: 2,
    transport: ['keke', 'taxi'],
    travelModifier: 1.35,
  },
  {
    id: 'ful-adankolo',
    name: 'FUL Adankolo Campus',
    shortName: 'FUL Adankolo',
    kind: 'university',
    lat: 7.7931, // Adankolo old campus quarter — the university's first home
    lon: 6.7621,
    anchor: 'district',
    sourceNote: 'OSM places the FUL node in the Adankolo side of town',
    founded: '2011',
    motto: 'Knowledge for Development',
    tagline: 'The old campus where it all began',
    description:
      'The university’s first campus in Adankolo, before the permanent site. Smaller, older, closer to town — evening lectures spill out onto the Adankolo New Layout road.',
    color: '#2E6E8A',
    accent: '#173E50',
    emoji: '📚',
    w: 26,
    d: 20,
    plateauR: 20,
    blocks: 2,
    field: false,
    paint: '#e8e2d2',
    unlockLevel: 2,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
  },
  {
    id: 'ksp-felele',
    name: 'Kogi State Polytechnic',
    shortName: 'KSP',
    kind: 'polytechnic',
    lat: 7.8495, // along the Lokoja–Abuja expressway at Felele (institution's address)
    lon: 6.7042,
    anchor: 'district',
    sourceNote: 'Institution address: "along Lokoja/Abuja Expressway" — snapped to the real A2',
    founded: '1993',
    motto: 'Technology for Self-Reliance',
    tagline: 'HND hustle on the expressway',
    description:
      'The state polytechnic along the Abuja expressway at Felele. Engineering workshops, ND/HND lecture blocks, and the famous “poly” energy that spills onto the highway at closing time.',
    color: '#7A5A1D',
    accent: '#453209',
    emoji: '🛠️',
    w: 30,
    d: 24,
    plateauR: 22,
    blocks: 3,
    field: true,
    paint: '#e2d6b4',
    unlockLevel: 2,
    transport: ['keke', 'taxi'],
    travelModifier: 1.3,
  },
  {
    id: 'salem-university',
    name: 'Salem University',
    shortName: 'Salem',
    kind: 'university',
    lat: 7.8378, // private campus along the Lokoja–Abuja corridor
    lon: 6.7136,
    anchor: 'district',
    sourceNote: 'Directory-verified private university on the Abuja road corridor',
    founded: '2007',
    motto: 'Raising Leaders, Transforming Society',
    tagline: 'The private campus with the quiet gates',
    description:
      'The mission-run private university on the Abuja road. Neat painted blocks, a Chapel on the lawn, and the quietest reading culture in Lokoja.',
    color: '#5C2D6E',
    accent: '#341542',
    emoji: '⛪',
    w: 26,
    d: 20,
    plateauR: 20,
    blocks: 2,
    field: false,
    paint: '#efe6d0',
    unlockLevel: 3,
    transport: ['keke', 'taxi'],
    travelModifier: 1.25,
  },
  {
    id: 'college-nursing',
    name: 'College of Nursing Sciences',
    shortName: 'Nursing Schl.',
    kind: 'college',
    lat: 7.7968, // specialist-hospital quarter, Gadumu side of central Lokoja
    lon: 6.7402,
    anchor: 'district',
    sourceNote: 'State school of nursing sits in the specialist-hospital quarter',
    founded: '1976',
    motto: 'Care, Competence, Compassion',
    tagline: 'White uniforms, steady hands',
    description:
      'The state nursing college by the specialist hospital. Practical halls, demonstration dummies, and students in crisp white going for morning duty.',
    color: '#1F7A6D',
    accent: '#0C3B34',
    emoji: '🩺',
    w: 20,
    d: 16,
    plateauR: 16,
    blocks: 2,
    field: false,
    paint: '#f0ece0',
    unlockLevel: 3,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
  },
  {
    id: 'crowther-memorial',
    name: 'Crowther Memorial College',
    shortName: 'Crowther',
    kind: 'secondary',
    lat: 7.80591, // plus-code RP4R+9M8 260101 — by the Mount Patti foothills
    lon: 6.74163,
    anchor: 'plus-code',
    sourceNote: 'Google plus-code RP4R+9M8, Lokoja 260101 — decodes to this point',
    founded: '1956',
    motto: 'Knowledge, Discipline, Service',
    tagline: 'The old mission college under the hill',
    description:
      'One of Lokoja’s heritage colleges, in the old GRA quarter beneath Mount Patti. Old students’ association still fights for its land — that is how much this school means.',
    color: '#8A3A28',
    accent: '#4A1D12',
    emoji: '🏫',
    w: 24,
    d: 18,
    plateauR: 18,
    blocks: 2,
    field: true,
    paint: '#e8d8b8',
    unlockLevel: 1,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
  },
  {
    id: 'gyb-model-adankolo',
    name: 'GYB Model Science Secondary School',
    shortName: 'GYB Model',
    kind: 'secondary',
    lat: 7.8009, // Adankolo New Layout road — the real school district
    lon: 6.7587,
    anchor: 'district',
    sourceNote: 'News-verified: GYB Model Science SS (ex-Government Day SS), Adankolo New Layout Rd',
    founded: '1992',
    motto: 'Science is Light',
    tagline: 'The science school of Adankolo',
    description:
      'The model science secondary school on Adankolo New Layout road — MTN quiz finalist energy, laboratories, and morning assembly you can hear three streets away.',
    color: '#C4562A',
    accent: '#7C2D12',
    emoji: '🧪',
    w: 22,
    d: 17,
    plateauR: 17,
    blocks: 2,
    field: true,
    paint: '#e4dcc4',
    unlockLevel: 1,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
  },
  {
    id: 'faithview-academy',
    name: 'Faithview Academy',
    shortName: 'Faithview',
    kind: 'secondary',
    lat: 7.75337, // exact OSM campus polygon centroid (mapped school grounds)
    lon: 6.73858,
    anchor: 'osm',
    sourceNote: 'OSM: amenity=school grounds mapped at this exact position',
    founded: '2003',
    motto: 'Faith. Knowledge. Vision.',
    tagline: 'The academy on the southern road',
    description:
      'A private academy on the southern outskirts, mapped school grounds and all. Small classes, big dreams, and a compound that stays alive till prep time.',
    color: '#2E7D5B',
    accent: '#17402E',
    emoji: '✏️',
    w: 18,
    d: 14,
    plateauR: 14,
    blocks: 1,
    field: false,
    paint: '#e0dcc8',
    unlockLevel: 1,
    transport: ['walk', 'keke'],
    travelModifier: 1.1,
  },
  {
    id: 'al-azhar-college',
    name: 'Al-Azhar International College',
    shortName: 'Al-Azhar',
    kind: 'secondary',
    lat: 7.7962, // Okene road corridor past Lokongoma Phase 1
    lon: 6.7265,
    anchor: 'district',
    sourceNote: 'Directory-verified international college, Okene-road corridor',
    founded: '2005',
    motto: 'Ilm and Akhlaq',
    tagline: 'The international college on Okene road',
    description:
      'The international college along the Okene road after Lokongoma. Arabic and English side by side, green-and-white uniform, and some of the calmest students in the city.',
    color: '#2E7D5B',
    accent: '#173E2A',
    emoji: '🕌',
    w: 18,
    d: 14,
    plateauR: 14,
    blocks: 1,
    field: false,
    paint: '#e6e0cc',
    unlockLevel: 2,
    transport: ['keke', 'taxi'],
    travelModifier: 1.1,
  },
  {
    id: 'baptist-high',
    name: 'Baptist High School',
    shortName: 'Baptist HS',
    kind: 'secondary',
    lat: 7.8022, // mission-school quarter on the town’s central-east side
    lon: 6.7498,
    anchor: 'district',
    sourceNote: 'Directory-verified Baptist mission secondary school, central Lokoja quarter',
    founded: '1979',
    motto: 'The Truth Shall Set You Free',
    tagline: 'The mission school with the old choir',
    description:
      'The Baptist mission secondary school in central Lokoja. Famous choir, famous discipline, and inter-house sports that stop the whole street.',
    color: '#3A5A8A',
    accent: '#1E3350',
    emoji: '📖',
    w: 18,
    d: 14,
    plateauR: 14,
    blocks: 1,
    field: true,
    paint: '#e2dcc6',
    unlockLevel: 1,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
  },
  {
    id: 'julitola-intl',
    name: 'Julitola International School',
    shortName: 'Julitola',
    kind: 'secondary',
    lat: 7.8313, // plus-code RMJ6+GF8 — along the Abuja road before Felele
    lon: 6.6611,
    anchor: 'plus-code',
    sourceNote: 'Google plus-code RMJ6+GF8, Lokoja 264103 — Abuja-road corridor',
    founded: '2001',
    motto: 'Raising Champions',
    tagline: 'The international school by the expressway',
    description:
      'The international school out on the Abuja road. Yellow school bus, intercom at the gate, and the sort of end-of-term parties that trend in Lokoja.',
    color: '#B0812A',
    accent: '#5C3E12',
    emoji: '🚌',
    w: 18,
    d: 14,
    plateauR: 14,
    blocks: 1,
    field: false,
    paint: '#ece4c8',
    unlockLevel: 2,
    transport: ['keke', 'taxi'],
    travelModifier: 1.25,
  },
  {
    id: 'christfield-school',
    name: 'Christfield School',
    shortName: 'Christfield',
    kind: 'secondary',
    lat: 7.7892, // central-south Lokoja schooling quarter
    lon: 6.7442,
    anchor: 'district',
    sourceNote: 'Directory-verified nursery/primary/secondary, central-south Lokoja',
    founded: '2007',
    motto: 'Built on the Rock',
    tagline: 'Nursery bells to senior class',
    description:
      'The all-through school in central-south Lokoja — tiny nursery chairs at one end, WAEC class at the other, and mothers at the gate from 1 pm.',
    color: '#C48A2A',
    accent: '#6E4A12',
    emoji: '🎒',
    w: 16,
    d: 13,
    plateauR: 13,
    blocks: 1,
    field: false,
    paint: '#e8e0c8',
    unlockLevel: 1,
    transport: ['walk', 'keke', 'taxi'],
    travelModifier: 1,
  },
]

export const SCHOOL_BY_ID: Record<string, SchoolSpec> = Object.fromEntries(
  SCHOOLS.map((s) => [s.id, s]),
)

/* ------------------------- derived map-grid position ------------------------- */

/**
 * The 2D map grid (0–100) spans the same square as the world (±310 u),
 * so mapX/mapY derive straight from the projection — the map pin and the
 * 3D gate can never disagree. Sites whose raw projection falls outside the
 * playable circle are pulled to the world rim along their access road by
 * the layout (world3d/schools.ts); BOTH grid and 3D use that same pulled
 * position, computed here once.
 */
export const WORLD_HALF = 310
/** pull any site inside this rim so the gate is reachable on foot (WALK_BOUND 292 − margin) */
const RIM_LIMIT = 272

export interface SchoolSite extends SchoolSpec {
  x: number
  z: number
  /** true when the raw projection was pulled to the rim (documented per site) */
  rimPulled: boolean
  mapX: number
  mapY: number
}

function buildSites(): SchoolSite[] {
  return SCHOOLS.map((s) => {
    const [x, z] = projectLatLon(s.lat, s.lon)
    const rim = Math.hypot(x, z)
    let px = x
    let pz = z
    let pulled = false
    if (rim > RIM_LIMIT) {
      pulled = true
      px = (x / rim) * RIM_LIMIT
      pz = (z / rim) * RIM_LIMIT
    }
    return {
      ...s,
      x: px,
      z: pz,
      rimPulled: pulled,
      mapX: 50 + px / ((WORLD_HALF * 2) / 100),
      mapY: 50 + pz / ((WORLD_HALF * 2) / 100),
    }
  })
}

/**
 * Raw projected sites (rim-pulled, map grid provisional). The FINAL
 * relaxation — campus separation + legacy-anchor clearance + the final
 * map-grid derivation — runs in world3d/layout.ts, which owns the legacy
 * anchor geometry. Consumers must use layout's SCHOOL_SITES.
 */
export const SCHOOL_SITES_PROJECTED: SchoolSite[] = buildSites()

/**
 * The ten LEGACY anchor world positions (from locations.ts mapX/mapY × 6.2,
 * worldX = (mapX − 50) × 6.2). Duplicated here leaf-style so the site
 * relaxation can respect the existing anchors without an import cycle —
 * scripts/test-schools.ts verifies every entry against ANCHOR_BY_ID, so
 * any drift fails the build.
 */
export const LEGACY_ANCHOR_XY: { id: string; x: number; z: number }[] = [
  { id: 'home', x: -90.52, z: 34.1 },
  { id: 'kpata-market', x: -70.68, z: 42.16 },
  { id: 'ganaja-junction', x: -51.46, z: 89.28 },
  { id: 'confluence', x: -40.3, z: 153.76 },
  { id: 'mount-patti', x: -84.94, z: -135.78 },
  { id: 'historic-lokoja', x: -68.2, z: -53.94 },
  { id: 'government-area', x: -97.96, z: 18.6 },
  { id: 'university-area', x: -187.86, z: -27.9 },
  { id: 'food-area', x: -55.8, z: 50.84 },
  { id: 'transport-area', x: -51.46, z: 67.58 },
]
