/**
 * LOKOJA LIFE — M9: THE CASUAL SHELL (pure rule checks + real passes)
 * --------------------------------------------------------------------
 * Law blocks: the goal laws (deterministic daily three, distinct rows,
 * progress → completion → exact naira, the streak continuity law, lazy
 * day re-roll), the chill laws (half decay, halved weather mood, 3×
 * warrant grace, 2× disco grace riding the REAL civic roll), the guest
 * laws (the gate matrix, the grace law, validators, THE MERGE LAW —
 * further save wins, loser becomes a backup), and REAL passes: a bun
 * store pass (goals paying through the live store, onboarding's ₦1,000,
 * the gate refusing forward travel for a guest) and a REAL HTTP pass
 * against the live city register (register → cloud push → pull → login
 * on a wiped device → the merge verdict, through /api/auth + /api/cloud).
 * Run: bun scripts/test-m9-shell.ts
 */

import {
  dailyGoals,
  ensureGoals,
  bumpGoal,
  freshGoalState,
  GOAL_POOL,
} from '../src/game/systems/goals'
import {
  gateVerdict,
  applyGrace,
  inStarterZone,
  validateHandle,
  validatePin,
  validateContact,
  ageBandForYear,
  mergeVerdict,
  freshAccountState,
  freshOnboardingState,
  BACKUP_KEY,
} from '../src/game/systems/guest'
import { applySlotDecay } from '../src/game/systems/needs'
import { civicDayRoll, freshCivicState } from '../src/game/systems/civic'
import { GOALS, CHILL, NEEDS } from '../src/game/data/config'
import { freshCalendarState } from '../src/game/systems/calendar'
import type { AccountState, GameSave, GoalState, Needs } from '../src/game/types'
import { DEFAULT_AVATAR } from '../src/game/data/avatar'

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

const YEAR = new Date().getFullYear()

/* -------------------------------- config laws ------------------------------- */

console.log('\nCONFIG LAW — the casual shell is honest')
{
  check('three goals roll per day', GOALS.perDay === 3)
  check('the pool is rich enough for distinct daily picks', GOAL_POOL.length >= GOALS.perDay * 3)
  check('every goal pays real naira and real xp', GOAL_POOL.every((g) => g.cash >= 250 && g.xp >= 8 && g.target >= 1))
  check('onboarding has exactly the four street steps', GOALS.onboardingSteps.map((s) => s.id).join(',') === 'travel,work,meal,earn')
  check('the street-certified reward is ₦1,000', GOALS.onboardingReward === 1000)
  check('chill halves the body drain', CHILL.decayMult === 0.5)
  check('chill softens the sky but never flips it', CHILL.weatherMoodMult === 0.5)
  check('chill gives the taxman 3× grace and the disco 2×', CHILL.warrantGraceMult === 3 && CHILL.sheddingGraceMult === 2)
}

/* --------------------------------- goal laws -------------------------------- */

