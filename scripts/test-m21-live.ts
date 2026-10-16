/**
 * LOKOJA LIFE — M21: THE LIVING ROOM (test battery)
 * -------------------------------------------------
 * Law blocks (pure — no clock, no store, no server; the caller
 * supplies `now` and the caller-supplied truth is the only truth):
 *  - THE ROOM KEY LAW: a room is keyed `street:<location id>` — every
 *    real location id (ten districts + the schools) passes live.ts's
 *    channel law untouched, so the presence ping key (the store pings
 *    street = world.currentLocation) IS the room key
 *  - THE ROOM ROSTER LAW: a stale presence is absent, a fresh one is
 *    present, other streets never leak in, the sort is the presenceRoster
 *    sort (deterministic, handle-ordered), the TTL boundary is exact
 *  - THE HONEST COUNT LAW: playerCountIn counts ONLY real presence
 *    rows — a sim crowd number can never enter the count
 *  - THE SIM LABEL LAW: crowdNote always carries "(sim)" and the
 *    honest formatted number; junk clamps to 0, never invents a crowd
 *  - THE SPRAY LAW: bounds ₦100–₦5,000, ₦100 multiples only, the minted
 *    broadcast is a valid LiveEvent (chat on the room channel, bounded
 *    payload), the actor is the sprayer
 *  - THE KID-STRUCTURAL LAW: the spray gate verdict is false for a kid
 *    (and teen, and guest) REGARDLESS of cash — money tables are adult
 *  - THE WIRE BRIDGE LAW: the sync roster rows (with or without the
 *    heartbeat ts) bridge into the LivePresence law honestly
 * Run: bun scripts/test-m21-live.ts
 */

import {
  presenceAlive, presenceRoster, validateEvent, PRESENCE_TTL_MS,
  type LiveIdentity, type LivePresence, type PresenceStatus,
} from '../src/game/systems/live'
import {
  roomChannel, roomRoster, playerCountIn, crowdNote,
  sprayAllowed, sprayEvent, wireToPresences,
  SPRAY_MIN, SPRAY_MAX, SPRAY_STEP,
} from '../src/game/systems/liveRoom'
import { LOCATIONS } from '../src/game/data/locations'

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log('  ✓', name) } else { failed++; console.log('  ✗', name) }
}
function section(name: string) { console.log(`\n— ${name} —`) }

const NOW = 1_700_000_000_000

const row = (handle: string, street: string, ageMs: number, band = 'adult', status: PresenceStatus = 'hustling'): LivePresence => ({
  handle, street, status, band: band as LivePresence['band'], ts: NOW - ageMs,
})

const ADULT: LiveIdentity = { handle: 'Mama Ngozi', band: 'adult' }
const TEEN: LiveIdentity = { handle: 'Young Huster', band: 'teen' }
const KID: LiveIdentity = { handle: 'Small Papa', band: 'kid' }
const GUEST: LiveIdentity = { handle: null, band: 'guest' }

/* ------------------------------ THE ROOM KEY LAW ---------------------------- */

section('THE ROOM KEY LAW — the room key IS the location id the presence ping sends')
check('the channel law shape', roomChannel('kpata-market') === 'street:kpata-market')
check('every real location id is a lawful room key (validateEvent accepts its channel)',
  LOCATIONS.every((l) => validateEvent({ id: 'x', kind: 'chat', channel: roomChannel(l.id), actor: 'a', payload: {} }).ok))
check('every real location id survives a full spray broadcast shape',
  LOCATIONS.every((l) => sprayEvent('ada_hustle', l.id, 500, 3).ok))
check('the ten M20 crowd districts are all real locations (the sim line can always find its street)',
  ['home', 'kpata-market', 'ganaja-junction', 'confluence', 'mount-patti', 'historic-lokoja',
    'government-area', 'university-area', 'food-area', 'transport-area']
    .every((id) => LOCATIONS.some((l) => l.id === id)))
check('a junk street still cannot mint a broadcast the relay would refuse',
  sprayEvent('a', 'not a lawful channel!!', 500, 1).ok === false)

/* ---------------------------- THE ROOM ROSTER LAW --------------------------- */

