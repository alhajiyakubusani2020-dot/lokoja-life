/**
 * LOKOJA LIFE — M23 W4 E2E: THE WORLD UI WITNESS
 * ----------------------------------------------
 * 1. the speedometer — forceDrive feeds the REAL pipeline
 *    (setDriveActive + reportDriveSpeed) and the cluster reads km/h
 * 2. the junction banner — standing at the AB way mouth raises
 *    NOW ENTERING AHMADU BELLO WAY
 * 3. the photo frame — V raises the thirds grid + the postcard mark
 * Every scene a FRESH context at 1280×800 on the prod build.
 * Run: E2E_BASE=http://localhost:3001 bun scripts/e2e-m23-w4.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m23-worldui-shots'
mkdirSync(SHOTS, { recursive: true })
const watchdog = setTimeout(() => { console.error('WATCHDOG'); process.exit(2) }, 560_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}
const allErrors: string[] = []
const settleWorld = async (page: import('playwright').Page): Promise<boolean> => {
  const t0 = Date.now()
  let lastOk = 0
  while (Date.now() - t0 < 60_000) {
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
const tp = async (page: import('playwright').Page, x: number, z: number): Promise<void> => {
  await race(page.evaluate(([tx, tz]) => {
    (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp(tx, tz)
  }, [x, z]), 5000, null)
  await page.waitForTimeout(900)
}
const run = async (): Promise<void> => {
  /* 1: the speedometer — real pipeline, three speeds */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('pageerror: ' + String(e).slice(0, 120)))
    page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 120)) })
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Musa Speedo').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1700)
    await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await settleWorld(page)
    await page.waitForTimeout(1800)
    await tp(page, -30, -60)
    await race(page.evaluate(() => {
      (window as unknown as { __lkl?: { forceDrive: (on: boolean, speed?: number) => void } }).__lkl?.forceDrive(true, 8.2)
    }), 5000, null)
    await page.waitForTimeout(1600)
    await page.screenshot({ path: `${SHOTS}/01-speedo-top.png`, timeout: 9000 }).catch(() => allErrors.push('shot 01'))
    console.log('📸 01-speedo-top')
    await race(page.evaluate(() => {
      (window as unknown as { __lkl?: { forceDrive: (on: boolean, speed?: number) => void } }).__lkl?.forceDrive(true, -1.4)
    }), 5000, null)
    await page.waitForTimeout(1300)
    await page.screenshot({ path: `${SHOTS}/02-speedo-reverse.png`, timeout: 9000 }).catch(() => allErrors.push('shot 02'))
    console.log('📸 02-speedo-reverse')
    await race(page.evaluate(() => {
      (window as unknown as { __lkl?: { forceDrive: (on: boolean, speed?: number) => void } }).__lkl?.forceDrive(false)
    }), 5000, null)
    await ctx.close(); await browser.close()
  }
  /* 2+3: the banner at the AB way mouth, then the photo frame */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('pageerror: ' + String(e).slice(0, 120)))
    page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 120)) })
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Musa Banner').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1700)
    await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await settleWorld(page)
    await page.waitForTimeout(1800)
    await tp(page, -11.0, -118.0) // the AB way plate sits at (-11, -114) — inside the 7u law
    await page.waitForTimeout(2200) // the poll must catch the crossing
    await page.screenshot({ path: `${SHOTS}/03-banner-entering.png`, timeout: 9000 }).catch(() => allErrors.push('shot 03'))
    console.log('📸 03-banner-entering')
    await page.keyboard.press('KeyV')
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${SHOTS}/04-photo-frame.png`, timeout: 9000 }).catch(() => allErrors.push('shot 04'))
    console.log('📸 04-photo-frame')
    await ctx.close(); await browser.close()
  }
  clearTimeout(watchdog)
  console.log(`errors: ${allErrors.length}`)
  allErrors.forEach((e) => console.log('⚠', e))
  if (allErrors.length > 0) process.exit(1)
  process.exit(0)
}
run().catch((e) => { console.error('CRASHED:', e); process.exit(2) })
