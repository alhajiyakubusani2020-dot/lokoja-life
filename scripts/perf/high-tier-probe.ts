/** HIGH-TIER forced probe: override navigator.deviceMemory=8 so the app takes
 *  the 'high' path (shadows + governor + AA). Reports fps AND renderer.info. */
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
      else resolve({ n, fps: Math.round((n * 1000) / (t - t0) * 100) / 100 })
    }
    requestAnimationFrame(tick)
  }), ms), ms + 25000, { n: -1, fps: -1 })

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8, configurable: true })
  })
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await race(page.getByLabel('Character name').fill('Ada'), 15000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await race(page.getByText('Explore in 3D').first().click({ timeout: 30000 }).catch(() => {}), 33000, null)
  await page.waitForTimeout(14000)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)
  await page.waitForTimeout(1500)

  const info = await race(page.evaluate(() => {
    const gl = (window as any).__lklRenderer
    if (!gl) return { hook: false }
    return {
      hook: true,
      calls: gl.info.render.calls,
      tris: gl.info.render.triangles,
      geos: gl.info.memory.geometries,
      texs: gl.info.memory.textures,
      programs: gl.info.programs?.length ?? 0,
      dpr: gl.getPixelRatio(),
      shadowAuto: gl.shadowMap.autoUpdate,
    }
  }), 25000, null)
  console.log('info:', JSON.stringify(info))

  const idle = await rafProbe(page, 8000)
  console.log('idle(high):', JSON.stringify(idle))
  await browser.close().catch(() => {})
}

run().catch((e) => { console.error('failed', String(e).slice(0, 200)); process.exit(1) })
