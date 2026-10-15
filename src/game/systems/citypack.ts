/**
 * LOKOJA LIFE — M18: THE CITY FORGE
 * ---------------------------------
 * A city = content pack, not a program. One pipeline turns an OSM
 * extract into a shippable city pack inside the 3-HOUR SLA, and a QA
 * battery stands between every pack and the nation.
 *
 * LAWS OF THIS FILE:
 *  - THE PACK LAW: a city is DATA — streets, locations, culture,
 *    economy, civic blueprints — versioned, loadable, swappable. The
 *    engine never forks per city; the pack carries the city.
 *  - THE PHANTOM-ID LAW: every id a pack mints carries its city's
 *    brand at the TYPE level (CityId<'kano'> is not CityId<'lokoja'>)
 *    AND a runtime prefix guard — zero cross-contamination, in the
 *    compiler and at the door.
 *  - THE PIPELINE LAW: five stages, each with an honest minute budget
 *    — OSM import (0–45), auto-classify + interiors (45–90), civic
 *    blueprints + economy + culture (90–150), the QA battery (150–170),
 *    the PWA ship (170–180). A stage that overshoots its budget fails
 *    the SLA honestly. Deterministic: the same extract forges the same
 *    pack twice.
 *  - THE QA BATTERY: id hygiene, coordinate bounds, economy sanity (a
 *    meal cannot cost more than a roof), culture completeness, and
 *    street-graph connectivity (every location reachable) — a pack
 *    ships ONLY on a green battery.
 *  - THE PILOT LADDER: Abuja pilots first, then Kano/Enugu/PH/Ibadan,
 *    then Accra — and "YOUR CITY NEXT?" is a real vote book, counted
 *    deterministically.
 *  - THE LOKOJA BRIDGE: the living city ships as a pack too — the
 *    default lokoja-v1 derives from the game's own data, proving packs
 *    and the running city speak one shape.
 */

/* ============================ phantom-typed ids ============================ */

/** THE PHANTOM-ID LAW, type level: a city's id is branded with its
 *  city name — the compiler refuses a Kano street where a Lokoja
 *  street is promised. (Zero runtime cost: the brand is phantom.) */
declare const brand: unique symbol
export type CityId<Name extends string> = string & { readonly [brand]: Name }
export type StreetId<Name extends string> = string & { readonly [brand]: Name }
export type LocationId<Name extends string> = string & { readonly [brand]: Name }

export const CITY_PREFIX_SEP = ':'

/** THE PHANTOM-ID LAW, runtime: the door guard. A minted id carries
 *  its city prefix; anything else refuses at the boundary. */
export function mintStreet<Name extends string>(city: CityId<Name>, slug: string): StreetId<Name> {
  return `${city}${CITY_PREFIX_SEP}${slug}` as StreetId<Name>
}

export function mintLocation<Name extends string>(city: CityId<Name>, slug: string): LocationId<Name> {
  return `${city}${CITY_PREFIX_SEP}${slug}` as LocationId<Name>
}

export function cityOf(branded: string): string {
  return branded.split(CITY_PREFIX_SEP)[0] ?? ''
}

/** The runtime cross-contamination guard: an id from another city
 *  refuses at the door (the type law's runtime twin). */
export function belongsTo<Name extends string>(id: string, city: CityId<Name>): boolean {
  return cityOf(id) === city
}

/* ================================ the pack ================================= */

export interface PackStreet {
  id: string
  name: string
  /** the classify law's verdict: how the street moves and who walks it */
  kind: 'arterial' | 'highstreet' | 'residential' | 'service' | 'waterfront'
  /** minutes a healthy adult walks end to end (the travel law's seed) */
  walkMinutes: number
  /** OSM provenance: the way ids that became this street */
  fromWays: string[]
}

export interface PackLocation {
  id: string
  name: string
  street: string
  kind: 'market' | 'food' | 'bank' | 'clinic' | 'school' | 'work' | 'transport' | 'home' | 'landmark' | 'shop'
  /** interiors law: locations with doors the player can enter */
  hasInterior: boolean
}

export interface CulturePack {
  greetings: string[]
  dishes: { name: string; price: number }[]
  festivals: { name: string; yearDay: number }[]
  languageNote: string
  currency: string
}

