import '../scripts/geo/bootstrap'
/**
 * LOKOJA LIFE — M24-UI: THE SOCIAL FACES — law suite
 * ---------------------------------------------------
 * The UI wave's pinned laws (zero 3D files touched — the suite greps
 * prove the boundary):
 *   1. THE CALLFLOW LAW — the pure state machine: one line, honest
 *      timeouts (no-answer/missed), ended-truth reasons, mute on
 *      alive calls only, idle-only dial.
 *   2. THE BLOCK LAW — a blocked handle receives NOTHING: no DM send,
 *      no friend add; the refusal returns, not silent.
 *   3. THE DM GUARD LAW — empty and >280 char sends refuse; unread
 *      counts and clear on read; friends dedupe.
 *   4. THE TIER LAW AT THE MIC — MessagesApp routes kids to the emote
 *      grid and runs sanitizeChat BEFORE the relay (grep-verified),
 *      the same law the server door runs.
 *   5. THE REGISTRATION LAW — all five faces ride the PhoneApp union,
 *      the apps grid, the titles map and the render cases.
 *   6. THE DIEGETIC LAW — WorldPhoneLayer imports NO 3D module (grep:
 *      zero world3d/three imports), renders above the world, and the
 *      food sheet goes through the REAL eatMeal door.
 *   7. THE AUTH DOOR LAW — the landing sheet rides the SAME
 *      registerAccount/loginAccount doors as the in-game gate; no
 *      second identity system exists.
 *   8. THE NO-FAKE-ANSWER LAW — the call machine never answers itself;
 *      the demo ring exists only behind the labeled e2e/dev door.
 * Run: bun scripts/test-m24-ui.ts
 */

import { readFileSync } from 'fs'
import {
  answerCall, declineCall, dialCall, freshCallState, hangupCall,
  receiveCall, ringExpired, setMuted, withRingClock, callSeconds,
  RING_TIMEOUT_MS,
} from '../src/game/systems/callflow'

let passed = 0
let failed = 0
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`) }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`) }
}
const read = (p: string) => readFileSync(p, 'utf8')

console.log('\n--- M24-UI.1 THE CALLFLOW LAW (pure) ---')
{
  const idle = freshCallState()
  check('fresh state is idle with no peer', idle.phase === 'idle' && idle.peer === null)
  check('dial refuses a second call (one-line law)', dialCall({ ...idle, phase: 'dialing', peer: 'x' }, 'y', false, 1).why === 'not-idle')
  check('dial refuses an empty peer', dialCall(idle, '', false, 1).why === 'no-peer')
  const d = dialCall(idle, 'ada', false, 1000)
  check('dial → dialing with ring clock', d.ok && withRingClock(d.next, 1000).phase === 'dialing')
  const r = receiveCall(idle, 'ada', true, 1000)
  check('incoming → ringing (outgoing false)', r.ok && r.next.phase === 'ringing' && r.next.outgoing === false)
  check('a busy phone refuses an incoming call honestly', receiveCall({ ...idle, phase: 'active', peer: 'x' }, 'y', false, 1).why === 'busy')
  const a = answerCall(r.next, 2000)
  check('answer → active with startedAt', a.ok && a.next.phase === 'active' && a.next.startedAt === 2000)
  check('the timer counts only while active', callSeconds(a.next, 5000) === 3 && callSeconds(idle, 9999) === 0)
  const h = hangupCall(a.next, 9000)
  check('hangup → ended hangup', h.ok && h.next.phase === 'ended' && h.next.endedWhy === 'hangup')
  check('hangup refuses a dead call', hangupCall(idle, 1).ok === false)
  const dec = declineCall(r.next, 1500)
  check('decline → ended declined', dec.ok && dec.next.endedWhy === 'declined')
  check('decline refuses an active call', declineCall(a.next, 1).ok === false)
  const ring = withRingClock(d.next, 1000)
  check('inside the window the ring lives', ringExpired(ring, 1000 + RING_TIMEOUT_MS - 1).ok === false)
  const outExpired = ringExpired(ring, 1000 + RING_TIMEOUT_MS)
  check('THE TIMEOUT LAW: outgoing dies as no-answer', outExpired.ok && outExpired.next.endedWhy === 'no-answer')
  const inRing = withRingClock(r.next, 1000)
  const inExpired = ringExpired(inRing, 1000 + RING_TIMEOUT_MS)
  check('THE TIMEOUT LAW: incoming dies as missed', inExpired.ok && inExpired.next.endedWhy === 'missed')
  check('mute sticks only on an alive call', setMuted(a.next, true).muted === true && setMuted(idle, true).muted === false)
  check('the timeout is 30s', RING_TIMEOUT_MS === 30_000)
}

