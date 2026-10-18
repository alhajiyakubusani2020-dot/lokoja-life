/**
 * LOKOJA LIFE — M24 W8: THE FACE WITNESS (E2E, fresh-context)
 * ============================================================
 * TWO real walkers, the REAL gateway (:81 — the Caddy XTransformPort
 * door), the REAL wire (:3003 behind it), REAL WebRTC VIDEO between
 * two browser contexts (Chromium's fake devices — a real camera
 * stream, real PeerConnections, real RTP video bytes on loopback).
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-home              — walker A claimed, alive, in the world
 *   02 calls-directory     — the Calls face showing @B ● online
 *   03 b-ring-banner       — B's world: VIDEO call · LIVE WIRE — the real ring
 *   04 b-world-face        — THE DIEGETIC MONEY SHOT: the floating face
 *                            above the living 3D street
 *   05 a-video-stage       — A's active screen: remote face + local PiP
 *   06 a-picture-muted     — the picture mute truth (B's face went dark on A)
 *   07 ended-truth         — the ended card tells the truth
 *   08 declined-truth      — a video decline travels as declined
 *
 * THE LAWS WITNESSED:
 *  - a VIDEO dial rings a REAL online paddy; the banner says Video call
 *    · LIVE WIRE (a real ring, not the labeled demo)
 *  - the answer opens REAL peer-to-peer VIDEO: both peers report
 *    pc 'connected', camLocal AND camRemote true, AND inbound VIDEO
 *    bytes > 0 on BOTH ears (RTCPeerConnection.getStats — the money
 *    shot reads REAL numbers, never a fake)
 *  - the active face shows the remote picture + the local PiP
 *  - the picture mute is real: A's camera off → B's ear learns cam
 *    on:false (the wire's cam lane) → the face goes dark honestly
 *  - the diegetic law: the floating face lives IN the world above the
 *    unmounting-free 3D street
 *  - the hangup ends BOTH phones honestly; a decline travels as declined
 *  - zero console errors across both walkers
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-face-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `facea_${stamp}`
const HANDLE_B = `faceb_${stamp}`

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

interface CamDebug {
  call: () => { callId: string; peer: string; pc: string; video: boolean; camLocal: boolean; camRemote: boolean } | null
  stats: () => Promise<{ rx: number; tx: number; vrx: number; vtx: number }>
}

async function walker(handle: string): Promise<{ page: Page; ctx: BrowserContext }> {
  // THE FAKE MEDIA LAW: --use-fake-device-for-media-stream gives a REAL
  // camera (an animated pattern — real frames, real RTP when connected)
  // without hardware. --use-fake-ui-for-media-stream auto-grants.
  const ctx = await browser!.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['microphone', 'camera'],
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

  // B opens the Calls face once (wireEnsure puts B's phone ON the wire),
  // then walks back to the world where the banner + the floating face live
  await openCalls(pb)
  await pb.getByRole('button', { name: 'World', exact: true }).click({ timeout: 6_000 })

  /* ── A opens Calls, finds B online, dials VIDEO ── */
  console.log('\n── THE REAL VIDEO DIAL ──')
  await openCalls(pa)
  await pa.waitForSelector(`text=@${HANDLE_B}`, { timeout: 10_000 })
  await snap(pa, 'calls-directory')
  await pa.getByText(`@${HANDLE_B}`, { exact: false }).first().click({ timeout: 6_000 })
  await pa.waitForSelector('[data-testid="calls-dial-video"]', { timeout: 6_000 })
  const t0 = Date.now()
  await pa.getByTestId('calls-dial-video').click()

  /* ── B's phone rings — the REAL VIDEO ring ── */
  await pb.waitForSelector('[data-testid="call-banner"]', { timeout: 10_000 })
  const bannerText = await pb.getByTestId('call-banner').textContent()
  check(`B's banner says VIDEO + LIVE WIRE in ${(Date.now() - t0) / 1000}s`, (bannerText ?? '').includes('Video') && (bannerText ?? '').includes('LIVE WIRE'), bannerText ?? 'none')
  await snap(pb, 'b-ring-banner')

  /* ── B answers — the media plane comes alive ── */
  await pb.getByTestId('call-banner-answer').click({ timeout: 6_000 })
  await pa.waitForSelector('[data-testid="calls-screen-active"]', { timeout: 8_000 })
  check('A reaches the active screen (the machine answers the answer)', true)

  // THE CONNECTION TRUTH: both PeerConnections reach 'connected' WITH video
  await waitFor(pa, "A's pc connected", 25_000, `window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().pc === 'connected'`)
  check("A's PeerConnection is CONNECTED (real ICE on loopback)", true)
  await waitFor(pb, "B's pc connected", 25_000, `window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().pc === 'connected'`)
  check("B's PeerConnection is CONNECTED", true)

  // THE CAMERA TRUTH: both ears know BOTH cameras opened (the cam lane)
  const aCam = (await waitFor(pa, 'A knows both cams', 15_000, `(window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().camLocal && window.__lklVoice.call().camRemote) ? true : null`)) as unknown as boolean
  check('A: my camera live AND their camera live (the cam lane told the truth)', !!aCam)
  const bCam = (await waitFor(pb, 'B knows both cams', 15_000, `(window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().camLocal && window.__lklVoice.call().camRemote) ? true : null`)) as unknown as boolean
  check('B: my camera live AND their camera live', !!bCam)

  // THE MONEY SHOT: REAL VIDEO bytes flow BOTH ways
  const aBytes = (await waitFor(pa, 'A receives video bytes', 25_000, `(async () => { const s = await window.__lklVoice.stats(); return s.vrx > 0 ? s : null })()`)) as { rx: number; tx: number; vrx: number; vtx: number }
  check(`REAL VIDEO FLOWS — A received ${aBytes.vrx} video bytes (audio ${aBytes.rx})`, aBytes.vrx > 0)
  const bBytes = (await waitFor(pb, 'B receives video bytes', 25_000, `(async () => { const s = await window.__lklVoice.stats(); return s.vrx > 0 ? s : null })()`)) as { rx: number; tx: number; vrx: number; vtx: number }
  check(`REAL VIDEO FLOWS BOTH WAYS — B received ${bBytes.vrx} video bytes (audio ${bBytes.rx})`, bBytes.vrx > 0)

  /* ── THE DIEGETIC FACE: B's world shows the floating picture ── */
  await pb.waitForTimeout(1500)
  await pb.waitForSelector('[data-testid="world-video-face"]', { timeout: 10_000 })
  check("B's world shows the FLOATING FACE above the living street", true)
  await snap(pb, 'b-world-face')

  /* ── A's face: the remote picture + the local PiP ── */
  await pa.waitForSelector('[data-testid="calls-video-stage"]', { timeout: 10_000 })
  const pipThere = await pa.locator('[data-testid="calls-video-pip"]').count()
  check("A's active face: remote stage + local PiP both present", pipThere === 1)
  await snap(pa, 'a-video-stage')

  /* ── THE PICTURE MUTE: A kills their camera; B's ear learns the truth ── */
  await pa.getByTestId('calls-cam-toggle').click({ timeout: 6_000 })
  await waitFor(pb, "B learns A's cam went dark", 10_000, `(window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().camRemote === false) ? true : null`)
  check('the wire cam lane: B heard cam on:false (never a black lie)', true)
  const faceGone = await pb.locator('[data-testid="world-video-face"]').count()
  check("B's floating face went dark with the picture (honest UI)", faceGone === 0)
  await snap(pb, 'a-picture-muted')
  await pa.getByTestId('calls-cam-toggle').click({ timeout: 6_000 })
  await waitFor(pb, "B learns A's cam returned", 10_000, `(window.__lklVoice && window.__lklVoice.call() && window.__lklVoice.call().camRemote === true) ? true : null`)
  check('the camera returned — B hears cam on:true again', true)

  /* ── A hangs up — both phones end honestly ── */
  await pa.getByTestId('calls-hangup').click({ timeout: 6_000 })
  // B's phone is CLOSED in the world — the ended card lives inside the
  // Calls face, so the STORE truth lands first (the debug hook), then the
  // thumb opens the phone to see the honest card
  const bWhy = await waitFor(pb, "B's ended truth (store)", 10_000, `(window.__lklVoiceDebug && window.__lklVoiceDebug().endedWhy === 'hangup') ? true : null`)
  check("the hangup lands on B's phone with the honest why (store truth)", !!bWhy)
  await pb.getByTestId('world-phone-fab').click({ timeout: 8_000 })
  await pb.getByText('Calls', { exact: true }).first().click({ timeout: 8_000 })
  await pb.waitForSelector('[data-testid="calls-screen-ended"]', { timeout: 8_000 })
  const bEnded = await pb.getByTestId('calls-screen-ended').textContent()
  check("the ended card tells the truth", (bEnded ?? '').includes('you hang up') || (bEnded ?? '').includes('hang up'), bEnded ?? 'none')
  await snap(pb, 'ended-truth')
  await pb.getByTestId('calls-done').click({ timeout: 6_000 })
  await pa.getByTestId('calls-done').click({ timeout: 6_000 })

  /* ── the decline truth: A dials video again, B declines ── */
  await pa.getByText('👥 People').click({ timeout: 6_000 }).catch(async () => {
    await openCalls(pa)
    await pa.getByText('👥 People').click({ timeout: 6_000 })
  })
  await pa.getByText(`@${HANDLE_B}`, { exact: false }).first().click({ timeout: 6_000 })
  await pa.getByTestId('calls-dial-video').click({ timeout: 6_000 })
  await pb.waitForSelector('[data-testid="call-banner"]', { timeout: 10_000 })
  const banner2 = await pb.getByTestId('call-banner').textContent()
  check('the second ring is a VIDEO ring too', (banner2 ?? '').includes('Video'), banner2 ?? 'none')
  await pb.getByTestId('call-banner-decline').click({ timeout: 6_000, force: true })
  let aEnded: string | null = null
  for (let i = 0; i < 20; i++) {
    await pa.waitForTimeout(500)
    aEnded = await pa.getByTestId('calls-screen-ended').textContent().catch(() => null)
    if (aEnded) break
  }
  check('a video decline travels as declined', (aEnded ?? '').includes('declined'), aEnded ?? 'none')
  await snap(pa, 'declined-truth')
} catch (e) {
  failures.push(`witness crashed: ${String(e).slice(0, 300)}`)
  console.error('WITNESS CRASH:', e)
} finally {
  await ctxA?.close().catch(() => {})
  await ctxB?.close().catch(() => {})
  await browser?.close().catch(() => {})
}

console.log(`\n══════════════════════════════════════`)
console.log(`M24-W8 FACE WITNESS: ${shots} shots, ${failures.length} failures`)
if (consoleErrors.length) {
  console.log(`CONSOLE ERRORS (${consoleErrors.length}):`)
  for (const e of consoleErrors.slice(0, 10)) console.log('  ' + e)
}
if (failures.length) console.log('FAILED:', failures.join(' | '))
process.exit(failures.length || consoleErrors.length ? 1 : 0)
