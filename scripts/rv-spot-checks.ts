/**
 * RV-3 — remaining spot checks: dead-end tolerance variants, config constants,
 * systems count, job boards, teleport roster, silk gates, app classification,
 * orphan webp consumers, DB conservation walk.
 * Run: bun run scripts/rv-spot-checks.ts
 */
import { Database } from 'bun:sqlite'
import { readFileSync } from 'fs'
import './geo/bootstrap'
import { decodeGeoBin } from '../src/game/world3d/geo'

const bytes = readFileSync('public/world/geo-v1.bin')
const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
const d = decodeGeoBin(buf)

// dead-end with spatial tolerance: endpoint with no OTHER way's geometry within tol
function deadEndTolerance(tol: number) {
  // build flat list of segments from all ways
  const segs: [number, number, number, number][] = []
  for (const w of d.roads) for (let i = 0; i < w.pts.length - 1; i++) {
    const a = w.pts[i], b = w.pts[i + 1]
    segs.push([a[0], a[1], b[0], b[1]])
  }
  function distPtSeg(px: number, pz: number, s: [number, number, number, number]) {
    const ax = s[0], az = s[1], bx = s[2], bz = s[3]
    const abx = bx - ax, abz = bz - az
    const l2 = abx * abx + abz * abz || 1
    let t = ((px - ax) * abx + (pz - az) * abz) / l2
    t = Math.max(0, Math.min(1, t))
    return Math.hypot(px - (ax + t * abx), pz - (az + t * abz))
  }
  let dead = 0, total = 0
  for (const w of d.roads) {
    for (const p of [w.pts[0], w.pts[w.pts.length - 1]]) {
      total++
      let connected = false
      for (const s of segs) {
        if (p[0] >= s[0] && p[0] <= s[2] || true) { /* no early bbox skip; keep simple */ }
        const dd = distPtSeg(p[0], p[1], s)
        if (dd < tol && !(dd === 0 && (s[0] === p[0] && s[1] === p[1] || s[2] === p[0] && s[3] === p[1]))) {
          // touching another segment (even its interior) counts as connected
          // but exclude the segment that IS this endpoint's own: approximation acceptable
          if (dd < tol) { connected = true; break }
        }
      }
      if (!connected) dead++
    }
  }
  return { dead, total, pct: (dead / total * 100).toFixed(1) }
}
// cheaper variant: grid-hash endpoints, check if any OTHER way endpoint within tol
function deadEndByEndpoints(tol: number) {
  const eps: [number, number, string][] = []
  for (const w of d.roads) {
    const a = w.pts[0], b = w.pts[w.pts.length - 1]
    const wa = `${a[0]},${a[1]}`, wb = `${b[0]},${b[1]}`
    eps.push([a[0], a[1], wa], [b[0], b[1], wb])
  }
  let dead = 0
  for (const [x, z, self] of eps) {
    let near = false
    for (const [ox, oz, oself] of eps) {
      if (oself === self) continue
      if (Math.hypot(ox - x, oz - z) < tol) { near = true; break }
    }
    if (!near) dead++
  }
  return { dead, total: eps.length, pct: (dead / eps.length * 100).toFixed(1) }
}
console.log('deadend tol=1 endpoint-proximity:', JSON.stringify(deadEndByEndpoints(1)))
console.log('deadend tol=2 endpoint-proximity:', JSON.stringify(deadEndByEndpoints(2)))
console.log('deadend tol=3 endpoint-proximity:', JSON.stringify(deadEndByEndpoints(3)))

// ---------- config constants via text ----------
const cfgTxt = readFileSync('src/game/data/config.ts', 'utf8')
const lineOf = (re: RegExp) => { const m = cfgTxt.match(re); const i = cfgTxt.slice(0, m?.index ?? 0).split('\n').length; return { val: m?.[1] ?? m?.[0], line: i } }
console.log('cash 5000:', lineOf(/cash:\s*5000/))
console.log('yearDays:', lineOf(/yearDays:\s*\d+/))
console.log('xpBase:', lineOf(/xpBase:\s*\d+/), 'xpGrowth:', lineOf(/xpGrowth:\s*[\d.]+/))
console.log('atm daily cap:', lineOf(/atmDailyCap|atm[\s\S]{0,40}/))

// festivals
const calTxt = readFileSync('src/game/systems/calendar.ts', 'utf8')
const festLines = calTxt.split('\n').filter(l => /FESTIVALS|name: '/.test(l)).slice(0, 16)
const festNames = [...calTxt.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1])
console.log('festival names:', JSON.stringify(festNames))

// job-board POIs
const locTxt = readFileSync('src/game/data/locations.ts', 'utf8')
console.log('job-board mentions:', (locTxt.match(/job-board/g) ?? []).length)

// teleport roster
const tpTxt = readFileSync('src/game/systems/teleport.ts', 'utf8')
const rosterBlock = tpTxt.match(/TELEPORT_ROSTER[\s\S]*?\]/)?.[0] ?? ''
const rosterIds = [...rosterBlock.matchAll(/'([a-z-]+)'/g)].map(m => m[1])
console.log('TELEPORT_ROSTER:', rosterIds.length, JSON.stringify(rosterIds))
const catBlock = tpTxt.match(/TELEPORT_CATEGORIES[\s\S]*?\]/)?.[0] ?? ''
const catIds = [...catBlock.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1])
console.log('TELEPORT_CATEGORIES:', catIds.length, JSON.stringify(catIds))

