#!/bin/bash
#
# Sync db and assets from prod to stage
#
# Please note: This is an example on how a script that updates your stage environment
# with data from prod can look like. You will most likely need to do changes here
# depending on your server configuration.
#
# Example usage `scripts/prod_to_stage.sh`

set -e

readonly STAGE_HOST=deploy@stage.example.com
readonly PROD_HOST=deploy@example.com
readonly REMOTE_MEDIA_PATH=/mnt/persist/www/company_project/shared/media

scripts_dir="$(cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd)"

read -p "This will replace the STAGE database - Are you sure? [y/n]" -n 1 -r
echo # nl
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

echo "Creating database dump from prod..."
ssh $PROD_HOST "pg_dump -h localhost -Fc -f /tmp/db-dump.sql -U postgres company_project -x -O"

echo "Downloading database dump..."
scp $PROD_HOST:/tmp/db-dump.sql /tmp/db-dump.sql
ssh $PROD_HOST "rm /tmp/db-dump.sql"

echo "Uploading database to new server"
scp /tmp/db-dump.sql $STAGE_HOST:/tmp/db-dump.sql

echo "Replacing stage db"
ssh $STAGE_HOST "sudo -u postgres pg_restore --clean -h localhost -d company_project -U postgres '/tmp/db-dump.sql'"
ssh $STAGE_HOST "rm /tmp/db-dump.sql"

rm /tmp/db-dump.sql

echo "Updating database..."
manage_prefix="source /mnt/persist/www/company_project/shared/venv/bin/activate && cd /mnt/persist/www/company_project/current/src &&"

ssh $STAGE_HOST "$manage_prefix python manage.py change_site_domain --site_id=1 --new_site_domain='stage.example.com'"

echo "Syncing media..."
src_dir=${scripts_dir}/../src

rsync -re ssh $PROD_HOST:$REMOTE_MEDIA_PATH/* ${src_dir}/media
rsync -r ${src_dir}/media $STAGE_HOST:$REMOTE_MEDIA_PATH

echo "Done!"
