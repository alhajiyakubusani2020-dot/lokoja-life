/**
 * M23 W1 E2E — RETAKE PASS: three shots the first witness missed
 * (canopy-blocked plate, wrong-angle culvert, banner-blocked poles).
 * Same FRESH-CONTEXT LAW: every scene a brand-new GL context.
 * Run: E2E_BASE=http://localhost:3001 bun scripts/e2e-m23-w1-retake.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m23-corridor-shots'
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
      console.log(`📸 ${path.split('/').pop()}`)
    } catch { await page.waitForTimeout(2500) }
  }
  if (!done) { allErrors.push(`shot-failed: ${path}`) }
}

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

const tpFace = async (page: import('playwright').Page, x: number, z: number, dx: number, dz: number): Promise<void> => {
  await race(page.evaluate(([tx, tz]) => {
    (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp(tx, tz)
  }, [x, z]), 5000, null)
  await page.waitForTimeout(700)
  const len = Math.hypot(dx, dz) || 1
  await race(page.evaluate(([ax, az]) => {
    (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(ax, az)
  }, [dx / len, dz / len]), 5000, null)
  await page.waitForTimeout(2200)
  await race(page.evaluate(() => {
    (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, 0)
  }), 5000, null)
  await page.waitForTimeout(600)
}

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
  await race(page.getByLabel('Character name').fill('Musa Retake').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(1800)
  await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  const ok = await settleWorld(page, 60_000)
  console.log('fresh life settled:', ok)
  return { browser, ctx, page }
}

const run = async (): Promise<void> => {
  /* 02b: the plate close-up, further back to dodge the canopy */
  {
    const { browser, ctx, page } = await freshLife()
    await page.waitForTimeout(2000)
    await tpFace(page, -10.3, -99.0, 0.0, 1)
    await shot(page, `${SHOTS}/02b-plate-close.png`)
    await ctx.close(); await browser.close()
  }
  /* 03b: the culvert seen ALONG the artery */
  {
    const { browser, ctx, page } = await freshLife()
    await tpFace(page, -43.0, 136.0, 0.0, -1)
    await shot(page, `${SHOTS}/03b-culvert-along.png`)
    await ctx.close(); await browser.close()
  }
  /* 04b: the pole chain + catenary from under the wires */
  {
    const { browser, ctx, page } = await freshLife()
    await tpFace(page, -22.0, -158.0, 0.0, 1)
    await shot(page, `${SHOTS}/04b-pole-chain.png`)
    await ctx.close(); await browser.close()
  }
  /* 06b: Otukpo Road combo — culvert + pole + plate */
  {
    const { browser, ctx, page } = await freshLife()
    await tpFace(page, 72.0, 246.0, 0.1, 1)
    await shot(page, `${SHOTS}/06b-otukpo-combo.png`)
    await ctx.close(); await browser.close()
  }
  clearTimeout(watchdog)
  console.log(`\nconsole/page errors: ${allErrors.length}`)
  allErrors.forEach((e) => console.log('  ⚠ ' + e))
  if (allErrors.length > 0) process.exit(1)
  process.exit(0)
}

run().catch((e) => { console.error('E2E CRASHED:', e); process.exit(2) })
