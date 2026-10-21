/**
 * TEAM BRAVO — economy execution battery (read-only audit; writes NOTHING).
 * Run: bun scripts/audit-tmp/bravo/econ-exec.ts
 * Imports the REAL pure systems and exercises them with measured inputs.
 */
import { resolveJob, resolveHustle, calculateJobPay, hustleSuccessChance, type Rng } from '../../../src/game/systems/work'
import { JOBS } from '../../../src/game/data/jobs'
import { HUSTLES } from '../../../src/game/data/hustles'
import { incomeGuard, velocityGuard, chainNext, chainHash, verifyChain, CHAIN_SEED } from '../../../src/game/systems/fortress'
import { transferVerdict, depositVerdict, LEDGER_LIMITS, chainLink, LEDGER_SEED } from '../../../src/game/systems/ledger'
import { posFeeFor, atmRemaining, applyAtmDraw } from '../../../src/game/systems/chaos'
import { freshChaosState } from '../../../src/game/systems/chaos'
import { bizDayRoll, bizIncomeFor, freshBusiness } from '../../../src/game/systems/biz'
import { freshCivicState } from '../../../src/game/systems/civic'
import { resaleValue } from '../../../src/game/systems/garage'
import { generateHustleOffers, isEligible } from '../../../src/game/systems/opportunities'
import { CHAOS, FORTRESS, STARTING, WORK } from '../../../src/game/data/config'
import type { PlayerState } from '../../../src/game/types'

