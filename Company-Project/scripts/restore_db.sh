#!/bin/bash
set -e

# Arguments
local_domain=${1-example.com.test:8081}

echo "Rebuilding docker containers."

docker-compose stop
docker-compose rm -f
docker-compose up -d

echo "Waiting for postgres (60 seconds)..."
sleep 60

echo "Adjusting database..."

docker-compose exec web python manage.py wagtail_change_site_domain --site_id=1 --new_site_domain=$local_domain

docker-compose exec web python manage.py change_user_password --user=admin --password=admin

echo "---"
echo "Done!"
echo "The application is ready at: $local_domain"
echo "Username/Password is admin/admin"
