#!/bin/bash
set -e

# Arguments
local_domain=${1-example.com.dev:8081}
ssh_host=${2-user@stage-server}

ROOTDIR=$(git rev-parse --show-toplevel)
DOCKERDIR=$(cd ${ROOTDIR}/docker/; pwd)


echo "Creating database dump from stage..."
ssh $ssh_host "export PGUSER=<remote_db_user> && pg_dump <remote_db> --no-owner > /tmp/db-dump.sql"

echo "Downloading database dump..."
scp $ssh_host:/tmp/db-dump.sql $DOCKERDIR/files/db-dumps/db-dump.sql
ssh $ssh_host "rm /tmp/db-dump.sql"

cd $ROOTDIR
echo "Rebuilding docker containers."

eval $(docker-machine env default)

docker-compose stop
docker-compose rm -f --all
docker-compose up -d

echo "Waiting for postgres..."
sleep 10

echo "Adjusting database..."

docker-compose exec web python manage.py change_site_domain --site_id=1 --new_site_domain=$local_domain

docker-compose exec web python manage.py change_user_password --user=admin --password=admin

echo "Done!"
echo "Username/Password is admin/admin"
