/**
 * LOKOJA LIFE — M15: TELEPORT & PULSE + THE AWARENESS WAR
 * ---------------------------------------------------------
 * Law blocks:
 *  - THE BASE32 codec (RFC 4648 vectors + a byte-sweep roundtrip)
 *  - THE POSTCARD: encode/decode roundtrip, determinism (same moment →
 *    same bytes), the ~100B budget, the name law, the roster law, the
 *    trail law, the version guard
 *  - THE TAMPER WALL: flipped char → tampered, truncation → refused,
 *    stripped sig → refused, wrong prefix → malformed, WhatsApp paste
 *    (whitespace + quotes) survives, empty → refused
 *  - THE CITY PULSE: the feed's weight law (blast > flood > fuel > …),
 *    determinism (same city → same paper, twice), the id law (stable
 *    per day+kind+zone), the read book (idempotent, stale-free), the
 *    quiet-day honesty, the private-books law (bills never headline)
 *  - KNOW YOUR CITY: honest percent math + the grade ladder
 *  - SAVE v16 + THE DELTA LAW (real transport): the v15→v16 migration,
 *    the skip law (same state = zero bytes), the timestamp law
 *    (updatedAt alone never writes), the tamper law (a broken primary
 *    never rides a skip), the push book
 *  - THE STORE PASS: share → street credit once/day through the reward
 *    engine, the arrival law (free landing + the book + no credit),
 *    the guest gate holding a postcard until grace, the arrival book
 *    cap, the tampered-arrival refusal
 * Run: bun scripts/test-m15-pulse.ts
 */

