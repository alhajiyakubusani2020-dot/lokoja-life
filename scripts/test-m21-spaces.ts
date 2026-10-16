import "./geo/bootstrap"
/**
 * G2-SPACES — THE SPACES BREADTH LAW SUITE
 * ------------------------------------------
 * Run: bun scripts/test-m21-spaces.ts
 *
 * The laws under test:
 *  - THE GEO-EVIDENCE LAW: every new location's NAME literally exists in the
 *    repo's real geo data — re-grepped from the files at test time, so the
 *    proof lives in the suite, not in a comment.
 *  - THE ROSTER LAW: 10 launch + 12 schools + 10 G2 spaces = 32 entries, all
 *    first-class LokojaLocations with honest fields.
 *  - THE PIN LAW: every pin inside the 0–100 canvas, and NO two pins closer
 *    than 6 grid units — the map never overlaps.
 *  - THE DISTRICT LAW: every CHAOS_ZONE_IDS zone is claimed — by a G2 entry's
 *    `district`, or by its own launch row (the ten launch ids ARE the zones).
 *  - THE REAL-DOOR LAW: every 'spend'/'earn'/'needs' action names a door that
 *    actually exists on the live store surface. NO FAKE MUTATIONS.
 *  - THE VIBE LAW: every location gets 3–5 rotating scene lines, original.
 *  - THE INTERIOR LAW: the G2 interiors conform to the exported InteriorDef
 *    schema, spawn/clamp like the rest, and are BFS-pathable from spawn to
 *    EVERY hotspot and action — while staying OUT of the door-pinned
 *    INTERIORS array (one door per entry there, per test-world3d.ts).
 *  - THE WIRING LAW: LocationSheet renders the board + vibe; LocationArt
 *    carries an honest art mapping for the new ids.
 */

/* ------------------------------ the storage shim ---------------------------- */
// mirrors the browser surface before any store/save module loads (house style)
const mem = new Map<string, string>()
;(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
    setItem: (k: string, v: string) => void mem.set(k, String(v)),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => void mem.clear(),
  },
  navigator: { onLine: true },
}
;(globalThis as unknown as { localStorage: unknown }).localStorage = (
  globalThis as unknown as { window: { localStorage: unknown } }
).window.localStorage

/* ------------------------------- the imports -------------------------------- */

import { readFileSync } from 'node:fs'
import { LOCATIONS, LOCATION_BY_ID } from '../src/game/data/locations'
import type { LokojaLocation } from '../src/game/data/locations'
import { CHAOS_ZONE_IDS } from '../src/game/systems/chaos'
import { LOC_ACTIONS } from '../src/game/data/locActions'
import { LOC_VIBES } from '../src/game/data/locVibes'
import type { LocAction } from '../src/game/data/locActions'
import {
  INTERIORS,
  INTERIOR_BY_ID,
  interiorColliders,
  resolveInteriorPosition,
  FURN_FOOTPRINT,
  INTERIOR_PLAYER_RADIUS,
} from '../src/game/world3d/interiors'
import { DISTRICT_INTERIORS } from '../src/game/world3d/interiors'
import type { InteriorDef } from '../src/game/world3d/interiors'
import { useGameStore } from '../src/game/store/useGameStore'

/* ------------------------------ the harness --------------------------------- */

let passed = 0
let failed = 0
function check(name: string, cond: boolean, extra = '') {
  if (cond) { passed++; console.log('  ✓', name) } else { failed++; console.log('  ✗', name, extra) }
}
function section(name: string) { console.log(`\n— ${name} —`) }

/* --------------------------- 1. THE GEO-EVIDENCE LAW ------------------------ */

section('G2 · the geo-evidence law (re-grepped from the repo files, live)')

