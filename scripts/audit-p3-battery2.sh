#!/usr/bin/env bash
cd /home/z/my-project
pass=0; fail=0
chk() { if [ "$2" == "$3" ]; then pass=$((pass+1)); printf 'PASS  %-56s = %s\n' "$1" "$3"; else fail=$((fail+1)); printf 'FAIL  %-56s claimed=%s actual=%s\n' "$1" "$2" "$3"; fi; }

CFG=src/game/data/config.ts
echo "=== CONFIG ==="
chk "yearDays" 72 "$(grep -o 'yearDays: *[0-9]*' $CFG | grep -o '[0-9]*')"
chk "day-1 grant (line 14)" 5000 "$(sed -n '14p' $CFG | grep -oE '[0-9,]{4,}' | tr -d ',')"
echo "slots line 192: $(sed -n '190,196p' $CFG)"
sed -n '192p;194,196p' $CFG
echo "weather weights block:"; grep -n 'harmattan' $CFG | head -3
echo "MEAL_BY_KEY: $(grep -c "key: '" $CFG) meals-ish; WORK/HUSTLE blocks: $(grep -cE 'WORK:|HUSTLE:' $CFG)"
echo "CHILL: $(grep -c 'CHILL' $CFG)"

echo "=== PHONE ==="
chk "grid apps" 26 "$(sed -n '790,1160p' src/components/game/screens/PhoneScreen.tsx | grep -cE "id: '")"
echo "manifest apps: $(grep -cE "id: '" src/components/game/screens/phone/apps/manifest.ts)"
echo "manifest ids: $(grep -oE "id: '[a-z-]+'" src/components/game/screens/phone/apps/manifest.ts | wc -l)"

echo "=== NPCS ==="
echo "npcs.ts entries: $(grep -cE '^\s+\{$' src/game/data/npcs.ts)"; echo "npcs.ts ids: $(grep -oE "id: '[^']+'" src/game/data/npcs.ts | wc -l)"; echo "npcs names: $(grep -cE "name: '" src/game/data/npcs.ts)"
head -30 src/game/data/npcs.ts

echo "=== HUSTLES vs JOBS ==="
python3 - <<'EOF'
import re
for f, want in (('src/game/data/hustles.ts',20),('src/game/data/jobs.ts',21)):
    src = open(f).read()
    ids = re.findall(r"id:\s*'([^']+)'", src)
    print(f, 'entries:', len(ids), ids[:3], '...')
EOF

echo "=== WIRE specifics ==="
echo "4KB: $(grep -nE '4 \* 1024|4096|MAX_PACKET|PACKET_CAP' mini-services/nation-wire/index.ts | head -3)"
echo "resume cap: $(grep -nE 'cap 100|: 100|slice\(0, 100\)|MAX_GAP' mini-services/nation-wire/index.ts | head -5)"
echo "client doors: $(grep -cE "case '[a-z:-]+'|socket.on\('[a-z:-]+'" mini-services/nation-wire/index.ts)"

echo "=== LEDGER CONSERVATION ==="
cat > /tmp/p3-cons.ts <<'EOF'
import { Database } from 'bun:sqlite'
const db = new Database('db/custom.db', { readonly: true })
const led = (db.query('SELECT COUNT(*) c FROM LedgerRow').get() as any).c
const inflow = (db.query('SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE amount>0').get() as any).s
const outflow = (db.query('SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE amount<0').get() as any).s
const wal = (db.query('SELECT COALESCE(SUM(balance),0) s FROM WalletRow').get() as any).s
console.log(JSON.stringify({ ledger_rows: led, inflow, outflow, net: inflow + outflow, wallet_sum: wal, drift: inflow + outflow - wal }))
EOF
bun /tmp/p3-cons.ts

echo "=== SCARS & ANCHORS (line-level) ==="
for spec in "useGameStore.ts:2205" "useGameStore.ts:2258" "useGameStore.ts:2341" "useGameStore.ts:2730" "useGameStore.ts:3652" "useGameStore.ts:4999" "useGameStore.ts:4801" "RemoteVehicles.tsx:114" "RemoteVehicles.tsx:179" "RemoteVehicles.tsx:221" "wire.ts:645" "CityMesh.tsx:1358" "collision.ts:56" "layout.ts:1660" "layout.ts:7" "index.ts:1460" "index.ts:963" "index.ts:1064" "index.ts:537" "index.ts:711" "index.ts:700"; do
  f="${spec%%:*}"; ln="${spec##*:}"
  path=$(rg --files -g "$f" src mini-services 2>/dev/null | head -1)
  [ -z "$path" ] && { echo "MISS $spec"; continue; }
  echo "--- $spec :: $(sed -n "${ln}p" "$path" | head -c 150)"
done
echo ""
echo "TOTALS: pass=$pass fail=$fail"
