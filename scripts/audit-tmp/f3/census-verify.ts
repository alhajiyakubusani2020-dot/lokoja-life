/**
 * FIX SQUAD F3 — verify the 8 world fixes. Modeled on ../charlie/census.ts
 * (same bootstrap + dynamic-import approach). AUDIT SCRIPT, no source edits.
 * Usage: bun scripts/audit-tmp/f3/census-verify.ts
 */
import './bootstrap-shim'
import { createHash } from 'crypto'
import { spawnSync } from 'child_process'

let fails = 0
function check(name: string, ok: boolean, detail: string): void {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} — ${detail}`)
  if (!ok) fails++
}

function sha(s: string): string {
  return createHash('sha256').update(s).digest('hex')
}

async function main() {
  const layout = await import('../../../src/game/world3d/layout')
  const schools = await import('../../../src/game/world3d/schools')
  const collision = await import('../../../src/game/world3d/collision')
  const vehicles = await import('../../../src/game/world3d/vehicles')
  const locationsMod = await import('../../../src/game/data/locations')
  const teleport = await import('../../../src/game/systems/teleport')
  const L = layout
  const LOCATIONS = locationsMod.LOCATIONS

  // ---- FIX 2: TREES deleted, GRASS shrunk ----
  const treesAbsent = !('TREES' in L)
  check('FIX2 TREES absent', treesAbsent, `'TREES' in layout === ${!treesAbsent} (dynamic namespace check)`)
  check('FIX2 GRASS length', L.GRASS.length === 800, `layout.GRASS=${L.GRASS.length} (was 7500; target ~800)`)
  // WorldTerrain Flowers contract: walk GRASS by 11, keep riverside ones, cap 72
  let flowers = 0
  for (let i = 0; i < L.GRASS.length && flowers < 72; i += 11) {
    const g = L.GRASS[i]
    const rv = L.riverInfo(g.x, g.z)
    if (rv.d > rv.halfWidth + 11) continue
    flowers++
  }
  check('FIX2 Flowers contract intact', flowers >= 60, `Flowers picks ${flowers}/72 riverside dots from the 800 pool (≥60 keeps the feature honest)`)

  // ---- FIX 1: stalls ----
  const anchors = ['kpata-market', 'food-area', 'ganaja-junction'] as const
  const perRow: Record<string, number> = { 'kpata-market': 0, 'food-area': 0, 'ganaja-junction': 0 }
  let minGap = Infinity
  let dry = true
  for (const s of L.STALLS) {
    let best = ''
    let bd = Infinity
    for (const id of anchors) {
      const a = L.ANCHOR_BY_ID[id]
      const d = Math.hypot(a.x - s.x, a.z - s.z)
      if (d < bd) { bd = d; best = id }
    }
    if (bd <= 25) perRow[best]++
    minGap = Math.min(minGap, L.roadGap(s.x, s.z))
    if (L.heightAt(s.x, s.z) <= L.WATER_Y + 0.15) dry = false
  }
  console.log(`STALLS total=${L.STALLS.length} perRow=${JSON.stringify(perRow)} minRoadGap=${minGap.toFixed(3)} allDry=${dry}`)
  check('FIX1 total', L.STALLS.length >= 14, `STALLS=${L.STALLS.length} ≥ 14 (bounded by rows 14/10/8)`)
  check('FIX1 kpata-market', perRow['kpata-market'] >= 6, `kpata-market=${perRow['kpata-market']} ≥ 6`)
  check('FIX1 food-area', perRow['food-area'] >= 6, `food-area=${perRow['food-area']} ≥ 6`)
  check('FIX1 never on carriageway', minGap >= 0.45, `min roadGap=${minGap.toFixed(3)} ≥ 0.45 (the stall law)`)
  check('FIX1 dry ground', dry, 'every stall stands above the waterline')

  // ---- FIX 5: colliders ----
  const schoolColliders = schools.SCHOOL_BOXES.filter(schools.isSchoolCollider).length
  const before = L.BUILDINGS.length + schoolColliders + L.POINTS_OF_INTEREST.length
  const stallBoxes = Math.min(L.STALLS.length, 23)
  const after = before + vehicles.PARKED_VEHICLES.length + stallBoxes
  const delta = after - before
  console.log(`BOXES before=${before} (buildings ${L.BUILDINGS.length} + school ${schoolColliders} + POI ${L.POINTS_OF_INTEREST.length}) after=${after} (parked ${vehicles.PARKED_VEHICLES.length} + stalls ${stallBoxes}) delta=+${delta}`)
  check('FIX5 box delta ≤ 30', delta <= 30 && delta >= 7, `delta=+${delta} (7 parked bays + ≤23 stall counters)`)
  // functional: standing INSIDE a stall/parked bay must be pushed out
  let pushedStalls = 0
  for (const s of L.STALLS.slice(0, stallBoxes)) {
    const [rx, rz] = collision.resolvePosition(s.x, s.z)
    if (Math.hypot(rx - s.x, rz - s.z) > 0.01) pushedStalls++
  }
  let pushedParked = 0
  for (const p of vehicles.PARKED_VEHICLES) {
    const [rx, rz] = collision.resolvePosition(p.x, p.z)
    if (Math.hypot(rx - p.x, rz - p.z) > 0.01) pushedParked++
  }
  check('FIX5 stall colliders block', pushedStalls === stallBoxes, `${pushedStalls}/${stallBoxes} stall centres pushed out by resolvePosition`)
  check('FIX5 parked bays block', pushedParked === vehicles.PARKED_VEHICLES.length, `${pushedParked}/${vehicles.PARKED_VEHICLES.length} parked bays pushed out by resolvePosition`)

  // ---- FIX 2b: doors untouched ----
  check('DOORS unchanged', L.DOORS.length === 10 && schools.ALL_DOORS.length === 98, `layout.DOORS=${L.DOORS.length} (baseline 10), ALL_DOORS=${schools.ALL_DOORS.length} (baseline 98)`)

  // ---- FIX 6: teleport roster v2 (append-only) ----
  const v1 = ['home', 'kpata-market', 'ganaja-junction', 'confluence', 'mount-patti', 'historic-lokoja', 'government-area', 'university-area', 'food-area', 'transport-area']
  const head = teleport.TELEPORT_ROSTER.slice(0, 10)
  check('FIX6 roster size', teleport.TELEPORT_ROSTER.length === LOCATIONS.length, `TELEPORT_ROSTER=${teleport.TELEPORT_ROSTER.length} of ${LOCATIONS.length} locations (was 10/32)`)
  check('FIX6 v1 head untouched', JSON.stringify(head) === JSON.stringify(v1), 'first 10 ids = v1 order exactly (circulating codes keep their indexes)')
  const expectedTail = LOCATIONS.map((l) => l.id).filter((id) => !v1.includes(id))
  const tail = teleport.TELEPORT_ROSTER.slice(10)
  check('FIX6 tail = LOCATIONS order', JSON.stringify(tail) === JSON.stringify(expectedTail), `tail[${tail.length}] = schools + G2 in registry order`)
  const roundTrip = (locId: string): boolean => {
    const enc = teleport.encodeTeleport({ v: 1, day: 41, locId, name: 'F3 Check', level: 2, rep: 10, earned: 1250, moves: 2, trail: [0, 1, 2] })
    if (!enc.ok) return false
    const dec = teleport.decodeTeleport(enc.code)
    return dec.ok && dec.moment.locId === locId && dec.moment.earned === 1250 && enc.code.length <= teleport.TELEPORT_CODE_LIMIT
  }
  check('FIX6 v1 round-trip', roundTrip('kpata-market'), `encode→decode 'kpata-market' ok, code ≤ ${teleport.TELEPORT_CODE_LIMIT}`)
  check('FIX6 new-id round-trip', roundTrip('adankolo') && roundTrip('sokamms-motel'), "encode→decode 'adankolo' + 'sokamms-motel' (appended tail ids) ok")
  console.log(`sample new-id code: ${(() => { const e = teleport.encodeTeleport({ v: 1, day: 41, locId: 'adankolo', name: 'F3 Check', level: 2, rep: 10, earned: 1250, moves: 2, trail: [0, 1, 2] }); return e.ok ? `${e.code} (${e.code.length}B)` : e.why })()}`)

  // ---- FIX 7: naira formatter (static import graph check via the built postcard) ----
  const pc = teleport.postcardFor({ v: 1, day: 41, locId: 'kpata-market', name: 'F3', level: 2, rep: 10, earned: 1250, moves: 2, trail: [0, 1, 2] })
  check('FIX7 formatNaira in postcard', pc.body.includes('₦1,250'), `body="${pc.body}"`)

  // ---- determinism: two fresh child processes + this one, byte-identical ----
  const self = sha(JSON.stringify(L.STALLS))
  const outs: string[] = []
  for (let i = 0; i < 2; i++) {
    const r = spawnSync(process.execPath, ['scripts/audit-tmp/f3/stall-sha.ts'], { cwd: '/home/z/my-project', encoding: 'utf8' })
    outs.push(r.stdout.trim().split('\n').filter(Boolean).pop() ?? `spawn-failed:${r.stderr.slice(0, 200)}`)
  }
  const childA = JSON.parse(outs[0])
  const childB = JSON.parse(outs[1])
  console.log(`stalls sha256(self) =${self}`)
  console.log(`stalls sha256(run1) =${childA.stallsSha} len=${childA.stallsLen}`)
  console.log(`stalls sha256(run2) =${childB.stallsSha} len=${childB.stallsLen}`)
  console.log(`grass  sha256(run1) =${childA.grassSha} len=${childA.grassLen} | run2 len=${childB.grassLen}`)
  check('DETERMINISM stalls', self === childA.stallsSha && childA.stallsSha === childB.stallsSha && childA.stallsLen === L.STALLS.length, '3 independent module evaluations → identical STALLS bytes')
  check('DETERMINISM grass', childA.grassSha === childB.grassSha && childA.grassLen === childB.grassLen, 'GRASS identical across runs')

  console.log(fails === 0 ? '== F3 VERIFY: ALL PASS ==' : `== F3 VERIFY: ${fails} FAILURE(S) ==`)
  if (fails > 0) process.exit(1)
}

main()
