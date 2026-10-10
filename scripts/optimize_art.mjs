/**
 * LOKOJA LIFE — Art optimizer (R2-ART)
 * research/art-raw (masters) → public/art (game-ready, resized, still PNG for canvas use)
 * Run: bun scripts/optimize_art.mjs
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SRC = '/home/z/my-project/research/art-raw'
const OUT = '/home/z/my-project/public/art'
fs.mkdirSync(OUT, { recursive: true })

// target widths — cards render at ~340-400px on screen (2x dpr → 800), ads on billboards 512
const PLAN = [
  { file: 'menu-hero.png', width: 1344 },
  ...fs.readdirSync(SRC).filter((f) => f.startsWith('loc-')).map((f) => ({ file: f, width: 800 })),
  ...fs.readdirSync(SRC).filter((f) => f.startsWith('ad-')).map((f) => ({ file: f, width: 640 })),
]

async function run() {
  let total = 0
  for (const { file, width } of PLAN) {
    const src = path.join(SRC, file)
    if (!fs.existsSync(src)) {
      console.error(`missing master: ${file}`)
      process.exitCode = 1
      continue
    }
    const out = path.join(OUT, file.replace(/\.png$/, '.webp'))
    const buf = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
    fs.writeFileSync(out, buf)
    total += buf.length
    console.log(`✓ ${file} → ${Math.round(buf.length / 1024)} KB (${width}w)`)
  }
  console.log(`\nTOTAL: ${Math.round(total / 1024)} KB in ${OUT}`)
}
run()
