/**
 * LOKOJA LIFE — M24 W7: THE VOICE WITNESS (E2E, fresh-context)
 * ============================================================
 * TWO real walkers, the REAL gateway (:81 — the Caddy XTransformPort
 * door), the REAL wire (:3003 behind it), REAL WebRTC media between
 * two browser contexts (Chromium's fake audio device — a real mic
 * stream, real PeerConnections, real RTP bytes on loopback).
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-home             — walker A claimed, alive, in the world
 *   02 calls-directory    — the Calls face showing @B ● online
 *   03 b-ring-banner      — B's WORLD: LIVE WIRE — the real ring banner
 *   04 a-active-voice     — A's active screen: timer + LIVE VOICE chip
 *   05 b-active-voice     — B's active screen (the same call)
 *   06 ended-truth        — the ended card tells the truth
 *   07 declined-truth     — a decline travels as declined
 *
 * THE LAWS WITNESSED:
 *  - the dial rings a REAL online paddy through the REAL gateway
 *  - the banner says LIVE WIRE (a real ring, not the labeled demo)
 *  - the answer opens a REAL peer-to-peer voice: BOTH peers report
 *    pc 'connected' AND inbound audio bytes > 0 (read from
 *    RTCPeerConnection.getStats — the money shot reads REAL numbers)
 *  - mute is a real switch (aria-pressed truth)
 *  - the hangup ends BOTH phones honestly
 *  - a decline travels as declined
 *  - the street walkie is DARK by default (the opt-in law)
 *  - zero console errors across both walkers
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-voice-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `voia_${stamp}`
const HANDLE_B = `voib_${stamp}`

mkdirSync(SHOTS, { recursive: true })

let browser: Browser | null = null
let ctxA: BrowserContext | null = null
let ctxB: BrowserContext | null = null

const consoleErrors: string[] = []
let shots = 0
const failures: string[] = []

async function snap(page: Page, name: string) {
  shots++
  await page.screenshot({ path: `${SHOTS}/${String(shots).padStart(2, '0')}-${name}.png`, fullPage: false })
  console.log(`  📸 ${String(shots).padStart(2, '0')}-${name}`)
}

function check(name: string, cond: boolean, detail?: string) {
  if (cond) console.log(`  ✓ ${name}`)
  else {
    failures.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

interface VoiceDebug {
  call: () => { callId: string; peer: string; pc: string; remoteSet: boolean } | null
  pv: () => string[]
  stats: () => Promise<{ rx: number; tx: number }>
}

/** the decline-round diagnostic: the call machine's shape, page-side */
function useSocialStoreDebug(): unknown {
  const w = window as unknown as { __lklVoiceDebug?: unknown }
  return w.__lklVoiceDebug ?? { note: 'no debug hook' }
}

async function walker(handle: string): Promise<{ page: Page; ctx: BrowserContext }> {
  // THE FAKE MIC LAW: --use-fake-device-for-media-stream gives a REAL
  // MediaStream (real track, real RTP when connected) without hardware.
  const ctx = await browser!.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['microphone'],
  })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`[${handle}] ${m.text().slice(0, 200)}`)
  })
  page.on('pageerror', (e) => consoleErrors.push(`[${handle}] pageerror: ${String(e).slice(0, 200)}`))

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.getByTestId('menu-auth-open').click({ timeout: 15_000 })
  await page.waitForSelector('[data-testid="menu-auth-sheet"]', { timeout: 10_000 })
  await page.getByTestId('auth-tab-claim').click({ timeout: 5_000 })
  await page.getByTestId('auth-handle').fill(handle)
  await page.getByTestId('auth-pin').fill('1357')
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-next').click({ timeout: 10_000 })   // W1 — step 2: the face
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill('Adaeze', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  return { page, ctx }
}

async function openCalls(page: Page) {
  await page.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
  await page.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  await page.getByText('Calls', { exact: true }).first().click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="calls-target"], .lko-display', { timeout: 10_000 })
}

async function voiceDebug(page: Page): Promise<VoiceDebug> {
  return (await page.evaluate(() => (window as unknown as { __lklVoice?: VoiceDebug }).__lklVoice)) as VoiceDebug
}