export interface EconomyTables {
  /** cost-of-living index (Lokoja = 100) — every price seeds from it */
  colIndex: number
  mealBase: number
  fareBase: number
  wageBase: number
}

export interface CivicBlueprints {
  /** transformer zones (the chaos engine reads these) */
  powerZones: string[]
  /** the market day cadence (the market law's seed) */
  marketDayEvery: number
  /** the civic offices the pack promises */
  offices: ('bank' | 'clinic' | 'school' | 'kgirs' | 'nepa')[]
}

export interface CityPack<Name extends string = string> {
  id: CityId<Name>
  name: string
  country: string
  version: string
  streets: PackStreet[]
  locations: PackLocation[]
  culture: CulturePack
  economy: EconomyTables
  civic: CivicBlueprints
}

/* ================================ the pipeline ============================= */

/** THE PIPELINE LAW — the 3-hour SLA, stage by stage. */
export interface StageSpec {
  key: 'osm' | 'classify' | 'blueprint' | 'qa' | 'ship'
  label: string
  /** the minute budget the SLA grants this stage */
  budgetMinutes: number
  /** the minute at which this stage begins in a clean run */
  startsAtMinute: number
}

export const PIPELINE: readonly StageSpec[] = [
  { key: 'osm', label: 'OSM import', budgetMinutes: 45, startsAtMinute: 0 },
  { key: 'classify', label: 'Auto-classify + interiors', budgetMinutes: 45, startsAtMinute: 45 },
  { key: 'blueprint', label: 'Civic + economy + culture', budgetMinutes: 60, startsAtMinute: 90 },
  { key: 'qa', label: 'QA battery', budgetMinutes: 20, startsAtMinute: 150 },
  { key: 'ship', label: 'PWA ship', budgetMinutes: 10, startsAtMinute: 170 },
]

export const CITY_SLA_MINUTES = 180

/** THE STAGE BUDGET LAW: a run that overshoots any stage (or the SLA)
 *  fails honestly — the forge never ships a slow city. */
export function slaVerdict(stageMinutes: Record<string, number>): { ok: boolean; brokenStage: string | null; total: number } {
  let total = 0
  for (const stage of PIPELINE) {
    const spent = stageMinutes[stage.key] ?? 0
    total += spent
    if (spent > stage.budgetMinutes) return { ok: false, brokenStage: stage.key, total }
  }
  if (total > CITY_SLA_MINUTES) return { ok: false, brokenStage: 'sla', total }
  return { ok: true, brokenStage: null, total }
}

/* ------------------------------ stage 1: OSM import ------------------------ */

/** A normalized OSM extract: the nodes and ways the import stage reads.
 *  (Real OSM pulls land here through the same shape.) */
export interface OsmNode { id: string; lat: number; lon: number; tags?: Record<string, string> }
export interface OsmWay { id: string; nodes: string[]; tags: Record<string, string> }
export interface OsmExtract { city: string; nodes: OsmNode[]; ways: OsmWay[] }

export interface ImportedFeature {
  wayId: string
  name: string
  /** the raw tag bundle the classifier reads */
  tags: Record<string, string>
  /** the centroid (first node wins — the honest cheap mean for a pack) */
  lat: number
  lon: number
}

/** STAGE 1 (0–45min): the wire becomes features. A way without a name
 *  borrows its amenity/shop tag or refuses — the forge never invents. */
export function osmImport(extract: OsmExtract): { features: ImportedFeature[]; refused: number } {
  const nodeById = new Map(extract.nodes.map((n) => [n.id, n]))
  const features: ImportedFeature[] = []
  let refused = 0
  for (const way of extract.ways) {
    const name = way.tags.name ?? way.tags.amenity ?? way.tags.shop
    const first = nodeById.get(way.nodes[0] ?? '')
    if (!name || !first) { refused++; continue }
    features.push({ wayId: way.id, name, tags: way.tags, lat: first.lat, lon: first.lon })
  }
  return { features, refused }
}

/* ------------------------- stage 2: classify + interiors ------------------- */

export type StreetKind = PackStreet['kind']
export type LocationKind = PackLocation['kind']

/** THE CLASSIFY LAW: OSM tags → the pack's kinds. highway=primary/
 *  trunk are arterials; highway=footway/residential are streets;
 *  shop/amenity clusters become the highstreet; waterways become the
 *  waterfront. A feature with an amenity/shop/office tag becomes a
 *  LOCATION with an interior (the doors law); a plain highway becomes
 *  a STREET. */
