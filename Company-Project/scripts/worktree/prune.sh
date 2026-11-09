#!/usr/bin/env bash
#
# Cleans up worktrees that never got a WorktreeRemove hook, such as subagent worktrees.
# Lists worktrees without a slot, without changes and untouched for a day, --remove removes them.
#
# Usage: scripts/worktree/prune.sh [--remove]
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

git -C "$MAIN_ROOT" worktree prune

for dir in "$WORKTREES_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    path="${dir%/}"

    if [[ -f "$(project_dir "$path")/devenv.local.nix" ]]; then
        continue
    fi
    # A subagent can still be working in it
    gitdir="$(git -C "$path" rev-parse --absolute-git-dir 2>/dev/null || true)"
    if [[ -n "$(find "$path/.git" "$gitdir/logs/HEAD" -maxdepth 0 -mmin -1440 2>/dev/null)" ]]; then
        log "Created or committed to in the last day, kept: $path"
        continue
    fi
    if [[ -n "$(git -C "$path" status --porcelain 2>/dev/null)" ]]; then
        log "Has changes, kept: $path"
        continue
    fi

    if [[ "${1:-}" == "--remove" ]]; then
        bash "$SCRIPT_DIR/remove.sh" "$path"
    else
        echo "$path"
    fi
done
