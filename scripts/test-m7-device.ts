/**
 * LOKOJA LIFE — M7: RUN ON ANY DEVICE (pure rule checks + a real store pass)
 * ---------------------------------------------------------------------------
 * The device law, tested without a browser — every signal is injected:
 *
 *   TIER LAW    flagship→high · 4GB phone→mid · 2-core laptop→low ·
 *               SwiftShader→low · iPhone (specs hidden)→mid · no WebGL→low
 *   QUALITY LAW the player's pick always wins; auto trusts the tier;
 *               preset ladder is strictly ordered (cap/far/AA/shadows)
 *   DYNRES LAW  sustained stress drops the cap a step, headroom climbs it
 *               back, floors/ceilings hold, a single hot frame NEVER moves
 *               it, and the whole dance is deterministic
 *   GL PROBE    injectable factories: unsupported / webgl-only / gpu-name
 *               read / throwing factory — every path honest
 *   SAVE v8     a v7 save wakes up on graphics 'auto', an explicit pick
 *               survives the ladder, junk values fall back to 'auto'
 *   STORE PASS  setGraphics round-trips through the LIVE bun store and
 *               persists into the save
 * Run: bun scripts/test-m7-device.ts
 */

import {
  detectTier,
  resolveQuality,
  nextDynRes,
  probeWebGL,
  buildProfile,
  deviceLine,
  QUALITY_PRESETS,
  DYNRES,
  type DeviceSignals,
  type DynResState,
} from '../src/game/systems/device'

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

const sig = (over: Partial<DeviceSignals> = {}): DeviceSignals => ({
  cores: 8,
  memoryGB: 8,
  gpu: 'ANGLE (NVIDIA)',
  coarsePointer: false,
  mobileUA: false,
  webgl1: true,
  webgl2: true,
  ...over,
})

/* ---------------------------------- TIER LAW --------------------------------- */

console.log('\nTIER LAW — one verdict per device class, with reasons')
{
  const t = (s: DeviceSignals) => detectTier(s)

  check('flagship desktop 8GB/8c → high', t(sig()).tier === 'high')
  check('desktop 8GB/4c (weak desktop) → high via desktop ladder', t(sig({ cores: 4 })).tier === 'high')
  check('mid Android 4GB/8c touch → mid (memory cap)', t(sig({ memoryGB: 4, coarsePointer: true, mobileUA: true })).tier === 'mid')
  check('old laptop 2 cores → low', t(sig({ cores: 2 })).tier === 'low')
  check('2GB device → low even with 8 cores', t(sig({ memoryGB: 2, cores: 8 })).tier === 'low')
  check('iPhone (hides specs, touch) → mid (safe middle)', t(sig({ cores: 0, memoryGB: 0, coarsePointer: true, mobileUA: true, gpu: 'Apple GPU' })).tier === 'mid')
  check('unknown desktop (0/0) → mid (safe middle)', t(sig({ cores: 0, memoryGB: 0, gpu: '' })).tier === 'mid')
  check('SwiftShader (headless/software GL) → low', t(sig({ gpu: 'SwiftShader' })).tier === 'low')
  check('llvmpipe → low', t(sig({ gpu: 'llvmpipe (LLVM 15)' })).tier === 'low')
  check('no WebGL at all → low', t(sig({ webgl1: false, webgl2: false })).tier === 'low')
  check('every verdict carries at least one reason', [...[sig(), sig({ gpu: 'SwiftShader' }), sig({ webgl1: false }), sig({ cores: 0, memoryGB: 0, coarsePointer: true })]].every((s) => t(s).reasons.length >= 1))
  check('determinism: same signals, same verdict', JSON.stringify(t(sig())) === JSON.stringify(t(sig())))
}

/* -------------------------------- QUALITY LAW -------------------------------- */

