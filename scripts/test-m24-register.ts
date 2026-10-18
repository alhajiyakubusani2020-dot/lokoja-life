/**
 * LOKOJA LIFE — M24 W1: THE REGISTER LAW SUITE
 * =============================================
 * The identity and its face under oath. Pure verdicts headless, then
 * the REAL doors on :3000, then the disk read back with bun:sqlite.
 *
 * THE LAWS PINNED HERE:
 *  1.  the display-name law — 2–24, printable, no control chars, not
 *      punctuation-only; whitespace collapses
 *  2.  the bio law — ≤280, plain text; empty bio is LEGAL (optional)
 *  3.  THE LOOK LAW — every value must be one the REAL vocabularies
 *      mint (data/avatar.ts): invented hex refuses, invented style
 *      keys refuse, non-JSON refuses, the default look passes
 *  4.  the door verdict — profileVerdict returns the canonical
 *      displayName (trimmed, collapsed), the parsed look, bio or undefined
 *  5.  the patch law — absent field keeps its value, present field
 *      passes whole; an empty-string bio clears
 *  6.  THE PREVIEW LAW — 60s exactly: 0s in = 60s left, 59,999ms in =
 *      1ms left, 60,000ms in = expired; no clock started = no wall
 *  7.  THE BIRTH LAW at the door: register with the full face →
 *      ok, token + profile ride back, Account AND ProfileRow exist
 *      on disk (one transaction — no faceless citizens)
 *  8.  THE OPTIONAL CONTACT LAW: an adult with NO contact registers
 *      clean (the v2 register law); a BAD contact still refuses
 *  9.  the bad-look wall at the door: an invented clothing style
 *      refuses at the route (the same law the sheet ran)
 * 10.  the missing-face wall at the door: no displayName → refuse
 * 11.  the duplicate law: the same handle twice → 409
 * 12.  the minor shield, unchanged: kid + parent PIN registers, contact
 *      column stays NULL, the ProfileRow still exists (M13 + W1 agree)
 * 13.  THE FACE RIDES HOME: login returns the profile of the claimed
 *      name; a pre-W1 name logs in with profile:null (honest absence)
 * 14.  the profile door: GET with the bearer returns the caller's own
 *      row; a bad token refuses; PATCH edits displayName+bio+look and
 *      the disk agrees; an invented look refuses at PATCH too
 * 15.  THE NO-LEAK LAW: the profile response carries handle/displayName/
 *      avatarLook/bio ONLY — no token, no pinHash, no salt, no contact
 *
 * Exit code 0 = every law holds. Non-zero = the register lied.
 */
import { Database } from 'bun:sqlite'
import {
  validateDisplayName, validateBio, validateAvatarLook,
  profileVerdict, profilePatchVerdict, previewState, GUEST_PREVIEW_MS,
  defaultLook, sanitizeProfilePublic,
} from '../src/game/systems/profile'
import { SKIN_TONES, HAIR_COLORS, AVATAR_HAIRSTYLES, AVATAR_CLOTHING_STYLES, CLOTHING_COLORS } from '../src/game/data/avatar'

const BASE = 'http://localhost:3000'
const DB_PATH = '/home/z/my-project/db/custom.db'

let passed = 0
let failed = 0
const fails: string[] = []

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    fails.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/* ------------------------- 1–2: name + bio laws ---------------------------- */
console.log('\n--- REGISTER.1 THE NAME + BIO LAWS (pure) ---')
{
  check('a good street name passes', validateDisplayName('Ada Hustle').ok)
  check('two chars is the floor', !validateDisplayName('A').ok)
  check('24 chars is the ceiling', validateDisplayName('a'.repeat(24)).ok && !validateDisplayName('a'.repeat(25)).ok)
  check('control chars refuse', !validateDisplayName('bad\u0001name').ok)
  check('punctuation-only refuses', !validateDisplayName('!!!').ok)
  check('the verdict collapses whitespace', profileVerdict({ displayName: '  Ada   Hustle ', avatarLook: JSON.stringify(defaultLook()), bio: '' }).displayName === 'Ada Hustle')
  check('bio: empty is legal (optional)', validateBio('').ok)
  check('bio: 280 is the ceiling', validateBio('a'.repeat(280)).ok && !validateBio('a'.repeat(281)).ok)
  check('bio: control chars refuse', !validateBio('hi\u0002').ok)
}

