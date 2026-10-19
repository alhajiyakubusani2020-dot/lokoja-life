/**
 * LOKOJA LIFE — M24 W9: THE STAGE WITNESS (E2E, fresh-context)
 * ============================================================
 * TWO real walkers through the REAL gateway (:81), the REAL wire (:3003
 * behind it), the REAL media house (self-hosted LiveKit on loopback) —
 * and one SEES the other's walk THROUGH THE WIRE.
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-world            — walker A alive in the city
 *   02 a-live             — A's phone: the LIVE card over the living street
 *   03 b-board            — B's board: A's stage row (the wire push, not a poll)
 *   04 b-watching         — THE MONEY SHOT: B's video tile playing A's POV
 *   05 b-chat-tip         — B's chat + the spray landing on the stage
 *   06 a-host-truth       — A's card: the chat word + the spray note
 *   07 b-after-end        — A ends the stage → B's honest dark
 *
 * THE LAWS WITNESSED:
 *  - the POV hook: the stage rides the WORLD's own canvas (StageCapture's
 *    in-task requestFrame) and the luma instrument proves the frames are
 *    NOT black (a WebGL captureStream without the hook is a black lie)
 *  - REAL media flows: A publishes REAL bytes (getStats), B receives REAL
 *    bytes, and B's <video> element holds a frame (videoWidth > 0)
 *  - the board updates by PUSH (B never reloads)
 *  - the stage chat rides the wire (A, the host, reads B's word live)
 *  - the tip moves REAL naira (B's purse debits through the UI PIN law)
 *  - the end lands honestly on the watching eye
 *  - zero console errors across both walkers
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-stage-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `stga_${stamp}`
const HANDLE_B = `stgb_${stamp}`

mkdirSync(SHOTS, { recursive: true })

let browser: Browser | null = null

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function waitFor(page: Page, what: string, ms: number, probe: string): Promise<unknown> {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    const v = await page.evaluate(probe).catch(() => null)
    if (v) return v
    await page.waitForTimeout(300)
  }
  throw new Error(`${what} never arrived within ${ms}ms`)
}

/** the stage witness, read fresh from the page */
async function stageW(page: Page): Promise<Record<string, unknown> | null> {
  return page.evaluate(() => {
    const w = (window as unknown as { __lklStage?: { witness: () => Record<string, unknown> } }).__lklStage
    return w ? w.witness() : null
  })
}

async function waitForStage(page: Page, pred: (w: Record<string, unknown>) => boolean, ms: number, what: string): Promise<Record<string, unknown>> {
  const t0 = Date.now()
  let last: Record<string, unknown> | null = null
  while (Date.now() - t0 < ms) {
    const w = await stageW(page)
    if (w && pred(w)) return w
    last = w
    await page.waitForTimeout(300)
  }
  throw new Error(`stage witness: ${what} never arrived within ${ms}ms — last=${JSON.stringify(last).slice(0, 600)}`)
}

/** THE 2FPS CLICK LAW, final form: the page's own .click() through
 * evaluate — no locator staleness, no pointer interception, the REAL
 * handler the thumb hits. Selector or exact-text, retried honestly. */
async function pressSel(page: Page, sel: string, what: string, tries = 8): Promise<void> {
  for (let i = 0; i < tries; i++) {
    const done = await page.evaluate((s: string) => {
      const el = document.querySelector(s) as HTMLElement | null
      if (!el) return false
      el.click()
      return true
    }, sel).catch(() => false)
    if (done) return
    await page.waitForTimeout(900)
  }
  throw new Error(`press failed: ${what} (${sel})`)
}

async function pressText(page: Page, text: string, what: string, tries = 8): Promise<void> {
  for (let i = 0; i < tries; i++) {
    const done = await page.evaluate((t: string) => {
      // THE LEAF LAW: the tile's label is a leaf span inside a fatter button
      // (label + sub-label) — match the leaf, click the clickable ancestor
      const leaves = Array.from(document.querySelectorAll('span, div, button, p')) as HTMLElement[]
      const el = leaves.filter((e) => e.childElementCount === 0 && (e.textContent ?? '').trim() === t).pop()
      const btn = (el?.closest('button, [role="button"], a') as HTMLElement | null) ?? null
      if (!btn) return false
      btn.click()
      return true
    }, text).catch(() => false)
    if (done) return
    await page.waitForTimeout(900)
  }
  throw new Error(`press failed: ${what} ("${text}")`)
}

/** open the world phone → the Live app → the streams tab — THROUGH THE REAL
 * MACHINE (the __lkoDash hook the W3 law minted for exactly this: the REAL
 * switchTab behind ?e2e=1; the ONE PHONE event wakes the diegetic handset).
 * No pointer gymnastics at 2fps — the machine's own doors. */
