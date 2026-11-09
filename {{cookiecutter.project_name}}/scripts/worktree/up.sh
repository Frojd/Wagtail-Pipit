#!/usr/bin/env bash
#
# Prepares the isolated stack of a worktree: allocates a slot, writes the env files,
# builds the venv and node_modules. With --services (or WORKTREE_AUTOSTART=1) it also
# starts Postgres, runserver, next dev and nginx and sets up the db. Idempotent.
#
# Exits non-zero only when the environment is unusable. Failing migrations and
# setup steps are reported as WARNING lines, so the session still gets its environment.
#
# Usage: scripts/worktree/up.sh [--services] [worktree path]
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

services=false
if [[ "${1:-}" == "--services" || "${WORKTREE_AUTOSTART:-0}" == "1" ]]; then
    services=true
fi
if [[ "${1:-}" == "--services" ]]; then
    shift
fi

path="$(git_root_of "${1:-$PWD}")"
if ! is_managed_worktree "$path"; then
    log "$path is not a worktree created by create.sh"
    exit 1
fi
project="$(project_dir "$path")"
main_project="$(project_dir "$MAIN_ROOT")"
cd "$project"

state_dir="$project/.devenv/state"
log_file="$project/.devenv/worktree-up.log"
setup_marker="$state_dir/worktree-setup-done"
mkdir -p "$state_dir"
touch "$log_file"

fail() {
    log "$*"
    exit 1
}

warn() {
    log "WARNING: $*"
}

# Runs a command with its output appended to the log. On failure, reason holds its last error line.
reason=""
run() {
    local start
    start=$(($(wc -l <"$log_file") + 1))
    if "$@" >>"$log_file" 2>&1; then
        return 0
    fi
    reason="$(tail -n +"$start" "$log_file" | sed -E $'s/\x1b\\[[0-9;]*m//g' | grep -E "Error|error:|ERR!" | tail -1 | sed -E 's/^[[:space:]]+//')"
    reason="${reason:-see $log_file}"
    return 1
}

