#!/usr/bin/env bash
set -e

#
# Run uv commands inside of container
#
# Example usage `scripts/uv.sh add requests`
# Example usage `scripts/uv.sh sync --group dev`
# Example usage `scripts/uv.sh lock`

uv_command="uv $@"
docker compose exec python $uv_command
