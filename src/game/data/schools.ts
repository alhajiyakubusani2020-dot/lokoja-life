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
    w: 28,
    d: 22,
    plateauR: 18.5,
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
    w: 32,
    d: 26,
    plateauR: 21.5,
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
    w: 28,
    d: 22,
    plateauR: 18.5,
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
    w: 24,
    d: 18,
    plateauR: 15.5,
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
    w: 26,
    d: 20,
    plateauR: 16.5,
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
    w: 26,
    d: 20,
    plateauR: 16.5,
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
    w: 26,
    d: 20,
    plateauR: 16.5,
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
    w: 30,
    d: 24,
    plateauR: 19.5,
    blocks: 1,
    field: true,
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
    w: 26,
    d: 20,
    plateauR: 16.5,
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
    w: 26,
    d: 20,
    plateauR: 16.5,
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
    w: 24,
    d: 18,
    plateauR: 15.5,
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

/* ============================================================================
 * STAGE 8 — THE BUILDING PLANS (building by building, inside and out)
 * ==========================================================================
 * Every school carries an honest building-by-building plan in the same
 * breakdown shape the real campuses follow:
 *   - name       what the building is called on campus
 *   - position   where it sits in the compound (shown in tests, used to
 *                place the 3D box — explicit lx/lz where the plan demands
 *                an exact spot, otherwise the deterministic auto-placer
 *                walks the back band)
 *   - inside     what you find when you enter (drives the interior layout)
 *   - room       interior id suffix (`${school.id}-${room}`); omitted for
 *                shell-only buildings like the watchtower
 * Verified against directory/news/OSM research; "typical" rooms for school
 * types (assembly hall, sick bay, canteen) are the standard Nigerian set.
 */

export type BuildingKind =
  | 'senate' | 'library' | 'faculty' | 'computer-lab' | 'science-lab'
  | 'lecture-theatre' | 'hostel' | 'watchtower' | 'health-sciences'
  | 'workshop' | 'chapel' | 'mosque' | 'assembly-hall' | 'canteen'
  | 'clinic' | 'demo-lab' | 'admin'

export interface BuildingPlan {
  kind: BuildingKind
  name: string
  /** honest position note — "where it sits on campus" */
  position: string
  /** what is inside, one entry per real room / fitting group */
  inside: string[]
  /** interior id suffix; omit for shell-only buildings */
  room?: string
  /** explicit local position (x east, +z toward the gate) — planned sites */
  lx?: number
  lz?: number
  /** the study action label inside this building */
  studyLabel?: string
}