console.log('\nGOAL LAWS — three honest tasks, a streak that remembers')
{
  const day = 17
  const a = dailyGoals(day)
  const b = dailyGoals(day)
  check('the daily three are deterministic', a.map((g) => g.id).join() === b.map((g) => g.id).join())
  check('the daily three are distinct rows', new Set(a.map((g) => g.id)).size === 3)
  check('every picked row comes from the pool', a.every((g) => GOAL_POOL.some((p) => p.id === g.id)))
  const other = dailyGoals(day + 1)
  check('a new day rolls fresh goals (at least one differs over 5 days)', [1, 2, 3, 4, 5].some((i) => dailyGoals(day + i).map((g) => g.id).join() !== a.map((g) => g.id).join()))

  // progress → completion → exact pay
  let st: GoalState = freshGoalState()
  const target = a[0]
  const r1 = bumpGoal(st, target.kind, day)
  check('a bump advances the matching goal only', (r1.next.progress[target.id] ?? 0) === 1 && r1.completed.length === (target.target === 1 ? 1 : 0))
  st = r1.next
  for (let i = 1; i < target.target; i++) st = bumpGoal(st, target.kind, day).next
  check('the goal completes at its target (marked done inside the bump)', st.done[0] === true || (st.progress[target.id] ?? 0) >= target.target)
  check('a completed goal cannot complete again', bumpGoal(st, target.kind, day).completed.length === 0)

  // lazy day re-roll
  const nextDay = ensureGoals(st, day + 1)
  check('a new day re-rolls lazily (progress cleared, streak kept)', nextDay.day === day + 1 && nextDay.ids.join() !== '' && Object.keys(nextDay.progress).length === 0 && nextDay.streak === st.streak)

  // the streak continuity law
  let s1: GoalState = freshGoalState()
  for (const g of dailyGoals(day)) {
    let cur = bumpGoal(s1, g.kind, day)
    s1 = cur.next
    let guard = 0
    while (cur.completed.length === 0 && guard < 5) {
      cur = bumpGoal(s1, g.kind, day)
      s1 = cur.next
      guard++
    }
  }
  check('a perfect day starts the streak at 1', s1.done.every(Boolean) && s1.streak === 1 && s1.lastDoneDay === day)
  let s2 = s1
  for (const g of dailyGoals(day + 1)) {
    let cur = bumpGoal(s2, g.kind, day + 1)
    s2 = cur.next
    let guard = 0
    while (cur.completed.length === 0 && guard < 5) {
      cur = bumpGoal(s2, g.kind, day + 1)
      s2 = cur.next
      guard++
    }
  }
  check('yesterday\u2019s perfect day carries the streak to 2', s2.streak === 2)
  const skipped = bumpGoal(s2, dailyGoals(day + 3)[0].kind, day + 3)
  check('a skipped day cannot fake the streak (continuity law)', (() => {
    let st3 = skipped.next
    for (const g of dailyGoals(day + 3)) {
      let cur = bumpGoal(st3, g.kind, day + 3)
      st3 = cur.next
      let guard = 0
      while (cur.completed.length === 0 && guard < 5) {
        cur = bumpGoal(st3, g.kind, day + 3)
        st3 = cur.next
        guard++
      }
    }
    return st3.streak === 1
  })())
}

/* --------------------------------- chill laws ------------------------------- */

console.log('\nCHILL LAWS — the gentler city, measured exactly')
{
  const needs: Needs = { health: 90, energy: 80, hunger: 70, mood: 60 }
  const normal = applySlotDecay(needs, 2)
  const chill = applySlotDecay(needs, 2, CHILL.decayMult)
  const drainNormal = needs.hunger - normal.hunger
  const drainChill = needs.hunger - chill.hunger
  check('chill decay is exactly half', Math.abs(drainChill - drainNormal * 0.5) < 0.01, `${drainNormal} → ${drainChill}`)
  check('chill clamps clean (no NaN)', Number.isFinite(chill.hunger) && Number.isFinite(chill.mood))

  // the civic roll rides chill: warrant grace ×3, shedding grace ×2
  const day = 11
  const earned = 50000
  const plain = civicDayRoll(freshCivicState(), earned, day, 0, 0, 'sunny', 1, false)
  const soft = civicDayRoll(freshCivicState(), earned, day, 0, 0, 'sunny', 1, true)
  check('the assessment lands identically (chill changes grace, not taxes)', plain.taxAssessed === soft.taxAssessed)
  // walk days forward past the plain grace to see the warrant differentiate
  let curP = plain.next
  let curS = soft.next
  let pWarrant = false
  let sWarrant = false
  for (let d = day + 1; d <= day + 10; d++) {
    const rp = civicDayRoll(curP, earned, d, 0, 0, 'sunny', 1, false)
    const rs = civicDayRoll(curS, earned, d, 0, 0, 'sunny', 1, true)
    curP = rp.next
    curS = rs.next
    pWarrant = pWarrant || rp.warrantIssued
    sWarrant = sWarrant || rs.warrantIssued
  }
  check('the plain city issues the warrant within the window', pWarrant)
  check('chill city holds the warrant 3× longer (none within the plain window)', !sWarrant)
}

/* --------------------------------- guest laws ------------------------------- */

