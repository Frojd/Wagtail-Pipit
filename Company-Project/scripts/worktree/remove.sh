#!/usr/bin/env bash
#
# Claude Code WorktreeRemove hook. Reads {"worktree_path": ...} on stdin, stops the
# services, removes the worktree (and its db) and deletes the branch if merged.
#
# Also usable by hand: scripts/worktree/remove.sh [--force] <worktree path>
# By hand it refuses a worktree with uncommitted changes unless --force is given.
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

force=false
if [[ "${1:-}" == "--force" ]]; then
    force=true
    shift
fi

if [[ $# -gt 0 ]]; then
    path="$(cd "$1" && pwd -P)"
    if [[ $force == false && -n "$(git -C "$path" status --porcelain 2>/dev/null)" ]]; then
        log "$path has uncommitted changes, commit them or pass --force"
        exit 1
    fi
else
    path="$(json_field worktree_path)"
    if [[ -d "$path" ]]; then
        path="$(cd "$path" && pwd -P)"
    fi
fi

if [[ "$path" != "$WORKTREES_DIR/"* ]]; then
    log "Refusing to remove $path, it is not under $WORKTREES_DIR"
    exit 1
fi

branch=""
if [[ -d "$path" ]]; then
    branch="$(git -C "$path" branch --show-current)"
    if [[ -f "$(project_dir "$path")/devenv.local.nix" ]]; then
        stop_services "$path"
    fi
    direnv deny "$(project_dir "$path")" >/dev/null 2>&1 || true
fi

git -C "$MAIN_ROOT" worktree remove --force "$path" >&2 || command rm -rf "$path"
git -C "$MAIN_ROOT" worktree prune

branch="${branch:-worktree-$(basename "$path")}"
if git -C "$MAIN_ROOT" show-ref --verify --quiet "refs/heads/$branch"; then
    if ! git -C "$MAIN_ROOT" branch -d "$branch" >&2; then
        log "Kept $branch since it is not merged, delete it with: git branch -D $branch"
    fi
fi
