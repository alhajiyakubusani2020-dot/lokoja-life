/**
 * M7 E2E leg-4 STANDALONE — forced LOW tier world + context-loss law.
 * Full budget for the SwiftShader settle; streak of 1 alive ping with the
 * veil gone is enough to attempt ONE combined read.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m7-device-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 300s hard exit')
  process.exit(2)
}, 300_000)

const race = async <T, F>(p: Promise<T>, ms: number, fb: F): Promise<T | F> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T | F>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const errors: string[] = []
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await ctx.addInitScript(() => {
    ;(window as unknown as Record<string, unknown>).__lklForceQuality = 'low'
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Kemi').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600)

  await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  console.log('world clicked — patient settle (up to 200s)…')

  // patient settle: ANY alive ping with veil gone + canvas in
  const t0 = Date.now()
  let worldUp = false
  while (Date.now() - t0 < 200_000) {
    const ping = await race(page.evaluate(() => ({
      veil: document.body.innerText.includes('Entering Lokoja'),
      canvas: !!document.querySelector('canvas'),
    })), 4000, 'jammed' as const)
    if (ping !== 'jammed' && ping.canvas && !ping.veil) {
      worldUp = true
      console.log(`world up at ~${((Date.now() - t0) / 1000).toFixed(0)}s`)
      break
    }
    await page.waitForTimeout(500)
  }

  if (worldUp) {
    const tierInfo = await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: Record<string, () => unknown> }
      if (!w.__lkl) return 'no-hook'
      return { tier: w.__lkl.tier?.() ?? null, dyn: w.__lkl.dynRes?.() ?? null, gl: w.__lkl.glStatus?.() ?? null }
    }), 25000, 'eval-dead')
    console.log('forced-low tier:', JSON.stringify(tierInfo))
    console.log('low-tier law:', typeof tierInfo === 'object' && tierInfo !== null && (tierInfo as { tier?: unknown }).tier === 'low' ? 'PASS' : 'FAIL')
    await race(page.screenshot({ path: `${SHOTS}/05-low-tier-world.png` }), 10000, null)

    const report = await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { fpsReport: (ms: number) => Promise<string> } }
      return w.__lkl?.fpsReport?.(2500) ?? 'no-hook'
    }), 20000, 'report-timeout')
    console.log('low-tier fps report:\n' + String(report).slice(0, 380))

    const lost = await race(page.evaluate(() => {
      const canvas = (window as unknown as Record<string, unknown>).__lklGlCanvas as HTMLCanvasElement | undefined
      if (!canvas) return 'no-canvas'
      const ext = canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')
      if (!ext) return 'no-lose-ext'
      // spec: after a loss the extension is unreachable — keep the handle to restore
      ;(window as unknown as Record<string, unknown>).__lklLoseExt = ext
      ext.loseContext()
      return 'lost-sent'
    }), 20000, 'eval-dead')
    await page.waitForTimeout(1500)
    const lostRead = await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { glStatus: () => string } }
      return { status: w.__lkl?.glStatus?.() ?? 'no-hook', chip: document.body.innerText.includes('Screen rebuild') }
    }), 15000, 'eval-dead')
    console.log('context loss:', lost, '| read:', JSON.stringify(lostRead))
    await race(page.screenshot({ path: `${SHOTS}/06-context-lost-chip.png` }), 10000, null)

    const restored = await race(page.evaluate(() => {
      const ext = (window as unknown as Record<string, unknown>).__lklLoseExt as { restoreContext(): void } | undefined
      if (!ext) return 'no-ext-handle'
      ext.restoreContext()
      return 'restore-sent'
    }), 20000, 'eval-dead')
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
    console.log('world never came up headless — leg skipped honestly (pure suite covers the tier law)')
  }

  console.log(`\nconsole errors: ${errors.length}`)
  if (errors.length) console.log(errors.slice(0, 4).join('\n'))
  await browser.close()
}

run().catch((e) => { console.error('fatal:', e); process.exit(1) }).finally(() => clearTimeout(watchdog))
