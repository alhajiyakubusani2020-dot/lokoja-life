/**
 * RV-2 — NO-TRUST DATA + WIRE + UI + BOOKS CENSUS
 * Reproduces every remaining load-bearing figure.
 * Run: bun run scripts/rv-data-census.ts
 */
import { Database } from 'bun:sqlite'
import { readFileSync } from 'fs'

// ---------- A. config/data constants ----------
const cfg: any = await import('../src/game/data/config')
const cal: any = await import('../src/game/systems/calendar')
console.log('== CONFIG ==')
console.log('START_CASH:', cfg.PLAYER?.cash ?? cfg.CONFIG?.player?.cash ?? cfg.default?.cash, '(grep fallback below)')
console.log('yearDays:', cfg.TIME?.yearDays, cfg.CALENDAR?.yearDays, cfg.WORLD?.yearDays)
const fest = cal.FESTIVALS ?? cal.FESTIVAL_DAYS ?? cal.CITY_FESTIVALS
console.log('calendar exports:', Object.keys(cal).join(','))
console.log('xp:', JSON.stringify(cfg.PROGRESSION?.xpBase), cfg.PROGRESSION?.xpGrowth, 'maxLevel:', cfg.PROGRESSION?.maxLevel)
console.log('rent(ladder):', JSON.stringify(cfg.LADDER?.housing))
console.log('ECONOMY keys:', JSON.stringify(Object.keys(cfg.ECONOMY ?? {})))
console.log('FORTRESS:', JSON.stringify(cfg.FORTRESS))
console.log('AUTOSAVE:', JSON.stringify(cfg.AUTOSAVE))
console.log('GAME_META:', JSON.stringify(cfg.GAME_META))

// ---------- B. line-count + anchor greps ----------
console.log('== ANCHOR GREPS ==')
const read = (p: string) => readFileSync(p, 'utf8')
const lc = (p: string) => read(p).split('\n').length
console.log('useGameStore lines:', lc('src/game/store/useGameStore.ts'))
console.log('HudOverlay lines:', lc('src/components/game/world/HudOverlay.tsx'))
console.log('config.ts lines:', lc('src/game/data/config.ts'))

// freeMeters 150
const cfgTxt = read('src/game/data/config.ts')
const fm = cfgTxt.match(/freeMeters:\s*(\d+)/)
console.log('freeMeters:', fm?.[1], 'at line', cfgTxt.slice(0, fm?.index ?? 0).split('\n').length)
const autos = cfgTxt.match(/debounceMs:\s*(\d+)/)
console.log('autosave debounceMs:', autos?.[1])

// controls speeds
const controls = read('src/components/game/world/controls.ts')
console.log('walkSpeed:', controls.match(/walkSpeed:\s*([\d.]+)/)?.[1], 'sprintSpeed:', controls.match(/sprintSpeed:\s*([\d.]+)/)?.[1])

// Actors constants
const actors = read('src/components/game/world/Actors.tsx')
console.log('NPC_COUNT:', actors.match(/NPC_COUNT\s*=\s*(\d+)/)?.[1])
console.log('rain COUNT:', actors.match(/COUNT\s*=\s*(620|(\d+))\s*(\/\/.*)?/)?.[1], actors.match(/COUNT\s*=\s*\d+/g)?.slice(0, 3))
console.log('hair palette present:', actors.includes('1A1714') && actors.includes('B79545'))
console.log('gist 24 / talk 4:', actors.match(/gist[^0-9]*24/)?.[0]?.slice(0, 30) ?? '', actors.match(/talk[^0-9]*4\b/)?.[0]?.slice(0, 30) ?? '')

// WorldScene ACES + dpr
const ws = read('src/components/game/world/WorldScene.tsx')
console.log('ACES:', ws.match(/ACES[\s\S]{0,40}/)?.[0]?.replace(/\n/g, ' ').slice(0, 60))
console.log('toneMappingExposure:', ws.match(/toneMappingExposure\s*=\s*([\d.]+)/)?.[1])

// device presets
const dev = read('src/game/systems/device.ts')
console.log('dprCaps:', dev.match(/dprCap:\s*([\d.]+)/g), 'far:', dev.match(/far:\s*(\d+)/g), 'frameHz:', dev.match(/frameHz:\s*(\d+)/g))

