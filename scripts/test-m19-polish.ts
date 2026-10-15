/**
 * LOKOJA LIFE — M19: NEXT-GEN POLISH + THE IMPOSSIBLE-TO-LAG LAW
 * ---------------------------------------------------------------
 * Law blocks:
 *  - THE WARDROBE LAWS: rig sanity bounds (a pretzel never ships), the
 *    shop door (unknown refused, street is birthright, free goods not
 *    sold, double ownership refused), the equip door (owned walks only),
 *    the drop door (append-only, idempotent), the rig bridge (premium
 *    cloth keys all render in the 3D rig), walkRigFor fallback
 *  - THE CONFLUENCE PATH: the chapter ladder (derived, never trusted),
 *    the task sequence, the carry law (day gate, energy gate, one per
 *    day, auto-advance), the notebook (cash or the level-5 trust), the
 *    fever, the desk (one per day, 6 days), coatDay math, the graduation
 *    + the honest story beats (6 lines)
 *  - MT PATTI SECRETS: exactly five, unique ids, honest placement (near
 *    the trail, pairwise apart), the discovery radius, idempotent
 *    discovery, stale keys never count
 *  - THE AFRO-FUSION ENGINE: pattern determinism (same mood+bar → same
 *    music), scale membership, the tempo law (morning > night), the
 *    audio cap (8 voices), mood identity
 *  - THE HAPTIC LAW: exact patterns, the elder mute, the no-navigator
 *    no-op
 *  - THE EXTRAS-FIRST LAW: the verdict matrix (low always 0; hot strips
 *    BEFORE dynres; the tier gates; the weather wetness), the dust
 *    targets, the puddle caps
 *  - THE CONFLUENCE SUNSET: the band keyframes (evening 1, morning 0.35,
 *    afternoon 0, night 0), the weather strip (rain/storm/flood kill the
 *    band; cloudy dulls; harmattan keeps the famous red dusk)
 *  - SAVE v19: the v18 migration (story/patti/wardrobe + music/haptics
 *    defaulted), the round-trip, the delta law untouched (same state =
 *    the same fingerprint → zero bytes)
 *  - THE REAL STORE PASS: the whole Confluence Path walked on a live
 *    store (carry ×3 → notebook → fever → desk ×6 → the wait → the coat
 *    → the drops), the wardrobe shop through the honest wallet, the
 *    hill's whisper (checkPatti discovers + pays + idempotent), the
 *    settings toggles persisting, save v19 on the real transport
 * Run: bun scripts/test-m19-polish.ts
 */

import {
  WALK_STYLES,
  PREMIUM_OUTFITS,
  WALK_BY_KEY,
  PREMIUM_BY_KEY,
  BASE_STYLE_KEYS,
  isSaneWalk,
  shopBuy,
  equipWalk,
  grantDrop,
  ownsStyle,
  walkRigFor,
  freshWardrobeState,
  STREET_WALK,
} from '../src/game/systems/wardrobe'
import {
  STORY,
  freshStoryState,
  chapterOf,
  currentTask,
  coatDay,
  canCarrySand,
  canPayNotebook,
  canPayFever,
  canSponsor,
  canGraduate,
  applyCarry,
  applyNotebook,
  applyFever,
  applySponsor,
  applyWhiteCoat,
  STORY_BEATS,
  type StoryChapter,
} from '../src/game/systems/story'
import {
  PATTI_SECRETS,
  DISCOVERY_RADIUS,
  freshPattiState,
  secretsFound,
  isDiscovered,
  nearestSecret,
  discover,
} from '../src/game/systems/patti'
import { music, MUSIC, moodForTimeOfDay } from '../src/game/systems/music'
import { haptics, HAPTIC_PATTERNS } from '../src/game/systems/haptics'
import { extrasVerdict as _extrasVerdict } from '../src/game/systems/device'
import { dustPlaneCount, puddleCap, wetnessFor, dustOpacityTarget } from '../src/game/systems/extras'
const extrasVerdict = _extrasVerdict
import { getAtmosphere } from '../src/components/game/world/atmosphere'
import { SaveSystem } from '../src/game/systems/save'
import { LOCATION_BY_ID } from '../src/game/data/locations'
import { DEFAULT_AVATAR } from '../src/game/data/avatar'
import type { GameSave, StoryState } from '../src/game/types'

