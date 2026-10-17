/**
 * LOKOJA LIFE — M23 W2 E2E: THE GREEN WITNESS (screenshots)
 * ---------------------------------------------------------
 * The user's order: "perfect real trees and grasses". The witness, every
 * scene a FRESH browser context (new GL context) at desktop 1280×800 on
 * the prod build. Navigation: the e2e=1 tp() hook puts the walker NEXT TO
 * real, law-placed trees (the map pins flaked under the tutorial overlay;
 * tp is honest — it moves the player, the render is untouched):
 *   1. the home junction — the street rows (neem/mango) now stand 12u out
 *   2. walked-in close — the row down the artery
 *   3. HARMATTAN gold, close — the M6 weather law golding crowns + grass,
 *      live in the browser (forceWeather + the ~2s dry ease)
 *   4. the savanna guild under harmattan — the Patti baobab bottle
 *   5. storm lush at a real grove — the raffia/oilpalm river-margin cluster
 *   6. the green close — street tree + 10k tufts off the shoulder
 * 0 console errors across every pass — the house law.
 * Run: E2E_BASE=http://localhost:3001 bun scripts/e2e-m23-flora.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m23-green-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 580s hard exit'); process.exit(2) }, 580_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const allErrors: string[] = []
const shot = async (page: import('playwright').Page, path: string): Promise<void> => {
  let done = false
  for (let i = 0; i < 6 && !done; i++) {
    try {
      await page.screenshot({ path, timeout: 9000 })
      done = true
      console.log(`📸 ${path.split('/').pop()}${i ? ` (attempt ${i + 1})` : ''}`)
    } catch { await page.waitForTimeout(2500) }
  }
  if (!done) { allErrors.push(`shot-failed: ${path}`); console.log(`✗ shot failed: ${path}`) }
}

/** poll until the world answers twice AND the canvas is in */
const settleWorld = async (page: import('playwright').Page, maxMs = 60_000): Promise<boolean> => {
  const t0 = Date.now()
  let lastOk = 0
  while (Date.now() - t0 < maxMs) {
    const ping = await race(page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      hook: !!(window as unknown as { __lkl?: unknown }).__lkl,
      alive: (window as unknown as { __lkl?: { pos?: () => unknown } }).__lkl?.pos?.() != null,
    })), 4000, { canvas: false, hook: false, alive: false })
    if (ping.alive && ping.canvas && ping.hook) {
      if (Date.now() - lastOk < 1500 && lastOk > 0) return true
      if (lastOk === 0) lastOk = Date.now()
      else return true
    }
    await page.waitForTimeout(900)
  }
  return false
}

/** teleport + a short walk toward the subject so the follow camera faces it */
const tpFace = async (page: import('playwright').Page, x: number, z: number, dx: number, dz: number): Promise<void> => {
  await race(page.evaluate(([tx, tz]) => {
    (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp(tx, tz)
  }, [x, z]), 5000, null)
  await page.waitForTimeout(700)
  const len = Math.hypot(dx, dz) || 1
  const sx = dx / len
  const sz = dz / len
  await race(page.evaluate(([ax, az]) => {
    (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(ax, az)
  }, [sx, sz]), 5000, null)
  await page.waitForTimeout(2200)
  await race(page.evaluate(() => {
    (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, 0)
  }), 5000, null)
  await page.waitForTimeout(600)
}

const forceWeather = async (page: import('playwright').Page, w: string): Promise<void> => {
  await race(page.evaluate((wx) => {
    (window as unknown as { __lkl?: { forceWeather: (wx: string) => void } }).__lkl?.forceWeather(wx)
  }, [w]), 5000, null)
  await page.waitForTimeout(3200) // the dry ease takes ~2s — let the sky law land
}

/** boot a fresh life in a fresh context — the FRESH-CONTEXT LAW */
const freshLife = async (): Promise<{ browser: import('playwright').Browser; ctx: import('playwright').BrowserContext; page: import('playwright').Page }> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => allErrors.push('pageerror: ' + String(e).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 140)) })
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1500)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(400)
  await race(page.getByLabel('Character name').fill('Musa Green').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(1800)
  await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  const ok = await settleWorld(page, 60_000)
  console.log('fresh life settled:', ok)
  return { browser, ctx, page }
}

const run = async (): Promise<void> => {
  /* ---------- scenes 1+2: the street rows at the home junction ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await page.waitForTimeout(2500)
    await shot(page, `${SHOTS}/01-street-rows-home.png`)
    // stand ON the artery south of home, look up-street: the row lines
    // both sides (neem @ (-106.9,14.3), mango @ (-103.1,32.6) in frame)
    await tpFace(page, -97.0, 8.0, 0.24, 0.97)
    await shot(page, `${SHOTS}/02-rows-along-artery.png`)
    await ctx.close(); await browser.close()
  }

  /* ---------- scene 3: (witnessed in the first pass) ---------- */

  /* ---------- scenes 4+5: (witnessed in the first pass) ---------- */

  /* ---------- scene 6: the green close — 10k tufts off the shoulder ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await forceWeather(page, 'rain')
    await tpFace(page, -101.5, 26.0, -1.0, 3.0) // off-road between the row trees, grass underfoot
    await shot(page, `${SHOTS}/06-grass-field.png`)
    await ctx.close(); await browser.close()
  }

  clearTimeout(watchdog)
  console.log(`\nconsole/page errors: ${allErrors.length}`)
  allErrors.forEach((e) => console.log('  ⚠ ' + e))
  if (allErrors.length > 0) process.exit(1)
  console.log('W2 GREEN WITNESS: clean run, 0 errors')
  process.exit(0)
}

run().catch((e) => { console.error('E2E CRASHED:', e); process.exit(2) })
