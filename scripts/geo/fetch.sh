#!/bin/bash
# Fetch OpenStreetMap data for Lokoja in tiles (API limit: 50k nodes per call)
# bbox parent: 6.68–6.84 lon, 7.72–7.86 lat → 4 cols × 4 rows
cd /home/z/my-project/scripts/geo
mkdir -p tiles

fetch_tile() {
  local col=$1 row=$2 lon0=$3 lat0=$4 lon1=$5 lat1=$6
  local f="tiles/t_${col}_${row}.osm"
  for attempt in 1 2 3; do
    curl -s --max-time 120 -H "User-Agent: LokojaLife-Dev/1.0" \
      "https://api.openstreetmap.org/api/0.6/map?bbox=${lon0},${lat0},${lon1},${lat1}" -o "$f"
    if grep -q "<osm" "$f" 2>/dev/null; then
      echo "OK   t_${col}_${row}  $(wc -c < "$f") bytes"
      return 0
    fi
    echo "RETRY($attempt) t_${col}_${row}: $(head -c 60 "$f")"
    sleep 3
  done
  echo "FAIL t_${col}_${row}"
  return 1
}

for row in 0 1 2 3; do
  lat0=$(awk "BEGIN{printf \"%.4f\", 7.72 + $row * 0.035}")
  lat1=$(awk "BEGIN{printf \"%.4f\", $lat0 + 0.035}")
  for col in 0 1 2 3; do
    lon0=$(awk "BEGIN{printf \"%.4f\", 6.68 + $col * 0.04}")
    lon1=$(awk "BEGIN{printf \"%.4f\", $lon0 + 0.04}")
    fetch_tile "$col" "$row" "$lon0" "$lat0" "$lon1" "$lat1" &
  done
  wait
done
echo "---"
ls -l tiles/ | awk '{print $5, $9}' | sort -k2 | tail -17
