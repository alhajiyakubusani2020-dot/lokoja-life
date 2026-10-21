/**
 * PHASE-2.5 TEAM ALPHA — PRODUCTION PERFORMANCE TRUTH harness.
 * ------------------------------------------------------------
 * Runs ONE Playwright-chromium-headless launch against the PRODUCTION
 * standalone server (BASE, default http://localhost:3200) for ONE tier
 * and ONE run index, and appends a full raw record to
 * scripts/perf/phase25/results/<tier>.json (array of runs).
 *
 *   bun scripts/perf/phase25/harness.ts <high|mid|low> <1|2>
 *
 * MEASUREMENT LAW — zero estimated numbers:
 *  - boot ms  : init-script marker armed before app code runs; fires the
 *               moment WorldScene's e2e hooks (__lklTier + __lklGlCanvas,
 *               set in R3F onCreated) exist → performance.now() since
 *               navigation start, 40ms poll. Labeled `worldSceneReadyMs`.
 *  - fps      : 30s in-window rAF census (every frame gap recorded, sorted
 *               in-page) → instantaneous-fps p50 / p05 + frame-time p95 /
 *               worst. PLUS the game's own perfProbe via the ?e2e=1 hook
 *               __lkl.fpsReport(3000) (Float32Array ring, sampleFor()) —
 *               the probe truth string is kept verbatim.
 *  - draws    : window.__lklRenderer.info.render.{calls,triangles} —
 *               exposed in production ONLY by the ?e2e=1 gate
 *               (WorldScene.tsx Phase-2.5 hook). If absent we record WHY.
 *  - heap     : performance.memory.usedJSHeapSize (precise-memory-info
 *               flag); CDP Performance.getMetrics fallback.
 *  - errors   : pageerror + console.type==='error' census for the launch.
 *
 * Tier emulation (Playwright + CDP — declared, not guessed):
 *   high → desktop 1440×900, no touch, CPU throttle ×1
 *   mid  → mobile 390×844 touch, CPU throttle ×4
 *   low  → mobile 360×800 touch, CPU throttle ×2
 * __lklForceQuality is armed pre-navigation so device.ts's session-read
 * picks the forced tier (the same override the M7 device matrix used).
 *
 * CAVEAT kept verbatim in every record: headless chromium renders via
 * SwiftShader (software GL) — absolute FPS is NOT a phone number; the
 * reproducible truth this harness produces is the tier-relative delta.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = '/home/z/my-project'
const RESULTS = join(ROOT, 'scripts/perf/phase25/results')
const BASE = process.env.BASE ?? 'http://localhost:3200'
const WINDOW_MS = 30000 // the in-world measurement window
const WARMUP_MS = 8000

type Tier = 'high' | 'mid' | 'low'
const EMU: Record<Tier, { width: number; height: number; touch: boolean; cpuThrottle: number }> = {
  high: { width: 1440, height: 900, touch: false, cpuThrottle: 1 },
  mid: { width: 390, height: 844, touch: true, cpuThrottle: 4 },
  low: { width: 360, height: 800, touch: true, cpuThrottle: 2 },
}

const tier = process.argv[2] as Tier
const run = Number(process.argv[3] ?? 1)
if (!EMU[tier] || !(run === 1 || run === 2)) {
  console.error('usage: bun scripts/perf/phase25/harness.ts <high|mid|low> <1|2>')
  process.exit(2)
}

const T0 = Date.now()
const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 330s launch budget hit')
  process.exit(3)
}, 330000)

const log = (label: string) => {
  const line = `[${tier}#${run} +${((Date.now() - T0) / 1000).toFixed(1)}s] ${label}`
  try { appendFileSync('/tmp/phase25-harness.log', line + '\n') } catch {}
  console.log(line)
}

function buildId(): string {
  for (const p of [join(ROOT, '.next/standalone/.next/BUILD_ID'), join(ROOT, '.next/BUILD_ID')]) {
    try { return readFileSync(p, 'utf8').trim() } catch {}
  }
  return 'unknown'
}

/** armed BEFORE any app code — records the world-ready marker honestly */
const INIT = `
  window.__lklForceQuality = ${JSON.stringify(tier)};
  window.__lklBoot = { navStart: performance.now(), worldSceneReadyAt: null, tierSeen: null };
  (function poll() {
    try {
      if (window.__lklBoot.worldSceneReadyAt === null && window.__lklTier && window.__lklGlCanvas) {
        window.__lklBoot.worldSceneReadyAt = performance.now();
        window.__lklBoot.tierSeen = window.__lklTier;
      }
    } catch (e) {}
    setTimeout(poll, 40);
  })();
`

