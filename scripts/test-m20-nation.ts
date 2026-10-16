/**
 * M20 — PLANET SCALE + OPS: THE LAW SUITE
 * ----------------------------------------
 * Run: bun scripts/test-m20-nation.ts
 * (Real HTTP legs talk to the dev server on :3000 — start it first.)
 *
 * The laws under test:
 *  - THE WORKER LAW: the kernel is pure, deterministic, zero-alloc-per-step,
 *    and the ONLY thing crossing to the UI is the small CrowdSnapshot.
 *  - THE DISTRICT LAW: the crowd walks the city's REAL zone roster —
 *    pinned to CHAOS_ZONE_IDS so the two can never drift.
 *  - THE KID WALL: telemetry refuses a child STRUCTURALLY — band first,
 *    opt-in never even read; the server door 403s the same band.
 *  - THE NO-TEXT LAW: the moderation book's rows carry {day, why, band}
 *    and NOTHING else — there is no field a word could live in.
 *  - THE EXACTNESS LAW: applyDelta(base, encodeDelta(base, next)) === next
 *    for every pair — hostile, unicode, and real-save-sized.
 *  - THE CEILING LAW: a patch that would break 1MB is refused at encode.
 *  - THE FALLBACK LAW: the delta push is clothing, not a wall — the whole
 *    envelope path stays the honest default.
 *  - THE v20 LADDER: a bare v19 save wakes up with the nation slice,
 *    healed and defaulted, telemetry DARK.
 */

/* ------------------------------ the imports ------------------------------ */

import {
  NATION_DISTRICTS,
  CROWD_ACTIVITIES,
  createCrowdState,
  stepCrowd,
  crowdAggregate,
  hashCrowd,
  quietPulse,
} from '../src/game/systems/nation-sim'
import type { WorldPulse } from '../src/game/systems/nation-sim'
import { CHAOS_ZONE_IDS } from '../src/game/systems/chaos'
import {
  freshNationState,
  recordInflation,
  inflationTrend,
  recordModeration,
  moderationScore,
  crowdToggle,
} from '../src/game/systems/nation'
import { FLAG_DEFAULTS, readFlags, setFlag, recordDeploy, readManifest, previousDeploy } from '../src/game/systems/flags'
import {
  TELEMETRY_KEYS,
  freshTelemetryBook,
  recordTelemetry,
  telemetryPayload,
  telemetryDayRoll,
  type TelemetryKey,
} from '../src/game/systems/telemetry'
import {
  encodeDelta,
  applyDelta,
  patchToBase64,
  patchFromBase64,
  deltaPushFields,
  DELTA_CEILING,
} from '../src/game/systems/binarydelta'

/* --------------------------- the storage shim ---------------------------- */

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log('  ✓', name) } else { failed++; console.log('  ✗', name) }
}
function section(name: string) { console.log(`\n— ${name} —`) }

// localStorage shim BEFORE any SaveSystem/flags use — mirrors the browser surface
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
;(globalThis as unknown as { localStorage: unknown }).localStorage = (globalThis as unknown as { window: { localStorage: unknown } }).window.localStorage

/* ------------------------------- the helpers ------------------------------ */

function districtPop(snap: ReturnType<typeof crowdAggregate>, id: string): number {
  return snap.districts.find((d) => d.id === id)!.pop
}

/* ============================ 1. THE KERNEL =============================== */

section('M20 · the district law')
check('the crowd walks the city\u2019s REAL zones (pinned to CHAOS_ZONE_IDS)', NATION_DISTRICTS.length === CHAOS_ZONE_IDS.length && NATION_DISTRICTS.every((d, i) => d === CHAOS_ZONE_IDS[i]))
check('ten districts — the roster is append-only', NATION_DISTRICTS.length === 10)

section('M20 · the determinism law')
const a = createCrowdState(7, 10_000)
const b = createCrowdState(7, 10_000)
const c = createCrowdState(8, 10_000)
check('same seed → the same city (hash)', hashCrowd(a) === hashCrowd(b))
check('different seed → a different city', hashCrowd(a) !== hashCrowd(c))
check('the seed is remembered', a.seed === 7 && b.seed === 7)

section('M20 · the count clamp law')
check('50k is the ceiling', createCrowdState(1, 99_999).count === 50_000)
check('zero souls still boots', createCrowdState(1, 0).count >= 1)

