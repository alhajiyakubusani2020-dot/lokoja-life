/**
 * M7 DIAGNOSTIC — when exactly does the world leg jam headless?
 * Boot a live game, click World, then ping main-thread liveness every
 * 2s for ~90s and log the veil state. Isolates the jam window.
 */
import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'
const race = async <T, F>(p: Promise<T>, ms: number, fb: F): Promise<T | F> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T | F>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await ctx.addInitScript(() => {
    ;(window as unknown as Record<string, unknown>).__lklForceQuality = 'low'
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('PAGEERROR:', String(e).slice(0, 160)))

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Diag').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600)
  console.log('game live — dashboard ping:', await race(page.evaluate(() => 'alive'), 4000, 'jammed'))

  await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  console.log('world clicked')

  for (let i = 0; i < 30; i++) {
    const ping = await race(page.evaluate(() => ({
      alive: true,
      veil: document.body.innerText.includes('Entering Lokoja'),
      canvas: !!document.querySelector('canvas'),
      hook: typeof (window as unknown as { __lkl?: unknown }).__lkl,
    })), 3500, 'jammed' as const)
    console.log(`t=${(i * 4).toString().padStart(3)}s`, JSON.stringify(ping))
    if (ping !== 'jammed' && ping.canvas && !ping.veil) break
    await page.waitForTimeout(500)
  }

  const tier = await race(page.evaluate(() => {
    const w = window as unknown as { __lkl?: Record<string, () => unknown> }
    return w.__lkl ? { tier: w.__lkl.tier?.() ?? null, gl: w.__lkl.glStatus?.() ?? null } : 'no-hook'
  }), 6000, 'eval-dead')
  console.log('final tier read:', JSON.stringify(tier))
  await browser.close()
}

run().catch((e) => { console.error('fatal:', e); process.exit(1) })
