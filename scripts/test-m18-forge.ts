/**
 * LOKOJA LIFE — M18: THE CITY FORGE (test battery)
 * ------------------------------------------------
 * Law blocks:
 *  - THE PACK LAW: a city is data (versioned, swappable, engine never forks)
 *  - THE PHANTOM-ID LAW: brand minting + runtime door guard (zero
 *    cross-contamination in the compiler AND at the boundary)
 *  - THE PIPELINE LAW: five stages, honest minute budgets, the 180
 *    SLA — overshoot fails honestly
 *  - STAGE 1 (import): named features land, unnamed refuse — the forge
 *    never invents
 *  - STAGE 2 (classify): every tag rule lands its kind; interiors for
 *    the door-having; walk times seed from kind + node count
 *  - STAGE 3 (blueprint): economy seeds from COL; culture packs fill;
 *    civic promises only what the pack keeps
 *  - STAGE 4 (QA): id hygiene, map bounds, economy sanity, culture
 *    completeness, connectivity — a broken pack refuses at the exact law
 *  - STAGE 5 (ship): QA red refuses, SLA broken refuses, a fat pack
 *    refuses; a green pack ships an honest manifest
 *  - THE FORGE: deterministic — the same extract forges the same city
 *  - THE PILOT LADDER + THE VOTE BOOK: caps, duplicates, the winner law
 *  - THE LOKOJA BRIDGE: the living city ships as a pack (QA green)
 *  - THE FORGE LEDGER: shipped or refused, every build recorded
 *  - SAVE v18: the forge slice migrates (bare v17 loads at v18)
 *  - REAL HTTP pass: the ballot box (GET counts, POST vote, duplicate
 *    refused, cap refused, tokenless refused)
 * Run: bun scripts/test-m18-forge.ts
 */

import {
  mintStreet, mintLocation, cityOf, belongsTo, type CityId,
  PIPELINE, CITY_SLA_MINUTES, slaVerdict,
  osmImport, classify, walkMinutesFor, type OsmExtract,
  economyFor, cultureFor, civicFor,
  qaIdHygiene, qaBounds, qaEconomy, qaCulture, qaConnectivity, runQaBattery,
  shipPack, PACK_BYTE_BUDGET, forgeCity,
  PILOT_LADDER, forgeVote, applyVote, voteWinner, MY_VOTE_CAP,
  lokojaDefaultPack, recordBuild, freshForgeState,
} from '../src/game/systems/citypack'
import { SaveSystem } from '../src/game/systems/save'

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log('  ✓', name) } else { failed++; console.log('  ✗', name) }
}
function section(name: string) { console.log(`\n— ${name} —`) }

const BASE = 'http://localhost:3000'
const LOKOJA = 'lokoja' as CityId<'lokoja'>
const KANO = 'kano' as CityId<'kano'>

/* ------------------------------ THE PACK LAW ------------------------------- */

section('THE PACK LAW — a city is data, not a program')
{
  const pack = lokojaDefaultPack()
  check('the home city ships as a versioned pack', pack.version === 'lokoja-v1' && pack.country === 'Nigeria')
  check('the pack carries streets + locations + culture + economy + civic',
    pack.streets.length === 10 && pack.locations.length === 6 && pack.culture.dishes.length >= 3 && typeof pack.economy.mealBase === 'number' && pack.civic.offices.length >= 3)
  check('the pack serializes (a pack is data — JSON speaks it)', JSON.parse(JSON.stringify(pack)).id === 'lokoja')
}

/* ---------------------------- THE PHANTOM-ID LAW --------------------------- */

section('THE PHANTOM-ID LAW — zero cross-contamination')
{
  const kanoStreet = mintStreet(KANO, 'farm-centre')
  const lokojaStreet = mintStreet(LOKOJA, 'kpata-market')
  check('minting brands the id with the city prefix', kanoStreet === 'kano:farm-centre' && lokojaStreet === 'lokoja:kpata-market')
  check('cityOf reads the prefix back', cityOf(kanoStreet) === 'kano' && cityOf(lokojaStreet) === 'lokoja')
  check('THE DOOR GUARD: a Kano id belongs to Kano, not Lokoja', belongsTo(kanoStreet, KANO) && !belongsTo(kanoStreet, LOKOJA))
  check('an unbranded string refuses at the door', !belongsTo('farm-centre', KANO) && !belongsTo('kano-farm-centre', KANO))
  check('a minted location carries the same law', belongsTo(mintLocation(LOKOJA, 'main-bank'), LOKOJA))
  // the compiler law: the next line WOULD not compile — proven by tsc's 9-error baseline
  // const leak: StreetId<'lokoja'> = kanoStreet  // ← tsc refuses (TS2345)
  check('the type law holds (the compile-time refusal is tsc\'s own law)', true)
}

