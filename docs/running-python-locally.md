# Running python locally

## Foreword

Lets start with us saying that docker is a great tool. But in all this greatness there is a performance penalty. In some cases the penalty is big enough that you want to eject docker and use a local python interpreter instead - this tutorial will show you how.

## Setup

Begin by adding our included docker-compose override, it will change the `PYTHON_HOST` environment variable in `docker-compose.yml` for the container `web` so we use a local running python interpreter instead of the docker version. This override will also replace the python container with a no-op container.

```
cp docker-compose.override.local.yml docker-compose.override.yml
```

If you have a existing web container, remove it `docker-compose rm web`

Create a custom .env file for your local db instance

```
touch src/.env.local
```

And supply your env configuration, you can usually just copy paste the values you would have from `/docker/config/python.env` and only replace `DATABASE_HOST`.

```
DJANGO_SETTINGS_MODULE=pipit.settings.local
ALLOWED_HOSTS=*
INTERNAL_IPS=0.0.0.0
SECRET_KEY=generatesecretkeyhere
MEDIA_PATH=./media
STATIC_PATH=./static
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app
DATABASE_HOST=localhost
DATABASE_PORT=8083
```

Setup virtualenv (but please note that there are many different ways of doing package management in python (pyenv, poetry etc), if you have a preffered way of doing things - do it :)

```
cd src
python3 -m venv venv
source venv/bin/activate
```

Install local packages. We use test.txt here because it include both requirements for running the app with dev tools and testing requirements.

```
pip install -r requirements/test.txt
```

Tip: If you are having issues installing `psycopg2` because your are lacking postgres, replace `psycopg2` with `psycopg2-binary`

## Running website

Start docker (without the `python` container)

```
docker-compose up db web
```

And then finally start your python server

```
cd src
python manage.py collectstatic
python manage.py runserver 8000
```

Now open `http://blog.acme.com.test:8081/wt/cms` in your favorite browser and you should see the Wagtail CMS login page.

## Running tests

Because we use a different set of configuration while connecting to the db, we keep a custom pytest config around for running python locally.

```
cd src
pytest -c pytest.local.ini
```
