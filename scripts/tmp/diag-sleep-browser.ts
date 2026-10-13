import { chromium } from 'playwright'
const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 150)))
  await page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1300)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 6000 })
  await page.waitForTimeout(350)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 })
  await page.waitForTimeout(1800)
  // find the sleep button honestly
  const btns = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button')).map((b) => b.textContent?.trim().slice(0, 30)).filter((t) => t && /sleep/i.test(t)),
  )
  console.log('sleep-ish buttons:', JSON.stringify(btns))
  const clicked = await page.getByRole('button', { name: /Sleep/i }).first().click({ timeout: 4000 }).then(() => 'clicked').catch((e) => 'miss: ' + String(e).slice(0, 80))
  console.log('sleep click:', clicked)
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(300)
    const s = await page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
      const toast = document.body.innerText.match(/Day \d+ begins/)?.[0] ?? null
      return { day: r.world?.day, toast }
    })
    console.log(`t+${(i + 1) * 300}ms`, JSON.stringify(s))
  }
  console.log('pageerrors:', errors.length, errors.slice(0, 2))
  await browser.close()
}
run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
