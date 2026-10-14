import { chromium } from 'playwright'
const BASE = 'http://localhost:3000'
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}
const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.player.level = 5
    save.player.cash = 500000
    save.player.businesses = [{ id: 'kpata-stall', typeId: 'kpata-stall', level: 2, accrued: 3300, lastAccrualDay: save.world.day, openedDay: 1, lastCollectedAt: null }]
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }), 8000, 'eval-dead')
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  const clickTry = await race(page.locator('button[aria-label="Kpata Market"]').click({ force: true }).then(() => 'OK').catch((e) => 'FAIL:' + String(e).slice(0, 80)), 7000, 'race-dead')
  console.log('role click:', clickTry)
  const opened = await race(page.evaluate(() => document.body.innerText.includes('Your business here')), 6000, false)
  console.log('shopfront visible:', opened)
  const labels = await race(page.evaluate(() => Array.from(document.querySelectorAll('button[aria-label]')).map((b) => b.getAttribute('aria-label')).slice(0, 30)), 6000, [])
  console.log('aria labels:', JSON.stringify(labels))
  await browser.close().catch(() => {})
}
run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
