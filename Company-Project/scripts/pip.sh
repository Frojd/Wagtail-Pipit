#!/usr/bin/env bash
set -e

#
# Run pip commands inside of container
#
# Example usage `scripts/pip.sh install -r requirements/local.txt`
# Example usage `scripts/pip.sh install requests`

pip_command="pip $@"
docker-compose exec python $pip_command