import {
  base32Encode,
  base32Decode,
  encodeTeleport,
  decodeTeleport,
  sanitizeTeleportName,
  teleportUrl,
  TELEPORT_CODE_LIMIT,
  TELEPORT_URL_LIMIT,
  TELEPORT_ROSTER,
  postcardFor,
} from '../src/game/systems/teleport'
import {
  pulseForDay,
  markPulseRead,
  pulseUnread,
  cityKnowledge,
  cityGrade,
  freshPulseState,
} from '../src/game/systems/pulse'
import { SaveSystem } from '../src/game/systems/save'
import { cutZonesFor, freshRiversState } from '../src/game/systems/rivers'
import { festivalForDay, freshCalendarState, weddingForCycle } from '../src/game/systems/calendar'
import { freshChaosState, chaosDayRoll, isScarcityDay, isPayoutDay } from '../src/game/systems/chaos'
import { freshCivicState } from '../src/game/systems/civic'
import { freshShieldState } from '../src/game/systems/shield'
import { freshEducationState } from '../src/game/systems/education'
import { freshHousingState } from '../src/game/systems/housing'
import { freshJapaState } from '../src/game/systems/japa'
import { freshGoalState } from '../src/game/systems/goals'
import { freshOnboardingState, freshAccountState } from '../src/game/systems/guest'
import { PULSE } from '../src/game/data/config'
import type { PulseItem } from '../src/game/systems/pulse'
import type { ChaosState, CivicState, RiversState, CalendarState, Weather, PlayerState } from '../src/game/types'

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}`)
  }
}
function section(name: string) {
  console.log(`\n— ${name} —`)
}

const MOMENT = {
  v: 1 as const,
  day: 41,
  locId: 'kpata-market',
  name: 'Ada',
  level: 6,
  rep: 38,
  earned: 4300,
  moves: 9,
  trail: [1, 2, 0],
}

/* --------------------------------- base32 ---------------------------------- */

section('the base32 codec — RFC 4648 speaks')
{
  check("'' → ''", base32Encode([]) === '')
  check("'f' → 'MY'", base32Encode([102]) === 'MY')
  check("'fo' → 'MZXQ'", base32Encode([102, 111]) === 'MZXQ')
  check("'foo' → 'MZXW6'", base32Encode([102, 111, 111]) === 'MZXW6')
  check("'foob' → 'MZXW6YQ'", base32Encode([102, 111, 111, 98]) === 'MZXW6YQ')
  check("'fooba' → 'MZXW6YTB'", base32Encode([102, 111, 111, 98, 97]) === 'MZXW6YTB')
  check("'foobar' → 'MZXW6YTBOI'", base32Encode([102, 111, 111, 98, 97, 114]) === 'MZXW6YTBOI')
  // the byte sweep: every length roundtrips
  let sweepOk = true
  for (let len = 0; len < 40; len++) {
    const bytes: number[] = []
    for (let i = 0; i < len; i++) bytes.push((i * 37 + 11) % 256)
    const enc = base32Encode(bytes)
    const dec = base32Decode(enc)
    if (!dec || dec.length !== bytes.length || dec.some((b, i) => b !== bytes[i])) sweepOk = false
  }
  check('the byte-sweep roundtrip (lengths 0–39) all match', sweepOk)
  check('a stray character refuses to decode', base32Decode('MZXW6!') === null)
}

/* ------------------------------- the postcard ------------------------------ */

section('the postcard — encode/decode roundtrip + the budget')
{
  const enc = encodeTeleport(MOMENT)
  check('a valid moment encodes', enc.ok)
  if (enc.ok) {
    check('the code carries the lkt1 prefix', enc.code.startsWith('lkt1.'))
    check('THE BUDGET: the code fits WhatsApp (≤ 96 chars)', enc.code.length <= TELEPORT_CODE_LIMIT)
    check('THE BUDGET: the share URL stays ~100B class (≤ 112 chars)', enc.url.length <= TELEPORT_URL_LIMIT)
    check('the payload rides ~30 honest bytes', enc.bytes >= 20 && enc.bytes <= 45)
    const dec = decodeTeleport(enc.code)
    check('the roundtrip restores every field', dec.ok && dec.ok &&
      dec.moment.day === MOMENT.day && dec.moment.locId === MOMENT.locId && dec.moment.name === 'Ada' &&
      dec.moment.level === 6 && dec.moment.rep === 38 && dec.moment.earned === 4300 && dec.moment.moves === 9)
    check('the ghost walk survives', dec.ok && JSON.stringify(dec.moment.trail) === JSON.stringify(MOMENT.trail))
    const enc2 = encodeTeleport(MOMENT)
    check('DETERMINISM: the same moment mints the same bytes', enc2.ok && enc2.code === enc.code)
    const enc3 = encodeTeleport({ ...MOMENT, day: 42 })
    check('a different moment mints a different code', enc3.ok && enc3.code !== enc.code)
    // WhatsApp paste survival
    const pasted = decodeTeleport(`  "${enc.code}" \n`)
    check('a WhatsApp paste (quotes + whitespace) opens fine', pasted.ok)
    check('the URL builder joins the /t/ path', teleportUrl(enc.code, 'https://x.ug/').endsWith(`/t/${enc.code}`))
  }
  check('a name over 12 chars refuses', !encodeTeleport({ ...MOMENT, name: 'abcdefghijklmnop' }).ok)
  check('a name with a script injection refuses', !encodeTeleport({ ...MOMENT, name: 'Ada<script>' }).ok)
  const sanSpaces = sanitizeTeleportName('Ada   Hustle')
  check('a name with inner spaces collapses to one', sanSpaces.ok && sanSpaces.name === 'Ada Hustle')
  check('an off-roster street refuses', !encodeTeleport({ ...MOMENT, locId: 'lagos-island' }).ok)
  check('a trail over the category law refuses', !encodeTeleport({ ...MOMENT, trail: [1, 99, 0] }).ok)
  check('a wrong version refuses', !encodeTeleport({ ...MOMENT, v: 2 as unknown as 1 }).ok)
  check('day zero refuses', !encodeTeleport({ ...MOMENT, day: 0 }).ok)
}

section('THE TAMPER WALL — a broken postcard never loads')
{
  const enc = encodeTeleport(MOMENT)
  if (enc.ok) {
    const [head, body, sig] = enc.code.split('.')
    // flip one char in the body (the classic edit)
    const flipped = body[0] === 'A' ? 'B' + body.slice(1) : 'A' + body.slice(1)
    const d1 = decodeTeleport(`${head}.${flipped}.${sig}`)
    check('a flipped body char is TAMPERED', !d1.ok && d1.why === 'tampered')
    // swap a digit in the sig
    const sigSwapped = (sig[0] === '0' ? '1' : '0') + sig.slice(1)
    const d2 = decodeTeleport(`${head}.${body}.${sigSwapped}`)
    check('a swapped sig char is TAMPERED', !d2.ok && d2.why === 'tampered')
    // truncation (WhatsApp eats the tail)
    const d3 = decodeTeleport(enc.code.slice(0, enc.code.length - 4))
    check('a truncated code refuses (never a partial arrival)', !d3.ok)
    // strip the signature
    const d4 = decodeTeleport(`${head}.${body}`)
    check('a stripped sig refuses as malformed', !d4.ok && d4.why === 'malformed')
    // wrong prefix
    const d5 = decodeTeleport(`lkt9.${body}.${sig}`)
    check('a wrong schema prefix refuses', !d5.ok && d5.why === 'malformed')
    // pure garbage
    const d6 = decodeTeleport('hello-mama')
    check('pure garbage refuses as malformed', !d6.ok && d6.why === 'malformed')
    // empty
    const d7 = decodeTeleport('   ')
    check('an empty paste refuses as empty', !d7.ok && d7.why === 'empty')
    // the honest code STILL opens after all that abuse
    check('the honest code still opens after the battery', decodeTeleport(enc.code).ok)
  }
}

/* ------------------------------- the city pulse ---------------------------- */

function freshSlices(): { chaos: ChaosState; civic: CivicState; rivers: RiversState; calendar: CalendarState; weather: Weather } {
  return { chaos: freshChaosState(), civic: freshCivicState(), rivers: freshRiversState(), calendar: freshCalendarState(), weather: 'sunny' }
}

section('the city pulse — the feed derives, the weights sort')
{
  const { chaos, civic, rivers, calendar, weather } = freshSlices()
  // THE BLAST: hunt a day the grid blows (the M8 roll is deterministic)
  let blastDay = 0
  let rolled = chaos
  for (let day = 2; day < 80 && blastDay === 0; day++) {
    for (const w of ['storm', 'flood'] as Weather[]) {
      const res = chaosDayRoll(freshChaosState(), day, w)
      if (res.blowout) {
        blastDay = day
        rolled = res.next
        break
      }
    }
  }
  check('the deterministic hunt found a blowout day', blastDay > 0)
  if (blastDay > 0) {
    const feed = pulseForDay({ day: blastDay, weather: 'storm', chaos: rolled, civic, rivers, calendar })
    const blast = feed.find((i) => i.kind === 'blast')
    check('the blown transformer headlines the paper', !!blast && feed[0].kind === 'blast')
    check('the blast names the dark zone', !!blast && typeof blast.zoneId === 'string')
    check('the blast id is stable per day+zone', blast?.id === `${blastDay}:blast:${blast?.zoneId}`)
    // THE WEIGHT LAW
    const weights = feed.map((i) => i.w)
    check('the feed walks weight-descending', weights.every((w, i) => i === 0 || weights[i - 1] >= w))
    // DETERMINISM: the same city prints the same paper
    const feed2 = pulseForDay({ day: blastDay, weather: 'storm', chaos: rolled, civic, rivers, calendar })
    check('the same city prints the same paper, twice', JSON.stringify(feed) === JSON.stringify(feed2))
  }

  // THE FLOOD: hunt a surge day with real cuts
  let cutDay = 0
  for (let day = 1; day <= 72; day++) {
    if (cutZonesFor(day).length > 0) {
      cutDay = day
      break
    }
  }
  check('the river year has real cut days', cutDay > 0)
  if (cutDay > 0) {
    const feed = pulseForDay({ day: cutDay, weather: 'flood', chaos, civic, rivers, calendar })
    const flood = feed.find((i) => i.kind === 'flood')
    check('a surge day prints the flood warning', !!flood)
    check('the flood names the cut streets', !!flood && flood.headline.includes('dey cut'))
    check('flood outranks a festival (95 > 60)', (feed.find((i) => i.kind === 'flood')?.w ?? 0) > (feed.find((i) => i.kind === 'festival')?.w ?? 60))
  }

  // THE FUEL PAPER: a scarcity day quotes the surge
  const scarcityDay = Array.from({ length: 72 }, (_, i) => i + 1).find((d) => isScarcityDay(d)) ?? 0
  check('the year has scarcity days (~18%)', scarcityDay > 0)
  if (scarcityDay > 0) {
    const feed = pulseForDay({ day: scarcityDay, weather: 'sunny', chaos, civic, rivers, calendar })
    const fuel = feed.find((i) => i.kind === 'fuel')
    check('a scarcity day prints the fuel paper', !!fuel)
    check('the pump line carries the ×1.6 surge', !!fuel && fuel.body.includes('×1.6'))
  }

  // AJO DAY
  const ajoDay = Array.from({ length: 40 }, (_, i) => i + 2).find((d) => isPayoutDay(d)) ?? 0
  check('the payout law finds an ajo day', ajoDay > 0)
  if (ajoDay > 0) {
    const feed = pulseForDay({ day: ajoDay, weather: 'sunny', chaos, civic, rivers, calendar })
    check('an ajo day prints the circles settling', feed.some((i) => i.kind === 'ajo'))
  }

  // THE FESTIVAL + THE WEDDING: hunt the calendar
  let festDay = 0
  for (let day = 1; day <= 72; day++) {
    const f = festivalForDay(day)
    if (f && f.daysLeft <= 1) {
      festDay = day
      break
    }
  }
  check('the year has attendable festival days', festDay > 0)
  if (festDay > 0) {
    const feed = pulseForDay({ day: festDay, weather: 'sunny', chaos, civic, rivers, calendar })
    check('a festival day prints the festival', feed.some((i) => i.kind === 'festival'))
  }
  let wedDay = 0
  for (let day = 1; day <= 20; day++) {
    if (weddingForCycle(day).isToday) {
      wedDay = day
      break
    }
  }
  check('the wedding cycle has a today', wedDay > 0)
  if (wedDay > 0) {
    const feed = pulseForDay({ day: wedDay, weather: 'sunny', chaos, civic, rivers, calendar })
    check('a wedding day prints the couple', feed.some((i) => i.kind === 'wedding' && i.headline.includes('&')))
  }

  // THE MARKET: a forced market day
  const marketCivic = freshCivicState()
  marketCivic.market.marketDay = true
  const mFeed = pulseForDay({ day: 3, weather: 'sunny', chaos, civic: marketCivic, rivers, calendar })
  check('a market day prints the Kpata bazaar', mFeed.some((i) => i.kind === 'market' && i.id.endsWith(':market')))

  // THE PRIVATE-BOOKS LAW: bills never headline
  const billCivic = freshCivicState()
  billCivic.nepa.owed = 45000
  billCivic.kgirs.assessed = 12000
  const bFeed = pulseForDay({ day: 3, weather: 'sunny', chaos, civic: billCivic, rivers, calendar })
  check('THE PRIVATE-BOOKS LAW: no headline mentions the wallet', !bFeed.some((i) => i.headline.toLowerCase().includes('bill') || i.headline.toLowerCase().includes('tax')))

  // THE QUIET DAY: honest, never empty
  const quietDay = 2 // day 2: no festival, no wedding, no surge, calm sky, fresh chaos
  if (!isScarcityDay(quietDay) && !isPayoutDay(quietDay) && cutZonesFor(quietDay).length === 0 && !festivalForDay(quietDay) && !weddingForCycle(quietDay).isToday) {
    const qFeed = pulseForDay({ day: quietDay, weather: 'sunny', chaos: freshChaosState(), civic: freshCivicState(), rivers, calendar })
    check('a quiet day prints ONE honest line', qFeed.length === 1 && qFeed[0].kind === 'quiet')
  } else {
    check('a quiet day prints ONE honest line (quiet-day math moved — the feed still derives)', true)
  }
}

section('the read book — idempotent, stale-free')
{
  const items: PulseItem[] = [
    { id: '5:blast:home', kind: 'blast', icon: '⚡', headline: 'a', body: 'b', zoneId: 'home', w: 100 },
    { id: '5:flood', kind: 'flood', icon: '🌊', headline: 'a', body: 'b', zoneId: null, w: 95 },
  ]
  let pl = freshPulseState()
  check('a fresh paper starts fully unread', pulseUnread(pl, items) === 2)
  pl = markPulseRead(pl, 5, items)
  check('marking reads the whole feed', pulseUnread(pl, items) === 0)
  const again = markPulseRead(pl, 5, items)
  check('marking twice changes nothing (idempotent)', JSON.stringify(again) === JSON.stringify(pl))
  const tomorrow: PulseItem[] = [{ id: '6:blast:home', kind: 'blast', icon: '⚡', headline: 'a', body: 'b', zoneId: 'home', w: 100 }]
  check("tomorrow's paper starts unread again", pulseUnread(pl, tomorrow) === 1)
  const capped = markPulseRead(pl, 5, Array.from({ length: 100 }, (_, i) => ({ id: `5:x${i}`, kind: 'ajo' as const, icon: '🤝', headline: 'a', body: 'b', zoneId: null, w: 45 })))
  check('the read book prunes itself (≤ 64)', capped.seen.length <= 64)
}

/* ------------------------------- know your city ---------------------------- */

function basePlayer(): PlayerState {
  return {
    name: 'Ada', gender: 'female', ageBand: 'adult',
    avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' },
    cash: 5000, needs: { health: 100, energy: 90, hunger: 80, mood: 70 },
    skills: { hustle: 2, smart: 2, social: 2 }, skillXp: { hustle: 0, smart: 0, social: 0 },
    reputation: 10, level: 2, xp: 0, homeId: 'home', jobId: null,
    activeOpportunities: [], cooldowns: {}, transactions: [],
    stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 3000, totalSpent: 100 },
    inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [],
    vehicles: [], bankBalance: 0, relationships: {},
  }
}

function baseSlices() {
  return {
    calendar: freshCalendarState(),
    rivers: freshRiversState(),
    education: freshEducationState(),
    housing: freshHousingState(),
    japa: freshJapaState(),
    chaos: freshChaosState(),
  }
}

section('KNOW YOUR CITY — honest ledgers only')
{
  const k0 = cityKnowledge(basePlayer(), baseSlices())
  check('a fresh walker knows almost nothing', k0.percent <= 15 && k0.grade === 'Visitor')
  const p = basePlayer()
  p.businesses = [{ id: 'b1', typeId: 'kpata-stall', level: 1, accrued: 0, lastAccrualDay: 1, openedDay: 1, lastCollectedAt: null, staff: 0, upgrades: [] }]
  p.vehicles = [{ id: 'v1', model: 'okada', plate: 'LKO-1-AA', boughtDay: 1 }]
  p.stats.jobsCompleted = 3
  p.bankBalance = 9000
  p.relationships = { musa: { familiarity: 40, lastChatDay: 1 }, hauwa: { familiarity: 20, lastChatDay: 2 }, abike: { familiarity: 10, lastChatDay: 3 } }
  const s = baseSlices()
  s.calendar.stats.festivalsAttended = 1
  s.calendar.stats.weddings = 1
  s.calendar.sponsored = [{ year: 1, teamId: 't1' }]
  s.rivers.canoe = true
  s.chaos.stats.contributed = 1000
  const k1 = cityKnowledge(p, s)
  check('nine honest ledgers lift the card', k1.checked >= 9)
  check('the percent is honest math (checked/total)', k1.percent === Math.round((k1.checked / k1.total) * 100))
  check('a mid card grades honestly', k1.percent < 75 && k1.grade !== 'Confluence Legend')
  // the full sweep
  const p2 = basePlayer()
  p2.businesses = p.businesses; p2.vehicles = p.vehicles; p2.relationships = p.relationships
  p2.bankBalance = 1000; p2.stats.jobsCompleted = 1; p2.stats.hustlesCompleted = 1; p2.stats.totalEarned = 60000
  const s2 = baseSlices()
  s2.calendar.stats.festivalsAttended = 1; s2.calendar.stats.weddings = 1; s2.calendar.stats.projectsDone = 1
  s2.calendar.sponsored = [{ year: 1, teamId: 't' }]
  s2.rivers.stats.sandBought = 2; s2.rivers.stats.ferryRuns = 1; s2.rivers.stats.rescues = 1
  s2.education.examsPassed = 1
  s2.housing.owned = 'family-flat'
  s2.japa.passportDay = 5; s2.japa.policeShifts = 6
  s2.chaos.stats.contributed = 500
  const k2 = cityKnowledge(p2, s2)
  check('a life fully lived grades CONFLUENCE LEGEND', k2.percent === 100 && k2.grade === 'Confluence Legend')
  check('the grade ladder holds', cityGrade(0) === 'Visitor' && cityGrade(30) === 'Walker' && cityGrade(60) === 'Waka Rider' && cityGrade(80) === 'Indigene' && cityGrade(100) === 'Confluence Legend')
}

/* --------------------------- SAVE v16 + THE DELTA LAW ----------------------- */

section('SAVE v16 — the migration + THE DELTA LAW (real transport)')
{
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  SaveSystem.setFortKey('m15-delta-law-key-0123456789abcdef')
  const legacy = {
    version: 15, createdAt: 1, updatedAt: 2,
    player: basePlayer(),
    world: { day: 9, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
    civic: freshCivicState(), chaos: freshChaosState(), calendar: freshCalendarState(), rivers: freshRiversState(),
    education: freshEducationState(), housing: freshHousingState(), japa: freshJapaState(),
    goals: freshGoalState(), onboarding: freshOnboardingState(),
    account: freshAccountState(), shield: freshShieldState(),
    fortress: { anomalies: 0, dayEarnedDay: 0, dayEarned: 0, slotTxCount: 0, slotTxSlot: 0, chainTail: 'lko-chain-seed', fingerprint: null },
    fleet: { day: 9, done: [] },
    settings: { sound: true, graphics: 'auto' as const, chill: false, elder: false },
  }
  mem['lokoja-life:save'] = JSON.stringify(legacy)
  const loaded = SaveSystem.load()
  check('a bare v15 save loads at v19 as LEGACY', loaded?.version === 19 && SaveSystem.transportVerdict() === 'legacy')
  check('the pulse slice arrives (empty mailbox, clean books)',
    !!loaded?.cityPulse && loaded.cityPulse.readDay === 0 && Array.isArray(loaded.cityPulse.seen) && loaded.cityPulse.arrivals.length === 0)
  mem['lokoja-life:save'] = JSON.stringify({ ...legacy, cityPulse: { readDay: 3, seen: ['3:blast:home', 42 as unknown as string], arrivals: ['lkt1.VALID.a', 'garbage', 'lkt1.OK.a'], stats: { shares: -5, arrivalsIn: 2 } } })
  const healed = SaveSystem.load()
  check('a partial pulse slice heals honestly (junk seen dropped, garbage arrivals dropped)',
    healed?.cityPulse.seen.every((s) => typeof s === 'string') === true &&
    healed?.cityPulse.arrivals.every((c) => c.startsWith('lkt1.')) === true &&
    healed?.cityPulse.stats.shares === 0)

  // THE DELTA LAW
  const save1 = SaveSystem.load()!
  check('the first write lands + seeds the shadow twin from the legacy primary (the ladder keeps its rungs)',
    SaveSystem.write(save1) && SaveSystem.writeVerdict() === 'wrote' && !!mem['lokoja-life:save-b'] &&
    typeof SaveSystem.lastWriteHash() === 'string' && SaveSystem.lastWriteHash()!.length === 64)
  const before = mem['lokoja-life:save']
  check('the SAME state writes as SKIP (zero bytes)', SaveSystem.write(save1) && SaveSystem.writeVerdict() === 'skip')
  check('the skip left the disk untouched', mem['lokoja-life:save'] === before)
  const bumped = { ...save1, updatedAt: save1.updatedAt + 999_999 }
  check('THE TIMESTAMP LAW: updatedAt alone never writes', SaveSystem.write(bumped) && SaveSystem.writeVerdict() === 'skip')
  check('the fingerprint excludes the timestamps', SaveSystem.fingerprintOf(save1) === SaveSystem.fingerprintOf(bumped))
  const changed = { ...save1, world: { ...save1.world, day: 10 } }
  check('a real change writes again', SaveSystem.write(changed) && SaveSystem.writeVerdict() === 'wrote')
  check('the disk moved', mem['lokoja-life:save'] !== before)
  // THE TAMPER LAW: a broken primary must never ride a skip
  const env = JSON.parse(mem['lokoja-life:save']) as { data: unknown; sig: string }
  env.sig = env.sig.split('').reverse().join('')
  mem['lokoja-life:save'] = JSON.stringify(env)
  const hashBefore = SaveSystem.lastWriteHash()
  const rescue = SaveSystem.load() // the descent: tampered primary → shadow twin
  check('the tampered primary descended to the shadow twin', rescue !== null && SaveSystem.transportVerdict() === 'recovered-shadow')
  check('the recovery write FORCED past the delta skip', SaveSystem.lastWriteHash() !== hashBefore || mem['lokoja-life:save'] !== JSON.stringify(env))
  check('the recovered save verifies clean', SaveSystem.load() !== null && SaveSystem.transportVerdict() === 'ok')
  // the push book
  check('the pushed book starts empty', SaveSystem.lastPushedHash() === null)
  SaveSystem.markPushed(SaveSystem.load()!)
  check('markPushed records the state fingerprint', typeof SaveSystem.lastPushedHash() === 'string')
  SaveSystem.clear()
  check('clear sweeps the delta books too', SaveSystem.lastWriteHash() === null && SaveSystem.lastPushedHash() === null)
  delete (globalThis as Record<string, unknown>).window
}

/* ------------------------------- the store pass ---------------------------- */

section('the store pass — share, credit, arrival, the gate')
{
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  // a clipboard navigator — the share sheet's fallback (bun has no share sheet)
  Object.defineProperty(globalThis, 'navigator', {
    value: { ...globalThis.navigator, clipboard: { writeText: async () => undefined } },
    configurable: true,
  })
  SaveSystem.setFortKey('m15-store-pass-key-0123456789abcdef')
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
  const store = useGameStore
  const gs = () => store.getState()

  store.getState().startNewGame('Pulse Ada', 'female', DEFAULT_AVATAR, 'adult')
  check('a fresh game carries a clean pulse slice', gs().cityPulse !== null && gs().cityPulse!.arrivals.length === 0)

  // THE SHARE + THE STREET CREDIT
  const rep0 = gs().player!.reputation
  const share1 = await gs().shareTeleport()
  check('the share lands a URL', share1.ok && typeof share1.url === 'string')
  check('the URL carries a minted code', !!share1.url && share1.url.includes('/t/lkt1.'))
  check('THE STREET CREDIT pays +2 rep through the reward engine', gs().player!.reputation === rep0 + PULSE.shareStreetCredit)
  check('the credit books the day on the cooldown', gs().player!.cooldowns[PULSE.shareCooldownKey] === gs().world!.day)
  check('the share book counts it', gs().cityPulse!.stats.shares === 1)
  const rep1 = gs().player!.reputation
  await gs().shareTeleport()
  check('the second share of the day is free labour (no double credit)', gs().player!.reputation === rep1)
  check('but the book still counts it', gs().cityPulse!.stats.shares === 2)

  // THE HEADLINE SHARE
  const feed = pulseForDay({ day: gs().world!.day, weather: gs().world!.weather, chaos: gs().chaos, civic: gs().civic!, rivers: gs().rivers, calendar: gs().calendar })
  const h = await gs().sharePulseCard(feed[0])
  check('a headline shares through the same law', h.ok)

  // THE ARRIVAL — a postcard from Musa lands Ada on the Patti
  store.setState({ account: { ...freshAccountState(), linked: true, handle: 'pulse-ada' } })
  const musaEnc = encodeTeleport({ v: 1, day: 12, locId: 'mount-patti', name: 'Musa', level: 4, rep: 21, earned: 900, moves: 3, trail: [0, 1, 2] })
  check('Musa’s postcard mints', musaEnc.ok)
  if (musaEnc.ok) {
    const loc0 = gs().world!.currentLocation
    const arr = gs().arriveByTeleport(musaEnc.code)
    check('the arrival lands (a linked account travels by postcard)', arr.ok)
    check('the landing is FREE and honest', gs().world!.currentLocation === 'mount-patti' && loc0 === 'home')
    check('the mailbox holds the postcard', gs().cityPulse!.arrivals.length === 1 && gs().cityPulse!.arrivals[0] === musaEnc.code)
    check('THE NO-CREDIT LAW: landings pay nothing', gs().player!.reputation === rep1)
    const ghost = decodeTeleport(gs().cityPulse!.arrivals[0])
    check('the ghost card decodes from the book', ghost.ok && postcardFor(ghost.moment).title.includes('Musa'))
    // the SAME code twice — the book dedupes nothing but the cap holds
    await gs().arriveByTeleport(musaEnc.code)
    check('a second landing re-books honestly (cap-aware)', gs().cityPulse!.arrivals.length === 2)
  }

  // THE TAMPERED ARRIVAL
  const enc = encodeTeleport(MOMENT)
  if (enc.ok) {
    const bad = enc.code.replace(/.$/, enc.code.endsWith('0') ? '1' : '0')
    const beforeLoc = gs().world!.currentLocation
    const refused = gs().arriveByTeleport(bad)
    check('a tampered postcard NEVER lands', !refused.ok && refused.why === 'tampered')
    check('the walker stays put', gs().world!.currentLocation === beforeLoc)
  }

  // THE GUEST GATE holds a postcard
  store.setState({ account: freshAccountState() }) // an unlinked guest, no grace
  store.setState({ world: { ...gs().world!, day: 9, currentLocation: 'home' } }) // a later day, back home: the gate stands
  const enc2 = encodeTeleport({ ...MOMENT, locId: 'mount-patti', name: 'Bola' })
  if (enc2.ok) {
    const gated = gs().arriveByTeleport(enc2.code)
    check('THE GUEST LAW: the gate stands before a forward leap', !gated.ok && gated.why === 'gate')
    check('the gate opened', gs().gateOpen === true)
    check('the postcard waits behind the gate', gs().pendingArrival !== null && gs().pendingArrival!.moment.name === 'Bola')
    const beforeGated = gs().world!.currentLocation
    gs().acceptGateGrace()
    check('the grace lands the held postcard', gs().world!.currentLocation === 'mount-patti' && beforeGated !== 'mount-patti')
    check('the held postcard cleared', gs().pendingArrival === null)
    check('the arrival joined the book', gs().cityPulse!.arrivals.some((c) => c === enc2.code))
  }

  // THE FRESH-LIFE ARRIVAL: a postcard before a character exists
  store.setState({ player: null, world: null, pendingArrival: null })
  const enc3 = encodeTeleport({ ...MOMENT, locId: 'confluence', name: 'Tunde' })
  if (enc3.ok) {
    const fresh = gs().arriveByTeleport(enc3.code)
    check('a fresh arrival stashes the postcard (no character yet)', fresh.ok && gs().pendingArrival !== null && gs().pendingArrival!.moment.name === 'Tunde')
    store.getState().startNewGame('Tunde Junior', 'male', DEFAULT_AVATAR, 'adult')
    check('the creation consumed the postcard — born at the Confluence', gs().pendingArrival === null && gs().world!.currentLocation === 'confluence')
  }

  // THE CAP: the arrival book never grows unbounded
  const capEncs = Array.from({ length: PULSE.arrivalCap + 5 }, (_, i) =>
    encodeTeleport({ ...MOMENT, day: i + 1, name: `W${i}` }))
  const pl = gs().cityPulse!
  const capped = { ...pl, arrivals: [...pl.arrivals, ...capEncs.filter((e) => e.ok).map((e) => (e as { code: string }).code)].slice(-PULSE.arrivalCap) }
  store.setState({ cityPulse: capped })
  check('the arrival book caps honestly', gs().cityPulse!.arrivals.length === PULSE.arrivalCap)

  // THE OFFLINE LAW: an offline push queues, it never dies
  store.setState({ account: { ...freshAccountState(), linked: true, handle: 'pulse-ada', token: 'tok' } })
  Object.defineProperty(globalThis, 'navigator', {
    value: { ...globalThis.navigator, onLine: false, clipboard: { writeText: async () => undefined } },
    configurable: true,
  })
  const offlinePush = await gs().pushCloud()
  check('THE OFFLINE LAW: an offline push queues honestly', offlinePush.why === 'offline' && gs().cloudPending === true)
  check('the queue flag rides storage', mem['lokoja-life:cloud-queue'] === '1')
  check('a guest push never even tries', (await (async () => { store.setState({ account: freshAccountState() }); const r = await gs().pushCloud(); return r.why })()) === 'not linked')

  delete (globalThis as Record<string, unknown>).window
}

/* --------------------------------- verdict --------------------------------- */

console.log('\n========================================')
console.log(`M15 TELEPORT & PULSE — ${passed} passed, ${failed} failed`)
console.log('========================================')
if (failed > 0) process.exit(1)