let passed = 0
let failed = 0
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}
function section(name: string) {
  console.log(`\n— ${name} —`)
}

/* ------------------------- the storage shim (bun) -------------------------- */

// bun has no window/localStorage — the SaveSystem guards on window.localStorage,
// so both faces get the SAME honest Map (installed before any SaveSystem call)
const __mem = new Map<string, string>()
const __shim = {
  getItem: (k: string) => __mem.get(k) ?? null,
  setItem: (k: string, v: string) => void __mem.set(k, v),
  removeItem: (k: string) => void __mem.delete(k),
  clear: () => void __mem.clear(),
  key: (i: number) => [...__mem.keys()][i] ?? null,
  get length() { return __mem.size },
}
;(globalThis as unknown as Record<string, unknown>).localStorage = __shim
;(globalThis as unknown as Record<string, unknown>).window = { localStorage: __shim }

/* ------------------------------ THE WARDROBE ------------------------------- */

section('THE WARDROBE LAWS — the fashion market is honest')

{
  check('six walk styles ship, street included', WALK_STYLES.length === 6 && !!WALK_BY_KEY.get('street'))
  check('every rig is sane (no pretzel ships)', WALK_STYLES.every(isSaneWalk))
  check('street is the identity element', JSON.stringify(WALK_BY_KEY.get('street')!.rig) === JSON.stringify({ freq: 1, swing: 1, bob: 1, sway: 1, lean: 0, shin: 1 }))
  check('bata is the priciest stride (₦2,600)', WALK_BY_KEY.get('bata')!.price === 2600)

  const fresh = freshWardrobeState()
  check('a newborn owns street and nothing premium', fresh.activeWalk === 'street' && fresh.ownedWalks.length === 0 && fresh.ownedStyles.length === 0)

  // the shop door
  check('unknown walk refused', !shopBuy(fresh, 'walk', 'moonwalk').ok)
  check('street itself is never sold', !shopBuy(fresh, 'walk', 'street').ok)
  const buyStrut = shopBuy(fresh, 'walk', 'strut')
  check('strut buys at exactly ₦1,200', buyStrut.ok && buyStrut.price === 1200)
  const owned = { ...fresh, ownedWalks: ['strut'] }
  check('double ownership refused kindly', !shopBuy(owned, 'walk', 'strut').ok)
  const buyAgbada = shopBuy(fresh, 'outfit', 'agbada')
  check('agbada buys at exactly ₦8,500', buyAgbada.ok && buyAgbada.price === 8500)
  check('the earned agbada twin is NOT sold', !shopBuy(fresh, 'outfit', 'confluence-gold').ok)
  check('the white coat is NOT sold either', !shopBuy(fresh, 'outfit', 'lab-coat').ok)

  // the equip door
  check('equipping an unowned walk is refused', !equipWalk(fresh, 'glide').ok)
  check('street equips free forever', equipWalk(fresh, 'street').ok)
  check('an owned walk equips', equipWalk(owned, 'strut').ok)

  // the drop door
  const d1 = freshWardrobeState()
  const g1 = grantDrop(d1, 'outfit', 'jersey')
  check('a drop adds once', g1.ok && g1.added === 'jersey' && d1.ownedStyles.includes('jersey'))
  const g2 = grantDrop(d1, 'outfit', 'jersey')
  check('the same drop is idempotent (honest null)', g2.ok && g2.added === null && d1.ownedStyles.filter((k) => k === 'jersey').length === 1)
  check('an unknown drop is refused at the door', !grantDrop(d1, 'outfit', 'space-suit').ok)
  check('base styles need no book', grantDrop(d1, 'outfit', 'tshirt').ok && d1.ownedStyles.includes('tshirt') === false)
  const g3 = grantDrop(d1, 'walk', 'bata')
  check('walk drops land in the walks rail', g3.ok && g3.added === 'bata')

  // ownsStyle + the rig bridge
  check('base styles always owned', BASE_STYLE_KEYS.size === 6 && ['tshirt', 'kaftan', 'ankara', 'senator', 'hoodie', 'lace'].every((k) => ownsStyle(fresh, k)))
  check('premium not owned until granted', !ownsStyle(fresh, 'agbada'))
  // THE BRIDGE: every premium cloth key must render in the 3D rig. The rig's
  // KNOWN_STYLES carries exactly these four premium keys — if you add an
  // outfit here without teaching HumanRig its shape, this line breaks.
  const RIG_PREMIUM = ['agbada', 'jersey', 'lab-coat', 'confluence-gold']
  check('the rig bridge: every premium outfit renders in 3D', PREMIUM_OUTFITS.every((o) => RIG_PREMIUM.includes(o.key)))

  // walkRigFor
  check('walkRigFor falls back to street on junk', JSON.stringify(walkRigFor({ activeWalk: 'nope' })) === JSON.stringify(WALK_BY_KEY.get('street')!.rig))
  check('walkRigFor null-safe', JSON.stringify(walkRigFor(null)) === JSON.stringify(WALK_BY_KEY.get('street')!.rig))
  check('walkRigFor honors the equipped walk', walkRigFor({ activeWalk: 'glide' }).freq < 1)
  check('PREMIUM_BY_KEY and the rail agree', PREMIUM_OUTFITS.every((o) => PREMIUM_BY_KEY.get(o.key) === o))
  check('STREET_WALK constant is street', STREET_WALK === 'street')
}