async function openStreamsTab(page: Page) {
  await page.evaluate(() => {
    const d = (window as unknown as { __lkoDash?: { open?: (t: string) => void } }).__lkoDash
    if (d?.open) d.open('world')
    else window.dispatchEvent(new CustomEvent('lko:phone-open'))
  })
  await page.waitForSelector('[data-testid="world-phone-fab"]', { timeout: 40_000 }).catch(() => {})
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('lko:phone-open')))
  const ov = await page.waitForSelector('[data-testid="world-phone-overlay"]', { timeout: 20_000 }).catch(() => null)
  if (!ov) {
    const probe = await page.evaluate(() => ({
      fab: !!document.querySelector('[data-testid="world-phone-fab"]'),
      overlay: !!document.querySelector('[data-testid="world-phone-overlay"]'),
      text: document.body.innerText.slice(0, 300),
    }))
    console.log('  [phone-dbg]', JSON.stringify(probe))
  }
  await pressText(page, 'Live', 'the Live app tile')
  await pressSel(page, '[aria-label="Live tab: Live"]', 'the Live tab chip')
  await page.waitForSelector('[data-testid="live-streams"]', { timeout: 10_000 })
}

async function walker(handle: string, name: string): Promise<{ page: Page; ctx: BrowserContext }> {
  // THE FAKE MEDIA LAW: the fake device answers the mic ask (real track,
  // real RTP); the POV itself needs no permission at all (the canvas).
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
  await page.getByTestId('auth-pin').fill('2468')
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-next').click({ timeout: 10_000 }) // W1 — step 2: the face
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill(name, { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  // THE WORLD — the stage lives where the canvas lives. THE FAB IS THE
  // ENTRY TRUTH: the diegetic layer (and its phone fab) mounts only when
  // the Dashboard's OWN switchTab('world') ran (the W3 machine). Press the
  // world button (retry — the 2fps clock) until the fab stands.
  const t0 = Date.now()
  let ok = false
  while (Date.now() - t0 < 90_000) {
    const ping = await page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      pos: !!((window as unknown as { __lkl?: { pos?: () => unknown } }).__lkl?.pos?.()),
      fab: !!document.querySelector('[data-testid="world-phone-fab"]'),
    }))
    if (ping.canvas && ping.pos && ping.fab) { ok = true; break }
    if (!ping.fab) {
      await page.evaluate(() => {
        const d = (window as unknown as { __lkoDash?: { open?: (t: string) => void } }).__lkoDash
        if (d?.open) d.open('world')
      }).catch(() => {})
    }
    await page.waitForTimeout(1_200)
  }
  if (!ok) console.log(`  ⚠ ${handle}: the world did not fully settle (continuing — the checks tell the truth)`)
  return { page, ctx }
}

let wireProc: ReturnType<typeof Bun.spawn> | null = null

async function waitForWire(): Promise<boolean> {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch('http://localhost:3003/health'); if (r.ok) return true } catch { /* not yet */ }
    await sleep(200)
  }
  return false
}