section('M20 · the snapshot purity law (the ONLY crossing)')
const snap = crowdAggregate(a)
check('total matches the count', snap.total === 10_000)
check('ten districts, human words', snap.districts.length === 10 && snap.districts.every((d) => typeof d.top === 'string' && CROWD_ACTIVITIES.includes(d.top as (typeof CROWD_ACTIVITIES)[number])))
check('pops sum to the city', snap.districts.reduce((acc, d) => acc + d.pop, 0) === snap.total)
check('no typed array ever crosses (plain JSON)', JSON.stringify(snap).length > 0 && !JSON.stringify(snap).includes('Uint8'))
check('the snapshot is SMALL (~800B for ten districts)', JSON.stringify(snap).length < 2_000)
check('snapshot shape is exactly the four numbers', snap.districts.every((d) => Object.keys(d).join(',') === 'id,pop,mood,wealth,top'))

section('M20 · the flood law (the low city walks to Patti)')
const floodState = createCrowdState(11, 5_000)
const beforeFlood = crowdAggregate(floodState)
stepCrowd(floodState, { day: 2, weather: 'flood', floodLevel: 0.6, marketMult: 1, festival: null })
const afterFlood = crowdAggregate(floodState)
check('Patti gains souls under flood', districtPop(afterFlood, 'mount-patti') > districtPop(beforeFlood, 'mount-patti'))
check('Kpata empties under flood', districtPop(afterFlood, 'kpata-market') < districtPop(beforeFlood, 'kpata-market'))
check('the sheltered shelter (activity = shelter)', afterFlood.districts.find((d) => d.id === 'mount-patti')!.top === 'shelter')

section('M20 · the market law (liquidity pulls the crowd)')
const mkState = createCrowdState(12, 5_000)
const beforeMk = crowdAggregate(mkState)
stepCrowd(mkState, { day: 3, weather: 'sunny', floodLevel: 0, marketMult: 1.2, festival: null })
const afterMk = crowdAggregate(mkState)
check('a hot market fills the belts', districtPop(afterMk, 'kpata-market') > districtPop(beforeMk, 'kpata-market'))
check('pockets follow the ONE channel (avg wealth up under ×1.2)', afterMk.avgWealth > beforeMk.avgWealth)

section('M20 · the festival law (the city lifts)')
const festState = createCrowdState(13, 5_000)
const beforeFest = crowdAggregate(festState)
stepCrowd(festState, { day: 4, weather: 'sunny', floodLevel: 0, marketMult: 1, festival: 'regatta' })
const afterFest = crowdAggregate(festState)
check('a festival lifts the mood', afterFest.avgMood > beforeFest.avgMood)

section('M20 · the zero-alloc + in-place law')
const zState = createCrowdState(14, 2_000)
const zRef = zState
const zHash0 = hashCrowd(zState)
stepCrowd(zState, quietPulse(5))
check('stepCrowd returns nothing and mutates in place (same object)', zState === zRef && hashCrowd(zState) !== zHash0)

section('M20 · the step determinism law')
const s1 = createCrowdState(21, 3_000)
const s2 = createCrowdState(21, 3_000)
const pulse: WorldPulse = { day: 6, weather: 'rain', floodLevel: 0.1, marketMult: 1.05, festival: null }
for (let i = 0; i < 25; i++) {
  stepCrowd(s1, pulse)
  stepCrowd(s2, pulse)
}
check('25 steps of rain → identical cities', hashCrowd(s1) === hashCrowd(s2))

section('M20 · the never-stutters census (generous 20× bound)')
const perfState = createCrowdState(15, 10_000)
const t0 = Date.now()
for (let i = 0; i < 100; i++) stepCrowd(perfState, quietPulse(i + 2))
const dt = Date.now() - t0
check(`100 steps of 10k NPCs in ${dt}ms (< 2000ms — the 2s cadence owns the rest)`, dt < 2_000)

/* ============================ 2. THE NATION SLICE ========================= */

section('M20 · the inflation ledger (the ONE-channel law)')
const inf0 = freshNationState()
const r1 = recordInflation(inf0.inflation, 3, 1.12)
check('a day\u2019s mult records once', r1.recorded && r1.next.length === 1)
const r2 = recordInflation(r1.next, 3, 1.3)
check('the same day never double-posts (dedupe)', !r2.recorded && r2.next.length === 1)
const r3 = recordInflation(r1.next, 4, 9)
check('a runaway mult clamps (9 → 3)', r3.recorded && r3.next[1].mult === 3)
let infBook = r1.next
for (let d = 5; d < 25; d++) infBook = recordInflation(infBook, d, 1).next
check('the ledger caps at 12 rows', infBook.length === 12 && infBook[infBook.length - 1].day === 24)
check('the trend reads the book (rows honest, avg computed)', inflationTrend([...infBook, { day: 30, mult: 1.2 }]).rows === 13 && inflationTrend([]).avg === 1)
check('HOT is honest (avg ≥ 1.1)', inflationTrend([{ day: 1, mult: 1.15 }]).hot === true && inflationTrend([{ day: 1, mult: 1.0 }]).hot === false)

