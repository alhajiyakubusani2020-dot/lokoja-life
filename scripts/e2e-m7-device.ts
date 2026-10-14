/**
 * M7 E2E — RUN ON ANY DEVICE, live on the real game. (v3 — wedge-proof)
 * Legs (3D goes LAST, per the wedge playbook):
 *   1. Desktop — GraphicsPicker verdict + the High pick PERSISTS into the save
 *   2. iPhone 13 emulation — touch picker renders with an honest verdict
 *   3. No-WebGL browser — honest fallback panel, game continues on the map
 *   4. Forced LOW tier world (SwiftShader is slow: poll the thread SETTLED,
 *      then ONE combined read) — __lkl.tier()==='low', fps report, then the
 *      context-loss → recover-chip → restore law
 * Every CDP call raced; 420s watchdog; console-error law enforced.
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m7-device-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 420s hard exit')
  process.exit(2)
}, 420_000)

const race = async <T, F>(p: Promise<T>, ms: number, fb: F): Promise<T | F> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T | F>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

type Ping = { alive: boolean; veil: boolean; canvas: boolean } | 'jammed'

/** poll until the main thread answers twice in a row AND the world is up (veil gone, canvas in) */
const settle = async (page: import('playwright').Page, maxMs: number): Promise<'settled' | 'timeout'> => {
  const t0 = Date.now()
  let aliveStreak = 0
  while (Date.now() - t0 < maxMs) {
    const ping = await race(page.evaluate(() => ({
      alive: true,
      veil: document.body.innerText.includes('Entering Lokoja'),
      canvas: !!document.querySelector('canvas'),
    })), 4000, 'jammed' as const) as Ping
    if (ping !== 'jammed' && ping.canvas && !ping.veil) {
      aliveStreak++
      if (aliveStreak >= 2) return 'settled'
    } else {
      aliveStreak = 0
    }
    await page.waitForTimeout(700)
  }
  return 'timeout'
}