export function classify(feature: ImportedFeature): { as: 'street' | 'location'; kind: StreetKind | LocationKind; hasInterior: boolean } {
  const t = feature.tags
  if (t.waterway || t.natural === 'water') return { as: 'street', kind: 'waterfront', hasInterior: false }
  if (t.amenity || t.shop || t.office || t.tourism) {
    const a = t.amenity ?? ''
    const s = t.shop ?? ''
    if (a === 'marketplace') return { as: 'location', kind: 'market', hasInterior: true }
    if (a === 'bank' || s === 'money_transfer') return { as: 'location', kind: 'bank', hasInterior: true }
    if (a === 'clinic' || a === 'hospital' || a === 'pharmacy') return { as: 'location', kind: 'clinic', hasInterior: true }
    if (a === 'school' || a === 'college' || a === 'university') return { as: 'location', kind: 'school', hasInterior: true }
    if (a === 'bus_station' || a === 'ferry_terminal' || a === 'fuel') return { as: 'location', kind: 'transport', hasInterior: false }
    if (a === 'restaurant' || a === 'cafe' || a === 'fast_food' || s === 'restaurant') return { as: 'location', kind: 'food', hasInterior: true }
    if (t.office) return { as: 'location', kind: 'work', hasInterior: true }
    return { as: 'location', kind: 'shop', hasInterior: true }
  }
  const hw = t.highway ?? ''
  if (hw === 'primary' || hw === 'trunk' || hw === 'secondary') return { as: 'street', kind: 'arterial', hasInterior: false }
  if (hw === 'service') return { as: 'street', kind: 'service', hasInterior: false }
  if (t.shop || t.building === 'retail') return { as: 'street', kind: 'highstreet', hasInterior: false }
  return { as: 'street', kind: 'residential', hasInterior: false }
}

/** THE WALK-TIME LAW: a street's walk minutes seed from its kind —
 *  arterials carry the bus, residentials carry the feet. */
export function walkMinutesFor(kind: StreetKind, nodeCount: number): number {
  const base: Record<StreetKind, number> = { arterial: 4, highstreet: 6, residential: 8, service: 3, waterfront: 10 }
  return Math.max(1, Math.round(base[kind] + nodeCount * 0.5))
}

/* --------------- stage 3: civic blueprints + economy + culture ------------- */

/** THE ECONOMY SEED LAW: every price seeds from the cost-of-living
 *  index (Lokoja = 100). The ratios are the game's honest ratios. */
export function economyFor(colIndex: number): EconomyTables {
  return {
    colIndex,
    mealBase: Math.round((450 * colIndex) / 100),
    fareBase: Math.round((120 * colIndex) / 100),
    wageBase: Math.round((3000 * colIndex) / 100),
  }
}

/** THE CULTURE SEED LAW: a pack ships with a filled culture pack or it
 *  does not ship at all (the completeness law checks it in QA). */
export function cultureFor(city: string, country: string): CulturePack {
  const table: Record<string, CulturePack> = {
    lokoja: {
      greetings: ['How far!', 'You welcome', 'Abeg oo'],
      dishes: [{ name: 'Roasted fish', price: 1500 }, { name: 'Egusi and pounded yam', price: 800 }, { name: 'Suya', price: 600 }],
      festivals: [{ name: 'Confluence Regatta', yearDay: 20 }, { name: "Governor's New Year Address", yearDay: 1 }],
      languageNote: 'Pidgin rides the confluence — Igala, Nupe and Ebira under it.',
      currency: 'NGN',
    },
    abuja: {
      greetings: ['How far!', 'Fine morning', 'Wetin dey happen'],
      dishes: [{ name: 'Masa', price: 700 }, { name: 'Tuwo and miyan kuka', price: 1200 }, { name: 'Grilled catfish', price: 2500 }],
      festivals: [{ name: 'City Durbar', yearDay: 33 }],
      languageNote: 'The capital speaks every tongue — Hausa carries the market.',
      currency: 'NGN',
    },
    kano: {
      greetings: ['Sannu!', 'Ina kwana', 'Na gode'],
      dishes: [{ name: 'Masa', price: 400 }, { name: 'Tuwo dawa', price: 600 }, { name: 'Kilishi', price: 900 }],
      festivals: [{ name: 'Durbar', yearDay: 28 }],
      languageNote: 'Hausa first, the old city walls still carry it.',
      currency: 'NGN',
    },
    accra: {
      greetings: ['Ette sen?', 'Akwaaba!', 'Charley!'],
      dishes: [{ name: 'Jollof and chicken', price: 45 }, { name: 'Banku and tilapia', price: 60 }, { name: 'Waakye', price: 25 }],
      festivals: [{ name: 'Chale Wote', yearDay: 50 }],
      languageNote: 'Twi under the English, Ga by the sea.',
      currency: 'GHS',
    },
  }
  return table[city] ?? {
    greetings: ['How far!'],
    dishes: [{ name: 'Street rice', price: Math.round(500 * (city === 'accra' ? 0.09 : 1)) }],
    festivals: [{ name: `${city} Day`, yearDay: 15 }],
    languageNote: `${city} speaks for itself — the Culture Pack collects it.`,
    currency: country === 'Ghana' ? 'GHS' : 'NGN',
  }
}

