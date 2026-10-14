/** Focused diagnostic — why doesn't the 2D travel→sheet flow open the festival panel? */
import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  page.on('pageerror', (e) => console.log('PAGEERROR:', String(e).slice(0, 120)))
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE:', m.text().slice(0, 120)) })

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(300)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1100)

  // patch: day 37 regatta, linked, at home
  await page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    const save = JSON.parse(raw!)
    save.version = 11
    save.player.level = 2
    save.player.cash = 150000
    save.player.needs = { health: 100, energy: 100, hunger: 80, mood: 70 }
    save.world = { day: 37, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' }
    save.account = { linked: true, handle: 'ada', token: 't', ageBand: 'adult', gateGraceDay: 0 }
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
  })
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1400)

  console.log('--- after continue ---')
  console.log(await race(page.evaluate(() => document.body.innerText.slice(0, 260).replace(/\n/g, ' | ')), 6000, ''))

  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  console.log('--- on map ---')
  console.log(await race(page.evaluate(() => ({
    pins: Array.from(document.querySelectorAll('button[aria-label]')).map((b) => b.getAttribute('aria-label')).slice(0, 12),
  })), 6000, null))

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
    if (el) el.click()
  })
  await page.waitForTimeout(900)
  console.log('--- sheet open? ---')
  console.log(await race(page.evaluate(() => ({
    text: document.body.innerText.slice(0, 500).replace(/\n/g, ' | '),
    buttons: Array.from(document.querySelectorAll('button')).map((b) => (b.textContent ?? '').trim().slice(0, 30)).filter(Boolean).slice(0, 18),
  })), 6000, null))

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const row = btns.find((b) => /min/.test(b.textContent ?? '') && /Walk|Keke|Taxi/.test(b.textContent ?? ''))
    console.log('ROW FOUND:', row ? (row.textContent ?? '').slice(0, 60) : 'NONE')
    if (row) row.click()
  })
  await page.waitForTimeout(3000)
  console.log('--- after travel ---')
  console.log(await race(page.evaluate(() => document.body.innerText.slice(0, 200).replace(/\n/g, ' | ')), 6000, ''))
  // re-open the sheet on the arrival pin
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
    if (el) el.click()
  })
  await page.waitForTimeout(1100)
  console.log('--- sheet reopened? ---')
  console.log(await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      panel: !!document.querySelector('[data-testid="festival-panel"]'),
      attend: !!document.querySelector('[data-testid="festival-attend"]'),
      alreadyHere: t.includes('You are already here'),
      travelTo: t.includes('Travel to'),
      calendar: t.includes('The Calendar'),
      tail: t.slice(-500).replace(/\n/g, ' | '),
    }
  }), 6000, null))
  await browser.close()
}

run().then(() => process.exit(0)).catch((e) => { console.error(String(e).slice(0, 300)); process.exit(1) })