allocate_slot() {
    local lock="$WORKTREES_DIR/.slot-lock"
    local tries=0
    until mkdir "$lock" 2>/dev/null; do
        # A lock older than a minute was left by a killed run
        if [[ -n "$(find "$lock" -maxdepth 0 -mmin +1 2>/dev/null)" ]]; then
            rmdir "$lock" 2>/dev/null || true
            continue
        fi
        tries=$((tries + 1))
        if [[ $tries -gt 50 ]]; then
            fail "Timed out waiting for $lock"
        fi
        sleep 0.2
    done
    trap "rmdir '$lock'" EXIT

    local used=" "
    for other in "$WORKTREES_DIR"/*/; do
        used+="$(slot_of "${other%/}") "
    done

    for n in 1 2 3 4 5 6 7 8 9; do
        if [[ "$used" != *" $n "* ]]; then
            echo "{ worktree.slot = $n; }" > "$project/devenv.local.nix"
            rmdir "$lock"
            trap - EXIT
            return
        fi
    done

    fail "All 9 slots are taken, remove a worktree first"
}

if [[ ! -f devenv.local.nix ]]; then
    allocate_slot
fi
slot="$(slot_of "$path")"

load_env "$path" 2>>"$log_file"
if [[ "${DEVENV_ROOT:-}" != "$project" ]]; then
    fail "The devenv environment of $project did not load, try direnv allow $project"
fi
url="http://$(basename "$path").localhost:$NGINX_PORT"
if [[ "$(basename "$path")" =~ [^a-z0-9-] ]]; then
    url="http://localhost:$NGINX_PORT"
fi

# uv picks the interpreter from .python-version, the same version as Docker and CI
lockfile="src/uv.lock"
if [[ ! -f src/.venv/.synced || "$lockfile" -nt src/.venv/.synced ]]; then
    log "Syncing requirements"
    if run uv sync --locked --project src; then
        touch src/.venv/.synced
    elif [[ -x src/.venv/bin/python ]]; then
        warn "Syncing requirements failed, using the existing venv: $reason"
    else
        fail "Syncing requirements failed: $reason"
    fi
fi

npm_lock="frontend/package-lock.json"
if [[ ! -f frontend/node_modules/.synced || "$npm_lock" -nt frontend/node_modules/.synced ]]; then
    if [[ ! -d frontend/node_modules && -d "$main_project/frontend/node_modules" ]] \
        && cmp -s "$npm_lock" "$main_project/$npm_lock"; then
        log "Cloning node_modules from the main checkout"
        # Copy on write where the filesystem supports it (APFS clonefile, btrfs/xfs reflink), else a plain copy
        for clone in "cp -R --reflink=auto" "cp -cR" "cp -R"; do
            command rm -rf frontend/node_modules
            if run $clone "$main_project/frontend/node_modules" frontend/node_modules; then
                break
            elif [[ "$clone" == "cp -R" ]]; then
                fail "Cloning node_modules failed: $reason"
            fi
        done
    else
        log "Installing node_modules"
        if ! run npm ci --prefix frontend; then
            warn "npm ci failed, the frontend will not run: $reason"
        fi
    fi
    if [[ -d frontend/node_modules ]]; then
        touch frontend/node_modules/.synced
    fi
fi

if [[ $services == false ]]; then
    log "Prepared slot $slot, services not started (run stack-up): $url"
    exit 0
fi

# Check our own server, pg_isready alone would accept another project's Postgres on the same port
postgres_running() {
    local pid
    pid="$(head -1 "$state_dir/postgres/postmaster.pid" 2>/dev/null)"
    [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null && pg_isready -q -h 127.0.0.1 -p "$DATABASE_PORT"
}

if ! postgres_running; then
    log "Starting services"
    # Ports can stay briefly busy right after a stop, so retry
    for attempt in 1 2 3; do
        if run devenv up -d --strict-ports; then
            break
        fi
        if [[ $attempt -eq 3 ]]; then
            fail "devenv up failed: $reason"
        fi
        sleep 5
    done
    for ((i = 0; i < 60; i++)); do
        if postgres_running; then
            break
        fi
        sleep 1
    done
fi
if ! postgres_running; then
    fail "Postgres did not start, see $log_file"
fi

export PGPASSWORD=postgres
psql_cmd=(psql -X -q -h 127.0.0.1 -p "$DATABASE_PORT" -U postgres -d app)
manage() {
    (cd "$project/src" && .venv/bin/python manage.py "$@")
}

if [[ ! -f "$setup_marker" ]]; then
    has_schema="$("${psql_cmd[@]}" -tAc "select to_regclass('public.django_migrations') is not null")"
    if [[ "$has_schema" != "t" ]]; then
        for dump in docker/files/db-dumps/*.sql; do
            [[ -f "$dump" ]] || continue
            log "Loading $(basename "$dump"), this can take a while"
            run "${psql_cmd[@]}" -f "$dump" || warn "Loading $dump failed: $reason"
        done
    fi
fi

log "Running migrate"
if ! run manage migrate --no-input; then
    warn "migrate failed: $reason"
elif [[ ! -f "$setup_marker" ]]; then
    log "Running setup"
    ok=true
    run manage create_superuser_if_none_exists --user=admin --password=admin || { ok=false; warn "Creating the admin user failed: $reason"; }
    run manage wagtail_replace_default_site_root_page || { ok=false; warn "Replacing the default site root page failed: $reason"; }
    run manage createcachetable || { ok=false; warn "createcachetable failed: $reason"; }
    if [[ $ok == true ]]; then
        touch "$setup_marker"
    fi
fi
run manage collectstatic --no-input || warn "collectstatic failed: $reason"

for ((i = 0; i < 60; i++)); do
    if (exec 3<>"/dev/tcp/127.0.0.1/$RUNSERVER_PORT") 2>/dev/null; then
        break
    fi
    sleep 1
done

log "Ready on slot $slot: $url (admin/admin at $url/wt/cms/)"
