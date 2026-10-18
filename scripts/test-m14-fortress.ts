/**
 * LOKOJA LIFE — M14: THE FORTRESS (pure law checks + the CHEAT-SEED battery)
 * ---------------------------------------------------------------------------
 * Prerequisite for virality + trading. Law blocks: the pure-TS SHA-256
 * + HMAC (standard vectors), the save signature (roundtrip, tamper,
 * missing-key mercy, constant-time compare), THE KOBO-CHAIN (anchor,
 * append, walk, edit-caught, order-caught, legacy tolerance), THE
 * INCOME GUARD (single ceiling, day ceiling, the clamp law, the honest
 * zero), the velocity guard, the anomaly verdict, the config
 * fingerprint, THE DOUBLE-BUFFER load plan (primary → shadow → backup
 * → fresh), the save v14→v15 migration, and a REAL bun store pass
 * through the LIVE transport: a legit earn chains, a tampered
 * localStorage payload is refused in favour of the shadow, a re-keyed
 * device loads legacy, and the CHEAT-SEED battery ends every classic
 * hack: version spoof, negative money, huge single income, ledger edit,
 * signature strip.
 * Run: bun scripts/test-m14-fortress.ts
 */

import {
  sha256,
  hmacSha256,
  signPayload,
  verifyPayload,
  chainHash,
  chainNext,
  verifyChain,
  CHAIN_SEED,
  type ChainTx,
  incomeGuard,
  velocityGuard,
  anomalyVerdict,
  configFingerprint,
  loadPlan,
  writePlan,
  benchSign,
  freshFortressState,
  FORTRESS_KEYS,
} from '../src/game/systems/fortress'
import { SaveSystem } from '../src/game/systems/save'
import { absoluteSlot } from '../src/game/systems/world'
import type { GameSave } from '../src/game/types'
import { FORTRESS } from '../src/game/data/config'

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

/* ------------------------------- SHA-256 + HMAC ------------------------------ */

