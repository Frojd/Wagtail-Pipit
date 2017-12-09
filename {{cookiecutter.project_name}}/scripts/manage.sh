#!/usr/bin/env bash
set -e

#
# Run manage.py commands inside of container
#
# Example usage `scripts/manage.sh makemigrations`
# Example usage `scripts/manage.sh migrate`

 cd $(git rev-parse --show-toplevel)

COMMAND="python manage.py $@"
docker-compose exec web $COMMAND

cd -