const G2_EVIDENCE: { id: string; name: string; file: string; needle: string }[] = [
  { id: 'adankolo', name: 'Adankolo', file: 'scripts/geo/network.json', needle: '"name": "Adankolo"' },
  { id: 'emiwoziri', name: 'Emiwoziri', file: 'scripts/geo/network.json', needle: '"name": "Emiwoziri"' },
  { id: 'filele', name: 'Filele', file: 'scripts/geo/network.json', needle: '"name": "Filele"' },
  { id: 'numai', name: 'Numai', file: 'scripts/geo/network.json', needle: '"name": "Numai"' },
  { id: 'kpatakpoli', name: 'Kpatakpoli', file: 'scripts/geo/network.json', needle: '"name": "Kpatakpoli"' },
  { id: 'kpato', name: 'Kpato', file: 'scripts/geo/network.json', needle: '"name": "Kpato"' },
  { id: 'township-stadium', name: 'Township Stadium', file: 'src/components/game/world/CityMesh.tsx', needle: 'Township Stadium' },
  // the same real facility, corroborated by the OSM tiles
  { id: 'township-stadium', name: 'Township Stadium', file: 'scripts/geo/tiles/t_0_2.osm', needle: 'Lokoja International Stadium' },
  // the tile spells it with a STRAIGHT apostrophe — the needle is byte-exact
  { id: 'maigari-palace', name: "Maigari's Palace", file: 'scripts/geo/tiles/t_1_2d.osm', needle: "Maigari's Palace" },
  { id: 'pati-ridge-hill', name: 'Pati Ridge Hill', file: 'scripts/geo/tiles/t_0_2.osm', needle: 'Pati Ridge Hill' },
  { id: 'sokamms-motel', name: 'Sokamms Global Motel', file: 'scripts/geo/tiles/t_1_0.osm', needle: 'Sokamms Global Motel' },
]

for (const ev of G2_EVIDENCE) {
  let ok = false
  try {
    ok = readFileSync(ev.file, 'utf8').includes(ev.needle)
  } catch {
    ok = false
  }
  check(`${ev.name} ← "${ev.file}" contains "${ev.needle}"`, ok)
}
// the row itself must carry the evidenced name, byte for byte
for (const ev of G2_EVIDENCE) {
  const loc = LOCATION_BY_ID[ev.id]
  check(`${ev.id} location row carries the evidenced name`, !!loc && loc.name === ev.name)
}

/* ------------------------------ 2. THE ROSTER LAW --------------------------- */

section('G2 · the roster law (append-only, all fields honest)')

const LAUNCH_IDS = CHAOS_ZONE_IDS as readonly string[]
const isG2 = (l: LokojaLocation) => l.id in { adankolo: 1, emiwoziri: 1, filele: 1, numai: 1, kpatakpoli: 1, kpato: 1, 'township-stadium': 1, 'maigari-palace': 1, 'pati-ridge-hill': 1, 'sokamms-motel': 1 }
const G2_IDS = ['adankolo', 'emiwoziri', 'filele', 'numai', 'kpatakpoli', 'kpato', 'township-stadium', 'maigari-palace', 'pati-ridge-hill', 'sokamms-motel']

check('the roster stands at 10 launch + 12 schools + 10 G2 = 32', LOCATIONS.length === 32, `got ${LOCATIONS.length}`)
check('location ids are unique', new Set(LOCATIONS.map((l) => l.id)).size === LOCATIONS.length)
check('every G2 id registered in LOCATION_BY_ID', G2_IDS.every((id) => LOCATION_BY_ID[id] !== undefined))
check('the ten launch rows keep their exact identity', LAUNCH_IDS.every((id) => !!LOCATION_BY_ID[id]))

// the TransportId union, re-read from types.ts at test time (never drifted)
const typesSrc = readFileSync('src/game/types.ts', 'utf8')
const transportUnion = (typesSrc.match(/export type TransportId = ([^\n]+)/)?.[1] ?? '').match(/'([a-z-]+)'/g)?.map((s) => s.slice(1, -1)) ?? []
check('TransportId union parsed from types.ts', transportUnion.length === 7, JSON.stringify(transportUnion))

