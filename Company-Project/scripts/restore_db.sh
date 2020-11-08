#!/bin/bash
#
# Restore db based on local sql dump
set -e

readonly DB_WAIT_TIME=20  # Arbitrary timeout value for making sure the db is ready
readonly LOCAL_DOMAIN=example.com.test:8081

scripts_dir="$(cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd)"
docker_dir=${scripts_dir}/../docker

echo "Rebuilding docker containers."
docker-compose stop db
docker-compose rm -f db
docker-compose up -d db

echo "Waiting for database ($DB_WAIT_TIME seconds)..."
sleep $DB_WAIT_TIME

src_dir=${scripts_dir}/../src
use_local_python=$(test -f "$src_dir/.env" || test -f "$src_dir/.env.local")

if $use_local_python && [[ "$VIRTUAL_ENV" == "" ]]
then
    echo "Warning: No active virtualenv found"
fi

if $use_local_python;
then
    manage_command="$src_dir/manage.py"
else
    manage_command="docker-compose exec python ./manage.py"
fi

echo "Adjusting database..."
$manage_command wagtail_change_site_domain --site_id=1 --new_site_domain=$LOCAL_DOMAIN
$manage_command change_user_password --user=admin --password=admin

echo "The application is ready at: $LOCAL_DOMAIN"
echo "Username/Password is admin/admin"
