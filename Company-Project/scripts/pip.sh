#!/usr/bin/env bash
set -e

#
# Run pip commands inside of container
#
# Example usage `scripts/pip.sh install -r requirements/local.txt`
# Example usage `scripts/pip.sh install requests`

 cd $(git rev-parse --show-toplevel)

COMMAND="pip $@"
docker-compose exec web $COMMAND

cd -
