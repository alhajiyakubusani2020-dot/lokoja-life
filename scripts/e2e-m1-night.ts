/**
 * M1 E2E night shot — nap until the world clock reads night (max 4 slots),
 * then a short walk along the market road for the sodium-glow screenshot.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m1-roads-shots'
mkdirSync(SHOTS, { recursive: true })

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)) })

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1600)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 8000 })
  await page.waitForTimeout(400)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 })
  await page.waitForTimeout(400)
  await page.getByText('Explore in 3D').first().click({ timeout: 8000 })
  await page.waitForTimeout(6000)

  // nap until night — honest clock slots only
  for (let i = 0; i < 4; i++) {
    const tod = await page.evaluate(() => (window as any).__lkl.timeOfDay())
    if (tod === 'night') break
    await page.evaluate(() => (window as any).__lkl.rest('nap'))
    await page.waitForTimeout(700)
  }
  console.log('clock now:', await page.evaluate(() => (window as any).__lkl.timeOfDay()))
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) { await skip.click({ force: true }).catch(() => {}); await page.waitForTimeout(700) }

  // walk along the road so the NEXT lamp stands ahead of the camera —
  // its sodium head + warm pool then enter the frame
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => (window as any).__lkl.stick(0, -1))
    await page.waitForTimeout(560)
  }
  await page.evaluate(() => (window as any).__lkl.stick(0, 0))
  await page.waitForTimeout(2400)
  await page.screenshot({ path: `${SHOTS}/04-street-night.png` })
  await browser.close().catch(() => {})
  console.log('console errors:', errors.length)
  console.log('NIGHT SHOT DONE')
}

run().catch((e) => {
  console.error('failed:', String(e).slice(0, 160))
  process.exit(1)
})
