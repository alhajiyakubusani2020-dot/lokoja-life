/** TEAM BRAVO PH2.5 — tier door probe: handle+IP key law + single body read */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { POST as tierPOST } from '../../../src/app/api/auth/tier/route'

const db = new PrismaClient({ log: [] })
const tag = Date.now().toString(36).slice(-6)
const HANDLE = `bravo25_tier_${tag}`
const salt = randomBytes(16).toString('hex')
await db.account.create({ data: { handle: HANDLE, pinHash: scryptSync('4321', salt, 32).toString('hex'), salt, ageBand: 'teen' } })

const call = (pin: string) => tierPOST(new Request('http://localhost/api/auth/tier', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.2.2.2' },
  body: JSON.stringify({ handle: HANDLE, pin, parentPin: '121212', toBand: 'adult' }),
})).then(async (r) => `${r.status}:${((await r.json()) as { why?: string }).why}`)

const out: string[] = []
for (let i = 0; i < 12; i++) out.push(await call('0000'))
console.log('lane:', out.join(' · '))
const ok401 = out.slice(0, 10).filter((o) => o === '401:Name or PIN no match — try again.').length
const ok429 = out[10] === '429:too-many-attempts' && out[11] === '429:too-many-attempts'
console.log(`${ok401 === 10 ? 'PASS' : 'FAIL'} attempts 1–10: 401 (got ${ok401})`)
console.log(`${ok429 ? 'PASS' : 'FAIL'} attempts 11–12: 429 too-many-attempts (handle+IP key, single body read)`)
// malformed body → 400 (bad band), not 500 (double-read crash)
const bad = await tierPOST(new Request('http://localhost/api/auth/tier', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.2.2.3' },
  body: 'not json',
})).then(async (r) => `${r.status}:${((await r.json()) as { why?: string }).why}`)
console.log(`${bad === '400:Pick a tier — kid, teen or adult.' ? 'PASS' : 'FAIL'} malformed body → honest 400 (got ${bad})`)
await db.$disconnect()
process.exit(ok401 === 10 && ok429 && bad.startsWith('400') ? 0 : 1)