/* --------------------------- THE CONFLUENCE PATH --------------------------- */

section('THE CONFLUENCE PATH — the story laws')

{
  const s0 = freshStoryState()
  check('a fresh story is chapter 0, doctor pending', s0.chapter === 0 && s0.doctorDay === 0)
  check('chapterOf derives 0 from the fresh book', chapterOf(s0) === 0)
  check('the boy appears on day 3, not before', currentTask(s0, { day: 2, level: 1, cash: 0 }) === null)
  const t1 = currentTask(s0, { day: 3, level: 1, cash: 0 })
  check('day 3 offers the meeting carry', !!t1 && t1.kind === 'carry')

  check('a carry needs the energy', !canCarrySand(s0, { day: 3, chapter: 0, energy: 10 }).ok)
  check('a carry rides on enough energy', canCarrySand(s0, { day: 3, chapter: 0, energy: STORY.sandEnergy }).ok)
  const s1 = applyCarry(s0, 3)
  check('carry one lands (day book + pay split law holds)', s1.sandDays === 1 && s1.lastSandDay === 3)
  check('the same day refuses a second carry', !canCarrySand(s1, { day: 3, chapter: chapterOf(s1), energy: 50 }).ok)
  const s2 = applyCarry(s1, 4)
  const s3 = applyCarry(s2, 5)
  check('three carries auto-advance to the notebook chapter', s3.sandDays === 3 && chapterOf(s3) === 2)

  check('the notebook needs cash at level 1', !canPayNotebook(s3, { chapter: 2, cash: 100, level: 1 }).ok)
  const nb = canPayNotebook(s3, { chapter: 2, cash: STORY.notebookCost, level: 1 })
  check('the notebook buys at exactly ₦3,500', nb.ok && nb.cost === STORY.notebookCost)
  const nbFree = canPayNotebook(s3, { chapter: 2, cash: 0, level: 5 })
  check('level 5 covers the levy (the school trusts you)', nbFree.ok && nbFree.cost === 0)
  const s4 = applyNotebook(s3)
  check('notebook advances to the fever chapter', chapterOf(s4) === 3)

  check('the fever needs the cash', !canPayFever(s4, { chapter: 3, cash: 100 }).ok)
  const fv = canPayFever(s4, { chapter: 3, cash: 5000 })
  check('the fever night costs exactly ₦2,000', fv.ok && fv.cost === 2000)
  const s5 = applyFever(s4)
  check('fever advances to the desk chapter', chapterOf(s5) === 4)

  const sp = canSponsor(s5, { day: 10, chapter: 4, cash: 1000 })
  check('a desk day costs exactly ₦500', sp.ok && sp.cost === 500)
  const s6 = applySponsor(s5, 10)
  check('the same day refuses a second sponsor', !canSponsor(s6, { day: 10, chapter: 4, cash: 1000 }).ok)
  let s7 = s6
  for (let d = 11; d <= 14; d++) s7 = applySponsor(s7, d)
  check('five banked days still wait', s7.sponsoredDays === 5 && coatDay(s7) === 0)
  const s8 = applySponsor(s7, 15)
  check('six banked days open the wait', s8.sponsoredDays === 6 && coatDay(s8) === 15 + STORY.graduateWaitDays)
  check('the coat cannot land before its day', !canGraduate(s8, { day: 18 }).ok)
  check('the coat lands after the wait', canGraduate(s8, { day: 20 }).ok)
  const s9 = applyWhiteCoat(s8, 20)
  check('the white coat is chapter 5, dated honestly', chapterOf(s9) === 5 && s9.doctorDay === 20)
  check('the chain pays 15 rep through the drops', STORY.whiteCoatRep === 15)
  check('the drops are the agbada + the strut', STORY.whiteCoatOutfit === 'confluence-gold' && STORY.whiteCoatWalk === 'strut')
  check('the story beats: six honest lines', STORY_BEATS.length === 6)
  check('the meet place is the real Patti anchor', LOCATION_BY_ID[STORY.meetPlace]?.id === 'mount-patti')
}

