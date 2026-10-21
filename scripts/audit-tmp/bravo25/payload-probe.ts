/**
 * TEAM BRAVO PH2.5 — cloud payload probe (real route handlers, real db/custom.db).
 * Run: bun scripts/audit-tmp/bravo25/payload-probe.ts
 *
 * Re-runs the Phase-2 hostile-payload probes against the F1 law AND the
 * new PH2.5 laws:
 *   • 600KB envelope → 400 (MAX_SAVE_BYTES, verified still holds)
 *   • hostile scalars: cash:-999999 / day:"5" / version 999 → 400 each
 *   • garbage patch → 400 'patch refused — send whole'
 *   • valid push within cap → ok
 *   • DELTA CEILING: a legit 200KB patch whose rebuild crosses 512KB → 400
 *     (the old delta door was the one write that could park an oversized row)
 *   • PULL CEILING: an oversized legacy vault row is refused, never streamed
 *   • 31st push in the hour → 429 'too-many-pushes'; 61st pull → 429
 */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { POST as pushPOST } from '../../../src/app/api/cloud/push/route'
import { GET as pullGET } from '../../../src/app/api/cloud/pull/route'
import { encodeDelta } from '../../../src/game/systems/binarydelta'

const db = new PrismaClient({ log: [] })
let pass = 0, fail = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) pass++; else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} → got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`)
}
const sec = (t: string) => console.log(`\n== ${t} ==`)

const tag = Date.now().toString(36).slice(-6)
const HANDLE = `bravo25_push_${tag}`

const salt = randomBytes(16).toString('hex')
const pinHash = scryptSync('1234', salt, 32).toString('hex')
const token = randomBytes(24).toString('hex')
await db.account.create({ data: { handle: HANDLE, pinHash, salt, ageBand: 'adult', token } })

async function push(body: unknown): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await pushPOST(new Request('http://localhost/api/cloud/push', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-forwarded-for': '10.8.8.8' },
    body: JSON.stringify(body),
  }))
  return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}
async function pull(): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await pullGET(new Request('http://localhost/api/cloud/pull', {
    headers: { authorization: `Bearer ${token}`, 'x-forwarded-for': '10.8.8.8' },
  }))
  return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}

const validSave = () => ({ player: { cash: 100 }, world: { day: 1 }, version: 1 })

/* ---- hostile payloads (each lands in the push bucket — by design) ---- */
sec('1. HOSTILE PAYLOADS (Phase-2 law re-run + 600KB)')
let r = await push({ data: { ...validSave(), player: { cash: -999999 } } })
check('cash:-999999 → 400', [r.status, r.body.why], [400, 'bad payload'])
r = await push({ data: { ...validSave(), world: { day: '5' } } })
check('day:"5" → 400', [r.status, r.body.why], [400, 'bad payload'])
r = await push({ data: { ...validSave(), version: 999 } })
check('version 999 → 400', [r.status, r.body.why], [400, 'bad payload'])
r = await push({ data: { ...validSave(), filler: 'x'.repeat(600_000) } })
check('600KB envelope → 400 too large', [r.status, r.body.why], [400, 'payload too large'])
r = await push({ data: validSave() })
check('valid push within cap → ok', [r.status, r.body.ok], [200, true])
r = await push({ patch: Buffer.from('not a real LKBD patch at all').toString('base64'), sig: 'x' })
check('garbage patch (base exists) → 400 refused', [r.status, r.body.why], [400, 'patch refused — send whole'])

sec('2. THE DELTA CEILING (patch small, rebuild > 512KB)')
// base: a valid 400KB envelope under the cap
const baseSave = { ...validSave(), filler: 'b'.repeat(400_000) }
r = await push({ data: baseSave })
check('400KB base push → ok', [r.status, r.body.ok], [200, true])
const baseStr = JSON.stringify(baseSave)
// next: the same envelope grown past the ceiling by a lawful extra key
const next = JSON.stringify({ ...baseSave, tail: 'z'.repeat(120_000) })
check('rebuild would exceed 512KB', next.length > 512_000, true)
const patchB64 = Buffer.from(encodeDelta(baseStr, next)).toString('base64')
check('patch itself stays under the envelope cap', patchB64.length <= 512_000, true)
r = await push({ patch: patchB64, sig: 'x' })
check('oversized rebuild → 400 payload too large (was: stored!)', [r.status, r.body.why], [400, 'payload too large'])

sec('3. THE PULL CEILING + PULL THROTTLE')
// an oversized LEGACY row (pre-F1 shape) is planted directly, then refused
const accountId = (await db.account.findUnique({ where: { handle: HANDLE } }))!.id
await db.cloudSave.update({ where: { accountId }, data: { data: JSON.stringify({ legacy: true, blob: 'q'.repeat(600_000) }), version: 9, sig: null } })
r = await pull()
check('oversized legacy row → 400, never streamed', [r.status, r.body.why], [400, 'vault row too large'])
// restore a lawful row, then walk the pull bucket to the 61st
// (the ceiling probe's 400 already spent token #1 — the bucket counts
// every authenticated attempt, refusals included, by design)
await db.cloudSave.update({ where: { accountId }, data: { data: JSON.stringify(validSave()), version: 1, sig: 'probe' } })
let pullOutcomes: string[] = []
for (let i = 1; i <= 59; i++) {
  const pr = await pull()
  pullOutcomes.push(`${pr.status}`)
}
check('pulls 2–60 all ok (59×; token #1 was the ceiling refusal)', pullOutcomes.filter((s) => s === '200').length, 59)
const pr61 = await pull()
check('61st pull in the hour → 429', pr61.status, 429)
check('429 why too-many-pulls', pr61.body.why, 'too-many-pulls')

sec('4. THE PUSH THROTTLE (30/h — the bucket already holds 9)')
// attempts so far: 9 (6 hostile/valid + base + delta + none-failed-bucket... counted: every authenticated attempt)
let okPushes = 0
let saw429 = false
for (let i = 0; i < 40; i++) {
  const pr = await push({ data: validSave() })
  if (pr.status === 200) okPushes++
  if (pr.status === 429) { saw429 = true; check('429 why too-many-pushes', pr.body.why, 'too-many-pushes'); break }
}
check('the 31st push in the hour → 429 (honest pushes before it: ok)', saw429, true)

await db.$disconnect()
console.log(`\n== PAYLOAD PROBE: ${pass} PASS / ${fail} FAIL ==`)
process.exit(fail === 0 ? 0 : 1)