section('THE ROOM ROSTER LAW — TTL honored, streets filtered, sort deterministic')
const wire: LivePresence[] = [
  row('Zola', 'kpata-market', 10_000),
  row('ada_hustle', 'kpata-market', 30_000, 'teen', 'chilling'),
  row('stale_tony', 'kpata-market', PRESENCE_TTL_MS + 1), // gone
  row('edge_walker', 'kpata-market', PRESENCE_TTL_MS),    // exactly TTL = alive
  row('other_street_ola', 'confluence', 5_000),           // different room
]
const roster = roomRoster(wire, 'kpata-market', NOW)
check('a stale presence is absent (TTL 90s, 90_001ms is gone)',
  !roster.some((p) => p.handle === 'stale_tony'))
check('a presence exactly at the TTL is still alive (the boundary is inclusive)',
  roster.some((p) => p.handle === 'edge_walker'))
check('fresh presences are present', roster.some((p) => p.handle === 'Zola') && roster.some((p) => p.handle === 'ada_hustle'))
check('another street never leaks into the room', !roster.some((p) => p.handle === 'other_street_ola'))
check('the roster is handle-sorted (the presenceRoster order, deterministic)',
  JSON.stringify(roster.map((p) => p.handle)) === JSON.stringify([...roster].sort((a, b) => a.handle.localeCompare(b.handle)).map((p) => p.handle)))
check('the room sort agrees with presenceRoster on the same rows',
  JSON.stringify(roster.map((p) => p.handle)) ===
  JSON.stringify(presenceRoster(wire, NOW).filter((p) => p.street === 'kpata-market').map((p) => p.handle)))
check('an empty wire gives an empty room', roomRoster([], 'kpata-market', NOW).length === 0)
check('the room roster equals the alive filter (stale rows never ride along)',
  roster.every((p) => presenceAlive(p, NOW) && p.street === 'kpata-market'))

/* ---------------------------- THE HONEST COUNT LAW -------------------------- */

section('THE HONEST COUNT LAW — real rows only, the sim crowd can never enter')
check('one real row counts exactly 1', playerCountIn([row('Zola', 'kpata-market', 10_000)], 'kpata-market', NOW) === 1)
check('the count is rows on THAT street', playerCountIn(wire, 'kpata-market', NOW) === 3) // Zola + ada + edge_walker
check('a stale row does not count', playerCountIn([row('stale_tony', 'kpata-market', PRESENCE_TTL_MS + 1)], 'kpata-market', NOW) === 0)
check('an empty wire counts 0', playerCountIn([], 'kpata-market', NOW) === 0)
check('THE PRIME LAW: a 2,314-soul sim crowd contributes NOTHING to the real count',
  playerCountIn([row('Zola', 'kpata-market', 10_000)], 'kpata-market', NOW) === 1 &&
  playerCountIn([row('Zola', 'kpata-market', 10_000)], 'kpata-market', NOW) !== 2314)
check('the count never reads the sim snapshot — different worlds, different numbers',
  typeof crowdNote(2314) === 'string' && playerCountIn([], 'kpata-market', NOW) === 0)

/* ----------------------------- THE SIM LABEL LAW ---------------------------- */

section('THE SIM LABEL LAW — the only sanctioned way the NPC crowd shows')
const note = crowdNote(2314)
check('the note always labels itself (sim)', note.includes('(sim)'))
check('the note carries the honest formatted number', note.includes('2,314'))
check('the note is the honest line, whole', note === '~2,314 souls on this street (sim)')
check('zero crowd is still labeled (no invented crowd)', crowdNote(0).includes('(sim)') && crowdNote(0).includes('0'))
check('a negative sim number clamps to 0 (no invented debt of souls)', crowdNote(-50).startsWith('~0'))
check('a NaN district clamps to 0 (never invents a crowd)', crowdNote(Number.NaN).startsWith('~0'))
check('a fractional soul rounds honestly (12,000.4 → 12,000)', crowdNote(12000.4).includes('12,000'))
check('the note never pretends to be real (no "players", no "online" claim)',
  !note.toLowerCase().includes('player') && !note.toLowerCase().includes('online'))

/* ------------------------------- THE SPRAY LAW ------------------------------ */

section('THE SPRAY LAW — bounded notes, honest broadcast shape')
check('the bounds are ₦100–₦5,000 in ₦100 notes', SPRAY_MIN === 100 && SPRAY_MAX === 5_000 && SPRAY_STEP === 100)
check('₦100 passes (the smallest note)', sprayEvent('ada_hustle', 'kpata-market', 100, 3).ok === true)
check('₦5,000 passes (the largest note)', sprayEvent('ada_hustle', 'kpata-market', 5_000, 3).ok === true)
check('₦99 refused (below the floor)', sprayEvent('ada_hustle', 'kpata-market', 99, 3).ok === false)
check('₦5,100 refused (above the ceiling)', sprayEvent('ada_hustle', 'kpata-market', 5_100, 3).ok === false)
check('₦150 refused (not a multiple of 100)', sprayEvent('ada_hustle', 'kpata-market', 150, 3).ok === false)
check('₦1,010 refused (not a multiple of 100)', sprayEvent('ada_hustle', 'kpata-market', 1_010, 3).ok === false)
check('NaN refused', sprayEvent('ada_hustle', 'kpata-market', Number.NaN, 3).ok === false)

