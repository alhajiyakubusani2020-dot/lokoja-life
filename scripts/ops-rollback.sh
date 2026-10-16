#!/usr/bin/env bash
# M20 — THE ONE-COMMAND ROLLBACK
# -------------------------------
# Rebuilds the PREVIOUS good deploy from the git history and swaps the
# prod preview (:3001) onto it. The Nation Dashboard's "Last-good
# deploys" book (flags.ts readManifest, written by PwaRegister) names
# the shells; this command is the arm that rebuilds one.
#
# Usage: bun run ops:rollback        (rolls to the previous commit)
#        bun run ops:rollback <sha>  (rolls to an explicit commit)
#
# LAWS:
#  - the working tree must be clean (a dirty tree rolls NOTHING — stashes lie)
#  - the rollback is a REAL rebuild (no cache hand-waving, no fake green)
#  - the DB is never touched (players' lives are not deploy cargo)

set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="${1:-HEAD~1}"

echo "— ops:rollback — verifying the tree —"
if [ -n "$(git status --porcelain)" ]; then
  echo "REFUSED: working tree is dirty. Commit or stash first — a rollback never rides uncommitted work." >&2
  exit 1
fi

echo "— target: $(git rev-parse --short "$TARGET") — $(git log -1 --format=%s "$TARGET" | head -c 80)…"
git checkout "$TARGET" >/dev/null 2>&1

echo "— rebuilding (the honest way) —"
bun run build >/dev/null 2>&1 || { echo "BUILD REFUSED at $TARGET — rolling the pointer back to main"; git checkout main >/dev/null 2>&1; exit 1; }

echo "— restarting the prod preview on :3001 —"
pkill -f ".next/standalone/server.js" 2>/dev/null || true
sleep 1
NODE_ENV=production nohup bun .next/standalone/server.js >/tmp/lko-prod.log 2>&1 &
sleep 2
curl -sf -o /dev/null "http://localhost:3001/" && echo "✅ rolled back — :3001 serves $(git rev-parse --short HEAD)" || {
  echo "⚠️ server did not answer in 2s — check /tmp/lko-prod.log"; exit 1;
}

echo "— returning main to the tip (the rollback lives in the rebuilt server, not in git) —"
git checkout main >/dev/null 2>&1
echo "done. to return forward: bun run build + restart, or git checkout main && bun run build"