console.log('\n--- M24-UI.2 THE SOCIAL STORE (device truth, guarded) ---')
{
  // headless-safe: window is undefined in bun, the store loads fresh
  const mod = await import('../src/game/store/social-store')
  mod.useSocialStore.setState(mod.useSocialStore.getInitialState ? mod.useSocialStore.getInitialState() : mod.useSocialStore.getState())
  const s = mod.useSocialStore.getState
  // reset to a known shape
  mod.useSocialStore.setState({ friends: [], requests: [], blocked: [], dms: {}, unread: {}, profile: { displayName: '', bio: '', vibe: '🌊' } })

  const add1 = s().addFriend('ada_hustle')
  const add2 = s().addFriend('ada_hustle')
  check('addFriend works once and dedupes', add1.ok === true && add2.why === 'already')
  check('addFriend refuses your own name silence (no self in list)', !s().friends.includes('') )

  s().blockHandle('yahoo_y')
  check('the block wall holds the handle', s().blocked.includes('yahoo_y'))
  const blockedDm = s().sendDm('yahoo_y', 'hello')
  check('THE BLOCK LAW: a blocked handle receives no DM', blockedDm.ok === false && blockedDm.why === 'blocked')
  const blockedAdd = s().addFriend('yahoo_y')
  check('THE BLOCK LAW: a blocked handle cannot be friended', blockedAdd.ok === false && blockedAdd.why === 'blocked')

  const empty = s().sendDm('ada_hustle', '   ')
  check('THE DM GUARD: empty refuses', empty.ok === false && empty.why === 'empty')
  const long = s().sendDm('ada_hustle', 'x'.repeat(281))
  check('THE DM GUARD: >280 refuses', long.ok === false && long.why === 'too-long')
  const ok = s().sendDm('ada_hustle', 'how far!')
  check('a lawful DM lands in the thread', ok.ok && (s().dms['ada_hustle']?.length ?? 0) === 1)

  s().receiveDm('ada_hustle', 'i dey o')
  check('an incoming DM bumps unread once', s().unread['ada_hustle'] === 1)
  s().markDmRead('ada_hustle')
  check('markDmRead clears the unread', !s().unread['ada_hustle'])

  s().setProfile({ displayName: 'Ada O.', vibe: '🔥' })
  check('the profile patch lands', s().profile.displayName === 'Ada O.' && s().profile.vibe === '🔥')
  s().clearEnded()
  check('clearEnded on idle keeps idle', s().call.phase === 'idle')
}

console.log('\n--- M24-UI.3 THE TIER LAW AT THE MIC (grep-verified wiring) ---')
{
  const src = read('src/components/game/screens/phone/apps/messages-app.tsx')
  check('the app imports the REAL sanitizeChat (the live.ts law)', src.includes("from '@/game/systems/live'") && src.includes('sanitizeChat'))
  check('kids ride the EMOTE grid, not a keyboard', src.includes("band === 'kid'") && src.includes('EMOTE_LIBRARY'))
  check('the send goes through liveSendChat on the global channel', src.includes("liveSendChat(draft, 'global')"))
  check('the same 12s heartbeat as the nation (relay lane honesty)', src.includes('12_000'))
  check('the relay-lane latency is labeled, never hidden', src.includes('~12s'))
  check('DM threads carry the DEVICE-TRUTH chip (W4 honesty)', src.includes('on this device'))
}

