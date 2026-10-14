/**
 * M5 E2E — WORK & FLEET, live on the real game (2D surfaces; the 3D world
 * opens the SAME shared LocationSheet, so the board rides both).
 * Save-patch carries Ada to Level 5 with ₦600k, an okada in the garage and
 * a Kpata stall on her books, spawned INSIDE the Motor Park:
 *   1. Park sheet — the gig board (Run to … rows, fuel/energy/payout law)
 *   2. Run a gig — fuel + fare ledgered, clock advanced, dropped at the
 *      destination, the row falls off the board, done-gig double-run-proof
 *   3. Kpata sheet — staff hire (cap law, wage line)
 *   4. Solar install — the ☀️ fitted chip
 *   5. Phone → My Biz — the same staff/power controls, remote
 *   6. Map legend — the fleet line
 * Every CDP call raced; DOM-level clicks only (M3/M4 lesson).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m5-fleet-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 150s hard exit')
  process.exit(2)
}, 170_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const clickMarker = (page: import('playwright').Page, name: string) => {
  return page.evaluate((n) => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith(n)) as HTMLButtonElement | null
    if (!el) return 'no-marker'
    el.click()
    return 'clicked'
  }, name)
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // 1. fresh game → autosave → reload → patch the IDLE menu page
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  const patch = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.player.level = 5
    save.player.cash = 600000
    save.player.needs.energy = 100
    save.player.vehicles = [{ id: 'okada-e2e', model: 'okada', plate: 'LKO-419-AA', boughtDay: save.world.day }]
    save.player.businesses = [{
      id: 'kpata-stall', typeId: 'kpata-stall', level: 2, accrued: 1200,
      lastAccrualDay: save.world.day, openedDay: save.world.day, lastCollectedAt: null,
      staff: 0, upgrades: [],
    }]
    save.world.currentLocation = 'transport-area' // spawn inside the park
    save.world.weather = 'sunny'
    save.fleet = { day: save.world.day, done: [] }
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }), 8000, 'eval-dead')
  console.log('save patch:', patch)

  // 2. continue → Map → Motor Park sheet: the gig board
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  console.log('park marker:', await race(clickMarker(page, 'Motor Park'), 8000, 'eval-dead'))
  await page.waitForTimeout(800)
  const board = await race(page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('[data-testid^="gig-"]')) as HTMLElement[]
    return {
      count: rows.length,
      labels: rows.map((r) => r.textContent?.slice(0, 60) ?? ''),
      boardTitle: document.body.innerText.includes('Driver gigs today'),
      emptyNote: document.body.innerText.includes('No ride in your garage'),
    }
  }), 8000, null)
  console.log('gig board:', JSON.stringify(board))
  // scroll the sheet so the board is in frame for the shot
  await race(page.evaluate(() => {
    const scroller = document.querySelector('.lko-sheet .overflow-y-auto') as HTMLElement | null
      ?? (document.querySelector('[role="dialog"] > div > div') as HTMLElement | null)
    if (scroller) scroller.scrollTop = scroller.scrollHeight + 200
  }), 6000, null)
  await page.waitForTimeout(600)
  await race(page.screenshot({ path: `${SHOTS}/01-park-gig-board.png` }), 8000, null)

  // 3. RUN the first gig — fuel + fare, clock, drop-off, done-ledger
  const gigId = await race(page.evaluate(() => (document.querySelector('[data-testid^="gig-"]') as HTMLElement | null)?.getAttribute('data-testid') ?? null), 6000, null)
  console.log('running gig:', gigId)
  await race(page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`) as HTMLElement | null
    el?.click()
  }, gigId ?? ''), 6000, null)
  await page.waitForTimeout(700) // the working overlay window
  await race(page.screenshot({ path: `${SHOTS}/02-gig-driving.png` }), 8000, null)
  await page.waitForTimeout(2400) // settle
  const runProof = await race(page.evaluate((id) => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    const coreId = (id ?? '').replace('gig-', '')
    return {
      at: s?.world?.currentLocation ?? null,
      gigTx: s?.player?.transactions?.find((t: { label?: string }) => (t.label ?? '').startsWith('Gig — ')) ?? null,
      fuelTx: s?.player?.transactions?.find((t: { label?: string }) => (t.label ?? '').includes('(gig)')) ?? null,
      fleetDone: s?.fleet?.done ?? [],
      stillOffered: !!(document.querySelector(`[data-testid="${id}"]`)),
      coreId,
    }
  }, gigId ?? ''), 8000, null)
  console.log('gig proof:', JSON.stringify(runProof))
  await race(page.screenshot({ path: `${SHOTS}/03-gig-done.png` }), 8000, null)

  // 4. Kpata Market sheet — staff hire on the BizBlock
  console.log('kpata marker:', await race(clickMarker(page, 'Kpata Market'), 8000, 'eval-dead'))
  await page.waitForTimeout(800)
  const hireState = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      staffRow: /Attendants \d\/\d/.test(t),
      powerRow: t.includes('Power'),
      hireBtn: !!document.querySelector('[data-testid="biz-hire"]'),
    }
  }), 8000, null)
  console.log('biz block:', JSON.stringify(hireState))
  await race(page.evaluate(() => {
    const scroller = document.querySelector('.lko-sheet .overflow-y-auto') as HTMLElement | null
    if (scroller) scroller.scrollTop = scroller.scrollHeight + 200
  }), 6000, null)
  await race(page.evaluate(() => (document.querySelector('[data-testid="biz-hire"]') as HTMLElement | null)?.click()), 6000, null)
  await page.waitForTimeout(1800) // autosave debounce (1.2s) + margin
  const afterHire = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      staff: s?.player?.businesses?.[0]?.staff ?? null,
      hireFee: !!s?.player?.transactions?.find((t: { label?: string }) => (t.label ?? '').startsWith('Hired attendant')),
    }
  }), 8000, null)
  console.log('after hire:', JSON.stringify(afterHire))
  await race(page.screenshot({ path: `${SHOTS}/04-biz-staff-hired.png` }), 8000, null)

  // 5. solar install — the ☀️ fitted chip
  await race(page.evaluate(() => {
    const scroller = document.querySelector('.lko-sheet .overflow-y-auto') as HTMLElement | null
    if (scroller) scroller.scrollTop = scroller.scrollHeight + 200
  }), 6000, null)
  await race(page.evaluate(() => (document.querySelector('[data-testid="biz-install-solar"]') as HTMLElement | null)?.click()), 6000, null)
  await page.waitForTimeout(1800) // autosave debounce (1.2s) + margin
  const afterSolar = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      upgrades: s?.player?.businesses?.[0]?.upgrades ?? [],
      chip: document.body.innerText.includes('Solar system'),
    }
  }), 8000, null)
  console.log('after solar:', JSON.stringify(afterSolar))
  await race(page.screenshot({ path: `${SHOTS}/05-biz-solar-fitted.png` }), 8000, null)

  // 6. phone → My Biz — the same controls, remote
  await race(page.getByLabel('Close panel').first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(600)
  await race(page.getByLabel('Game navigation').getByText('Phone').click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(900)
  await race(page.getByText('My Biz', { exact: true }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(1200)
  const phoneBiz = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      wage: t.includes('wage'),
      fitted: t.includes('Solar system fitted'),
      hire: !!document.querySelector('[data-testid="phone-biz-hire"]'),
    }
  }), 8000, null)
  console.log('phone biz:', JSON.stringify(phoneBiz))
  await race(page.screenshot({ path: `${SHOTS}/06-phone-mybiz.png` }), 8000, null)

  // 7. back to the map — the fleet legend line
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(900)
  const legend = await race(page.evaluate(() => document.body.innerText.includes('Driver gigs wait at the park')), 6000, false)
  console.log('map legend:', legend)
  await race(page.screenshot({ path: `${SHOTS}/07-map-fleet-legend.png` }), 8000, null)

  console.log('\nconsole errors:', errors.length ? errors : 'NONE')
  await browser.close()
  clearTimeout(watchdog)
  if (errors.length > 0) process.exit(1)
}

run().catch((e) => {
  console.error('FATAL', e)
  process.exit(2)
})
