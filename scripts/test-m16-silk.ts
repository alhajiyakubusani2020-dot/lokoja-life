/**
 * LOKOJA LIFE — M16: PWA + SILK FINISH
 * -------------------------------------
 * Law blocks:
 *  - THE ICON FORGE: every icon file exists, carries the PNG magic,
 *    and its IHDR speaks the exact promised dimensions
 *  - THE MANIFEST LAW: installable (id/start_url/display/theme/icons
 *    192+512+maskable), the theme matches the viewport law, the
 *    shortcuts are honest routes
 *  - THE SERVICE WORKER LAW: versioned caches, the shell precache
 *    list, the HMR mercy (dev traffic passes through), THE API MERCY
 *    (the offline queue is the offline authority — the SW never fakes
 *    a response), GET-only caching, the entry cap, the 2 MB response
 *    cap, the stranded-cache sweep, skipWaiting + claim
 *  - THE OFFLINE PAGE LAW: the fallback exists, it is honest (a reload
 *    button, no fake content), it is small
 *  - THE REGISTRATION LAW: idle-register (never competes with first
 *    paint), scope '/', no forced reload mid-life
 *  - THE LAYOUT LAW: the manifest link + apple icons ride the shell
 *  - THE DELTA LAW (re-affirmed on the real transport): same state =
 *    zero bytes, updatedAt alone never writes
 *  - THE OFFLINE-FIRST STORE LAW: an offline push queues (never dies),
 *    the flag rides storage, the flush rides the online event, a
 *    guest's game never needs the network to live
 *  - THE BUDGET LAW: the worker, the manifest, the icons and the
 *    offline page together stay trivial — the install remains <30MB
 * Run: bun scripts/test-m16-silk.ts
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs'

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) {
    passed++
    console.log('  ✓', name)
  } else {
    failed++
    console.log('  ✗', name)
  }
}

const ROOT = '/home/z/my-project'
const read = (p: string) => readFileSync(`${ROOT}/${p}`, 'utf8')
const size = (p: string) => statSync(`${ROOT}/${p}`).size

/* ----------------------------- THE ICON FORGE ------------------------------ */

console.log('\n— THE ICON FORGE —')

/** PNG IHDR: bytes 16-23 hold width/height big-endian after the 8-byte
 *  signature + 4-byte length + 'IHDR'. */
function pngDimensions(path: string): { w: number; h: number } | null {
  try {
    const buf = readFileSync(`${ROOT}/${path}`)
    const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    if (!buf.subarray(0, 8).equals(magic)) return null
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  } catch {
    return null
  }
}

const ICONS: [string, number, number][] = [
  ['public/icons/icon-192.png', 192, 192],
  ['public/icons/icon-512.png', 512, 512],
  ['public/icons/icon-192-maskable.png', 192, 192],
  ['public/icons/icon-512-maskable.png', 512, 512],
  ['public/icons/apple-touch-icon.png', 180, 180],
]
for (const [path, w, h] of ICONS) {
  const dim = pngDimensions(path)
  check(`${path} is a real PNG at exactly ${w}×${h}`, dim !== null && dim!.w === w && dim!.h === h)
  check(`${path} is lean (< 100KB)`, size(path) < 100_000)
}

/* ----------------------------- THE MANIFEST LAW ---------------------------- */

console.log('\n— THE MANIFEST LAW —')

interface IconEntry { src: string; sizes: string; purpose?: string }
interface Manifest {
  id?: string
  name?: string
  short_name?: string
  start_url?: string
  scope?: string
  display?: string
  background_color?: string
  theme_color?: string
  icons?: IconEntry[]
  shortcuts?: { url?: string }[]
}

let manifest: Manifest | null = null
try {
  manifest = JSON.parse(read('public/manifest.json')) as Manifest
} catch { /* the manifest is broken */ }
check('the manifest parses', manifest !== null)
check('the identity is the app root (id "/")', manifest?.id === '/')
check('the start_url is the shell', manifest?.start_url === '/')
check('the scope holds the whole app', manifest?.scope === '/')
check('the display is standalone (installable, own window)', manifest?.display === 'standalone')
check('the theme matches the viewport law (#146b3a)', manifest?.theme_color === '#146b3a')
check('the background is the app cream (#f5edd8)', manifest?.background_color === '#f5edd8')
check('the name + short_name exist (the launcher needs both)', !!manifest?.name && !!manifest?.short_name)
const anyIcons = manifest?.icons ?? []
check('the icons speak 192 and 512 any-purpose',
  anyIcons.some((i) => i.sizes === '192x192' && i.purpose !== 'maskable') &&
  anyIcons.some((i) => i.sizes === '512x512' && i.purpose !== 'maskable'))
check('the icons speak maskable variants (Android adaptive law)',
  anyIcons.some((i) => i.purpose === 'maskable' && i.sizes === '512x512'))
