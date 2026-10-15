/** Probe: does the Dashboard-chip claim jam the page? When? */
import { chromium, devices } from 'playwright'

const BASE = 'http://localhost:3000'
const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`  [console.${m.type()}]`, m.text().slice(0, 140)) })

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1400)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(400)
  await page.getByLabel('Character name').fill('Probe Kola').catch(() => {})
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(1600)
  console.log('t0: life started, probing thread liveness every 2s')
  for (let i = 0; i < 4; i++) {
    const t = Date.now()
    const ok = await page.evaluate(() => true).catch(() => null)
    console.log(`  pre-claim ping ${i}: ${ok !== null ? `${Date.now() - t}ms` : 'JAMMED'}`)
    await page.waitForTimeout(1500)
  }
  console.log('clicking claim-open…')
  const clicked = await page.getByTestId('claim-open').click({ timeout: 6000 }).then(() => true).catch((e) => { console.log('  claim-open failed:', String(e).slice(0, 80)); return false })
  console.log('clicked:', clicked)
  await page.waitForTimeout(800)
  for (let i = 0; i < 10; i++) {
    const t = Date.now()
    const ok = await page.evaluate(() => document.body.innerText.includes('Claim your name to keep going') || document.body.innerText.length > 0).catch(() => null)
    console.log(`  post-claim ping ${i}: ${ok !== null ? `${Date.now() - t}ms alive` : 'JAMMED'}`)
    await page.waitForTimeout(2000)
  }
  await browser.close().catch(() => {})
  process.exit(0)
}
run()