// systems count (the "63 systems" claim) — src/game/systems files
const { execSync } = require('child_process')
const sysFiles = execSync(`ls src/game/systems/*.ts | wc -l`, { shell: '/bin/bash' }).toString().trim()
const worldFiles = execSync(`ls src/game/world3d/*.ts | wc -l`, { shell: '/bin/bash' }).toString().trim()
const dataFiles = execSync(`ls src/game/data/*.ts | wc -l`, { shell: '/bin/bash' }).toString().trim()
const workers = execSync(`ls src/game/workers/*.ts | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('systems/*.ts:', sysFiles, 'world3d/*.ts:', worldFiles, 'data/*.ts:', dataFiles, 'workers:', workers, '→ total engine modules:', +sysFiles + +worldFiles + +dataFiles + +workers)
const stores = execSync(`ls src/game/store/*.ts`, { shell: '/bin/bash' }).toString().trim().split('\n')
console.log('stores:', JSON.stringify(stores))

// BAY_SPECS check
const vehTxt = readFileSync('src/game/world3d/vehicles.ts', 'utf8')
console.log('BAY_SPECS in vehicles.ts:', /BAY_SPECS/.test(vehTxt), 'PARKED_VEHICLES:', vehTxt.match(/PARKED_VEHICLES[\s\S]{0,80}/)?.[0]?.replace(/\n/g, ' ').slice(0, 90))

// silk gates content
const silk = readFileSync('scripts/silk-gates.ts', 'utf8')
console.log('silk gates:', [...silk.matchAll(/G\d[^:\n]*|gate[^\n]*/gi)].slice(0, 10).map(m => m[0].trim().slice(0, 60)))
console.log('silk TTI threshold:', silk.match(/3\.0|3000/)?.[0], 'wire KB:', silk.match(/900/)?.[0])

// OPTIMIZATION-PLAN measured numbers
const opt = readFileSync('OPTIMIZATION-PLAN.md', 'utf8')
console.log('OPTIMIZATION-PLAN line 50 region:', opt.split('\n').slice(45, 55).join(' | ').slice(0, 400))

// phone app classification
const ps = readFileSync('src/components/game/screens/PhoneScreen.tsx', 'utf8')
const appBlock = ps.slice(ps.indexOf('const apps: AppDef[]'))
const appIds = [...appBlock.matchAll(/id:\s*'([a-z-]+)'/g)].map(m => m[1])
console.log('app grid ids:', appIds.length, JSON.stringify(appIds))

// orphan webp consumers
const artDir = execSync(`ls public/art/`, { shell: '/bin/bash' }).toString().trim().split('\n')
console.log('public/art files:', artDir.length, JSON.stringify(artDir))
let locConsumer = execSync(`grep -rl "LocationArt" src/ --include='*.tsx' --include='*.ts' | grep -v LocationArt.tsx | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('LocationArt importers (excl self):', locConsumer)
let adConsumer = execSync(`grep -rl "ad-" src/ scripts/ --include='*.tsx' --include='*.ts' --include='*.mjs' 2>/dev/null | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('files mentioning ad- :', adConsumer)
let hero = execSync(`grep -rl "menu-hero" src/ | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('menu-hero consumers:', hero)

// sw version
const sw = readFileSync('public/sw.js', 'utf8')
console.log('SW_VERSION:', sw.match(/SW_VERSION\s*=\s*'([^']+)'/)?.[1])

// ---------- DB conservation walk ----------
console.log('== BOOKS ==')
const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
const tables = db.query(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`).all().map((t: any) => t.name)
console.log('tables(' + tables.length + '):', tables.join(','))
const ledgerCount = (db.query(`SELECT COUNT(*) c FROM LedgerRow`).get() as any).c
console.log('LedgerRow rows:', ledgerCount)
const kinds = db.query(`SELECT kind, COUNT(*) c, SUM(amount) s FROM LedgerRow GROUP BY kind ORDER BY kind`).all()
console.log('by kind:', JSON.stringify(kinds))
const wallets = db.query(`SELECT COUNT(*) c, COALESCE(SUM(balance),0) s FROM WalletRow`).get() as any
console.log('WalletRow count:', wallets.c, 'Σ balance:', wallets.s)
const dep = kinds.find((k: any) => k.kind === 'deposit')?.s ?? 0
const wd = kinds.find((k: any) => k.kind === 'withdraw')?.s ?? 0
const fuel = kinds.find((k: any) => k.kind === 'refuel')?.s ?? 0
const rep = kinds.find((k: any) => k.kind === 'repair')?.s ?? 0
const tip = kinds.find((k: any) => k.kind === 'tip')?.s ?? 0
console.log(`kind-aware: deposits ${dep} - withdraws ${wd} - refuel ${fuel} - repair ${rep} = ${dep - wd - fuel - rep} vs ΣWalletRow ${wallets.s} (tips ${tip})`)

// prisma models
const schema = readFileSync('prisma/schema.prisma', 'utf8')
console.log('prisma models:', (schema.match(/^model /gm) ?? []).length, JSON.stringify(schema.match(/^model (\w+)/gm)))

// api routes
const apiRoutes = execSync(`find src/app/api -name "route.ts*" | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('api route files:', apiRoutes)

// e2e baseline counts (hardening 18, wheels 90, ledger 45, fuel 53)
const hard = execSync(`grep -c "test(" scripts/test-m24-hardening.ts 2>/dev/null || echo 0`, { shell: '/bin/bash' }).toString().trim()
console.log('hardening test() count:', hard)
