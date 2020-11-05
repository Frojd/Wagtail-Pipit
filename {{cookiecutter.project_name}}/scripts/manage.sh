#!/usr/bin/env bash
set -e

#
# Run manage.py commands inside of container
#
# Example usage `scripts/manage.sh makemigrations`
# Example usage `scripts/manage.sh migrate`

manage_command="./manage.py $@"
docker-compose exec python $manage_command
