/** desktop-only sunset shot (the phone flow lives in e2e-m19-polish.ts) */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m19-polish-shots'
mkdirSync(SHOTS, { recursive: true })
const allErrors: string[] = []

const watchdog = setTimeout(() => { console.error('WATCHDOG: 140s hard exit'); process.exit(2) }, 138_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const settle = async (page: import('playwright').Page, maxMs: number): Promise<boolean> => {
  const t0 = Date.now()
  let streak = 0
  while (Date.now() - t0 < maxMs) {
    const ping = await race(page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      hook: !!(window as unknown as { __lkl?: unknown }).__lkl,
      alive: true,
    })), 4000, { canvas: false, hook: false, alive: false })
    if (ping.alive && ping.canvas && ping.hook) {
      streak++
      if (streak >= 2) return true
    } else streak = 0
    await page.waitForTimeout(900)
  }
  return false
}

const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('pageerror', (e) => allErrors.push('desktop: ' + String(e).slice(0, 120)))
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'load' }), 20_000, null)
  await page.waitForTimeout(1200)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(400)
  await race(page.getByLabel('Character name').fill('Sunset Eye').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(2000)
  await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  const ok = await settle(page, 90_000)
  console.log('desktop settled:', ok)
  await race(page.evaluate(() => {
    const w = window as unknown as { __lkl?: { forceWeather: (w: string) => void; forceTime: (t: string) => void } }
    w.__lkl?.forceWeather('sunny')
    w.__lkl?.forceTime('evening')
  }), 8000, null)
  await page.waitForTimeout(4200)
  // progressive: the wedged compositor drops frames — last success wins
  let done = false
  for (let i = 0; i < 8 && !done; i++) {
    try {
      await page.screenshot({ path: `${SHOTS}/07-desktop-sunset.png`, timeout: 9000 })
      done = true
      console.log(`📸 07-desktop-sunset.png (attempt ${i + 1})`)
    } catch { await page.waitForTimeout(2500) }
  }
  if (!done) { allErrors.push('shot-failed: 07-desktop-sunset'); console.log('✗ 07 failed') }
  await race(browser.close().catch(() => {}), 8000, null)
  console.log('errors:', allErrors.length)
  process.exit(done ? 0 : 1)
}
run().catch((e) => { console.error('failed:', e); process.exit(1) })
