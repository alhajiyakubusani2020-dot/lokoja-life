#!/usr/bin/env bash
cd /home/z/my-project
LOG=/tmp/battery-m20.log
: > $LOG
for f in scripts/test-*.ts; do
  r=$(timeout 90 bun "$f" 2>&1 | tail -4 | tr '\n' ' ')
  echo "$f :: $r" >> $LOG
done
echo "BATTERY-DONE" >> $LOG