const NEEDS_KEYS = ['health', 'energy', 'hunger', 'mood'] as const

for (const l of LOCATIONS) {
  const g2 = G2_IDS.includes(l.id)
  const fieldsOk =
    typeof l.name === 'string' && l.name.length > 1 &&
    typeof l.shortName === 'string' && l.shortName.length > 0 &&
    typeof l.tagline === 'string' && l.tagline.length > 3 &&
    typeof l.description === 'string' && l.description.length > 30 &&
    typeof l.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(l.color) &&
    typeof l.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(l.accent) &&
    typeof l.emoji === 'string' && l.emoji.length > 0 &&
    typeof l.mapX === 'number' && typeof l.mapY === 'number' &&
    Array.isArray(l.transport) && l.transport.length > 0 &&
    typeof l.travelModifier === 'number' &&
    Array.isArray(l.activities)
  check(`${l.id}: every LokojaLocation field present + honest`, fieldsOk)
  if (!fieldsOk) continue
  check(`${l.id}: transport ⊆ the REAL TransportId union`, l.transport.every((t) => transportUnion.includes(t)))
  check(`${l.id}: travelModifier 0.8–1.6 (terrain-honest)`, l.travelModifier >= 0.8 && l.travelModifier <= 1.6)
  check(`${l.id}: unlockLevel is a positive integer`, Number.isInteger(l.unlockLevel) && l.unlockLevel >= 1)
  check(
    `${l.id}: 2–4 activities, unique keys, staged`,
    l.activities.length >= 2 && l.activities.length <= 4 &&
      new Set(l.activities.map((a) => a.key)).size === l.activities.length &&
      l.activities.every((a) => a.label.length > 2 && a.stage >= 1),
  )
  if (g2) {
    check(`${l.id}: G2 entry claims a REAL chaos zone via district`, typeof l.district === 'string' && (CHAOS_ZONE_IDS as readonly string[]).includes(l.district))
    // the 1–2 unlock law binds NEW entries (the mission law); the launch
    // ten + schools carry their shipped unlock levels (GRA=3, FUL=3…)
    check(`${l.id}: NEW entry unlockLevel 1–2`, l.unlockLevel >= 1 && l.unlockLevel <= 2)
  }
}

/* ------------------------------- 3. THE PIN LAW ----------------------------- */

section('G2 · the pin law (canvas bounds + no NEW overlap, all 32 pins)')

check('every pin inside the 0–100 canvas (1..99)', LOCATIONS.every((l) => l.mapX > 1 && l.mapX < 99 && l.mapY > 1 && l.mapY < 99))

// THE G2 PIN LAW: every NEW pin sits ≥6 grid units from EVERY other pin —
// the map's new density is paid for by the new entries, never by the ones
// that shipped before them.
let g2Overlaps = 0
const legacyPairs: string[] = []
for (let i = 0; i < LOCATIONS.length; i++) {
  for (let j = i + 1; j < LOCATIONS.length; j++) {
    const a = LOCATIONS[i]
    const b = LOCATIONS[j]
    const d = Math.hypot(a.mapX - b.mapX, a.mapY - b.mapY)
    if (d >= 6) continue
    if (G2_IDS.includes(a.id) || G2_IDS.includes(b.id)) {
      g2Overlaps++
      console.log(`    ✗ NEW-pin overlap ${a.id} ↔ ${b.id}: ${d.toFixed(2)}u`)
    } else {
      // pre-G2 legacy density (launch + school rows shipped this way —
      // documented honestly here, not invented away)
      legacyPairs.push(`${a.id}↔${b.id}`)
    }
  }
}
check(
  'every G2 pin ≥6u from EVERY pin (10×31 pairs)',
  g2Overlaps === 0,
)
check(
  'legacy pin density unchanged (the 10 pre-G2 close pairs, pinned by id)',
  legacyPairs.length === 10 &&
    ['home↔kpata-market', 'home↔government-area', 'kpata-market↔government-area', 'kpata-market↔food-area', 'kpata-market↔transport-area', 'ganaja-junction↔transport-area', 'confluence↔faithview-academy', 'historic-lokoja↔college-nursing', 'historic-lokoja↔crowther-memorial', 'food-area↔transport-area'].every((p) => legacyPairs.includes(p)),
  legacyPairs.join(', '),
)

