# Fröjd Django Boilerplate

This is a Django boilerplate that convers best practices and a docker configuration.


## Requirements

- Python 2.7x
- Pip
- PostgreSQL
- Virtualenv
- Docker (optional)


## Installation

- Clone the project

### Docker

1. Install docker (use the [Docker Toolbox](https://www.docker.com/products/docker-toolbox))
    - Minimum requirements are docker `1.11`, docker-compose `1.7`

2. Setup correct .env files and start docker:

    ```
    cd docker/config
    cp db.example.env db.env
    cp web.example.env web.env
    vim web.env
    >>> Add the missing params
    ```

3. Setup machine (if not already present)

    ```
    docker-machine create --driver virtualbox default
    docker-machine start default
    ```

4. Start project

    ```
    $(docker-machine env default)

    cd docker
    docker-compose up
    ```

    Or if you prefer running uwsgi+nginx...

    ```
    docker-compose -f docker-compose.yml -f docker-compose-nginx.yml up
    ```


5. Retrive machine ip: `docker-machine ip default`
6. Include this on your hosts-file

    ```
    <your-machine-ip>   myproject.dev
    ```

7. Retrive the latest data dump from: `./docker/stage_to_local.sh`
    - (this requires that have setup access to the stage/prod server with your ssh-key)

8. Visit your site on: `http://myproject.dev:8000`


### Non docker

2. Install a virtualenv in your new project folder (`virtualenv venv`)
3. Activate the virtualenv: `source venv/bin/activate` (or on windows: `./venv/Scripts/activate`)
4. Install the requirements from the environment you want (usually local version) with: `pip install -r src/requirements/local.txt`
5. Create a database in postgres and remember the database name and user/password
6. Copy the example.env and rename to .env and change the settings to your projects specific settings (including database etc)
7. Go into src `cd src`
8. Run the migrations to get auth system and the example pages app `python manage.py migrate`
9. Create a superuser for your admin: `python manage.py createsuperuser`
10. Start the development server: `python manage.py runserver`
11. Run `python manage.py collectstatic`
12. Visit your site on: [http://localhost:8000](http://localhost:8000)


## Example app

To activate the example app, uncomment in it in base.py and it's included urls in urls.py in the core folder.


## Versioning

This boilerplate uses [semantic versioning](http://semver.org/) and follow django's MAJOR and MINOR version numbers, PATCH has no connection to django version, but is something we use to indicate updates.


## Style Guide

We follow the [django coding style](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

Fröjd Django Boilerplate is released under the [MIT License](http://www.opensource.org/licenses/MIT).
