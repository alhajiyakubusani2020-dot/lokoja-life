/** TEAM BRAVO PH2.5 — the mandate's exact hostile scalar: {player:{cash:1e308}} → 400? */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { POST as pushPOST } from '../../../src/app/api/cloud/push/route'

const db = new PrismaClient({ log: [] })
const tag = Date.now().toString(36).slice(-6)
const HANDLE = `bravo25_e30_${tag}`
const salt = randomBytes(16).toString('hex')
const token = randomBytes(24).toString('hex')
await db.account.create({ data: { handle: HANDLE, pinHash: scryptSync('1234', salt, 32).toString('hex'), salt, ageBand: 'adult', token } })

const res = await pushPOST(new Request('http://localhost/api/cloud/push', {
  method: 'POST',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-forwarded-for': '10.4.4.4' },
  body: JSON.stringify({ data: { player: { cash: 1e308 }, world: { day: 1 }, version: 1 } }),
}))
const body = (await res.json()) as Record<string, unknown>
console.log(`cash:1e308 push → status=${res.status} body=${JSON.stringify(body)}`)
console.log(res.status === 400 ? 'PASS hostile 1e308 refused' : 'FAIL hostile 1e308 NOT refused')
const row = await db.cloudSave.findUnique({ where: { accountId: (await db.account.findUnique({ where: { handle: HANDLE } }))!.id } })
console.log(row ? `FAIL row stored anyway (version=${row.version})` : 'PASS no vault row stored')
await db.$disconnect()
process.exit(res.status === 400 && !row ? 0 : 1)