/* ----------------------------- 4. THE DISTRICT LAW -------------------------- */

section('G2 · the district law (every CHAOS zone claimed)')

const coverage: Record<string, string[]> = {}
for (const zone of CHAOS_ZONE_IDS) {
  const claimants = LOCATIONS.filter((l) => l.district === zone).map((l) => l.id)
  // the launch rows ARE the zones — a launch id covers its own zone by name match
  if (LAUNCH_IDS.includes(zone) && LOCATION_BY_ID[zone]) claimants.push(`${zone} (launch row, id match)`)
  coverage[zone] = claimants
}
for (const zone of CHAOS_ZONE_IDS) {
  check(`zone "${zone}" claimed by ≥1 location`, coverage[zone].length > 0, JSON.stringify(coverage[zone]))
}
const g2Claims = G2_IDS.map((id) => `${id}→${LOCATION_BY_ID[id]?.district}`).join(', ')
check('all ten G2 entries claim a district', G2_IDS.every((id) => !!LOCATION_BY_ID[id]?.district), g2Claims)

/* ---------------------------- 5. THE REAL-DOOR LAW -------------------------- */

section('G2 · the real-door law (every action rides a door that exists)')

const store = useGameStore.getState()
const KINDS = ['needs', 'spend', 'earn', 'view']

for (const l of LOCATIONS) {
  const actions = LOC_ACTIONS[l.id]
  check(`${l.id}: has an action board`, Array.isArray(actions) && actions.length >= 3 && actions.length <= 8, `got ${actions?.length ?? 0}`)
  if (!Array.isArray(actions)) continue
  check(`${l.id}: action keys unique`, new Set(actions.map((a) => a.key)).size === actions.length)
  for (const a of actions as LocAction[]) {
    const tag = `${l.id}/${a.key}`
    check(`${tag}: shape (key/label/emoji/kind)`, a.label.length > 2 && a.emoji.length > 0 && KINDS.includes(a.kind))
    if (a.kind === 'spend' || a.kind === 'earn' || a.kind === 'needs') {
      check(`${tag}: mutating row names a door`, typeof a.door === 'string' && a.door.length > 0)
    }
    if (a.door !== undefined) {
      const doorFn = (store as unknown as Record<string, unknown>)[a.door]
      check(`${tag}: door "${a.door}" is a REAL store action`, typeof doorFn === 'function')
    }
    if (a.cost !== undefined) check(`${tag}: cost is a positive naira number`, typeof a.cost === 'number' && a.cost > 0)
    if (a.effects !== undefined) {
      const keys = Object.keys(a.effects)
      check(
        `${tag}: effects are honest need deltas`,
        keys.every((k) => (NEEDS_KEYS as readonly string[]).includes(k)) &&
          keys.every((k) => typeof a.effects![k as (typeof NEEDS_KEYS)[number]] === 'number' && a.effects![k as (typeof NEEDS_KEYS)[number]] !== 0),
      )
    }
    if (a.note !== undefined) check(`${tag}: note is real prose`, a.note.length > 10)
    // the launch ten + schools + G2: view rows must carry an honest note
    if (a.kind === 'view') check(`${tag}: view row explains itself`, typeof a.note === 'string' && a.note.length > 10)
  }
}
// the store probe actually booted (guards against a hollow check)
check('the store surface itself booted (door checks were live)', typeof store.rest === 'function' && typeof store.searchHustles === 'function')

