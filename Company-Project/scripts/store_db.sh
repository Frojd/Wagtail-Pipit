#!/usr/bin/env bash
#
# Stores current db-dump to docker/files/shared/export.sql
#
# It can be useful to save the current state
# to allow you to rebuild the db container without data-loss.
#
# Or if you want to send it to a friend you could just send it over and if they put
# it in docker/files/db-dumps it will be read after docker-compose build -- Sharing is caring.

docker-compose exec db bash -c "export PGUSER=postgres && pg_dump app --no-owner > /shared/export.sql"