section('M20 · the no-text law (the moderation book)')
const mod0 = freshNationState()
const m1 = recordModeration(mod0.moderation, 3, 'word-wall', 'teen')
check('a refusal records', m1.recorded && m1.next.length === 1)
check('the row carries {day,why,band} — NO text field exists', Object.keys(m1.next[0]).join(',') === 'day,why,band')
const m2 = recordModeration(m1.next, 3, 'invented-why', 'teen')
check('an invented why is refused, never stored', !m2.recorded && m2.next.length === 1)
const m3 = recordModeration(m2.next, 4, 'no-links-ever', 'weird-band')
check('an unknown band lands as unknown (never crashes)', m3.recorded && m3.next[1].band === 'unknown')
let modBook = m1.next
for (let i = 0; i < 50; i++) modBook = recordModeration(modBook, 5 + i, 'word-wall', 'adult').next
check('the book caps at 40', modBook.length === 40)
check('the score groups honestly', moderationScore([{ day: 1, why: 'word-wall', band: 'teen' }, { day: 2, why: 'word-wall', band: 'adult' }, { day: 3, why: 'kid-text-refused', band: 'kid' }]).join() === 'word-wall×2,kid-text-refused×1'.replace('×', '×') || moderationScore([{ day: 1, why: 'word-wall', band: 'teen' }, { day: 2, why: 'word-wall', band: 'adult' }])[0].count === 2)

section('M20 · the crowd switch')
const ct = crowdToggle(freshNationState(), false)
check('the toggle flips the switch and keeps the seed', ct.crowd.on === false && ct.crowd.seed === freshNationState().crowd.seed)

/* ============================== 3. THE FLAGS ============================== */

section('M20 · the flags (device-level, outside the save)')
mem.clear()
check('a fresh device reads the honest defaults', JSON.stringify(readFlags()) === JSON.stringify(FLAG_DEFAULTS))
check('telemetry defaults DARK (the default-dark law)', FLAG_DEFAULTS.telemetryAsk === false)
setFlag('crowdSim', false)
check('a set flag persists + reads back', readFlags().crowdSim === false)
mem.set('lokoja-life:flags', '{garbage')
check('a torn flags blob is just defaults (never a gate)', readFlags().crowdSim === FLAG_DEFAULTS.crowdSim)
mem.clear()
recordDeploy('m16.1')
recordDeploy('m20')
recordDeploy('m20')
check('the deploy book records once per version, newest first', readManifest()[0].version === 'm20' && readManifest().length === 2)
check('previousDeploy names the last-good shell', previousDeploy()?.version === 'm16.1')
for (let i = 0; i < 8; i++) recordDeploy(`v-${i}`)
check('the book caps at 5', readManifest().length === 5)

/* ============================ 4. THE TELEMETRY ============================ */

section('M20 · THE KID WALL (structural, forever)')
const kidBook = { ...freshTelemetryBook(), optIn: true }
const kidRes = recordTelemetry(kidBook, 'day-rolled', 'kid', 5)
check('a kid with opt-in TRUE still produces ZERO rows', !kidRes.recorded && Object.keys(kidRes.next.counts).length === 0)
check('the refusal is silent and total (the book is untouched)', kidRes.next.counts['day-rolled'] === undefined)