console.log('\nQUALITY LAW — the player is the boss; presets stay ordered')
{
  check('auto on a mid device → mid', resolveQuality('auto', 'mid') === 'mid')
  check('explicit low beats a high verdict', resolveQuality('low', 'high') === 'low')
  check('explicit high beats a low verdict', resolveQuality('high', 'low') === 'high')
  check('explicit mid beats auto-detection', resolveQuality('mid', 'high') === 'mid')

  const ladder = ['low', 'mid', 'high'] as const
  check('dpr caps strictly ordered', QUALITY_PRESETS.low.dprCap < QUALITY_PRESETS.mid.dprCap && QUALITY_PRESETS.mid.dprCap < QUALITY_PRESETS.high.dprCap)
  check('far planes never shrink up the ladder', QUALITY_PRESETS.low.far <= QUALITY_PRESETS.mid.far && QUALITY_PRESETS.mid.far <= QUALITY_PRESETS.high.far)
  check('only high tier carries shadows', QUALITY_PRESETS.high.shadows && !QUALITY_PRESETS.mid.shadows && !QUALITY_PRESETS.low.shadows)
  check('only low tier paces frames (30Hz demand)', QUALITY_PRESETS.low.frameHz === 30 && QUALITY_PRESETS.mid.frameHz === 0 && QUALITY_PRESETS.high.frameHz === 0)
  check('only low tier leans the fog in', QUALITY_PRESETS.low.fogPush > 0 && QUALITY_PRESETS.mid.fogPush === 0 && QUALITY_PRESETS.high.fogPush === 0)
  check('AA off exactly where the weakest devices are', !QUALITY_PRESETS.low.antialias && QUALITY_PRESETS.mid.antialias && QUALITY_PRESETS.high.antialias)
  check('every tier has a dpr floor below its cap', ladder.every((k) => QUALITY_PRESETS[k].dprFloor < QUALITY_PRESETS[k].dprCap))
  check('buildProfile threads the pick through (explicit High overrides even SwiftShader)', buildProfile(sig({ gpu: 'SwiftShader' }), 'high').effective === 'high' && buildProfile(sig({ gpu: 'SwiftShader' }), 'high').preset.shadows === true)
  check('deviceLine mentions the tier + pick', deviceLine(buildProfile(sig(), 'auto')).includes('HIGH') && deviceLine(buildProfile(sig(), 'auto')).includes('auto'))
}

/* --------------------------------- DYNRES LAW --------------------------------- */

console.log('\nDYNRES LAW — hysteresis fights lag without flapping')
{
  const b = { floor: 0.65, initialCap: 1.75 }
  const fresh: DynResState = { cap: 1.75, dir: 'steady', sinceMs: 0, changes: 0 }
  // walk one window of the given p95 (the law advances its own clock by sampleMs)
  const win = (s: DynResState, p95: number) => nextDynRes(s, { p95ms: p95, nowMs: 0 }, b)
  // walk until the law acts (bounded — hysteresis must act within a handful of windows)
  const until = (s: DynResState, p95: number, want: 'drop' | 'raise', max = 8) => {
    let cur = s
    let r = win(cur, p95)
    for (let i = 0; i < max; i++) {
      r = win(cur, p95)
      cur = r.state
      if (r.action === want) return r
    }
    return r
  }

  // one hot sample NEVER acts — dwell first
  const hot1 = win(fresh, 55)
  check('a single hot frame holds the cap', hot1.action === 'hold' && hot1.state.cap === 1.75)
  check('hot drift is remembered', hot1.state.dir === 'hot' && hot1.state.sinceMs === 0)

  // sustained stress → drop, exactly one step
  const dropped = until(fresh, 55, 'drop')
  check('sustained stress drops exactly one step (−0.15)', dropped.action === 'drop' && Math.abs(dropped.state.cap - 1.6) < 1e-9)
  check('the drop resets the drift and is counted', dropped.state.dir === 'steady' && dropped.state.sinceMs === 0 && dropped.state.changes === 1)

  // floor holds forever
  let s = dropped.state
  let last = win(s, 80)
  for (let i = 0; i < 20; i++) last = win(last.state, 80)
  check('20 more hot windows never punch through the floor', last.state.cap === b.floor)

  // cool climb needs the patient dwell
  const cool1 = win(last.state, 12)
  check('first cool window holds (recovery is patient)', cool1.action === 'hold' && cool1.state.dir === 'cool')
  const raised = until(last.state, 12, 'raise')
  check('after the cool dwell the cap climbs one half-step (+0.1)', raised.action === 'raise' && Math.abs(raised.state.cap - (b.floor + DYNRES.stepUp)) < 1e-9)

  // never above the initial cap (10 raises × 5 cool windows each, then it holds)
  let up = raised.state
  let overshot = false
  let fin = win(up, 10)
  for (let i = 0; i < 60; i++) {
    fin = win(fin.state, 10)
    if (fin.state.cap > b.initialCap) overshot = true
  }
  check('the climb never passes the tier cap', fin.state.cap === b.initialCap && !overshot)

  // the steady band between 22-40ms resets everything
  const mid = win({ ...fresh, dir: 'hot', sinceMs: 3000 }, 30)
  check('the 22-40ms band resets hot drift', mid.state.dir === 'steady' && mid.state.sinceMs === 0 && mid.action === 'hold')

  // determinism
  const a1 = nextDynRes(fresh, { p95ms: 60, nowMs: 0 }, b)
  const a2 = nextDynRes(fresh, { p95ms: 60, nowMs: 0 }, b)
  check('dyn-res is deterministic', JSON.stringify(a1) === JSON.stringify(a2))
}

