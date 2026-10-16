/** M21 — STAND-AT-STADIUM: the action board fires only when standing there. */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m21-gates-shots'
mkdirSync(SHOTS, { recursive: true })

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 150)) })
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 150)))

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 9000 })
  await page.waitForTimeout(800)
  await page.getByLabel('Character name').fill('Board Walker')
  await page.getByText('Start Life in Lokoja').first().click()
  await page.waitForTimeout(2600)
  // map → stadium sheet → travel (gate grace)
  await page.getByRole('button', { name: /^map$/i }).first().click()
  await page.waitForTimeout(1400)
  await page.getByText('Stadium', { exact: true }).first().click()
  await page.waitForTimeout(1400)
  await page.locator('button:has-text("min trip")').first().click()
  await page.waitForTimeout(1600)
  const gate = page.locator('button[data-testid="guest-enter"]')
  if (await gate.isVisible().catch(() => false)) {
    await gate.click()
    await page.waitForTimeout(2000)
    // the grace law: the gate cancels the trip — the player travels again by hand
    await page.getByText('Stadium', { exact: true }).first().click({ timeout: 8000 }).catch(() => null)
    await page.waitForTimeout(1200)
    await page.locator('button:has-text("min trip")').first().click({ timeout: 8000 }).catch(() => null)
  }
  // the travel overlay resolves in a few seconds — poll until it clears (m19 law)
  let arrived = false
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(800)
    const travelling = await page.evaluate(() => document.body.innerText.includes('Travelling')).catch(() => true)
    const where = await page.evaluate(() => document.body.innerText.includes('Township Stadium') && !document.body.innerText.includes('Travelling')).catch(() => false)
    if (!travelling && where) { arrived = true; break }
  }
  await page.waitForTimeout(1200)
  const where = await page.evaluate(() => document.body.innerText.match(/CURRENT LOCATION[\s\S]{0,40}/)?.[0]?.replace(/\n/g, ' ') ?? '(unknown)')
  console.log('WHERE:', where, '| arrived:', arrived)
  // we should be AT the stadium now — reopen its sheet
  await page.getByText('Stadium', { exact: true }).first().click({ timeout: 8000 }).catch(() => null)
  await page.waitForTimeout(1400)
  const vibe = await page.locator('[data-testid="loc-vibe-line"]').count()
  const actions = await page.locator('[data-testid^="loc-action-"]').count()
  console.log(`STANDING AT STADIUM: vibe rows=${vibe} action rows=${actions}`)
  await page.locator('[data-testid="loc-vibe-line"]').first().scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null)
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${SHOTS}/12-stadium-standing-board.png` })
  const boardText = await page.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 2200))
  console.log('--- BOARD TEXT ---'); console.log(boardText.slice(0, 1200))
  console.log(`ERRORS: ${errors.length}`)
  await browser.close()
  process.exit(errors.length === 0 ? 0 : 1)
}
run().catch((e) => { console.error('FATAL', e); process.exit(1) })