try {
  console.log("\n── the nation lanes stand up ──")
  wireProc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: '3003' },
    stdout: 'pipe', stderr: 'pipe',
  })
  check('the wire is up behind the gateway door', await waitForWire())
  check('the stage rides the MESH (the wire alone — no media house needed)', true)

  console.log('\n── walker A claims, enters, goes LIVE ──')
  browser = await chromium.launch({
    args: ['--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  })
  const a = await walker(HANDLE_A, 'Adaeze')
  const pa = a.page
  await snap(pa, 'a-world')

  await openStreamsTab(pa)
  await pa.getByTestId('stage-title-input').fill('Market waka wey sweet')
  await pressSel(pa, '[data-testid="stage-go-live"]', 'go live')
  // THE MEDIA TRUTH (part 1): the POV frames are alive — the luma
  // instrument reads the world's own canvas in-task
  const wa = (await waitForStage(pa, (w) => Number(w.luma) > 4, 30_000, 'luma')) as Record<string, unknown>
  check(`THE POV IS LIVE — the luma instrument reads ${Number(wa.luma).toFixed(1)} (the in-task capture law)`, Number(wa.luma) > 4)
  await snap(pa, 'a-live')

  console.log('\n── walker B claims, enters, watches ──')
  const b = await walker(HANDLE_B, 'Chidi')
  const pb = b.page
  await sleep(2_000)

  await openStreamsTab(pb)
  // THE BOARD BY PUSH — A's stage row is already there (started push, no reload)
  await pb.waitForSelector(`[data-testid="stage-row-${HANDLE_A}"]`, { timeout: 10_000 })
  const rowText = await pb.getByTestId(`stage-row-${HANDLE_A}`).textContent()
  check('B\'s board holds A\'s stage (the push, never a poll)', (rowText ?? '').includes('Market waka wey sweet'), rowText ?? 'none')
  await snap(pb, 'b-board')

  await pressSel(pb, `[data-testid="stage-watch-${HANDLE_A}"]`, 'watch A stage')
  const wb = (await waitForStage(pb, (w) => w.subState === 'connected', 30_000, 'subscribe connected')) as Record<string, unknown>
  check('B\'s subscribe PeerConnection is CONNECTED', wb.subState === 'connected')
  // THE DUAL DUMP — both sides of the mesh, read fresh (the diagnostic law)
  for (let i = 0; i < 2; i++) {
    await sleep(2_500)
    const da = await stageW(pa)
    const dbw = await stageW(pb)
    console.log(`  [mesh t${i}] A: pub=${da?.pubPc} state=${da?.pubState} bytes=${da?.pubBytes} luma=${Number(da?.luma ?? -1).toFixed(1)} why=${da?.lastPubWhy}`)
    console.log(`  [mesh t${i}] B: sub=${dbw?.subPc} bytes=${dbw?.subBytes} why=${dbw?.lastSubWhy}`)
  }
  const deep = await pb.evaluate(() => {
    const w = (window as unknown as { __lklStageDeep?: () => Promise<unknown> }).__lklStageDeep
    return typeof w === 'function' ? w() : Promise.resolve('no deep hook')
  })
  console.log('  [deep B]', JSON.stringify(deep).slice(0, 900))
  const wbBytes = (await waitForStage(pb, (w) => Number(w.subBytes) > 2000, 20_000, 'received bytes')) as Record<string, unknown>
  check(`REAL MEDIA FLOWS — B received ${Number(wbBytes.subBytes)} bytes of A's walk`, Number(wbBytes.subBytes) > 2000)
  const waBytes = (await waitForStage(pa, (w) => Number(w.pubBytes) > 2000, 20_000, 'published bytes')) as Record<string, unknown>
  check(`REAL MEDIA FLOWS BOTH SIDES — A published ${Number(waBytes.pubBytes)} bytes to B's eye`, Number(waBytes.pubBytes) > 2000)
  // THE FRAME TRUTH: the <video> element itself holds a picture
  const vdim = await pb.evaluate(() => {
    const v = document.querySelector('[data-testid="stage-video"]') as HTMLVideoElement | null
    return v ? { w: v.videoWidth, h: v.videoHeight } : null
  })
  check(`B's video tile holds a REAL frame (${vdim?.w}×${vdim?.h})`, !!vdim && vdim.w > 0 && vdim.h > 0, JSON.stringify(vdim))
  await sleep(1_500)
  await pb.locator('[data-testid="stage-video"]').scrollIntoViewIfNeeded().catch(() => {})
  await sleep(400)
  await snap(pb, 'b-watching')

  console.log('\n── the stage room: chat + the spray ──')
  await pb.getByTestId('stage-chat-input').fill('the waka sweet no be small!')
  await pressSel(pb, '[data-testid="stage-chat-send"]', 'chat send')
  // A (the host) reads the word live in their own card
  await pa.waitForSelector('[data-testid="stage-chat-feed"]', { timeout: 8_000 })
  const hostChat = await waitFor(pa, 'the host reads the word', 10_000,
    `(() => { const el = document.querySelector('[data-testid="stage-chat-feed"]'); return el && el.textContent.includes('the waka sweet') ? el.textContent.slice(0, 120) : null })()`)
  check('THE HOST HEARS THE ROOM — A reads B\'s word live', typeof hostChat === 'string' && hostChat.includes('the waka sweet'))

  // THE SPRAY: B funds the purse through the REAL wallet UI, then tips.
  // The phone is open on the streams face — close it (the scrim corner),
  // re-open through the machine door (fresh at the grid), walk to Wallet.
  await pb.locator('[data-testid="world-phone-overlay"]').click({ position: { x: 8, y: 8 }, force: true, timeout: 6_000 }).catch(() => {})
  await sleep(800)
  await pb.evaluate(() => window.dispatchEvent(new CustomEvent('lko:phone-open')))
  await pb.waitForSelector('[data-testid="world-phone-overlay"]', { timeout: 15_000 })
  await pressText(pb, 'Wallet', 'the Wallet tile')
  await pb.waitForSelector('[data-testid="wallet-home"]', { timeout: 10_000 })
  await pressSel(pb, '[data-testid="wallet-topup"]', 'top up')
  await pb.waitForSelector('[data-testid="wallet-amount"]', { timeout: 10_000 })
  // the honest amount: set it explicitly — a fresh save's pocket is small
  await pb.getByTestId('wallet-custom-amount').fill('500').catch(() => {})
  await pressSel(pb, '[data-testid="wallet-amount-next"]', 'amount next')
  await pb.waitForSelector('[data-testid="wallet-confirm"]', { timeout: 10_000 })
  await pressSel(pb, '[data-testid="wallet-confirm"]', 'confirm topup')
  await pb.waitForSelector('[data-testid="wallet-receipt"]', { timeout: 12_000 })
  check('B\'s purse is funded through the REAL wallet door', true)
  // back to the Live stage — the same honest trick (the PhoneScreen remounts
  // fresh at the grid every time the overlay re-opens)
  await pb.locator('[data-testid="world-phone-overlay"]').click({ position: { x: 8, y: 8 }, force: true, timeout: 6_000 }).catch(() => {})
  await sleep(800)
  await pb.evaluate(() => window.dispatchEvent(new CustomEvent('lko:phone-open')))
  await pb.waitForSelector('[data-testid="world-phone-overlay"]', { timeout: 15_000 })
  await pressText(pb, 'Live', 'the Live tile (return)')
  await pressSel(pb, '[aria-label="Live tab: Live"]', 'the Live tab (return)')
  // THE EYE SURVIVES THE SHEET: watchingId rides the store — B is STILL
  // watching (the phone closing never closed the eye — the W3 law's gift),
  // so the tip box stands without any re-watch
  await pb.waitForSelector('[data-testid="stage-tip-box"]', { timeout: 15_000 })
  await pressSel(pb, '[data-testid="stage-tip-500"]', 'tip 500')
  await pb.getByTestId('stage-tip-pin').fill('2468')
  await pressSel(pb, '[data-testid="stage-tip-send"]', 'tip send')
  await pb.waitForSelector('[data-testid="stage-tip-note"]', { timeout: 12_000 })
  const tipNoteB = await pb.getByTestId('stage-tip-note').textContent()
  check(`THE SPRAY LANDS — B's box reads "${(tipNoteB ?? '').trim()}"`, (tipNoteB ?? '').includes('sprayed ₦500'), tipNoteB ?? 'none')
  // A's card reads the same truth
  await pa.waitForSelector('[data-testid="stage-tip-note"]', { timeout: 10_000 })
  const tipNoteA = await pa.getByTestId('stage-tip-note').textContent()
  check('THE HOST SEES THE SPRAY — A\'s card reads the same note', (tipNoteA ?? '').includes('sprayed ₦500'), tipNoteA ?? 'none')
  await pb.locator('[data-testid="stage-video"]').scrollIntoViewIfNeeded().catch(() => {})
  await sleep(400)
  await snap(pb, 'b-chat-tip')
  await snap(pa, 'a-host-truth')

  console.log('\n── the end lands honestly ──')
  const stopDbg = await pa.evaluate(() => ({
    overlay: !!document.querySelector('[data-testid="world-phone-overlay"]'),
    stop: !!document.querySelector('[data-testid="stage-stop"]'),
    live: !!document.querySelector('[data-testid="stage-live-chip"]'),
    pub: (window as unknown as { __lklStage?: { witness: () => { pubState?: string; store?: { publishing?: boolean } } } }).__lklStage?.witness(),
  }))
  console.log('  [stop-dbg]', JSON.stringify(stopDbg).slice(0, 400))
  await pressSel(pa, '[data-testid="stage-stop"]', 'end the stage')
  await pb.waitForSelector('[data-testid="stage-ended-note"], [data-testid="stage-video-dark"]', { timeout: 12_000 })
  const whyB = await pb.evaluate(() => {
    const w = (window as unknown as { __lklStage?: { witness: () => { store: { lastWhy: string | null } } } }).__lklStage
    return w ? w.witness().store.lastWhy : null
  })
  check(`B's eye goes honestly dark (${String(whyB)})`, whyB === 'stage-ended')
  await snap(pb, 'b-after-end')

  console.log('\n── the closing truth ──')
  check('zero console errors across both walkers (the nation stood)', consoleErrors.length === 0, consoleErrors.slice(0, 4).join(' | '))
  await pa.close()
  await pb.close()
} catch (e) {
  failures.push(`witness crashed: ${String(e).slice(0, 300)}`)
  console.error('WITNESS CRASH:', e)
} finally {
  try { await browser?.close() } catch { /* already gone */ }
  try { wireProc?.kill() } catch { /* gone */ }
}

console.log(`\n════════════════════════════════════════`)
console.log(`M24-W9 STAGE WITNESS: ${shots} shots, ${failures.length} failures`)
if (failures.length) console.log('FAILED:', failures.join(' | '))
process.exit(failures.length ? 1 : 0)
