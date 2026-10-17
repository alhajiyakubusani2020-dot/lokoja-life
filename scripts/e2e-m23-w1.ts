/**
 * LOKOJA LIFE — M23 W1 E2E: THE CORRIDOR WITNESS (screenshots)
 * -----------------------------------------------------------
 * The user's order: "perfect roads perfect roads sides". The witness,
 * every scene a FRESH browser context (new GL context) at desktop
 * 1280×800 on the prod build, each shot EYEBALLED by the operator:
 *   1. the Ahmadu Bello way corridor — drains in the verge, plates at
 *      the mouth, the rebuilt NEPA skyline above
 *   2. plate close-up — a real OSM name reads off the blue plate
 *   3. the box culvert where a side road crosses the channel
 *   4. the pole line + true-catenary wires, low sun
 *   5. night — the same corridor under the sodium lamps
 *   6. Lokoja-Otukpo Road — plate + culvert + wires in one frame
 * 0 console errors across every pass — the house law.
 * Run: E2E_BASE=http://localhost:3001 bun scripts/e2e-m23-w1.ts
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
      console.log(`📸 ${path.split('/').pop()}${i ? ` (attempt ${i + 1})` : ''}`)
    } catch { await page.waitForTimeout(2500) }
  }
  if (!done) { allErrors.push(`shot-failed: ${path}`); console.log(`✗ shot failed: ${path}`) }
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

const night = async (page: import('playwright').Page): Promise<void> => {
  for (let i = 0; i < 10; i++) {
    const tod = await race(page.evaluate(() => {
      return (window as unknown as { __lkl?: { timeOfDay?: () => string } }).__lkl?.timeOfDay?.() ?? 'morning'
    }), 5000, 'morning')
    if (tod === 'night') return
    await race(page.evaluate(() => {
      (window as unknown as { __lkl?: { rest: (k: string) => void } }).__lkl?.rest('nap')
    }), 5000, null)
    await page.waitForTimeout(900)
  }
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
  await race(page.getByLabel('Character name').fill('Musa Corridor').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(1800)
  await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  const ok = await settleWorld(page, 60_000)
  console.log('fresh life settled:', ok)
  return { browser, ctx, page }
}

const run = async (): Promise<void> => {
  /* ---------- 1+2: the AB way corridor + the plate close-up ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await page.waitForTimeout(2500)
    await tpFace(page, -11.0, -124.0, 0.05, 1) // walk north up Ahmadu Bello way
    await shot(page, `${SHOTS}/01-ab-way-corridor.png`)
    await tpFace(page, -10.3, -93.0, 0.0, 1) // approach the plate from the south
    await shot(page, `${SHOTS}/02-plate-ahmadu-bello.png`)
    await ctx.close(); await browser.close()
  }

  /* ---------- 3: the culvert under the side road ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await tpFace(page, -43.0, 114.0, 0.0, 1)
    await shot(page, `${SHOTS}/03-culvert-crossing.png`)
    await ctx.close(); await browser.close()
  }

  /* ---------- 4: the NEPA skyline, low angle ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await tpFace(page, -100.0, 12.0, 0.0, 1)
    await shot(page, `${SHOTS}/04-poles-catenary.png`)
    await ctx.close(); await browser.close()
  }

  /* ---------- 5: night — the corridor under the sodium lamps ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await night(page)
    await tpFace(page, -11.0, -124.0, 0.05, 1)
    await shot(page, `${SHOTS}/05-corridor-night.png`)
    await ctx.close(); await browser.close()
  }

  /* ---------- 6: Lokoja-Otukpo Road — plate + culvert + wires ---------- */
  {
    const { browser, ctx, page } = await freshLife()
    await tpFace(page, 67.0, 252.0, 0.15, 1)
    await shot(page, `${SHOTS}/06-otukpo-road.png`)
    await ctx.close(); await browser.close()
  }

  clearTimeout(watchdog)
  console.log(`\nconsole/page errors: ${allErrors.length}`)
  allErrors.forEach((e) => console.log('  ⚠ ' + e))
  if (allErrors.length > 0) process.exit(1)
  console.log('W1 CORRIDOR WITNESS: clean run, 0 errors')
  process.exit(0)
}

run().catch((e) => { console.error('E2E CRASHED:', e); process.exit(2) })
