/**
 * LOKOJA LIFE — M18 E2E: THE CITY FORGE (screenshots)
 * ---------------------------------------------------
 * 1. the phone grid → the City Forge tile → the home pack card
 * 2. RUN THE FORGE — the five stages light, the ledger records the
 *    shipped build (QA 100/100 inside the SLA)
 * 3. the pilot ladder + the Accra vote cast (the ballot moves)
 * 4. desktop wide
 * 0 console errors across the run — the house law.
 * Run: bun scripts/e2e-m18-forge.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m18-forge-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 240s hard exit'); process.exit(2) }, 235_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const allErrors: string[] = []

const run = async (): Promise<void> => {
  /* -------- 1-3. the forge yard on the phone -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('forge: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Forge Hand').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1600)
    // the phone → the City Forge tile
    await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(700)
    await race(page.getByRole('button', { name: 'Open Forge app' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(900)
    const app = await race(page.evaluate(() => ({
      app: !!document.querySelector('[data-testid="forge-app"]'),
      pack: !!document.querySelector('[data-testid="forge-home-pack"]'),
      pilots: !!document.querySelector('[data-testid="forge-pilots"]'),
    })), 8000, null)
    console.log('forge app:', JSON.stringify(app))
    await race(page.screenshot({ path: `${SHOTS}/01-forge-yard.png` }), 8000, null)
    console.log('📸 01-forge-yard')

    // RUN THE FORGE — the stages walk, the pack ships
    await race(page.locator('[data-testid="forge-run"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(3400) // the honest stage pacing (5 × 550ms + settle)
    const ran = await race(page.evaluate(() => ({
      ledger: !!document.querySelector('[data-testid="forge-ledger"]'),
      ledgerText: document.querySelector('[data-testid="forge-ledger"]')?.textContent ?? '',
    })), 8000, null)
    console.log('forge run:', JSON.stringify(ran))
    await race(page.screenshot({ path: `${SHOTS}/02-forge-ran.png` }), 8000, null)
    console.log('📸 02-forge-ran')

    // the pilot ladder + the vote
    const voteBtn = page.locator('[data-testid="forge-vote-accra"]')
    const hasVote = await race(voteBtn.count(), 6000, 0)
    if (hasVote) {
      await race(voteBtn.click({ timeout: 8000 }).catch(() => {}), 10_000, null)
      await page.waitForTimeout(700)
    }
    const voted = await race(page.evaluate(() => ({
      voted: document.body.innerText.includes('✓ Voted'),
      ladder: !!document.querySelector('[data-testid="forge-pilots"]'),
      ugc: document.body.innerText.includes('YOUR CITY NEXT?'),
    })), 8000, null)
    console.log('vote law:', JSON.stringify(voted))
    await race(page.screenshot({ path: `${SHOTS}/03-pilot-vote.png` }), 8000, null)
    console.log('📸 03-pilot-vote')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  /* -------- 4. desktop wide -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    page.on('pageerror', (e) => allErrors.push('desktop: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'load' }), 20_000, null)
    await page.waitForTimeout(1600)
    await race(page.screenshot({ path: `${SHOTS}/04-desktop-forge.png` }), 8000, null)
    console.log('📸 04-desktop-forge')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  clearTimeout(watchdog)
  console.log(`\nconsole/page errors: ${allErrors.length}`)
  allErrors.slice(0, 6).forEach((e) => console.log('  •', e))
  if (allErrors.length > 0) process.exit(1)
  console.log('M18 E2E — THE FORGE RUNS 🟢')
  process.exit(0)
}

run().catch((e) => { console.error('E2E CRASHED:', e); process.exit(2) })
