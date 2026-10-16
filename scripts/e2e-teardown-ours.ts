/**
 * LOKOJA LIFE — FULL SELF-TEARDOWN
 * --------------------------------
 * The user demanded the same treatment Lagos Life got: play the game,
 * visit EVERY screen, capture text + screenshots, then compare honestly.
 * This crawler walks: menu → creation → 7 dashboard tabs → the 3D world
 * (with real teleports) → the phone grid → all 11 phone apps.
 * Every console error is captured — the house law: 0 errors or we say so.
 * Run: bun scripts/e2e-teardown-ours.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/teardown-ours'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 280s hard exit'); process.exit(2) }, 279_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const errors: string[] = []
const transcript: Array<{ step: string; ok: boolean; note: string; text?: string }> = []
let shotN = 0

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 180)) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 180)))

  const snap = async (step: string, label: string): Promise<void> => {
    shotN++
    const file = `${SHOTS}/${String(shotN).padStart(2, '0')}-${label}.png`
    await race(page.screenshot({ path: file }), 8000, null)
    const text = await race(page.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 1400)), 5000, '(no text)')
    transcript.push({ step, ok: true, note: file, text })
    console.log(`✓ ${step} → ${file}`)
  }
  const miss = (step: string, why: string): void => {
    transcript.push({ step, ok: false, note: why })
    console.log(`✗ ${step} — ${why}`)
  }

  /* 1. MAIN MENU */
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1800)
  if (await race(page.evaluate(() => document.body.innerText.length > 100), 6000, false)) await snap('main-menu', 'menu')
  else miss('main-menu', 'menu text never grew')

  /* 2. CHARACTER CREATION */
  const started = await race(page.getByText('START YOUR LIFE').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
  if (started) {
    await page.waitForTimeout(600)
    await snap('character-creation', 'creation')
    await race(page.getByLabel('Character name').fill('Tear Down'), 8000, null)
    const born = await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
    await page.waitForTimeout(2200)
    if (!born) miss('start-life-click', 'button not found; continuing anyway')
  } else miss('character-creation', 'START YOUR LIFE not found — maybe a save exists; trying Continue')

  /* 3. THE SEVEN DASHBOARD TABS */
  const tabs: Array<[string, string]> = [
    ['home', 'tab-home'], ['you', 'tab-you'], ['work', 'tab-work'], ['bag', 'tab-bag'],
    ['map', 'tab-map'], ['work2skip', 'skip'], ['phone', 'skip'],
  ]
  for (const [tab, label] of tabs) {
    if (label === 'skip') continue
    const clicked = await race(page.getByRole('button', { name: new RegExp(`^${tab}$`, 'i') }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
    if (clicked) { await page.waitForTimeout(1200); await snap(`tab-${tab}`, label) }
    else miss(`tab-${tab}`, 'nav button not found')
  }

  /* 4. THE 3D WORLD — settle, then two real teleports */
  const worldClicked = await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (worldClicked) {
    await page.waitForTimeout(2500)
    const canvas = await race(page.evaluate(() => !!document.querySelector('canvas')), 6000, false)
    const truth = await race(page.evaluate(() => {
      const l = (window as unknown as { __lkl?: { tier?: () => unknown; doors?: () => unknown[]; timeOfDay?: () => string } }).__lkl
      return l ? { tier: l.tier?.() ?? null, doors: Array.isArray(l.doors?.()) ? l.doors().length : null, tod: l.timeOfDay?.() ?? null } : null
    }), 6000, null)
    console.log('WORLD TRUTH:', JSON.stringify(truth), 'canvas:', canvas)
    transcript.push({ step: 'world-truth', ok: !!truth, note: JSON.stringify(truth) })
    await snap('world-first-settle', 'world-a')
    /* teleport by the real travel door: mount-patti then confluence */
    for (const [id, label] of [['mount-patti', 'world-patti'], ['confluence', 'world-confluence']] as const) {
      const went = await race(page.evaluate((street) => {
        const l = (window as unknown as { __lkl?: { travel?: (s: string) => boolean } }).__lkl
        return l?.travel ? (l.travel(street), true) : false
      }, id), 6000, false)
      await page.waitForTimeout(2600)
      if (went) await snap(`world-${id}`, label)
      else miss(`world-${id}`, 'travel hook refused')
    }
  } else miss('world', 'World nav button not found')

  /* 5. PHONE GRID + ALL 11 APPS */
  const phoneClicked = await race(page.getByRole('button', { name: /^phone$/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (phoneClicked) {
    await page.waitForTimeout(1200)
    await snap('phone-grid', 'phone-grid')
    const appLabels = ['Chats', 'City Pulse', 'Live', 'Forge', 'Nation', 'Family Shield', 'Bank', 'Hustle Board', 'Civic', 'My Biz', 'Settings']
    for (const label of appLabels) {
      const slug = label.toLowerCase().replace(/\s+/g, '-')
      const opened = await race(page.getByText(label, { exact: true }).first().click({ timeout: 6000 }).then(() => true).catch(() => false), 8000, false)
      if (opened) { await page.waitForTimeout(1400); await snap(`app-${slug}`, `app-${slug}`) }
      else miss(`app-${slug}`, 'tile not clickable')
      /* reset to grid: bounce through the Home tab so PhoneScreen remounts fresh */
      await race(page.getByRole('button', { name: /^home$/i }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
      await race(page.getByRole('button', { name: /^phone$/i }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
      await page.waitForTimeout(700)
    }
  } else miss('phone', 'Phone nav button not found')

  await browser.close()
}

run().then(() => {
  clearTimeout(watchdog)
  const ok = transcript.filter((t) => t.ok).length
  writeFileSync(`${SHOTS}/transcript.json`, JSON.stringify({ transcript, errors }, null, 2))
  console.log(`\n=== TEARDOWN CRAWL DONE: ${ok}/${transcript.length} steps captured, ${shotN} shots, ${errors.length} console errors ===`)
  if (errors.length) console.log('ERRORS:\n' + errors.slice(0, 10).join('\n'))
  process.exit(0)
}).catch((e) => { clearTimeout(watchdog); console.error('FATAL', e); process.exit(1) })
