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
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  const env = await race(page.evaluate(() => ({
    deviceMemory: (navigator as any).deviceMemory,
    coarse: window.matchMedia('(pointer: coarse)').matches,
    ua: navigator.userAgent.slice(0, 60),
  })), 8000, null)
  console.log('env:', JSON.stringify(env))
  await browser.close().catch(() => {})
}
run().catch((e) => { console.error('failed', String(e).slice(0, 200)); process.exit(1) })