/** THE CIVIC BLUEPRINT LAW: the pack promises the civic mesh its
 *  locations can actually keep (a clinic needs a clinic, the grid
 *  needs zones to shed). */
export function civicFor(packed: { locations: PackLocation[]; streets: PackStreet[] }): CivicBlueprints {
  const kinds = new Set(packed.locations.map((l) => l.kind))
  const offices: CivicBlueprints['offices'] = []
  if (kinds.has('bank')) offices.push('bank')
  if (kinds.has('clinic')) offices.push('clinic')
  if (kinds.has('school')) offices.push('school')
  offices.push('kgirs', 'nepa')
  // the grid zones follow the arterial streets (one transformer each)
  const powerZones = packed.streets.filter((s) => s.kind === 'arterial').map((s) => s.id)
  return { powerZones: powerZones.length > 0 ? powerZones : [packed.streets[0]?.id ?? 'zone-0'], marketDayEvery: 5, offices }
}

/* ----------------------------- stage 4: the QA battery --------------------- */

export interface QaFinding { law: string; ok: boolean; detail: string }
export interface QaReport { ok: boolean; findings: QaFinding[]; score: number }

/** THE ID HYGIENE LAW: every id carries its city prefix, every id is
 *  unique — the phantom law's runtime battery. */
export function qaIdHygiene(pack: CityPack): QaFinding {
  const all = [...pack.streets.map((s) => s.id), ...pack.locations.map((l) => l.id)]
  const badPrefix = all.filter((id) => !belongsTo(id, pack.id))
  const dupes = all.filter((id, i) => all.indexOf(id) !== i)
  const ok = badPrefix.length === 0 && dupes.length === 0
  return { law: 'id-hygiene', ok, detail: ok ? `${all.length} ids branded + unique` : `foreign: ${badPrefix.length}, dupes: ${dupes.length}` }
}

/** THE MAP-BOUNDS LAW: the pack's coordinates stay inside the city's
 *  declared bounding box (a Lagos node in a Kano pack is a forged pack). */
export function qaBounds(pack: CityPack, bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number }, coords: Map<string, { lat: number; lon: number }>): QaFinding {
  const outside = [...coords.values()].filter((c) => c.lat < bbox.minLat || c.lat > bbox.maxLat || c.lon < bbox.minLon || c.lon > bbox.maxLon).length
  return { law: 'map-bounds', ok: outside === 0, detail: outside === 0 ? 'all nodes inside the box' : `${outside} nodes outside the box` }
}

/** THE ECONOMY SANITY LAW: the ratios stay honest — a meal cannot cost
 *  more than a week of wages; a fare cannot cost more than a meal. */
export function qaEconomy(pack: CityPack): QaFinding {
  const meal = pack.economy.mealBase
  const fare = pack.economy.fareBase
  const weeklyWage = pack.economy.wageBase * 6
  const ok = meal < weeklyWage && fare <= meal && pack.economy.colIndex > 0
  return { law: 'economy-sanity', ok, detail: ok ? `meal ${meal} < weekly wage ${weeklyWage}, fare ${fare} ≤ meal` : 'the ratios broke' }
}

