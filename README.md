# Fröjd Django Boilerplate

This is a Django boilerplate that covers best practices and a docker configuration.


## Requirements

- Python 2.7x
- Pip
- Virtualenv
- Docker ([Install instructions](#how-do-i-install-docker-on-macos))


## Installation

- Clone the project


### With Docker

1. Setup correct .env files and start docker:

    ```
    cd docker/config
    cp db.example.env db.env
    cp web.example.env web.env
    ```

2. Retrive your machine ip: `docker-machine ip default`
3. Include this ip on your hosts-file

    ```
    <your-machine-ip>   myproject.dev
    ```

4. Start project

    ```
    $(docker-machine env default)

    cd docker && docker-compose up
    ```

5. Visit your site on: `http://myproject.com.dev:8000`


### Without docker (not recommended)

1. Make you have all components installed:
    - PostgreSQL
    - Python 2.7
    - Pip
    - Virtualenv

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

Bump version in:

- src/core/settings/base.py `(APP_VERSION=)`
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
chmod +x $PWD/git-hooks/bump-version.sh
ln -nfs $PWD/git-hooks/bump-version.sh .git/hooks/post-flow-release-start
ln -nfs $PWD/git-hooks/bump-version.sh .git/hooks/post-flow-hotfix-start
```

### Run tests pre push

This hook will run the test suite before every push.

```bash
chmod +x $PWD/git-hooks/pre-push.sh
ln -nfs $PWD/git-hooks/pre-push.sh .git/hooks/pre-push
```

### Run pep8 validation on commit

```bash
chmod +x $PWD/git-hooks/pep8-pre-commit.sh
ln -nfs $PWD/git-hooks/pep8-pre-commit.sh .git/hooks/pre-commit
```

Note: This requires the pep8 package (`pip install pep8`)


## FAQ

### How do I run the app locally with a production setup?

This app includes a docker-compose config that uses uwsgi and nginx. Just run this command.

```
docker-compose -f docker-compose.yml -f docker-compose-nginx.yml up
```

### How do I sync data from stage?

You can rebuild your application with the latest data dump by running: `./docker/stage_to_local.sh`
    - (this requires that have setup access to the stage/prod server with your ssh-key)

### How do I install Docker on MacOS?

1. Install docker (use the [Docker Toolbox](https://www.docker.com/products/docker-toolbox)). Please use the virtualbox version.
    - Minimum requirements are docker `1.11`, docker-compose `1.7`

2. Setup machine (if not already present)

    ```
    docker-machine create --driver virtualbox default
    docker-machine start default
    ```

## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

Fröjd Django Boilerplate is released under the [MIT License](http://www.opensource.org/licenses/MIT).
