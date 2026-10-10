/**
 * LOKOJA LIFE — Original Asset Factory (R2-ART)
 * ----------------------------------------------
 * Generates 100% ORIGINAL art assets for Lokoja Life via z-ai-web-dev-sdk.
 * One consistent art direction across the whole set so it reads as a single
 * artist's work: stylized painterly game-art, warm West African palette.
 * NOTHING is copied from any competitor — all prompts are original.
 *
 * Raw output:  research/art-raw/   (full-res masters, not user-facing)
 * Optimized:   public/art/         (by optimize_art.mjs, sharp resize)
 *
 * Run: bun scripts/gen_art.mjs
 */
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const RAW_DIR = '/home/z/my-project/research/art-raw'
fs.mkdirSync(RAW_DIR, { recursive: true })

/** Shared art direction — the single source of the set's cohesion. */
const STYLE =
  'stylized painterly video game concept art, warm West African palette of terracotta, ' +
  'golden yellow and deep green, soft golden-hour lighting, gentle film grain, ' +
  'clean readable composition, rich detail, no text, no words, no letters, no watermark, no logo'

const ADS_STYLE =
  'flat bold vector-style advertising artwork, vibrant saturated colors, dynamic shapes, ' +
  'poster composition, no text, no words, no letters, no watermark, no logo'