/* ------------------------------ 6. THE VIBE LAW ----------------------------- */

section('G2 · the vibe law (3–5 original rotating lines, every location)')

const allVibes: string[] = []
for (const l of LOCATIONS) {
  const vibes = LOC_VIBES[l.id]
  check(
    `${l.id}: 3–5 vibe lines`,
    Array.isArray(vibes) && vibes.length >= 3 && vibes.length <= 5 && vibes.every((v) => typeof v === 'string' && v.length > 20),
    `got ${vibes?.length ?? 0}`,
  )
  check(`${l.id}: no repeated line within the spot`, new Set(vibes ?? []).size === (vibes?.length ?? 0))
  allVibes.push(...(vibes ?? []))
}
check('no line reused across the whole city (originality guard)', new Set(allVibes).size === allVibes.length)

/* ---------------------------- 7. THE INTERIOR LAW --------------------------- */

section('G2 · the interior law (schema + spawn/clamp + BFS pathability)')

check('the G2 door-worthy registry carries 5 interiors', DISTRICT_INTERIORS.length === 5)
check(
  'G2 interiors stay OUT of the door-pinned INTERIORS array (one door per entry, per test-world3d.ts)',
  DISTRICT_INTERIORS.every((d) => !INTERIORS.includes(d)) && INTERIORS.length === 98,
)
check(
  'G2 interior ids unique across the whole city registry',
  new Set([...INTERIORS.map((i) => i.id), ...DISTRICT_INTERIORS.map((i) => i.id)]).size === INTERIORS.length + DISTRICT_INTERIORS.length,
)
check('every G2 interior belongs to a real G2 location', DISTRICT_INTERIORS.every((i) => G2_IDS.includes(i.locationId)))
check('every G2 interior resolves in INTERIOR_BY_ID', DISTRICT_INTERIORS.every((i) => INTERIOR_BY_ID[i.id] === i))

for (const def of DISTRICT_INTERIORS) {
  check(`${def.id}: full InteriorDef shape`, typeof def.name === 'string' && def.rooms.length > 0 && def.walls.length >= 5 && def.furniture.length > 0 && !!def.spawn && !!def.door && !!def.palette)
  check(`${def.id}: furniture kinds all real`, def.furniture.every((f) => !!FURN_FOOTPRINT[f.kind]))
  check(`${def.id}: exactly one exit hotspot`, def.hotspots.filter((h) => h.kind === 'exit').length === 1)
  check(`${def.id}: spawn resolves inside bounds`, (() => {
    const [sx, sz] = resolveInteriorPosition(def, def.spawn.x, def.spawn.z)
    return Math.abs(sx) < def.size.w / 2 && Math.abs(sz) < def.size.d / 2
  })())
  check(`${def.id}: hard clamp holds`, (() => {
    const [fx, fz] = resolveInteriorPosition(def, 999, -999)
    return Math.abs(fx) <= def.size.w / 2 - INTERIOR_PLAYER_RADIUS && Math.abs(fz) <= def.size.d / 2 - INTERIOR_PLAYER_RADIUS
  })())
  check(`${def.id}: colliders present (walls + solid furniture)`, interiorColliders(def).length > 5)
  // BFS pathability — the same law test-world3d.ts enforces on INTERIORS
  const step = 0.15
  const nx = Math.floor(def.size.w / step)
  const nz = Math.floor(def.size.d / step)
  const boxes = interiorColliders(def)
  const blocked = new Set<string>()
  const key = (ix: number, iz: number) => `${ix},${iz}`
  const toIdx = (x: number) => Math.floor((x + def.size.w / 2) / step)
  const toIdz = (z: number) => Math.floor((z + def.size.d / 2) / step)
  for (let ix = 0; ix < nx; ix++) {
    for (let iz = 0; iz < nz; iz++) {
      const x = -def.size.w / 2 + (ix + 0.5) * step
      const z = -def.size.d / 2 + (iz + 0.5) * step
      for (const b of boxes) {
        const dx = x - b.cx
        const dz = z - b.cz
        if (dx * dx + dz * dz > (b.hw + b.hd + INTERIOR_PLAYER_RADIUS) ** 2) continue
        const lx = dx * b.cos - dz * b.sin
        const lz = dx * b.sin + dz * b.cos
        if (Math.abs(lx) <= b.hw + INTERIOR_PLAYER_RADIUS && Math.abs(lz) <= b.hd + INTERIOR_PLAYER_RADIUS) {
          blocked.add(key(ix, iz))
          break
        }
      }
    }
  }
  const [rsx, rsz] = resolveInteriorPosition(def, def.spawn.x, def.spawn.z)
  const startIx = toIdx(rsx)
  const startIz = toIdz(rsz)
  const reach = new Set<string>([key(startIx, startIz)])
  const queue: [number, number][] = [[startIx, startIz]]
  while (queue.length) {
    const [cx, cz] = queue.shift()!
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const tx = cx + dx
      const tz = cz + dz
      if (tx < 0 || tz < 0 || tx >= nx || tz >= nz) continue
      const k = key(tx, tz)
      if (reach.has(k) || blocked.has(k)) continue
      reach.add(k)
      queue.push([tx, tz])
    }
  }
  const targets = [...def.hotspots.map((h) => ({ id: h.id, x: h.x, z: h.z })), ...(def.actions ?? []).map((a) => ({ id: a.id, x: a.x, z: a.z }))]
  for (const h of targets) {
    let ok = false
    for (let ox = -3; ox <= 3 && !ok; ox++) {
      for (let oz = -3; oz <= 3 && !ok; oz++) {
        if (reach.has(key(toIdx(h.x) + ox, toIdz(h.z) + oz))) ok = true
      }
    }
    check(`${def.id} → ${h.id} reachable on foot`, ok)
  }
}

