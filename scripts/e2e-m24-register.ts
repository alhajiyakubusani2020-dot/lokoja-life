/**
 * LOKOJA LIFE — M24 W1: THE REGISTER WITNESS (E2E, fresh-context)
 * ================================================================
 * ONE guest walks the REAL gateway (:81) and lives the 60-second law
 * end to end: the honest note on the landing, the preview chip in the
 * world, the wall when the clock dies, the two-step claim with the
 * FACE the street will see, and the profile face reading SERVER truth.
 *
 * The shots (ALL eyeballed after the run):
 *   01 landing-note      — the landing says the preview law out loud
 *   02 guest-world-chip  — the unclaimed walker sees the countdown chip
 *   03 the-wall          — 60s over: the register wall stands
 *   04 claim-step-1      — the in-world claim sheet (identity)
 *   05 claim-face-step   — THE FACE: live bust + look pickers + bio
 *   06 claimed-in-world  — the wall is GONE, the life continues
 *   07 profile-server    — the profile face: SERVER TRUTH chip + saved
 *
 * THE LAWS WITNESSED:
 *  - the landing says "60-second free look" out loud (no fine print)
 *  - an unclaimed walker sees the honest countdown chip in the world
 *  - at 0 the wall stands — claim or menu, never a dead end
 *  - the claim sheet is TWO steps: identity → the face
 *  - the face step shows the REAL vocabularies (the bust redraws live)
 *  - claiming from the wall lifts the wall and keeps the guest's life
 *  - the profile face shows the SERVER TRUTH chip for a claimed name
 *  - zero console errors across the walk
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-register-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE = `w1e2e_${stamp}`

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

try {
  console.log('\n── the landing says the preview law out loud ──')
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] })
  const ctx: BrowserContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)) })
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 200)}`))

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForSelector('[data-testid="menu-preview-note"]', { timeout: 15_000 })
  const note = await page.getByTestId('menu-preview-note').textContent()
  check('the landing note says 60-second free look', (note ?? '').includes('60-second'), note ?? 'none')
  await snap(page, 'landing-note')

  console.log('\n── the guest walks in WITHOUT claiming ──')
  await page.getByRole('button', { name: /START YOUR LIFE/i }).click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill('Guest Walker', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  check('the guest is alive in the world (no claim demanded first)', true)

  // the world tab hosts the diegetic layer — the preview chip lives there
  await page.getByRole('button', { name: 'World', exact: true }).click({ timeout: 8_000 }).catch(() => {})
  await page.waitForSelector('[data-testid="preview-chip"]', { timeout: 20_000 })
  const chip = await page.getByTestId('preview-chip').textContent()
  check(`the countdown chip is live: "${(chip ?? '').trim().slice(0, 30)}"`, /\d+s/.test(chip ?? ''))
  await snap(page, 'guest-world-chip')

  console.log('\n── the clock dies — the wall stands ──')
  await page.evaluate(() => {
    const w = window as unknown as { __lklSocial?: { previewLeft: (ms: number) => void } }
    w.__lklSocial?.previewLeft(0)
  })
  await page.waitForSelector('[data-testid="register-wall"]', { timeout: 12_000 })
  const wall = await page.getByTestId('register-wall').textContent()
  check('the wall names the honest truth (60 seconds done)', (wall ?? '').includes('60 seconds'), (wall ?? '').slice(0, 80))
  await snap(page, 'the-wall')

  console.log('\n── the wall door: the two-step claim ──')
  await page.getByTestId('wall-claim').click({ timeout: 6_000 })
  await page.waitForSelector('[data-testid="menu-auth-sheet"]', { timeout: 8_000 })
  check('the claim sheet opened IN the world (the life continues beneath)', true)
  await snap(page, 'claim-step-1')

  await page.getByTestId('auth-handle').fill(HANDLE)
  await page.getByTestId('auth-pin').fill('4321')
  // contact stays EMPTY — the optional law, witnessed
  await page.getByTestId('auth-next').click({ timeout: 8_000 })
  await page.waitForSelector('[data-testid="auth-face-step"]', { timeout: 8_000 })
  check('step 2: the face designer appeared', true)

  // touch the REAL vocabularies: puffs hair + senator wear
  await page.getByTestId('auth-look-hairstyle').getByText('Two Puffs').click({ timeout: 6_000 })
  await page.getByTestId('auth-look-clothing').getByText('Senator Wear').click({ timeout: 6_000 })
  await page.getByTestId('auth-display-name').fill('W1 Walker')
  await page.getByTestId('auth-bio').fill('I dey witness the register wall.')
  await snap(page, 'claim-face-step')
  await page.getByTestId('auth-submit').click({ timeout: 12_000 })

  console.log('\n── claimed: the wall lifts, the life continues ──')
  await page.waitForSelector('[data-testid="menu-auth-sheet"]', { state: 'detached', timeout: 12_000 })
  await page.waitForSelector('[data-testid="register-wall"]', { state: 'detached', timeout: 12_000 })
  await page.waitForSelector('[data-testid="preview-chip"]', { state: 'detached', timeout: 12_000 })
  check('the wall AND the countdown chip are gone (linked walkers walk free)', true)
  check('the world is still alive beneath (the needs rail never unmounted)', await page.getByTestId('hud-hunger').isVisible({ timeout: 6_000 }).catch(() => false))
  await snap(page, 'claimed-in-world')

  console.log('\n── the profile face reads SERVER truth ──')
  await page.getByTestId('world-phone-fab').click({ timeout: 8_000 })
  await page.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  await page.getByText('Profile', { exact: true }).first().click({ timeout: 8_000 })
  await page.waitForSelector('[data-testid="profile-app"]', { timeout: 8_000 })
  const scope = await page.getByTestId('profile-scope').textContent()
  check('the scope chip says SERVER TRUTH', (scope ?? '').includes('SERVER TRUTH'), scope ?? 'none')
  check(`the card shows the claimed handle @${HANDLE}`, (await page.getByTestId('profile-app').textContent() ?? '').includes(`@${HANDLE}`))

  // edit the face from the phone — the PATCH door
  await page.getByTestId('profile-name').fill('Renamed Walker')
  await page.getByTestId('profile-save').click({ timeout: 6_000 })
  await page.waitForSelector('text=Saved ✓', { timeout: 10_000 })
  check('the profile PATCH landed (Saved ✓)', true)
  await snap(page, 'profile-server')

  // THE SERVER TRUTH, read back from the register itself
  const login = await fetch(`${BASE.replace(':81', ':3000')}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: HANDLE, pin: '4321' }),
  })
  const data = (await login.json()) as { ok?: boolean; profile?: { displayName?: string; bio?: string | null } | null }
  check('THE MONEY SHOT: the register itself holds the renamed face', data.ok === true && data.profile?.displayName === 'Renamed Walker', JSON.stringify(data.profile ?? data))
  check('the bio rode home too', data.profile?.bio === 'I dey witness the register wall.')

  check('ZERO console errors across the walk', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
} catch (e) {
  failures.push(`FATAL: ${String(e).slice(0, 300)}`)
  console.error('FATAL:', e)
} finally {
  await browser?.close()
}

console.log(`\n=== W1 WITNESS: ${shots} shots, ${failures.length === 0 ? 'ALL LAWS HELD' : `${failures.length} FAILURES`} ===`)
for (const f of failures) console.log(`  ✗ ${f}`)
if (failures.length > 0) process.exit(1)
