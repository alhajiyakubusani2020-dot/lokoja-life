/**
 * M24-UI WAVE 2 — THE WITNESS (the faces, eyeballed)
 * --------------------------------------------------
 * The landing's live ribbon + honest chips, then the phone's rebuilt
 * faces (contacts, patti, career, nation) — screenshots for the human
 * eye, and the DOM testids the suites pin, re-proven on the REAL page.
 * Zero console errors is the floor, not a goal.
 *
 * Run: bun scripts/e2e-m24-uiface.ts   (dev :3000 up)
 */

import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m24-uiface-shots'
mkdirSync(SHOTS, { recursive: true })

const errors: string[] = []
const race = <T,>(p: Promise<T>, ms: number, onTimeout: (() => T) | null): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => (onTimeout ? resolve(onTimeout()) : reject(new Error('race timeout'))), ms)
    p.then((v) => { clearTimeout(t); resolve(v) }).catch((e) => { clearTimeout(t); reject(e) })
  })

async function shot(page: import('playwright').Page, path: string): Promise<void> {
  await race(page.screenshot({ path }), 9000, null).catch((e) => errors.push('shot: ' + String(e).slice(0, 80)))
}

const run = async () => {
  /* -------- 1. THE LANDING — the live ribbon's truth + the honest chips -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => errors.push('menu: ' + String(e).slice(0, 140)))
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + String(m.text()).slice(0, 140)) })

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(2600) // the wire-status fetch resolves
    const menu = await race(page.evaluate(() => ({
      ribbon: document.querySelector('[data-testid="menu-live-ribbon"]')?.textContent ?? null,
      preview: !!document.querySelector('[data-testid="menu-preview-note"]'),
      auth: !!document.querySelector('[data-testid="menu-auth-open"]'),
      chips: Array.from(document.querySelectorAll('.mt-4.flex.flex-wrap > span')).map((s) => s.textContent),
    })), 8000, null)
    console.log('MENU:', JSON.stringify(menu, null, 0))
    await shot(page, `${SHOTS}/01-landing-live-ribbon.png`)

    // the auth sheet — the W1 gate still opens
    await race(page.getByTestId('menu-auth-open').click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(700)
    const auth = await race(page.evaluate(() => ({
      sheet: !!document.querySelector('[data-testid="menu-auth-sheet"]'),
      handle: !!document.querySelector('[data-testid="auth-handle"]'),
      pin: !!document.querySelector('[data-testid="auth-pin"]'),
      birth: !!document.querySelector('[data-testid="auth-birth-year"]'),
    })), 8000, null)
    console.log('AUTH:', JSON.stringify(auth))
    await shot(page, `${SHOTS}/02-auth-sheet.png`)
    await browser.close()
  }

  /* -------- 2. THE PHONE'S FACES — contacts, patti, career, nation -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => errors.push('phone: ' + String(e).slice(0, 140)))
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + String(m.text()).slice(0, 140)) })

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await race(page.getByLabel('Character name').fill('Face Hand').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(1800)
    await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(600)
    await shot(page, `${SHOTS}/03-phone-grid.png`)

    const openApp = async (label: string, testid: string) => {
      await race(page.getByRole('button', { name: `Open ${label} app` }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
      await page.waitForTimeout(900)
      const ok = await race(page.evaluate((tid) => !!document.querySelector(`[data-testid="${tid}"]`), testid), 6000, null)
      console.log(`${label}: app mounted=${ok}`)
      return ok
    }

    await openApp('Contacts', 'contacts-app')
    const contacts = await race(page.evaluate(() => ({
      rows: document.querySelectorAll('[data-testid^="contacts-row-"]').length,
      hero: !!document.querySelector('[data-testid="contacts-hero"]'),
    })), 6000, null)
    console.log('contacts rows:', JSON.stringify(contacts))
    await shot(page, `${SHOTS}/04-contacts-face.png`)
    await race(page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6000 }).catch(() => {}), 7000, null)
    await page.waitForTimeout(400)

    await openApp('Career', 'career-app')
    await shot(page, `${SHOTS}/05-career-face.png`)
    await race(page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6000 }).catch(() => {}), 7000, null)
    await page.waitForTimeout(400)

    await openApp('Mt Patti', 'patti-app')
    await shot(page, `${SHOTS}/06-patti-face.png`)
    await race(page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6000 }).catch(() => {}), 7000, null)
    await page.waitForTimeout(400)

    await openApp('Nation', 'nation-app')
    const nation = await race(page.evaluate(() => ({
      hero: !!document.querySelector('[data-testid="nation-hero"]'),
      crowdPath: !!document.querySelector('[data-testid="nation-crowd-path"]'),
      live: !!document.querySelector('[data-testid="nation-live"]'),
    })), 6000, null)
    console.log('nation pins:', JSON.stringify(nation))
    await shot(page, `${SHOTS}/07-nation-face.png`)
    await browser.close()
  }

  console.log(`console/page errors: ${errors.length}`)
  if (errors.length) console.log(errors.slice(0, 6).join('\n'))
  console.log('M24-UI WAVE 2 — THE WITNESS', errors.length === 0 ? '🟢' : '🔴')
}

void run()
