#!/bin/bash
#
# Syncs database and media files from remote server
set -e

readonly DB_WAIT_TIME=20  # Arbitrary timeout value for making sure the db is ready
readonly LOCAL_DOMAIN={{ cookiecutter.domain_prod }}.test:{{ cookiecutter.docker_web_port }}
readonly SSH_HOST=deploy@{{ cookiecutter.ssh_host_stage }}
readonly REMOTE_MEDIA_PATH=/mnt/persist/www/{{ cookiecutter.project_slug }}/shared/media

scripts_dir="$(cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd)"
docker_dir=${scripts_dir}/../docker

echo "Creating database dump from stage..."
ssh $SSH_HOST "export PGUSER=postgres && pg_dump {{ cookiecutter.db_name_stage }} --no-owner > /tmp/db-dump.sql"

echo "Downloading database dump..."
scp $SSH_HOST:/tmp/db-dump.sql $docker_dir/files/db-dumps/db-dump.sql
ssh $SSH_HOST "rm /tmp/db-dump.sql"

echo "Rebuilding database..."
docker-compose stop db
docker-compose rm -f db
docker-compose up -d db

echo "Waiting for database ($DB_WAIT_TIME seconds)..."
sleep $DB_WAIT_TIME

src_dir=${scripts_dir}/../src

if test -f "$src_dir/.env" || test -f "$src_dir/.env.local"
then
    echo "Info: Using local python"
    use_local_python=1
else
    echo "Info: Using docker python"
    use_local_python=0
fi

if [[ $use_local_python == 1 ]] && [[ "$VIRTUAL_ENV" == "" ]]
then
    echo "Warning: No active virtualenv found"
fi

if [[ $use_local_python == 1 ]]
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

read -p "Sync media? [y/n]" -n 1 -r
echo # nl
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi
rsync -re ssh $SSH_HOST:$REMOTE_MEDIA_PATH/* ${src_dir}/media
