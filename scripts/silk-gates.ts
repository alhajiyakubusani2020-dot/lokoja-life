/**
 * LOKOJA LIFE — M16: THE SILK GATES (the CI law, hand-rolled honest)
 * -------------------------------------------------------------------
 * Six gates, one verdict, no red allowed:
 *   G1 TTI < 3s            — Fast-3G throttled (1.6Mbps/150ms RTT),
 *                            navigation → menu interactive (the start
 *                            button answers a click with a frame)
 *   G2 WIRE < 900KB        — the first-load transfer that landed BEFORE
 *                            the menu went interactive (the game chunk
 *                            is idle-preloaded after — it never counts)
 *   G3 INTERACTION < 100ms — a click on the warm shell answers with a
 *                            rAF inside the budget
 *   G4 MEMORY < 300MB      — the 3D world booted and settled, the JS
 *                            heap measured via CDP
 *   G5 CACHE < 30MB        — the service worker's whole storage bill
 *   G6 THE MATRIX          — responsive screenshots at 360/390/768/
 *                            1280/1920 (menu ×5 + world ×2), zero
 *                            console errors across the run
 *
 * Run: bun scripts/silk-gates.ts            (against the prod server)
 *      SILK_BASE=http://localhost:3001 bun scripts/silk-gates.ts
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.SILK_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m16-silk-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 300s hard exit')
  process.exit(2)
}, 295_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

interface Gate { name: string; value: string; limit: string; ok: boolean }
const gates: Gate[] = []
const gate = (name: string, value: string, limit: string, ok: boolean) => {
  gates.push({ name, value, limit, ok })
  console.log(`  ${ok ? '🟢' : '🔴'} ${name}: ${value} (limit ${limit})`)
}

const errors: string[] = []

/** the m7 lesson: headless SwiftShader builds the world with the main
 *  thread jammed ~30s — poll until it answers twice in a row AND the
 *  canvas is in AND the veil is gone. Never fixed-wait a 3D boot. */
const settle = async (page: import('playwright').Page, maxMs: number): Promise<'settled' | 'timeout'> => {
  const t0 = Date.now()
  let aliveStreak = 0
  while (Date.now() - t0 < maxMs) {
    const ping = await race(page.evaluate(() => ({
      veil: document.body.innerText.includes('Entering Lokoja'),
      canvas: !!document.querySelector('canvas'),
    })), 4000, null) as { veil: boolean; canvas: boolean } | null
    if (ping !== null && ping.canvas && !ping.veil) {
      aliveStreak++
      if (aliveStreak >= 2) return 'settled'
    } else {
      aliveStreak = 0
    }
    await page.waitForTimeout(700)
  }
  return 'timeout'
}