/* ---------------------------------- GL PROBE ---------------------------------- */

console.log('\nGL PROBE — every device gets an honest answer')
{
  const mk = (opts: { gpu?: string; throw?: boolean } = {}) => () => {
    if (opts.throw) throw new Error('context refused')
    return {
      getParameter: (p: number) => (p === 0x9246 ? (opts.gpu ?? '') : ''),
      getExtension: (n: string) => (n === 'WEBGL_debug_renderer_info' ? { UNMASKED_RENDERER_WEBGL: 0x9246 } : { loseContext() {} }),
    } as never
  }

  const none = probeWebGL(() => null)
  check('no context at all → webgl1/webgl2 both false', !none.webgl1 && !none.webgl2 && none.gpu === '')

  const gl1 = probeWebGL((t) => (t === 'webgl' ? mk()() : null))
  check('webgl-only device → webgl1 true, webgl2 false', gl1.webgl1 && !gl1.webgl2)

  const gl2 = probeWebGL((t) => (t === 'webgl2' ? mk({ gpu: 'Adreno (TM) 730' })() : null))
  check('webgl2 device reports its GPU name', gl2.webgl2 && !gl1.webgl2 && gl2.gpu === 'Adreno (TM) 730')

  const threw = probeWebGL(mk({ throw: true }))
  check('a throwing factory degrades to unsupported, never crashes', !threw.webgl1 && !threw.webgl2)

  const both = probeWebGL(() => mk({ gpu: 'Mali-G78' })())
  check('a device with both APIs answers both', both.webgl1 && both.webgl2)
}

/* ------------------------------ SAVE v8 MIGRATION ------------------------------ */

