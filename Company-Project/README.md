# Company-Project


## Index

- [Requirements](#requirements)
- [Installation](#installation)
- [Where to go from here?](#where-to-go-from-here)
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

- Python 3.11+
- Pip
- Virtualenv (or the package manage of your choice)
- Node 20
- Docker ([Install instructions](#how-do-i-install-docker-on-macoswindows))
- [mkcert](https://github.com/FiloSottile/mkcert)


## Installation

1. Setup container .env files

    ```
    cp docker/config/python.example.env docker/config/python.env
    ```

2. Include this ip on your hosts-file

    ```
    127.0.0.1 example.com.test
    ```

    On windows you can run this command to append it:

    ```
    echo 127.0.0.1 example.com.test >> c:\windows\System32\drivers\etc\hosts
    ```

3. Add root cert: `mkcert -install` (if not already available)

4. Generate ssl certs for local development
    ```
    mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem example.com.test
    ```

5. Enable SSL in Nginx
    ```
    sed -i.bak 's/\#mkcert\ //g' docker/files/config/nginx.conf.template
    rm -f docker/files/config/nginx.conf.template.bak
    ```

6. Start project

    ```
    docker-compose up
    ```

7. Install and start frontend
    ```
    cd frontend
    nvm use
    npm i
    npm run dev
    ```
8. Visit your site on: [https://example.com.test:8082](https://example.com.test:8082)
    - ...or login to [https://example.com.test:8082/wt/cms](https://example.com.test:8082/wt/cms) (Username: `admin` and password: `admin`)


## Where to go from here?

We recommend you to check out our [Getting Started Guide](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/getting-started-guide.md). Otherwise, you can read up any of the following topics:

- [Frontend Developer Guide](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/frontend-developer-guide.md)
- [Backend Developer Guide](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/backend-developer-guide.md)
- [Provision and configure a webserver for hosting](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/provisioning-servers-for-hosting.md)
- [Setting up deployment on CircleCI](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/setting-up-deployment-with-circleci.md)
- [Adding Slack notifications to CircleCI](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-slack-notifications-to-circleci.md)
- [Sync data between environments](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/sync-data-between-environments.md)
- [Running python locally](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/running-python-locally.md)
- [Using static site generation](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/using-static-site-generation.md)
- [Working with Wagtail's routable pages](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/working-with-wagtails-routable-pages.md)
- [Serving custom content type data through Next.js](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/serving-custom-content-type-data-through-nextjs.md)
- [Adding multi language support](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-multi-language-support.md)
- [Adding wagtail-2fa support](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-wagtail-2fa-support.md)
- [Adding Sentry](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-sentry.md)
- [Handling CSRF Tokens](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/handling-csrf-tokens.md)
- [Scaffolding](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/scaffolding.md)


## Versioning

This project follows [semantic versioning](https://semver.org/).

Bump version in:

- src/pipit/settings/base.py `(APP_VERSION=)`
- frontend/package.json
- src/Dockerfile

...or just use the [bump-version](#bump-version) git hook


## Style Guide

We follow the [django coding style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


## Debugging

### VS Code

This project is configured for remote debugging using VS Code with the official Python extension. Set `VS_CODE_REMOTE_DEBUG=True` in `docker/config/python.env` and restart your container to enable it.
You should now be able to attach to the running Django server instance.

[PTVSD](https://github.com/Microsoft/ptvsd) (Python Tools for Visual Studio debug server) is configured to listen for connections on port 5678.

### pdb in Docker

To use pdb you need to start the container with service-ports exposed instead of docker-compose up. This will create a container called `<project_prefix>_python_run_1`

```
docker-compose run --rm --service-ports python
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


## FAQ

<details>

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
./scripts/manage.sh makemigrations
```


### How do I add new python dependencies?

First update your requirements/base.txt, then rebuild your container:

```
docker-compose stop
docker-compose up --build
```


### How do I install the application on the web server?

This project includes a provision script that sets up anything necessary to run the application (install db, add nginx/uwsgi conf).

```
ansible-playbook provision.yml -i stages/<stage>.yml
```

</details>


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License


Company-Project is proprietary software. All rights reserved.