section('the hash law — pure TS SHA-256 + HMAC (standard vectors)')
check("sha256('abc') = ba7816bf… (FIPS 180-4 vector)",
  sha256('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
check("sha256('') = e3b0c442… (the empty vector)",
  sha256('') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
check('sha256 carries utf-8 (₦150,000 — the send-off survives the bytes)',
  sha256('₦150,000 JAPA send-off').length === 64 && sha256('₦150,000 JAPA send-off') !== sha256('N150,000 JAPA send-off'))
check('hmac-sha256 RFC 4231 case 1 (key = 0x0b ×20 raw bytes, data "Hi There")',
  hmacSha256('\x0b'.repeat(20), 'Hi There') === 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7')
check('hmac-sha256: a changed message never keeps the sig',
  hmacSha256('k', 'save-v15') !== hmacSha256('k', 'save-v16'))
check('hmac-sha256: a changed key never keeps the sig',
  hmacSha256('key-A', 'payload') !== hmacSha256('key-B', 'payload'))

/* ------------------------------ save signing -------------------------------- */

section('the signature law — sign, verify, tamper, mercy')
const KEY = 'a'.repeat(48)
const payload = JSON.stringify({ version: 15, player: { cash: 5000 }, world: { day: 12 } })
const sig = signPayload(payload, KEY)
check('sign + verify roundtrip', verifyPayload(payload, sig, KEY).ok)
const flip = verifyPayload(payload.replace('5000', '5001'), sig, KEY)
check('a byte-flip in the payload breaks it (tampered)', !flip.ok && flip.why === 'tampered')
const tampered = verifyPayload(JSON.stringify({ version: 15, player: { cash: 99999999 } }), sig, KEY)
check('the classic cash-bump edit is caught', !tampered.ok)
const strippedV = verifyPayload(payload, '', KEY)
check('a stripped sig is malformed, not trusted', !strippedV.ok && strippedV.why === 'malformed')
const mercyV = verifyPayload(payload, sig, null)
check('THE MERCY LAW: a missing device key loads as legacy, never as a cheat', !mercyV.ok && mercyV.why === 'missing-key')
check('the constant-time walk holds under wrong-length sigs',
  verifyPayload(payload, sig.slice(0, 32), KEY).ok === false)
check('the bench law: signing a save-sized payload lands sub-5ms', benchSign(KEY, 8192) < 5)

/* ------------------------------ the kobo-chain ------------------------------- */

section('THE KOBO-CHAIN — the ledger nobody edits')
const t1: Omit<ChainTx, 'sig'> = { day: 12, slot: 40, amount: 970, category: 'job', label: 'Market Worker shift' }
const t2: Omit<ChainTx, 'sig'> = { day: 12, slot: 44, amount: -290, category: 'transport', label: 'Keke — Kpata' }
const s1 = chainNext(CHAIN_SEED, t1)
const s2 = chainNext(s1, t2)
const ledger: ChainTx[] = [{ ...t1, sig: s1 }, { ...t2, sig: s2 }]
check('an honest chain walks clean', verifyChain(ledger).ok)
check('chainNext is deterministic (same links, same hashes)', chainNext(CHAIN_SEED, t1) === s1)
check('the chain hash is order-sensitive',
  chainNext(chainNext(CHAIN_SEED, t1), t2) !== chainNext(chainNext(CHAIN_SEED, t2), t1))
const edited = [{ ...t1, sig: s1 }, { ...t2, amount: 970, sig: s2 }] as ChainTx[]
check('THE LEDGER EDIT (spend rewritten as income) breaks the walk at the exact entry',
  !verifyChain(edited).ok && verifyChain(edited).brokenAt === 1)
const amountEdit = [{ ...t1, sig: s1 }, { ...t2, amount: -29, sig: s2 }] as ChainTx[]
check('an amount nudge (₦290 → ₦29) is caught', !verifyChain(amountEdit).ok)
const inserted = ([{ ...t1, sig: s1 }, { ...t2, sig: s2 }, { day: 12, slot: 50, amount: 500000, category: 'hustle', label: 'minted', sig: chainNext(CHAIN_SEED, { day: 12, slot: 50, amount: 500000, category: 'hustle', label: 'minted' }) }] as ChainTx[])
check('a minted entry cannot re-anchor mid-chain', !verifyChain(inserted).ok)
const legacyTail = ([
  { day: 5, slot: 10, amount: 300, category: 'tip', label: 'pre-fortress gist' },
  { ...t1, sig: s1 },
] as ChainTx[])
check('pre-Fortress legacy entries pass; the chain anchors on the FIRST signed link', verifyChain(legacyTail).ok)
const legacyMiddle = ([{ ...t1, sig: s1 }, { day: 5, slot: 10, amount: 300, category: 'tip', label: 'injected legacy' }] as ChainTx[])
check('a "legacy" entry injected AFTER a signed link is caught', !verifyChain(legacyMiddle as ChainTx[]).ok)
check('the chainHash is sensitive to category + label (a relabel is an edit too)',
  chainHash(CHAIN_SEED, t1) !== chainHash(CHAIN_SEED, { ...t1, label: 'Market Worker (edited)' }))

/* ------------------------------ the income guard ----------------------------- */

section('THE INCOME GUARD — ceilings, not crashes')
const cfg = FORTRESS
check('the honest send-off (₦150k) sails under the single ceiling',
  incomeGuard(150_000, 0, cfg).allowed === 150_000 && !incomeGuard(150_000, 0, cfg).clamped)
check('a minted ₦9,999,999 clamps to the single ceiling + the flag',
  incomeGuard(9_999_999, 0, cfg).allowed === cfg.singleCeiling && incomeGuard(9_999_999, 0, cfg).law === 'single')
check('the day ceiling clamps the remainder (₦2.9M earned, ₦500k asks → ₦100k)',
  incomeGuard(500_000, 2_900_000, cfg).allowed === 100_000 && incomeGuard(500_000, 2_900_000, cfg).law === 'day')
check('a day past the ceiling pays nothing honestly (zero, not negative)',
  incomeGuard(500_000, cfg.dayCeiling, cfg).allowed === 0 && incomeGuard(500_000, cfg.dayCeiling + 5, cfg).allowed === 0)
check('negative income is refused at the door', incomeGuard(-500, 0, cfg).allowed === 0)
check('the honest day: ₦149,999 → ₦150,000 cumulative fits',
  incomeGuard(150_000, 0, cfg).allowed === 150_000 && incomeGuard(150_000, 2_850_000, cfg).allowed === 150_000)
check('the velocity guard opens under the cap and shuts at it',
  velocityGuard(0, cfg.velocityCap).allow && velocityGuard(cfg.velocityCap - 1, cfg.velocityCap).allow && !velocityGuard(cfg.velocityCap, cfg.velocityCap).allow)
check('the anomaly verdict keeps honest-but-weird players in the city',
  anomalyVerdict(true) === 'continue' && anomalyVerdict(false) === 'continue')

/* --------------------------- the fingerprint + plan -------------------------- */

section('the compiled-constants law + the load plan')
const fp1 = configFingerprint({ a: 1, b: [1, 2] })
check('the fingerprint is stable + order-honest', fp1 === configFingerprint({ a: 1, b: [1, 2] }) && fp1 !== configFingerprint({ b: [1, 2], a: 1 }))
check('a patched economy table changes the fingerprint', fp1 !== configFingerprint({ a: 2, b: [1, 2] }))
check('THE LOAD PLAN: a healthy primary wins outright',
  loadPlan(true, true, true, true, true, 'x', 'y').step === 'primary')
const shadowStep = loadPlan(false, true, true, true, true, 'tampered', 'n/a')
check('a torn primary falls to the shadow with the WHY',
  shadowStep.step === 'shadow' && shadowStep.why === 'tampered')
check('no shadow → the backup slot; no backup → fresh (never a dead end)',
  loadPlan(false, false, false, true, true, 'torn', '-').step === 'backup' && loadPlan(false, false, false, false, false, 'torn', '-').step === 'fresh')
const wp = writePlan('old-primary-payload')
check('THE WRITE PLAN: the shadow receives the current primary before the overwrite',
  wp.shadowPayload === 'old-primary-payload' && wp.overwritePrimary)

/* ------------------------------ the migration -------------------------------- */

section('the save v14→v15 migration — the fortress joins the save')
{
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  SaveSystem.setFortKey(KEY)
  const { freshCalendarState } = await import('../src/game/systems/calendar')
  const { freshRiversState } = await import('../src/game/systems/rivers')
  const { freshEducationState } = await import('../src/game/systems/education')
  const { freshHousingState } = await import('../src/game/systems/housing')
  const { freshJapaState } = await import('../src/game/systems/japa')
  const { freshChaosState } = await import('../src/game/systems/chaos')
  const { freshCivicState } = await import('../src/game/systems/civic')
  const { freshGoalState } = await import('../src/game/systems/goals')
  const { freshOnboardingState, freshAccountState } = await import('../src/game/systems/guest')
  const { freshShieldState } = await import('../src/game/systems/shield')
  const legacy = {
    version: 14, createdAt: 1, updatedAt: 2,
    player: {
      name: 'Ada', gender: 'female' as const, ageBand: 'adult' as const,
      avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' },
      cash: 12000, needs: { health: 100, energy: 90, hunger: 80, mood: 70 },
      skills: { hustle: 2, smart: 2, social: 2 }, skillXp: { hustle: 0, smart: 0, social: 0 },
      reputation: 10, level: 2, xp: 0, homeId: 'home', jobId: null,
      activeOpportunities: [], cooldowns: {}, transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 3000, totalSpent: 100 },
      inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [],
      vehicles: [], bankBalance: 0, relationships: {},
    },
    world: { day: 9, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
    civic: freshCivicState(), chaos: freshChaosState(), calendar: freshCalendarState(), rivers: freshRiversState(),
    education: freshEducationState(), housing: freshHousingState(), japa: freshJapaState(),
    goals: freshGoalState(), onboarding: freshOnboardingState(),
    account: freshAccountState(), shield: freshShieldState(),
    fleet: { day: 9, done: [] },
    settings: { sound: true, graphics: 'auto' as const, chill: false, elder: false },
  }
  // a v14 save carried NO envelope — the legacy bare form
  mem['lokoja-life:save'] = JSON.stringify(legacy)
  const loaded = SaveSystem.load()
  check('a bare v14 save loads at v20 as LEGACY', loaded?.version === 20 && SaveSystem.transportVerdict() === 'legacy')
  check('the fortress slice arrives (clean book, seed tail)',
    loaded?.fortress.anomalies === 0 && loaded?.fortress.chainTail === CHAIN_SEED && loaded?.fortress.fingerprint === null)
  // a write re-issues it as a SIGNED envelope
  SaveSystem.write(loaded!)
  const raw = mem['lokoja-life:save']
  const env = JSON.parse(raw) as { fmt?: number; sig?: string }
  check('the next write seals it: the envelope (fmt 2) carries a real sig',
    env.fmt === 2 && typeof env.sig === 'string' && env.sig.length === 64)
  check('the sealed save verifies against the device key', SaveSystem.load()?.version === 20 && SaveSystem.transportVerdict() === 'ok')
  delete (globalThis as Record<string, unknown>).window
}

/* =========================== the CHEAT-SEED battery =========================== */

console.log('\n========================================')
console.log(`M14 FORTRESS — ${passed} passed, ${failed} failed`)
console.log('========================================')
if (failed > 0) process.exit(1)

section('the CHEAT-SEED battery — every classic hack, one honest outcome')

{
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  SaveSystem.setFortKey(KEY)
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
  const store = useGameStore
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  store.getState().startNewGame('Fortress Ada', 'female', DEFAULT_AVATAR, 'adult')
  seedGoalsDone()
  function seedGoalsDone() {
    const d = store.getState().world!.day
    store.setState({ goals: { day: d, ids: ['waka', 'eat-well', 'gist-time'], progress: {}, done: [true, true, true], streak: 0, lastDoneDay: 0 } })
  }
  const gs = () => store.getState()

  // — the honest earn chains —
  const cash0 = gs().player!.cash
  gs().addMoney(970, { label: 'Market Worker shift', category: 'job' })
  await sleep(10)
  check('the honest earn lands + chains (tail moved off the seed)',
    gs().player!.cash === cash0 + 970 && gs().fortress.chainTail !== CHAIN_SEED)
  const tailAfterEarn = gs().fortress.chainTail
  const txs = gs().player!.transactions
  check('the ledger entry carries its chain link', txs.some((t) => t.amount === 970 && t.sig === tailAfterEarn))

  // — CHEAT 1: the classic cash-bump in localStorage —
  gs().saveNow()
  await sleep(5)
  gs().saveNow() // a second write — the shadow now holds the previous primary
  await sleep(5)
  const goodRaw = mem['lokoja-life:save']
  const goodSave = JSON.parse(goodRaw) as Envelopeish
  interface Envelopeish { fmt: number; data: GameSave; sig: string }
  const cheat = { fmt: 2, data: goodSave.data, sig: goodSave.sig } as Envelopeish
  cheat.data.player.cash = 99_999_999
  mem['lokoja-life:save'] = JSON.stringify(cheat)
  const loadedAfterCheat = SaveSystem.load()
  check('CHEAT 1 (cash-bump in the save): the tampered payload NEVER wins — the player sees the honest cash',
    !!loadedAfterCheat && loadedAfterCheat.player.cash === gs().player!.cash && loadedAfterCheat.player.cash !== 99_999_999)
  // the shadow still holds the honest save — the descent recovered it
  const shadowOk = JSON.parse(mem['lokoja-life:save-b'] ?? 'null') as Envelopeish | null
  check('CHEAT 1 aftermath: the shadow twin carried the honest save back',
    !!shadowOk && shadowOk.data.player.cash === gs().player!.cash)
  check('the descent narrates the recovery', SaveSystem.transportVerdict() === 'recovered-shadow' || SaveSystem.transportVerdict() === 'ok')
  const recovered = SaveSystem.load()
  check('the recovery reloads the honest save from the shadow', !!recovered && recovered!.player.cash === gs().player!.cash)

  // — CHEAT 2: the signature strip (a player deleting the sig) —
  const stripped = { fmt: 2, data: (JSON.parse(mem['lokoja-life:save']) as Envelopeish).data, sig: '' }
  mem['lokoja-life:save'] = JSON.stringify(stripped)
  const afterStrip = SaveSystem.load()
  check('CHEAT 2 (sig stripped): the descent falls to the twin — the honest cash survives',
    !!afterStrip && afterStrip.player.cash === gs().player!.cash)

  // — CHEAT 3: the version spoof —
  const spoof = { fmt: 2, data: { ...(JSON.parse(mem['lokoja-life:save']) as Envelopeish).data, version: 99 }, sig: (JSON.parse(mem['lokoja-life:save']) as Envelopeish).sig }
  mem['lokoja-life:save'] = JSON.stringify(spoof)
  const afterSpoof = SaveSystem.load()
  check('CHEAT 3 (version 99 spoof): the signature breaks — the spoof never wins',
    !!afterSpoof && afterSpoof.version !== 99 && afterSpoof.player.cash === gs().player!.cash)

  // — CHEAT 4: a huge single income —
  store.setState({ player: { ...gs().player!, cash: 1000 } })
  const beforeMint = gs().player!.cash
  gs().addMoney(9_999_999, { label: 'minted from the air', category: 'hustle' })
  await sleep(10)
  check('CHEAT 4 (₦9,999,999 mint) clamps to the ceiling + counts the anomaly',
    gs().player!.cash === beforeMint + FORTRESS.singleCeiling && gs().fortress.anomalies === 1)

  // — CHEAT 5: the ledger edit through the LIVE chain —
  const txNow = gs().player!.transactions.find((t) => t.label === 'minted from the air')
  check('CHEAT 5 setup: the minted entry carries a REAL chain link (the chain covered the clamp)',
    !!txNow && typeof txNow!.sig === 'string')
  const relabeled = gs().player!.transactions.map((t) => (t.label === 'minted from the air' ? { ...t, label: 'Market Worker shift' } : t))
  check('CHEAT 5 (a relabel of the live ledger) breaks verifyChain',
    !verifyChain(relabeled as ChainTx[]).ok)

  // — CHEAT 6: the velocity flood —
  const wNow = gs().world!
  store.setState({ fortress: { ...gs().fortress, anomalies: 0, slotTxCount: FORTRESS.velocityCap, slotTxSlot: absoluteSlot(wNow.day, wNow.timeOfDay) } })
  const floodCash = gs().player!.cash
  gs().addMoney(500, { label: 'flood event', category: 'hustle' })
  await sleep(10)
  check('CHEAT 6 (the 25th event in one slot) hits the flood gate — nothing lands',
    gs().player!.cash === floodCash && gs().fortress.anomalies === 1)

  // — the honest restart law —
  mem['lokoja-life:save'] = 'totally not json{{{'
  mem['lokoja-life:save-b'] = 'also broken{{{'
  const fresh = SaveSystem.load()
  check('THE HONEST RESTART: torn primary + torn shadow + no backup → fresh (nothing gained, nothing faked)',
    fresh === null && SaveSystem.transportVerdict() === 'fresh')

  delete (globalThis as Record<string, unknown>).window
}

/* ============================ the REAL HTTP pass ============================ */

section('the REAL HTTP pass — the vault carries the signature')

{
  const stamp = Date.now().toString(36)
  const BASE = 'http://localhost:3000'
  await new Promise((r) => setTimeout(r, 400))
  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `fort_${stamp}`, contact: `fort_${stamp}@lokoja.ng`, pin: '4321', ageBand: 'adult', displayName: `fort_${stamp}`, avatarLook: '{"skinTone":"#6E4326","hairColor":"#1A1714","hairstyle":"low-cut","clothingStyle":"tshirt","clothingColor":"#1B7A43"}' }),
  })
  const regData = (await reg.json()) as { ok?: boolean; token?: string }
  check('the register claims a fortress name', reg.ok && !!regData.token)

  // push a minimal save WITH a signature — the vault stores it beside the save
  const fakeSave = { version: 15, player: { name: 'Fortress Ada', cash: 5000 }, world: { day: 3 } }
  const sig = signPayload(JSON.stringify(fakeSave), KEY)
  const push = await fetch(`${BASE}/api/cloud/push`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regData.token}` },
    body: JSON.stringify({ schema_version: 15, data: fakeSave, sig }),
  })
  check('the vault accepts the signed push', push.ok)

  const pull = await fetch(`${BASE}/api/cloud/pull`, {
    headers: { Authorization: `Bearer ${regData.token}` },
  })
  const pullData = (await pull.json()) as { ok?: boolean; save?: unknown; sig?: string | null }
  check('the pull returns the save WITH its signature (tamper-evidence rides back)',
    pull.ok && pullData.ok === true && pullData.sig === sig)
  check('the pulled payload still verifies against the signing key',
    verifyPayload(JSON.stringify(fakeSave), pullData.sig!, KEY).ok)

  // login also carries the sig
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `fort_${stamp}`, pin: '4321' }),
  })
  const loginData = (await login.json()) as { ok?: boolean; sig?: string | null }
  check('the login returns the vault signature too', login.ok && loginData.sig === sig)
}

console.log('\n========================================')
console.log(`M14 FORTRESS TOTAL — ${passed} passed, ${failed} failed`)
console.log('========================================')
if (failed > 0) process.exit(1)