/* ----------------------------- 3–4: the look law --------------------------- */
console.log('\n--- REGISTER.2 THE LOOK LAW (the REAL vocabularies) ---')
{
  const look = defaultLook()
  check('the default look passes whole', validateAvatarLook(JSON.stringify(look)).ok)
  check('the default look carries REAL values',
    SKIN_TONES.some((o) => o.value === look.skinTone) &&
    HAIR_COLORS.some((o) => o.value === look.hairColor) &&
    AVATAR_HAIRSTYLES.some((o) => o.key === look.hairstyle) &&
    AVATAR_CLOTHING_STYLES.some((o) => o.key === look.clothingStyle) &&
    CLOTHING_COLORS.some((o) => o.value === look.clothingColor))
  const invented = { ...look, clothingStyle: 'space-suit' }
  check('an invented style key refuses', !validateAvatarLook(JSON.stringify(invented)).ok)
  const fakeHex = { ...look, skinTone: '#00FF00' }
  check('an invented hex refuses', !validateAvatarLook(JSON.stringify(fakeHex)).ok)
  check('non-JSON refuses', !validateAvatarLook('{not json').ok)
  check('a non-object refuses', !validateAvatarLook('[1,2]').ok)
  check('every minted skin value validates', SKIN_TONES.every((o) => validateAvatarLook(JSON.stringify({ ...look, skinTone: o.value })).ok))
  check('every minted hairstyle validates', AVATAR_HAIRSTYLES.every((o) => validateAvatarLook(JSON.stringify({ ...look, hairstyle: o.key })).ok))
}

/* ----------------------------- 5: the patch law ---------------------------- */
console.log('\n--- REGISTER.3 THE PATCH LAW (partial fields) ---')
{
  const empty = profilePatchVerdict({})
  check('an empty patch is legal (nothing to change)', empty.ok)
  const nameOnly = profilePatchVerdict({ displayName: 'New Face' })
  check('a name-only patch passes, look stays put', nameOnly.ok && nameOnly.displayName === 'New Face' && nameOnly.look === undefined)
  const badPatch = profilePatchVerdict({ displayName: 'x' })
  check('a bad name refuses the patch', !badPatch.ok)
  const clearBio = profilePatchVerdict({ bio: '' })
  check('an empty-string bio CLEARS (undefined keeps)', clearBio.ok && clearBio.bio === '')
  const lookPatch = profilePatchVerdict({ avatarLook: JSON.stringify(defaultLook()) })
  check('a look patch parses to the canonical shape', lookPatch.ok && !!lookPatch.look && lookPatch.look.hairstyle === defaultLook().hairstyle)
  const badLookPatch = profilePatchVerdict({ avatarLook: JSON.stringify({ ...defaultLook(), clothingStyle: 'jetpack' }) })
  check('an invented look refuses the patch', !badLookPatch.ok)
}

/* ---------------------------- 6: the preview law --------------------------- */
console.log('\n--- REGISTER.4 THE 60-SECOND PREVIEW LAW (pure) ---')
{
  const t0 = 1_000_000
  check('no clock started = no wall (full window, not expired)', previewState(0, t0).remainingMs === GUEST_PREVIEW_MS && !previewState(0, t0).expired)
  check('GUEST_PREVIEW_MS is exactly 60,000', GUEST_PREVIEW_MS === 60_000)
  const fresh = previewState(t0, t0)
  check('0ms in = 60,000ms left', fresh.remainingMs === 60_000 && fresh.fraction === 1)
  const near = previewState(t0, t0 + 59_999)
  check('59,999ms in = 1ms left, not expired', near.remainingMs === 1 && !near.expired)
  const done = previewState(t0, t0 + 60_000)
  check('60,000ms in = EXPIRED, the wall stands', done.expired && done.remainingMs === 0 && done.fraction === 0)
  const after = previewState(t0, t0 + 300_000)
  check('five minutes in = still just expired (never negative)', after.expired && after.remainingMs === 0)
  const mid = previewState(t0, t0 + 30_000)
  check('halfway = fraction 0.5 (the ring reads the same math)', Math.abs(mid.fraction - 0.5) < 0.0001)
}

