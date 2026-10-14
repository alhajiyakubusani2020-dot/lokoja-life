/** debug: does the marker click open the sheet at all? full-text dump. */
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
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0, 120)) })
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
    const save = JSON.parse(localStorage.getItem('lokoja-life:save')!)
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
  await race(page.evaluate(() => (document.querySelector('button[aria-label="Kpata Market"]') as HTMLButtonElement)?.click()), 6000, null)
  await page.waitForTimeout(1000)
  const state = await race(page.evaluate(() => ({
    sheetOpen: !!document.querySelector('[aria-label="Kpata Market details"]'),
    tail: document.body.innerText.slice(-450).replace(/\n+/g, '|'),
  })), 8000, null)
  console.log('sheetOpen:', state?.sheetOpen)
  console.log('tail:', state?.tail)
  await browser.close().catch(() => {})
}

run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
