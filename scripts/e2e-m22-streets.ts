/**
 * LOKOJA LIFE — M22 E2E: THE STREETS WITNESS (screenshots)
 * --------------------------------------------------------
 * The user's order: "build all the cars the bikes the things needed and
 * the roads perfect them… make the street light look very real and
 * positioned correctly in where they are suppose to be".
 *
 * The witness, every shot FRESH-CONTEXT, desktop 1280×800, prod build:
 *   1. the motor park — the parked lorry + danfo + okada + taxi fleet
 *   2. the artery street — swan-neck street lamps + concrete kerbs
 *   3. walking to the junction — the zebra crossing bands
 *   4. NIGHT — the sodium lenses glowing, warm pools on the tarmac
 *   5. the highway mast row — tall masts reaching over the carriageway
 * 0 console errors across the run — the house law.
 * Run: E2E_BASE=http://localhost:3001 bun scripts/e2e-m22-streets.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m22-streets-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 288s hard exit'); process.exit(2) }, 287_000)
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

/** map-travel to a location and enter the world tab */
const travelTo = async (page: import('playwright').Page, pinText: string): Promise<boolean> => {
  await race(page.getByRole('button', { name: /^map$/i }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(1400)
  // the MAP PIN's label is the visible shortName — clicking the atlas text does nothing.
  // force:true — overlapping pin labels intercept real pointers (Ganaja sits under 'P')
  const marker = page.getByText(pinText, { exact: true }).first()
  const ok = await race(marker.click({ timeout: 8000, force: true }).then(() => true).catch(() => false), 9000, false)
  if (!ok) { console.log(`✗ pin '${pinText}' not clickable`); return false }
  await page.waitForTimeout(1400)
  const tripRow = page.locator('button:has-text("min trip")').first()
  const walkRow = page.getByRole('button', { name: /walk/i }).first()
  const tripOk = await race(tripRow.click({ timeout: 6000 }).then(() => true).catch(() => false), 8000, false)
  if (!tripOk) await race(walkRow.click({ timeout: 6000 }).catch(() => {}), 8_000, null)
  // THE GUEST GATE: travel beyond the starter trio stands behind the claim
  const gateEnter = page.locator('button[data-testid="guest-enter"]')
  if (await race(gateEnter.isVisible(), 5000, false)) {
    await race(gateEnter.click({ timeout: 8000 }).catch(() => {}), 9000, null)
    console.log('guest gate entered')
    // THE M21 LESSON: the gate law CANCELS the trip — re-click the pin +
    // trip row now that the grace is active, the travel then lands
    await page.waitForTimeout(1200)
    await race(marker.click({ timeout: 8000 }).then(() => true).catch(() => false), 9000, false)
    await page.waitForTimeout(1200)
    await race(tripRow.click({ timeout: 6000 }).then(() => true).catch(() => false), 8000, false)
  } else {
    const maybe = page.locator('[data-testid="gate-maybe"]')
    if (await race(maybe.count(), 4000, 0)) await race(maybe.click({ timeout: 8000 }).catch(() => {}), 9000, null)
  }
  for (let i = 0; i < 45; i++) {
    const busy = await race(page.evaluate(() => document.body.innerText.includes('Travelling')), 5000, true)
    if (!busy) break
    await page.waitForTimeout(800)
  }
  await page.waitForTimeout(1400)
  await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  return settleWorld(page, 55_000)
}

const run = async (): Promise<void> => {
  /* ---------- 1. boot a fresh life, desktop ---------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('desktop: ' + String(e).slice(0, 120)))
    page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 120)) })

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
    await page.waitForTimeout(1500)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Musa Driver').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1800)
    console.log('life started')

    /* ---------- 2. the motor park: the parked fleet ---------- */
    const parked = await travelTo(page, 'Motor Park')
    console.log('transport-area world settled:', parked)
    await page.waitForTimeout(2500)
    await shot(page, `${SHOTS}/01-motor-park-fleet.png`)

    /* ---------- 3. walk the artery: lamps + kerbs ---------- */
    // a few seconds of walking forward puts the street furniture in frame
    await page.evaluate(() => (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, -1))
    await page.waitForTimeout(4200)
    await page.evaluate(() => (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, 0))
    await page.waitForTimeout(900)
    await shot(page, `${SHOTS}/02-artery-lamps-kerbs.png`)

    /* ---------- 4. night: the sodium lenses + pools ---------- */
    for (let i = 0; i < 8; i++) {
      const tod = await race(page.evaluate(() =>
        (window as unknown as { __lkl?: { timeOfDay: () => string } }).__lkl?.timeOfDay() ?? 'morning'), 5000, 'morning')
      if (tod === 'night') break
      await race(page.evaluate(() =>
        (window as unknown as { __lkl?: { rest: (k: string) => void } }).__lkl?.rest('nap')), 5000, null)
      await page.waitForTimeout(900)
    }
    const tod = await race(page.evaluate(() =>
      (window as unknown as { __lkl?: { timeOfDay: () => string } }).__lkl?.timeOfDay() ?? '?'), 5000, '?')
    console.log('clock now:', tod)
    await page.waitForTimeout(2200)
    await shot(page, `${SHOTS}/03-street-night-lamps.png`)

    await ctx.close()
    await browser.close()
  }

  /* ---------- 5. fresh context: the highway mast row by day ---------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('day2: ' + String(e).slice(0, 120)))
    page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console2: ' + m.text().slice(0, 120)) })

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
    await page.waitForTimeout(1500)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Ganaja Walker').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1800)

    const junction = await travelTo(page, 'Ganaja Junction') || await travelTo(page, 'Ganaja')
    console.log('ganaja-junction world settled:', junction)
    await page.waitForTimeout(2500)
    await shot(page, `${SHOTS}/04-ganaja-junction-day.png`)

    // step out toward the highway to catch the tall mast row + traffic
    await page.evaluate(() => (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, -1))
    await page.waitForTimeout(3200)
    await page.evaluate(() => (window as unknown as { __lkl?: { stick: (x: number, y: number) => void } }).__lkl?.stick(0, 0))
    await page.waitForTimeout(900)
    await shot(page, `${SHOTS}/05-highway-masts.png`)

    const worldErrors = allErrors.filter((e) => !e.includes('favicon'))
    console.log(`console errors: ${worldErrors.length}`)
    worldErrors.slice(0, 5).forEach((e) => console.log('  ERR:', e))

    await ctx.close()
    await browser.close()
  }

  clearTimeout(watchdog)
  const clean = allErrors.filter((e) => !e.includes('favicon')).length === 0
  console.log(clean ? 'WITNESS: CLEAN ✓' : 'WITNESS: ERRORS ✗')
  process.exit(clean ? 0 : 1)
}

run().catch((e) => { console.error('E2E crash:', e); process.exit(2) })