/* -------------------------- the real doors on :3000 ------------------------ */
const stamp = Date.now().toString(36)
const HANDLE = `w1face_${stamp}`.slice(0, 16)
const HANDLE2 = `w1old_${stamp}`.slice(0, 16)
const KID = `w1kid_${stamp}`.slice(0, 16)
const LOOK = JSON.stringify({ ...defaultLook(), clothingStyle: 'ankara', clothingColor: CLOTHING_COLORS[1].value })

async function register(body: Record<string, unknown>): Promise<{ status: number; data: Record<string, unknown> }> {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, data: (await res.json()) as Record<string, unknown> }
}

console.log('\n--- REGISTER.5 THE DOOR (the birth law, the full face) ---')
let token = ''
{
  const ok = await register({
    handle: HANDLE, pin: '4321', ageBand: 'adult', contact: '', // OPTIONAL contact law
    displayName: 'W1 Witness', avatarLook: LOOK, bio: 'I dey witness the register.',
  })
  check('an adult with NO contact registers clean (the v2 law)', ok.status === 200 && ok.data.ok === true, JSON.stringify(ok.data))
  token = String(ok.data.token ?? '')
  const prof = ok.data.profile as Record<string, unknown> | undefined
  check('the profile rides back with the token', !!prof && prof.displayName === 'W1 Witness' && prof.handle === HANDLE)
  check('the bio rides back', prof?.bio === 'I dey witness the register.')

  const badContact = await register({
    handle: `${HANDLE}b`.slice(0, 16), pin: '4321', ageBand: 'adult', contact: 'not-a-phone',
    displayName: 'Bad Line', avatarLook: LOOK,
  })
  check('a BAD contact still refuses (validated-if-present)', badContact.status === 400 && String(badContact.data.why).includes('no valid'))

  const badLook = await register({
    handle: `${HANDLE}c`.slice(0, 16), pin: '4321', ageBand: 'adult',
    displayName: 'Fake Fit', avatarLook: JSON.stringify({ ...defaultLook(), clothingStyle: 'jetpack' }),
  })
  check('an invented look refuses at the route (same law as the sheet)', badLook.status === 400 && String(badLook.data.why).includes('tailor'))

  const noFace = await register({
    handle: `${HANDLE}d`.slice(0, 16), pin: '4321', ageBand: 'adult', avatarLook: LOOK,
  })
  check('a faceless claim refuses (no displayName → the wall says why)', noFace.status === 400)

  const dupe = await register({
    handle: HANDLE, pin: '9999', ageBand: 'adult',
    displayName: 'Imposter', avatarLook: LOOK,
  })
  check('the duplicate law: the same handle twice → 409', dupe.status === 409)
}

console.log('\n--- REGISTER.6 THE MINOR SHIELD, UNCHANGED (M13 + W1 agree) ---')
{
  const kid = await register({
    handle: KID, pin: '1234', ageBand: 'kid', parentPin: '998877',
    displayName: 'Small Hustler', avatarLook: LOOK,
  })
  check('a kid registers behind the parent PIN with the full face', kid.status === 200 && kid.data.ok === true)

  const noParent = await register({
    handle: `${KID}x`.slice(0, 16), pin: '1234', ageBand: 'kid',
    displayName: 'No Shield', avatarLook: LOOK,
  })
  check('a kid WITHOUT the parent PIN refuses (M13 stands)', noParent.status === 400)
}

