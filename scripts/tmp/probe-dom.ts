import { chromium, devices } from 'playwright'
const BASE = 'http://localhost:3000'
const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1400)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(400)
  await page.getByLabel('Character name').fill('Probe Dom').catch(() => {})
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(1800)
  const dom = await page.evaluate(() => ({
    claimOpen: !!document.querySelector('[data-testid="claim-open"]'),
    guestChip: document.body.innerText.includes('Guest mode'),
    accountLine: !!document.querySelector('[data-testid="account-line"]'),
    dashHeads: Array.from(document.querySelectorAll('[data-testid]')).slice(0, 20).map((e) => e.getAttribute('data-testid')),
    hasGate: !!document.querySelector('[data-testid="guest-gate"]'),
  }))
  console.log(JSON.stringify(dom, null, 1))
  await browser.close().catch(() => {})
  process.exit(0)
}
run()
