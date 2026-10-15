/**
 * LOKOJA LIFE — M16: THE PWA ICON FORGE
 * --------------------------------------
 * Rasterizes the game's icon mark (the Confluence: two rivers meeting
 * on a Nigerian-green field under the harmattan sun) into every size
 * the manifest, iOS and the maskable safe zones need.
 *
 * Deterministic: the same script mints the same bytes — the icon is
 * rendered from one SVG, screenshotted by Playwright at exact sizes,
 * and the manifest speaks only files this script can re-mint.
 *
 * Run: bun scripts/gen_icons.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const OUT = '/home/z/my-project/public/icons'
mkdirSync(OUT, { recursive: true })

/** The mark: green field, the Niger + Benue Y-confluence, the sun. */
const markSvg = (pad = 0) => {
  // pad grows the safe-zone inset for maskable renders (content must
  // survive any circular mask: keep the mark inside the inner 80%).
  const p = pad
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0f5c30"/>
      <stop offset="1" stop-color="#146b3a"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="512" height="512" fill="url(#sky)"/>
  <!-- the harmattan sun -->
  <circle cx="${368 - p * 0.6}" cy="${132 + p * 0.4}" r="${58 - p * 0.3}" fill="#f2c94c" opacity="0.95"/>
  <!-- the Benue: from the north-west -->
  <path d="M ${-40 + p} ${150 + p} C ${120} ${190 - p}, ${170} ${250 - p * 0.5}, ${256} ${286 - p * 0.4} L ${256} ${286 - p * 0.4} C ${300} ${300 - p * 0.3}, ${330} ${320 - p * 0.3}, ${360 + p * 0.5} ${356 + p} L ${512 - p} ${420 - p * 0.8} L ${512 - p} ${512 - p} L ${-40 + p} ${512 - p} Z" fill="#3b82c4" opacity="0.92"/>
  <!-- the Niger: from the north-east, wider — they meet at the Confluence -->
  <path d="M ${552 - p} ${96 + p} C ${420} ${140 - p * 0.6}, ${330} ${210 - p * 0.4}, ${262} ${278 - p * 0.3} C ${230} ${318 - p * 0.3}, ${180 + p} ${360 + p * 0.4}, ${90 + p} ${400 + p * 0.6} L ${-40 + p} ${440 + p * 0.5} L ${-40 + p} ${512 - p} L ${552 - p} ${512 - p} Z" fill="#2f6ea5" opacity="0.95"/>
  <!-- the meeting line: where the two waters braid -->
  <path d="M ${262} ${278 - p * 0.3} C ${236} ${314 - p * 0.3}, ${196 + p} ${348 + p * 0.3}, ${150 + p} ${372 + p * 0.5}" stroke="#bfe0f2" stroke-width="${10 - p * 0.4}" fill="none" opacity="0.65" stroke-linecap="round"/>
  <!-- the shore: Lokoja rises on the near bank -->
  <circle cx="${150 + p}" cy="${372 + p * 0.5}" r="${14 - p * 0.3}" fill="#f5edd8"/>
  <circle cx="${150 + p}" cy="${372 + p * 0.5}" r="${26 - p * 0.5}" fill="none" stroke="#f5edd8" stroke-width="6" opacity="0.5"/>
</svg>`
}

const html = (pad) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}html,body{width:512px;height:512px;overflow:hidden}</style></head><body>${markSvg(pad)}</body></html>`

const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 })

/** Render at 512 then downscale via browser at each exact size. */
async function mint(name, px, pad) {
  await page.setContent(html(pad), { waitUntil: 'load' })
  // rasterize the 512 mark, then let the browser resample to px
  const buf = await page.evaluate(async (pxSize) => {
    const svgEl = document.querySelector('svg')
    // serialize + draw at the target size on a canvas (crisp resample)
    const xml = new XMLSerializer().serializeToString(svgEl)
    const img = new Image()
    await new Promise((res, rej) => {
      img.onload = res
      img.onerror = rej
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)))
    })
    const c = document.createElement('canvas')
    c.width = pxSize
    c.height = pxSize
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0, pxSize, pxSize)
    const b64 = c.toDataURL('image/png').split(',')[1]
    return b64
  }, px)
  writeFileSync(`${OUT}/${name}`, Buffer.from(buf, 'base64'))
  console.log('  🖼 ', name, `${px}px`)
}

await mint('icon-192.png', 192, 0)
await mint('icon-512.png', 512, 0)
await mint('icon-512-maskable.png', 512, 56)
await mint('apple-touch-icon.png', 180, 12)
await mint('icon-192-maskable.png', 192, 22)

await browser.close()
console.log('THE ICON FORGE — done.')