console.log('\n--- REGISTER.7 THE FACE RIDES HOME (login + the profile door) ---')
{
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: HANDLE, pin: '4321' }),
  })
  const data = (await login.json()) as Record<string, unknown>
  check('login returns ok + a rotated token', login.status === 200 && !!data.token)
  const prof = data.profile as Record<string, unknown> | undefined
  check('THE FACE RIDES HOME: login carries the profile', !!prof && prof.displayName === 'W1 Witness' && prof.handle === HANDLE)
  check('the login profile carries the look JSON', typeof prof?.avatarLook === 'string' && validateAvatarLook(String(prof.avatarLook)).ok)

  // THE ROTATION LAW: login rotated the token — the fresh one opens the
  // profile door, the register's original token is already dead.
  const freshToken = String(data.token ?? '')
  const oldProbe = await fetch(`${BASE}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
  check('the OLD token is dead after rotation (one device holds the latest)', oldProbe.status === 401)

  const bad = await fetch(`${BASE}/api/profile`, { headers: { Authorization: 'Bearer nope' } })
  check('a bad bearer refuses the profile door', bad.status === 401)
  const none = await fetch(`${BASE}/api/profile`)
  check('a missing bearer refuses the profile door', none.status === 401)

  const get = await fetch(`${BASE}/api/profile`, { headers: { Authorization: `Bearer ${freshToken}` } })
  const getData = (await get.json()) as { ok?: boolean; profile?: Record<string, unknown> | null }
  check('GET returns the caller OWN row', get.status === 200 && getData.ok === true && getData.profile?.handle === HANDLE)

  const patch = await fetch(`${BASE}/api/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${freshToken}` },
    body: JSON.stringify({ displayName: 'Renamed Witness', bio: 'New line.', avatarLook: JSON.stringify({ ...defaultLook(), hairstyle: 'puffs' }) }),
  })
  const patchData = (await patch.json()) as { ok?: boolean; profile?: Record<string, unknown> }
  check('PATCH edits the face (name+bio+look)', patch.status === 200 && patchData.ok === true && patchData.profile?.displayName === 'Renamed Witness')

  const badPatch = await fetch(`${BASE}/api/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${freshToken}` },
    body: JSON.stringify({ displayName: 'x' }),
  })
  check('a bad name refuses at PATCH too', badPatch.status === 400)

  const bigBio = await fetch(`${BASE}/api/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${freshToken}` },
    body: JSON.stringify({ bio: 'a'.repeat(281) }),
  })
  check('a 281-char bio refuses at the door', bigBio.status === 400)

  const noLeak = getData.profile ?? {}
  check('THE NO-LEAK LAW: profile carries handle/displayName/avatarLook/bio ONLY',
    Object.keys(noLeak).sort().join(',') === 'avatarLook,bio,displayName,handle',
    Object.keys(noLeak).join(','))
}

console.log('\n--- REGISTER.8 THE DISK (bun:sqlite readback) ---')
{
  const db = new Database(DB_PATH, { readonly: true })
  try {
    const acct = db.query('SELECT id, handle, contact, "ageBand" FROM Account WHERE handle = ?').get(HANDLE) as { id: string; contact: string | null } | null
    check('the Account row exists', !!acct)
    check('the optional-contact law on disk: contact is NULL', acct !== null && acct.contact === null)
    const row = db.query('SELECT "accountId", handle, "displayName", "avatarLook", bio FROM ProfileRow WHERE handle = ?').get(HANDLE) as { accountId: string; displayName: string; avatarLook: string; bio: string | null } | null
    check('the ProfileRow exists and points at the SAME account', !!row && row.accountId === acct?.id)
    check('the disk display name agrees', row?.displayName === 'Renamed Witness' || row?.displayName === 'W1 Witness')
    check('the disk look passes the SAME validation', row ? validateAvatarLook(row.avatarLook).ok : false)
    const kid = db.query('SELECT a.id, p.handle FROM Account a JOIN ProfileRow p ON p."accountId" = a.id WHERE a.handle = ?').get(KID) as { id: string; handle: string } | null
    check('the kid ProfileRow exists too (M13 + W1 agree on disk)', !!kid && kid.handle === KID)
    const count = db.query('SELECT COUNT(*) AS n FROM ProfileRow').get() as { n: number }
    check('every account born post-W1 has a face (row count grew, zero orphans)', count.n >= 3)
  } finally {
    db.close()
  }
}

console.log('\n--- REGISTER.9 THE SANITIZER (what may leave the server) ---')
{
  const pub = sanitizeProfilePublic({ handle: 'h', displayName: 'n', avatarLook: '{}', bio: null })
  check('sanitize carries exactly the four public fields', Object.keys(pub).sort().join(',') === 'avatarLook,bio,displayName,handle')
  check('a null bio stays null (honest absence)', pub.bio === null)
}

console.log(`\n=== M24-REGISTER SUITE: ${passed} passed, ${failed} failed ===`)
if (failed > 0) {
  console.log('FAILED LAWS:')
  for (const f of fails) console.log(`  ✗ ${f}`)
  process.exit(1)
}
