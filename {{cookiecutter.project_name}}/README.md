# {{cookiecutter.project_name}}

{{cookiecutter.description}}


## Index

- [Requirements](#requirements)
- [Installation](#installation)
- [Versioning](#versioning)
- [Style Guide](#style-guide)
- [Debugging](#debugging)
- [Deployment](#deployment)
- [Merge conflicts](#merge-conflicts)
- [Git hooks](#git-hooks)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)


## Requirements

- Python 3.6+ 
- Pip
- Virtualenv
- Docker ([Install instructions](#how-do-i-install-docker-on-macoswindows))


## Installation

1. Setup container .env files

    ```
    cp docker/config/web.example.env docker/config/web.env
    ```

2. Include this ip on your hosts-file

    ```
    127.0.0.1 {{cookiecutter.domain_prod}}.test
    ```

    On windows you can run this command to append it:

    ```
    echo 127.0.0.1 {{cookiecutter.domain_prod}}.test >> c:\windows\System32\drivers\etc\hosts
    ```

3. Start project

    ```
    docker-compose up
    ```

4. Visit your site on: [http://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_port}}](http://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_port}})


## Versioning

This project follows [semantic versioning](http://semver.org/).

Bump version in:

- src/core/settings/base.py `(APP_VERSION=)`
- frontend/package.json
- src/Dockerfile

...or just use the [bump-version](#bump-version) git hook


## Style Guide

We follow the [django coding style](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


## Debugging

This project is configured for remote debugging using VS Code with the official Python extension. Set `VS_CODE_REMOTE_DEBUG=True` in `docker/config/web.env` and restart your container to enable it. 
You should now be able to attach to the running Django server instance. 

[PTVSD](https://github.com/Microsoft/ptvsd) (Python Tools for Visual Studio debug server) is configured to listen for connections on port {{cookiecutter.docker_vscode_debug_port}}. 


## Deployment

This project utilizes Continious Integration (CI) and Continious Deployment (CD), what this means is that everytime a team member runs `git push`, our CI environment (Circle CI) will run tests on the application and if successfull, will automatically deploy the application to stage or production.

Our deploy scripts are based on [ansistrano](https://github.com/ansistrano) (running [ansible](https://github.com/ansible/ansible)).

### Deploying manually

It's possible you deploy manually and is something that you usually do this before CI is configured.

#### Requirements

- Python 3.6 and pip
- Virtualenv
- Mac OS or Linux ([Windows does not currently work](http://docs.ansible.com/ansible/latest/intro_windows.html#windows-how-does-it-work))

#### How to

1. Open deployment folder: `cd deploy`
2. Setup and activate virtualenv: `virtualenv venv && venv/bin/activate`
3. Install ansible: `pip install -r requirements.txt`
4. Install ansistrano: `ansible-galaxy install -r requirements.yml`

#### Deploy application

- Stage: `ansible-playbook deploy.yml -i stages/stage`
- Prod: `ansible-playbook deploy.yml -i stages/prod`

#### Rollback application

- Stage: `ansible-playbook rollback.yml -i stages/stage`
- Prod: `ansible-playbook rollback.yml -i stages/prod`


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

### Hook: Run styleguide validation on commit

```bash
chmod +x $PWD/.githooks/pre-commit.sh
ln -nfs $PWD/.githooks/pre-commit.sh .git/hooks/pre-commit
```

Note: This requires the black package (`pip install black`)


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

Read the instructions for [Mac OS](https://docs.docker.com/docker-for-mac/install/) or [Windows](https://docs.docker.com/docker-for-windows/install/) on docker.com. We no longer recommend using Docker Toolbox.


### How can I run pdb on the python container?

Start the container with service-ports exposed instead of `docker-compose up`. This will create a container called `<project_prefix>_web_run_1`

```
docker-compose run --rm --service-ports web
```


### How do I run the test suite locally?

```
docker-compose run --rm web test
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
docker-compose up --build
```

</details>


### How do I install the application on the web server?

This project includes a provision script that sets up anything necessary to run the application (install db, add nginx/uwsgi conf).

```
ansible-playbook provision.yml -i stages/<stage>
```


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

{% if cookiecutter.software_license != 'proprietary' %}
{{cookiecutter.project_name}} is released under the {{cookiecutter.software_license}} license.
{% else %}
{{cookiecutter.project_name}} is proprietary software. All rights reserved.
{% endif %}