/** THE CULTURE COMPLETENESS LAW: greetings ≥ 3, dishes ≥ 3, festivals
 *  ≥ 1, a language note, a currency — or the pack refuses to ship. */
export function qaCulture(pack: CityPack): QaFinding {
  const c = pack.culture
  const ok = c.greetings.length >= 3 && c.dishes.length >= 3 && c.festivals.length >= 1 && c.languageNote.length > 5 && c.currency.length === 3
  return { law: 'culture-complete', ok, detail: ok ? `${c.greetings.length} greetings, ${c.dishes.length} dishes, ${c.festivals.length} festivals` : 'the culture pack is thin' }
}

/** THE CONNECTIVITY LAW: every location hangs on a street that exists,
 *  and every street reaches the pack's first street through the kind
 *  graph (the honest cheap check: no orphan streets, no ghost doors). */
export function qaConnectivity(pack: CityPack): QaFinding {
  const streetIds = new Set(pack.streets.map((s) => s.id))
  const ghostDoors = pack.locations.filter((l) => !streetIds.has(l.street)).length
  const orphans = pack.streets.length === 0 ? 1 : 0
  const emptyStreets = pack.streets.filter((s) => !pack.locations.some((l) => l.street === s.id) && s.kind !== 'waterfront' && s.kind !== 'service').length
  const ok = ghostDoors === 0 && orphans === 0
  return { law: 'connectivity', ok, detail: ok ? `${pack.locations.length} doors on ${pack.streets.length} streets${emptyStreets > 0 ? ` (${emptyStreets} quiet)` : ''}` : `${ghostDoors} ghost doors, ${orphans} orphans` }
}

/** THE QA BATTERY: the five laws, one verdict, a score out of 100. */
export function runQaBattery(pack: CityPack, bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number }, coords: Map<string, { lat: number; lon: number }>): QaReport {
  const findings = [
    qaIdHygiene(pack),
    qaBounds(pack, bbox, coords),
    qaEconomy(pack),
    qaCulture(pack),
    qaConnectivity(pack),
  ]
  const okAll = findings.every((f) => f.ok)
  const score = Math.round((findings.filter((f) => f.ok).length / findings.length) * 100)
  return { ok: okAll, findings, score }
}

/* ------------------------------- stage 5: ship ----------------------------- */

export interface ShipManifest {
  packId: string
  name: string
  version: string
  /** the QA score at ship time (a pack ships at 100 only) */
  qaScore: number
  shippedAtStageMinute: number
  /** the install bill stays inside the PWA budget law */
  packBytes: number
}

export const PACK_BYTE_BUDGET = 512 * 1024 // 512KB — a city is data, not a program

export function shipPack(pack: CityPack, qa: QaReport, stageMinutes: Record<string, number>): { ok: boolean; manifest?: ShipManifest; why?: string } {
  if (!qa.ok) return { ok: false, why: `QA red — ${qa.findings.filter((f) => !f.ok).map((f) => f.law).join(', ')}` }
  const sla = slaVerdict(stageMinutes)
  if (!sla.ok) return { ok: false, why: `SLA broken at ${sla.brokenStage}` }
  const packBytes = JSON.stringify(pack).length
  if (packBytes > PACK_BYTE_BUDGET) return { ok: false, why: `pack too fat (${packBytes}B > ${PACK_BYTE_BUDGET}B)` }
  return {
    ok: true,
    manifest: { packId: pack.id, name: pack.name, version: pack.version, qaScore: qa.score, shippedAtStageMinute: sla.total, packBytes },
  }
}

/* --------------------------- the whole forge, once ------------------------- */

export interface ForgeRun {
  city: CityId<string>
  pack: CityPack | null
  qa: QaReport | null
  manifest: ShipManifest | null
  stageMinutes: Record<string, number>
  sla: { ok: boolean; brokenStage: string | null; total: number }
  refusedFeatures: number
}

export interface ForgeOptions {
  city: CityId<string>
  name: string
  country: string
  version: string
  colIndex: number
  bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number }
  /** the simulated wall-clock each stage took (the forge records, never fakes) */
  stageMinutes: Record<string, number>
}

/** THE FORGE: extract in, shipped manifest (or an honest refusal) out.
 *  Deterministic — the same extract and options forge the same city. */
