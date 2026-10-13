/**
 * Task 13-a (perf-auditor) — FPS / LAG / MEMORY harness, Playwright (headless chromium, SwiftShader).
 *
 * MEASURE ONLY — writes a JSON fragment to research/frag-<scenario>.json. Touches nothing under src/ or public/.
 *
 * Scenarios (run as separate SHORT browser launches to respect the headless 3D self-destruct,
 * which was observed at only ~35-40s of continuous 3D during this audit — leaner than documented):
 *   desktop-idle : 1280×800 — enter 3D, 8s warmup, 15s rAF sample IDLE + localStorage save census + CDP net capture
 *   desktop-walk : 1280×800 — enter 3D, 8s warmup, 15s rAF sample WALKING (__lkl.stick(0,-1) held)
 *   desktop-zoom : 1280×800 — enter 3D, 8s warmup, 5× canvas WheelEvent(deltaY=120) zoom-OUT, 15s rAF sample
 *   mobile-idle  : 390×844  — enter 3D, 8s warmup, 15s rAF sample IDLE
 *
 * Hard watchdog kills the launch at 78s (< the ~80s budget). Headless caveat: software WebGL (SwiftShader) —
 * absolute FPS is lower than real devices; we care about the baseline and relative walk/zoom cost.
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, appendFileSync } from 'fs'

const BASE = 'http://localhost:3000'
const RESEARCH = '/home/z/my-project/research'
mkdirSync(RESEARCH, { recursive: true })

const scenario = process.argv[2] ?? 'desktop-main'
const CFG: Record<string, { width: number; height: number; steps: string[] }> = {
  'desktop-idle': { width: 1280, height: 800, steps: ['idle'] },
  'desktop-walk': { width: 1280, height: 800, steps: ['walk'] },
  'desktop-zoom': { width: 1280, height: 800, steps: ['zoom'] },
  'mobile-idle': { width: 390, height: 844, steps: ['idle'] },
}
const cfg = CFG[scenario]
if (!cfg) {
  console.error('unknown scenario:', scenario)
  process.exit(1)
}

const T0 = Date.now()
const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 78s budget hit, aborting launch')
  process.exit(3)
}, 78000)

const errors: string[] = []

const step = (label: string) => {
  // synchronous file log — survives process.exit buffering (bun pipes)
  try {
    appendFileSync('/tmp/perf-progress.log', `${scenario} +${((Date.now() - T0) / 1000).toFixed(1)}s ${label}\n`)
  } catch {}
  console.log(`[+${((Date.now() - T0) / 1000).toFixed(1)}s] ${label}`)
}

const enterWorld = async (page: any) => {
  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  step('goto done')
  await page.waitForTimeout(1600)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 8000 })
  await page.waitForTimeout(300)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 })
  await page.waitForTimeout(300)
  await page.getByText('Explore in 3D').first().click({ timeout: 8000 })
  step('3D entered')
  // fire-and-forget intro-card dismissal: NOT awaited — SwiftShader world boot can stall the main
  // thread ~20-25s and queue every protocol call; we must not burn our short 3D budget waiting on it
  try {
    page
      .getByText('Skip', { exact: true })
      .first()
      .click({ force: true, timeout: 2500 })
      .then(() => step('intro skip fired'))
      .catch(() => {})
  } catch {}
}

const inPage = () => {
  // installed INSIDE page.evaluate — samples requestAnimationFrame for `ms`
  return (ms: number) =>
    new Promise<any>((resolve) => {
      const w = window as any
      const gaps: number[] = []
      let count = 0
      let last = performance.now()
      const t0 = last
      const mem = () => (performance as any).memory?.usedJSHeapSize ?? null
      const memStart = mem()
      const tick = (now: number) => {
        gaps.push(now - last)
        last = now
        count++
        if (now - t0 >= ms) {
          const sorted = [...gaps].sort((a: number, b: number) => a - b)
          const q = (p: number) => +(sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0).toFixed(1)
          resolve({
            frames: count,
            elapsedMs: Math.round(now - t0),
            avgFps: +((count / ((now - t0) / 1000)) || 0).toFixed(2),
            p50Gap: q(0.5),
            p95Gap: q(0.95),
            p99Gap: q(0.99),
            maxGap: +Math.max(...gaps).toFixed(1),
            jank50: gaps.filter((g: number) => g > 50).length,
            jank100: gaps.filter((g: number) => g > 100).length,
            memStartMB: memStart != null ? +(memStart / 1048576).toFixed(1) : null,
            memEndMB: mem() != null ? +(mem()! / 1048576).toFixed(1) : null,
          })
          return
        }
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
}

async function main() {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--enable-precise-memory-info'] })
  let localStorageDump: Array<{ key: string; bytes: number }> | null = null
  let net: Array<{ url: string; type: string; wire: number }> = []
  let netFailed = 0
  let hooks: any = null
  const samples: Record<string, any> = {}
  try {
    const context = await browser.newContext({ viewport: { width: cfg.width, height: cfg.height } })
    const page = await context.newPage()
    page.on('pageerror', (e: Error) => errors.push('pageerror: ' + String(e).slice(0, 200)))
    page.on('console', (m: any) => {
      if (m.type() === 'error') errors.push('console: ' + String(m.text()).slice(0, 200))
    })

    // --- CDP network census (wire bytes actually transferred during this launch) ---
    const cdp = await context.newCDPSession(page)
    const netMeta = new Map<string, { url: string; type: string }>()
    cdp.on('Network.responseReceived', (e: any) => netMeta.set(e.requestId, { url: e.response.url, type: e.type }))
    cdp.on('Network.loadingFinished', (e: any) => {
      const meta = netMeta.get(e.requestId)
      if (!meta || meta.url.startsWith('data:')) return
      net.push({ url: meta.url, type: meta.type, wire: e.encodedDataLength })
    })
    cdp.on('Network.loadingFailed', () => netFailed++)
    await cdp.send('Network.enable')

    await enterWorld(page)
    await page.waitForTimeout(3000) // settle (Node-side timer — world boot runs in parallel)
    step('settle done')

    await page.waitForTimeout(8000) // warmup
    step('warmup done; sampling')
    // rAF sampler with a hard 25s escape so a stalled headless loop can never wedge the launch
    const sampleSafe = async (ms: number) => {
      const v = await Promise.race([
        page.evaluate(inPage(), ms),
        new Promise((r) => setTimeout(() => r({ stalled: true, frames: 0, elapsedMs: ms, avgFps: 0, p50Gap: 0, p95Gap: 0, p99Gap: 0, maxGap: 0, jank50: 0, jank100: 0, memStartMB: null, memEndMB: null }), ms + 10000)),
      ])
      return v
    }

    // ---------- IDLE sample (desktop-idle & mobile-idle) ----------
    if (cfg.steps.includes('idle')) {
      let posA: any = null
      try {
        posA = await Promise.race([page.evaluate(() => (window as any).__lkl.pos()), new Promise((r) => setTimeout(() => r(null), 8000))])
      } catch {}
      samples.idle = await sampleSafe(15000)
      step('idle sample done: ' + JSON.stringify(samples.idle.avgFps))
      let posB: any = null
      try {
        posB = await Promise.race([page.evaluate(() => (window as any).__lkl.pos()), new Promise((r) => setTimeout(() => r(null), 8000))])
      } catch {}
      samples.idle.posStart = posA
      samples.idle.posEnd = posB
      samples.idle.stationary = posA && posB && Math.abs(posA.x - posB.x) < 0.05 && Math.abs(posA.z - posB.z) < 0.05
    }

    // ---------- WALK sample (desktop-walk) ----------
    if (cfg.steps.includes('walk')) {
      let posA: any = null
      try {
        posA = await Promise.race([page.evaluate(() => (window as any).__lkl.pos()), new Promise((r) => setTimeout(() => r(null), 8000))])
      } catch {}
      try {
        await Promise.race([page.evaluate(() => (window as any).__lkl.stick(0, -1)), new Promise((r) => setTimeout(() => r(null), 8000))]) // joystick vector persists (setJoystick)
      } catch {}
      const refresher = setInterval(() => {
        page.evaluate(() => (window as any).__lkl.stick(0, -1)).catch(() => {})
      }, 2000)
      samples.walk = await sampleSafe(15000)
      clearInterval(refresher)
      step('walk sample done: ' + JSON.stringify(samples.walk.avgFps))
      try {
        await Promise.race([page.evaluate(() => (window as any).__lkl.stick(0, 0)), new Promise((r) => setTimeout(() => r(null), 6000))])
      } catch {}
      let posB: any = null
      try {
        posB = await Promise.race([page.evaluate(() => (window as any).__lkl.pos()), new Promise((r) => setTimeout(() => r(null), 6000))])
      } catch {}
      samples.walk.posStart = posA
      samples.walk.posEnd = posB
      samples.walk.moved = posA && posB ? +Math.hypot(posB.x - posA.x, posB.z - posA.z).toFixed(2) : null
    }

    // ---------- ZOOM sample (desktop-zoom): 5× wheel-out then stationary sample ----------
    if (cfg.steps.includes('zoom')) {
      try {
        await Promise.race([
          page.evaluate(() => {
            const c = document.querySelector('canvas')
            for (let i = 0; i < 5; i++) {
              setTimeout(() => c && c.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })), i * 350)
            }
          }),
          new Promise((r) => setTimeout(() => r(null), 8000)),
        ])
      } catch {}
      await page.waitForTimeout(2400)
      let posA: any = null
      try {
        posA = await Promise.race([page.evaluate(() => (window as any).__lkl.pos()), new Promise((r) => setTimeout(() => r(null), 6000))])
      } catch {}
      samples.zoom = await sampleSafe(15000)
      step('zoom sample done: ' + JSON.stringify(samples.zoom.avgFps))
      let posB: any = null
      try {
        posB = await Promise.race([page.evaluate(() => (window as any).__lkl.pos()), new Promise((r) => setTimeout(() => r(null), 6000))])
      } catch {}
      samples.zoom.posStart = posA
      samples.zoom.posEnd = posB
      samples.zoom.stationary = posA && posB && Math.abs(posA.x - posB.x) < 0.05 && Math.abs(posA.z - posB.z) < 0.05
    }

    // ---------- localStorage save census (desktop-idle only, post-sample) ----------
    if (scenario === 'desktop-idle') {
      await page.waitForTimeout(1800) // let the 1.2s-debounced autosave settle
      localStorageDump = await Promise.race([
        page.evaluate(() => {
          const enc = (s: string) => new TextEncoder().encode(s).length
          const out: Array<{ key: string; bytes: number }> = []
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i) as string
            out.push({ key: k, bytes: enc(k) + enc(localStorage.getItem(k) ?? '') })
          }
          return out
        }),
        new Promise<null>((r) => setTimeout(() => r(null), 8000)),
      ])
      step('localStorage census done: ' + (localStorageDump ? localStorageDump.reduce((a, k) => a + k.bytes, 0) : 'null'))
    }

    // ---------- hooks evidence (last — never allowed to starve the samples) ----------
    try {
      hooks = await Promise.race([
        page.evaluate(() => {
          const l = (window as any).__lkl
          if (!l) return { present: false }
          let pos: any = null
          try {
            pos = l.pos()
          } catch {}
          let tod: string | null = null
          try {
            tod = l.timeOfDay()
          } catch {}
          return { present: true, pos, tod }
        }),
        new Promise((r) => setTimeout(() => r(null), 6000)),
      ])
    } catch {}

    await browser.close().catch(() => {})
  } catch (e) {
    errors.push('harness: ' + String(e).slice(0, 300))
    console.error('harness error:', String(e).slice(0, 300))
    try {
      if (browser && browser.isConnected?.() === false) step('browser died during run')
    } catch {}
    await browser.close().catch(() => {})
  }
  clearTimeout(watchdog)

  const byType: Record<string, number> = {}
  for (const n of net) byType[n.type] = (byType[n.type] ?? 0) + n.wire
  const netTotal = net.reduce((a, n) => a + n.wire, 0)

  const frag = {
    scenario,
    viewport: { width: cfg.width, height: cfg.height },
    ts: new Date().toISOString(),
    wallMs: Date.now() - T0,
    hooks,
    samples,
    localStorage: localStorageDump
      ? {
          keys: localStorageDump,
          totalBytes: localStorageDump.reduce((a, k) => a + k.bytes, 0),
        }
      : null,
    network: {
      totalWireBytes: netTotal,
      failed: netFailed,
      count: net.length,
      byType,
      items: net.sort((a, b) => b.wire - a.wire),
    },
    consoleErrors: errors,
  }
  writeFileSync(`${RESEARCH}/frag-${scenario}.json`, JSON.stringify(frag, null, 2))
  const brief = Object.fromEntries(
    Object.entries(samples).map(([k, v]) => [k, { fps: v.avgFps, p95: v.p95Gap, jank: v.jank50, frames: v.frames }]),
  )
  console.log(scenario, 'brief:', JSON.stringify(brief), 'netTotal:', netTotal, 'lsBytes:', frag.localStorage?.totalBytes ?? '-', 'errors:', errors.length)
  console.log('WROTE', `${RESEARCH}/frag-${scenario}.json`)
}

main().catch((e) => {
  clearTimeout(watchdog)
  console.error('fatal:', String(e).slice(0, 300))
  process.exit(1)
})