/** 30s rAF census — every frame gap; runs INSIDE the page */
const CENSUS = (ms: number) =>
  new Promise<any>((resolve) => {
    const w = window as any
    const gaps: number[] = []
    let last = performance.now()
    const t0 = last
    const mem = () => (w.performance?.memory?.usedJSHeapSize ?? null)
    const memStart = mem()
    const tick = (now: number) => {
      gaps.push(now - last)
      last = now
      if (now - t0 >= ms) {
        const sorted = [...gaps].sort((a, b) => a - b)
        const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0
        const inst = gaps.map((g) => (g > 0 ? 1000 / g : 0)).sort((a, b) => a - b)
        resolve({
          frames: gaps.length,
          elapsedMs: Math.round(now - t0),
          avgFps: +(gaps.length / ((now - t0) / 1000) || 0).toFixed(2),
          fpsP50: +(inst[Math.floor(inst.length * 0.5)] ?? 0).toFixed(2),
          fpsP05: +(inst[Math.floor(inst.length * 0.05)] ?? 0).toFixed(2),
          p50GapMs: +q(0.5).toFixed(1),
          p95GapMs: +q(0.95).toFixed(1),
          worstGapMs: +Math.max(...gaps).toFixed(1),
          jankOver50ms: gaps.filter((g) => g > 50).length,
          jankOver100ms: gaps.filter((g) => g > 100).length,
          heapStartMB: memStart != null ? +(memStart / 1048576).toFixed(1) : null,
          heapEndMB: mem() != null ? +(mem() / 1048576).toFixed(1) : null,
        })
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

async function main() {
  mkdirSync(RESULTS, { recursive: true })
  const emu = EMU[tier]
  const errors: string[] = []
  // channel 'chromium' = FULL Chromium in new-headless mode. The
  // chrome-headless-shell paced BeginFrames at an irregular 2-4s cadence
  // (measured: 2.0s gaps then 3.8s gaps on identical trees) — it throttled
  // the census, not the scene. New headless emits real display-style
  // BeginFrames; remaining slowness is SwiftShader raster truth.
  const browser = await chromium.launch({
    channel: 'chromium',
    args: [
      '--disable-dev-shm-usage',
      '--enable-precise-memory-info',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-background-timer-throttling',
    ],
  })
  const record: any = {
    tier,
    run,
    ts: new Date().toISOString(),
    buildId: buildId(),
    base: BASE,
    emulation: { viewport: `${emu.width}x${emu.height}`, hasTouch: emu.touch, cpuThrottle: `x${emu.cpuThrottle}`, deviceScaleFactor: 1 },
    renderEnv: 'headless chromium — SwiftShader software WebGL (NOT a real-device number)',
    flow: {},
    boot: {},
    fps30s: null,
    probeReport: null,
    drawCalls: null,
    drawCallsWhy: null,
    heap: {},
    errors: { pageerror: 0, consoleError: 0, samples: [] },
    wallMs: 0,
  }
  try {
    const context = await browser.newContext({
      viewport: { width: emu.width, height: emu.height },
      hasTouch: emu.touch,
      isMobile: emu.touch,
    })
    const page = await context.newPage()
    await page.addInitScript(INIT)
    page.on('pageerror', (e: Error) => {
      record.errors.pageerror++
      if (record.errors.samples.length < 6) errors.push('pageerror: ' + String(e).slice(0, 180))
    })
    page.on('console', (m: any) => {
      if (m.type() === 'error') {
        record.errors.consoleError++
        if (record.errors.samples.length < 6) errors.push('console: ' + String(m.text()).slice(0, 180))
      }
    })

    const cdp = await context.newCDPSession(page)
    await cdp.send('Performance.enable')
    if (emu.cpuThrottle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: emu.cpuThrottle })

    // ---------- menu → new game (guest) ----------
    const tGoto = Date.now()
    await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 90000 })
    record.flow.gotoMs = Date.now() - tGoto
    log(`goto done (${record.flow.gotoMs}ms)`)

    const tMenu = Date.now()
    await page.getByText('START YOUR LIFE').first().click({ timeout: 45000 })
    await page.getByLabel('Character name').fill('Ada', { timeout: 45000 })
    await page.getByText('Start Life in Lokoja').first().click({ timeout: 45000 })
    await page.getByText('Explore in 3D').first().click({ timeout: 45000 })
    record.flow.menuToExploreMs = Date.now() - tMenu
    log('clicked Explore in 3D')

    // M9 guest gate may stand up — 'Maybe later' is the lawful one-day grace
    try {
      await page.getByTestId('guest-enter').click({ timeout: 8000 })
      record.flow.guestGateHandled = 'maybe-later'
      log('guest gate: Maybe later')
    } catch {
      record.flow.guestGateHandled = 'not-shown'
    }
    // intro card skip — fire-and-forget (world boot can stall the main thread)
    try {
      page
        .getByText('Skip', { exact: true })
        .first()
        .click({ force: true, timeout: 2500 })
        .then(() => log('intro skip fired'))
        .catch(() => {})
    } catch {}

    // ---------- boot-to-interactive ----------
    const tBoot = Date.now()
    await page.waitForFunction(() => (window as any).__lklBoot?.worldSceneReadyAt != null, undefined, { timeout: 150000 })
    record.flow.worldWaitMs = Date.now() - tBoot
    const boot = await page.evaluate(() => (window as any).__lklBoot)
    record.boot = {
      worldSceneReadyMs: Math.round(boot.worldSceneReadyAt),
      marker: '__lklTier && __lklGlCanvas present (WorldScene onCreated, 40ms poll)',
      tierInForce: (await page.evaluate(() => (window as any).__lklTier)) ?? null,
      fcpMs: await page.evaluate(() => {
        const e = performance.getEntriesByName('first-contentful-paint')[0]
        return e ? Math.round(e.startTime) : null
      }),
    }
    log(`world scene ready — boot ${record.boot.worldSceneReadyMs}ms, tier=${record.boot.tierInForce}`)

    // ---------- warmup then the 30s window ----------
    await page.waitForTimeout(WARMUP_MS)
    log('warmup done; 30s census starts')
    record.fps30s = await Promise.race([
      page.evaluate(CENSUS, WINDOW_MS),
      new Promise((r) => setTimeout(() => r({ stalled: true, why: 'rAF census did not resolve within window+10s' }), WINDOW_MS + 10000)),
    ])
    log('census done: ' + JSON.stringify(record.fps30s))

    // ---------- the game's own perfProbe truth (sampleFor → ring) ----------
    try {
      const report = await Promise.race([
        page.evaluate(() => (window as any).__lkl?.fpsReport(3000)),
        new Promise((r) => setTimeout(() => r(null), 20000)),
      ])
      if (typeof report === 'string') {
        const grab = (re: RegExp) => report.match(re)?.[1] ?? null
        record.probeReport = {
          raw: report,
          fpsAvg: grab(/fps: ([\d.]+) avg/),
          p95FrameMs: grab(/p95 frame (\d+)ms/),
          worstFrameMs: grab(/worst (\d+)ms/),
          frames: grab(/\((\d+) frames\)/),
          drawCalls: grab(/render: (\d+) draw calls/),
          trisK: grab(/· (\d+)k tris/),
          programs: grab(/· (\d+) programs/),
          gpu: grab(/gpu: (.*)/),
        }
        log('probeReport captured: ' + report.split('\n')[4])
      } else {
        record.probeReport = { raw: null, why: '__lkl.fpsReport absent or timed out (WorldTab e2e hook requires ?e2e=1)' }
      }
    } catch (e) {
      record.probeReport = { raw: null, why: 'fpsReport failed: ' + String(e).slice(0, 120) }
    }

    // ---------- draw calls via the Phase-2.5 e2e gate ----------
    try {
      const gl = await Promise.race([
        page.evaluate(() => {
          const r = (window as any).__lklRenderer
          if (!r?.info?.render) return null
          return { calls: r.info.render.calls, triangles: r.info.render.triangles, programs: r.info.programs?.length ?? null }
        }),
        new Promise((r) => setTimeout(() => r(null), 10000)),
      ])
      if (gl) record.drawCalls = gl
      else
        record.drawCallsWhy =
          '__lklRenderer absent — either the served artifact predates the ?e2e=1 gate (WorldScene.tsx Phase-2.5 hook) or the context died'
    } catch (e) {
      record.drawCallsWhy = 'evaluate failed: ' + String(e).slice(0, 120)
    }

    // ---------- heap ----------
    try {
      const mem = await page.evaluate(() => {
        const m = (performance as any).memory
        return m ? { usedMB: +(m.usedJSHeapSize / 1048576).toFixed(1), limitMB: +(m.jsHeapSizeLimit / 1048576).toFixed(0) } : null
      })
      if (mem) record.heap = { ...mem, source: 'performance.memory (precise)' }
      else {
        const { metrics } = await cdp.send('Performance.getMetrics')
        const used = metrics.find((m: any) => m.name === 'JSHeapUsedSize')?.value ?? null
        record.heap = used != null ? { usedMB: +(used / 1048576).toFixed(1), source: 'CDP Performance.getMetrics' } : { usedMB: null, why: 'no heap source exposed' }
      }
    } catch (e) {
      record.heap = { usedMB: null, why: String(e).slice(0, 120) }
    }

    await context.close().catch(() => {})
  } catch (e) {
    record.flow.harnessError = String(e).slice(0, 300)
    log('HARNESS ERROR: ' + String(e).slice(0, 200))
  }
  clearTimeout(watchdog)
  record.errors.samples = errors
  record.wallMs = Date.now() - T0

  const path = join(RESULTS, `${tier}.json`)
  let arr: any[] = []
  try { arr = JSON.parse(readFileSync(path, 'utf8')); if (!Array.isArray(arr)) arr = [] } catch {}
  arr.push(record)
  writeFileSync(path, JSON.stringify(arr, null, 2))
  log(`WROTE ${path} (run ${arr.length} on file) — wall ${record.wallMs}ms`)
  await browser.close().catch(() => {})
}

main().catch((e) => {
  clearTimeout(watchdog)
  console.error('fatal:', String(e).slice(0, 300))
  process.exit(1)
})
