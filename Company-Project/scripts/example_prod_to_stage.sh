#!/bin/bash
#
# Sync db and assets from prod to stage
#
# SSH-keys is mandatory
# You need to add the aws user `<awa_profile>` to ~/.aws/config
#
# Example usage `scripts/prod_to_stage.sh my-admin-password`

# `<aws_profile>`:
# `<remote_db_name>`:
# `<remote_db_user>`:
# `<remote_stage_host>`:
# `<remote_prod_host>`:
# `<remote_stage_domain>`:
# `<a3_stage_bucket>`:
# `<s3_prod_bucket>`:

set -e

read -p "This will replace the STAGE database - Are you sure? [y/n]" -n 1 -r
echo # nl
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

# Make sure aws-cli is installed
type aws >/dev/null 2>&1 || {
    echo >&2 "aws-cli must be installed for s3 sync to work (pip install awscli)"
    exit 1
}

# Arguments
stage_host=${1-devops@stage.example.com}
prod_host=${2-devops@example.com}

echo "Creating database dump from stage..."
ssh $prod_host "pg_dump -h localhost -Fc -f /tmp/db-dump.sql -U postgres company_project -x -O"

echo "Downloading database dump..."
scp $prod_host:/tmp/db-dump.sql /tmp/db-dump.sql
ssh $prod_host "rm /tmp/db-dump.sql"

echo "Uploading database to new server"
scp /tmp/db-dump.sql $stage_host:/tmp/db-dump.sql

echo "Replacing stage db"
ssh $stage_host "sudo -u postgres pg_restore --clean -h localhost -d company_project -U postgres '/tmp/db-dump.sql'"
ssh $stage_host "rm /tmp/db-dump.sql"

rm /tmp/db-dump.sql

echo "Updating database..."
manage_prefix="source /mnt/persist/www/django/env/bin/activate && cd /mnt/persist/www/django/current &&"

ssh $stage_host "$manage_prefix python manage.py change_site_domain --site_id=1 --new_site_domain='stage.example.com'"

echo "Syncing s3 buckets..."
aws --profile company_project_devops s3 sync s3://s3.stage.example.com s3://s3.example.com --acl public-read

echo "Done!"