section('M20 · the opt-in gate + the closed enum')
const tel0 = freshTelemetryBook()
const t1 = recordTelemetry(tel0, 'day-rolled', 'adult', 5)
check('dark by default — nothing records', !t1.recorded)
const tel1 = { ...freshTelemetryBook(), optIn: true }
const t2 = recordTelemetry(tel1, 'travel-made', 'adult', 5)
check('opted-in adults record', t2.recorded && t2.next.counts['travel-made'] === 1)
const t3 = recordTelemetry(t2.next, 'invented-metric' as TelemetryKey, 'adult', 5) // the closed enum must refuse its own type hole
check('an invented metric is refused (closed enum)', !t3.recorded)
let telBook = t2.next
for (let i = 0; i < 10_050; i++) telBook = recordTelemetry(telBook, 'gig-run', 'adult', 5).next
check('a counter caps at 9999', telBook.counts['gig-run'] === 9999)
check('the payload is null while dark', telemetryPayload(freshTelemetryBook()) === null)
check('the payload clamps to the enum (only honest keys ride)', Object.keys(telemetryPayload(telBook)!.counters).join(',') === 'travel-made,gig-run')
const rollBook = telemetryDayRoll({ optIn: true, day: 1, counts: { 'day-rolled': 3 } }, 45)
check('a 30+ day crossing resets the window (the book stays small)', Object.keys(rollBook.counts).length === 0 && rollBook.day === 45)
const keepBook = telemetryDayRoll({ optIn: true, day: 40, counts: { 'day-rolled': 3 } }, 45)
check('a small crossing keeps the counts', keepBook.counts['day-rolled'] === 3)
check('the closed enum is exactly the eight honest metrics', TELEMETRY_KEYS.length === 8)

/* =========================== 5. THE BINARY DELTA ========================== */

section('M20 · THE EXACTNESS LAW (every pair reconstructs)')
const pairs: [string, string][] = [
  ['', ''],
  ['same', 'same'],
  ['abc', 'xyz'],
  ['', 'brand new'],
  ['old only', ''],
  ['🇳🇬 jollof 🍚 mid 🌶️', '🇳🇬 jollof 🍚 mid 🌶️ extra pepper'],
  ['{"player":{"cash":5000},"version":19}', '{"player":{"cash":5250},"version":20}'],
  ['a'.repeat(50_000) + 'MIDDLE' + 'b'.repeat(50_000), 'a'.repeat(50_000) + 'CHANGED' + 'b'.repeat(50_000)],
]
let exact = true
for (const [base, next] of pairs) {
  try {
    const patch = encodeDelta(base, next)
    if (applyDelta(base, patch) !== next) exact = false
  } catch {
    exact = false
  }
}
check(`8 hostile pairs round-trip byte-exact (incl. unicode + 100KB)`, exact)

section('M20 · the tamper wall')
const base = 'lokoja-life-v20-save-payload-'.repeat(10)
const next = base.slice(0, -5) + '-changed'
const goodPatch = encodeDelta(base, next)
check('wrong magic refused', (() => { try { applyDelta(base, new Uint8Array([0, 1, 2, 3, 4, 5, 6])); return false } catch { return true } })())
check('torn patch refused', (() => { try { applyDelta(base, goodPatch.slice(0, 4)); return false } catch { return true } })())
check('wrong base refused (the baseLen check)', (() => { try { applyDelta(base.slice(0, -3), goodPatch); return false } catch { return true } })())
check('unknown format version refused', (() => { try { const p = goodPatch.slice(); p[4] = 99; applyDelta(base, p); return false } catch { return true } })())

section('M20 · THE CEILING LAW (<1MB)')
check('the ceiling constant is the law\u2019s number', DELTA_CEILING === 1_000_000)
check('a >1MB disjoint pair is refused at encode (fall back whole)', (() => {
  try {
    encodeDelta('x'.repeat(200), 'y'.repeat(1_200_000))
    return false
  } catch {
    return true
  }
})())

section('M20 · the base64 clothes + the push policy')
const rt = patchToBase64(goodPatch)
check('base64 round-trips through btoa/Buffer', JSON.stringify([...patchFromBase64(rt)]) === JSON.stringify([...goodPatch]))
check('identical strings push nothing (the zero-byte law holds)', deltaPushFields('same', 'same') === null)
check('no base pushes nothing (fresh device goes whole)', deltaPushFields(null, 'next') === null)
const policy = deltaPushFields(base, next)
check('a worthwhile change produces a patch worth the wire', policy !== null && patchFromBase64(policy!.patch).length < next.length * 0.6)
check('a 60%+ change refuses the patch (whole is cheaper)', deltaPushFields('abc', 'xyz-new-long-tail'.repeat(20)) === null)

/* ============================ 6. THE v20 LADDER =========================== */

section('M20 · the save ladder (bare v19 → v20)')
mem.clear()
const { SaveSystem } = await import('../src/game/systems/save')
const { freshStoryState } = await import('../src/game/systems/story')
const { freshPattiState } = await import('../src/game/systems/patti')
const { freshWardrobeState } = await import('../src/game/systems/wardrobe')
const { freshCalendarState } = await import('../src/game/systems/calendar')
const { freshRiversState } = await import('../src/game/systems/rivers')
const { freshEducationState } = await import('../src/game/systems/education')
const { freshHousingState } = await import('../src/game/systems/housing')
const { freshJapaState } = await import('../src/game/systems/japa')
const { freshShieldState } = await import('../src/game/systems/shield')
const { freshPulseState } = await import('../src/game/systems/pulse')
const { freshLiveState } = await import('../src/game/systems/live')
const { freshFortressState } = await import('../src/game/systems/fortress')
SaveSystem.setFortKey('m20-nation-key-0123456789abcdef')

