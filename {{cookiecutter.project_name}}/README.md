# {{cookiecutter.project_name}}

{{cookiecutter.description}}


## Index

- [Requirements](#requirements)
- [Installation](#installation)
- [Example app](#example-app)
- [Versioning](#versioning)
- [Style Guide](#style-guide)
- [Deployment](#deployment)
- [Merge conflicts](#merge-conflicts)
- [Git hooks](#git-hooks)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)


## Requirements

- Python 3.6+ 
    - Python 2.7 (for deploy scripts) (**Optional**)
- Pip
- Virtualenv
- Docker ([Install instructions](#how-do-i-install-docker-on-macoswindows))


## Installation

1. Setup container .env files

    ```
    cp docker/config/db.example.env docker/config/db.env
    cp docker/config/web.example.env docker/config/web.env
    ```

2. Include this ip on your hosts-file

    ```
    127.0.0.1  {{cookiecutter.domain_prod}}.dev
    ```

    On windows you can run this command to append it:

    ```
    echo 127.0.0.1  beta.medborgarskolan.se.dev >> c:\windows\System32\drivers\etc\hosts
    ```

3. Start project

    ```
    docker-compose up
    ```

4. Visit your site on: [http://{{cookiecutter.domain_prod}}.dev:{{cookiecutter.docker_web_port}}](http://{{cookiecutter.domain_prod}}.dev:{{cookiecutter.docker_web_port}})


## Example app

To activate the example app, uncomment it in base.py and it's included urls in urls.py in the core app.


## Versioning

This project follows [semantic versioning](http://semver.org/).

Bump version in:

- src/core/settings/base.py `(APP_VERSION=)`
- frontend/package.json
- src/Dockerfile

...or just use the [bump-version](#bump-version) git hook


## Style Guide

We follow the [django coding style](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


## Deployment

This project utilizes Continious Integration (CI) and Continious Deployment (CD), what this means is that everytime a team member runs `git push`, our CI environment (Circle CI) will run tests on the application and if successfull, will automatically deploy the application to stage or production.

Our deploy scripts are based on fabric toolkit called [Fabrik](https://github.com/Frojd/Fabrik).


### Working with CI environment vars

The environment for CI variables are added to an encrypted file and checked in (`.circlerc-crypt`), the raw file (`.circlerc`) should not be checked in. Circle-CI will use this file automatically and deploy to stages with deploy script. A key should be created for the project and documented. Also make sure to associate your encryption key with repo on Circle.

#### Commands when encrypting/decypting .circlerc

- Encrypt `openssl aes-256-cbc -e -in .circlerc -out .circlerc-crypt -k <KEY>`
- Decrypt `openssl aes-256-cbc -d -in .circlerc-crypt -out .circlerc -k <KEY>`


### Deploying manually

It's possible you deploy manually and is something that you usually do this before CI is configured.

#### Requirements

- Python 2.7 and pip
- Virtualenv

#### How to

- Open deployment folder: `cd deploy`
- Setup and activate virtualenv: `virtualenv venv && venv/bin/activate`
- Install deps: `pip install -r requirements.txt`
- Create config for deployscript: `cp fabricrc.example.txt fabricrc.txt`
- Update configuration: `vim fabricrc.txt`

#### Verify ssh configuration

`fabrik <stage|prod> test`

#### Deploy application

`fabrik <stage|prod> deploy`


## Merge conflicts

The project has `.gitattributes`, but you need to make sure a driver is set up for this, type this is the terminal:

```
git config --global merge.ours.driver true
```


## Git hooks

We use git-hooks to streamline and automate certain functions, such as version bumping and pre hooks for code validation and tests. If you want to bypass any of them append the `--no-verify` flag (example: `git push --no-verify`)

### Hook: Bump version

These hooks will automatically bump the application version when using `git flow release ...`

```bash
chmod +x $PWD/.githooks/bump-version.sh
ln -nfs $PWD/.githooks/bump-version.sh .git/hooks/post-flow-release-start
ln -nfs $PWD/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
```

### Hook: Run tests pre push

This hook will run the test suite before every push.

```bash
chmod +x $PWD/.githooks/pre-push.sh
ln -nfs $PWD/.githooks/pre-push.sh .git/hooks/pre-push
```

### Hook: Run pep8 validation on commit

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
./scripts/stage_to_local.sh
```

Note: This requires that you have ssh-key based access to the server.


### How do I install Docker on MacOS/Windows?

You can either use Docker for Mac/Windows or the [Docker Toolbox](https://www.docker.com/products/docker-toolbox). (Minimum requirements are docker `1.11`, docker-compose `1.7`)


### How can I run pdb on the python container?

Start the container with service-ports exposed instead of `docker-compose up`. This will create a container called `<project_prefix>_web_run_1`

```
docker-compose run --rm --service-ports web
```


### How do I run custom manage.py commands?

To run manage.py commands in docker is pretty straightforward, instead of targetting you local machine you just target your web container.

- Example: Create migrations

```
docker-compose exec web python manage.py makemigrations
```

- Example: Run migrations

```
docker-compose exec web python manage.py migrate
```

We also have a manage.sh script to make running management commands easier.

```
scripts/manage.sh makemigrations
```


### How do I add new python dependencies?

First update your requirements/base.txt, then rebuild your container:

```
docker-compose stop
docker-compose build
docker-compose up
```


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

{% if cookiecutter.software_license != 'proprietary' %}
{{cookiecutter.project_name}} is released under the {{cookiecutter.software_license}} license.
{% else %}
{{cookiecutter.project_name}} is proprietary software. All rights reserved.
{% endif %}