/** The full asset manifest. */
const ASSETS = [
  // ---- Hero (menu backdrop) -------------------------------------------------
  {
    file: 'menu-hero.png',
    size: '1344x768',
    prompt:
      'Wide panoramic view of a Nigerian river town at golden hour: a great hill with a radio mast on the left, ' +
      'two wide rivers meeting at a sparkling confluence on the right, small boats on the water, ' +
      'terracotta rooftops and green trees between, a tiny three-wheeled taxi on a dust road, warm haze over everything, ' +
      STYLE,
  },

  // ---- 10 location cards ----------------------------------------------------
  {
    file: 'loc-home.png',
    size: '1152x864',
    prompt:
      'Cozy courtyard of a modest Nigerian family compound in the afternoon: ' +
      'cement bungalow with blue painted door, clotheslines with bright laundry, plastic chairs, ' +
      'potted plants, a cooking pot on a fire, warm homely feeling, ' + STYLE,
  },
  {
    file: 'loc-kpata-market.png',
    size: '1152x864',
    prompt:
      'Bustling open-air West African market under colorful umbrellas: stalls piled with tomatoes, peppers and yams, ' +
      'bright Ankara fabric stalls, women in colourful wrappers trading, wooden tables, lively warm crowd, ' +
      STYLE,
  },
  {
    file: 'loc-ganaja-junction.png',
    size: '1152x864',
    prompt:
      'Busy Nigerian road junction in a small city: roundabout with a simple monument, ' +
      'three-wheeled auto-rickshaws and motorcycles passing, small roadside shops with corrugated metal awnings, ' +
      'dusty warm light, energy of daily commerce, ' + STYLE,
  },
  {
    file: 'loc-confluence.png',
    size: '1152x864',
    prompt:
      'Majestic meeting of two great rivers of different shades at a wide confluence, ' +
      'a visible line where the waters meet, wooden fishing boats, sandy shoreline with grass, ' +
      'distant hills under dramatic warm sky, ' + STYLE,
  },
  {
    file: 'loc-mount-patti.png',
    size: '1152x864',
    prompt:
      'A tall green hill with a winding dirt trail to the summit and a small radio mast on top, ' +
      'view over a sprawling river town far below, rocky outcrops, birds circling, adventure feeling, ' +
      STYLE,
  },
  {
    file: 'loc-historic-lokoja.png',
    size: '1152x864',
    prompt:
      'Historic colonial-era West African buildings: weathered brick walls, corrugated iron roofs, ' +
      'deep verandas with wooden columns, an old flagpole on a green lawn, large shade trees, ' +
      'museum-like peaceful dignity, ' + STYLE,
  },
  {
    file: 'loc-government-area.png',
    size: '1152x864',
    prompt:
      'Quiet upscale government residential street: gated low bungalows with trimmed hedges, ' +
      'tall palm trees, smooth asphalt road, neat sidewalks, calm prestige atmosphere, late afternoon shade, ' +
      STYLE,
  },
  {
    file: 'loc-university-area.png',
    size: '1152x864',
    prompt:
      'Nigerian university campus walkway: modest faculty building with louvre windows, ' +
      'students in casual and traditional clothing walking with books, mango trees, bicycle racks, ' +
      'youthful hopeful energy, ' + STYLE,
  },
  {
    file: 'loc-food-area.png',
    size: '1152x864',
    prompt:
      'Evening Nigerian street food strip: smoke rising from a suya grill with skewers, ' +
      'glowing string lights over wooden benches, steaming pots, plastic tables, hungry happy crowd silhouettes, ' +
      'delicious warm night atmosphere, ' + STYLE,
  },
  {
    file: 'loc-transport-area.png',
    size: '1152x864',
    prompt:
      'Energetic Nigerian motor park: colorful minibuses and three-wheeled taxis queuing, ' +
      'young loaders carrying sacks and goods, conductor calling destinations, dust and warm light, ' +
      'organized chaos of daily travel, ' + STYLE,
  },

  // ---- 3 billboard artworks (text added procedurally later, crisp) ----------
  {
    file: 'ad-soda.png',
    size: '1024x1024',
    prompt:
      'Soda drink advertisement artwork: dynamic splash of golden orange soda around a tall frosty bottle silhouette, ' +
      'ice cubes and citrus slices flying, bold gradient background, refreshing energy, ' + ADS_STYLE,
  },
  {
    file: 'ad-telco.png',
    size: '1024x1024',
    prompt:
      'Telecom advertisement artwork: glowing green network of connected light lines and signal waves over a stylized city silhouette, ' +
      'signal tower radiating rings, optimistic connectivity feeling, ' + ADS_STYLE,
  },
  {
    file: 'ad-fabric.png',
    size: '1024x1024',
    prompt:
      'Textile brand advertisement artwork: flowing bolts of colorful patterned West African fabric swirling elegantly, ' +
      'Ankara and Adire patterns, rich indigo gold and crimson ribbons of cloth, luxurious movement, ' + ADS_STYLE,
  },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function generate(zai, asset, attempt = 1) {
  const out = path.join(RAW_DIR, asset.file)
  if (fs.existsSync(out) && fs.statSync(out).size > 10000) {
    console.log(`↷ skip (exists): ${asset.file}`)
    return true
  }
  try {
    const res = await zai.images.generations.create({
      prompt: asset.prompt,
      size: asset.size,
    })
    const b64 = res?.data?.[0]?.base64
    if (!b64 || b64.length < 1000) throw new Error('empty/short base64 payload')
    fs.writeFileSync(out, Buffer.from(b64, 'base64'))
    console.log(`✓ ${asset.file} (${Math.round(fs.statSync(out).size / 1024)} KB)`)
    return true
  } catch (e) {
    console.error(`✗ attempt ${attempt} failed for ${asset.file}: ${e.message}`)
    if (attempt < 3) {
      await sleep(1500 * attempt)
      return generate(zai, asset, attempt + 1)
    }
    return false
  }
}

async function main() {
  const only = process.argv[2] // optional: generate a single file by name
  const list = only ? ASSETS.filter((a) => a.file === only) : ASSETS
  if (list.length === 0) {
    console.error(`no asset named ${only}`)
    process.exit(1)
  }
  const zai = await ZAI.create()
  let ok = 0
  for (const a of list) {
    const done = await generate(zai, a)
    if (done) ok += 1
    await sleep(400)
  }
  console.log(`\nDONE: ${ok}/${list.length} generated → ${RAW_DIR}`)
  if (ok < list.length) process.exit(2)
}

main()
