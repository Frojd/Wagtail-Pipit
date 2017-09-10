#!/bin/bash
# $0 is a script name, $1, $2, $3 etc are passed arguments
# $1 is our command
# Credits: https://rock-it.pl/how-to-write-excellent-dockerfiles/
CMD=$1

# Wait until postgres is ready
until nc -z $DATABASE_HOST 5432; do
    echo "$(date) - waiting for postgres... ($DATABASE_HOST:5432)"
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

case "$CMD" in
    "runserver" )
        echo Starting using manage.py runserver
        exec python manage.py runserver_plus 0.0.0.0:8000
        ;;

    "uwsgi" )
        echo Starting using uwsgi
        exec uwsgi --ini uwsgi.ini
        ;;

    "test" )
        echo Running tests
        exec pytest --ds=core.settings.test
        ;;

    * )
        # Run custom command. Thanks to this line we can still use
        # "docker run our_container /bin/bash" and it will work
        exec $CMD ${@:2}
        ;;
esac
