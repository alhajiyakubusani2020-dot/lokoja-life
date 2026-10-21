/**
 * TEAM ECHO — Phase 2.5 DEVICE MATRIX VALIDATION (Task 5-e)
 * ----------------------------------------------------------
 * MEASURE ONLY. Plays the REAL production server on an emulated device
 * matrix and records reality. Touches nothing under src/ — this file
 * lives in scripts/audit-tmp/echo25/ (the team's only editable set).
 *
 * Reuses (never duplicates) Alpha's doors:
 *   - the prod server (marker /tmp/phase25-server-up → :3200)
 *   - ?e2e=1 hooks: __lkl (WorldTab), __lkoDash (Dashboard), __lklTier/__lklForceQuality (WorldScene)
 *   - perfProbe sampleFor via __lkl.fpsReport (the app's own FPS API — in-run cross-check)
 *
 * Per run (one profile, one repetition):
 *   boot (nav→world first frame) · 30s FPS (15s idle + 15s walk; rAF-cadence
 *   AND draw-burst rendered-fps) · JS heap start→end · 3 interactions
 *   (phone, map, travel) tap→first-visual-response · console/pageerror census ·
 *   3-minute in-world soak with heap drift + crash/context-loss watch.
 *
 * Usage: bun scripts/audit-tmp/echo25/matrix.ts <low|mid|high> <run#> <baseURL>
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, appendFileSync } from 'fs'

const RESULTS = '/home/z/my-project/scripts/audit-tmp/echo25/results'
mkdirSync(RESULTS, { recursive: true })

const profileKey = process.argv[2] ?? 'low'
const runNo = process.argv[3] ?? '1'
const BASE = process.argv[4] ?? 'http://localhost:3200'

interface ProfileSpec {
  viewport: { width: number; height: number }
  isMobile: boolean
  hasTouch: boolean
  deviceScaleFactor: number
  cpuThrottle: number // 0 = none
  net: { downloadBps: number; uploadBps: number; latencyMs: number } | null
  quality: 'low' | 'mid' | 'high'
}

/** device.ts presets being forced: low{frameHz30,dprCap1.05,far720}, mid{dprCap1.4}, high{dprCap1.75,shadows} */
const PROFILES: Record<string, ProfileSpec> = {
  low: {
    viewport: { width: 360, height: 800 },
    isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    cpuThrottle: 4,
    net: { downloadBps: 400 * 1024 / 8, uploadBps: 400 * 1024 / 8, latencyMs: 200 }, // slow 3G-ish 400kbps/200ms
    quality: 'low',
  },
  mid: {
    viewport: { width: 390, height: 844 },
    isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    cpuThrottle: 2,
    net: { downloadBps: 1.5 * 1024 * 1024 / 8, uploadBps: 750 * 1024 / 8, latencyMs: 100 }, // fast 3G
    quality: 'mid',
  },
  high: {
    viewport: { width: 1440, height: 900 },
    isMobile: false, hasTouch: false, deviceScaleFactor: 1,
    cpuThrottle: 0,
    net: null,
    quality: 'high',
  },
}
const spec = PROFILES[profileKey]
if (!spec) { console.error('unknown profile:', profileKey); process.exit(1) }

const T0 = Date.now()
// hard watchdog: bail with partial results long before any harness wedge
const watchdogMs = Number(process.env.ECHO_WATCHDOG_MIN ?? 9.4) * 60 * 1000
const watchdog = setTimeout(() => {
  step(`WATCHDOG ${watchdogMs/60000}min hit — aborting run with partial data`)
  process.exit(3)
}, watchdogMs)

const step = (label: string) => {
  const line = `${profileKey}#${runNo} +${((Date.now() - T0) / 1000).toFixed(1)}s ${label}`
  try { appendFileSync('/tmp/echo25-progress.log', line + '\n') } catch {}
  console.log(line)
}

const errors: string[] = []
let consoleErrCount = 0
let pageErrCount = 0
const pageErrors: string[] = []
let crashed = false

/* ---------------- in-page snippets ---------------- */

/** Installed before any page script: boot markers, input timestamps,
 *  longtask observer, and the WebGL draw-activity counter (the honest
 *  rendered-frame signal on the demand-paced LOW tier where rAF alone
 *  fires at vsync regardless of renders). */
