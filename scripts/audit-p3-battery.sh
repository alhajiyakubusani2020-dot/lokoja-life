#!/usr/bin/env bash
# RULE ZERO P3 — master verification battery (counts, caps, constants).
# Every claim prints ACTUAL value vs CLAIMED. Run from repo root with bun available.
cd /home/z/my-project
pass=0; fail=0; drift=0
chk() { # chk <label> <claimed> <actual>
  if [ "$2" == "$3" ]; then pass=$((pass+1)); printf 'PASS  %-58s = %s\n' "$1" "$3"
  else fail=$((fail+1)); printf 'FAIL  %-58s claimed=%s actual=%s\n' "$1" "$2" "$3"; fi
}
approx() { # approx <label> <claimed> <actual> <tolerance%>
  local d=$(python3 -c "print(1 if abs($3-$2)<=abs($2)*$4/100 else 0)")
  if [ "$d" == "1" ]; then drift=$((drift+1)); printf 'NEAR  %-58s claimed=%s actual=%s (within %s%%)\n' "$1" "$2" "$3" "$4"
  else fail=$((fail+1)); printf 'FAIL  %-58s claimed=%s actual=%s\n' "$1" "$2" "$3"; fi
}

echo "=== WORLD / LAYOUT ==="
chk "NPC_COUNT" 12 "$(grep -o 'NPC_COUNT = [0-9]*' src/components/game/world/Actors.tsx | grep -o '[0-9]*')"
chk "stroll zones (ZONE list entries)" 13 "$(grep -c 'id:' src/components/game/world/Actors.tsx | head -1 >/dev/null; grep -o "STROLL_ZONES[^]]*]" src/components/game/world/Actors.tsx | grep -o 'id:' | wc -l)"
chk "TRAFFIC_MIX rigs" 14 "$(sed -n '/TRAFFIC_MIX/,/]/p' src/components/game/world/Actors.tsx | grep -oE 'count: *[0-9]+' | grep -oE '[0-9]+' | paste -sd+ | bc)"
chk "LIGHT_CAP" 14 "$(grep -o 'LIGHT_CAP = [0-9]*' src/game/world3d/junctions.ts | grep -o '[0-9]*')"
chk "BUMP_CAP" 12 "$(grep -o 'BUMP_CAP = [0-9]*' src/game/world3d/junctions.ts | grep -o '[0-9]*')"
chk "TREE_CAP" 720 "$(grep -o 'TREE_CAP = [0-9]*' src/game/world3d/flora.ts | grep -o '[0-9]*')"
chk "GRASS_TUFTS" 10000 "$(grep -o 'GRASS_TUFTS = [0-9]*' src/game/world3d/flora.ts | grep -o '[0-9]*')"
chk "lamp cap" 1500 "$(grep -oE '1,?500' src/game/world3d/layout.ts | head -1 | tr -d ',')"
chk "drain cap" 1800 "$(grep -oE '1,?800' src/game/world3d/drains.ts | head -1 | tr -d ',')"
chk "plate cap" 40 "$(grep -oE 'PLATE_CAP = [0-9]+|MAX_PLATES = [0-9]+' src/game/world3d/plates.ts | grep -o '[0-9]*' | head -1)"
chk "yearDays" 72 "$(grep -o 'yearDays: *[0-9]*' src/game/config.ts | grep -o '[0-9]*')"
chk "day-1 grant" 5000 "$(sed -n '14p' src/game/config.ts | grep -oE '[0-9,]{4,}' | tr -d ',')"
chk "MAP_SCALE" 6.2 "$(grep -o 'MAP_SCALE = [0-9.]*' src/game/world3d/layout.ts | head -1 | grep -oE '[0-9.]+')"
chk "rain particles" 620 "$(grep -oE 'RAIN_PARTICLES = [0-9]+|rainCount = [0-9]+|620' src/components/game/world/polish.tsx | head -1 | grep -o '[0-9]*')"

echo "=== JUNCTION PLACED COUNTS (runtime) ==="
cat > /tmp/p3-junction.ts <<'EOF'
import { initGeoWith } from '../src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const j = await import('../src/game/world3d/junctions')
const anyJ = j as any
let lights = -1, bumps = -1
for (const [k, v] of Object.entries(anyJ)) {
  if (Array.isArray(v)) {
    // heuristics: arrays of placed items
    console.log('ARR', k, v.length)
  } else if (typeof v === 'number') console.log('NUM', k, v)
}
EOF
bun /tmp/p3-junction.ts 2>/dev/null | grep -E 'LIGHTS|BUMPS|lights|bumps|ARR (LIGHT|BUMP|SIGNAL|SPEED)' | head -8

