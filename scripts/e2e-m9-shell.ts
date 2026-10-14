/**
 * M9 E2E — THE CASUAL SHELL + THE GUEST LOOP, live on the real game.
 * A fresh guest lands on the dashboard (onboarding arc + today's goals),
 * rides the starter trio free, then pushes forward — THE GATE stands.
 * They claim a name through the REAL city register (Prisma + scrypt +
 * cloud vault), the gate never stands again, and Chill Mode turns on.
 *   1. Dashboard — Learn the streets + Today's goals cards
 *   2. Map → Confluence sheet — travel attempt → THE GATE modal
 *   3. Claim a name → the register accepts (real API) → gate closes
 *   4. Profile — the 🪪 cloud-on line + Chill Mode toggle on
 *   5. Desktop (1280) — the casual shell, wide
 * Every CDP call raced; DOM-level clicks only; zero 3D.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m9-shell-shots'
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

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // 1. fresh game → the dashboard carries the casual shell
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600)
  const shell = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      onboarding: !!document.querySelector('[data-testid="onboarding-card"]'),
      goals: !!document.querySelector('[data-testid="goals-card"]'),
      guestChip: /Guest mode — claim your name/i.test(t) || t.includes('Guest mode'),
    }
  }), 8000, null)
  console.log('casual shell:', JSON.stringify(shell))
  await race(page.screenshot({ path: `${SHOTS}/01-casual-dashboard.png` }), 8000, null)

  // 2. Map → the Confluence (outside the starter trio) → THE GATE STANDS
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  await race(page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
    if (el) el.click()
  }), 8000, null)
  await page.waitForTimeout(800)
  // the sheet's travel rows render — walk row attempts the trip → gate
  // the travel row is the first 'Walk' button inside the open sheet
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const walk = btns.find((b) => (b.textContent ?? '').includes('Walk') && (b.textContent ?? '').includes('min'))
    if (walk) walk.click()
  }), 8000, null)
  await page.waitForTimeout(900)
  const gate = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      modal: !!document.querySelector('[data-testid="guest-gate"]'),
      knowsFace: t.includes('Lokoja knows your face'),
      sheetSeen: t.includes('min') || t.includes('Walk'),
    }
  }), 8000, null)
  console.log('THE GATE:', JSON.stringify(gate))
  await race(page.screenshot({ path: `${SHOTS}/02-gate-stands.png` }), 8000, null)

  // 3. claim a name through the REAL register
  const handle = `ada_${Date.now().toString(36).slice(-5)}`
  await race(page.evaluate(() => {
    const el = document.querySelector('[data-testid="gate-handle"]') as HTMLInputElement | null
    if (el) {
      el.value = ''
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }), 6000, null)
  await race(page.getByTestId('gate-handle').fill(handle).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-contact').fill(`0803${Math.floor(1000000 + Math.random() * 8999999)}`).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-pin').fill('4321').catch(() => {}), 8000, null)
  await race(page.screenshot({ path: `${SHOTS}/03-gate-claim-form.png` }), 8000, null)
  await race(page.getByTestId('gate-submit').click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2500) // register + cloud push round-trip
  const claimed = await race(page.evaluate(() => {
    const t = document.body.innerText
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      gateClosed: !document.querySelector('[data-testid="guest-gate"]'),
      claimedToast: /claim your name/i.test(t) || /welcome/i.test(t),
      saveLinked: save?.account?.linked === true,
      saveHandle: save?.account?.handle ?? null,
    }
  }), 8000, null)
  console.log('claimed:', JSON.stringify(claimed), '| handle:', handle)
  await race(page.screenshot({ path: `${SHOTS}/04-claimed.png` }), 8000, null)

  // 4. the gate never stands again — ride to the Confluence free
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent?.trim() === 'Map')
    if (btns.length) (btns[btns.length - 1] as HTMLButtonElement).click()
  }), 8000, null)
  await page.waitForTimeout(900)
  await race(page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
    if (el) el.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const walk = btns.find((b) => (b.textContent ?? '').includes('Walk') && (b.textContent ?? '').includes('min'))
    if (walk) walk.click()
  }), 8000, null)
  await page.waitForTimeout(1700)
  const freeRide = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      gateNever: !document.querySelector('[data-testid="guest-gate"]'),
      atConfluence: /you are here/i.test(t) && /confluence/i.test(t),
    }
  }), 8000, null)
  console.log('free ride:', JSON.stringify(freeRide))

  // 5. Profile — the cloud-on line + Chill Mode on
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent?.trim() === 'You')
    if (btns.length) (btns[btns.length - 1] as HTMLButtonElement).click()
  }), 8000, null)
  await page.waitForTimeout(800)
  await race(page.evaluate(() => {
    const el = document.querySelector('[data-testid="chill-toggle"]') as HTMLButtonElement | null
    if (el) el.click()
  }), 8000, null)
  await page.waitForTimeout(500)
  const profile = await race(page.evaluate(() => {
    const t = document.body.innerText
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      cloudOn: !!document.querySelector('[data-testid="account-line"]'),
      chillOn: save?.settings?.chill === true,
    }
  }), 8000, null)
  console.log('profile:', JSON.stringify(profile))
  await race(page.screenshot({ path: `${SHOTS}/05-profile-chill.png` }), 8000, null)

  // 6. desktop — the casual shell, wide (same context → same save)
  const desktop = await context.newPage()
  await desktop.setViewportSize({ width: 1280, height: 800 })
  await race(desktop.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await desktop.waitForTimeout(1300)
  await race(desktop.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await desktop.waitForTimeout(1300)
  const wide = await race(desktop.evaluate(() => ({
    goals: !!document.querySelector('[data-testid="goals-card"]'),
    onboarding: !!document.querySelector('[data-testid="onboarding-card"]') || document.body.innerText.includes('STREET'),
  })), 8000, null)
  console.log('desktop:', JSON.stringify(wide))
  await race(desktop.screenshot({ path: `${SHOTS}/06-desktop-shell.png` }), 8000, null)
  await desktop.close()

  await browser.close()
  console.log('console errors:', errors.length, errors.slice(0, 3))
  console.log(`E2E M9 done → ${SHOTS}`)
  clearTimeout(watchdog)
  if (errors.length > 0) process.exit(1)
}

run().catch((e) => {
  console.error('E2E fatal:', String(e).slice(0, 300))
  process.exit(1)
})
