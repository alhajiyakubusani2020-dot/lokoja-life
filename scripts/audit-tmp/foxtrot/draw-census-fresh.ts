// Foxtrot: draw-call census against the already-running dev server,
// using the installed playwright chromium 1200 binary (project playwright wants 1248).
import { chromium } from 'playwright'

const EXE = '/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell'
const BASE = process.env.CENSUS_BASE ?? 'http://localhost:3000'
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.addInitScript(() => {
    ;(window as unknown as Record<string, unknown>).__lklForceQuality = 'high'
  })
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20000, null)
  await page.waitForTimeout(1500)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 10000 }).catch(() => {}), 12000, null)
  await race(page.getByLabel('Character name').fill('Ada'), 15000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 10000 }).catch(() => {}), 12000, null)
  await race(page.getByText('Explore in 3D').first().click({ timeout: 30000 }).catch(() => {}), 35000, null)
  await page.waitForTimeout(15000)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)
  await page.waitForTimeout(1500)

  const stage = await race(page.evaluate(() => ({
    screen: document.body.innerText.slice(0, 90).replace(/\n+/g, '|'),
    hasR: typeof (window as any).__lklRenderer,
  })), 25000, null)
  console.log('stage:', JSON.stringify(stage))

  const info = await race(page.evaluate(() => {
    const gl = (window as any).__lklRenderer
    if (!gl) return null
    const i = gl.info
    return {
      calls: i.render.calls,
      triangles: i.render.triangles,
      geometries: i.memory.geometries,
      textures: i.memory.textures,
      programs: i.programs?.length ?? null,
      dpr: gl.getPixelRatio(),
    }
  }), 25000, null)
  console.log('renderer.info:', JSON.stringify(info))
  await browser.close().catch(() => {})
}

run().catch((e) => { console.error('failed', String(e).slice(0, 300)); process.exit(1) })
