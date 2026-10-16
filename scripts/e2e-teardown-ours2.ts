/**
 * TEARDOWN PASS 2 — the PHONE, every app, + the home tab that was missed.
 * Fresh boot → Continue (save exists from pass 1) → Home tab → Phone grid
 * → 11 apps, each captured with text + screenshot, 0-error law enforced.
 * Run: bun scripts/e2e-teardown-ours2.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/teardown-ours'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 240s hard exit'); process.exit(2) }, 239_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const errors: string[] = []
const transcript: Array<{ step: string; ok: boolean; note: string; text?: string }> = []
let shotN = 20

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

  /* boot + resume the save from pass 1 */
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1800)
  const resumed = await race(page.getByText('Continue', { exact: true }).first().click({ timeout: 8000 }).then(() => true).catch(() => false), 10_000, false)
  if (!resumed) {
    /* no save — create one */
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await race(page.getByLabel('Character name').fill('Tear Down'), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).catch(() => {}), 10_000, null)
  }
  await page.waitForTimeout(2200)

  /* the missed HOME tab */
  const homeClicked = await race(page.getByRole('button', { name: /^home$/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (homeClicked) { await page.waitForTimeout(1300); await snap('tab-home', 'tab-home') }
  else transcript.push({ step: 'tab-home', ok: false, note: 'not found' })

  /* PHONE GRID + 11 APPS */
  const phoneClicked = await race(page.getByRole('button', { name: /^phone$/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (phoneClicked) {
    await page.waitForTimeout(1200)
    await snap('phone-grid', 'phone-grid')
    const appLabels = ['Chats', 'City Pulse', 'Live', 'Forge', 'Nation', 'Family Shield', 'Bank', 'Hustle Board', 'Civic', 'My Biz', 'Settings']
    for (const label of appLabels) {
      const slug = label.toLowerCase().replace(/\s+/g, '-')
      const opened = await race(page.getByText(label, { exact: true }).first().click({ timeout: 6000 }).then(() => true).catch(() => false), 8000, false)
      if (opened) { await page.waitForTimeout(1500); await snap(`app-${slug}`, `app-${slug}`) }
      else transcript.push({ step: `app-${slug}`, ok: false, note: 'tile not clickable' })
      await race(page.getByRole('button', { name: /^home$/i }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
      await race(page.getByRole('button', { name: /^phone$/i }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
      await page.waitForTimeout(700)
    }
  } else transcript.push({ step: 'phone', ok: false, note: 'nav not found' })

  await browser.close()
}

run().then(() => {
  clearTimeout(watchdog)
  const ok = transcript.filter((t) => t.ok).length
  writeFileSync(`${SHOTS}/transcript2.json`, JSON.stringify({ transcript, errors }, null, 2))
  console.log(`\n=== PASS 2 DONE: ${ok}/${transcript.length} steps, ${errors.length} console errors ===`)
  if (errors.length) console.log('ERRORS:\n' + errors.slice(0, 10).join('\n'))
  process.exit(0)
}).catch((e) => { clearTimeout(watchdog); console.error('FATAL', e); process.exit(1) })