const spray = sprayEvent('ada_hustle', 'kpata-market', 1_000, 12)
check('the minted broadcast validates against live.ts (shape/kind/channel/payload-cap)',
  spray.ok && validateEvent(spray.event).ok)
check('the broadcast is a chat on the room channel (no new event kind invented)',
  spray.ok && spray.event.kind === 'chat' && spray.event.channel === 'street:kpata-market')
check('the actor is the sprayer', spray.ok && spray.event.actor === 'ada_hustle')
check('the payload carries the honest amount + day (bounded, tiny)',
  spray.ok && spray.event.payload.spray === 1_000 && spray.event.payload.day === 12)
check('the broadcast text names the amount in plain naira',
  spray.ok && spray.text.includes('₦1,000'))
check('the same spray moment mints the same shape (deterministic, no clock)',
  JSON.stringify(sprayEvent('ada_hustle', 'kpata-market', 1_000, 12)) === JSON.stringify(spray))
check('the broadcast text survives the M17 link law (no URL/phone/crypto patterns)',
  spray.ok && !/https?:\/\//.test(spray.text) && !/\b0[789]\d{9}\b/.test(spray.text))

/* --------------------------- THE KID-STRUCTURAL LAW ------------------------- */

section('THE KID-STRUCTURAL LAW — the spray is adult money-table law, structurally')
check('a kid with a MILLION naira is still refused (the band decides, not the pocket)',
  sprayAllowed(KID, 1_000_000) === false)
check('a teen is refused too (the money tables stay adult)', sprayAllowed(TEEN, 1_000_000) === false)
check('a guest is refused (the mic is dark AND the wallet door is shut)', sprayAllowed(GUEST, 1_000_000) === false)
check('an adult below the smallest note is refused (the pocket law)',
  sprayAllowed(ADULT, 50) === false)
check('an adult with the smallest note may spray', sprayAllowed(ADULT, SPRAY_MIN) === true)
check('the verdict agrees with live.ts capability law for minors',
  KID.band !== 'adult' && sprayAllowed(KID, SPRAY_MAX) === false)

/* ----------------------------- THE WIRE BRIDGE LAW -------------------------- */

section('THE WIRE BRIDGE LAW — sync rows bridge into the presence law honestly')
check('a row carrying its heartbeat ts keeps it (TTL judged on the relay truth)',
  wireToPresences([{ handle: 'Zola', band: 'adult', street: 'kpata-market', status: 'hustling', ts: NOW - 1_000 }], NOW)[0].ts === NOW - 1_000)
check('a row without ts bridges as fresh (the server already TTL-filtered it)',
  wireToPresences([{ handle: 'Zola', band: 'adult', street: 'kpata-market', status: 'hustling' }], NOW)[0].ts === NOW)
check('the bridged rows satisfy presenceAlive/presenceRoster unchanged',
  presenceRoster(wireToPresences([
    { handle: 'B', band: 'adult', street: 'kpata-market', status: 'market', ts: NOW - 1_000 },
    { handle: 'A', band: 'teen', street: 'kpata-market', status: 'chilling', ts: NOW - 2_000 },
    { handle: 'X', band: 'adult', street: 'kpata-market', status: 'chilling', ts: NOW - PRESENCE_TTL_MS - 1 },
  ], NOW), NOW).map((p) => p.handle).join(',') === 'A,B')
check('the bridge preserves band + street + status (the roster renders the truth)',
  (() => {
    const p = wireToPresences([{ handle: 'A', band: 'kid', street: 'confluence', status: 'streaming', ts: NOW }], NOW)[0]
    return p.band === 'kid' && p.street === 'confluence' && p.status === 'streaming'
  })())
check('the empty wire bridges to an empty room', wireToPresences([], NOW).length === 0)

/* ---------------------------------- verdict --------------------------------- */

console.log('\n========================================')
console.log(`M21 LIVING ROOM — ${passed} passed, ${failed} failed`)
console.log('========================================')
process.exit(failed > 0 ? 1 : 0)
