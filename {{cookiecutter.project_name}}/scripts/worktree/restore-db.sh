#!/usr/bin/env bash
#
# Resets the db of an isolated worktree from docker/files/db-dumps/*.sql (empty db
# without a dump), the Nix counterpart of scripts/restore_db.sh.
#
# Usage: scripts/worktree/restore-db.sh [worktree path]
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

path="$(git_root_of "${1:-$PWD}")"
if ! is_managed_worktree "$path"; then
    log "$path is not a worktree created by create.sh"
    exit 1
fi
project="$(project_dir "$path")"

log "Stopping services and removing the database"
stop_services "$path"
rm -rf "$project/.devenv/state/postgres" "$project/.devenv/state/worktree-setup-done"

bash "$SCRIPT_DIR/up.sh" --services "$path"
log "Username/Password is admin/admin"
