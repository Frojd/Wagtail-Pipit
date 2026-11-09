#!/usr/bin/env bash
#
# Claude Code SessionStart hook. In an isolated worktree it prepares the stack, starts
# the services when WORKTREE_AUTOSTART=1 and exports the devenv environment and venv
# to Claude's Bash tool. No-op elsewhere.
#
set -uo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

report() {
    printf '{"systemMessage":%s,"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s}}\n' \
        "$(json_string "$1")" "$(json_string "$2")"
}

input="$(cat)"
source_event="$(printf '%s' "$input" | json_field source)"
cwd="$(printf '%s' "$input" | json_field cwd)"

path="$(git_root_of "${cwd:-${CLAUDE_PROJECT_DIR:-$PWD}}" 2>/dev/null)"
if [[ -z "$path" ]] || ! is_managed_worktree "$path"; then
    exit 0
fi
project="$(project_dir "$path")"

# Compaction keeps the running stack, only the context needs repeating
if [[ "$source_event" == "compact" && -f "$project/src/.venv/.synced" ]]; then
    output="[worktree] Prepared slot $(slot_of "$path")"
elif ! output="$(bash "$SCRIPT_DIR/up.sh" "$path" 2>&1)"; then
    reason="$(echo "$output" | tail -1 | sed 's/^\[worktree\] //')"
    msg="Worktree startup failed: ${reason%.}. The environment is NOT loaded, fix it and rerun ${PROJECT_PREFIX}scripts/worktree/up.sh, see $project/.devenv/worktree-up.log"
    report "$msg" "$msg"
    exit 0
fi

if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
    {
        (cd "$project" && direnv export bash 2>/dev/null)
        echo
        echo "source '$project/src/.venv/bin/activate'"
    } >> "$CLAUDE_ENV_FILE"
fi

load_env "$path" 2>/dev/null
status="$(echo "$output" | grep -E "Ready on slot|Prepared slot" | tail -1 | sed 's/^\[worktree\] //')"
message="Isolated worktree: $status."
warnings="$(echo "$output" | grep "WARNING: " | sed 's/^\[worktree\] WARNING: //')"
if [[ -n "$warnings" ]]; then
    message+=" Warnings: $(echo "$warnings" | paste -sd ';' -)"
fi

context="$message

This worktree has an isolated Nix stack on slot ${WORKTREE_SLOT:-?}, run devenv commands from $project:
- Ports: nginx ${NGINX_PORT:-?} (whole site, like the Docker web port in the main checkout), runserver ${RUNSERVER_PORT:-?}, next dev ${NEXT_PORT:-?}, storybook ${STORYBOOK_PORT:-?}, Postgres ${DATABASE_PORT:-?}
- stack-up starts the services and sets up the db, stack-down stops them, storybook-dev runs storybook in the foreground
- Never run docker compose here, Docker belongs to the main checkout
- Reset the db with ${PROJECT_PREFIX}scripts/worktree/restore-db.sh"
report "$message" "$context"
