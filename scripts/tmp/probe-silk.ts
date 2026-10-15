/** Probe: why did G4 (canvas) and G5b (SW) fail in the silk gates? */
import { chromium } from 'playwright'

const BASE = 'http://localhost:3001'
const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })

  /* --- probe A: the SW registration law --- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    const logs: string[] = []
    page.on('console', (m) => logs.push(`[console] ${m.type()}: ${m.text().slice(0, 140)}`))
    page.on('pageerror', (e) => logs.push(`[pageerror] ${String(e).slice(0, 140)}`))
    await page.goto(`${BASE}/`, { waitUntil: 'load' })
    await page.waitForTimeout(5000)
    const probe1 = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration()
      return {
        registered: !!reg,
        active: !!reg?.active,
        controller: !!navigator.serviceWorker.controller,
        flag: (window as unknown as { __lkoSwRegistered?: boolean }).__lkoSwRegistered,
        secure: window.isSecureContext,
      }
    })
    console.log('PROBE A after first visit 5s:', JSON.stringify(probe1))
    await page.reload({ waitUntil: 'load' })
    await page.waitForTimeout(4000)
    const probe2 = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration()
      return {
        registered: !!reg,
        active: !!reg?.active,
        controller: !!navigator.serviceWorker.controller,
        flag: (window as unknown as { __lkoSwRegistered?: boolean }).__lkoSwRegistered,
      }
    })
    console.log('PROBE A after reload 4s:', JSON.stringify(probe2))
    logs.slice(0, 12).forEach((l) => console.log(' ', l))
    await ctx.close()
  }

  /* --- probe B: the world boot law (generous settle-poll) --- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => console.log('  [world pageerror]', String(e).slice(0, 120)))
    await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    await page.getByText('START YOUR LIFE').first().click({ timeout: 10_000 }).catch(() => {})
    await page.waitForTimeout(500)
    await page.getByLabel('Character name').fill('Silk Musa').catch(() => {})
    await page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {})
    // settle-poll up to 60s: canvas present + alive
    const t0 = Date.now()
    let canvasAt = -1
    for (let i = 0; i < 60; i++) {
      const live = await page.evaluate(() => !!document.querySelector('canvas'))
      if (live) { canvasAt = Date.now() - t0; break }
      await page.waitForTimeout(1000)
    }
    console.log('PROBE B canvas appeared at:', canvasAt, 'ms after Start Life')
    if (canvasAt >= 0) {
      const mem = await page.evaluate(() => (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0)
      console.log('PROBE B heap (performance.memory):', (mem / 1048576).toFixed(1), 'MB')
    } else {
      console.log('PROBE B canvas NEVER appeared in 60s — dumping body classes')
      const body = await page.evaluate(() => document.body.innerText.slice(0, 300))
      console.log('  body text:', body.replace(/\n/g, ' | ').slice(0, 280))
    }
    await ctx.close()
  }

  await browser.close()
}
run()