const INIT = () => {
  const w = window as any
  w.__echo = {
    domReadyAt: null as number | null,
    sceneCreatedAt: null as number | null,
    firstFrameAt: null as number | null,
    lastInputAt: null as number | null,
    longtasks: [] as Array<{ s: number; d: number }>,
    glDraws: 0,
    glStatusEvents: [] as string[],
  }
  // trap the WorldScene e2e tier assignment → scene creation timestamp
  let tier: any = undefined
  Object.defineProperty(window, '__lklTier', {
    configurable: true,
    get: () => tier,
    set: (v) => {
      tier = v
      w.__echo.sceneCreatedAt = performance.now()
      // world scene's first presented frame = first vsync after creation
      requestAnimationFrame((t: number) => {
        if (w.__echo.firstFrameAt == null) w.__echo.firstFrameAt = t
      })
    },
  })
  document.addEventListener('pointerdown', () => { w.__echo.lastInputAt = performance.now() }, true)
  document.addEventListener('DOMContentLoaded', () => { w.__echo.domReadyAt = performance.now() })
  document.addEventListener('webglcontextlost', () => w.__echo.glStatusEvents.push('lost@' + performance.now().toFixed(0)), true)
  document.addEventListener('webglcontextrestored', () => w.__echo.glStatusEvents.push('restored@' + performance.now().toFixed(0)), true)
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) w.__echo.longtasks.push({ s: +e.startTime.toFixed(1), d: +e.duration.toFixed(1) })
    }).observe({ entryTypes: ['longtask'] })
  } catch {}
  // draw-call activity counter (harness-only instrumentation, no game code touched)
  const wrap = (proto: any) => {
    if (!proto) return
    for (const m of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
      const orig = proto[m]
      if (typeof orig === 'function') {
        proto[m] = function (...a: any[]) { w.__echo.glDraws++; return orig.apply(this, a) }
      }
    }
  }
  wrap((window as any).WebGL2RenderingContext?.prototype)
  wrap((window as any).WebGLRenderingContext?.prototype)
}