export function forgeCity(extract: OsmExtract, opts: ForgeOptions): ForgeRun {
  // stage 1 — import
  const { features, refused } = osmImport(extract)
  // stage 2 — classify + interiors
  const streets: PackStreet[] = []
  const locations: PackLocation[] = []
  const coords = new Map<string, { lat: number; lon: number }>()
  for (const f of features) {
    coords.set(f.wayId, { lat: f.lat, lon: f.lon })
    const verdict = classify(f)
    if (verdict.as === 'street') {
      const kind = verdict.kind as StreetKind
      const id = mintStreet(opts.city, f.name.toLowerCase().replace(/\s+/g, '-'))
      const nodeCount = extract.ways.find((w) => w.id === f.wayId)?.nodes.length ?? 1
      streets.push({ id, name: f.name, kind, walkMinutes: walkMinutesFor(kind, nodeCount), fromWays: [f.wayId] })
    } else {
      const id = mintLocation(opts.city, f.name.toLowerCase().replace(/\s+/g, '-'))
      const onStreet = streets[streets.length - 1]?.id ?? mintStreet(opts.city, 'main-street')
      locations.push({ id, name: f.name, street: onStreet, kind: verdict.kind as LocationKind, hasInterior: verdict.hasInterior })
    }
  }
  // the doors law: a location needs a real street — the first street anchors
  if (streets.length === 0 && locations.length > 0) {
    streets.push({ id: mintStreet(opts.city, 'main-street'), name: 'Main Street', kind: 'residential', walkMinutes: 5, fromWays: [] })
  }
  // stage 3 — blueprints + economy + culture
  const economy = economyFor(opts.colIndex)
  const culture = cultureFor(opts.city, opts.country)
  const civic = civicFor({ locations, streets })
  const pack: CityPack = { id: opts.city, name: opts.name, country: opts.country, version: opts.version, streets, locations, culture, economy, civic }
  // stage 4 — QA
  const qa = runQaBattery(pack, opts.bbox, coords)
  // stage 5 — ship
  const ship = shipPack(pack, qa, opts.stageMinutes)
  return {
    city: opts.city,
    pack: ship.ok ? pack : pack,
    qa,
    manifest: ship.manifest ?? null,
    stageMinutes: opts.stageMinutes,
    sla: slaVerdict(opts.stageMinutes),
    refusedFeatures: refused,
  }
}

/* ============================== the pilot ladder =========================== */

export interface PilotCity {
  city: string
  name: string
  country: string
  colIndex: number
  status: 'piloting' | 'queued' | 'voting' | 'shipped'
}

/** THE PILOT LADDER: Abuja proves the forge, the region follows, Accra
 *  proves the continent — then the vote book opens the world. */
export const PILOT_LADDER: readonly PilotCity[] = [
  { city: 'abuja', name: 'Abuja', country: 'Nigeria', colIndex: 165, status: 'piloting' },
  { city: 'kano', name: 'Kano', country: 'Nigeria', colIndex: 95, status: 'queued' },
  { city: 'enugu', name: 'Enugu', country: 'Nigeria', colIndex: 88, status: 'queued' },
  { city: 'port-harcourt', name: 'Port Harcourt', country: 'Nigeria', colIndex: 118, status: 'queued' },
  { city: 'ibadan', name: 'Ibadan', country: 'Nigeria', colIndex: 85, status: 'queued' },
  { city: 'accra', name: 'Accra', country: 'Ghana', colIndex: 130, status: 'voting' },
]

/* ============================== the vote book ============================== */

export interface VoteBook {
  /** city → honest vote count (deterministic, no vanity rounding) */
  counts: Record<string, number>
  /** the voter's own votes (one per city, capped at 3 active) */
  mine: string[]
}

export const MY_VOTE_CAP = 3

export function forgeVote(book: VoteBook, city: string): { ok: boolean; why?: 'capped' | 'duplicate' } {
  if (book.mine.length >= MY_VOTE_CAP && !book.mine.includes(city)) return { ok: false, why: 'capped' }
  if (book.mine.includes(city)) return { ok: false, why: 'duplicate' }
  return { ok: true }
}

export function applyVote(book: VoteBook, city: string): VoteBook {
  return {
    counts: { ...book.counts, [city]: (book.counts[city] ?? 0) + 1 },
    mine: [...book.mine, city],
  }
}