export const SCHOOL_PLANS: Record<string, BuildingPlan[]> = {
  'ful-felele': [
    {
      kind: 'senate',
      name: 'The Senate Building',
      position: 'centrally on the main axis, straight past the grand entrance',
      inside: [
        "the Vice-Chancellor's executive suite",
        "the Registrar's corporate wing",
        'the central academic registry',
        'council chambers with the long meeting table',
      ],
      room: 'senate',
      lx: 0,
      lz: -12.2,
      studyLabel: "Greet the Vice-Chancellor's office",
    },
    {
      kind: 'library',
      name: 'The University Library',
      position: 'the heart of the central academic lawn',
      inside: [
        'book stack corridors cataloged by faculty',
        'the digital e-library network hub',
        'reference & serials sections',
        'student reading halls with long desks',
      ],
      room: 'library',
      lx: -13.2,
      lz: -12.2,
      studyLabel: 'Read in the main library',
    },
    {
      kind: 'faculty',
      name: 'Faculty of Arts',
      position: 'the north-east loop of the academic area',
      inside: [
        'English & Literary Studies, History, Theatre Arts wings',
        'the language laboratory with headset desks',
        'lecture rooms with rows of desks',
        'the staff common room',
      ],
      room: 'fac-arts',
      lx: -17.8,
      lz: -5.4,
      studyLabel: 'Practise in the language lab',
    },
    {
      kind: 'science-lab',
      name: 'Faculty of Science',
      position: 'on the western curve of the academic loop road',
      inside: [
        'advanced chemistry laboratories with fume hoods',
        'physics practical labs',
        'biological & geological workspaces with microscopes',
        'the faculty boardroom',
      ],
      room: 'fac-sci',
      lx: 14,
      lz: -5.4,
      studyLabel: 'Take a practical in the science labs',
    },
    {
      kind: 'faculty',
      name: 'Faculty of Social & Management Sciences',
      position: 'along the south-west academic corridor',
      inside: [
        'Economics, Political Science, Sociology offices',
        'Accounting & Business Administration wings',
        'computer simulation labs',
        'the GIS laboratory',
      ],
      room: 'lab',
      lx: 17.6,
      lz: -12.2,
      studyLabel: 'Book a GIS workstation',
    },
    {
      kind: 'lecture-theatre',
      name: 'Twin Lecture Theatre A',
      position: 'between the Faculty of Science and the Faculty of Arts',
      inside: [
        'a 250-seat stepped auditorium',
        'tiered theatre rows',
        'instructional podium with microphone',
        'ceiling projector brackets',
      ],
      room: 'theatre',
      lx: -5.4,
      lz: -5,
      studyLabel: 'Attend the lecture',
    },
    {
      kind: 'lecture-theatre',
      name: 'Twin Lecture Theatre B',
      position: 'shoulder to shoulder with Theatre A',
      inside: [
        'a 250-seat stepped auditorium',
        'tiered theatre rows',
        'instructional podium with microphone',
        'ceiling projector brackets',
      ],
      room: 'lt-b',
      lx: 4.8,
      lz: -5,
      studyLabel: 'Attend the lecture',
    },
    {
      kind: 'hostel',
      name: 'Felele Student Hostels',
      position: 'the south-eastern perimeter, zoned away from academic traffic',
      inside: [
        'shared rooms of metal bunk beds and personal lockers',
        'the common study lounge',
        'ablution blocks on every floor',
        "the porter's lodge at the steps",
      ],
      room: 'hostel',
      lx: -16,
      lz: 0.5,
      studyLabel: 'Evening prep in the common lounge',
    },
    {
      kind: 'canteen',
      name: 'Student Cafeteria',
      position: 'behind the central lawn, beside the faculties',
      inside: ['the serving counter with pots', 'long dining benches', 'the kitchen store'],
      room: 'canteen',
      lx: 9,
      lz: -12.2,
    },
    {
      kind: 'clinic',
      name: 'University Clinic',
      position: 'the quiet corner near the hostels',
      inside: ['consultation desk', 'observation beds', 'the medicine cabinet'],
      room: 'clinic',
      lx: -17.4,
      lz: 14.4,
    },
    {
      kind: 'watchtower',
      name: 'Security Watchtower',
      position: 'rising over the main gatehouse at the compound corner',
      inside: ['the elevated watch platform', 'the perimeter radio base'],
      lx: -19.5,
      lz: -12.2,
    },
  ],
  'ful-adankolo': [
    {
      kind: 'health-sciences',
      name: 'College of Health Sciences',
      position: 'the primary northern block of the campus',
      inside: [
        'the gross anatomy laboratory with dissection tables',
        'histology & pathology viewing bays',
        'specimen preservation tanks and models',
        'clinical faculty offices',
      ],
      room: 'anatomy',
      studyLabel: 'Take the anatomy practical',
    },
    {
      kind: 'lecture-theatre',
      name: 'The Pre-Clinical Lecture Theatre',
      position: 'right beside the medical laboratory wing',
      inside: [
        'stepped seating facing the display board',
        'colour-coded medical posters',
        'the human skeletal model',
        'overhead projector screen',
      ],
      room: 'preclinic',
      studyLabel: 'Attend the pre-clinical lecture',
    },
    {
      kind: 'admin',
      name: 'The Adankolo Admin Block',
      position: 'beside the gate, where the old campus began',
      inside: ['the campus director’s office', 'the old registry counters', 'faculty notice boards'],
      room: 'office',
      studyLabel: 'Greet the campus director',
    },
    {
      kind: 'canteen',
      name: 'The Old Campus Canteen',
      position: 'on the walk between lectures',
      inside: ['the jollof counter', 'plastic tables and benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Campus Sick Bay',
      position: 'the shaded corner by the wall',
      inside: ['two observation beds', 'the first-aid cabinet', 'the nurse’s desk'],
      room: 'clinic',
    },
  ],
  'ksp-felele': [
    {
      kind: 'workshop',
      name: 'The Engineering Workshops',
      position: 'the noisy row along the back fence',
      inside: [
        'machine benches with lathes and mills',
        'the electrical & electronics bay',
        'mechatronics rigs',
        'the tool store crates',
      ],
      room: 'workshop',
      studyLabel: 'Learn at the machines',
    },
    {
      kind: 'computer-lab',
      name: 'The DITRC Computer Centre',
      position: 'beside the lecture blocks — the ICT directorate',
      inside: ['bench rows of workstations', 'the server stack', 'the lab instructor desk'],
      room: 'lab',
      studyLabel: 'Book a computer hour',
    },
    {
      kind: 'library',
      name: 'The Polytechnic Library',
      position: 'the quiet block behind the assembly yard',
      inside: ['shelf stacks by department', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'admin',
      name: 'The Rectory & Admin Block',
      position: 'the first building past the gate',
      inside: ["the Rector's office suite", 'the records counters', 'the bursary windows'],
      room: 'office',
      studyLabel: 'Greet the Rector’s office',
    },
    {
      kind: 'hostel',
      name: 'The Poly Hostels',
      position: 'the residential corner of the compound',
      inside: ['bunk rooms with lockers', 'the common lounge', 'the ablution block'],
      room: 'hostel',
      studyLabel: 'Evening prep in the common lounge',
    },
    {
      kind: 'canteen',
      name: 'The Poly Canteen',
      position: 'where the expressway noise meets the yard',
      inside: ['the rice and beans counter', 'long benches', 'the cold drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Poly Clinic',
      position: 'the small white block by the hostel fence',
      inside: ['observation beds', 'the medicine shelf', 'the nurse’s desk'],
      room: 'clinic',
    },
  ],
  'salem-university': [
    {
      kind: 'chapel',
      name: 'The University Chapel',
      position: 'front and centre on the lawn',
      inside: ['wooden pews in columns', 'the pulpit and altar table', 'the choir bench', 'the scripture shelf'],
      room: 'chapel',
      studyLabel: 'Sit a moment in the chapel',
    },
    {
      kind: 'library',
      name: 'The Salem Library',
      position: 'beside the chapel on the central lawn',
      inside: ['shelf stacks by college', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'admin',
      name: 'The Administration Block',
      position: 'the first building past the gate',
      inside: ["the VC's office suite", 'the registry counters', 'the bursary windows'],
      room: 'office',
      studyLabel: 'Greet the registry',
    },
    {
      kind: 'hostel',
      name: 'The Salem Hostels',
      position: 'the residential ring — every student lives on campus',
      inside: ['bunk rooms with lockers', 'the common study lounge', 'the ablution block'],
      room: 'hostel',
      studyLabel: 'Evening prep in the common lounge',
    },
    {
      kind: 'canteen',
      name: 'The Dining Hall Canteen',
      position: 'between the hostels and the lawn',
      inside: ['the serving counter', 'dining tables and benches', 'the kitchen store'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Medical Centre',
      position: 'the quiet corner by the back fence',
      inside: ['observation beds', 'the medicine cabinet', 'the nurse’s desk'],
      room: 'clinic',
    },
  ],
  'college-nursing': [
    {
      kind: 'demo-lab',
      name: 'The Demonstration Room',
      position: 'the practical wing beside the lecture hall',
      inside: [
        'demonstration beds with dummies',
        'the anatomy model and charts',
        'the scrub basins',
        'the procedure cabinet',
      ],
      room: 'demo',
      studyLabel: 'Practise at the demonstration beds',
    },
    {
      kind: 'library',
      name: 'The Nursing Library',
      position: 'the quiet block behind the classrooms',
      inside: ['shelf stacks of medical texts', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'admin',
      name: 'The Provost’s Office',
      position: 'the first block past the gate',
      inside: ["the Provost's office", 'the admissions counters', 'the notice board'],
      room: 'office',
      studyLabel: 'Greet the Provost’s office',
    },
    {
      kind: 'clinic',
      name: 'The Practice Sick Bay',
      position: 'beside the demonstration wing',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
  ],
  'crowther-memorial': [
    {
      kind: 'assembly-hall',
      name: 'The Heritage Hall',
      position: 'the old hall facing the assembly ground',
      inside: ['the stage and podium', 'long bench rows', 'the honours board', 'ceiling fans'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'science-lab',
      name: 'The Science Laboratory',
      position: 'behind the classroom block',
      inside: ['lab benches with gas taps', 'the fume hood', 'specimen cabinets', 'the wash basins'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'library',
      name: 'The Old Library',
      position: 'the mission-era block under the trees',
      inside: ['shelf stacks', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'canteen',
      name: 'The Tuck Shop',
      position: 'beside the hall steps',
      inside: ['the snacks counter', 'a few benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sick Bay',
      position: 'the quiet corner by the fence',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Principal’s Block',
      position: 'beside the gate where discipline is served',
      inside: ["the Principal's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the principal',
    },
  ],
  'gyb-model-adankolo': [
    {
      kind: 'science-lab',
      name: 'The Science Laboratories',
      position: 'the lab row behind the blocks — a science school must have them',
      inside: ['lab benches with gas taps', 'the fume hood', 'specimen cabinets', 'the wash basins'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'assembly-hall',
      name: 'The Assembly Hall',
      position: 'facing the assembly ground — morning assembly you can hear three streets away',
      inside: ['the stage and podium', 'long bench rows', 'the prizes board', 'ceiling fans'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'library',
      name: 'The Model School Library',
      position: 'behind the classroom block',
      inside: ['shelf stacks', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'canteen',
      name: 'The School Canteen',
      position: 'beside the hall',
      inside: ['the food counter', 'a few benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sick Bay',
      position: 'the quiet corner by the fence',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Principal’s Block',
      position: 'beside the gate',
      inside: ["the Principal's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the principal',
    },
    // a day school — the hostels the news promised have NOT been built yet,
    // so the compound stays honest: no hostel block.
  ],
  'faithview-academy': [
    {
      kind: 'science-lab',
      name: 'The Science Lab',
      position: 'behind the classroom block',
      inside: ['lab benches with taps', 'the fume hood', 'specimen cabinets', 'the wash basin'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'assembly-hall',
      name: 'The Assembly Hall',
      position: 'facing the yard',
      inside: ['the stage and podium', 'bench rows', 'the honours board'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'computer-lab',
      name: 'The ICT Lab',
      position: 'beside the hall',
      inside: ['bench rows of computers', 'the instructor desk', 'the UPS crate'],
      room: 'lab',
      studyLabel: 'Book a computer hour',
    },
    {
      kind: 'canteen',
      name: 'The Tuck Shop',
      position: 'by the gate road',
      inside: ['the snacks counter', 'a few benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sick Bay',
      position: 'the quiet corner',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Admin Block',
      position: 'beside the gate',
      inside: ["the Principal's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the principal',
    },
  ],
  'al-azhar-college': [
    {
      kind: 'science-lab',
      name: 'The Science Laboratory',
      position: 'behind the classroom block',
      inside: ['lab benches with taps', 'the fume hood', 'specimen cabinets', 'the wash basins'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'assembly-hall',
      name: 'The Main Hall',
      position: 'facing the yard',
      inside: ['the stage and podium', 'bench rows', 'the honours board'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'library',
      name: 'The Library',
      position: 'the quiet block — well stocked, the prospectus says',
      inside: ['shelf stacks', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'mosque',
      name: 'The Campus Mosque',
      position: 'the prayer block on the east side',
      inside: ['prayer mats in rows', 'the mihrab niche', 'the Quran shelves', 'the ablution taps'],
      room: 'mosque',
      studyLabel: 'Sit a moment in the mosque',
    },
    {
      kind: 'computer-lab',
      name: 'The Computer Lab',
      position: 'beside the library — internet-enabled, honestly',
      inside: ['bench rows of computers', 'the instructor desk', 'the UPS crate'],
      room: 'lab',
      studyLabel: 'Book a computer hour',
    },
    {
      kind: 'hostel',
      name: 'The Boarding Hostels',
      position: 'the residential wing — a full boarding college',
      inside: ['bunk rooms with lockers', 'the common lounge', 'the ablution block'],
      room: 'hostel',
      studyLabel: 'Evening prep in the common lounge',
    },
    {
      kind: 'canteen',
      name: 'The Dining Canteen',
      position: 'between the hostel wing and the classes',
      inside: ['the serving counter', 'dining benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sickbay',
      position: 'by the hostel fence — qualified staff, the prospectus says',
      inside: ['observation beds', 'the medicine cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Admin Block',
      position: 'beside the gate',
      inside: ["the Principal's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the principal',
    },
  ],
  'baptist-high': [
    {
      kind: 'science-lab',
      name: 'The Science Laboratory',
      position: 'behind the classroom block',
      inside: ['lab benches with taps', 'the fume hood', 'specimen cabinets', 'the wash basins'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'assembly-hall',
      name: 'The Assembly Hall',
      position: 'where the famous choir rehearses',
      inside: ['the stage and podium', 'bench rows', 'the choir corner', 'ceiling fans'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'library',
      name: 'The Mission Library',
      position: 'the quiet block under the mango trees',
      inside: ['shelf stacks', 'reading tables', 'the returns desk'],
      room: 'library',
      studyLabel: 'Read for a while',
    },
    {
      kind: 'canteen',
      name: 'The Tuck Shop',
      position: 'beside the hall',
      inside: ['the snacks counter', 'a few benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sick Bay',
      position: 'the quiet corner by the fence',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Principal’s Block',
      position: 'beside the gate',
      inside: ["the Principal's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the principal',
    },
  ],
  'julitola-intl': [
    {
      kind: 'science-lab',
      name: 'The Science Laboratories',
      position: 'the lab wing the prospectus calls state-of-the-art',
      inside: ['lab benches with taps', 'the fume hood', 'specimen cabinets', 'the wash basins'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'computer-lab',
      name: 'The ICT Lab',
      position: 'hands-on training by IT professionals, the site says',
      inside: ['bench rows of computers', 'the instructor desk', 'the UPS crate'],
      room: 'lab',
      studyLabel: 'Book a computer hour',
    },
    {
      kind: 'assembly-hall',
      name: 'The Assembly Hall',
      position: 'facing the yard — end-of-term party central',
      inside: ['the stage and podium', 'bench rows', 'the honours board'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'canteen',
      name: 'The Canteen',
      position: 'beside the hall',
      inside: ['the food counter', 'a few benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sick Bay',
      position: 'the quiet corner by the fence',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Admin Block',
      position: 'beside the gate — intercom and visitor book',
      inside: ["the Principal's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the principal',
    },
  ],
  'christfield-school': [
    {
      kind: 'science-lab',
      name: 'The Science Lab',
      position: 'behind the classroom block',
      inside: ['lab benches with taps', 'the fume hood', 'specimen cabinets', 'the wash basin'],
      room: 'sci-lab',
      studyLabel: 'Take a practical',
    },
    {
      kind: 'assembly-hall',
      name: 'The Assembly Hall',
      position: 'facing the yard — nursery bells to senior class',
      inside: ['the stage and podium', 'bench rows', 'the honours board'],
      room: 'hall',
      studyLabel: 'Join the assembly',
    },
    {
      kind: 'canteen',
      name: 'The Tuck Shop',
      position: 'where the mothers wait at the gate',
      inside: ['the snacks counter', 'a few benches', 'the drinks fridge'],
      room: 'canteen',
    },
    {
      kind: 'clinic',
      name: 'The Sick Bay',
      position: 'the quiet corner',
      inside: ['observation beds', 'the first-aid cabinet', 'the duty desk'],
      room: 'clinic',
    },
    {
      kind: 'admin',
      name: 'The Admin Block',
      position: 'beside the gate',
      inside: ["the Head Teacher's office", 'the staff room', 'the records counters'],
      room: 'office',
      studyLabel: 'Greet the head teacher',
    },
  ],
}