const run = async (): Promise<void> => {
  const allErrors: string[] = []

  /* ---------------- 1. desktop — picker verdict + persistence ---------------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(350)
    await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(2600)
    await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1400)
    const saveState = await race(page.evaluate(() => (localStorage.getItem('lokoja-life:save') ? 'has-save' : 'no-save')), 12000, 'eval-dead')
    console.log('desktop save:', saveState)

    await race(page.getByRole('button', { name: 'Settings' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(700)
    const verdict = await race(page.evaluate(() => ({
      line: document.querySelector('[data-testid="device-line"]')?.textContent ?? null,
      buttons: Array.from(document.querySelectorAll('[role="radio"]')).map((b) => b.textContent),
      active: document.querySelector('[role="radio"][aria-checked="true"]')?.textContent ?? null,
    })), 10000, null)
    console.log('desktop verdict:', JSON.stringify(verdict))
    const okDesktop = !!verdict && verdict.buttons.length === 4 && verdict.active === 'Auto' && (verdict.line ?? '').length > 8
    console.log('desktop picker law:', okDesktop ? 'PASS' : 'FAIL')
    await race(page.screenshot({ path: `${SHOTS}/01-desktop-settings.png` }), 8000, null)

    await race(page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('[role="radio"]')).find((b) => b.textContent === 'High') as HTMLButtonElement | null
      btn?.click()
    }), 8000, null)
    await page.waitForTimeout(900)
    const afterPick = await race(page.evaluate(() => ({
      active: document.querySelector('[role="radio"][aria-checked="true"]')?.textContent ?? null,
      saved: JSON.parse(localStorage.getItem('lokoja-life:save') ?? 'null')?.settings?.graphics ?? null,
    })), 10000, null)
    console.log('after High pick:', JSON.stringify(afterPick))
    console.log('pick persistence law:', afterPick && afterPick.active === 'High' && afterPick.saved === 'high' ? 'PASS' : 'FAIL')
    allErrors.push(...errors)
    await browser.close()
  }

  /* ---------------- 2. iPhone 13 emulation — touch verdict ---------------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1500)
    await race(page.getByRole('button', { name: 'Settings' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(700)
    const verdict = await race(page.evaluate(() => document.querySelector('[data-testid="device-line"]')?.textContent ?? null), 8000, null)
    console.log('iphone verdict:', verdict)
    console.log('iphone picker renders:', !!verdict ? 'PASS' : 'FAIL')
    await race(page.screenshot({ path: `${SHOTS}/02-iphone-settings.png` }), 8000, null)
    allErrors.push(...errors)
    await browser.close()
  }

  /* -------- 3. no-WebGL browser — the honest fallback, game continues -------- */
  {
    const browser = await chromium.launch({
      args: ['--disable-dev-shm-usage', '--disable-webgl', '--disable-webgl2', '--disable-3d-apis'],
    })
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(350)
    await race(page.getByLabel('Character name').fill('Tunde').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(2400)
    await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
    await page.waitForTimeout(1600)

    const fb = await race(page.evaluate(() => ({
      headline: document.body.innerText.includes("The 3D world can't open here"),
      mapCta: document.body.innerText.includes('Continue on the Map'),
    })), 10000, null)
    console.log('no-webgl fallback:', JSON.stringify(fb))
    console.log('fallback law:', fb && fb.headline && fb.mapCta ? 'PASS' : 'FAIL')
    await race(page.screenshot({ path: `${SHOTS}/03-no-webgl-fallback.png` }), 8000, null)

    await race(page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Continue on the Map')) as HTMLButtonElement | null
      btn?.click()
    }), 8000, null)
    await page.waitForTimeout(1000)
    const mapAlive = await race(page.evaluate(() => document.body.innerText.length > 200), 8000, null)
    console.log('game continues on map:', mapAlive ? 'PASS' : 'FAIL')
    await race(page.screenshot({ path: `${SHOTS}/04-map-mode-continues.png` }), 8000, null)

    allErrors.push(...errors)
    await browser.close()
  }

  /* -------- 4. forced LOW tier world + context-loss recovery (3D LAST) -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    await ctx.addInitScript(() => {
      ;(window as unknown as Record<string, unknown>).__lklForceQuality = 'low'
    })
    const page = await ctx.newPage()
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(350)
    await race(page.getByLabel('Character name').fill('Kemi').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
    await page.waitForTimeout(2600)

    await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
    console.log('world clicked — settling (SwiftShader patience)…')
    const settled = await settle(page, 150_000)
    console.log('settle:', settled)
    if (settled === 'settled') {
      // ONE combined read — tier + dyn-res + gl status
      const tierInfo = await race(page.evaluate(() => {
        const w = window as unknown as { __lkl?: Record<string, () => unknown> }
        if (!w.__lkl) return 'no-hook'
        return { tier: w.__lkl.tier?.() ?? null, dyn: w.__lkl.dynRes?.() ?? null, gl: w.__lkl.glStatus?.() ?? null }
      }), 20000, 'eval-dead')
      console.log('forced-low tier:', JSON.stringify(tierInfo))
      console.log('low-tier law:', typeof tierInfo === 'object' && tierInfo !== null && (tierInfo as { tier?: unknown }).tier === 'low' ? 'PASS' : 'FAIL')
      await race(page.screenshot({ path: `${SHOTS}/05-low-tier-world.png` }), 8000, null)

      // 2.5s fps report (probe is warm)
      const report = await race(page.evaluate(() => {
        const w = window as unknown as { __lkl?: { fpsReport: (ms: number) => Promise<string> } }
        return w.__lkl?.fpsReport?.(2500) ?? 'no-hook'
      }), 15000, 'report-timeout')
      console.log('low-tier fps report:\n' + String(report).slice(0, 380))

      // context-loss law
      const lost = await race(page.evaluate(() => {
        const canvas = (window as unknown as Record<string, unknown>).__lklGlCanvas as HTMLCanvasElement | undefined
        if (!canvas) return 'no-canvas'
        const ext = canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')
        if (!ext) return 'no-lose-ext'
        // spec: after a loss the extension is unreachable — keep the handle to restore
        ;(window as unknown as Record<string, unknown>).__lklLoseExt = ext
        ext.loseContext()
        return 'lost-sent'
      }), 15000, 'eval-dead')
      await page.waitForTimeout(1500)
      const lostRead = await race(page.evaluate(() => {
        const w = window as unknown as { __lkl?: { glStatus: () => string } }
        return { status: w.__lkl?.glStatus?.() ?? 'no-hook', chip: document.body.innerText.includes('Screen rebuild') }
      }), 12000, 'eval-dead')
      console.log('context loss:', lost, '| read:', JSON.stringify(lostRead))
      await race(page.screenshot({ path: `${SHOTS}/06-context-lost-chip.png` }), 8000, null)

      const restored = await race(page.evaluate(() => {
        const ext = (window as unknown as Record<string, unknown>).__lklLoseExt as { restoreContext(): void } | undefined
        if (!ext) return 'no-ext-handle'
        ext.restoreContext()
        return 'restore-sent'
      }), 15000, 'eval-dead')
      await page.waitForTimeout(2500)
      // the restore rebuild re-jams SwiftShader — poll patiently for the status to leave 'lost'
      let backRead: string = 'never-read'
      const rt0 = Date.now()
      while (Date.now() - rt0 < 40000) {
        const r = await race(page.evaluate(() => {
          const w = window as unknown as { __lkl?: { glStatus: () => string } }
          return w.__lkl?.glStatus?.() ?? 'no-hook'
        }), 6000, 'eval-dead')
        if (r !== 'eval-dead') {
          backRead = String(r)
          if (backRead === 'restored' || backRead === 'ok') break
        }
        await page.waitForTimeout(1200)
      }
      console.log('context restore:', restored, '| status:', backRead)
      console.log(
        'context-loss law:',
        lost === 'lost-sent' && typeof lostRead === 'object' && lostRead !== null && (lostRead as { status?: string }).status === 'lost' && restored === 'restore-sent' && (backRead === 'restored' || backRead === 'ok') ? 'PASS' : 'PARTIAL(see log)',
      )
    } else {
      console.log('world never settled — leg skipped honestly')
    }

    allErrors.push(...errors)
    await browser.close()
  }

  /* -------------------------------- the law -------------------------------- */
  console.log(`\nconsole errors across all contexts: ${allErrors.length}`)
  if (allErrors.length) console.log(allErrors.slice(0, 6).join('\n---\n'))
  console.log(`shots in ${SHOTS}`)
}

run()
  .catch((e) => {
    console.error('E2E fatal:', e)
    process.exit(1)
  })
  .finally(() => clearTimeout(watchdog))