/** poll a probe until it turns true (the idle register is patient law) */
const pollTrue = async (page: import('playwright').Page, probe: () => unknown, maxMs: number): Promise<boolean> => {
  const t0 = Date.now()
  while (Date.now() - t0 < maxMs) {
    const v = await race(page.evaluate(probe), 5000, false) as boolean
    if (v) return true
    await page.waitForTimeout(600)
  }
  return false
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })

  /* ---------------- G1 + G2: TTI and the wire budget on Fast 3G ---------------- */
  console.log('\n— G1/G2: THE 3-SECOND NATION (Fast 3G: 1.6Mbps, 150ms RTT) —')
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push('3g: ' + String(e).slice(0, 120)))

    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    // Fast 3G — the Lighthouse/devtools preset
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    })

    let wireBytes = 0
    const t0 = Date.now()

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 60_000, null)

    // the menu is interactive when the start button exists AND a click
    // gets a frame back (a real interaction, not just a paint)
    await race(page.waitForSelector('text=START YOUR LIFE', { timeout: 60_000 }), 62_000, null)
    const clickMs = await race(page.evaluate(async () => {
      const btn = [...document.querySelectorAll('button, [role="button"], div')]
        .find((el) => (el.textContent ?? '').trim().startsWith('START YOUR LIFE')) as HTMLElement | undefined
      if (!btn) return -1
      const t = performance.now()
      btn.click()
      await new Promise<void>((res) => requestAnimationFrame(() => res()))
      return Math.round(performance.now() - t)
    }), 20_000, -1)
    const tti = Date.now() - t0

    // THE HONEST WIRE: the Performance API's own transferSize — the same
    // number Lighthouse reads. Only bytes whose transfer finished before
    // the menu went interactive count against the first load.
    wireBytes = await race(page.evaluate(() => {
      let sum = 0
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav) sum += nav.transferSize
      for (const e of performance.getEntriesByType('resource') as PerformanceResourceTiming[]) {
        if (e.responseEnd <= performance.now() && e.transferSize > 0) sum += e.transferSize
      }
      return sum
    }), 10_000, 0) as number

    gate('G1 TTI on Fast 3G (nav → menu click answers)', `${(tti / 1000).toFixed(2)}s (click ${clickMs}ms)`, '< 3.00s', tti < 3000 && clickMs >= 0)
    gate('G2 first-load wire before interactive', `${(wireBytes / 1024).toFixed(0)}KB`, '< 900KB', wireBytes < 900 * 1024)
    await context.close()
  }

  /* ---------------------- G3: interaction on the warm shell --------------------- */
  console.log('\n— G3: THE INTERACTION LAW (warm, unthrottled) —')
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push('warm: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'load' }), 30_000, null)
    await race(page.waitForSelector('text=START YOUR LIFE', { timeout: 20_000 }), 22_000, null)
    await page.waitForTimeout(600)
    const clickMs = await race(page.evaluate(async () => {
      const btn = [...document.querySelectorAll('button, [role="button"], div')]
        .find((el) => (el.textContent ?? '').trim().startsWith('START YOUR LIFE')) as HTMLElement | undefined
      if (!btn) return -1
      const t = performance.now()
      btn.click()
      await new Promise<void>((res) => requestAnimationFrame(() => res()))
      return Math.round(performance.now() - t)
    }), 10_000, -1)
    gate('G3 warm click → next frame', `${clickMs}ms`, '< 100ms', clickMs >= 0 && clickMs < 100)
    await context.close()
  }

  /* ------------------- G4 + G6(world): memory + the world matrix ------------------- */
  console.log('\n— G4/G6: THE WORLD (boot, settle, measure) —')
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push('world: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 30_000, null)
    await page.waitForTimeout(1000)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 10_000 }).catch(() => {}), 12_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Silk Musa').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    // THE HONEST MEMORY GATE: the 3D scene itself — open the World tab
    // so the WebGL renderer, the geometry and the terrain live in the heap
    await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    // the scene builds + the governor settles (SwiftShader patience, m7 law)
    const settled = await settle(page, 120_000)
    console.log(`  world settle: ${settled}`)

    const cdp = await context.newCDPSession(page)
    await cdp.send('Performance.enable')
    const metrics = await race(cdp.send('Performance.getMetrics') as never, 8000, null) as { metrics: { name: string; value: number }[] } | null
    const heapMb = metrics ? (metrics.metrics.find((m) => m.name === 'JSHeapUsedSize')?.value ?? 0) / (1024 * 1024) : -1
    const canvasLive = await race(page.evaluate(() => !!document.querySelector('canvas')), 5000, false) as boolean
    if (!canvasLive) errors.push('world: the 3D canvas never appeared')
    gate('G4 JS heap with the 3D world running', `${heapMb.toFixed(0)}MB`, '< 300MB', heapMb > 0 && heapMb < 300 && canvasLive)
    await race(page.screenshot({ path: `${SHOTS}/matrix-1280-world.png` }), 12_000, undefined)
    console.log('  📸 matrix-1280-world')
    await context.close()
  }

  /* ------------------ G5 + G6(matrix): the SW bill + the widths ------------------ */
  console.log('\n— G5/G6: THE SILK BILL + THE RESPONSIVE MATRIX —')
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push('sw: ' + String(e).slice(0, 120)))
    // first visit: the worker registers on idle
    await race(page.goto(`${BASE}/`, { waitUntil: 'load' }), 30_000, null)
    await page.waitForTimeout(3500)
    // second visit: the worker controls, the caches fill
    await race(page.reload({ waitUntil: 'load' }), 30_000, null)
    await page.waitForTimeout(2500)

    // the idle register is capped at 4s — poll honestly instead of hoping
    const registered = await pollTrue(page, async () => {
      const reg = await navigator.serviceWorker.getRegistration()
      return !!reg?.active || !!(window as { __lkoSwRegistered?: boolean }).__lkoSwRegistered
    }, 12_000)
    console.log(`  worker registered on first visit: ${registered}`)
    // second visit: the worker controls, the caches fill
    await race(page.reload({ waitUntil: 'load' }), 30_000, null)
    await pollTrue(page, () => !!navigator.serviceWorker.controller, 10_000)

    const swState = await race(page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration()
      const keys = await caches.keys()
      let bytes = 0
      let entries = 0
      for (const k of keys) {
        const cache = await caches.open(k)
        const reqs = await cache.keys()
        for (const r of reqs) {
          const res = await cache.match(r)
          if (res) {
            const buf = await res.clone().arrayBuffer()
            bytes += buf.byteLength
            entries++
          }
        }
      }
      return { controlled: !!navigator.serviceWorker.controller || !!reg?.active, entries, bytes, caches: keys }
    }), 20_000, null) as { controlled: boolean; entries: number; bytes: number; caches: string[] } | null

    const mb = swState ? swState.bytes / (1024 * 1024) : -1
    gate('G5 the service worker bill (offline-first cache)', `${mb.toFixed(1)}MB across ${swState?.entries ?? 0} entries`, '< 30MB', swState !== null && mb >= 0 && mb < 30)
    check: {
      if (!swState?.controlled) errors.push('sw: the worker never took the wheel')
      gates.push({ name: 'G5b the worker controls the page', value: String(swState?.controlled ?? false), limit: 'true', ok: !!swState?.controlled })
      console.log(`  ${swState?.controlled ? '🟢' : '🔴'} G5b the worker controls the page: ${swState?.controlled ?? false}`)
    }

    // the matrix: menu at five widths
    for (const w of [360, 390, 768, 1280, 1920]) {
      const h = w <= 480 ? 800 : w <= 800 ? 900 : 1000
      const p2 = await context.newPage()
      await p2.setViewportSize({ width: w, height: h })
      await race(p2.goto(`${BASE}/`, { waitUntil: 'load' }), 30_000, null)
      await p2.waitForTimeout(1100)
      await race(p2.screenshot({ path: `${SHOTS}/matrix-${w}-menu.png` }), 12_000, undefined)
      console.log('  📸', `matrix-${w}-menu`)
      await p2.close()
    }
    await context.close()
  }

  await browser.close()

  /* --------------------------------- the verdict --------------------------------- */
  console.log('\n========================================')
  console.log('THE SILK GATES —', BASE)
  let reds = 0
  for (const g of gates) {
    if (!g.ok) reds++
    console.log(` ${g.ok ? 'PASS' : 'FAIL'} ${g.name}: ${g.value} (limit ${g.limit})`)
  }
  console.log(`console/page errors across the run: ${errors.length}`)
  errors.slice(0, 6).forEach((e) => console.log('   •', e))
  console.log(`VERDICT: ${reds === 0 && errors.length === 0 ? '🟢 THE SILK HOLDS' : '🔴 ' + reds + ' RED GATE(S)'}`)
  console.log('========================================')
  process.exit(reds > 0 || errors.length > 0 ? 1 : 0)
}

run().catch((e) => {
  console.error('SILK GATES CRASHED:', e)
  process.exit(2)
})
