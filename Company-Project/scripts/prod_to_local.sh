#!/bin/bash
set -e

# Arguments
local_domain=${1-example.com.test:8081}
ssh_host=${2-devops@example.com}
db_wait_time=20

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DOCKER_DIR=${SCRIPTS_DIR}/../docker/

echo "Creating database dump from prod..."
ssh $ssh_host "export PGUSER=postgres && pg_dump company_project --no-owner > /tmp/db-dump.sql"

echo "Downloading database dump..."
scp $ssh_host:/tmp/db-dump.sql $DOCKER_DIR/files/db-dumps/db-dump.sql
ssh $ssh_host "rm /tmp/db-dump.sql"

echo "Rebuilding docker containers."

docker-compose stop
docker-compose rm -f
docker-compose up -d

echo "Waiting for postgres ($db_wait_time seconds)..."
sleep $db_wait_time

echo "Adjusting database..."

docker-compose exec python ./manage.py wagtail_change_site_domain --site_id=1 --new_site_domain=$local_domain

docker-compose exec python ./manage.py change_user_password --user=admin --password=admin

echo "---"
echo "Done!"
echo "The application is ready at: http://$local_domain"
echo "Username/Password is admin/admin"
