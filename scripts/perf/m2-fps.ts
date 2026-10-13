/**
 * Minimal FPS probe — in-page rAF counter (the harness's sampler stalls
 * in this headless; counting inside the page works with the live canvas).
 * Scenario 1: idle at spawn. Scenario 2: walking. Desktop 1280×800.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const BASE = 'http://localhost:3000'
const OUT = '/home/z/my-project/research/m2-fps.json'

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 100)))

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 6000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByText('Explore in 3D').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(9000) // full world warmup
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)
  await page.waitForTimeout(1000)

  const sample = (ms: number) => race(page.evaluate((dur: number) => new Promise((resolve) => {
    let frames = 0
    let long50 = 0
    let last = performance.now()
    const t0 = last
    const tick = (t: number): void => {
      frames++
      const gap = t - last
      if (gap > 50) long50++
      last = t
      if (t - t0 < dur) requestAnimationFrame(tick)
      else resolve({ frames, fps: (frames * 1000) / (t - t0), long50 })
    }
    requestAnimationFrame(tick)
  }), ms), ms + 9000, { frames: -1, fps: -1, long50: -1 })

  const idle = await sample(10000)
  console.log('idle:', JSON.stringify(idle))

  // walk sample — hold the stick from Node while counting
  const walkPromise = sample(10000)
  for (let i = 0; i < 16; i++) {
    await race(page.evaluate(() => (window as any).__lkl?.stick?.(0, -1)), 2500, null)
    await page.waitForTimeout(560)
  }
  await race(page.evaluate(() => (window as any).__lkl?.stick?.(0, 0)), 2500, null)
  const walk = await walkPromise
  console.log('walk:', JSON.stringify(walk))

  const mem = await race(page.evaluate(() => (performance as any).memory?.usedJSHeapSize ?? null), 4000, null)

  const report = {
    ts: new Date().toISOString(),
    viewport: '1280x800 headless SwiftShader',
    caveat: 'software WebGL — absolute FPS lower than real devices; judge the ratio walk/idle',
    idle,
    walk,
    heapMB: typeof mem === 'number' ? Math.round(mem / 1048576) : null,
    consoleErrors: errors.length,
  }
  writeFileSync(OUT, JSON.stringify(report, null, 1))
  console.log('WROTE', OUT)
  await browser.close().catch(() => {})
}

run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