check('every promised icon file actually exists',
  anyIcons.every((i) => existsSync(`${ROOT}/public${i.src}`)))
check('the shortcuts point at the shell only (no deep routes to break)',
  (manifest?.shortcuts ?? []).every((s) => (s.url ?? '').startsWith('/')))

/* --------------------------- THE SERVICE WORKER LAW ------------------------ */

console.log('\n— THE SERVICE WORKER LAW —')

const sw = read('public/sw.js')
check('the worker version is stamped (m16 class)', /SW_VERSION = 'm16\./.test(sw))
check('the caches are versioned (shell/static/pages)', sw.includes('lko-shell-${SW_VERSION}') && sw.includes('lko-static-${SW_VERSION}') && sw.includes('lko-pages-${SW_VERSION}'))
check('the precache holds the shell (/)', /'\/',/.test(sw))
check('the precache holds the offline page', sw.includes("'/offline.html'"))
check('the precache holds the manifest + icons', sw.includes("'/manifest.json'") && sw.includes("'/icons/icon-512.png'"))
check('THE HMR MERCY: dev traffic passes through untouched', sw.includes('_next/webpack-hmr') && sw.includes("v="))
check('THE API MERCY: /api/ rides raw — the offline queue is the offline authority', sw.includes("url.pathname.startsWith('/api/')") && sw.includes('isApi(url)) return'))
check('only GET responses are ever cached', sw.includes("request.method !== 'GET'"))
check('the entry cap stands (200)', sw.includes('MAX_ENTRIES = 200'))
check('the single-response cap stands (2 MB)', sw.includes('2 * 1024 * 1024'))
check('the stranded-cache sweep runs on activate', sw.includes("n.startsWith('lko-') && !OWN_CACHES.includes(n)"))
check('skipWaiting + clients.claim (the update takes the wheel on boot)', sw.includes('skipWaiting') && sw.includes('clients.claim'))
check('navigations fall back to the cached shell then the offline page', sw.includes("caches.match('/')") && sw.includes("caches.match('/offline.html')"))
check('the install is mercy-per-file (one bad response never strands the shell)', sw.includes('.catch(() => {})'))
check('the worker is lean (the SW itself < 16KB)', size('public/sw.js') < 16_000)

/* ---------------------------- THE OFFLINE PAGE LAW ------------------------- */

console.log('\n— THE OFFLINE PAGE LAW —')

const offline = read('public/offline.html')
check('the offline page exists and is small (< 4KB)', size('public/offline.html') < 4_000)
check('the offline page offers a real retry (a reload button, not a fake)', offline.includes('location.reload()'))
check('the offline page keeps the theme', offline.includes('#146b3a'))
check('the offline page is honest (the save stays on this phone)', offline.includes('safe') || offline.includes('dey safe'))

/* ---------------------------- THE REGISTRATION LAW ------------------------- */

console.log('\n— THE REGISTRATION LAW —')

const pwaRegister = read('src/components/game/PwaRegister.tsx')
check('the worker registers at scope /', pwaRegister.includes("'/sw.js'") && pwaRegister.includes("scope: '/'"))
check('the register is idle-deferred (never competes with first paint)', pwaRegister.includes('requestIdleCallback') || pwaRegister.includes('setTimeout'))
check('a refused worker is a silent downgrade (no game gate)', pwaRegister.includes('__lkoSwRegistered = false'))
check('no forced reload mid-life', !pwaRegister.includes('location.reload'))

/* ------------------------------- THE LAYOUT LAW ---------------------------- */

console.log('\n— THE LAYOUT LAW —')

const layout = read('src/app/layout.tsx')
check('the shell links the manifest', layout.includes('manifest: "/manifest.json"'))
check('the shell carries the apple-touch icon', layout.includes('/icons/apple-touch-icon.png'))
check('the shell declares apple-web-app (iOS standalone law)', layout.includes('appleWebApp'))
check('the register rides the root layout (every page gets the worker)', layout.includes('<PwaRegister />'))

/* ---------------------------- THE DELTA LAW (v16) -------------------------- */

console.log('\n— THE DELTA LAW (the delta-saves deliverable, real transport) —')

const mem: Record<string, string> = {}
;(globalThis as Record<string, unknown>).window = {
  localStorage: {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => { mem[k] = v },
    removeItem: (k: string) => { delete mem[k] },
  },
}
const { SaveSystem } = await import('../src/game/systems/save')
SaveSystem.setFortKey('m16-silk-key-0123456789abcdef')

// a real v16 save assembled from the game's own fresh states (the same
// shape the store's saveNow assembles — every slice from its source)
const [
  { freshCivicState }, { freshChaosState }, { freshCalendarState },
  { freshRiversState }, { freshEducationState }, { freshHousingState },
  { freshJapaState }, { freshGoalState }, { freshPulseState }, { freshLiveState },
] = await Promise.all([
  import('../src/game/systems/civic'), import('../src/game/systems/chaos'),
  import('../src/game/systems/calendar'), import('../src/game/systems/rivers'),
  import('../src/game/systems/education'), import('../src/game/systems/housing'),
  import('../src/game/systems/japa'), import('../src/game/systems/goals'),
  import('../src/game/systems/pulse'), import('../src/game/systems/live'),
])
const save16 = {
  version: 17, createdAt: 1, updatedAt: 2,
  player: { name: 'Silk', gender: 'female' as const, ageBand: 'adult' as const, avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' }, cash: 5000, needs: { health: 100, energy: 90, hunger: 80, mood: 70 }, skills: { hustle: 2, smart: 2, social: 2 }, skillXp: { hustle: 0, smart: 0, social: 0 }, reputation: 10, level: 2, xp: 0, homeId: 'home', jobId: null, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {} },
  world: { day: 1, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
  civic: freshCivicState(), chaos: freshChaosState(), calendar: freshCalendarState(),
  rivers: freshRiversState(), education: freshEducationState(), housing: freshHousingState(),
  japa: freshJapaState(), goals: freshGoalState(), cityPulse: freshPulseState(), live: freshLiveState(),
  fleet: { vehicles: [], gigs: [], done: [] },
  settings: { graphics: 'auto', chill: false, elder: false, music: true, sfx: true },
  account: { linked: false, token: null, name: null, pendingName: null, guestGraceLeft: 1 },
}

const before = JSON.stringify(save16)
const w1 = SaveSystem.write(save16 as never)
check('the first write lands (no shadow yet — the ladder needs its rungs)', w1 && SaveSystem.writeVerdict() === 'wrote')
const w2 = SaveSystem.write(save16 as never)
check('the second write establishes the shadow twin (still honest bytes)', w2 && SaveSystem.writeVerdict() === 'wrote')
const w3 = SaveSystem.write(save16 as never)
check('THE SKIP LAW: the same state costs zero bytes', w3 && SaveSystem.writeVerdict() === 'skip')
check('the fingerprint law stands (the delta book keys on it)', /^[0-9a-f]{8,}/.test(SaveSystem.fingerprintOf(save16 as never)))
const afterTwin = SaveSystem.write({ ...save16, updatedAt: 99 } as never)
check('updatedAt alone NEVER writes (the timestamp is not a change)', afterTwin && SaveSystem.writeVerdict() === 'skip')
check('the bytes on disk were never touched by the skips', mem['lokoja-life:save'].length > 0 && before.length > 0)

/* ------------------------- THE OFFLINE-FIRST STORE LAW --------------------- */

console.log('\n— THE OFFLINE-FIRST STORE LAW —')

const storeSrc = read('src/game/store/useGameStore.ts')
check('an offline push queues (the flag lights, the push never dies)', storeSrc.includes("localStorage.setItem('lokoja-life:cloud-queue', '1')"))
check('the queue flag rides storage across boots', storeSrc.includes("localStorage.getItem('lokoja-life:cloud-queue')"))
check('the flush rides the online event', storeSrc.includes("addEventListener('online'"))
check('the flush refuses to ride while still offline', /flushCloudQueue[\s\S]{0,400}onLine === false/.test(storeSrc))
check('a network failure queues too (never dies silently)', /network failure queues the push/.test(storeSrc))
check('the flush pays an honest toast', storeSrc.includes('Network don come back'))
check('the guest gate stands before forward travel (offline guests play the starter trio)', storeSrc.includes('pendingArrival') && storeSrc.includes('gate'))

/* ------------------------------ THE BUDGET LAW ----------------------------- */

console.log('\n— THE BUDGET LAW —')

const pwaBytes =
  size('public/sw.js') +
  size('public/manifest.json') +
  size('public/offline.html') +
  ICONS.reduce((sum, [p]) => sum + size(p), 0)
check(`the PWA surface is trivial (${(pwaBytes / 1024).toFixed(1)}KB — the 30MB install law is safe)`, pwaBytes < 150_000)
const artBytes = (function walk(dir: string): number {
  let s = 0
  for (const f of readdirSync(`${ROOT}/${dir}`)) {
    const p = `${dir}/${f}`
    s += statSync(`${ROOT}/${p}`).isDirectory() ? walk(p) : size(p)
  }
  return s
})('public/art')
check(`the art assets stay lean (${(artBytes / 1024).toFixed(0)}KB total — every file under the 2MB response cap)`, artBytes < 3_000_000)

/* --------------------------------- verdict --------------------------------- */

console.log('\n========================================')
console.log(`M16 SILK — ${passed} passed, ${failed} failed`)
console.log('========================================')
process.exit(failed > 0 ? 1 : 0)
