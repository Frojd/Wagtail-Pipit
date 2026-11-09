#!/usr/bin/env bash
#
# Claude Code SessionEnd hook. Stops the services of an isolated worktree, the data stays.
# /clear and /resume start a new session in the same worktree, so the services keep running.
#
set -uo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

input="$(cat)"
reason="$(printf '%s' "$input" | json_field reason)"
cwd="$(printf '%s' "$input" | json_field cwd)"
if [[ "$reason" == "clear" || "$reason" == "resume" ]]; then
    exit 0
fi

path="$(git_root_of "${cwd:-${CLAUDE_PROJECT_DIR:-$PWD}}" 2>/dev/null)"
if [[ -z "$path" ]] || ! is_managed_worktree "$path" || [[ ! -f "$(project_dir "$path")/devenv.local.nix" ]]; then
    exit 0
fi

stop_services "$path"