// junctions phase law
const jun = read('src/game/world3d/junctions.ts')
console.log('phase law:', jun.match(/PHASE_GREEN\s*=\s*(\d+)/)?.[1], jun.match(/PHASE_AMBER\s*=\s*(\d+)/)?.[1], jun.match(/PHASE_RED\s*=\s*(\d+)/)?.[1], 'LIGHT_CAP:', jun.match(/LIGHT_CAP\s*=\s*(\d+)/)?.[1], 'BUMP_CAP:', jun.match(/BUMP_CAP\s*=\s*(\d+)/)?.[1])

// drains cap
const dr = read('src/game/world3d/drains.ts')
console.log('drain cap:', dr.match(/CAP\s*=\s*(\d+)/g))

// plates cap
const pl = read('src/game/world3d/plates.ts')
console.log('plate cap:', pl.match(/CAP\s*=\s*(\d+)/g))

// patti secrets + radius
const patti = read('src/game/systems/patti.ts')
console.log('PATTI_SECRETS count:', (patti.match(/id: '/g) ?? []).length, 'DISCOVERY_RADIUS:', patti.match(/DISCOVERY_RADIUS\s*=\s*(\d+)/)?.[1], 'pollHz:', patti.match(/(\d+)\s*\*\s*1000|hz/i)?.[0])

// music engine
const mus = read('src/game/systems/music.ts')
console.log('music bpm:', mus.match(/bpm:\s*\{[^}]*\}/)?.[0]?.replace(/\s+/g, ' '))
console.log('music scale:', mus.match(/scaleHz:\s*\[[^\]]*\]/)?.[0]?.slice(0, 80))
console.log('maxVoices:', mus.match(/maxVoices:\s*(\d+)/)?.[1])
console.log('kick steps 0/7/10 present:', /0.*7.*10|KICK_STEPS/.test(mus), mus.match(/KICK_STEPS[^\n]*/)?.[0])

// ambience layers
const amb = read('src/game/systems/ambience.ts')
console.log('ambience freqs:', amb.match(/\d{3,4}\s*Hz|\b(320|850|480|1400|140|4400|520|3200)\b/g)?.slice(0, 20))

// save version + migrations
const save = read('src/game/systems/save.ts')
console.log('SAVE_VERSION:', save.match(/SAVE_VERSION\s*=\s*(\d+)/)?.[1])
const cases = [...save.matchAll(/case\s+(\d+):/g)].map(m => +m[1])
console.log('migration cases:', cases.length, 'min:', Math.min(...cases), 'max:', Math.max(...cases))

// teleport roster
const tp = read('src/game/systems/teleport.ts')
console.log('TELEPORT_ROSTER len:', (tp.match(/'/g) ?? []).length, 'CATEGORIES:', tp.match(/TELEPORT_CATEGORIES[\s\S]{0,200}/)?.[0]?.split(']').length)

// flags.ts existence + guest.ts merge law + social TIERS + story beats
for (const f of ['src/game/systems/flags.ts', 'src/game/systems/guest.ts', 'src/game/systems/social.ts', 'src/game/systems/story.ts', 'src/game/systems/needs.ts', 'src/components/game/LocationArt.tsx', 'scripts/silk-gates.ts']) {
  try { read(f); console.log('EXISTS:', f) } catch { console.log('MISSING:', f) }
}
const social = read('src/game/systems/social.ts')
console.log('TIERS:', social.match(/TIERS[\s\S]{0,160}/)?.[0]?.replace(/\n/g, ' | ').slice(0, 200))
const story = read('src/game/systems/story.ts')
console.log('STORY_BEATS line:', story.split('\n').findIndex(l => l.includes('STORY_BEATS')) + 1, 'chapters:', (story.match(/chapter\s*\d/gi) ?? []).length)

// ---------- C. UI census ----------
console.log('== UI CENSUS ==')
const { execSync } = require('child_process')
const textNpx = execSync(`grep -rhoE 'text-\\[[0-9]+(\\.[0-9]+)?px\\]' src/ | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('text-[Npx] count:', textNpx)
const lkoTokens = read('src/app/globals.css').match(/--lko-[a-z-]+:/g) ?? []
console.log('lko tokens:', lkoTokens.length, [...new Set(lkoTokens)].length, 'distinct')
console.log('lko-glass defined in css:', /translate.*\.lko-glass\s*\{|\.lko-glass\s*\{/.test(read('src/app/globals.css')), 'lko-label defined:', /\.lko-label\s*\{/.test(read('src/app/globals.css')))
const shadcn = execSync(`ls src/components/ui/ | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('shadcn ui files:', shadcn)
// phone apps
const ps = read('src/components/game/screens/PhoneScreen.tsx')
console.log('AppDef grid entries:', (ps.match(/^\s+\{$/gm) ?? []).length, 'PhoneApp union found:', /type PhoneApp/.test(ps))
console.log('APP_VERSION:', ps.match(/APP_VERSION\s*=\s*'[^']*'/)?.[0])
// emoji occurrences
const emoji = execSync(`grep -roE '[\\u{1F300}-\\u{1FAFF}]' src/components/game src/game --include='*.tsx' 2>/dev/null | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('emoji matches (approx):', emoji)

// ---------- D. wire census ----------
console.log('== WIRE CENSUS ==')
const wire = read('mini-services/nation-wire/index.ts')
console.log('nation-wire lines:', wire.split('\n').length)
const socketOn = [...wire.matchAll(/socket\.on\(\s*'([^']+)'/g)].map(m => m[1])
const socketEmitTo = [...wire.matchAll(/(?:io\.to|socket\.emit|emitTo)\(\s*[^,]+,\s*'([^']+)'/g)].map(m => m[1])
const ioOn = [...wire.matchAll(/\bio\.on\(\s*'([^']+)'/g)].map(m => m[1])
console.log('socket.on handlers:', socketOn.length, JSON.stringify(socketOn))
console.log('io.on handlers:', ioOn.length, JSON.stringify(ioOn))
const RESUME = wire.match(/RESUME_CAP\s*=\s*(\d+)/)
console.log('RESUME_CAP:', RESUME?.[1], 'at line', wire.slice(0, RESUME?.index ?? 0).split('\n').length)
console.log('maxHttpBufferSize:', wire.match(/maxHttpBufferSize:\s*(\d+)/)?.[1], 'PORT:', wire.match(/WIRE_PORT \?\? (\d+)/)?.[1])
const whys = [...wire.matchAll(/why:\s*'([^']+)'/g)].map(m => m[1])
const whySet = [...new Set(whys)]
console.log('distinct why codes:', whySet.length)
console.log('minor walls: minors-no-money:', whys.filter(w => w === 'minors-no-money').length, 'minors-no-voice:', whys.filter(w => w === 'minors-no-voice').length, 'minors-collect-nothing:', whys.filter(w => w === 'minors-collect-nothing').length, 'kid-text-refused:', whys.filter(w => w === 'kid-text-refused').length)

// ---------- E. suites ----------
console.log('== SUITES ==')
const e2eCount = execSync(`ls scripts/e2e-*.ts scripts/e2e-*.sh 2>/dev/null | wc -l`, { shell: '/bin/bash' }).toString().trim()
const unitCount = execSync(`ls scripts/test-*.ts scripts/test-*.sh 2>/dev/null | wc -l`, { shell: '/bin/bash' }).toString().trim()
console.log('e2e scripts:', e2eCount, 'unit(test-*) scripts:', unitCount)
const unitFiles = execSync(`ls scripts/test-*.ts scripts/test-*.sh 2>/dev/null`, { shell: '/bin/bash' }).toString().trim().split('\n')
console.log('unit files:', JSON.stringify(unitFiles))

// ---------- F. books walk (readonly) ----------
console.log('== BOOKS (db/custom.db readonly) ==')
const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
const tables = db.query(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`).all()
console.log('tables:', tables.map((t: any) => t.name).join(','))
const ledgerCount = db.query(`SELECT COUNT(*) c FROM LedgerRow`).get() as any
console.log('LedgerRow rows:', ledgerCount.c)
const kinds = db.query(`SELECT kind, COUNT(*) c, SUM(amount) s FROM LedgerRow GROUP BY kind ORDER BY kind`).all()
console.log('by kind:', JSON.stringify(kinds))
const wallets = db.query(`SELECT COUNT(*) c, SUM(balance) s FROM WalletRow`).get() as any
console.log('WalletRow count:', wallets.c, 'sum:', wallets.s)
// kind-aware walk: deposits+? withdraws-? refuel/repair-? tips?
const get = (k: string) => (kinds.find((r: any) => r.kind === k) as any)?.s ?? 0
console.log('kinds list:', kinds.map((r: any) => r.kind).join(' | '))
