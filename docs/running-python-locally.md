# Running python locally

## Foreword

Lets start with us saying that docker is a great tool. But in all this greatness there is a performance penalty. In some cases the penalty is big enough that you want to eject docker and use a local python interpreter instead - this tutorial will show you how.

## Tutorial

- Begin with changing the `PYTHON_HOST` environemnt variable in `docker-compose.yml` for the container `web` so we use a local running python interpreter instead of the docker version.

```
web:
    ...
    environment:
        - PYTHON_HOST=http://host.docker.internal
```

- Create a custom .env file for your local db instance

```
touch local.env
```

- And supply proper env configuration so we can connect to docker db from our local python interpreter

```
DJANGO_SETTINGS_MODULE=pipit.settings.local
ALLOWED_HOSTS=*
INTERNAL_IPS=0.0.0.0
SECRET_KEY=generatesecretkeyhere
MEDIA_PATH=/app/media
STATIC_PATH=/app/static
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
DATABASE_HOST=localhost

```

- Setup virtualenv

```
cd src
python3 -m venv venv
source venv/bin/activate
```

- Install local packages

```
pip install -r requirements/local.txt
```

Tip: If you are having issues installing `psycopg2` becase your are lacking postgres, replace `psycopg2` with `psycopg2-binary`

- Start docker

```
docker-compose up db web
```

- And then finally start your python server

```
cd src
python manage.py runserver 8000
```

- Now open `http://blog.acme.com.test:8081/wt/cms` in your favorite broser and you should see the Wagtail CMS login page
