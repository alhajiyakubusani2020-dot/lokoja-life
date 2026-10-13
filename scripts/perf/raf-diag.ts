/** rAF diagnostic: does requestAnimationFrame tick in this headless at all?
 *  Menu page (no 3D) vs world page, both at mobile + desktop viewports. */
import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const rafProbe = (page: import('playwright').Page, ms: number) =>
  race(page.evaluate((dur: number) => new Promise((resolve) => {
    let n = 0
    const t0 = performance.now()
    const tick = (t: number): void => {
      n++
      if (t - t0 < dur) requestAnimationFrame(tick)
      else resolve({ n, fps: Math.round((n * 1000) / (t - t0) * 10) / 10 })
    }
    requestAnimationFrame(tick)
  }), ms), ms + 8000, { n: -1, fps: -1 })

const run = async (): Promise<void> => {
  for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const page = await browser.newPage({ viewport: vp })
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1200)
    const menu = await rafProbe(page, 2000)
    // enter world
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(300)
    await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 6000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(300)
    await race(page.getByText('Explore in 3D').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(9000)
    const skip = page.getByText('Skip', { exact: true }).first()
    if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)
    await page.waitForTimeout(800)
    const world = await rafProbe(page, 4000)
    console.log(`${vp.width}x${vp.height}  menu:`, JSON.stringify(menu), ' world:', JSON.stringify(world))
    await browser.close().catch(() => {})
  }
}

run().catch((e) => { console.error('failed', String(e).slice(0, 200)); process.exit(1) })