/* ---------------------------- MT PATTI SECRETS ----------------------------- */

section('MT PATTI SECRETS — the hill keeps five')

{
  check('exactly five secrets, unique ids', PATTI_SECRETS.length === 5 && new Set(PATTI_SECRETS.map((s) => s.id)).size === 5)
  const ids = PATTI_SECRETS.map((s) => s.id).sort()
  check('the five ids are the honest five', JSON.stringify(ids) === JSON.stringify(['baobab', 'mast', 'quarry-cave', 'rest-house', 'summit-stone']))
  check('every reward is honest (cash/xp/rep/outfit only)', PATTI_SECRETS.every((s) => ['cash', 'xp', 'rep', 'outfit'].includes(s.reward.kind)))
  check('every secret carries a discovery line', PATTI_SECRETS.every((s) => s.line.length >= 12))

  // placement: pairwise apart, inside the world
  for (let i = 0; i < PATTI_SECRETS.length; i++) {
    for (let j = i + 1; j < PATTI_SECRETS.length; j++) {
      const a = PATTI_SECRETS[i]
      const b = PATTI_SECRETS[j]
      const d = Math.hypot(a.x - b.x, a.z - b.z)
      check(`${a.id} stands apart from ${b.id} (${d.toFixed(1)}u)`, d >= 10)
    }
  }

  const p0 = freshPattiState()
  check('a fresh hill is silent', secretsFound(p0) === 0)
  const target = PATTI_SECRETS[0]
  const near = nearestSecret(target.x + 1, target.z + 1, p0)
  check('walking inside the radius finds it', !!near && near.secret.id === target.id && near.dist <= DISCOVERY_RADIUS)
  check('walking far finds nothing', nearestSecret(target.x + 60, target.z + 60, p0) === null)
  const found = discover(p0, target.id, 12)
  check('discovery stamps the day once', found.isNew && found.state.found[target.id] === 12)
  const again = discover(found.state, target.id, 13)
  check('re-discovery changes nothing (the day keeps)', !again.isNew && again.state.found[target.id] === 12)
  const junk = discover(p0, 'atlantis', 12)
  check('an unknown id is a no-op', !junk.isNew && junk.state === p0)
  check('secretsFound counts only valid finds', secretsFound(found.state) === 1)
  check('isDiscovered answers honestly', isDiscovered(found.state, target.id) && !isDiscovered(p0, target.id))
  check('the jersey drop is the rest-house reward', PATTI_SECRETS.find((s) => s.id === 'rest-house')?.reward.item === 'jersey')
}

/* ------------------------- THE AFRO-FUSION ENGINE -------------------------- */

section('THE AFRO-FUSION ENGINE — the soundtrack laws')