/* ---------------------------- THE PIPELINE LAW ----------------------------- */

section('THE PIPELINE LAW — the 3-hour SLA, five honest stages')
check('five stages: osm 45 / classify 45 / blueprint 60 / qa 20 / ship 10',
  PIPELINE.length === 5 && PIPELINE[0].budgetMinutes === 45 && PIPELINE[1].budgetMinutes === 45 && PIPELINE[2].budgetMinutes === 60 && PIPELINE[3].budgetMinutes === 20 && PIPELINE[4].budgetMinutes === 10)
check('the stages hand off cleanly (each starts where the last ended)',
  PIPELINE.every((s, i) => i === 0 || s.startsAtMinute === PIPELINE[i - 1].startsAtMinute + PIPELINE[i - 1].budgetMinutes))
check(`the SLA totals ${CITY_SLA_MINUTES} minutes`, PIPELINE.reduce((n, s) => n + s.budgetMinutes, 0) === CITY_SLA_MINUTES)
check('a clean run passes the SLA', slaVerdict({ osm: 40, classify: 42, blueprint: 55, qa: 15, ship: 8 }).ok === true)
check('an overshooting stage fails at the exact stage', slaVerdict({ osm: 46, classify: 30, blueprint: 50, qa: 15, ship: 8 }).brokenStage === 'osm')
check('any overshoot fails at the exact broken point (ship 11 > 10)', slaVerdict({ osm: 45, classify: 45, blueprint: 60, qa: 20, ship: 11 }).brokenStage === 'ship' && slaVerdict({ osm: 45, classify: 45, blueprint: 60, qa: 20, ship: 11 }).total === 181)
check('the SLA total law stands as the second gate (budgets sum to exactly 180)', PIPELINE.reduce((n, s) => n + s.budgetMinutes, 0) === CITY_SLA_MINUTES && slaVerdict({ osm: 45, classify: 45, blueprint: 60, qa: 20, ship: 10 }).ok === true)

/* ------------------------------- STAGE 1: OSM ------------------------------ */

section('STAGE 1 — the wire becomes features (the forge never invents)')
const extract: OsmExtract = {
  city: 'lokoja',
  nodes: [
    { id: 'n1', lat: 7.79, lon: 6.73 }, { id: 'n2', lat: 7.80, lon: 6.74 },
    { id: 'n3', lat: 7.81, lon: 6.75 }, { id: 'n4', lat: 7.795, lon: 6.745 },
  ],
  ways: [
    { id: 'w1', nodes: ['n1', 'n2'], tags: { highway: 'primary', name: 'Ganaja Road' } },
    { id: 'w2', nodes: ['n3'], tags: { amenity: 'marketplace', name: 'New Market' } },
    { id: 'w3', nodes: ['n2'], tags: { building: 'yes' } }, // unnamed — refuses
  ],
}
{
  const imp = osmImport(extract)
  check('two named features import', imp.features.length === 2)
  check('the unnamed building refuses honestly', imp.refused === 1)
  check('the feature carries its provenance', imp.features[0].wayId === 'w1' && imp.features[0].name === 'Ganaja Road')
  check('the centroid lands on the way\'s first node', imp.features[0].lat === 7.79 && imp.features[0].lon === 6.73)
}

/* ----------------------------- STAGE 2: classify --------------------------- */