echo "=== RUNTIME WORLD COUNTS (test-world3d style bootstrap) ==="
cat > /tmp/p3-world.ts <<'EOF'
import { initGeoWith } from '../src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
await import('../src/game/world3d/layout')
const L = await import('../src/game/world3d/layout')
const anyL = L as any
const out: Record<string, number> = {}
const keys = ['DOORS','STALLS','LAMPS','DRAINS','ROCKS','TREES','GRASS','SIGNALS','LIGHTS','BUMPS','SCHOOL']
for (const [k, v] of Object.entries(anyL)) {
  if (Array.isArray(v)) {
    for (const kk of keys) if (k.toUpperCase().includes(kk)) out[k] = v.length
  }
}
console.log(JSON.stringify(out))
EOF
bun /tmp/p3-world.ts 2>/dev/null | tail -1

echo "=== CONTENT REGISTERS ==="
chk "jobs" 21 "$(grep -c '^  {$\|^  {$' src/game/data/jobs.ts 2>/dev/null || grep -c 'id:' src/game/data/jobs.ts)"
chk "hustles" 20 "$(grep -c 'id:' src/game/data/hustles.ts)"
chk "phone apps in grid" 26 "$(sed -n '797,1155p' src/components/game/phone/PhoneScreen.tsx | grep -cE "id: '" )"
echo "phone manifest apps: $(grep -c "id: '" src/components/game/phone/apps/manifest.ts 2>/dev/null || echo MANIFEST_NOT_FOUND)"
echo "job boards POIs: $(grep -c 'job-board' src/game/data/locations.ts)"
echo "named NPCs (npc.ts?): $(rg -c "name:" src/game/data/npcs.ts 2>/dev/null || echo no-file)"

echo "=== WIRE ==="
chk "wire handlers (socket.on)" 59 "$(grep -c "socket.on('" mini-services/nation-wire/index.ts)"
chk "4KB cap" 4096 "$(grep -oE '4 \* 1024|4096' mini-services/nation-wire/index.ts | head -1)"
chk "resume gap cap" 100 "$(sed -n '530,545p' mini-services/nation-wire/index.ts | grep -oE 'cap 100|MAX_GAP|100' | head -1 | grep -o '[0-9]*')"

echo "=== DB (live books) ==="
cat > /tmp/p3-db.ts <<'EOF'
import { Database } from 'bun:sqlite'
const db = new Database('db/custom.db', { readonly: true })
const led = db.query('SELECT COUNT(*) c FROM LedgerRow').get() as any
const wal = db.query('SELECT COALESCE(SUM(balance),0) s FROM WalletRow').get() as any
const inflow = db.query("SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE amount > 0").get() as any
const outflow = db.query("SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE amount < 0").get() as any
const grants = db.query("SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE ref LIKE '%grant%' OR ref LIKE '%seed%' OR ref LIKE '%boot%'").get() as any
const veh = db.query('SELECT COUNT(*) c FROM VehicleRow').get() as any
const acc = db.query('SELECT COUNT(*) c FROM Account').get() as any
const dup = db.query('SELECT plate, COUNT(*) c FROM VehicleRow GROUP BY plate HAVING c > 1').all() as any[]
console.log(JSON.stringify({ ledger_rows: led.c, wallet_sum: wal.s, inflow: inflow.s, outflow: outflow.s, vehicles: veh.c, accounts: acc.c, dup_plates: dup }))
EOF
bun /tmp/p3-db.ts 2>/dev/null

echo "=== SAVE ==="
chk "SAVE_VERSION" 20 "$(grep -oE 'SAVE_VERSION = [0-9]+' src/game/systems/save.ts | grep -o '[0-9]*')"
echo "migration steps: $(grep -cE 'from V[0-9]+|v[0-9]+_to_v[0-9]+|case 19|step ' src/game/systems/save.ts | head -1)"

echo "=== TESTS ==="
chk "unit test scripts" 48 "$(ls scripts/test-*.ts | wc -l)"
chk "e2e scripts" 58 "$(ls scripts/e2e-*.ts | wc -l)"
chk "prisma models" 16 "$(grep -c '^model ' prisma/schema.prisma)"
chk "systems files" 63 "$(ls src/game/systems/*.ts | wc -l)"
echo "migrations baseline: $(ls prisma/migrations 2>/dev/null | head -3 | paste -sd,)"
echo ""
echo "TOTALS: pass=$pass fail=$fail near=$drift"
