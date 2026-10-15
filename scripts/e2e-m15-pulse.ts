/**
 * M15 E2E — THE CITY PULSE + THE POSTCARD, live on the real game.
 * The newspaper on the dashboard (day 1 prints the New Year), the deep
 * link into the phone's City Pulse app, THE SHARE (a signed postcard
 * minted through the store, previewed with its byte budget), the SSR
 * postcard page /t/<code> with its OG tags, and THE ARRIVAL — the game
 * booted from the postcard link lands the walker on the sender's
 * street, free. Mobile (390) + desktop (1280).
 *   1. The dashboard — the City Pulse banner (New Year headline)
 *   2. The phone — the City Pulse app (feed + My Spot + Know Your City + Day Clip)
 *   3. THE SHARE — the signed postcard + its ~100B budget line
 *   4. The SSR postcard page — /t/<code> reads like a screenshot
 *   5. THE ARRIVAL — /?t=<code> lands you there, no fare
 *   6. Desktop (1280) — the pulse, wide
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m15-pulse-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 220s hard exit')
  process.exit(2)
}, 225_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const shot = async (page: import('playwright').Page, name: string): Promise<void> => {
  await race(page.screenshot({ path: `${SHOTS}/${name}.png` }), 12000, undefined)
  console.log('  📸', name)
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // fresh guest life
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(400)
  await race(page.getByLabel('Character name').fill('Pulse Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)

  /* ---------- PHASE 1 — the City Pulse banner on the dashboard ---------- */
  const banner = await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="pulse-banner"]')
    return { present: !!b, text: (b?.textContent ?? '').slice(0, 90) }
  }), 8000, null)
  console.log('pulse banner:', JSON.stringify(banner))
  await shot(page, '01-dashboard-pulse-banner')

  /* ---------- PHASE 2 — the banner deep-links the phone's City Pulse ---------- */
  await race(page.getByTestId('pulse-banner').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  const pulseApp = await race(page.evaluate(() => {
    const app = document.querySelector('[data-testid="pulse-app"]')
    return {
      open: !!app,
      unread: document.querySelector('[data-testid="pulse-unread"]')?.textContent ?? '',
      items: document.querySelectorAll('[data-testid^="pulse-item-"]').length,
      knowCity: /Know Your City/.test(app?.textContent ?? ''),
      dayClip: !!document.querySelector('[data-testid="day-clip"]'),
      mySpot: !!document.querySelector('[data-testid="my-spot"]'),
    }
  }), 8000, null)
  console.log('pulse app:', JSON.stringify(pulseApp))
  await shot(page, '02-city-pulse-app')

  /* ---------- PHASE 3 — THE SHARE: mint + preview the signed postcard ---------- */
  await race(page.getByTestId('share-spot').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1200)
  const spot = await race(page.evaluate(() => {
    const el = document.querySelector('[data-testid="spot-preview"]')
    return { preview: (el?.textContent ?? '').slice(0, 320) }
  }), 8000, null)
  console.log('spot preview:', JSON.stringify(spot))
  await shot(page, '03-shared-postcard-preview')

  // the street credit landed (rep +2 through the reward engine)
  const credit = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    const env = raw ? (JSON.parse(raw) as { data?: { player?: { reputation?: number; cooldowns?: Record<string, number> } } }) : null
    return { rep: env?.data?.player?.reputation ?? -1, cd: env?.data?.player?.cooldowns?.['pulse-share'] ?? -1 }
  }), 8000, null)
  console.log('street credit:', JSON.stringify(credit))

  const code = (spot?.preview.match(/lkt1\.[A-Z2-7]+\.[0-9a-f]{16}/) ?? [''])[0]
  console.log('minted code:', code.slice(0, 40) + '…', `(${code.length} chars)`)

  /* ---------- PHASE 4 — the SSR postcard page ---------- */
  if (code) {
    await race(page.goto(`${BASE}/t/${code}`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(900)
    const card = await race(page.evaluate(() => ({
      title: document.querySelector('h1')?.textContent ?? '',
      chips: document.querySelectorAll('.lko-num').length,
      cta: !!document.querySelector('[data-testid="postcard-arrive"]'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
    })), 8000, null)
    console.log('postcard page:', JSON.stringify(card))
    await shot(page, '04-ssr-postcard-page')

    /* ---------- PHASE 5 — THE ARRIVAL: the link lands you there ---------- */
    await race(page.goto(`${BASE}/?t=${encodeURIComponent(code)}`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1300)
    await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(1000)
    const arrival = await race(page.evaluate(() => {
      const toasts = [...document.querySelectorAll('.lko-toast')]
      const txt = toasts.map((t) => t.textContent ?? '').join(' | ')
      const raw = localStorage.getItem('lokoja-life:save')
      const env = raw ? (JSON.parse(raw) as { data?: { world?: { currentLocation?: string }; cityPulse?: { arrivals?: string[]; stats?: { arrivalsIn?: number } } } }) : null
      return {
        toast: txt.slice(0, 140),
        landedAt: env?.data?.world?.currentLocation ?? 'unknown',
        mailbox: env?.data?.cityPulse?.arrivals?.length ?? -1,
      }
    }), 8000, null)
    console.log('arrival:', JSON.stringify(arrival))
    await shot(page, '05-arrival-by-postcard')
  }

  /* ---------- PHASE 6 — desktop wide ---------- */
  const desktop = await context.browser()!.newContext({ viewport: { width: 1280, height: 800 } })
  const dpage = await desktop.newPage()
  dpage.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))
  await race(dpage.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await dpage.waitForTimeout(1300)
  await race(dpage.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(1200)
  // the desktop dashboard shows the banner; open the phone via the nav
  await race(dpage.getByRole('button', { name: 'Phone', exact: false }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(700)
  await race(dpage.getByText('City Pulse', { exact: false }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(900)
  await shot(dpage, '06-desktop-pulse')

  console.log('\nconsole errors:', errors.length)
  errors.slice(0, 5).forEach((e) => console.log('  ⚠️', e))
  clearTimeout(watchdog)
  await browser.close()
  process.exit(errors.length > 0 ? 1 : 0)
}

run().catch((e) => {
  console.error('E2E FAILED:', String(e).slice(0, 200))
  process.exit(1)
})
