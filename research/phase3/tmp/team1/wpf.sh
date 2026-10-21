#!/bin/bash
# fetch a wikipedia page summary politely
cd /home/z/my-project/research/phase3/tmp/team1
for p in "$@"; do
  curl -s -m 25 -A "LokojaLifeResearch/1.0 (contact: research@lokogalife.example)" "https://en.wikipedia.org/api/rest_v1/page/summary/$p" -o "wp_${p//\//_}.json"
  sleep 2
done
