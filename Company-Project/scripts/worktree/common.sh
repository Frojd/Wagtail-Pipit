# Shared helpers for the isolated worktree scripts. Sourced, not executed.
#
# The project can live in a subdirectory of the git repo, PROJECT_PREFIX is then
# that subdirectory with a trailing slash. Worktrees and branches belong to the git
# root, devenv and env files to the project root.

export DIRENV_LOG_FORMAT=""
# Hooks can run with a minimal PATH, add the usual Nix and Homebrew locations
export PATH="$HOME/.nix-profile/bin:$HOME/.local/state/nix/profile/bin:/etc/profiles/per-user/${USER:-$(id -un)}/bin:/run/current-system/sw/bin:/nix/var/nix/profiles/default/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_PREFIX="$(git -C "$SCRIPT_DIR/../.." rev-parse --show-prefix 2>/dev/null)"
MAIN_ROOT="$(cd "$SCRIPT_DIR" && cd "$(git rev-parse --git-common-dir 2>/dev/null)/.." 2>/dev/null && pwd -P)"
WORKTREES_DIR="$MAIN_ROOT/.claude/worktrees"

log() {
    echo "[worktree] $*" >&2
}

has_nix() {
    command -v devenv >/dev/null 2>&1 && command -v direnv >/dev/null 2>&1
}

# Prints a top level string field of the JSON on stdin, jq is not installed everywhere
json_field() {
    local input
    input="$(cat)"
    if command -v jq >/dev/null 2>&1; then
        printf '%s' "$input" | jq -r --arg k "$1" '.[$k] // empty'
    elif command -v node >/dev/null 2>&1; then
        printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const v=JSON.parse(s)[process.argv[1]];if(v!=null)process.stdout.write(String(v))})' "$1"
    elif command -v python3 >/dev/null 2>&1; then
        printf '%s' "$input" | python3 -c 'import json,sys;v=json.load(sys.stdin).get(sys.argv[1]);print(v if v is not None else "",end="")' "$1"
    else
        printf '%s' "$input" | sed -nE "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"([^\"]*)\".*/\1/p" | head -1
    fi
}

json_string() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/}"
    s="${s//$'\t'/\\t}"
    printf '"%s"' "$s"
}

# Project root of a worktree (or the main checkout) given its git root
project_dir() {
    if [[ -n "$PROJECT_PREFIX" ]]; then
        echo "$1/${PROJECT_PREFIX%/}"
    else
        echo "$1"
    fi
}

# Physical git root of a worktree given any path inside it
git_root_of() {
    (cd "$(git -C "$1" rev-parse --show-toplevel)" && pwd -P)
}

is_managed_worktree() {
    [[ "$1" == "$WORKTREES_DIR/"* && -f "$(project_dir "$1")/.envrc" ]]
}

stop_services() {
    (cd "$(project_dir "$1")" && devenv processes down) >/dev/null 2>&1 || true
}

load_env() {
    eval "$(cd "$(project_dir "$1")" && direnv export bash)"
}

slot_of() {
    sed -nE 's/.*worktree\.slot = ([0-9]+);.*/\1/p' "$(project_dir "$1")/devenv.local.nix" 2>/dev/null || true
}