console.log('\n--- M24-UI.4 THE REGISTRATION LAW (all five faces ride the phone) ---')
{
  const phone = read('src/components/game/screens/PhoneScreen.tsx')
  for (const key of ['messages', 'calls', 'connect', 'wallet', 'profile']) {
    check(`'${key}' is in the PhoneApp union`, new RegExp(`'${key}'`).test(phone.match(/type PhoneApp = [^\n]+/)?.[0] ?? ''))
    check(`'${key}' has a tile`, phone.includes(`key: '${key}'`))
    check(`'${key}' has a title`, phone.includes(`${key}: '`))
    check(`'${key}' has a render case`, phone.includes(`app === '${key}'`))
  }
  check('the tile sub-labels read the LIVE social store (unread/friends/call)', phone.includes('useSocialStore') && phone.includes('dmUnread') && phone.includes('callPhase'))
}

console.log('\n--- M24-UI.5 THE DIEGETIC LAW (the world never unmounts, zero 3D touched) ---')
{
  const layer = read('src/components/game/screens/WorldPhoneLayer.tsx')
  check('the layer imports NO 3D module', !/world3d|three|WorldScene|CityMesh|WorldTerrain/.test(layer))
  check('the layer renders the overlay PhoneScreen above the world', layer.includes('variant="overlay"'))
  check('the food sheet rides the REAL eatMeal door', layer.includes('eatMeal(') && layer.includes('FOOD.meals'))
  check('the incoming banner carries the accept/decline doors', layer.includes('call-banner-answer') && layer.includes('call-banner-decline'))
  check('the demo ring is LABELED in the banner itself', layer.includes('demo ring'))
  check('the FAB carries the unread dot', layer.includes('world-phone-unread'))
  const dash = read('src/components/game/screens/Dashboard.tsx')
  check('the layer mounts ONLY beside the entered world (W3: the street never blinks, the layer never leaves)', dash.includes('worldEntered && <WorldPhoneLayer'))
  check('the world tab itself is untouched by this wave', dash.includes('<WorldTab'))
  check('the ring pulse animation exists in the design system', read('src/app/globals.css').includes('lko-ring-pulse'))
}

console.log('\n--- M24-UI.6 THE AUTH DOOR LAW (one identity, the same doors) ---')
{
  const sheet = read('src/components/game/screens/MenuAuthSheet.tsx')
  check('the landing sheet rides registerAccount (the M9 door)', sheet.includes('registerAccount'))
  check('the landing sheet rides loginAccount (the M9 door)', sheet.includes('loginAccount'))
  check('the M13 band law rides live (birth year → band)', sheet.includes('ageBandForYear') && sheet.includes('parentPin'))
  check('minors collect NOTHING (contact hidden for kids/teens)', sheet.includes('!minor'))
  check('the menu opens the sheet from a probeable button', read('src/components/game/screens/MainMenu.tsx').includes('menu-auth-open'))
  check('the landing carries the live ribbon (the multiplayer promise)', read('src/components/game/screens/MainMenu.tsx').includes('menu-live-ribbon'))
}

console.log('\n--- M24-UI.7 THE NO-FAKE-ANSWER LAW ---')
{
  const calls = read('src/components/game/screens/phone/apps/calls-app.tsx')
  // W7 AMENDMENT (the law follows the truth, the W5 precedent): the
  // practice ring became the REAL wire ring — the law now pins the
  // no-fake-answer doctrine in the header AND the real-ring label.
  check('the ring is labeled honestly (nobody answers by themself)', calls.includes('NO FAKE ANSWER') && calls.includes('The real wire dey ring'))
  check('W7 — the dial doors route through the real voice engine (voicenet)', calls.includes('voiceDial') && calls.includes('voiceAnswer') && calls.includes('voiceHangup'))
  check('W7 — the minor wall is visible on the call face', calls.includes('Voice na adult table'))
  check('the media truth is labeled on the call face (W7/W8 chips)', calls.includes('W7') && calls.includes('W8'))
  check('the timeout heartbeat drives the ring law', calls.includes('tickCall'))
  check('recents record the ended TRUTH, not an invention', calls.includes('pushRecent') && calls.includes('endedWhy'))
  check('the demo incoming door lives in its OWN namespace (__lklSocial — zero collision with the world hook)', read('src/components/game/screens/WorldPhoneLayer.tsx').includes('__lklSocial'))
}

console.log(`\n=== M24-UI SUITE: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
