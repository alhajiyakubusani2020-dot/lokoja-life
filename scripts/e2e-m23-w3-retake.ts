/** M23 W3 retake: signal close-up, roundabout, school humps — precise spots */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m23-junction-shots'
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
const run = async (): Promise<void> => {
  const scenes: { name: string; tp: [number, number]; face: [number, number]; wait?: number }[] = [
    { name: '01c-signal-ultraclose', tp: [-13.0, -109.6], face: [1, -0.7] },
    { name: '03c-roundabout-edge', tp: [-51.5, 83.0], face: [0, -1] },
    { name: '04c-humps-on-road', tp: [-63.5, -27.5], face: [1.6, 2.6] },
  ]
  for (const sc of scenes) {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('pageerror: ' + String(e).slice(0, 120)))
    page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 120)) })
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Musa Retake').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1700)
    await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await settleWorld(page)
    await page.waitForTimeout(1800)
    await race(page.evaluate(([tx, tz]) => {
      (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp(tx, tz)
    }, sc.tp), 5000, null)
    await page.waitForTimeout(600)
    const len = Math.hypot(sc.face[0], sc.face[1])
    await race(page.evaluate(([ax, az]) => {
      (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(ax, az)
    }, [sc.face[0] / len, sc.face[1] / len]), 5000, null)
    await page.waitForTimeout(1300)
    await race(page.evaluate(() => {
      (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, 0)
    }), 5000, null)
    await page.waitForTimeout(800)
    let done = false
    for (let i = 0; i < 6 && !done; i++) {
      try { await page.screenshot({ path: `${SHOTS}/${sc.name}.png`, timeout: 9000 }); done = true; console.log(`📸 ${sc.name}`) }
      catch { await page.waitForTimeout(2500) }
    }
    if (!done) allErrors.push(`shot-failed: ${sc.name}`)
    await ctx.close(); await browser.close()
  }
  clearTimeout(watchdog)
  console.log(`errors: ${allErrors.length}`)
  if (allErrors.length > 0) { allErrors.forEach((e) => console.log('⚠', e)); process.exit(1) }
  process.exit(0)
}
run().catch((e) => { console.error('CRASHED:', e); process.exit(2) })