/* ----------------------------- 8. THE WIRING LAW ---------------------------- */

section('G2 · the wiring law (LocationSheet renders board + vibe; LocationArt honest)')

const sheetSrc = readFileSync('src/components/game/LocationSheet.tsx', 'utf8')
check('LocationSheet imports the action board data', sheetSrc.includes("from '@/game/data/locActions'"))
check('LocationSheet imports the vibe lines', sheetSrc.includes("from '@/game/data/locVibes'"))
check('LocationSheet renders LocVibeLine + LocActionBoard', sheetSrc.includes('<LocVibeLine') && sheetSrc.includes('<LocActionBoard'))
// every store mutation the sheet fires must be one of the honest doors
const firedDoors = [...sheetSrc.matchAll(/\bs\.([a-zA-Z]+)\(/g)].map((m) => m[1])
check(
  'door-backed rows fire REAL store actions only (rest/relaxIndoors/workout/study/searchHustles)',
  firedDoors.length > 0 && firedDoors.every((d) => ['rest', 'relaxIndoors', 'workout', 'study', 'searchHustles'].includes(d)),
  firedDoors.join(','),
)
check('the sheet keeps its existing props contract', sheetSrc.includes('locationId: string') && sheetSrc.includes('onOpenWork?') && sheetSrc.includes('onTravel?'))

const artSrc = readFileSync('src/components/game/LocationArt.tsx', 'utf8')
check('LocationArt carries a pin mapping for every G2 id (reuse or gradient)', G2_IDS.every((id) => artSrc.includes(`'${id}':`) || artSrc.includes(`${id}:`)))
check('LocationArt reuses existing art only for the subject-true match', artSrc.includes("'/art/loc-mount-patti.webp'"))

/* --------------------------------- the verdict ------------------------------- */

console.log(`\n========================================`)
console.log(`G2-SPACES — ${passed} passed, ${failed} failed`)
console.log(`========================================`)
if (failed > 0) process.exit(1)