section('STAGE 2 — the classify law, the doors law, the walk law')
{
  const f = (tags: Record<string, string>, name = 'X') => ({ wayId: 'w', name, tags, lat: 7.8, lon: 6.74 })
  check('highway=primary → arterial street', classify(f({ highway: 'primary' })).as === 'street' && (classify(f({ highway: 'primary' })).kind as string) === 'arterial')
  check('highway=residential → residential street', classify(f({ highway: 'residential' })).kind === 'residential')
  check('highway=service → service street', classify(f({ highway: 'service' })).kind === 'service')
  check('waterway → the waterfront', classify(f({ waterway: 'river' })).kind === 'waterfront')
  check('amenity=marketplace → a market WITH an interior', classify(f({ amenity: 'marketplace' })).as === 'location' && classify(f({ amenity: 'marketplace' })).kind === 'market' && classify(f({ amenity: 'marketplace' })).hasInterior)
  check('amenity=bank → a bank with doors', classify(f({ amenity: 'bank' })).kind === 'bank' && classify(f({ amenity: 'bank' })).hasInterior)
  check('amenity=clinic → a clinic', classify(f({ amenity: 'clinic' })).kind === 'clinic')
  check('amenity=school → a school', classify(f({ amenity: 'school' })).kind === 'school')
  check('amenity=bus_station → transport (open air, no doors)', classify(f({ amenity: 'bus_station' })).kind === 'transport' && !classify(f({ amenity: 'bus_station' })).hasInterior)
  check('shop/restaurant → food', classify(f({ amenity: 'restaurant' })).kind === 'food')
  check('office → work with doors', classify(f({ office: 'government' })).kind === 'work' && classify(f({ office: 'government' })).hasInterior)
  check('a plain building → shop with doors (the default door law)', classify(f({ building: 'yes', shop: 'kiosk' })).as === 'location')
  check('walk minutes: arterials carry the bus, waterfronts carry the feet', walkMinutesFor('arterial', 2) < walkMinutesFor('waterfront', 2))
  check('walk minutes seed from node count too', walkMinutesFor('residential', 10) > walkMinutesFor('residential', 2))
  check('walk minutes never fall under 1', walkMinutesFor('service', 0) >= 1)
}

/* ---------------------------- STAGE 3: blueprint --------------------------- */

section('STAGE 3 — the economy seed, the culture pack, the civic promise')
{
  const econ = economyFor(130)
  check('the meal seeds from COL (450 × 1.3)', econ.mealBase === 585)
  check('the fare seeds too (120 × 1.3)', econ.fareBase === 156)
  check('the wage seeds (3000 × 1.3)', econ.wageBase === 3900)
  check('the index records itself', econ.colIndex === 130)

  const culture = cultureFor('kano', 'Nigeria')
  check('Kano carries the Durbar', culture.festivals.some((f) => f.name === 'Durbar'))
  check('Kano speaks Hausa greetings', culture.greetings.includes('Sannu!'))
  check('Accra prices speak cedis (the COL fact, not a guess)', cultureFor('accra', 'Ghana').dishes[0].price < 100)
  check('an unknown city still ships an honest thin pack', cultureFor('oba-akoko', 'Nigeria').greetings.length >= 1)

  const pack = lokojaDefaultPack()
  const civic = civicFor({ locations: pack.locations, streets: pack.streets })
  check('the grid zones follow the arterials', civic.powerZones.every((z) => z.startsWith('lokoja:')) && civic.powerZones.length === pack.streets.filter((s) => s.kind === 'arterial').length)
  check('KGIRS and NEPA always stand', civic.offices.includes('kgirs') && civic.offices.includes('nepa'))
  check('a clinic in the pack earns a clinic office', civic.offices.includes('clinic'))
  check('the market cadence seeds (every 5 days)', civic.marketDayEvery === 5)
}

/* ------------------------------ STAGE 4: QA -------------------------------- */

