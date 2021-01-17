# {{cookiecutter.project_name}}


## Index

- [Requirements](#requirements)
- [Installation](#installation)
- [Where to go from here?](#where-to-get-from-here)
- [Versioning](#versioning)
- [Style Guide](#style-guide)
- [Debugging](#debugging)
- [Deployment](#deployment)
- [Merge conflicts](#merge-conflicts)
- [Git hooks](#git-hooks)
- [Server requirements](#server-requirements)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)


## Requirements

- Python 3.8+
- Pip
- Virtualenv (or the package manage of your chocie)
- Docker ([Install instructions](#how-do-i-install-docker-on-macoswindows))
- [mkcert](https://github.com/FiloSottile/mkcert)


## Installation

1. Setup container .env files

    ```
    cp docker/config/python.example.env docker/config/python.env
    ```

2. Include this ip on your hosts-file

    ```
    127.0.0.1 {{cookiecutter.domain_prod}}.test
    ```

    On windows you can run this command to append it:

    ```
    echo 127.0.0.1 {{cookiecutter.domain_prod}}.test >> c:\windows\System32\drivers\etc\hosts
    ```

3. Add root cert: `mkcert -install` (if not already available)
4. Generate ssl certs for local development:
    ```
    mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem {{cookiecutter.domain_prod}}.test
    ```
5. Start project

    ```
    docker-compose up
    ```

6. Visit your site on: [https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_port}}](https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_port}})
    - ...or login to [https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_port}}/wt/cms](https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_port}}/wt/cms) (Username: `admin` and password: `admin`)


## Where to go from here?

We recommend you to check out our [Getting Started Guide](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/bash-helper-scripts.md). Otherwise, you can read up any of the following topics:

- [Frontend developer workflow](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/frontend-developer-guide.md)
- [Baclend developer workflow](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/backend-developer-guide.md)
- [Datasync between environments](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/data-sync.md)
- [Scaffolding](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/scaffolding.md)
- [Deploying with Ansistrano](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/deployment.md)
- [Settings up continuous integration on CircleCI](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/ci.md)
- [Running python locally](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/running-python-locally.md)
- [Using static site generation](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/using-static-site-generation.md)


## Versioning

This project follows [semantic versioning](https://semver.org/).

Bump version in:

- src/pipit/settings/base.py `(APP_VERSION=)`
- frontend/package.json
- src/Dockerfile

...or just use the [bump-version](#bump-version) git hook


## Style Guide

We follow the [django coding style](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


## Debugging

### VS Code

This project is configured for remote debugging using VS Code with the official Python extension. Set `VS_CODE_REMOTE_DEBUG=True` in `docker/config/python.env` and restart your container to enable it.
You should now be able to attach to the running Django server instance.

[PTVSD](https://github.com/Microsoft/ptvsd) (Python Tools for Visual Studio debug server) is configured to listen for connections on port {{cookiecutter.docker_vscode_debug_port}}.

### pdb in Docker

To use pdb you need to start the container with service-ports exposed instead of docker-compose up. This will create a container called `<project_prefix>_web_run_1`

```
docker-compose run --rm --service-ports web
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

On windows

```
ln -nfs %cd%/.githooks/bump-version.sh .git/hooks/post-flow-release-start
ln -nfs %cd%/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
```

### Hook: Run tests pre push

This hook will run the test suite before every push.

```bash
chmod +x $PWD/.githooks/pre-push.sh
ln -nfs $PWD/.githooks/pre-push.sh .git/hooks/pre-push
```

### Hook: Run styleguide validation on commit

```bash
chmod +x $PWD/.githooks/pre-commit.sh
ln -nfs $PWD/.githooks/pre-commit.sh .git/hooks/pre-commit
```


## Server requirements

If you want to setup this boilerplate on a server using our preffered stack and keep compatibility with our provisioning script, make sure it contains the following components:

```
SSH access (passwordless login with RSA keys must be allowed)
Linux (Ubuntu 20.04+ is preffered)
Nginx
uWSGI
Python 3.8+
PostgreSQL 12+
PostGIS for PostgreSQL
GDAL (required for PostGIS)
psycopg2-binary (this is required for the provision script that will create db and users)
Node 12+
PM2
```


## FAQ

<details>

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

Read the instructions for [Mac OS](https://docs.docker.com/docker-for-mac/install/) or [Windows](https://docs.docker.com/docker-for-windows/install/) on docker.com.


### How do I run the test suite locally?

```
docker-compose run --rm python test
```


### How do I run custom manage.py commands?

To run manage.py commands in docker is pretty straightforward, instead of targetting you local machine you just target your `python` container.

- Example: Create migrations

```
docker-compose exec python ./manage.py makemigrations
```

- Example: Run migrations

```
docker-compose exec python ./manage.py migrate
```

We also have a manage.sh script to make running management commands easier.

```
scripts/manage.sh makemigrations
```


### How do I add new python dependencies?

First update your requirements/base.txt, then rebuild your container:

```
docker-compose stop
docker-compose up --build
```


### This boilerplate is https by default, I only want http?

No problem, update your docker-compose file and add `command: runserver` to your `web` container, then restart your project.


### How do I install the application on the web server?

This project includes a provision script that sets up anything necessary to run the application (install db, add nginx/uwsgi conf).

```
ansible-playbook provision.yml -i stages/<stage>
```

### Is there a api for retriving pages as json?

Sure! Just add `?format=json` to your url and it will return its json representation.

</details>


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

{% if cookiecutter.software_license != 'proprietary' %}
{{cookiecutter.project_name}} is released under the {{cookiecutter.software_license}} license.
{% else %}
{{cookiecutter.project_name}} is proprietary software. All rights reserved.
{% endif %}