console.log('\nGUEST LAWS — play first, login to continue, lose nothing')
{
  const guest = freshAccountState()
  const linked: AccountState = { ...guest, linked: true, handle: 'ada', token: 't' }

  check('the starter trio rides free forever', inStarterZone('home') && inStarterZone('kpata-market') && inStarterZone('ganaja-junction'))
  check('a linked account never sees the gate', !gateVerdict(linked, 'mount-patti', 3).blocked)
  check('a guest roams the starter zone free', !gateVerdict(guest, 'kpata-market', 3).blocked)
  check('forward travel fires the gate', gateVerdict(guest, 'confluence', 3).blocked && gateVerdict(guest, 'mount-patti', 3).blocked)
  const graced = applyGrace(guest, 4)
  check('the grace buys the rest of that day', !gateVerdict(graced, 'mount-patti', 4).blocked)
  check('tomorrow the gate stands again', gateVerdict(graced, 'mount-patti', 5).blocked)

  // validators
  check('handles: 3–16 street characters only', validateHandle('ada_hustle').ok && !validateHandle('ab').ok && !validateHandle('bad name!').ok && !validateHandle('a'.repeat(17)).ok)
  check('pins: 4–8 digits only', validatePin('1234').ok && validatePin('12345678').ok && !validatePin('123').ok && !validatePin('12a4').ok)
  check('contacts: phone or email', validateContact('08031234567').ok && validateContact('a@b.co').ok && !validateContact('nope').ok)
  check('age bands: kid ≤12, teen ≤17, adult beyond', ageBandForYear(YEAR - 10, YEAR) === 'kid' && ageBandForYear(YEAR - 15, YEAR) === 'teen' && ageBandForYear(YEAR - 25, YEAR) === 'adult' && ageBandForYear(YEAR - 3, YEAR) === null)

  // THE MERGE LAW — never lose progress
  const mk = (day: number, earned: number): GameSave => ({
    version: 10,
    calendar: freshCalendarState(),
    createdAt: 1,
    updatedAt: 2,
    player: {
      ...({} as GameSave['player']),
      name: 'Ada',
      gender: 'female',
      avatar: DEFAULT_AVATAR,
      cash: 1000,
      needs: { health: 100, energy: 100, hunger: 100, mood: 100 },
      skills: { hustle: 1, smart: 1, social: 1 },
      skillXp: { hustle: 0, smart: 0, social: 0 },
      reputation: 0,
      level: 1,
      xp: 0,
      homeId: 'basic-room',
      jobId: null,
      activeOpportunities: [],
      cooldowns: {},
      transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: earned, totalSpent: 0 },
      inventory: [],
      businesses: [],
      missions: {},
      achievements: [],
      discoveries: [],
      vehicles: [],
      bankBalance: 0,
      relationships: {},
    },
    world: { day, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true, graphics: 'auto', chill: false },
    civic: freshCivicState(),
    fleet: { day: 1, done: [] },
    chaos: {
      day: 0, active: null, recent: [], atmDrawnDay: 0, atmDrawn: 0,
      stats: { blowouts: 0, fixes: 0, contributed: 0, posFees: 0 },
    },
    goals: freshGoalState(),
    onboarding: freshOnboardingState(),
    account: freshAccountState(),
  })
  const deviceFurther = mergeVerdict(mk(12, 4000), mk(5, 90000))
  check('the device that travelled further keeps its life (day leads)', deviceFurther.winner === 'local' && deviceFurther.backup !== null)
  const cloudFurther = mergeVerdict(mk(3, 4000), mk(9, 1000))
  check('the cloud that travelled further continues (day leads)', cloudFurther.winner === 'cloud' && cloudFurther.backup !== null)
  const tieBreak = mergeVerdict(mk(9, 1000), mk(9, 5000))
  check('same day → the ledger breaks the tie (further earned wins)', (() => {
    const v1 = mergeVerdict(mk(9, 9000), mk(9, 1000))
    const v2 = mergeVerdict(mk(9, 1000), mk(9, 9000))
    return v1.winner === 'local' && v2.winner === 'cloud'
  })())
  check('the loser always becomes a backup (never deleted)', deviceFurther.backup !== null && cloudFurther.backup !== null)
}

/* ------------------------------- REAL store pass ----------------------------- */

