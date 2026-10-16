/* PASS 4c — CLAIM A NAME through the real UI (kills the guest gate honestly),
   then the clean beauty shots. */
import { chromium } from 'playwright'
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}
const errors: string[] = []
const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 180)) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 180)))
  await race(page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1800)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await race(page.getByLabel('Character name').fill('Beauty Shot'), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(2200)
  await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  let settled = false
  for (let i = 0; i < 14; i++) {
    settled = await race(page.evaluate(() => {
      const l = (window as unknown as { __lkl?: { doors?: () => unknown[] } }).__lkl
      return !!l?.doors && l.doors().length > 0
    }), 4000, false)
    if (settled) break
    await page.waitForTimeout(2000)
  }
  console.log('settled:', settled)

  /* claim the name — the honest path. unique suffix per run. */
  const uniq = String(Math.floor(Math.random() * 9000) + 1000)
  await page.waitForTimeout(1200)
  await race(page.getByPlaceholder(/street name/i).fill('teardown' + uniq), 6000, null)
  await race(page.getByPlaceholder(/recovery/i).fill('teardown' + uniq + '@lko.ng'), 6000, null)
  await race(page.getByPlaceholder(/PIN/i).fill('1234'), 6000, null)
  const claimed = await race(page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((e) => (e.textContent ?? '').includes('Claim my name'))
    if (b) { b.click(); return true }
    return false
  }), 6000, false)
  console.log('claim clicked:', claimed, 'as teardown' + uniq)
  await page.waitForTimeout(3500)
  const gateGone = await race(page.evaluate(() => !document.body.innerText.includes('Claim my name')), 5000, false)
  console.log('gate gone?', gateGone)

  await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { travel?: (s: string) => void } }).__lkl
    l?.travel?.('mount-patti')
  }), 6000, null)
  await page.waitForTimeout(3500)
  await race(page.screenshot({ path: '/home/z/my-project/download/teardown-ours/42-patti-clean.png' }), 8000, null)
  console.log('✓ patti')

  await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { travel?: (s: string) => void } }).__lkl
    l?.travel?.('confluence')
  }), 6000, null)
  await page.waitForTimeout(3500)
  await race(page.screenshot({ path: '/home/z/my-project/download/teardown-ours/43-confluence-clean.png' }), 8000, null)
  console.log('✓ confluence')

  const door = await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { doors?: () => Array<{ id: string }>; enter?: (s: string) => void } }).__lkl
    const ds = l?.doors?.() ?? []
    if (ds.length) { const d = ds[Math.floor(ds.length / 2)]; l?.enter?.(d.id); return d.id }
    return null
  }), 6000, null)
  await page.waitForTimeout(3500)
  await race(page.screenshot({ path: '/home/z/my-project/download/teardown-ours/44-interior-clean.png' }), 8000, null)
  console.log('✓ interior', door)
  await browser.close()
}
run().then(() => { console.log(`DONE ${errors.length} errors`); if (errors.length) console.log(errors.slice(0, 5).join('\n')); process.exit(0) })
  .catch((e) => { console.error(e); process.exit(1) })