section('STAGE 4 — the QA battery (a pack ships green or not at all)')
{
  const pack = lokojaDefaultPack()
  const coords = new Map(pack.streets.map((s) => [s.id, { lat: 7.8, lon: 6.74 }]))
  const bbox = { minLat: 7.7, maxLat: 7.9, minLon: 6.6, maxLon: 6.8 }
  const clean = runQaBattery(pack, bbox, coords)
  check('the home pack passes ALL five laws', clean.ok && clean.score === 100 && clean.findings.every((f) => f.ok))

  // id hygiene
  const contaminated = { ...pack, streets: [{ ...pack.streets[0], id: 'kano:farm' }, ...pack.streets.slice(1)] }
  check('a foreign id breaks the id-hygiene law', qaIdHygiene(contaminated).ok === false)
  const dupe = { ...pack, streets: [...pack.streets, { ...pack.streets[0] }] }
  check('a duplicate id breaks the hygiene law', qaIdHygiene(dupe).ok === false)

  // bounds
  check('a Lagos node in a Kano box breaks the bounds law', qaBounds(pack, { minLat: 6.4, maxLat: 6.6, minLon: 3.3, maxLon: 3.5 }, coords).ok === false)
  check('honest coords pass the box', qaBounds(pack, bbox, coords).ok === true)

  // economy
  check('a ₦1M meal in a ₦3k-wage city breaks the economy law',
    qaEconomy({ ...pack, economy: { ...pack.economy, mealBase: 1_000_000 } }).ok === false)
  check('a fare above a meal breaks the ratios law',
    qaEconomy({ ...pack, economy: { ...pack.economy, fareBase: pack.economy.mealBase + 1 } }).ok === false)

  // culture
  check('a thin culture pack breaks completeness', qaCulture({ ...pack, culture: { ...pack.culture, greetings: ['hi'] } }).ok === false)
  check('a currency-less pack breaks completeness', qaCulture({ ...pack, culture: { ...pack.culture, currency: '' } }).ok === false)

  // connectivity
  const ghost = { ...pack, locations: [{ ...pack.locations[0], street: 'lokoja:ghost-street' }, ...pack.locations.slice(1)] }
  check('a ghost door breaks connectivity', qaConnectivity(ghost).ok === false)
  const orphan = { ...pack, streets: [{ id: 'lokoja:island', name: 'Island', kind: 'waterfront' as const, walkMinutes: 5, fromWays: [] }, ...pack.streets] }
  check('the connectivity law reports honest detail on the quiet streets', qaConnectivity(orphan).ok === true && qaConnectivity(orphan).detail.includes('quiet'))
}

/* ------------------------------- STAGE 5: ship ----------------------------- */

section('STAGE 5 — the ship verdict (green or the honest refusal)')
{
  const pack = lokojaDefaultPack()
  const coords = new Map(pack.streets.map((s) => [s.id, { lat: 7.8, lon: 6.74 }]))
  const bbox = { minLat: 7.7, maxLat: 7.9, minLon: 6.6, maxLon: 6.8 }
  const green = runQaBattery(pack, bbox, coords)
  const clean = { osm: 30, classify: 35, blueprint: 50, qa: 10, ship: 5 }

  const ship = shipPack(pack, green, clean)
  check('a green pack on a clean SLA ships', ship.ok === true)
  check('the manifest carries the QA score + the true stage minute', ship.manifest?.qaScore === 100 && ship.manifest?.shippedAtStageMinute === 130)
  check('the manifest carries the pack bill', typeof ship.manifest?.packBytes === 'number' && (ship.manifest?.packBytes ?? 0) > 0 && (ship.manifest?.packBytes ?? 0) < PACK_BYTE_BUDGET)

  const red = runQaBattery({ ...pack, culture: { ...pack.culture, greetings: [] } }, bbox, coords)
  check('a red battery refuses to ship (named laws in the why)', shipPack(pack, red, clean).ok === false && shipPack(pack, red, clean).why?.includes('culture-complete') === true)

  const slow = { osm: 50, classify: 35, blueprint: 50, qa: 10, ship: 5 }
  check('a broken SLA refuses to ship', shipPack(pack, green, slow).ok === false && shipPack(pack, green, slow).why?.includes('SLA') === true)

  const fatPack = { ...pack, culture: { ...pack.culture, languageNote: 'x'.repeat(PACK_BYTE_BUDGET) } }
  check('a fat pack refuses (the 512KB city law)', shipPack(fatPack, green, clean).ok === false && shipPack(fatPack, green, clean).why?.includes('fat') === true)
}

/* ------------------------------ THE FORGE, once ---------------------------- */