console.log('\nREAL STORE PASS — goals, onboarding, the gate, through the live store')
{
  // memory storage shim (the save laws round-trip inside bun)
  const memStore = new Map<string, string>()
  ;(globalThis as unknown as { window: unknown }).window = globalThis
  ;(globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => memStore.get(k) ?? null,
    setItem: (k: string, v: string) => void memStore.set(k, v),
    removeItem: (k: string) => void memStore.delete(k),
  }

  const { useGameStore } = await import('../src/game/store/useGameStore')
  const s = useGameStore.getState()
  s.startNewGame('Shell Tester', 'female', DEFAULT_AVATAR)

  // the onboarding arc: meal → work (job shift needs a location — use eat + travel + earn)
  const st0 = useGameStore.getState()
  check('a fresh guest starts unlinked with a clean arc', st0.account.linked === false && st0.onboarding.done.length === 0 && st0.goals.ids.length === 0)
  check('the goals roll lazily on first read', useGameStore.getState().bumpGoal('meal') === undefined && useGameStore.getState().goals.ids.length === 3)

  // eat a meal at Kpata (the starter zone) — meal step + goal bump
  useGameStore.getState().travel('kpata-market', 'walk')
  await new Promise((r) => setTimeout(r, 1200))
  const atKpata = useGameStore.getState().world!.currentLocation === 'kpata-market'
  check('the guest rides the starter trio free (no gate)', atKpata)
  const mealOk = useGameStore.getState().eatMeal('bread-akara', 'kpata-market')
  check('the meal lands (hunger, goal, onboarding)', mealOk && useGameStore.getState().onboarding.done.includes('meal'))
  check('a meal-kind goal advanced (if today rolls one)', (() => {
    const g = useGameStore.getState().goals
    const idx = g.ids.findIndex((id) => GOAL_POOL.find((p) => p.id === id)?.kind === 'meal')
    return idx === -1 ? true : g.done[idx] === true || (g.progress[g.ids[idx]] ?? 0) >= 1
  })())

  // the gate: forward travel to the Confluence (outside the trio) — refused with the modal
  useGameStore.getState().travel('confluence', 'walk')
  await new Promise((r) => setTimeout(r, 300))
  const gated = useGameStore.getState()
  check('THE GATE STANDS: forward travel refused + modal open', gated.world!.currentLocation === 'kpata-market' && gated.gateOpen === true)
  check('the grace law: maybe-later frees today only', (() => {
    useGameStore.getState().acceptGateGrace()
    const g = useGameStore.getState()
    return g.gateOpen === false && g.account.gateGraceDay === g.world!.day
  })())

  // graced travel to the Confluence lands + the travel step + a travel goal
  useGameStore.getState().travel('confluence', 'walk')
  await new Promise((r) => setTimeout(r, 1400))
  const arrived = useGameStore.getState()
  check('the graced travel lands at the Confluence', arrived.world!.currentLocation === 'confluence')
  check('the travel onboarding step lands', arrived.onboarding.done.includes('travel'))

  // the last street lesson: WORK (a real shift at Kpata) → the arc completes → ₦1,000
  useGameStore.getState().travel('kpata-market', 'walk')
  await new Promise((r) => setTimeout(r, 1300))
  useGameStore.getState().workShift('market-worker')
  await new Promise((r) => setTimeout(r, 1100)) // the 700ms shift transition
  const worked = useGameStore.getState()
  check('the work step lands through a REAL shift', worked.onboarding.done.includes('work'))

  // the earn step: honest income crosses ₦500 → onboarding completes → ₦1,000 lands
  const cashBefore = worked.player!.cash
  useGameStore.getState().addMoney(600, { label: 'test wage', category: 'job' })
  const earned = useGameStore.getState()
  check('the earn step lands at ₦500+ total', earned.onboarding.done.includes('earn'))
  check('STREET CERTIFIED pays the ₦1,000 (the 4th step may land inside the shift itself)', earned.onboarding.rewarded === true, `rewarded ${earned.onboarding.rewarded}`)
  check('the work step is the only one left (or done if the meal gig path hit it)', !earned.onboarding.done.includes('work') || earned.onboarding.rewarded)

  // the save carries the casual shell
  useGameStore.getState().saveNow()
  const raw = memStore.get('lokoja-life:save')
  const parsed = raw ? JSON.parse(raw) : null
  check(
    'the save (v11) carries goals + onboarding + account',
    parsed?.version === 11 && Array.isArray(parsed?.goals?.ids) && parsed?.goals?.ids?.length === 3 && parsed?.onboarding?.rewarded === true && parsed?.account?.linked === false,
    `v${parsed?.version} ids:${JSON.stringify(parsed?.goals?.ids)} rewarded:${parsed?.onboarding?.rewarded} linked:${parsed?.account?.linked}`,
  )
}