/** One FPS segment: rAF gaps + draw-burst count, `ms` long. */
const SAMPLE_SEG = (ms: number) =>
  new Promise<any>((resolve) => {
    const w = window as any
    const gaps: number[] = []
    let last = performance.now()
    const t0 = last
    let lastDraws = w.__echo.glDraws
    let bursts = 0
    let prevIdle = true
    let burstStart = 0
    const burstMs: number[] = []
    const tick = (now: number) => {
      gaps.push(now - last)
      last = now
      const d = w.__echo.glDraws - lastDraws
      lastDraws = w.__echo.glDraws
      if (d > 0) {
        if (prevIdle) { bursts++; burstStart = now }
        prevIdle = false
      } else {
        if (!prevIdle && burstStart > 0) burstMs.push(+(now - burstStart).toFixed(1))
        prevIdle = true
      }
      if (now - t0 >= ms) {
        if (!prevIdle && burstStart > 0) burstMs.push(+(now - burstStart).toFixed(1))
        const sorted = [...gaps].sort((a, b) => a - b)
        const q = (p: number) => +(sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0).toFixed(1)
        const avgBurst = burstMs.length ? +(burstMs.reduce((s, v) => s + v, 0) / burstMs.length).toFixed(1) : null
        resolve({
          frames: gaps.length,
          elapsedMs: Math.round(now - t0),
          avgFps: +((gaps.length / ((now - t0) / 1000)) || 0).toFixed(2),
          p50Gap: q(0.5),
          p95Gap: q(0.95),
          worstGap: +Math.max(...gaps).toFixed(1),
          jank50: gaps.filter((g) => g > 50).length,
          jank100: gaps.filter((g) => g > 100).length,
          drawBursts: bursts,
          burstFps: +((bursts / ((now - t0) / 1000)) || 0).toFixed(2),
          avgBurstMs: avgBurst,
          worstBurstMs: burstMs.length ? +Math.max(...burstMs).toFixed(1) : null,
          longtasksDuring: w.__echo.longtasks.length,
        })
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

const heapMB = () => (performance as any).memory ? +((performance as any).memory.usedJSHeapSize / 1048576).toFixed(1) : null

/** Arm a response watcher: resolve on the first rAF after `predicate`
 *  ('sel:<css>' | 'text:<str>') sees its target, or on timeout. */
const ARM = (predicate: string, maxMs: number) =>
  new Promise<any>((resolve) => {
    const t0 = performance.now()
    const check = (): Element | null => {
      if (predicate.startsWith('sel:')) return document.querySelector(predicate.slice(4))
      const needle = predicate.slice(5).toLowerCase()
      return (document.body?.innerText ?? '').toLowerCase().includes(needle) ? document.body : null
    }
    const poll = () => {
      if (check()) {
        requestAnimationFrame((t) => resolve({ dispatchAt: t0, respondedAt: +t.toFixed(1), ok: true }))
        return
      }
      if (performance.now() - t0 > maxMs) { resolve({ dispatchAt: t0, respondedAt: null, ok: false }); return }
      setTimeout(poll, 25)
    }
    poll()
  })

/* ---------------- harness ---------------- */

async function main() {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--enable-precise-memory-info'] })
  const out: any = {
    profile: profileKey, run: Number(runNo), base: BASE,
    ts: new Date().toISOString(),
    spec: { ...spec, netText: spec.net ? `${(spec.net.downloadBps * 8 / 1000).toFixed(0)}kbps/${spec.net.latencyMs}ms` : 'none' },
    boot: null, fps: null, heap: null, interactions: null, soak: null,
    perfProbeReport: null, tierInForce: null, deviceProfile: null,
    glStatusEvents: null, consoleErrCount: 0, pageErrCount: 0, pageErrorsSample: [],
    crashed: false, netFailed: 0, hooks: null, wallMs: null, abort: null,
  }
  try {
    const context = await browser.newContext({
      viewport: spec.viewport,
      isMobile: spec.isMobile,
      hasTouch: spec.hasTouch,
      deviceScaleFactor: spec.deviceScaleFactor,
    })
    const page = await context.newPage()
    page.setDefaultTimeout(20000)
    page.on('crash', () => { crashed = true; errors.push('PAGE CRASH'); step('PAGE CRASH') })
    page.on('pageerror', (e) => { pageErrCount++; pageErrors.push('pageerror: ' + String(e).slice(0, 220)); step('pageerror: ' + String(e).slice(0, 120)) })
    page.on('console', (m) => { if (m.type() === 'error') { consoleErrCount++; errors.push('console: ' + String(m.text()).slice(0, 220)) } })

    await page.addInitScript(INIT)
    await page.addInitScript(`window.__lklForceQuality = '${spec.quality}'`)

    // CDP: CPU throttle + network conditions
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    if (spec.cpuThrottle > 0) { await cdp.send('Emulation.setCPUThrottlingRate', { rate: spec.cpuThrottle }); step(`cpu throttle ×${spec.cpuThrottle}`) }
    if (spec.net) {
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: spec.net.latencyMs,
        downloadThroughput: spec.net.downloadBps,
        uploadThroughput: spec.net.uploadBps,
      })
      step(`net ${spec.netText}`)
    }
    cdp.on('Network.loadingFailed', () => out.netFailed++)

    // ---------- cold boot ----------
    const navT0 = Date.now()
    await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 90000 })
    step('goto done (domcontentloaded)')
    await page.waitForSelector('text=START YOUR LIFE', { timeout: 60000 })
    await page.waitForTimeout(1200)
    await page.getByText('START YOUR LIFE').first().click({ timeout: 30000 })
    await page.getByLabel('Character name').fill('Echo', { timeout: 30000 })
    await page.getByText('Start Life in Lokoja').first().click({ timeout: 30000 })
    step('identity done')
    await page.getByText('Explore in 3D').first().click({ timeout: 30000 })
    step('3D entry clicked — waiting for world first frame')

    // M9 guest gate (same door Alpha knocks): 'Maybe later' is the lawful grace
    try {
      await page.getByTestId('guest-enter').click({ timeout: 8000 })
      out.guestGate = 'maybe-later'
      step('guest gate: Maybe later')
    } catch { out.guestGate = 'not-shown' }

    // boot = nav start → world scene first frame (page-side clock, includes net+UI+scene)
    const bootDeadline = profileKey === 'low' ? 150000 : 90000
    const bootP = page.waitForFunction(() => (window as any).__echo?.firstFrameAt != null, undefined, { timeout: bootDeadline })
    // intro card skip: fire-and-forget (world boot can stall the main thread)
    setTimeout(() => { page.getByText('Skip', { exact: true }).first().click({ force: true, timeout: 2500 }).catch(() => {}) }, 2500)
    await bootP
    const boot = await page.evaluate(() => {
      const e = (window as any).__echo
      return {
        firstFrameAtMs: e.firstFrameAt != null ? +e.firstFrameAt.toFixed(0) : null,
        sceneCreatedAtMs: e.sceneCreatedAt != null ? +e.sceneCreatedAt.toFixed(0) : null,
        domReadyAtMs: e.domReadyAt != null ? +e.domReadyAt.toFixed(0) : null,
      }
    })
    out.boot = { ...boot, nodeWallMs: Date.now() - navT0, fcpMs: await page.evaluate(() => { const e = performance.getEntriesByName('first-contentful-paint')[0]; return e ? Math.round(e.startTime) : null }) }
    step(`BOOT firstFrame=${boot.firstFrameAtMs}ms sceneCreated=${boot.sceneCreatedAtMs}ms domReady=${boot.domReadyAtMs}ms fcp=${out.boot.fcpMs}ms`)
    out.tierInForce = await page.evaluate(() => (window as any).__lklTier ?? null)
    out.deviceProfile = await page.evaluate(() => (window as any).__lkl?.deviceProfile?.() ?? null)
    step(`tier in force: ${JSON.stringify(out.tierInForce)} / effective: ${out.deviceProfile?.effective}`)

    // ---------- settle + heap start ----------
    await page.waitForTimeout(8000) // warmup
    const heapStart = await page.evaluate(heapMB)
    step(`warmup done; heapStart=${heapStart}MB`)

    // ---------- 30s FPS: 15s idle + 15s walk ----------
    const idle = await page.evaluate(SAMPLE_SEG, 15000)
    step(`idle seg: rAF fps=${idle.avgFps} p95=${idle.p95Gap} burstFps=${idle.burstFps} lt=${idle.longtasksDuring}`)
    await page.evaluate(() => (window as any).__lkl.stick(0, -1)) // walk south — persists (setJoystick)
    const refresher = setInterval(() => { page.evaluate(() => (window as any).__lkl.stick(0, -1)).catch(() => {}) }, 2000)
    const walk = await page.evaluate(SAMPLE_SEG, 15000)
    clearInterval(refresher)
    await page.evaluate(() => (window as any).__lkl.stick(0, 0))
    step(`walk seg: rAF fps=${walk.avgFps} p95=${walk.p95Gap} burstFps=${walk.burstFps} jank50=${walk.jank50}`)
    const heapAfterFps = await page.evaluate(heapMB)
    out.fps = { idle, walk, heapAfterFpsMB: heapAfterFps }

    // ---------- perfProbe cross-check (the app's OWN fps API) ----------
    try {
      const rep: string = await Promise.race([
        page.evaluate(() => (window as any).__lkl.fpsReport(5000)),
        new Promise((r) => setTimeout(() => r(''), 15000)),
      ]) as string
      out.perfProbeReport = rep || null
      if (rep) step('perfProbe: ' + rep.split('\n').find((l) => l.startsWith('fps:')))
    } catch { step('perfProbe report unavailable') }

    // ---------- draw calls via the Phase-2.5 e2e gate (same extraction as Alpha) ----------
    try {
      out.drawCalls = await Promise.race([
        page.evaluate(() => {
          const r = (window as any).__lklRenderer
          if (!r?.info?.render) return null
          return { calls: r.info.render.calls, triangles: r.info.render.triangles, programs: r.info.programs?.length ?? null }
        }),
        new Promise((r) => setTimeout(() => r(null), 10000)),
      ])
      if (out.drawCalls) step('drawCalls: ' + JSON.stringify(out.drawCalls))
    } catch { out.drawCalls = null }

    // ---------- interactions ----------
    const interactions: any = {}
    const SKIP_INT = !!process.env.ECHO_SKIP_INT
    // (1) open the phone — real tap on the FAB
    if (!SKIP_INT) {
      const armP = page.evaluate(ARM, 'sel:[data-testid="world-phone-overlay"]')
      await (spec.hasTouch ? page.tap('[data-testid="world-phone-fab"]', { force: true }) : page.click('[data-testid="world-phone-fab"]', { force: true }))
      const r = await armP
      const inputAt = await page.evaluate(() => (window as any).__echo.lastInputAt)
      interactions.openPhone = { ...r, inputAt, latencyMs: r.respondedAt != null ? +(r.respondedAt - (inputAt ?? r.dispatchAt)).toFixed(1) : null }
      step(`interaction openPhone: ${JSON.stringify(interactions.openPhone)}`)
      await page.mouse.click(6, 6) // backdrop corner closes the handset
      await page.waitForTimeout(600)
    }
    // (2) open the map — the Dashboard's REAL in-world switchTab door (__lkoDash, W3 hook)
    if (!SKIP_INT) try {
      const armP = page.evaluate(ARM, 'sel:[data-testid="world-overlay-sheet"]')
      const dispatchAt = await page.evaluate(() => { const t = performance.now(); (window as any).__lkoDash.open('map'); return t })
      const r = await armP
      interactions.openMap = { ...r, dispatchAt, tapKind: 'hook-switchTab(map)', latencyMs: r.respondedAt != null ? +(r.respondedAt - dispatchAt).toFixed(1) : null }
      step(`interaction openMap: ${JSON.stringify(interactions.openMap)}`)
    } catch (e) { interactions.openMap = { ok: false, why: String(e).slice(0,120) }; step('openMap FAILED: ' + String(e).slice(0,100)) }
    // (3) start a travel — real taps: marker → travel row → Travelling… scrim
    if (!SKIP_INT) try {
      const dialogArm = page.evaluate(ARM, 'sel:[role="dialog"][aria-label*="details"]')
      await (spec.hasTouch ? page.tap('button[aria-label="Kpata Market"]', { force: true }) : page.click('button[aria-label="Kpata Market"]', { force: true }))
      const dlg = await dialogArm
      step(`travel: details dialog ok=${dlg.ok}`)
      const rowSel = '[role="dialog"][aria-label*="details"] button:not([disabled])'
      // pick the first ENABLED travel row (has "min trip" text)
      const rowIdx = await page.evaluate((sel) => {
        const rows = [...document.querySelectorAll(sel)] as HTMLElement[]
        const i = rows.findIndex((b) => b.innerText.includes('min trip'))
        return i
      }, rowSel)
      if (rowIdx >= 0) {
        const armP = page.evaluate(ARM, 'text:Travelling')
        const row = page.locator(`${rowSel}`).nth(rowIdx)
        if (spec.hasTouch) { await row.tap({ force: true, timeout: 15000 }) } else { await row.click({ force: true, timeout: 15000 }) }
        const r = await armP
        const inputAt = await page.evaluate(() => (window as any).__echo.lastInputAt)
        interactions.startTravel = {
          dialogOpened: dlg.ok, rowIdx, ...r, inputAt,
          latencyMs: r.respondedAt != null ? +(r.respondedAt - (inputAt ?? r.dispatchAt)).toFixed(1) : null,
        }
      } else {
        interactions.startTravel = { dialogOpened: dlg.ok, rowIdx: -1, ok: false, latencyMs: null, why: 'no enabled travel row' }
      }
      step(`interaction startTravel: ${JSON.stringify(interactions.startTravel)}`)
      // leave the map sheet — the street soaks
      const back = page.locator('[data-testid="overlay-close"]')
      if (await back.count()) await back.click({ force: true }).catch(() => {})
      await page.waitForTimeout(500)
    } catch (e) { interactions.startTravel = { ok: false, why: String(e).slice(0,120) }; step('startTravel FAILED: ' + String(e).slice(0,100)) }
    if (SKIP_INT) step('interactions SKIPPED (ECHO_SKIP_INT) — main-thread starvation guard')
    out.interactions = interactions

    // ---------- soak (env-tunable; default 180s) ----------
    const SOAK_MS = Number(process.env.ECHO_SOAK_S ?? 180) * 1000
    step(`SOAK start (${SOAK_MS/1000}s in-world)`)
    const soakT0 = Date.now()
    const heapSeries: Array<{ t: number; mb: number | null }> = []
    const soakErrorsBefore = pageErrCount
    let soakGlSample: any = null
    const soakTimer = setInterval(async () => {
      try { heapSeries.push({ t: Math.round((Date.now() - soakT0) / 1000), mb: await page.evaluate(heapMB) }) } catch {}
    }, 15000)
    // mid-soak 10s render sample (walk if idle — keep the street alive)
    const midSoak = async () => {
      try {
        await page.evaluate(() => (window as any).__lkl.stick(0, -1))
        const s = await page.evaluate(SAMPLE_SEG, 10000)
        await page.evaluate(() => (window as any).__lkl.stick(0, 0))
        soakGlSample = s
        step(`soak mid sample: rAF fps=${s.avgFps} burstFps=${s.burstFps} p95=${s.p95Gap}`)
      } catch (e) { step('soak mid sample failed: ' + String(e).slice(0, 100)) }
    }
    setTimeout(midSoak, 70000)
    await page.waitForTimeout(SOAK_MS)
    clearInterval(soakTimer)
    const heapEnd = await page.evaluate(heapMB).catch(() => null)
    const glNow = await page.evaluate(() => ({
      status: (window as any).__lklGlStatus ?? 'ok',
      tier: (window as any).__lklTier ?? null,
      alive: !!document.querySelector('canvas'),
    })).catch(() => null)
    const soakPageErrors = pageErrors.slice(-Math.max(0, pageErrCount - soakErrorsBefore))
    out.soak = {
      durationS: Math.round((Date.now() - soakT0) / 1000),
      heapSeries, heapEndMB: heapEnd,
      heapDriftMB: heapStart != null && heapEnd != null ? +(heapEnd - heapStart).toFixed(1) : null,
      heapDriftPct: heapStart != null && heapEnd != null && heapStart > 0 ? +(((heapEnd - heapStart) / heapStart) * 100).toFixed(1) : null,
      pageErrorsDuringSoak: pageErrCount - soakErrorsBefore,
      soakErrorsSample: soakPageErrors,
      glStatusDuring: await page.evaluate(() => (window as any).__echo.glStatusEvents).catch(() => null),
      glNow, midSample: soakGlSample,
      crashedDuringSoak: crashed,
    }
    step(`SOAK done: heapEnd=${heapEnd}MB drift=${out.soak.heapDriftMB}MB (${out.soak.heapDriftPct}%) gl=${glNow?.status} crashed=${crashed}`)

    out.glStatusEvents = await page.evaluate(() => (window as any).__echo.glStatusEvents).catch(() => null)
    out.heap = { startMB: heapStart, afterFpsMB: heapAfterFps, endMB: heapEnd }
    out.longtasks = await page.evaluate(() => (window as any).__echo.longtasks).catch(() => null)
    out.glDraws = await page.evaluate(() => (window as any).__echo.glDraws).catch(() => null)
    out.hooks = { phoneFabSeen: interactions.openPhone?.ok === true, dashHookSeen: interactions.openMap?.ok === true }
  } catch (e) {
    out.abort = String(e).slice(0, 400)
    errors.push('harness: ' + String(e).slice(0, 300))
    step('ABORT: ' + String(e).slice(0, 200))
  }
  clearTimeout(watchdog)
  out.consoleErrCount = consoleErrCount
  out.pageErrCount = pageErrCount
  out.pageErrorsSample = pageErrors.slice(0, 12)
  out.consoleErrorsSample = errors.slice(0, 12)
  out.crashed = crashed
  out.wallMs = Date.now() - T0

  const file = `${RESULTS}/${profileKey}-run${runNo}.json`
  writeFileSync(file, JSON.stringify(out, null, 2))
  console.log('WROTE', file)
  await browser.close().catch(() => {})
}

main().catch((e) => { clearTimeout(watchdog); console.error('fatal:', String(e).slice(0, 400)); process.exit(1) })