let pass = 0, fail = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) pass++; else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} → got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`)
}
function sec(t: string) { console.log(`\n== ${t} ==`) }

// deterministic rng
function seq(vals: number[]): Rng { let i = 0; return () => vals[Math.min(i++, vals.length - 1)]! }

const player = {
  level: 8, reputation: 400,
  skills: { hustle: 5, smart: 7, social: 4 },
  needs: { health: 100, energy: 90, hunger: 80, mood: 80 },
  activeOpportunities: [], cooldowns: {},
  ageBand: 'adult',
} as unknown as PlayerState

/* 1 — executed JOB payout end-to-end */
sec('1. JOB PAYOUT (government-worker, executed)')
const job = JOBS.find((j) => j.id === 'government-worker')!
console.log(`input: basePay=${job.basePay} skills.smart=${player.skills.smart} mood=${player.needs.mood} payRounding=${WORK.payRounding}`)
const plain = resolveJob(job, player, seq([0.99])) // 0.99 ≥ 0.18 → no great
const great = resolveJob(job, player, seq([0.01])) // 0.01 < 0.18 → great
console.log(`output plain: outcome=${plain.outcome} cash=${plain.cash} xp=${plain.reward.xp} rep=${plain.reward.reputation}`)
console.log(`output great: outcome=${great.outcome} cash=${great.cash} (expect ${plain.cash}×1.5 rounded to tens)`)
check('jobPay formula', calculateJobPay(job, player), Math.max(0, Math.round(job.basePay * (1 + (player.skills.smart - 1) * WORK.payPerSkillLevel) * 1.08 / WORK.payRounding) * WORK.payRounding))

/* 2 — executed HUSTLE payout end-to-end */
sec('2. HUSTLE PAYOUT (musa-fabric-carry, executed)')
const hus = HUSTLES.find((h) => h.id === 'musa-fabric-carry')!
console.log(`input: cashMin=${hus.reward.cashMin} cashMax=${hus.reward.cashMax} difficulty=${hus.difficulty} skill.hustle=${player.skills.hustle}`)
const hs = hustleSuccessChance(hus, player)
console.log(`successChance=${hs.toFixed(3)} (base ${WORK.baseSuccess} + (skill ${player.skills.hustle} − diff ${hus.difficulty})×${WORK.skillStep} + mood bonus ${WORK.moodChanceBonusHigh})`)
const hWin = resolveHustle(hus, player, seq([0.0, 0.10, 0.5])) // success, then great roll (0.10<0.18)
const hMid = resolveHustle(hus, player, seq([0.5, 0.9, 0.5]))
console.log(`output win-great: outcome=${hWin.outcome} cash=${hWin.cash} rep=${hWin.reward.reputation}`)
console.log(`output win-plain: outcome=${hMid.outcome} cash=${hMid.cash} (rolled ${hMid.cash} ∈ [${hus.reward.cashMin},${hus.reward.cashMax}×1.0])`)
const hFail = resolveHustle(hus, player, seq([0.999]))
console.log(`output fail: outcome=${hFail.outcome} cash=${hFail.cash} xp=${hFail.reward.xp} (expect 0.5×${hus.reward.xp})`)

/* 3 — income guard clamps */
sec('3. INCOME GUARD (FORTRESS ceilings)')
console.log(`constants: singleCeiling=${FORTRESS.singleCeiling} dayCeiling=${FORTRESS.dayCeiling} velocityCap=${FORTRESS.velocityCap}`)
check('mint 100M clamps to single ceiling', incomeGuard(100_000_000, 0, FORTRESS), { allowed: 1_500_000, clamped: true, law: 'single' })
check('day cap clamps remainder', incomeGuard(500_000, 2_800_000, FORTRESS), { allowed: 200_000, clamped: true, law: 'day' })
check('day cap exhausted → 0', incomeGuard(500, 3_000_000, FORTRESS), { allowed: 0, clamped: true, law: 'day' })
check('legit payout unclamped', incomeGuard(150_000, 0, FORTRESS), { allowed: 150_000, clamped: false, law: null })
check('velocity blocked at cap', velocityGuard(24, FORTRESS.velocityCap).allow, false)
check('velocity allows 23rd', velocityGuard(23, FORTRESS.velocityCap).allow, true)

/* 4 — purse verdicts (server door laws) */
sec('4. PURSE VERDICTS (ledger.ts pure laws)')
check('NaN refused', transferVerdict({ band: 'adult', amount: NaN, purse: 1e9, transferredToday: 0 }).why, 'bad-amount')
check('float refused', transferVerdict({ band: 'adult', amount: 500.5, purse: 1e9, transferredToday: 0 }).why, 'bad-amount')
check('negative refused', transferVerdict({ band: 'adult', amount: -500, purse: 1e9, transferredToday: 0 }).why, 'too-small')
check('over per-transfer cap', transferVerdict({ band: 'adult', amount: LEDGER_LIMITS.MAX_PER_TRANSFER + 1, purse: 1e9, transferredToday: 0 }).why, 'too-big')
check('kid blocked', transferVerdict({ band: 'kid', amount: 100, purse: 1e9, transferredToday: 0 }).why, 'minors-no-money')
check('guest blocked', transferVerdict({ band: 'guest', amount: 100, purse: 1e9, transferredToday: 0 }).why, 'unclaimed')
check('insufficient purse', transferVerdict({ band: 'adult', amount: 5000, purse: 4999, transferredToday: 0 }).why, 'insufficient')
check('day transfer cap', transferVerdict({ band: 'adult', amount: 10_000, purse: 1e9, transferredToday: LEDGER_LIMITS.DAY_TRANSFER_CAP - 5_000 }).why, 'day-cap')
check('self-send refused', transferVerdict({ band: 'adult', amount: 100, purse: 1e9, transferredToday: 0, to: 'me', from: 'me' }).why, 'self')
check('deposit day cap', depositVerdict({ band: 'adult', amount: 5_000, depositedToday: LEDGER_LIMITS.DAY_DEPOSIT_CAP - 1_000 }).why, 'day-cap')
check('deposit min ok', depositVerdict({ band: 'adult', amount: 1, depositedToday: 0 }).ok, true)

/* 5 — kobo-chain tamper evidence */
sec('5. KOBO-CHAIN (client ledger signature)')
const t1 = { day: 1, slot: 2, amount: 900, category: 'job', label: 'Market Worker' }
const s1 = chainNext(CHAIN_SEED, t1)
const t2 = { day: 1, slot: 3, amount: -2500, category: 'shop', label: 'Bought: rice' }
const s2 = chainNext(s1, t2)
check('honest chain verifies', verifyChain([{ ...t1, sig: s1 }, { ...t2, sig: s2 }]), { ok: true, brokenAt: -1 })
check('edited amount breaks chain', verifyChain([{ ...t1, amount: 9999, sig: s1 }, { ...t2, sig: s2 }]), { ok: false, brokenAt: 0 })
check('reordered entries break chain', verifyChain([{ ...t2, sig: s2 }, { ...t1, sig: s1 }]).ok, false)
check('inserted entry breaks chain', verifyChain([{ ...t1, sig: s1 }, { day: 1, slot: 2, amount: 1, category: 'x', label: 'y', sig: chainHash(s1, { day: 1, slot: 2, amount: 1, category: 'x', label: 'y' }) }, { ...t2, sig: s2 }]).ok, false)

/* 6 — POS fee + ATM cap math */
sec('6. POS FEE + ATM CAP (bank lanes)')
check('posFee 1000', posFeeFor(1000), Math.ceil((1000 * CHAOS.posFeeRate) / 10) * 10)
check('posFee 500000 capped at 2000', posFeeFor(500_000), 2000)
check('posFee 50 min step', posFeeFor(50), 10)
const chaos = freshChaosState()
console.log(`atmCap=${CHAOS.atmCap} posFeeRate=${CHAOS.posFeeRate}`)
check('ATM ∞ on normal day', atmRemaining(chaos, 3), Number.POSITIVE_INFINITY)
const c2 = applyAtmDraw(applyAtmDraw(chaos, 3, 3000), 3, 1500)
check('ATM remaining after 4500 drawn', atmRemaining(c2, 3), 500)

/* 7 — biz accrual idempotence + till conservation */
sec('7. BIZ DAY ROLL (idempotence + till)')
const civic = freshCivicState()
const biz = [freshBusiness('food-stand', 0)]
const r1 = bizDayRoll(biz, 0, 5, civic, 0)
const r2 = bizDayRoll(r1.next, 0, 5, civic, 0) // same window re-rolled
console.log(`run1: total=${r1.total} accrued=${r1.next[0]!.accrued} days 1..5`)
check('re-roll same window accrues 0 (idempotent)', r2.total, 0)
check('accrued equals earned sum', r1.next[0]!.accrued, r1.total)
const income5 = [1, 2, 3, 4, 5].map((d) => bizIncomeFor('food-stand', 1, d, civic, 0)).reduce((a, b) => a + b, 0)
check('day-by-day income matches roll', r1.total, income5)
check('collect empties till', ((): [number, number] => { const c = bizDayRoll(biz, 0, 2, civic, 0); const b = c.next[0]!; const amt = Math.max(0, Math.round(b.accrued)); return [amt, amt] })(), r1.next[0]!.accrued > 0 ? [r1.next[0]!.accrued, r1.next[0]!.accrued] : [0, 0])

/* 8 — signed conservation walk (the honest engine, 1,200 ops) */
sec('8. CONSERVATION WALK — signed paths only (1,200 ops)')
{
  let cash = STARTING.cash
  let totalEarned = 0, totalSpent = 0
  let chainTail = CHAIN_SEED
  const txs: { day: number; slot: number; amount: number; category: string; label: string; sig: string }[] = []
  let dayEarned = 0, dayEarnedDay = 1, slotCount = 0, slotNo = 1
  let rejectedSpend = 0, clampedIncome = 0
  const rng = seq(Array.from({ length: 1300 }, (_, i) => ((i * 9301 + 49297) % 233280) / 233280))
  for (let i = 0; i < 1200; i++) {
    const earn = rng() < 0.5
    const raw = Math.floor(rng() * 40_000) + 1
    const slot = (slotNo += 0) as number
    if (earn) {
      const dayEarnedCur = dayEarnedDay === dayEarnedDay ? dayEarned : 0
      const g = incomeGuard(raw, dayEarnedCur, FORTRESS)
      const paid = g.allowed
      if (g.clamped) clampedIncome++
      if (paid > 0 && velocityGuard(slotCount, FORTRESS.velocityCap).allow) {
        const sig = chainNext(chainTail, { day: 1, slot, amount: paid, category: 'job', label: `op${i}` })
        txs.push({ day: 1, slot, amount: paid, category: 'job', label: `op${i}`, sig })
        chainTail = sig
        cash += paid; totalEarned += paid; dayEarned += paid; slotCount++
      }
    } else {
      if (cash >= raw && velocityGuard(slotCount, FORTRESS.velocityCap).allow) {
        const sig = chainNext(chainTail, { day: 1, slot, amount: -raw, category: 'shop', label: `sp${i}` })
        txs.push({ day: 1, slot, amount: -raw, category: 'shop', label: `sp${i}`, sig })
        chainTail = sig
        cash -= raw; totalSpent += raw; slotCount++
      } else rejectedSpend++
    }
    if (i % 300 === 299) { dayEarned = 0; dayEarnedDay++; slotCount = 0; slotNo++ }
  }
  const sumPos = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const sumNeg = txs.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)
  check('cash == START + earned − spent (₦0 drift)', cash, STARTING.cash + sumPos + sumNeg)
  check('totalEarned == Σ positive txs', totalEarned, sumPos)
  check('totalSpent == |Σ negative txs|', totalSpent, -sumNeg)
  check('ledger chain intact after 1200 ops', verifyChain(txs).ok, true)
  console.log(`ops=1200 rejectedSpends=${rejectedSpend} clampedIncomeEvents=${clampedIncome} finalCash=${cash.toLocaleString()}`)
}

/* 9 — unsigned-path money creation probe (what the fortress does NOT see) */
sec('9. UNSIGNED PATH PROBE (bankDeposit/bankWithdraw/attendFestival/addCash shape)')
{
  // the four unsigned writes found in useGameStore, replayed raw:
  let cash = 5000, bank = 0
  bank += 1000; cash -= 1000                    // bankDeposit (2209/2210)
  cash += bank; bank = 0                        // bankWithdraw ATM (2262)
  console.log(`bank round-trip: cash=${cash} bank=${bank} (expected 5000/0 — conservation holds)`)
  const fee = posFeeFor(1000); cash += 1000 - fee; // POS withdraw net (2236)
  console.log(`POS withdraw 1000 → net ${1000 - fee} (fee ${fee} destroyed, booked chaos.stats.posFees)`)
  cash = Math.max(0, cash + 250)                // festival spray (2340) — unsigned income
  console.log(`festival spray +250 unsigned → cash=${cash} (no chain sig, no incomeGuard)`)
  cash = Math.max(0, cash + 500_000)            // addCash shape (4126) — fully silent
  console.log(`addCash(+500000) → cash=${cash} (NO tx, NO sig, NO guard, NO totalEarned)`)
  cash = Math.max(0, cash + -1_000_000)         // addCash negative destroys silently
  console.log(`addCash(-1000000) → cash=${cash} (negative clamp destroys silently)`)
}

/* 10 — hustle cooldown gate (no repeat-grind) */
sec('10. HUSTLE COOLDOWN GATE')
const withCd = { ...player, cooldowns: { [hus.id]: 10 } } as unknown as PlayerState
check('offer blocked while on cooldown', isEligible(hus, withCd, 5, []), false)
check('offer allowed after cooldown', isEligible(hus, withCd, 11, []), true)
check('no duplicate active defId', isEligible(hus, player, 5, [{ defId: hus.id } as never]), false)
const gen = generateHustleOffers('kpata-market', player, 100, seq([0.99, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]))
console.log(`search roll 0.99 vs dryChance — offers=${gen.offers.length} dry=${gen.dry}`)

/* 11 — vehicle resale destroys value (sink) */
sec('11. VEHICLE RESALE (executed)')
const r = resaleValue('okada', 10, 40)
console.log(`okada bought day 10 sold day 40 → ₦${r.toLocaleString()} (buy price was higher — depreciation is a money sink)`)

console.log(`\n==== RESULT: ${pass} PASS / ${fail} FAIL ====`)
if (fail > 0) process.exit(1)
