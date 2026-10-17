/**
 * M21 — CONTENT BREADTH: THE TEN APPS' LAW SUITE
 * ----------------------------------------------
 * Run: bun scripts/test-m21-apps.ts
 *
 * The laws under test:
 *  - THE MANIFEST LAW: every M21_APPS entry imports cleanly, carries a
 *    unique id, and agrees with the file's own APP_ID/APP_TITLE/APP_GLYPH.
 *  - THE REGISTRY LAW: no manifest id collides with the phone's EXISTING
 *    app ids (read from PhoneScreen.tsx's own union — no hardcoded copy).
 *  - THE ENGINE LAW: the Whot engine lives in whot-engine.ts — pure
 *    (no react import), and the app file imports it instead of carrying
 *    a second copy of the engine.
 *  - THE DECK LAW: the Whot pack is EXACTLY 54 cards with the exact
 *    per-suit counts (circles 12, triangles 12, squares 9, crosses 9,
 *    stars 7, whots 5) — no 6, no 9, every id unique.
 *  - THE SEED LAW: same (day, matchNo) → the same shuffle AND the same
 *    dealt match; a different seed shuffles differently; the shuffle is
 *    a true permutation.
 *  - THE LEGALITY LAW: suit/number/whot match; a pick-debt is defended
 *    only by the same number; a 20's called suit binds the next hand.
 *  - THE EFFECT LAW: 1/8 hold on, 2 picks two, 5 picks three (stacking),
 *    14 general market, 20 renames the suit — on constructed hands.
 *  - THE TERMINATION LAW: a fully scripted match (both sides greedy)
 *    ends with a real winner inside a bounded number of turns, across
 *    many seeds.
 *  - THE KID WALL: stakeFor('kid') is ₦0 structurally; the table stake
 *    is ₦200 for an adult pocket that can carry it; a broke adult and a
 *    kid both play free — the money door never opens for either.
 *  - THE SANE-DATA LAW: every app's data source yields sane values on a
 *    seeded store state (the REAL store, a REAL new game).
 *  - THE ECONOMY DOOR: the stake pays through removeMoney and the pot
 *    through addMoney — the SAME honest channel gigs and quests pay
 *    through — and the winner's net is exactly +stake.
 */

/* --------------------------- the storage shim ---------------------------- */

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log('  ✓', name) } else { failed++; console.log('  ✗', name) }
}
function section(name: string) { console.log(`\n— ${name} —`) }

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

/* ------------------------------ the imports ------------------------------ */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { M21_APPS } from '../src/components/game/screens/phone/apps/manifest'
import {
  buildDeck,
  whotSeed,
  shuffleDeck,
  dealMatch,
  legalMoves,
  playCard,
  pickFromMarket,
  stakeFor,
  autoTurn,
  npcTurn,
  WHOT_STAKE,
  DECK_LAW,
  type WhotCard,
  type WhotMatch,
} from '../src/components/game/screens/phone/apps/whot-engine'

/* ============================ 1. THE MANIFEST ============================= */

section('M21 · the manifest law')

const HERE = new URL('.', import.meta.url).pathname
const imported: Record<string, { APP_ID: string; APP_TITLE: string; APP_GLYPH: string }> = {}
let allImport = true
for (const entry of M21_APPS) {
  try {
    const mod = (await import(`${'../src/components/game/screens/phone/apps'}/${entry.path.replace('./', '')}.tsx`)) as Record<string, unknown>
    imported[entry.id] = { APP_ID: String(mod.APP_ID), APP_TITLE: String(mod.APP_TITLE), APP_GLYPH: String(mod.APP_GLYPH) }
    if (typeof mod.default !== 'function') allImport = false
  } catch {
    allImport = false
  }
}
check(`all ${M21_APPS.length} manifest entries import cleanly with a default component`, allImport && M21_APPS.every((e) => imported[e.id]))
check('the manifest carries exactly ten apps', M21_APPS.length === 10)
check('every id is unique', new Set(M21_APPS.map((e) => e.id)).size === M21_APPS.length)
check('every file\u2019s APP_ID agrees with the manifest id', M21_APPS.every((e) => imported[e.id]?.APP_ID === e.id))
check('every file\u2019s APP_TITLE agrees with the manifest title', M21_APPS.every((e) => imported[e.id]?.APP_TITLE === e.title))
check('every file\u2019s APP_GLYPH agrees with the manifest glyph', M21_APPS.every((e) => imported[e.id]?.APP_GLYPH === e.glyph))
check('every glyph is one pictograph', M21_APPS.every((e) => /\p{Extended_Pictographic}/u.test(e.glyph) && [...e.glyph].length <= 4))
check('every path is a relative ./<file> next to the manifest', M21_APPS.every((e) => e.path.startsWith('./') && !e.path.includes('/apps/')))