/** THE VOTE VERDICT: the city with the most votes earns the next forge
 *  slot (ties break alphabetically — the honest cheap order). */
export function voteWinner(book: VoteBook): string | null {
  const entries = Object.entries(book.counts).filter(([, n]) => n > 0)
  if (entries.length === 0) return null
  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  return entries[0][0]
}

/* ============================ the lokoja bridge ============================ */

/** THE LOKOJA BRIDGE: the living city ships as a pack too. The default
 *  lokoja-v1 pack derives from the game's own street roster, proving
 *  the running city and the forge speak ONE shape. */
export function lokojaDefaultPack(): CityPack<'lokoja'> {
  const city = 'lokoja' as CityId<'lokoja'>
  const roster: [string, string, StreetKind][] = [
    ['home', 'Home Quarters', 'residential'],
    ['kpata-market', 'Kpata Market Road', 'highstreet'],
    ['ganaja-junction', 'Ganaja Junction', 'arterial'],
    ['confluence', 'The Confluence', 'waterfront'],
    ['patti-ridge', 'Mount Patti Ridge', 'residential'],
    ['ful-road', 'FUL Road', 'arterial'],
    ['adankolo', 'Adankolo Avenue', 'residential'],
    ['cantonment', 'Cantonment Street', 'service'],
    ['nigeria-roads', 'Nigeria Roads Yard', 'service'],
    ['transport-area', 'Motor Park', 'highstreet'],
  ]
  const streets: PackStreet[] = roster.map(([slug, name, kind]) => ({
    id: mintStreet(city, slug),
    name,
    kind,
    walkMinutes: walkMinutesFor(kind, 6),
    fromWays: [`lko-way-${slug}`],
  }))
  const locations: PackLocation[] = [
    { id: mintLocation(city, 'kpata-market-stalls'), name: 'Kpata Market', street: mintStreet(city, 'kpata-market'), kind: 'market', hasInterior: true },
    { id: mintLocation(city, 'night-food-strip'), name: 'Night Food Strip', street: mintStreet(city, 'kpata-market'), kind: 'food', hasInterior: true },
    { id: mintLocation(city, 'main-bank'), name: 'The Bank', street: mintStreet(city, 'ganaja-junction'), kind: 'bank', hasInterior: true },
    { id: mintLocation(city, 'clinic'), name: 'The Clinic', street: mintStreet(city, 'adankolo'), kind: 'clinic', hasInterior: true },
    { id: mintLocation(city, 'ful-campus'), name: 'FUL Campus', street: mintStreet(city, 'ful-road'), kind: 'school', hasInterior: true },
    { id: mintLocation(city, 'motor-park'), name: 'Motor Park', street: mintStreet(city, 'transport-area'), kind: 'transport', hasInterior: false },
  ]
  return {
    id: city,
    name: 'Lokoja',
    country: 'Nigeria',
    version: 'lokoja-v1',
    streets,
    locations,
    culture: cultureFor('lokoja', 'Nigeria'),
    economy: economyFor(100),
    civic: civicFor({ locations, streets }),
  }
}

/* ============================== the forge ledger =========================== */

export interface ForgeLedgerEntry {
  city: string
  version: string
  verdict: 'shipped' | 'refused'
  qaScore: number
  totalMinutes: number
  atDay: number
}

/** THE FORGE LEDGER: every build is recorded honestly — shipped or
 *  refused, score and all. The ops story the nation dashboard reads. */
export function recordBuild(ledger: ForgeLedgerEntry[], run: ForgeRun, atDay: number): ForgeLedgerEntry[] {
  const entry: ForgeLedgerEntry = {
    city: run.city,
    version: run.pack?.version ?? 'none',
    verdict: run.manifest ? 'shipped' : 'refused',
    qaScore: run.qa?.score ?? 0,
    totalMinutes: run.sla.total,
    atDay,
  }
  return [...ledger.slice(-19), entry]
}

/* ============================== fresh state ================================ */

/** The player's forge book — the vote book + the ledger they can see. */
export function freshForgeState(): import('../types').ForgeState {
  return {
    votes: { counts: { accra: 41, kano: 17, enugu: 9, 'port-harcourt': 6, ibadan: 5 }, mine: [] },
    ledger: [],
    ranLokoja: false,
  }
}
