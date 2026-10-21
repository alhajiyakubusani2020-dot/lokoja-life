import { bizDayRoll, bizIncomeFor, freshBusiness, bizCollect } from '../../../src/game/systems/biz'
import { freshCivicState } from '../../../src/game/systems/civic'
import { BIZ } from '../../../src/game/data/config'
const civic = freshCivicState()
for (const id of Object.keys(BIZ.types)) {
  const biz = [freshBusiness(id, 0)]
  const r1 = bizDayRoll(biz, 0, 5, civic, 0)
  const r2 = bizDayRoll(r1.next, 0, 5, civic, 0)
  const byDay = [1,2,3,4,5].map(d => bizIncomeFor(id, 1, d, civic, 0))
  const col = bizCollect(r1.next[0]!, 5)
  console.log(`${id}: run1Total=${r1.total} reRoll=${r2.total} byDaySum=${byDay.reduce((a,b)=>a+b,0)} collect=${col.amount} tillAfter=${col.next.accrued}`)
}