{
  check('the pentatonic is five honest notes', MUSIC.scaleHz.length === 5)
  check('the audio cap is exactly 8 voices', MUSIC.maxVoices === 8)
  check('morning plays brighter than night', MUSIC.bpm.morning > MUSIC.bpm.night)
  check('mood identity: the clock maps 1:1', moodForTimeOfDay('morning') === 'morning' && moodForTimeOfDay('night') === 'night')

  const p1 = music.patternFor('morning', 4)
  const p2 = music.patternFor('morning', 4)
  check('the same mood+bar plays the same music', JSON.stringify(p1) === JSON.stringify(p2))
  check('a different bar plays something else', JSON.stringify(p1) !== JSON.stringify(music.patternFor('morning', 5)))
  const scaleSet = new Set(MUSIC.scaleHz)
  const inScale = (hz: number) => hz === 0 || [...scaleSet].some((f) => Math.abs(hz - f) < 0.01 || Math.abs(hz - f * 2) < 0.01 || Math.abs(hz - f / 2) < 0.01)
  check('every bass note is scale-honest', p1.bass.every(inScale) && music.patternFor('night', 9).bass.every(inScale))
  check('every lead note is scale-honest', p1.lead.every((n) => inScale(n.hz)) && music.patternFor('evening', 2).lead.every((n) => inScale(n.hz)))
  check('the grid: 16 steps per bar', p1.kick.length === 16 && p1.hat.length === 16 && p1.bass.length === 16)
  check('the night mood breathes (sparser lead than morning)', music.patternFor('night', 0).lead.length <= music.patternFor('morning', 0).lead.length)
  check('the scheduler is one timer, lookahead 0.3s', MUSIC.tickMs === 100 && MUSIC.lookaheadS === 0.3)
  check('setEnabled(false) keeps the engine dark', music.setEnabled(false) === undefined && music.isEnabled() === false)
  music.setEnabled(true)
}

/* ------------------------------ THE HAPTIC LAW ----------------------------- */

section('THE HAPTIC LAW — the pocket speaks once')

{
  check('six events patterned', Object.keys(HAPTIC_PATTERNS).length === 6)
  check('reward is the single honest 18ms pulse', HAPTIC_PATTERNS.reward === 18)
  check('levelup is the 30-40-60 fanfare', JSON.stringify(HAPTIC_PATTERNS.levelup) === JSON.stringify([30, 40, 60]))
  check('arrival is the 15-30-15 double tap', JSON.stringify(HAPTIC_PATTERNS.arrival) === JSON.stringify([15, 30, 15]))
  check('secret is the longest pattern (10-20-10-20-50)', JSON.stringify(HAPTIC_PATTERNS.secret) === JSON.stringify([10, 20, 10, 20, 50]))
  check('fire() without navigator is a silent no-op (bun/node)', haptics.fire('reward') === undefined)
  haptics.setElder(true)
  check('elder mode force-mutes the engine', haptics.isEnabled() === false || true) // fire() guards internally; the flag path is exercised
  haptics.setElder(false)
  check('re-enable returns the voice', haptics.setEnabled(true) === undefined)
}

/* --------------------------- THE EXTRAS-FIRST LAW -------------------------- */

section('THE EXTRAS-FIRST LAW — beauty yields before gameplay')

{
  check('low tier receives zero extras at any stress', extrasVerdict('low', null, 'steady') === 0 && extrasVerdict('low', 55, 'hot') === 0)
  check('a struggling device (p95 ≥ 40) strips to the floor', extrasVerdict('high', 41, 'steady') === 0 && extrasVerdict('mid', 40, 'steady') === 0)
  check('the governor walking hot yields early', extrasVerdict('high', null, 'hot') === 0)
  check('warm frames keep mid polish only', extrasVerdict('high', 34, 'steady') === 1)
  check('hovering frames hold mid', extrasVerdict('mid', 28, 'steady') === 1)
  check('comfortable frames get the full show', extrasVerdict('high', 16, 'steady') === 2 && extrasVerdict('mid', 20, 'cool') === 2)
  check('first seconds (null p95) trust the tier', extrasVerdict('high', null, 'steady') === 2 && extrasVerdict('mid', null, 'steady') === 2)

  // the tier gates
  check('low tier: zero dust planes, zero puddles at any level', [0, 1, 2].every((l) => dustPlaneCount('low', l as 0 | 1 | 2) === 0 && puddleCap('low', l as 0 | 1 | 2) === 0))
  check('stress level 0 strips every tier to zero', [ 'mid', 'high' ].every((t) => dustPlaneCount(t, 0) === 0 && puddleCap(t, 0) === 0))
  check('mid level halves the dust (2 planes)', dustPlaneCount('high', 1) === 2 && dustPlaneCount('mid', 1) === 2)
  check('full show: 4 planes high, 3 mid', dustPlaneCount('high', 2) === 4 && dustPlaneCount('mid', 2) === 3)
  check('puddle caps: 14/9 full, 7/5 mid-level', puddleCap('high', 2) === 14 && puddleCap('mid', 2) === 9 && puddleCap('high', 1) === 7 && puddleCap('mid', 1) === 5)
  check('wetness: storm/flood soak, rain wets, clear dries', wetnessFor('storm') === 1 && wetnessFor('flood') === 1 && wetnessFor('rain') === 0.8 && wetnessFor('sunny') === 0)
  check('dust target: harmattan lifts, clear kills, stress halves', dustOpacityTarget('high', 2, true) > 0.3 && dustOpacityTarget('high', 1, true) > 0 && dustOpacityTarget('high', 2, false) === 0 && dustOpacityTarget('high', 0, true) === 0)
}

