/* probe: what does the DESKTOP menu actually render? */
import { chromium } from 'playwright'
const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  await page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  const txt = await page.evaluate(() => document.body.innerText.slice(0, 500))
  const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map((b) => b.innerText.slice(0, 40)))
  console.log('TEXT:', JSON.stringify(txt))
  console.log('BUTTONS:', JSON.stringify(btns))
  await browser.close()
}
run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