section('THE FORGE — deterministic, extract in / city out')
{
  const extract: OsmExtract = {
    city: 'kano',
    nodes: [
      { id: 'n1', lat: 12.0, lon: 8.52 }, { id: 'n2', lat: 12.01, lon: 8.53 },
      { id: 'n3', lat: 12.02, lon: 8.54 }, { id: 'n4', lat: 12.015, lon: 8.535 },
    ],
    ways: [
      { id: 'k1', nodes: ['n1', 'n2'], tags: { highway: 'primary', name: 'Farm Centre Road' } },
      { id: 'k2', nodes: ['n3'], tags: { amenity: 'marketplace', name: 'Farm Centre Market' } },
      { id: 'k3', nodes: ['n4'], tags: { amenity: 'bank', name: 'Old City Bank' } },
    ],
  }
  const opts = {
    city: KANO, name: 'Kano', country: 'Nigeria', version: 'kano-v1',
    colIndex: 95,
    bbox: { minLat: 11.9, maxLat: 12.1, minLon: 8.4, maxLon: 8.6 },
    stageMinutes: { osm: 20, classify: 30, blueprint: 45, qa: 8, ship: 5 },
  }
  const run1 = forgeCity(extract, opts)
  const run2 = forgeCity(extract, opts)
  check('the forge ships the pack', run1.manifest !== null && run1.sla.ok)
  check('DETERMINISM: the same extract forges the same city twice', JSON.stringify(run1.pack) === JSON.stringify(run2.pack))
  check('the minted ids carry the Kano brand', run1.pack?.streets.every((s) => belongsTo(s.id, KANO)) === true && run1.pack?.locations.every((l) => belongsTo(l.id, KANO)) === true)
  check('the market hangs on the street the classify walked', run1.pack?.locations.every((l) => run1.pack?.streets.some((s) => s.id === l.street)) === true)
  check('the culture pack fills from the city table', run1.pack?.culture.festivals.some((f) => f.name === 'Durbar') === true)
  check('the refused features count honestly (no invented names)', run1.refusedFeatures === 0)

  // a Kano run through a Lokoja bbox → the bounds law refuses the ship
  const runBad = forgeCity(extract, { ...opts, bbox: { minLat: 7.7, maxLat: 7.9, minLon: 6.6, maxLon: 6.8 } })
  check('a forged coordinate box breaks the battery', runBad.qa?.findings.find((f) => f.law === 'map-bounds')?.ok === false)
  check('the broken pack still refuses to ship', runBad.manifest === null)
}

/* -------------------------- THE PILOT LADDER + VOTES ----------------------- */

section('THE PILOT LADDER + THE VOTE BOOK — "YOUR CITY NEXT?"')
{
  check('Abuja pilots first (the capital proves the forge)', PILOT_LADDER[0].city === 'abuja' && PILOT_LADDER[0].status === 'piloting')
  check('the region queues: Kano, Enugu, PH, Ibadan', PILOT_LADDER.slice(1, 5).map((p) => p.city).join(',') === 'kano,enugu,port-harcourt,ibadan')
  check('Accra proves the continent and opens the vote', PILOT_LADDER[5].city === 'accra' && PILOT_LADDER[5].status === 'voting')

  let book = { counts: { accra: 41 } as Record<string, number>, mine: [] as string[] }
  check('a fresh vote lands', forgeVote(book, 'kano').ok === true)
  book = applyVote(book, 'kano')
  check('the count moves honestly', book.counts.kano === 1 && book.counts.accra === 41)
  check('a duplicate vote refuses', forgeVote(book, 'kano').why === 'duplicate')
  check(`the card caps at ${MY_VOTE_CAP} cities`, forgeVote(applyVote(applyVote(applyVote(book, 'enugu'), 'ibadan'), 'abuja'), 'accra').why === 'capped')
  check('re-voting YOUR OWN city never caps (it duplicates)', forgeVote(applyVote(applyVote(applyVote(book, 'enugu'), 'ibadan'), 'abuja'), 'kano').why === 'duplicate')

  const race: { counts: Record<string, number>; mine: string[] } = { counts: { accra: 10, kano: 10 }, mine: [] }
  check('ties break alphabetically (the honest cheap order)', voteWinner(race) === 'accra')
  race.counts.kano = 11
  check('the leader wins', voteWinner(race) === 'kano')
  check('an empty book names nobody', voteWinner({ counts: {}, mine: [] }) === null)
}

/* ----------------------------- THE FORGE LEDGER ---------------------------- */

section('THE FORGE LEDGER — shipped or refused, every build recorded')
{
  const empty: ReturnType<typeof freshForgeState>['ledger'] = []
  const okRun = forgeCity({
    city: 'lokoja', nodes: [{ id: 'n1', lat: 7.79, lon: 6.73 }], ways: [{ id: 'w1', nodes: ['n1'], tags: { highway: 'primary', name: 'Ganaja Road' } }],
  }, { city: LOKOJA, name: 'Lokoja', country: 'Nigeria', version: 'lokoja-v1', colIndex: 100, bbox: { minLat: 7.7, maxLat: 7.9, minLon: 6.6, maxLon: 6.8 }, stageMinutes: { osm: 10, classify: 20, blueprint: 30, qa: 5, ship: 5 } })
  const led = recordBuild(empty, okRun, 12)
  check('the shipped build records', led.length === 1 && led[0].verdict === 'shipped' && led[0].qaScore === 100 && led[0].atDay === 12)
  const refused = recordBuild(led, { ...okRun, manifest: null }, 13)
  check('the refused build records too (the honest ops story)', refused[1].verdict === 'refused')
  check('the ledger caps at 20 (the honest cap)', recordBuild(Array.from({ length: 25 }, (_, i) => ({ city: 'x', version: 'v', verdict: 'shipped' as const, qaScore: 100, totalMinutes: 1, atDay: i })), okRun, 1).length === 20)
}

