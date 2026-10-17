#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# THE FILE SHIELD — Lokoja Life never loses a file again.
#
#   incr    (default, called by the post-commit hook after EVERY commit)
#           → fast-forwards the out-of-repo mirror clone (full history copy)
#           → snapshots worklog.md + MULTIPLAYER_PLAN.md as plain files
#           → appends a MANIFEST line (sha + subject, the audit trail)
#   anchor  (run at wave closes / manually)
#           → everything incr does, PLUS a full restorable bundle exported
#             to download/backups/ (the one you can actually download)
#
# Self-healing: if the post-commit hook is ever missing, this script
# reinstalls it from scripts/hooks/post-commit on the next run.
#
# Restore recipe (written down BEFORE the disaster, not after):
#   git clone /home/z/my-project/.backups/repo-mirror.git restored-repo
#   # or from the downloadable bundle:
#   git clone LokojaLife-FULL-<ts>.bundle restored-repo
#   # incremental history since an old bundle:
#   git -C restored-repo fetch /path/to/incr bundles as refs, then merge
# ═══════════════════════════════════════════════════════════════════
set -uo pipefail

ROOT="/home/z/my-project"
BK="$ROOT/.backups"
MIRROR="$BK/repo-mirror.git"
DL="$ROOT/download/backups"
HOOK_SRC="$ROOT/scripts/hooks/post-commit"
HOOK_DST="$ROOT/.git/hooks/post-commit"

mkdir -p "$BK" "$DL"
cd "$ROOT" || exit 1

# ── self-heal: reinstall the post-commit hook if it vanished ──
if [ -f "$HOOK_SRC" ] && [ ! -x "$HOOK_DST" ]; then
  cp "$HOOK_SRC" "$HOOK_DST" && chmod +x "$HOOK_DST"
  echo "[shield] post-commit hook reinstalled (it had vanished)"
fi

# ── mirror: create once, then fetch-forward forever (never prunes refs) ──
if [ ! -d "$MIRROR" ]; then
  git clone --mirror "$ROOT" "$MIRROR" >/dev/null 2>&1 && echo "[shield] mirror created"
fi

mode="${1:-incr}"
ts="$(date +%Y%m%d-%H%M%S)"
sha="$(git rev-parse HEAD 2>/dev/null || echo unknown)"

if [ "$mode" = "anchor" ]; then
  git -C "$MIRROR" fetch origin '+refs/heads/*:refs/heads/*' --no-prune >/dev/null 2>&1
  git -C "$MIRROR" bundle create "$DL/LokojaLife-FULL-$ts.bundle" --all >/dev/null 2>&1
  # keep only the newest full bundle in download (disk hygiene)
  ls -1t "$DL"/LokojaLife-FULL-*.bundle 2>/dev/null | tail -n +2 | xargs -r rm -f
  echo "[shield] ANCHOR bundle exported to download/backups/"
fi

# ── both modes: mirror current + tiny snapshots + manifest ──
git -C "$MIRROR" fetch origin '+refs/heads/*:refs/heads/*' --no-prune >/dev/null 2>&1
[ -f "$ROOT/worklog.md" ] && cp "$ROOT/worklog.md" "$BK/worklog.md"
[ -f "$ROOT/MULTIPLAYER_PLAN.md" ] && cp "$ROOT/MULTIPLAYER_PLAN.md" "$BK/MULTIPLAYER_PLAN.md"

# verify the mirror actually sees HEAD — the shield must never lie
mirror_head="$(git -C "$MIRROR" rev-parse HEAD 2>/dev/null || echo none)"
if [ "$mirror_head" = "$sha" ]; then state="MIRROR-IN-SYNC"
else state="MIRROR-LAGGING(mirror=$mirror_head)"
fi

echo "[$(date '+%F %T')] mode=$mode HEAD=$sha $state subject=$(git log -1 --pretty=%s 2>/dev/null | head -c 110)" >> "$BK/MANIFEST.log"
echo "[shield] $mode ok HEAD=$sha $state"
