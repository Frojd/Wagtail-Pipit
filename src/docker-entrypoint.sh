#!/bin/bash

# Wait until postgres is ready
until nc -z $DATABASE_HOST 5432; do
    echo "$(date) - waiting for postgres..."
    sleep 3
done

echo Creating log dir
mkdir -p $APP_LOG_DIR

echo Updating app log dir permissions
touch $APP_LOG_DIR/django-debug.log
chown www-data:www-data $APP_LOG_DIR/django-debug.log

echo Running migrations
python manage.py migrate --noinput

echo Collecting static-files
python manage.py collectstatic --noinput

echo Create cache table
python manage.py createcachetable

if [ "$RUN_TYPE" = "runserver" ]
then
    echo Starting using manage.py runserver
    python manage.py runserver 0.0.0.0:8000
fi

if [ "$RUN_TYPE" = "wsgi" ]
then
    echo Starting using uwsg
    uwsgi --ini uwsgi.ini
fi
