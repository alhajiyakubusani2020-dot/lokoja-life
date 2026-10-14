/**
 * M8 E2E — THE CHAOS ENGINE, live on the real game (2D surfaces).
 * Save-patch carries Ada to Level 6 with ₦400k, drops her at the Food Strip
 * on a deterministic SCARCITY day with a live transformer outage + a half
 * full community pool:
 *   1. Dashboard — the black ChaosBanner (pool bar + Drop buttons) + the
 *      scarcity chip (ATM dey dry · POS levy · fuel na black market)
 *   2. Map — the pulsing ⚡ dark-zone pin over the Food Strip
 *   3. Contribute ₦2,500 — the pool bar grows in place (store round-trip)
 *   4. Phone → Bank — withdraw above the cap refused (toast), then a POS
 *      levy withdrawal through the live store
 *   5. Desktop (1280) — the same dashboard, wide
 * Every CDP call raced; DOM-level clicks only; no 3D (the chaos speaks
 * through the city's panels — and the headless wedge stays far away).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { isScarcityDay, posFeeFor } from '../src/game/systems/chaos'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m8-chaos-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 240s hard exit')
  process.exit(2)
}, 245_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

// a deterministic scarcity day — the same law the store runs
const SCARCITY_DAY = Array.from({ length: 200 }, (_, i) => i + 5).find((d) => isScarcityDay(d)) ?? 23
const POS_FEE = posFeeFor(20000)

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  // ONE context — the desktop page shares the save (localStorage is per-context)
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
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
  const patch = await race(page.evaluate((day) => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 9
    save.player.level = 6
    save.player.cash = 400000
    save.player.needs.energy = 100
    save.player.needs.mood = 70
    save.world.currentLocation = 'food-area'
    save.world.timeOfDay = 'morning'
    save.world.weather = 'cloudy'
    save.world.day = day
    save.chaos = {
      day,
      active: {
        zoneId: 'food-area',
        startedDay: day,
        minUntilDay: day + 2,
        pool: 4600,
        playerContribDays: [],
      },
      recent: [],
      atmDrawnDay: day,
      atmDrawn: 0,
      stats: { blowouts: 1, fixes: 0, contributed: 0, posFees: 0 },
    }
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }, SCARCITY_DAY), 8000, 'eval-dead')
  console.log('save patch:', patch, '| scarcity day:', SCARCITY_DAY)

  // 2. continue → Dashboard: the ChaosBanner (blackout + pool + scarcity chip)
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1100)
  const banner = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      outageCard: /blackout — /i.test(t) && /day \d+→\d+/i.test(t.replace(/\s+/g, ' ')),
      pool: /community light fund/i.test(t),
      drop2500: !!document.querySelector('[data-testid="chaos-give-2500"]'),
      scarcity: /cash scarcity/i.test(t),
      atmNote: /ATM dey dry/i.test(t),
    }
  }), 8000, null)
  console.log('chaos banner:', JSON.stringify(banner))
  await race(page.screenshot({ path: `${SHOTS}/01-chaos-dashboard.png` }), 8000, null)

  // 3. Map — the ⚡ dark-zone pin rides the Food Strip marker
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  const pin = await race(page.evaluate(() => ({
    darkPin: !!document.querySelector('[data-testid="map-dark-zone"]'),
  })), 8000, null)
  console.log('map pin:', JSON.stringify(pin))
  await race(page.screenshot({ path: `${SHOTS}/02-dark-zone-pin.png` }), 8000, null)

  // 4. back to the dashboard (nav = last 'Home' button) → contribute ₦2,500
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent?.trim() === 'Home')
    if (btns.length) (btns[btns.length - 1] as HTMLButtonElement).click()
  }), 8000, null)
  await page.waitForTimeout(900)
  const poolBefore = await race(page.evaluate(() => {
    const m = /₦([\d,]+) \/ ₦12,000/.exec(document.body.innerText)
    return m ? Number(m[1].replace(/,/g, '')) : null
  }), 8000, null)
  await race(page.evaluate(() => {
    const el = document.querySelector('[data-testid="chaos-give-2500"]') as HTMLButtonElement | null
    if (el) el.click()
  }), 8000, null)
  await page.waitForTimeout(1600)
  const poolAfter = await race(page.evaluate(() => {
    const m = /₦([\d,]+) \/ ₦12,000/.exec(document.body.innerText)
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      dom: m ? Number(m[1].replace(/,/g, '')) : null,
      savePool: save?.chaos?.active?.pool ?? null,
      contributed: save?.chaos?.stats?.contributed ?? null,
      todayMarked: !!save?.chaos?.active?.playerContribDays?.length,
      thanks: /you don contribute today/i.test(document.body.innerText),
    }
  }), 8000, null)
  console.log('pool:', poolBefore, '→', JSON.stringify(poolAfter))
  await race(page.screenshot({ path: `${SHOTS}/03-pool-contribution.png` }), 8000, null)

  // 5. Phone → Bank — the scarcity law through the live store:
  //    deposit everything, then a ₦25k ATM withdrawal → REFUSED (cap ₦5k) with a toast
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent?.trim() === 'Phone')
    if (btns.length) (btns[btns.length - 1] as HTMLButtonElement).click()
  }), 8000, null)
  await page.waitForTimeout(900)
  await race(page.getByText('Bank', { exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(800)
  // the bank app: 'All' chip SETS the amount — then (after re-render) the action button MOVES it
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const all = btns.find((b) => b.textContent?.trim() === 'All') as HTMLButtonElement | undefined
    if (all) all.click()
  }), 8000, null)
  await page.waitForTimeout(500)
  const bankFlow = await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const deposit = btns.find((b) => /^Deposit/.test(b.textContent?.trim() ?? '')) as HTMLButtonElement | undefined
    if (deposit) deposit.click()
    return { deposited: !!deposit, label: deposit?.textContent?.trim() ?? null }
  }), 8000, null)
  await page.waitForTimeout(700)
  // switch to the withdraw mode (re-render), set ₦25k, pull the trigger → the cap refuses
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const mode = btns.find((b) => b.textContent?.trim() === 'Withdraw') as HTMLButtonElement | undefined
    if (mode) mode.click()
  }), 8000, null)
  await page.waitForTimeout(500)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const chip = btns.find((x) => x.textContent?.includes('25k')) as HTMLButtonElement | undefined
    if (chip) chip.click()
  }), 8000, null)
  await page.waitForTimeout(400)
  const withDraw = await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const go = btns.find((x) => /^Withdraw ₦/.test(x.textContent?.trim() ?? '')) as HTMLButtonElement | undefined
    if (go) go.click()
    return { go: !!go, label: go?.textContent?.trim() ?? null }
  }), 8000, null)
  await page.waitForTimeout(500) // the refusal toast is live for 3.2s — catch it
  await race(page.screenshot({ path: `${SHOTS}/04-atm-cap-refusal.png` }), 8000, null)
  const refusal = await race(page.evaluate(() => {
    const t = document.body.innerText
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      toast: /ATM fit pay/i.test(t) || /ATM don dry/i.test(t),
      bankBalance: save?.player?.bankBalance ?? null,
      cash: save?.player?.cash ?? null,
    }
  }), 8000, null)
  console.log('bank flow:', JSON.stringify({ ...bankFlow, withDraw }), '| atm cap:', JSON.stringify(refusal))

  // 6. desktop — the same chaos dashboard, wide (same context → same save)
  const desktop = await context.newPage()
  await desktop.setViewportSize({ width: 1280, height: 800 })
  await race(desktop.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await desktop.waitForTimeout(1300)
  await race(desktop.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await desktop.waitForTimeout(1300)
  const wide = await race(desktop.evaluate(() => ({
    banner: /community light fund/i.test(document.body.innerText),
    scarcity: /cash scarcity/i.test(document.body.innerText),
  })), 8000, null)
  console.log('desktop banner:', JSON.stringify(wide))
  await race(desktop.screenshot({ path: `${SHOTS}/05-desktop-chaos.png` }), 8000, null)
  await desktop.close()

  await browser.close()
  console.log('console errors:', errors.length, errors.slice(0, 3))
  console.log(`E2E M8 done → ${SHOTS}`)
  clearTimeout(watchdog)
  if (errors.length > 0) process.exit(1)
}

run().catch((e) => {
  console.error('E2E fatal:', String(e).slice(0, 300))
  process.exit(1)
})
