#!/bin/bash
#
# Sync db and assets from prod to stage
#
# Please note: This is an example on how a script that updates your stage environment
# with data from prod can look like. You will most likely need to do changes here
# depending on your server configuration ana aws preferences.
#
# You need to add the aws user `<awa_profile>` to ~/.aws/config
#
#   [profile {{ cookiecutter.aws_devops_iam_username }}]
#   aws_access_key_id=<MY_AWS_ACCESS_KEY_ID>
#   aws_secret_access_key=<MY_AWS_SECRET_ACCESS_KEY>
#   region=eu-west-1
#
# Example usage `scripts/prod_to_stage.sh`

set -e

readonly STAGE_HOST=deploy@{{ cookiecutter.ssh_host_stage }}
readonly PROD_HOST=deploy@{{ cookiecutter.ssh_host_prod }}

read -p "This will replace the STAGE database - Are you sure? [y/n]" -n 1 -r
echo # nl
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

type aws >/dev/null 2>&1 || {
    echo >&2 "aws-cli must be installed for s3 sync to work (pip install awscli)"
    exit 1
}

echo "Creating database dump from prod..."
ssh $PROD_HOST "pg_dump -h localhost -Fc -f /tmp/db-dump.sql -U postgres {{ cookiecutter.db_name_prod }} -x -O"

echo "Downloading database dump..."
scp $PROD_HOST:/tmp/db-dump.sql /tmp/db-dump.sql
ssh $PROD_HOST "rm /tmp/db-dump.sql"

echo "Uploading database to new server"
scp /tmp/db-dump.sql $STAGE_HOST:/tmp/db-dump.sql

echo "Replacing stage db"
ssh $STAGE_HOST "sudo -u postgres pg_restore --clean -h localhost -d {{ cookiecutter.db_name_stage }} -U postgres '/tmp/db-dump.sql'"
ssh $STAGE_HOST "rm /tmp/db-dump.sql"

rm /tmp/db-dump.sql

echo "Updating database..."
manage_prefix="source /mnt/persist/www/{{ cookiecutter.project_slug }}/shared/venv/bin/activate && cd /mnt/persist/www/{{ cookiecutter.project_slug }}/current/src &&"

ssh $STAGE_HOST "$manage_prefix python manage.py change_site_domain --site_id=1 --new_site_domain='{{ cookiecutter.domain_stage }}'"

echo "Syncing s3 buckets..."
aws --profile {{ cookiecutter.aws_devops_iam_username }} s3 sync s3://{{ cookiecutter.s3_bucket_stage }} s3://{{ cookiecutter.s3_bucket_prod }} --acl public-read

echo "Done!"