/** poll an async predicate from the PAGE's own debug hook (runs in-page) */
async function waitFor(page: Page, what: string, ms: number, probe: string): Promise<unknown> {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    const v = await page.evaluate(probe).catch(() => null)
    if (v) return v
    await page.waitForTimeout(200)
  }
  throw new Error(`${what} never arrived within ${ms}ms`)
}

try {
  console.log('\n── walker A claims and enters ──')
  browser = await chromium.launch({
    args: ['--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  })
  const a = await walker(HANDLE_A)
  ctxA = a.ctx
  const pa = a.page
  await snap(pa, 'a-home')

  console.log('\n── walker B claims and enters ──')
  const b = await walker(HANDLE_B)
  ctxB = b.ctx
  const pb = b.page

  // B opens the Calls face FIRST — the wireEnsure inside puts B's phone
  // ON the wire (A's directory reads that roster), then B walks the
  // world tab where the diegetic banner lives
  await openCalls(pb)
  await pb.getByRole('button', { name: 'World', exact: true }).click({ timeout: 6_000 })

  /* ── A opens Calls, finds B online, dials ── */
  console.log('\n── THE REAL DIAL ──')
  await openCalls(pa)
  await pa.waitForSelector(`text=@${HANDLE_B}`, { timeout: 10_000 })
  await snap(pa, 'calls-directory')
  await pa.getByText(`@${HANDLE_B}`, { exact: false }).first().click({ timeout: 6_000 })
  await pa.waitForSelector('[data-testid="calls-dial-voice"]', { timeout: 6_000 })
  const t0 = Date.now()
  await pa.getByTestId('calls-dial-voice').click()

  /* ── B's phone rings — the REAL ring (LIVE WIRE banner) ── */
  await pb.waitForSelector('[data-testid="call-banner"]', { timeout: 10_000 })
  const bannerText = await pb.getByTestId('call-banner').textContent()
  check(`B's banner says LIVE WIRE (a real ring, not the demo) in ${(Date.now() - t0) / 1000}s`, (bannerText ?? '').includes('LIVE WIRE'), bannerText ?? 'none')
  await snap(pb, 'b-ring-banner')

  /* ── B answers — the media plane comes alive ── */
  await pb.getByTestId('call-banner-answer').click({ timeout: 6_000 })
  await pa.waitForSelector('[data-testid="calls-screen-active"]', { timeout: 8_000 })
  check('A reaches the active screen (the machine answers the answer)', true)

  // THE MEDIA TRUTH: both PeerConnections reach 'connected'
  const aState = (await waitFor(pa, "A's pc connected", 20_000, `window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().pc === 'connected'`)) as unknown as boolean
  check("A's PeerConnection is CONNECTED (real ICE on loopback)", !!aState)
  const bState = await waitFor(pb, "B's pc connected", 20_000, `window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().pc === 'connected'`)
  check("B's PeerConnection is CONNECTED", !!bState)

  // THE MONEY SHOT: REAL audio bytes flow B → A and A → B
  const aBytes = (await waitFor(pa, 'A receives audio bytes', 20_000, `(async () => { const s = await window.__lklVoice.stats(); return s.rx > 0 ? s : null })()`)) as { rx: number; tx: number }
  check(`REAL AUDIO FLOWS — A received ${aBytes.rx} bytes of B's voice`, aBytes.rx > 0)
  const bBytes = await waitFor(pb, "B receives audio bytes", 20_000, `(async () => { const s = await window.__lklVoice.stats(); return s.rx > 0 ? s : null })()`) as { rx: number; tx: number }
  check(`REAL AUDIO FLOWS BOTH WAYS — B received ${bBytes.rx} bytes of A's voice`, bBytes.rx > 0)
  await pa.waitForTimeout(1200)
  await snap(pa, 'a-active-voice')

  /* ── B walks back to the phone — the same call in the Calls face ── */
  await pb.getByTestId('world-phone-fab').click({ timeout: 8_000 })
  await pb.getByText('Calls', { exact: true }).first().click({ timeout: 8_000 })
  await pb.waitForSelector('[data-testid="calls-screen-active"]', { timeout: 8_000 })
  await snap(pb, 'b-active-voice')

  /* ── the mute is a real switch ── */
  await pa.locator('[data-testid="calls-active-controls"] button').first().click()
  const mutedPressed = await pa.locator('[data-testid="calls-active-controls"] button').first().getAttribute('aria-pressed')
  check('mute flips to pressed (the honest aria truth)', mutedPressed === 'true')

  /* ── A hangs up — both phones end honestly ── */
  await pa.getByTestId('calls-hangup').click({ timeout: 6_000 })
  await pb.waitForSelector('[data-testid="calls-screen-ended"]', { timeout: 8_000 })
  const bEnded = await pb.getByTestId('calls-screen-ended').textContent()
  check("the hangup lands on B's phone with the honest why", (bEnded ?? '').includes('you hang up') || (bEnded ?? '').includes('hang up'), bEnded ?? 'none')
  await snap(pb, 'ended-truth')
  await pb.getByTestId('calls-done').click({ timeout: 6_000 })
  // close the overlay — back to the world where the banner lives
  await pb.locator('[data-testid="world-phone-overlay"]').click({ position: { x: 10, y: 10 }, timeout: 6_000 }).catch(() => {})

  /* ── the decline truth: A dials again, B declines from the banner ── */
  await pa.getByTestId('calls-done').click({ timeout: 6_000 })
  await pa.getByText('👥 People').click({ timeout: 6_000 })
  await pa.getByText(`@${HANDLE_B}`, { exact: false }).first().click({ timeout: 6_000 })
  await pa.getByTestId('calls-dial-voice').click({ timeout: 6_000 })
  await pb.waitForSelector('[data-testid="call-banner"]', { timeout: 10_000 })
  await pb.getByTestId('call-banner-decline').click({ timeout: 6_000, force: true })
  let aEnded: string | null = null
  for (let i = 0; i < 20; i++) {
    await pa.waitForTimeout(500)
    aEnded = await pa.getByTestId('calls-screen-ended').textContent().catch(() => null)
    if (i === 0 || aEnded) {
      const now = Date.now()
      const dumpA = await pa.evaluate(() => JSON.stringify((window as unknown as { __lklVoiceDebug?: () => unknown }).__lklVoiceDebug?.()))
      const dumpB = await pb.evaluate(() => JSON.stringify((window as unknown as { __lklVoiceDebug?: () => unknown }).__lklVoiceDebug?.()))
      console.log(`  [dbg t${i}] now=${now}`)
      console.log(`  [dbg t${i}] A=${dumpA}`)
      console.log(`  [dbg t${i}] B=${dumpB}`)
    }
    if (aEnded) break
  }
  check("a decline travels as declined", (aEnded ?? '').includes('declined'), aEnded ?? 'none')
  await snap(pa, 'declined-truth')

  /* ── the walkie stands ready (voiceOn OFF by default — the opt-in law) ── */
  const pvA = await pa.evaluate(`window.__lklVoice ? window.__lklVoice.pv().length : -1`)
  check('the street walkie is DARK by default (no voiceOn, no mesh)', pvA === 0, `pv=${pvA}`)
} catch (e) {
  failures.push(`witness crashed: ${String(e).slice(0, 300)}`)
  console.error('WITNESS CRASH:', e)
} finally {
  await ctxA?.close().catch(() => {})
  await ctxB?.close().catch(() => {})
  await browser?.close().catch(() => {})
}

console.log(`\n══════════════════════════════════════`)
console.log(`M24-W7 VOICE WITNESS: ${shots} shots, ${failures.length} failures`)
if (consoleErrors.length) {
  console.log(`CONSOLE ERRORS (${consoleErrors.length}):`)
  for (const e of consoleErrors.slice(0, 10)) console.log('  ' + e)
}
if (failures.length) console.log('FAILED:', failures.join(' | '))
process.exit(failures.length || consoleErrors.length ? 1 : 0)