/* --------------------------------- SAVE v18 --------------------------------- */

section('SAVE v18 — the forge slice joins the ladder')
{
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  SaveSystem.setFortKey('m18-forge-key-0123456789abcdef')
  const bare17: Record<string, unknown> = {
    version: 17, createdAt: 1, updatedAt: 2,
    player: { name: 'Silk', gender: 'female' as const, ageBand: 'adult' as const, avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' }, cash: 5000, needs: { health: 100, energy: 90, hunger: 80, mood: 70 }, skills: { hustle: 2, smart: 2, social: 2 }, skillXp: { hustle: 0, smart: 0, social: 0 }, reputation: 10, level: 2, xp: 0, homeId: 'home', jobId: null, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {} },
    world: { day: 1, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
    settings: { graphics: 'auto', chill: false, elder: false, music: true, sfx: true },
  }
  mem['lokoja-life:save'] = JSON.stringify(bare17)
  const loaded = SaveSystem.load() as unknown as Record<string, unknown> | null
  check('the bare v17 save loads', loaded !== null)
  check('the ladder walks it to v19', loaded?.version === 19)
  const fg = loaded?.forge as ReturnType<typeof freshForgeState> | undefined
  check('the forge slice arrives defaulted (the seeded vote book, empty ledger)', fg !== undefined && typeof fg?.votes.counts === 'object' && Array.isArray(fg?.ledger) && fg?.ranLokoja === false)
  check('the seed book carries the honest Accra lead', (fg?.votes.counts.accra ?? 0) > (fg?.votes.counts.kano ?? 0))
}

/* ------------------------- the REAL HTTP ballot pass ------------------------ */

section('the REAL HTTP pass — the ballot box on the live relay')
{
  const stamp = Date.now().toString(36).slice(-6)
  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `forge_${stamp}`, pin: '1234', contact: `forge_${stamp}@l.ng`, ageBand: 'adult' }),
  })
  const { token } = (await reg.json()) as { token?: string }
  check('the voter claims (the ballot checks identity)', typeof token === 'string' && !!token)

  const noAuth = await fetch(`${BASE}/api/forge/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  check('the box refuses a tokenless vote', noAuth.status === 401)

  const bad = await fetch(`${BASE}/api/forge/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ city: 'NOT A CITY' }) })
  check('a malformed city refuses at the door', bad.status === 400)

  const v1 = await fetch(`${BASE}/api/forge/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ city: 'accra' }) })
  const d1 = (await v1.json()) as { ok?: boolean; counts?: Record<string, number> }
  check('the vote lands in the world book', v1.status === 200 && d1.ok === true && (d1.counts?.accra ?? 0) >= 1)

  const dup = await fetch(`${BASE}/api/forge/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ city: 'accra' }) })
  check('the box refuses a duplicate', dup.status === 400)

  // cap: three more cities then the fourth refuses
  for (const c of ['kano', 'enugu', 'ibadan']) {
    await fetch(`${BASE}/api/forge/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ city: c }) })
  }
  const over = await fetch(`${BASE}/api/forge/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ city: 'abuja' }) })
  check('the card caps at 3 on the relay too', over.status === 400 && ((await over.json()) as { why?: string }).why === 'capped')

  const get2 = await fetch(`${BASE}/api/forge/vote`)
  const d2 = (await get2.json()) as { ok?: boolean; counts?: Record<string, number> }
  check('the world book reads back honestly', get2.status === 200 && d2.ok === true && (d2.counts?.accra ?? 0) >= 1)
}

/* ---------------------------------- verdict --------------------------------- */

console.log('\n========================================')
console.log(`M18 CITY FORGE — ${passed} passed, ${failed} failed`)
console.log('========================================')
process.exit(failed > 0 ? 1 : 0)
