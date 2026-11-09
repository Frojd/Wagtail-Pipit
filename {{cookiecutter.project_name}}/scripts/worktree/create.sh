#!/usr/bin/env bash
#
# Claude Code WorktreeCreate hook. Reads {"name": ...} on stdin, creates
# .claude/worktrees/<slug> on branch worktree-<slug> and prints its path.
# Without Nix (devenv + direnv) it stops after the checkout, so the worktree uses no isolated stack.
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

input="$(cat)"
name="$(printf '%s' "$input" | json_field name)"
cwd="$(printf '%s' "$input" | json_field cwd)"
slug="$(printf '%s' "$name" | LC_ALL=C tr '[:upper:]' '[:lower:]' | LC_ALL=C sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
if [[ -z "$slug" ]]; then
    log "Invalid worktree name: '$name'"
    exit 1
fi

path="$WORKTREES_DIR/$slug"
branch="worktree-$slug"

if [[ ! -d "$path" ]]; then
    mkdir -p "$WORKTREES_DIR"
    if git -C "$MAIN_ROOT" show-ref --verify --quiet "refs/heads/$branch"; then
        git -C "$MAIN_ROOT" worktree add "$path" "$branch" >&2
    else
        # Like Claude Code, worktree.baseRef "head" branches from the HEAD of the session's checkout
        base_ref=""
        for file in "${CLAUDE_PROJECT_DIR:-$MAIN_ROOT}/.claude/settings.local.json" "${CLAUDE_PROJECT_DIR:-$MAIN_ROOT}/.claude/settings.json" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/settings.json"; do
            if [[ -f "$file" ]]; then
                base_ref="$(sed -nE 's/.*"baseRef"[[:space:]]*:[[:space:]]*"([a-z]+)".*/\1/p' "$file" | head -1)"
            fi
            if [[ -n "$base_ref" ]]; then
                break
            fi
        done
        if [[ "$base_ref" == "head" ]]; then
            base="$(git -C "${cwd:-$MAIN_ROOT}" rev-parse HEAD 2>/dev/null || git -C "$MAIN_ROOT" rev-parse HEAD)"
        elif git -C "$MAIN_ROOT" show-ref --verify --quiet refs/heads/develop; then
            base="develop"
        else
            base="HEAD"
        fi
        git -C "$MAIN_ROOT" worktree add -b "$branch" "$path" "$base" >&2
    fi
fi

project="$(project_dir "$path")"
main_project="$(project_dir "$MAIN_ROOT")"

copy_missing() {
    if [[ -f "$1" && ! -e "$2" ]]; then
        mkdir -p "$(dirname "$2")"
        command cp "$1" "$2"
    fi
}
copy_missing "$MAIN_ROOT/.claude/settings.local.json" "$path/.claude/settings.local.json"
copy_missing "$MAIN_ROOT/CLAUDE.local.md" "$path/CLAUDE.local.md"
for file in docker/config/python.env src/.env CLAUDE.local.md; do
    copy_missing "$main_project/$file" "$project/$file"
done

for dump in "$main_project"/docker/files/db-dumps/*.sql; do
    target="$project/docker/files/db-dumps/$(basename "$dump")"
    if [[ -f "$dump" && ! -e "$target" ]]; then
        mkdir -p "$(dirname "$target")"
        ln -s "$dump" "$target"
    fi
done

if ! has_nix; then
    log "devenv or direnv not found, created $path without an isolated stack"
    echo "$path"
    exit 0
fi

if [[ ! -f "$project/.envrc" ]]; then
    printf '#!/usr/bin/env bash\neval "$(devenv direnvrc)"\nuse devenv\n' > "$project/.envrc"
fi
direnv allow "$project" >&2

echo "$path"
