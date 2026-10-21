/**
 * F5 OVERDRAFT RACE PROOF — the purse can no longer go negative.
 * ================================================================
 * Proves the DB-level guarantee the relay lane (src/app/api/live/action/
 * route.ts, 'wallet-withdraw'/'wallet-transfer') now relies on: the debit
 * is a CONDITIONAL updateMany — `WHERE handle = ? AND balance >= amount`
 * — so two concurrent debits of one purse yield exactly ONE bump. The
 * route uses the IDENTICAL statement inside its Prisma interactive
 * transaction (`tx.walletRow.updateMany({ where: { handle, balance:
 * { gte: amount } }, data: { balance: { decrement: amount } } })`, route
 * lines 678/685); this test replicates that exact pattern (wrapped in
 * db.$transaction the same way) against the real db/custom.db.
 *
 * Run: bun scripts/audit-tmp/f5/overdraft-test.ts
 */
import { PrismaClient } from '@prisma/client'

// the client setup mirrors src/lib/db.ts (same DATABASE_URL, query log off
// here so the assert output stays readable)
const db = new PrismaClient()

const HANDLE = 'f5-overdraft-test'
const AMOUNT = 80

/** THE CONDITIONAL DEBIT — the exact statement the relay route runs inside
 * its tx (route.ts:678 withdraw, :685 transfer spend leg). */
function conditionalDebit(client: PrismaClient, handle: string, amount: number) {
  return client.$transaction(async (tx) =>
    tx.walletRow.updateMany({
      where: { handle, balance: { gte: amount } },
      data: { balance: { decrement: amount }, version: { increment: 1 } },
    }),
  )
}

async function main(): Promise<void> {
  // fresh purse, balance 100 — the same state the route's verdict lane reads
  await db.walletRow.upsert({
    where: { handle: HANDLE },
    create: { handle: HANDLE, balance: 100 },
    update: { balance: 100, version: 0 },
  })

  // TWO concurrent spends of ONE purse (the race: both verdicts read 100,
  // both ask to decrement 80) — the OLD unconditional decrement drove the
  // purse to -60; the conditional one must let exactly ONE through.
  const [a, b] = await Promise.all([
    conditionalDebit(db, HANDLE, AMOUNT),
    conditionalDebit(db, HANDLE, AMOUNT),
  ])

  const after = await db.walletRow.findUnique({ where: { handle: HANDLE } })
  const bumped = a.count + b.count

  console.log(`bump counts: ${a.count} + ${b.count} (total ${bumped})`)
  console.log(`final balance: ${after?.balance}`)

  const pass =
    bumped === 1 &&
    a.count + b.count === 1 &&
    after?.balance === 20 &&
    (after?.balance ?? 0) >= 0

  if (!pass) {
    console.error('FAIL — the overdraft race is NOT closed')
    process.exitCode = 1
  } else {
    console.log('PASS — exactly one debit won; balance 20; never negative')
  }

  // clean up the test row (leave the books as we found them)
  await db.walletRow.delete({ where: { handle: HANDLE } })
  console.log('cleanup: test wallet row deleted')
}

main()
  .catch((e) => {
    console.error('test crashed:', e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