section('M21 · the engine law (pure engine, no second copy)')

const engineSrc = readFileSync(join(HERE, '../src/components/game/screens/phone/apps/whot-engine.ts'), 'utf8')
const whotAppSrc = readFileSync(join(HERE, '../src/components/game/screens/phone/apps/whot-app.tsx'), 'utf8')
check('whot-engine.ts imports NO react (headless — the suite runs it bare)', !/from ['"]react['"]/.test(engineSrc) && !/\bfrom ['"]\.\/whot-engine['"]/.test(engineSrc))
check('the app imports the shared engine instead of carrying a second copy', whotAppSrc.includes("from './whot-engine'") && !/export function buildDeck/.test(whotAppSrc) && !/export function dealMatch/.test(whotAppSrc))
check('the engine keeps the kid wall, the stake law, and the 54-card law in one place', engineSrc.includes("WHOT_STAKE = 200") && engineSrc.includes("band === 'kid'") && engineSrc.includes('whots: 5'))

section('M21 · the registry law (no collision with the phone\u2019s existing apps)')

const phoneScreenSrc = readFileSync(join(HERE, '../src/components/game/screens/PhoneScreen.tsx'), 'utf8')
const unionMatch = phoneScreenSrc.match(/type PhoneApp = ([^\n]+)/)
const existingIds = unionMatch ? (unionMatch[1]!.match(/'([a-z-]+)'/g) ?? []).map((s) => s.replace(/'/g, '')) : []
// THE AMENDMENT (M24-UI wave): the union grew from 22 to 27 — grid + 11
// legacy + 10 manifest + the five social faces (messages/calls/connect/
// wallet/profile). The registry law counts the REAL union, not a memory.
check('the PhoneApp union was read from the real source (grid + 11 legacy + 10 manifest + 5 social = 27)', unionMatch !== null && existingIds.length === 27 && existingIds.includes('grid'))
check('every manifest id is wired into the union EXACTLY ONCE (no dupes, none missing)', M21_APPS.every((e) => existingIds.filter((id) => id === e.id).length === 1))
check('the 11 legacy apps still stand beside the ten', ['chats','bank','hustle','civic','biz','settings','shield','pulse','live','forge','nation'].every((id) => existingIds.includes(id)))

/* ============================== 2. THE DECK =============================== */

section('M21 · THE DECK LAW (exactly 54, the real Whot pack)')

const deck = buildDeck()
const count = (suit: string) => deck.filter((c) => c.suit === suit).length
check('the deck is exactly 54 cards', deck.length === 54)
check('circles 12 — 1,2,3,4,5,7,8,10,11,12,13,14', count('circle') === 12 && JSON.stringify(deck.filter((c) => c.suit === 'circle').map((c) => c.n)) === JSON.stringify(DECK_LAW.circle))
check('triangles 12 — same numbers as circles', count('triangle') === 12 && JSON.stringify(deck.filter((c) => c.suit === 'triangle').map((c) => c.n)) === JSON.stringify(DECK_LAW.triangle))
check('squares 9 — 1,2,3,5,7,10,11,13,14', count('square') === 9 && JSON.stringify(deck.filter((c) => c.suit === 'square').map((c) => c.n)) === JSON.stringify(DECK_LAW.square))
check('crosses 9 — same numbers as squares', count('cross') === 9 && JSON.stringify(deck.filter((c) => c.suit === 'cross').map((c) => c.n)) === JSON.stringify(DECK_LAW.cross))
check('stars 7 — 1,2,3,4,5,7,8', count('star') === 7 && JSON.stringify(deck.filter((c) => c.suit === 'star').map((c) => c.n)) === JSON.stringify(DECK_LAW.star))
check('five Whot cards, all numbered 20', count('whot') === 5 && deck.filter((c) => c.suit === 'whot').every((c) => c.n === 20))
check('no 6 and no 9 exist anywhere in the pack (the Whot law)', deck.every((c) => c.n !== 6 && c.n !== 9))
check('every card id is unique', new Set(deck.map((c) => c.id)).size === 54)

/* ============================== 3. THE SEED =============================== */

section('M21 · THE SEED LAW (same day + match = same shuffle)')

check('whotSeed is deterministic', whotSeed(3, 1) === whotSeed(3, 1) && whotSeed(7, 2) === whotSeed(7, 2))
check('a new day or a new match deals a new shuffle', whotSeed(3, 1) !== whotSeed(3, 2) && whotSeed(3, 1) !== whotSeed(4, 1))

const shA = shuffleDeck(deck, whotSeed(3, 1))
const shB = shuffleDeck(deck, whotSeed(3, 1))
const shC = shuffleDeck(deck, whotSeed(3, 2))
check('two shuffles of the same seed are identical, card for card', JSON.stringify(shA.cards) === JSON.stringify(shB.cards))
check('a different seed shuffles differently', JSON.stringify(shA.cards) !== JSON.stringify(shC.cards))
check('the shuffle is a permutation (same 54 cards, new order)', shA.cards.length === 54 && new Set(shA.cards.map((c) => c.id)).size === 54 && JSON.stringify([...shA.cards].sort((a, b) => a.id.localeCompare(b.id))) === JSON.stringify([...deck].sort((a, b) => a.id.localeCompare(b.id))))
check('the whole dealt match is seed-deterministic (same seed → byte-same state)', JSON.stringify(dealMatch(whotSeed(3, 1))) === JSON.stringify(dealMatch(whotSeed(3, 1))) && JSON.stringify(dealMatch(whotSeed(7, 2))) !== JSON.stringify(dealMatch(whotSeed(7, 3))))

/* ============================ 4. THE LEGALITY ============================= */

section('M21 · THE LEGALITY LAW (constructed hands)')

const c = (suit: WhotCard['suit'], n: number): WhotCard => ({ id: `${suit}-${n}`, suit, n })
const T4 = c('triangle', 4)
const C4 = c('circle', 4)
const T7 = c('triangle', 7)
const C7 = c('circle', 7)
const W = c('whot', 20)
const C2 = c('circle', 2)
const T5 = c('triangle', 5)
const T1 = c('triangle', 1)
const T14 = c('triangle', 14)
const T2 = c('triangle', 2)

function bareMatch(partial: Partial<WhotMatch>): WhotMatch {
  return {
    deck: [c('square', 3), c('cross', 11), c('star', 5), c('circle', 10), c('triangle', 1), c('square', 14), c('cross', 2), c('star', 8), c('circle', 13)],
    pile: [T4],
    hands: { you: [], npc: [] },
    turn: 'you',
    activeSuit: 'triangle',
    activeN: 4,
    pendingPick: 0,
    pendingKind: 0,
    over: false,
    winner: null,
    rngState: 7,
    note: '',
    ...partial,
  }
}

const m0 = bareMatch({ hands: { you: [C4, T7, C7, W], npc: [C2] } })
const legal0 = legalMoves(m0, m0.hands.you)
check('a number match is legal (circle 4 on triangle 4)', legal0.includes(0))
check('a suit match is legal (triangle 7 on triangle 4)', legal0.includes(1))
check('a Whot 20 is always legal (it sits fourth in the hand)', legal0.includes(3))
check('a card matching neither suit nor number is refused (circle 7 on triangle 4)', !legal0.includes(2))

const mDebt = bareMatch({ hands: { you: [C7, C2, T5, W], npc: [] }, pendingPick: 2, pendingKind: 2, turn: 'you' })
const legalDebt = legalMoves(mDebt, mDebt.hands.you)
check('under a pick-2 debt only a 2 defends (the whot must wait)', legalDebt.length === 1 && mDebt.hands.you[legalDebt[0]!]!.n === 2)

/* ============================= 5. THE EFFECTS ============================= */

section('M21 · THE EFFECT LAW (1 skip / 8 hold on, 2/5 picks, 14 market, 20 calls)')

const m2 = playCard(bareMatch({ hands: { you: [T2], npc: [c('square', 3), c('cross', 11)] }, deck: [c('star', 5), c('circle', 10), c('triangle', 1), c('square', 14), c('cross', 2), c('star', 8), c('circle', 13)] }), 'you', 0)
check('a 2 passes the turn with a pick-2 debt on the opponent (they pay it on their turn)', m2.turn === 'npc' && m2.pendingPick === 2 && m2.pendingKind === 2 && m2.hands.npc.length === 2)

const stacked = playCard(bareMatch({ hands: { you: [T2], npc: [] }, pendingPick: 2, pendingKind: 2, turn: 'you' }), 'you', 0)
check('a defended 2 stacks — the debt grows to 4 and flips back', stacked.pendingPick === 4 && stacked.pendingKind === 2 && stacked.turn === 'npc')

const m5 = playCard(bareMatch({ hands: { you: [T5], npc: [] } }), 'you', 0)
check('a 5 lays a pick-3 debt on the opponent', m5.pendingPick === 3 && m5.pendingKind === 5 && m5.turn === 'npc')

const m1 = playCard(bareMatch({ hands: { you: [T1, T7], npc: [] } }), 'you', 0)
check('a 1 skips the next player — in two-man that is play again', m1.turn === 'you' && !m1.over && m1.hands.you.length === 1)

const m8 = playCard(bareMatch({ activeN: 1, activeSuit: 'circle', hands: { you: [c('circle', 8), T7], npc: [] } }), 'you', 0)
check('an 8 holds on — in 2-player that is play again', m8.turn === 'you' && m8.hands.you.length === 1)

const m14 = playCard(bareMatch({ hands: { you: [T14, T7], npc: [c('square', 3)] } }), 'you', 0)
check('a 14 sends the opponent to market (picks 1) and you play again', m14.turn === 'you' && m14.hands.npc.length === 2 && m14.hands.you.length === 1)

const m20 = playCard(bareMatch({ hands: { you: [W], npc: [C7] } }), 'you', 0, 'star')
check('a 20 is wild — the caller names the suit', m20.activeSuit === 'star' && m20.activeN === 20 && m20.turn === 'npc')
const afterCall = bareMatch({ activeSuit: 'star', activeN: 20, hands: { you: [C7, W], npc: [] }, turn: 'you' })
const legalAfterCall = legalMoves(afterCall, afterCall.hands.you)
check('after the call only the called suit or another whot is legal', legalAfterCall.length === 1 && afterCall.hands.you[legalAfterCall[0]!]!.suit === 'whot')

const mPick = pickFromMarket(bareMatch({ hands: { you: [C7], npc: [] }, turn: 'you' }))
check('a forced pick takes 1 and passes the turn', mPick.hands.you.length === 2 && mPick.turn === 'npc')

const mDebtPick = pickFromMarket(bareMatch({ hands: { you: [C7], npc: [] }, turn: 'you', pendingPick: 3, pendingKind: 5 }))
check('paying the debt takes exactly what the 5 laid (3) and clears it', mDebtPick.hands.you.length === 4 && mDebtPick.pendingPick === 0 && mDebtPick.pendingKind === 0 && mDebtPick.turn === 'npc')

const mWin = playCard(bareMatch({ hands: { you: [T7], npc: [c('square', 3)] } }), 'you', 0)
check('the last card wins the match — honestly, instantly', mWin.over && mWin.winner === 'you')
{
  const illegal = bareMatch({ hands: { you: [C7], npc: [] } })
  const untouched = playCard(illegal, 'you', 0)
  check('an illegal play returns the same match untouched', untouched === illegal && !untouched.over)
  check('an over match refuses every door', pickFromMarket(mWin) === mWin && npcTurn(mWin) === mWin)
}

/* ========================== 6. THE TERMINATION ============================ */

section('M21 · THE TERMINATION LAW (scripted full matches end)')

let terminated = 0
let bounded = true
let maxTurns = 0
const winners = new Set<string>()
for (let seed = 1; seed <= 16; seed++) {
  let m = dealMatch(whotSeed(seed, 1))
  let turns = 0
  while (!m.over && turns < 400) {
    m = autoTurn(m)
    turns++
  }
  maxTurns = Math.max(maxTurns, turns)
  if (m.over && m.winner !== null) {
    terminated++
    winners.add(m.winner)
  } else {
    bounded = false
  }
  if (turns >= 400) bounded = false
}
check('16 scripted matches all end with a real winner inside 400 turns', terminated === 16 && bounded && maxTurns < 400)
check('every winner is an honest side (you or Emeka — nobody else can win)', winners.size >= 1 && [...winners].every((w) => w === 'you' || w === 'npc'))
check('the table stake deals 6 cards a hand and a plain opener', (() => {
  const m = dealMatch(whotSeed(9, 1))
  return m.hands.you.length === 6 && m.hands.npc.length === 6 && m.pile.length === 1 && m.pile[0]!.n !== 20 && ![1, 2, 5, 14].includes(m.pile[0]!.n)
})())
check('hold-on chains never strand the turn (the winner is a dry hand)', (() => {
  const m = dealMatch(whotSeed(12, 3))
  let cur = m
  let turns = 0
  while (!cur.over && turns < 400) { cur = autoTurn(cur); turns++ }
  return cur.over && cur.hands.you.length === 0 ? cur.winner === 'you' : cur.hands.npc.length === 0 ? cur.winner === 'npc' : false
})())
check('the NPC door refuses to move when it is not Emeka\u2019s turn', (() => {
  const m = dealMatch(whotSeed(5, 5))
  return npcTurn(m) === m
})())

/* ============================ 7. THE KID WALL ============================= */

section('M21 · THE KID WALL (the stake is structural, the door never opens)')

check('the table stake is ₦200', WHOT_STAKE === 200)
check('a kid\u2019s stake is ₦0 — even with a full pocket', stakeFor('kid', 1_000_000) === 0)
check('an adult pocket that can carry the stake carries it', stakeFor('adult', 5_000) === WHOT_STAKE)
check('a teen pocket plays for the table too', stakeFor('teen', 5_000) === WHOT_STAKE)
check('a broke adult plays free (never blocked, never charged)', stakeFor('adult', 199) === 0)

/* ====================== 8. THE SANE-DATA + REAL DOOR ====================== */

section('M21 · the sane-data law (every app\u2019s source, on a REAL seeded store)')

const { useGameStore } = await import('../src/game/store/useGameStore')
const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
const store = useGameStore
store.getState().startNewGame('M21Tester', 'female', DEFAULT_AVATAR)
const S = () => store.getState()

check('the life boots with the real starting state', S().player !== null && S().world !== null && S().world!.day === 1)

{
  const { WALK_STYLES, PREMIUM_OUTFITS, PREMIUM_BY_KEY } = await import('../src/game/systems/wardrobe')
  const w = S().wardrobe
  check('WARDROBE: six walk styles, street equipped by birth, premium book empty', WALK_STYLES.length === 6 && w.activeWalk === 'street' && w.ownedWalks.length === 0 && w.ownedStyles.length === 0)
  check('WARDROBE: every premium price is the catalogue\u2019s own (earned twins cost ₦0)', PREMIUM_OUTFITS.every((o) => PREMIUM_BY_KEY.get(o.key)!.price === o.price) && PREMIUM_BY_KEY.get('confluence-gold')!.price === 0 && PREMIUM_BY_KEY.get('lab-coat')!.price === 0 && PREMIUM_BY_KEY.get('agbada')!.price === 8500)
  check('WARDROBE: the equip law refuses what the book does not hold', (() => {
    const r = S().wardrobeEquipWalk('bata')
    return !r.ok
  })())
  check('WARDROBE: the buy law refuses the earned twins at the shop door', !S().wardrobeBuy('outfit', 'confluence-gold').ok)
}

{
  const { resaleValue } = await import('../src/game/systems/garage')
  const { availableGigs } = await import('../src/game/systems/fleet')
  const { VEHICLE_BY_MODEL } = await import('../src/game/data/vehicles')
  const p = S().player!
  const day = S().world!.day
  check('GARAGE: a fresh life parks an empty garage — and the board says so honestly', p.vehicles.length === 0 && availableGigs(day, p.vehicles, p.level, S().world!.weather, S().fleet).length === 0)
  check('GARAGE: the resale law is the day-one 62% (okada ₦52,700), floored at 35%', resaleValue('okada', day, day) === 52_700 && resaleValue('okada', 1, 1_000) === Math.round((VEHICLE_BY_MODEL['okada'].price * 0.35) / 100) * 100)
  check('GARAGE: the buy door charges the showroom price through the wallet', (() => {
    const seeded = S().player!
    store.setState({ player: { ...seeded, cash: 120_000 } })
    const before = S().player!.cash
    const ok = S().buyVehicle('okada')
    return ok && S().player!.vehicles.length === 1 && S().player!.cash === before - VEHICLE_BY_MODEL['okada'].price
  })())
  check('GARAGE: one per model — the law and the app agree', !S().buyVehicle('okada') && S().player!.vehicles.length === 1)
  check('GARAGE: the sell door pays the resale law back through the wallet', (() => {
    const v = S().player!.vehicles[0]!
    const before = S().player!.cash
    const ok = S().sellVehicle(v.id)
    return ok && S().player!.vehicles.length === 0 && S().player!.cash === before + resaleValue(v.model, v.boughtDay, S().world!.day)
  })())
}

{
  const h = S().housing
  const { PROPERTIES, propertyFor, canBuyProperty } = await import('../src/game/systems/housing')
  check('HOUSES: the fresh rent book is clean and owed nothing', !h.owned && h.rentOwed === 0 && h.rentPaidThrough === 0 && h.stats.rentPaid === 0)
  check('HOUSES: the ladder is the config\u2019s four real rungs', PROPERTIES.length === 4 && propertyFor('duplex')!.price === 950_000 && propertyFor('family-room')!.level === 3)
  check('HOUSES: the buy law refuses a Level-1 pocket the honest way', (() => {
    const v = canBuyProperty(h, 'family-room', S().player!.level, S().player!.cash)
    return !v.ok && v.why.length > 0
  })())
}

{
  const p = S().player!
  const { AGE_LAW } = await import('../src/game/systems/shield')
  check('HEALTH: the four meters live in 0–100 and the summary answers', (() => {
    const n = p.needs
    return [n.health, n.energy, n.hunger, n.mood].every((v) => v >= 0 && v <= 100)
  })())
  check('HEALTH: the AGE_LAW table is the honest one (kid shielded, adult full)', AGE_LAW.kid.crime === false && AGE_LAW.teen.crime === false && AGE_LAW.adult.crime === true && AGE_LAW.kid.studyBoost === 1.25 && AGE_LAW.kid.hustle === 'light' && AGE_LAW.kid.social === 'emotes')
}

{
  const e = S().education
  const { SCHOOLS } = await import('../src/game/data/schools')
  const { LOCATIONS } = await import('../src/game/data/locations')
  const { LADDER } = await import('../src/game/data/config')
  check('SCHOOL: a fresh life is unenrolled at semester 1 with clean stats', !e.enrolled && !e.graduated && e.semester === 1 && e.examsPassed === 0 && e.lecturesDone === 0)
  check('SCHOOL: the city carries its 12 real campuses on the SAME location registry (plus the 10 launch locations)', SCHOOLS.length === 12 && SCHOOLS.every((s) => LOCATIONS.some((l) => l.id === s.id)) && ['home', 'kpata-market', 'confluence', 'mount-patti', 'transport-area'].every((id) => LOCATIONS.some((l) => l.id === id)))
  check('SCHOOL: the exam bar is the config\u2019s own (smart + lectures × 0.5 ≥ 8)', LADDER.education.examPassScore === 8 && LADDER.education.semesterDays === 18 && LADDER.education.lecturesNeeded === 12)
}

{
  const { xpToNextLevel, reputationTier, skillCap } = await import('../src/game/systems/progression')
  const { JOBS, JOB_BY_ID } = await import('../src/game/data/jobs')
  const p = S().player!
  check('CAREER: the XP curve reads 120 × level^1.4 (L1 → 120)', xpToNextLevel(1) === 120 && xpToNextLevel(2) === Math.round(120 * Math.pow(2, 1.4)))
  check('CAREER: every job on the board answers its id (no ghost rows)', JOBS.length >= 20 && JOBS.every((j) => JOB_BY_ID[j.id] === j))
  check('CAREER: the reputation ladder and the skill cap are the real tables', reputationTier(p.reputation).threshold === 0 && skillCap(p.level) === 3 + p.level * 2)
}

{
  const { NPCS } = await import('../src/game/data/npcs')
  const { NPC_CHAT } = await import('../src/game/data/npcChat')
  const { LOCATION_BY_ID } = await import('../src/game/data/locations')
  const { relationshipFor, tierFor } = await import('../src/game/systems/social')
  const p = S().player!
  check('CONTACTS: 14 real people, every one with chat lines for all four tiers and a real home', NPCS.length === 14 && NPCS.every((n) => NPC_CHAT[n.id] !== undefined && !!NPC_CHAT[n.id]!.stranger.length && !!NPC_CHAT[n.id]!['close-paddy'].length && LOCATION_BY_ID[n.homeLocationId] !== undefined))
  check('CONTACTS: an unmet face reads as a stranger with 0 familiarity', (() => {
    const rel = relationshipFor(p.relationships, 'musa')
    return rel.familiarity === 0 && tierFor(rel.familiarity) === 'stranger'
  })())
}

{
  const { PATTI_SECRETS, secretsFound, discover, freshPattiState } = await import('../src/game/systems/patti')
  check('PATTI: the hill keeps exactly five secrets and a fresh book holds none', PATTI_SECRETS.length === 5 && secretsFound(freshPattiState()) === 0 && secretsFound(S().patti) === 0)
  check('PATTI: the five spots are spread wide enough that two never share one footstep (≥ 15u)', (() => {
    for (let i = 0; i < PATTI_SECRETS.length; i++) {
      for (let j = i + 1; j < PATTI_SECRETS.length; j++) {
        const a = PATTI_SECRETS[i]!
        const b = PATTI_SECRETS[j]!
        if (Math.hypot(a.x - b.x, a.z - b.z) < 15) return false
      }
    }
    return true
  })())
  check('PATTI: discovery is idempotent — a found spot can never double-pay', (() => {
    const first = discover(freshPattiState(), PATTI_SECRETS[0]!.id, 4)
    const again = discover(first.state, PATTI_SECRETS[0]!.id, 5)
    return first.isNew && !again.isNew && again.state.found[PATTI_SECRETS[0]!.id] === 4
  })())
}

{
  const { chapterOf, currentTask, coatDay, freshStoryState, STORY, STORY_BEATS } = await import('../src/game/systems/story')
  const fresh = freshStoryState()
  check('STORY: the path starts unmet (chapter 0) and the coat day is unstamped', chapterOf(fresh) === 0 && coatDay(fresh) === 0 && STORY_BEATS.length === 6)
  check('STORY: before meetDay the hill is silent (no task)', currentTask(fresh, { day: 1, level: 1, cash: 0 }) === null)
  check('STORY: from day 3 the boy offers the carry at the real place and price', (() => {
    const t = currentTask(fresh, { day: STORY.meetDay, level: 1, cash: 0 })
    return t !== null && t.kind === 'carry' && t.place === STORY.meetPlace && t.energy === STORY.sandEnergy
  })())
}

{
  check('WHOT: the seeded store stakes the adult table honestly', stakeFor(S().player!.ageBand, S().player!.cash) === WHOT_STAKE)
  check('WHOT: the wallet door IS the economy — stake out, pot in, net exactly +stake', (() => {
    const before = S().player!.cash
    if (!S().removeMoney(WHOT_STAKE, { label: 'Whot stake — test match', category: 'fun' })) return false
    const afterStake = S().player!.cash
    S().addMoney(WHOT_STAKE * 2, { label: 'Whot pot — test match', category: 'fun' })
    const afterPot = S().player!.cash
    return afterStake === before - WHOT_STAKE && afterPot === before + WHOT_STAKE && S().player!.transactions.some((t) => t.label === 'Whot pot — test match')
  })())
  check('WHOT: the kid wall holds on the REAL store — a rich kid still stakes ₦0 (structural, not a balance check)', (() => {
    const p0 = S().player!
    store.setState({ player: { ...p0, ageBand: 'kid', cash: 999_999 } })
    const kidStake = stakeFor(S().player!.ageBand, S().player!.cash)
    store.setState({ player: { ...p0, ageBand: 'adult' } })
    return kidStake === 0
  })())
}

console.log('\n========================================')
console.log(`M21 APPS — ${passed} passed, ${failed} failed`)
console.log('========================================')
process.exit(failed > 0 ? 1 : 0)