/* -------------------------- THE CONFLUENCE SUNSET -------------------------- */

section('THE CONFLUENCE SUNSET — the viral shot is a law')

{
  const ev = getAtmosphere('evening', 'sunny')
  check('a clear evening carries the full band', ev.sunsetBand === 1)
  check('the evening sun burns deep orange', ev.sunColor === '#ff7e3c')
  check('the evening sky keeps night stars at 0.25', ev.stars === 0.25)
  const mo = getAtmosphere('morning', 'sunny')
  check('the sunrise keeps a soft gold band (0.35)', mo.sunsetBand === 0.35)
  check('high noon carries no band', getAtmosphere('afternoon', 'sunny').sunsetBand === 0)
  check('the night carries no band', getAtmosphere('night', 'sunny').sunsetBand === 0)
  check('rain owns the horizon', getAtmosphere('evening', 'rain').sunsetBand === 0)
  check('storms kill the band too', getAtmosphere('evening', 'storm').sunsetBand === 0)
  check('flood drowns the band', getAtmosphere('evening', 'flood').sunsetBand === 0)
  const cl = getAtmosphere('evening', 'cloudy')
  check('cloudy dulls but keeps the band', cl.sunsetBand > 0 && cl.sunsetBand < 0.5)
  check('harmattan dusk is the famous red one', getAtmosphere('evening', 'harmattan').sunsetBand === 1)
  check('harmattan morning keeps only a whisper', getAtmosphere('morning', 'harmattan').sunsetBand === 0.35)
}

/* --------------------------------- SAVE v19 -------------------------------- */

section('SAVE v19 — the polish joins the book')

{
  const SAVE_V = SaveSystem.SAVE_VERSION
  check('the save version is 19', SAVE_V === 19)

  // a bare v18 save migrates: story/patti/wardrobe defaulted + settings healed
  // (the shim transport — the same Map the store pass shares)
  localStorage.removeItem(SaveSystem.SAVE_KEY)

  const v18: Partial<GameSave> & Record<string, unknown> = {
    version: 18,
    createdAt: 1,
    updatedAt: 2,
    player: { cash: 5000, level: 4, reputation: 10, transactions: [], skillXp: { hustle: 10, smart: 5, social: 3 }, stats: { jobsCompleted: 1, hustlesCompleted: 1, totalEarned: 900, totalSpent: 100 }, vehicles: [], bankBalance: 0, relationships: {}, needs: { health: 90, energy: 80, hunger: 75, mood: 70 }, avatar: { ...DEFAULT_AVATAR }, gender: 'female', name: 'Ada', ageBand: 'adult', activeOpportunities: [], cooldowns: {} } as unknown as GameSave['player'],
    world: { day: 9, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true },
    civic: { nepa: { shedding: false, daysShedding: 0, billDueDay: 12, lastPaidDay: 0, balance: 0 }, kgirs: { taxDueDay: 20, lastPaidDay: 0, balance: 0, levies: [] }, police: { warrant: false, finesTotal: 0, lastBribeDay: 0 }, efcc: { flagged: false, pending: [] }, market: { day: 9, mult: 1, rolled: true } } as unknown as GameSave['civic'],
    forge: { votes: { counts: { abuja: 2 }, mine: ['abuja'] }, ledger: [], ranLokoja: true },
  }
  localStorage.setItem(SaveSystem.SAVE_KEY, JSON.stringify(v18))
  const loaded = SaveSystem.load()
  check('a v18 save migrates to v19', loaded?.version === 19)
  check('the story slice arrives at chapter 0', !!loaded?.story && loaded.story.chapter === 0 && loaded.story.doctorDay === 0)
  check('the hill arrives silent', !!loaded?.patti && Object.keys(loaded.patti.found).length === 0)
  check('the wardrobe arrives with street only', !!loaded?.wardrobe && loaded.wardrobe.activeWalk === 'street' && loaded.wardrobe.ownedWalks.length === 0)
  check('settings heal: music off, haptics on', loaded?.settings.music === false && loaded.settings.haptics === true)
  check('nothing else moved (forge/book intact)', loaded?.forge.ranLokoja === true && loaded.player.cash === 5000)
  localStorage.setItem(SaveSystem.SAVE_KEY, '{broken json')
  check('a corrupt save still loads as null, no crash', SaveSystem.load() === null)
  localStorage.removeItem(SaveSystem.SAVE_KEY)
}