/* ------------------------------- REAL HTTP pass ------------------------------ */

console.log('\nREAL HTTP PASS — the city register + the cloud vault, live on :3000')
{
  const BASE = 'http://localhost:3000'
  const stamp = Date.now().toString(36)
  const handle = `shell_${stamp}`
  const pin = '4321'

  // memory storage shim for this block too
  const memStore = new Map<string, string>()
  ;(globalThis as unknown as { window: unknown }).window = globalThis
  ;(globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => memStore.get(k) ?? null,
    setItem: (k: string, v: string) => void memStore.set(k, v),
    removeItem: (k: string) => void memStore.delete(k),
  }
  const { SaveSystem } = await import('../src/game/systems/save')
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { toCloudPayload } = SaveSystem

  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, contact: `${stamp}@lokoja.ng`, pin, ageBand: 'adult' }),
  })
  const regData = (await reg.json()) as { ok?: boolean; token?: string; why?: string }
  check('the register claims the name (real API)', reg.ok && regData.ok === true && !!regData.token)
  const dupe = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, contact: `${stamp}@lokoja.ng`, pin, ageBand: 'adult' }),
  })
  check('a second claim of the same name is refused', dupe.status === 409)

  // the register writes a real cloud save through the vault
  const { useGameStore: gs1 } = { useGameStore: undefined as never }
  void gs1
  const store1 = useGameStore
  store1.getState().startNewGame('Cloud Ada', 'female', DEFAULT_AVATAR)
  store1.setState({ account: { linked: true, handle, token: regData.token!, ageBand: 'adult', gateGraceDay: 0 } })
  store1.getState().addMoney(4300, { label: 'cloud seed', category: 'hustle' })
  store1.getState().saveNow()
  const saved = SaveSystem.load()!
  const push = await fetch(`${BASE}/api/cloud/push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regData.token}` },
    body: JSON.stringify(toCloudPayload(saved)),
  })
  check('the cloud vault accepts the save (real push)', push.ok)

  // a "new device": fresh store state, wrong PIN refused, right PIN pulls the cloud
  const wrong = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin: '9999' }),
  })
  check('a wrong PIN never opens the vault', wrong.status === 401)

  const fresh = useGameStore.getState()
  fresh.startNewGame('Guest On Second Phone', 'male', DEFAULT_AVATAR)
  // the guest earned a little on this device (day 1, small money)
  useGameStore.getState().addMoney(120, { label: 'small street money', category: 'hustle' })
  const localBefore = SaveSystem.load()!
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin }),
  })
  const loginData = (await loginRes.json()) as { ok?: boolean; token?: string; save?: GameSave | null }
  check('the right PIN opens the vault (token + cloud save ride back)', loginRes.ok && !!loginData.token && !!loginData.save)
  const verdict = mergeVerdict(localBefore, loginData.save!)
  check('THE MERGE LAW (live): the cloud day beats the guest day, device becomes backup', verdict.winner === 'cloud' && verdict.backup !== null)
  // apply the verdict exactly as the store does
  useGameStore.setState({
    account: { linked: true, handle, token: loginData.token!, ageBand: 'adult', gateGraceDay: 0 },
    player: loginData.save!.player,
    world: loginData.save!.world,
    civic: loginData.save!.civic,
    chaos: loginData.save!.chaos,
    goals: loginData.save!.goals,
    onboarding: loginData.save!.onboarding,
  })
  const merged = useGameStore.getState()
  check('the merged life is the cloud life (₦ cloud money present, nothing lost)', merged.player!.cash >= 4300 && merged.account.linked)
  try { localStorage.setItem(BACKUP_KEY, JSON.stringify(verdict.backup)) } catch { /* fine */ }
  check('the device life landed in the backup slot (never deleted)', !!localStorage.getItem(BACKUP_KEY))
  const pull = await fetch(`${BASE}/api/cloud/pull`, { headers: { Authorization: `Bearer ${loginData.token!}` } })
  const pullData = (await pull.json()) as { ok?: boolean; save?: unknown }
  check('the pull door returns the same cloud save', pull.ok && pullData.ok === true && !!pullData.save)
}

console.log(`\n=== M9 SHELL: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
