/**
 * M3 E2E — OWN THE CITY, live on the real game (2D surfaces only — the
 * map/sheet/phone layer carries the biz UI; no 3D wedge risk).
 * Save-patch carries Ada to Level 5 with ₦500k and a Kpata stall whose till
 * holds ₦3,300, then:
 *   1. Map screen — the ₦ dot on the Kpata marker + the new legend
 *   2. Kpata location sheet — the shopfront block (till / collect / upgrade)
 *   3. Collect in person — till empties, cash grows, ledger records
 *   4. Phone → My Biz app — all four shopfronts + phone collect (−₦50 fee)
 * Every CDP call raced; 150s watchdog.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m3-biz-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 150s hard exit')
  process.exit(2)
}, 165_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)))

  // 1. fresh game (creates the save)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600) // autosave debounce

  // 2. reload, then patch the IDLE menu page (pending autosave timers eat live patches)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  const patch = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 5
    save.player.level = 5
    save.player.cash = 500000
    save.player.businesses = [{
      id: 'kpata-stall', typeId: 'kpata-stall', level: 2, accrued: 3300,
      lastAccrualDay: save.world.day, openedDay: Math.max(1, save.world.day - 4), lastCollectedAt: null,
    }]
    // stand AT the shop so the free in-person collect is honest
    save.world.currentLocation = 'kpata-market'
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }), 8000, 'eval-dead')
  console.log('save patch:', patch)

  // 3. continue → the 2D dashboard (home tab by default) → Map tab
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  await race(page.screenshot({ path: `${SHOTS}/01-map-biz-dot.png` }), 8000, null)

  // 4. open the Kpata market sheet — markers overlap on the dense map, so
  // the click is dispatched at the DOM level (bypasses pin hit-testing)
  const markerClicked = await race(page.evaluate(() => {
    const el = (document.querySelector('button[aria-label^="Kpata Market"]') as HTMLButtonElement | null)
      ?? Array.from(document.querySelectorAll('button[aria-label]')).find((b) => (b.getAttribute('aria-label') ?? '').startsWith('Kpata')) as HTMLButtonElement | null
    if (!el) return 'no-marker'
    el.click()
    return 'clicked'
  }), 8000, 'eval-dead')
  console.log('marker click:', markerClicked)
  await page.waitForTimeout(800)
  const sheetTxt = await race(page.evaluate(() => document.body.innerText.slice(0, 500).replace(/\n+/g, '|')), 6000, 'eval-dead')
  console.log('after click text:', sheetTxt.slice(0, 320))
  const sheet = await race(page.evaluate(() => document.body.innerText.includes('Your business here')), 6000, false)
  console.log('shopfront visible:', sheet)
  // scroll the sheet so the shopfront block (below the meal menu) is in frame
  await race(page.evaluate(() => {
    const scroller = document.querySelector('.lko-sheet .overflow-y-auto') as HTMLElement | null
      ?? (document.querySelector('[role="dialog"] > div > div') as HTMLElement | null)
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }), 6000, null)
  await page.waitForTimeout(500)
  await race(page.screenshot({ path: `${SHOTS}/02-kpata-shopfront.png` }), 8000, null)

  // 5. collect in person (free) — till empties into cash
  const cashBefore = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return s?.player?.cash ?? null
  }), 6000, null)
  await race(page.getByText('Collect (free here)').first().click({ timeout: 6000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(1400)
  const after = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return { cash: s?.player?.cash ?? null, till: s?.player?.businesses?.[0]?.accrued ?? null, tx: s?.player?.transactions?.[0]?.label ?? null }
  }), 8000, null)
  console.log('collect: before', cashBefore, 'after', JSON.stringify(after))
  await race(page.screenshot({ path: `${SHOTS}/03-collected.png` }), 8000, null)
  await race(page.getByRole('button', { name: 'Cancel' }).first().click({ timeout: 6000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(400)

  // 6. phone → My Biz
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(700)
  await race(page.getByText('My Biz', { exact: false }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(700)
  await race(page.screenshot({ path: `${SHOTS}/04-phone-biz.png` }), 8000, null)
  const bizState = await race(page.evaluate(() => document.body.innerText.slice(0, 600).replace(/\n+/g, '|')), 6000, '')
  console.log('phone text:', bizState.slice(0, 260))

  console.log('console errors:', errors.length, errors.slice(0, 2))
  clearTimeout(watchdog)
  await browser.close().catch(() => {})
  process.exit(0)
}

run().catch((e) => { console.error('failed', String(e).slice(0, 200)); process.exit(1) })
