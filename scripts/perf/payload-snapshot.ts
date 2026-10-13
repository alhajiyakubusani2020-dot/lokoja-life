/**
 * Task 13-a (perf-auditor) — PAYLOAD CENSUS, curl-based.
 *
 * Fetches the running dev server's HTML at http://localhost:3000/, extracts every
 * <script src>, <link href> and <img src>, fetches each with `curl --compressed`
 * and records the WIRE (transfer) bytes. Also parses fetched CSS for font urls.
 *
 * MEASURE ONLY — writes research/frag-payload-curl.json. Touches nothing under src/ or public/.
 *
 * Caveat (stated in report): dev bundles are UNMINIFIED and this snapshot only sees
 * resources declared in the initial HTML — lazy chunks (three.js world etc.) are
 * captured separately by the Playwright CDP network run.
 */
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

const BASE = process.env.PERF_BASE ?? 'http://localhost:3000'
const OUT = '/home/z/my-project/research/frag-payload-curl.json'

function curlWire(url: string): { wire: number; contentType: string; http: number } {
  try {
    const out = execSync(
      `curl -sS --compressed -o /dev/null -w '%{size_download} %{content_type} %{http_code}' --max-time 40 "${url}"`,
      { encoding: 'utf8', timeout: 45000 },
    )
    const [wire, contentType, http] = out.trim().split(/\s+/)
    return { wire: Number(wire) || 0, contentType: contentType || 'unknown', http: Number(http) || 0 }
  } catch (e) {
    return { wire: -1, contentType: `error:${String(e).slice(0, 60)}`, http: 0 }
  }
}

function curlBody(url: string): string {
  try {
    return execSync(`curl -sS --compressed --max-time 40 "${url}"`, { encoding: 'utf8', timeout: 45000, maxBuffer: 64 * 1024 * 1024 })
  } catch {
    return ''
  }
}

const html = curlBody(BASE)
const htmlWire = curlWire(BASE)

type Res = { url: string; kind: string; wire: number; contentType: string; http: number }
const seen = new Set<string>()
const resources: Res[] = []

const add = (raw: string, kind: string) => {
  let u: URL
  try {
    u = new URL(raw, BASE)
  } catch {
    return
  }
  if (u.origin !== BASE && !u.href.startsWith(BASE)) return // skip external CDNs (none expected)
  if (seen.has(u.href)) return
  seen.add(u.href)
  const w = curlWire(u.href)
  resources.push({ url: u.pathname + u.search, kind, ...w })
}

// <script src=...>
for (const m of html.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/g)) add(m[1], 'script')
// <link href=...> (stylesheets, icon, preloads — deduped against scripts)
for (const m of html.matchAll(/<link[^>]*>/g)) {
  const tag = m[0]
  const href = tag.match(/href=["']([^"']+)["']/)?.[1]
  if (!href) continue
  const rel = tag.match(/rel=["']([^"']+)["']/)?.[1] ?? ''
  const as = tag.match(/as=["']([^"']+)["']/)?.[1] ?? ''
  const kind = rel.includes('stylesheet') ? 'style' : as === 'font' || href.match(/\.(woff2?|ttf|otf)(\?|$)/) ? 'font' : `link:${rel || 'other'}`
  add(href, kind)
}
// <img src=...> / srcset first candidate (menu art etc. — for the above-the-fold estimate)
for (const m of html.matchAll(/<img[^>]*>/g)) {
  const tag = m[0]
  const src = tag.match(/src=["']([^"']+)["']/)?.[1]
  if (src) add(src, 'img')
}

// fonts referenced inside fetched CSS
for (const r of [...resources]) {
  if (r.kind !== 'style' || r.wire < 0) continue
  const css = curlBody(BASE + r.url)
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) {
    const raw = m[1].replace(/["']/g, '').trim()
    if (!raw || raw.startsWith('data:')) continue
    if (/\.(woff2?|ttf|otf)(\?|$)/.test(raw)) add(raw, 'font')
  }
}

const sum = (kind: string) => resources.filter((r) => r.kind === kind).reduce((a, r) => a + Math.max(r.wire, 0), 0)
const totals = {
  html: htmlWire.wire,
  js: sum('script'),
  css: sum('style'),
  font: sum('font'),
  img: sum('img'),
  linkOther: resources.filter((r) => r.kind.startsWith('link:')).reduce((a, r) => a + Math.max(r.wire, 0), 0),
  grandTotal: resources.reduce((a, r) => a + Math.max(r.wire, 0), 0) + htmlWire.wire,
}

const report = {
  ts: new Date().toISOString(),
  base: BASE,
  caveat: 'dev bundles are UNMINIFIED (next dev, no build); wire bytes are gzip/br transfer sizes via curl --compressed; snapshot covers only resources declared in the served HTML (lazy chunks measured separately via CDP)',
  htmlWireBytes: htmlWire.wire,
  resourceCount: resources.length,
  resources: resources.sort((a, b) => b.wire - a.wire),
  totals,
}
writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log('resources:', resources.length, 'totals:', JSON.stringify(totals))
console.log('WROTE', OUT)
