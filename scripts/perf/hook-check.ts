/** quick: what lkl keys exist on window inside the world? */
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
  const errs: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)) })
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(300)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 6000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(300)
  await race(page.getByText('Explore in 3D').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(11000)
  const keys = await race(page.evaluate(() => Object.keys(window).filter((k) => k.toLowerCase().includes('lkl'))), 6000, [])
  const ready = await race(page.evaluate(() => document.body.innerText.slice(0, 120).replace(/\n/g, '|')), 6000, '')
  console.log('lkl keys:', JSON.stringify(keys))
  console.log('page text:', ready)
  console.log('console errors:', errs.length, errs.slice(0, 3))
  await browser.close().catch(() => {})
}

run().catch((e) => { console.error('failed', String(e).slice(0, 200)); process.exit(1) })
