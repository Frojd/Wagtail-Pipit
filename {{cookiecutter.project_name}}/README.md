# {{cookiecutter.project_name}}

{{cookiecutter.description}}


## Requirements

- Python 3.6+
- Pip
- Virtualenv
- Docker ([Install instructions](#how-do-i-install-docker-on-macos))


## Installation

1. Setup container .env files

    ```
    cd docker/config
    cp db.example.env db.env
    cp web.example.env web.env
    ```

2. Retrive your machine ip: `docker-machine ip default`
3. Include this ip on your hosts-file

    ```
    127.0.0.1  {{cookiecutter.domain_prod}}.dev
    ```

4. Start project

    ```
    docker-compose up
    ```

6. Visit your site on: [http://{{cookiecutter.domain_prod}}.dev:{{cookiecutter.docker_web_port}}](http://{{cookiecutter.domain_prod}}.dev:{{cookiecutter.docker_web_port}})


## Example app

To activate the example app, uncomment it in base.py and it's included urls in urls.py in the core app.


## Versioning

This boilerplate uses [semantic versioning](http://semver.org/) and follow django's MAJOR and MINOR version numbers, PATCH has no connection to django version, but is something we use to indicate updates.

Bump version in:

- src/core/settings/base.py `(APP_VERSION=0.0.1)`
- frontend/package.json
- src/Dockerfile

...or just use the [bump-version](#bump-version) git hook


## Style Guide

We follow the [django coding style](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


## Merge conflicts

The project has `.gitattributes`, but you need to make sure a driver is set up for this, type this is the terminal:

```
git config --global merge.ours.driver true
```


## Git hooks

### Bump version

These hooks will automatically bump the application version when using `git flow release ...`

```bash
chmod +x $PWD/.githooks/bump-version.sh
ln -nfs $PWD/.githooks/bump-version.sh .git/hooks/post-flow-release-start
ln -nfs $PWD/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
```

### Run tests pre push

This hook will run the test suite before every push.

```bash
chmod +x $PWD/.githooks/pre-push.sh
ln -nfs $PWD/.githooks/pre-push.sh .git/hooks/pre-push
```

### Run pep8 validation on commit

```bash
chmod +x $PWD/.githooks/pep8-pre-commit.sh
ln -nfs $PWD/.githooks/pep8-pre-commit.sh .git/hooks/pre-commit
```

Note: This requires the pep8 package (`pip install pep8`)


## FAQ

### How do I run the app locally with a production setup?

This app includes a docker-compose config that uses uwsgi and nginx. Just run this command.

```
docker-compose -f docker-compose.yml -f docker-compose-nginx.yml up
```

### How do I sync data from stage/prod?

You can rebuild your application with the latest data dump by running the following

```
./docker/stage_to_local.sh
```

Note: This requires that have ssh-key based access to the stage or prod server

### How do I install Docker on MacOS?

1. Install docker (use the [Docker Toolbox](https://www.docker.com/products/docker-toolbox)). Please use the virtualbox version.
    - Minimum requirements are docker `1.11`, docker-compose `1.7`

2. Setup machine (if not already present)

    ```
    docker-machine create --driver virtualbox default
    docker-machine start default
    ```

### How can I run pdb on the python container?

Start the container with service-ports exposed instead of `docker-compose up`. This will create a container called `<project_prefix>_web_run_1`

```
docker-compose run --rm --service-ports web
```


### How do I run custom manage.py commands?

To run manage.py commands in docker is pretty straightforward, instead of targetting you local machine you just target your web container.

- Example: Create migrations

```
docker-compose exec run web python manage.py makemigrations
```

- Example: Run migrations

```
docker-compose exec run web python manage.py migrate
```

We also have a manage.sh script to make running management commands easier.

```
scripts/manage.sh makemigrations
```


### How do I add new python dependecies?

First update your requirements/base.txt, then rebuild your container:

```
docker-compose stop
docker-compose build
docker-compose up
```


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

Fröjd Django Boilerplate is released under the [MIT License](http://www.opensource.org/licenses/MIT).
