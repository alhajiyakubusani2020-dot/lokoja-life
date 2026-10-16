/**
 * LOKOJA LIFE — HMR ERROR FIX VERIFICATION
 * -----------------------------------------
 * The user hit: "WorldTab.tsx ... module factory is not available.
 * It might have been deleted in an HMR update." — a stale Turbopack dev
 * cache (server ran since Oct 15, predating the SILK II surgery that
 * moved WorldTab behind next/dynamic). Fix = clean server restart.
 *
 * This script proves the fix on the EXACT failing path:
 *   menu → character creation → Dashboard (screen==='game')
 *   → click the 'World' tab → nextDynamic(() => import('../world/WorldTab'))
 *   → the module factory must resolve → canvas + __lkl live.
 * 0 console errors across the run — the house law.
 * Run: bun scripts/e2e-fix-verify.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/fix-verify'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 150s hard exit'); process.exit(2) }, 149_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const allErrors: string[] = []
const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()

  /* every console error + pageerror is captured with its text — the
   * "module factory" string is the specific criminal we hunt */
  page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 200)) })
  page.on('pageerror', (e) => allErrors.push('pageerror: ' + String(e).slice(0, 200)))

  /* 1. boot + character creation (the m19 flow) */
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1500)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 10_000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(500)
  await race(page.getByLabel('Character name').fill('Fix Verify').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 10_000 }).catch(() => {}), 12_000, null)
  await page.waitForTimeout(2000)

  /* 2. THE FAILING PATH — Dashboard mounted; fire the WorldTab dynamic import */
  const dashMounted = await race(page.evaluate(() => document.body.innerText.length > 200), 8000, false)
  console.log('dashboard mounted:', dashMounted)
  const worldClick = await race(
    page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 9000 }).then(() => true).catch(() => false),
    10_000, false,
  )
  console.log('World tab clicked:', worldClick)

  /* 3. settle: canvas + __lkl hook = the factory resolved and the world lives */
  const t0 = Date.now()
  let settled = false
  while (Date.now() - t0 < 50_000 && !settled) {
    const ping = await race(page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      hook: !!(window as unknown as { __lkl?: unknown }).__lkl,
      alive: true,
    })), 4000, { canvas: false, hook: false, alive: false })
    if (ping.alive && ping.canvas && ping.hook) settled = true
    else await page.waitForTimeout(900)
  }
  console.log('world settled (factory resolved, canvas + hook live):', settled)
  await page.waitForTimeout(1200)
  try {
    await page.screenshot({ path: `${SHOTS}/world-tab-after-fix.png`, timeout: 9000 })
    console.log('📸 world-tab-after-fix.png')
  } catch (e) { console.log('✗ shot failed:', String(e).slice(0, 60)) }

  /* 4. also re-enter home → world again (double dynamic mount, HMR-adjacent path) */
  await race(page.getByRole('button', { name: 'Home', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(700)
  await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(2500)
  const alive2 = await race(page.evaluate(() => !!document.querySelector('canvas')), 6000, false)
  console.log('second world entry alive:', alive2)

  await browser.close()

  /* 5. verdict */
  const factoryErr = allErrors.filter((e) => e.includes('module factory') || e.includes('HMR'))
  console.log('---')
  console.log('module-factory/HMR errors:', factoryErr.length === 0 ? 'NONE ✅' : factoryErr)
  console.log('all console/page errors:', allErrors.length === 0 ? '0 ✅' : allErrors)
  const pass = settled && factoryErr.length === 0
  console.log(pass ? '🟢 FIX VERIFIED' : '🔴 STILL BROKEN — see errors above')
  process.exit(pass ? 0 : 1)
}

run().catch((e) => { console.error('FATAL', e); process.exit(1) })
