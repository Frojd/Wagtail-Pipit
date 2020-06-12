#!/bin/bash
# $0 is a script name, $1, $2, $3 etc are passed arguments
# $1 is our command
# Credits: https://rock-it.pl/how-to-write-excellent-dockerfiles/
CMD=$1

wait_for_db () {
    # Wait until postgres is ready
    until nc -z $DATABASE_HOST 5432; do
        echo "$(date) - waiting for postgres... ($DATABASE_HOST:5432)"
        sleep 3
    done
}

setup_django () {
    echo Creating log dir
    mkdir -p $APP_LOG_DIR
    echo $APP_LOG_DIR

    echo Updating app log dir permissions
    touch $APP_LOG_DIR/django-debug.log
    chown www-data:www-data $APP_LOG_DIR/django-debug.log

    echo Running migrations
    python manage.py migrate --noinput

    echo Create dummy user if none exists
    python manage.py create_superuser_if_none_exists --user=admin --password=admin

    echo Replace possible default site root page
    python manage.py wagtail_replace_default_site_root_page

    echo Collecting static-files
    python manage.py collectstatic --noinput

    echo Create cache table
    python manage.py createcachetable
}

case "$CMD" in
    "runserver" )
        wait_for_db
        setup_django

        echo Starting using manage.py runserver
        exec python manage.py runserver 0.0.0.0:8000
        ;;

    "runserver_ssl" )
        wait_for_db
        setup_django

        if [ ! -f "/priv/cert/cert-key.pem" ]; then
            echo "Error! You are missing the required SSL certificates"
            echo "To solve it, make sure you have mkcert installed with a root cert, then run:"
            echo "mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem {{cookiecutter.domain_prod}}.test"
            exit 1
        fi

        echo Starting using manage.py runsslserver
        export REACT_DEVSERVER_HTTPS="True"
        exec python manage.py runsslserver 0.0.0.0:8000 --certificate /priv/cert/cert.pem --key /priv/cert/cert-key.pem
        ;;

    "uwsgi" )
        wait_for_db
        setup_django

		pip install uwsgi

        echo Starting using uwsgi
        exec uwsgi --ini uwsgi.ini
        ;;

    "test" )
        wait_for_db

        echo Running tests
        exec pytest --ds=pipit.settings.test
        ;;

    * )
        # Run custom command. Thanks to this line we can still use
        # "docker run our_container /bin/bash" and it will work
        exec $CMD ${@:2}
        ;;
esac