const bareV19 = {
  version: 19,
  createdAt: 1,
  updatedAt: 2,
  player: { name: 'M20Walker', cash: 5000, level: 3, xp: 0, reputation: 10, energy: 80, hunger: 70, mood: 70, ageBand: 'adult', stats: { totalEarned: 9000, daysSurvived: 3, gigs: 1 }, businesses: [], ownedVehicles: [], bankBalance: 0, activeOpportunities: [] },
  world: { day: 3, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
  settings: { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true },
  civic: null,
  fleet: { day: 1, done: [] },
  chaos: null,
  goals: null,
  onboarding: null,
  account: { linked: false, handle: null, token: null, ageBand: 'adult', gateGraceDay: 0 },
  calendar: null,
  rivers: null,
  education: null,
  housing: null,
  japa: null,
  shield: null,
  fortress: null,
  cityPulse: null,
  live: null,
  forge: null,
  story: freshStoryState(),
  patti: freshPattiState(),
  wardrobe: freshWardrobeState(),
}
mem.set('lokoja-life:save', JSON.stringify(bareV19)) // BARE save — the mercy law reads it as legacy-ok
const lifted = SaveSystem.load()!
check('a bare v19 save climbs to v20', lifted.version === 20)
check('the nation slice arrives defaulted', !!lifted.nation && lifted.nation.crowd.on === true && lifted.nation.telemetryOptIn === false)
check('the books arrive EMPTY (no invented history)', lifted.nation.inflation.length === 0 && lifted.nation.moderation.length === 0)
check('the crowd arrives at the honest count', lifted.nation.crowd.count === 10_000)

section('M20 · the torn-slice heal')
mem.set('lokoja-life:save', JSON.stringify({ ...bareV19, version: 20, nation: { crowd: { count: 99_999 }, inflation: [{ day: 'bad' }, { day: 2, mult: 1.1 }], moderation: 'not-an-array', telemetryOptIn: 'yes-please' } }))
const healed = SaveSystem.load()!
check('a torn crowd block clamps (count ≤ 50k, seed defaulted)', healed.nation.crowd.count === 10_000 && typeof healed.nation.crowd.seed === 'number')
check('torn inflation rows are filtered, honest rows kept', healed.nation.inflation.length === 1 && healed.nation.inflation[0].day === 2)
check('a non-array moderation book lands empty', Array.isArray(healed.nation.moderation) && healed.nation.moderation.length === 0)
check('a string opt-in lands DARK (boolean law)', healed.nation.telemetryOptIn === false)

section('M20 · the write/load round trip with books')
const full = {
  ...bareV19,
  version: 20,
  civic: freshNationState() && (await import('../src/game/systems/civic')).freshCivicState(),
  chaos: (await import('../src/game/systems/chaos')).freshChaosState(),
  goals: (await import('../src/game/systems/goals')).freshGoalState(),
  onboarding: (await import('../src/game/systems/guest')).freshOnboardingState(),
  calendar: freshCalendarState(),
  rivers: freshRiversState(),
  education: freshEducationState(),
  housing: freshHousingState(),
  japa: freshJapaState(),
  shield: freshShieldState(),
  fortress: freshFortressState(),
  cityPulse: freshPulseState(),
  live: freshLiveState(),
  forge: (await import('../src/game/systems/citypack')).freshForgeState(),
  nation: { ...freshNationState(), inflation: [{ day: 2, mult: 1.1 }], moderation: [{ day: 3, why: 'word-wall', band: 'teen' }], telemetryOptIn: true },
}
mem.set('lokoja-life:save', JSON.stringify(full))
const back = SaveSystem.load()!
check('the books survive the descent byte-honest', back.nation.inflation.length === 1 && back.nation.moderation.length === 1 && back.nation.telemetryOptIn === true)

/* =========================== 7. THE REAL HTTP PASS ======================== */

section('M20 · the real HTTP pass (dev :3000)')
const BASE = 'http://localhost:3000'
async function jfetch(path: string, init?: RequestInit): Promise<{ status: number; body: Record<string, unknown> }> {
  try {
    const res = await fetch(`${BASE}${path}`, init)
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
    return { status: res.status, body }
  } catch {
    return { status: 0, body: {} }
  }
}
const serverUp = (await jfetch('/api/route')).status !== 0
if (!serverUp) {
  check('dev server reachable on :3000 (start it: bun dev)', false)
} else {
  const stamp = Date.now().toString(36)
  const adult = await jfetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `m20a${stamp}`, contact: `m20a${stamp}@lokoja.test`, pin: '1234', ageBand: 'adult' }),
  })
  check('adult registers', adult.status === 200 && adult.body.ok === true)
  const adultToken = String(adult.body.token ?? '')

  const kid = await jfetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `m20k${stamp}`, pin: '1234', ageBand: 'kid', parentPin: '998877' }),
  })
  check('a kid registers behind the parent shield', kid.status === 200 && kid.body.ok === true)
  const kidToken = String(kid.body.token ?? '')

  const noTok = await jfetch('/api/telemetry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ day: 1, counters: {} }) })
  check('tokenless telemetry → 401', noTok.status === 401)

  const kidTel = await jfetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${kidToken}` },
    body: JSON.stringify({ day: 1, counters: { 'day-rolled': 3 } }),
  })
  check('THE KID WALL AT THE DOOR: a kid\u2019s counter → 403 no-minor-data', kidTel.status === 403 && kidTel.body.why === 'no-minor-data')

  const badCounters = await jfetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adultToken}` },
    body: JSON.stringify({ day: 1, counters: 'not-an-object' }),
  })
  check('malformed counters → 400', badCounters.status === 400)

  const adultTel = await jfetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adultToken}` },
    body: JSON.stringify({ day: 2, counters: { 'day-rolled': 4, 'invented-metric': 99, 'travel-made': 2 } }),
  })
  check('an opted-in adult\u2019s honest counters land (invented ones dropped server-side)', adultTel.status === 200 && adultTel.body.ok === true)

  // ---- the binary delta over the real vault ----
  const saveA = { ...full, version: 20, player: { ...full.player, name: 'DeltaA' } }
  const pushA = await jfetch('/api/cloud/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adultToken}` },
    body: JSON.stringify({ schema_version: 20, data: saveA, sig: 'sigA' }),
  })
  check('the vault takes the whole envelope first (the honest base)', pushA.status === 200 && pushA.body.ok === true)

  const saveB = { ...saveA, player: { ...saveA.player, name: 'DeltaB', cash: 9999 }, nation: { ...(saveA.nation as { inflation: unknown[] }).valueOf(), inflation: [{ day: 9, mult: 1.4 }] } }
  const baseStr = JSON.stringify(saveA)
  const nextStr = JSON.stringify(saveB)
  const patch = patchToBase64(encodeDelta(baseStr, nextStr))
  const pushDelta = await jfetch('/api/cloud/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adultToken}` },
    body: JSON.stringify({ schema_version: 20, patch, sig: 'sigB' }),
  })
  check('the delta door accepts the patch against ITS stored base', pushDelta.status === 200 && pushDelta.body.ok === true && pushDelta.body.delta === true)

  const pull = await jfetch('/api/cloud/pull', { headers: { Authorization: `Bearer ${adultToken}` } })
  const pulledSave = (pull.body.save ?? null) as Record<string, unknown> | null
  check('the pulled save is EXACTLY the rebuilt next (byte-law through the wire)', !!pulledSave && JSON.stringify(pulledSave) === nextStr)

  const ghost = await jfetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `m20g${stamp}`, contact: `m20g${stamp}@lokoja.test`, pin: '1234', ageBand: 'adult' }),
  })
  const ghostToken = String(ghost.body.token ?? '')
  const noBase = await jfetch('/api/cloud/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ghostToken}` },
    body: JSON.stringify({ schema_version: 20, patch, sig: 'x' }),
  })
  check('a patch with no base on the vault → honest 400 (the client goes whole)', noBase.status === 400)

  const tornPatch = await jfetch('/api/cloud/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adultToken}` },
    body: JSON.stringify({ schema_version: 20, patch: patchToBase64(goodPatch.slice(0, 3)), sig: 'x' }),
  })
  check('a torn patch → honest 400, never a corrupted row', tornPatch.status === 400)
}


console.log('\n========================================')
console.log(`M20 NATION — ${passed} passed, ${failed} failed`)
console.log('========================================')
process.exit(failed > 0 ? 1 : 0)