console.log('\nSAVE v8 — the graphics pick joins the schema')
{
  const mem = new Map<string, string>()
  ;(globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      setItem: (k: string, v: string) => void mem.set(k, String(v)),
      getItem: (k: string) => (mem.has(k) ? (mem.get(k) as string) : null),
      removeItem: (k: string) => void mem.delete(k),
    },
  }
  const { SaveSystem } = await import('../src/game/systems/save')

  const baseWorld = { day: 6, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' }
  const basePlayer = {
    name: 'Ada', gender: 'female' as const,
    avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' },
    cash: 4200, needs: { health: 90, energy: 80, hunger: 70, mood: 60 },
    skills: { hustle: 1, smart: 1, social: 1 }, skillXp: { hustle: 0, smart: 0, social: 0 },
    reputation: 10, level: 2, xp: 30, homeId: 'basic-room', jobId: null,
    activeOpportunities: [], cooldowns: {}, transactions: [],
    stats: { jobsCompleted: 1, hustlesCompleted: 2, totalEarned: 3000, totalSpent: 500 },
    inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [],
  }

  // v7 (pre-M7) → v8: graphics arrives, defaulted to 'auto'
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify({
    version: 7, createdAt: 1, updatedAt: 2,
    player: basePlayer, world: baseWorld, settings: { sound: true },
  }))
  const v8 = SaveSystem.load()
  check('v7 save loads and reaches v14 (M8+…+M13 join)', v8?.version === 14)
  check('v7 player wakes up on Auto', v8?.settings.graphics === 'auto')
  check('v7 sound setting survived the ladder', v8?.settings.sound === true)

  // junk graphics values fall back to auto
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify({
    version: 8, createdAt: 1, updatedAt: 2,
    player: basePlayer, world: baseWorld, settings: { sound: true, graphics: 'ULTRA' as never },
  }))
  const junk = SaveSystem.load()
  check('junk graphics value falls back to auto', junk?.settings.graphics === 'auto')

  // explicit pick survives
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify({
    version: 8, createdAt: 1, updatedAt: 2,
    player: basePlayer, world: baseWorld, settings: { sound: false, graphics: 'low' },
  }))
  const picked = SaveSystem.load()
  check('an explicit Low pick survives the round-trip', picked?.settings.graphics === 'low' && picked?.settings.sound === false)
}

/* -------------------------------- REAL STORE PASS ------------------------------ */

console.log('\nREAL STORE — setGraphics through the live bun store')
{
  const mem = new Map<string, string>()
  ;(globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      setItem: (k: string, v: string) => void mem.set(k, String(v)),
      getItem: (k: string) => (mem.has(k) ? (mem.get(k) as string) : null),
      removeItem: (k: string) => void mem.delete(k),
    },
  }
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const state = () => useGameStore.getState()

  state().boot()
  state().startNewGame('tester', 'male', { ...DEFAULT_AVATAR })
  check('a new game boots on Auto', state().settings.graphics === 'auto')

  state().setGraphics('low')
  check('setGraphics(low) lands in the live store', state().settings.graphics === 'low')
  await sleep(50) // autosave debounce (1.2s) — force it instead:
  state().saveNow()
  const saved = JSON.parse(mem.get('lokoja-life:save') ?? '{}') as { settings?: { graphics?: string } }
  check('the pick persists into the save', saved.settings?.graphics === 'low')

  state().setGraphics('high')
  state().saveNow()
  const saved2 = JSON.parse(mem.get('lokoja-life:save') ?? '{}') as { settings?: { graphics?: string } }
  check('re-picking High updates the persisted save', saved2.settings?.graphics === 'high')
  check('sound untouched by the graphics pick', state().settings.sound === true)

  // THE MENU LAW: a pick made before any game runs (autosave dormant) still reaches disk
  useGameStore.setState({ player: null, world: null, civic: null }) // back to the menu, honestly
  mem.set('lokoja-life:save', JSON.stringify({ version: 8, createdAt: 1, updatedAt: 2, player: {}, world: { day: 1 }, settings: { sound: true, graphics: 'auto' } }))
  state().setGraphics('mid')
  const menuSaved = JSON.parse(mem.get('lokoja-life:save') ?? '{}') as { settings?: { graphics?: string } }
  check('a menu-stage pick persists without a live game', menuSaved.settings?.graphics === 'mid')
  check('the menu pick landed in the store too', state().settings.graphics === 'mid')
  state().toggleSound()
  const menuSound = JSON.parse(mem.get('lokoja-life:save') ?? '{}') as { settings?: { sound?: boolean } }
  check('menu sound toggle persists the same way', menuSound.settings?.sound === false)
}

/* ---------------------------------- verdict ---------------------------------- */

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
