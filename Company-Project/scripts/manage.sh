#!/usr/bin/env bash
set -e

#
# Run manage.py commands inside of container
#
# Example usage `scripts/manage.sh makemigrations`
# Example usage `scripts/manage.sh migrate`

COMMAND="python manage.py $@"
docker-compose exec web $COMMAND