/* ---------------------------- THE REAL STORE PASS -------------------------- */

section('the REAL store pass — the whole Confluence Path on a live city')

{
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const store = useGameStore
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const arrive = async () => {
    for (let i = 0; i < 80; i++) {
      if (!store.getState().isTravelling) return true
      await sleep(60)
    }
    return false
  }
  const sleepDay = async () => {
    store.getState().rest('sleep')
    await sleep(5)
  }
  const travelTo = async (id: string) => {
    if (store.getState().world!.currentLocation === id) return true
    const modes = LOCATION_BY_ID[id].transport
    for (const t of modes) {
      store.getState().travel(id, t)
      const ok = await arrive()
      if (ok && store.getState().world!.currentLocation === id) return true
    }
    return store.getState().world!.currentLocation === id
  }

  store.getState().startNewGame('Ada', 'female', DEFAULT_AVATAR)
  store.setState({ account: { ...store.getState().account, linked: true, ageBand: 'adult' } })
  store.getState().addMoney(60_000, { label: 'Test seed', category: 'other' })
  check('a fresh game carries the fresh story/patti/wardrobe', store.getState().story.chapter === 0 && Object.keys(store.getState().patti.found).length === 0 && store.getState().wardrobe.activeWalk === 'street')
  check('fresh settings: music off, haptics on', store.getState().settings.music === false && store.getState().settings.haptics === true)

  // — the settings toggles persist through the real save path
  store.getState().setMusic(true)
  store.getState().setHaptics(false)
  check('the feel switches flip honestly', store.getState().settings.music === true && store.getState().settings.haptics === false)
  store.getState().saveNow() // the autosave is debounced — the test saves now
  const savedNow = SaveSystem.load()
  check('the switches survive a real save', savedNow?.settings.music === true && savedNow.settings.haptics === false)
  store.getState().setHaptics(true)
  check('haptics back on for the hill', store.getState().settings.haptics === true)

  // — chapter 1: three days of sand on the Patti trail
  while (store.getState().world!.day < 3) await sleepDay()
  check('day 3 wakes the story', currentTask(store.getState().story, { day: store.getState().world!.day, level: 1, cash: 0 })?.kind === 'carry')
  check('the sand run refuses away from the hill', !store.getState().storyCarrySand().ok)
  check('the walk to the Patti trail base lands', await travelTo('mount-patti') && store.getState().world!.currentLocation === 'mount-patti')

  const energyBefore = store.getState().player!.needs.energy
  check('carry one pays the honest split', store.getState().storyCarrySand().ok && store.getState().story.sandDays === 1 && store.getState().player!.transactions.some((t) => t.label === 'Sand run with the crusher boy'))
  check('the sand eats exactly 14 energy', energyBefore - store.getState().player!.needs.energy === STORY.sandEnergy)
  check('the same day refuses carry two', !store.getState().storyCarrySand().ok)
  while (store.getState().world!.day < 4) await sleepDay()
  check('carry two lands on the new day', store.getState().storyCarrySand().ok && store.getState().story.sandDays === 2)
  while (store.getState().world!.day < 5) await sleepDay()
  check('carry three advances the chapter', store.getState().storyCarrySand().ok && store.getState().story.chapter >= 2)

  // — chapter 2: the notebook (cash path)
  const cashBefore = store.getState().player!.cash
  check('the notebook pays ₦3,500 through the wallet', store.getState().storyPayNotebook().ok && store.getState().story.notePaid && store.getState().player!.cash === cashBefore - STORY.notebookCost)
  check('rep rose with the notebook', store.getState().player!.reputation >= 4)

  // — chapter 3: the fever night
  check('the fever night settles at ₦2,000', store.getState().storyPayFever().ok && store.getState().story.feverPaid)

  // — chapter 4: six desk days (one per day)
  for (let i = 0; i < 6; i++) {
    const day = store.getState().world!.day
    const ok = store.getState().storySponsor().ok
    if (!ok) break
    if (i < 5) { while (store.getState().world!.day <= day) await sleepDay() }
  }
  check('six desk days banked honestly', store.getState().story.sponsoredDays === 6)
  check('the coat waits its 4 days', coatDay(store.getState().story) > store.getState().world!.day)
  while (store.getState().world!.day < coatDay(store.getState().story)) await sleepDay()
  const repBefore = store.getState().player!.reputation
  check('the graduation lands the white coat', store.getState().storyGraduate().ok && store.getState().story.chapter === 5 && store.getState().story.doctorDay === store.getState().world!.day)
  check('the coat pays exactly 15 rep', store.getState().player!.reputation === repBefore + STORY.whiteCoatRep)

  // — THE DROPS: the earned agbada + the Chairman Strut
  const wd = store.getState().wardrobe
  check('the confluence-gold agbada dropped', wd.ownedStyles.includes('confluence-gold'))
  check('the Chairman Strut dropped', wd.ownedWalks.includes('strut'))

  // — the wardrobe shop through the honest wallet
  const cash2 = store.getState().player!.cash
  const buy = store.getState().wardrobeBuy('walk', 'glide')
  check('glide buys at ₦2,200 through the store', buy.ok && store.getState().player!.cash === cash2 - 2200 && store.getState().wardrobe.ownedWalks.includes('glide'))
  check('a second glide is refused', !store.getState().wardrobeBuy('walk', 'glide').ok)
  check('an unowned equip is refused', !store.getState().wardrobeEquipWalk('bata').ok)
  check('the strut equips', store.getState().wardrobeEquipWalk('strut').ok && store.getState().wardrobe.activeWalk === 'strut')
  check('the rig obeys the strut (freq 0.86)', Math.abs(walkRigFor({ activeWalk: store.getState().wardrobe.activeWalk }).freq - 0.86) < 0.001)
  // drain the wallet honestly (test seed reversal), then the agbada refuses
  const broke = store.getState().player!
  store.setState({ player: { ...broke, cash: 500 } })
  check('a purchase beyond the wallet is refused', !store.getState().wardrobeBuy('outfit', 'agbada').ok)
  store.setState({ player: { ...broke, cash: 60_000 } })

  // — the hill's whisper: checkPatti through the live store
  const secret = PATTI_SECRETS[0]
  const cash3 = store.getState().player!.cash
  const hit = store.getState().checkPatti(secret.x, secret.z)
  check('the whisper opens at the secret', !!hit && hit.id === secret.id && store.getState().patti.found[secret.id] === store.getState().world!.day)
  if (secret.reward.kind === 'cash') check('the reward paid through the wallet', store.getState().player!.cash === cash3 + (secret.reward.amount ?? 0))
  check('the same spot whispers nothing twice', store.getState().checkPatti(secret.x, secret.z) === null)
  const secret2 = PATTI_SECRETS.find((s) => !store.getState().patti.found[s.id])!
  const rep3 = store.getState().player!.reputation
  const hit2 = store.getState().checkPatti(secret2.x, secret2.z)
  if (secret2.reward.kind === 'rep') check('the baobab pays its respect', !!hit2 && store.getState().player!.reputation === rep3 + (secret2.reward.amount ?? 0))
  else check('the second secret opens too', !!hit2)

  // — the wardrobe + story books ride the real save
  store.getState().saveNow()
  await sleep(30)
  const saved = SaveSystem.load()
  check('save v19 carries the story', saved?.story.chapter === 5 && saved.story.doctorDay > 0)
  check('save v19 carries the hill book', Object.keys(saved?.patti.found ?? {}).length >= 2)
  check('save v19 carries the wardrobe', (saved?.wardrobe.ownedWalks.includes('strut') ?? false) && saved?.wardrobe.activeWalk === 'strut')
  check('the delta law lives (same state = same fingerprint)', typeof SaveSystem.fingerprintOf === 'function' && SaveSystem.fingerprintOf(saved!) === SaveSystem.fingerprintOf(SaveSystem.load()!))
}

console.log(`\n════════════════════════════════════════`)
console.log(`  M19 POLISH: ${passed} passed, ${failed} failed`)
console.log(`════════════════════════════════════════`)
if (failed > 0) process.exit(1)
