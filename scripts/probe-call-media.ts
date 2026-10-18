/** probe: dial → answer → dump BOTH sides' voice state every 2s */
import { chromium } from 'playwright'

const BASE = 'http://localhost:81'
const stamp = Date.now().toString(36).slice(-5)
const A = `prb_${stamp}`
const B = `prb2_${stamp}`

async function walker(handle: string, browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['microphone'] })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') console.log(`[${handle} ERR]`, m.text().slice(0, 160)) })
  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.getByTestId('menu-auth-open').click({ timeout: 15_000 })
  await page.getByTestId('auth-tab-claim').click({ timeout: 5_000 })
  await page.getByTestId('auth-handle').fill(handle)
  await page.getByTestId('auth-pin').fill('1357')
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill('Ada', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  return page
}

const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'] })
const pa = await walker(A, browser)
const pb = await walker(B, browser)

// both open calls (wire + hook)
for (const [tag, p] of [['A', pa], ['B', pb]] as const) {
  await p.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
  await p.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  await p.getByText('Calls', { exact: true }).first().click({ timeout: 10_000 })
  await p.waitForTimeout(1200)
  console.log(tag, 'hook:', await p.evaluate(`!!window.__lklVoice`))
}
// B to world (banner)
await pb.getByRole('button', { name: 'World', exact: true }).click({ timeout: 6_000 })

// A dials
await pa.getByText(`@${B}`, { exact: false }).first().click({ timeout: 8_000 })
await pa.getByTestId('calls-dial-voice').click({ timeout: 6_000 })
await pb.waitForSelector('[data-testid="call-banner"]', { timeout: 10_000 })
console.log('RING on B ✓')
await pb.getByTestId('call-banner-answer').click({ timeout: 10_000, force: true })
console.log('B answered')

for (let i = 0; i < 8; i++) {
  await pa.waitForTimeout(2000)
  const sa = await pa.evaluate(() => {
    const v = (window as unknown as { __lklVoice?: { call: () => unknown } }).__lklVoice
    return v ? JSON.stringify(v.call()) : 'no-hook'
  })
  const pairs = await pa.evaluate(async () => {
    const v = (window as unknown as { __lklVoice?: { pairs: () => Promise<unknown> } }).__lklVoice
    return v ? JSON.stringify(await v.pairs()) : '-'
  })
  console.log(`t=${(i + 1) * 2}s A-call=${sa}`)
  console.log(`   A-pairs=${pairs}`)
  if (i === 2) break
}
await browser.close()
process.exit(0)
