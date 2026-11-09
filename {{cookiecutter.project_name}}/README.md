# {{cookiecutter.project_name}}


## Index

- [Requirements](#requirements)
- [Installation](#installation)
- [Where to go from here?](#where-to-go-from-here)
- [Parallel Claude worktrees](#parallel-claude-worktrees)
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

- Python 3.14+
- [uv](https://docs.astral.sh/uv/)
- Node 24
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

4. Generate ssl certs for local development
    ```
    mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem {{cookiecutter.domain_prod}}.test
    ```

5. Enable SSL in Nginx
    ```
    sed -i.bak 's/\#mkcert\ //g' docker/files/config/nginx.conf.template
    rm -f docker/files/config/nginx.conf.template.bak
    ```

6. Start project

    ```
    docker compose up
    ```

7. Install and start frontend
    ```
    cd frontend
    nvm use
    npm ci
    npm run dev
    ```
8. Visit your site on: [https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_ssl_port}}](https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_ssl_port}})
    - ...or login to [https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_ssl_port}}/wt/cms](https://{{cookiecutter.domain_prod}}.test:{{cookiecutter.docker_web_ssl_port}}/wt/cms) (Username: `admin` and password: `admin`)


## Where to go from here?

We recommend you to check out our [Getting Started Guide](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/getting-started-guide.md). Otherwise, you can read up any of the following topics:

- [Frontend Developer Guide](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/frontend-developer-guide.md)
- [Backend Developer Guide](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/backend-developer-guide.md)
- [Provision and configure a webserver for hosting](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/provisioning-servers-for-hosting.md)
- [Setting up deployment on GitHub Actions](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/setting-up-deployment-with-github-actions.md)
- [Sync data between environments](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/sync-data-between-environments.md)
- [Running python locally](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/running-python-locally.md)
- [Working with Wagtail's routable pages](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/working-with-wagtails-routable-pages.md)
- [Serving non-HTML content](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/serving-non-html-content.md)
- [Adding multi language support](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-multi-language-support.md)
- [Adding wagtail-2fa support](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-wagtail-2fa-support.md)
- [Adding Sentry](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/adding-sentry.md)
- [Handling CSRF Tokens](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/handling-csrf-tokens.md)
- [Scaffolding](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/scaffolding.md)
- [Migrating from the Pages Router](https://github.com/Frojd/Wagtail-Pipit/blob/main/docs/migrating-from-pages-router.md)


## Parallel Claude worktrees

`claude -w <name>` starts a session in its own git worktree, `.claude/worktrees/<name>` on branch `worktree-<name>` from `develop`. Env files and `CLAUDE.local.md` are copied over.

With Nix installed each worktree also gets its own database and dev servers, so parallel sessions never share data or ports. Without Nix the worktree is a plain checkout. The main checkout keeps using Docker either way.

### Setup

1. Install Nix and open a new terminal

    ```bash
    curl -fsSL https://install.determinate.systems/nix | sh -s -- install
    ```

2. Install devenv and direnv, then build the toolchain once in the main checkout (takes several minutes)

    ```bash
    nix profile install nixpkgs#devenv nixpkgs#direnv
    devenv shell -- true
    ```

If devenv warns that you are not a trusted user, add `trusted-users = root <your user>` to `/etc/nix/nix.custom.conf` and restart the Nix daemon, so it can use the binary cache.

### Usage

A session start prepares the venv, `node_modules` and env files, then:

- `stack-up` starts Postgres, Django, Next.js and nginx. The first start loads `docker/files/db-dumps/*.sql` (if any) and creates `admin/admin`
- `stack-down` stops them, they also stop when the session ends
- `storybook-dev` runs Storybook

Claude gets these commands automatically. In your own terminal run them inside `devenv shell` in the worktree, or hook direnv into your shell.

Each worktree gets a slot `n` from 1 to 9 and uses the Docker ports plus `100n`, so the first worktree is on `http://<name>.localhost:{{ cookiecutter.docker_web_port|int + 100 }}`. Claude is told the exact ports at session start. Set `WORKTREE_AUTOSTART=1` to run `stack-up` on every session start.

Other scripts in `scripts/worktree/`:

- `restore-db.sh`: reset the worktree db from the dump
- `remove.sh <path>`: remove a worktree by hand
- `prune.sh [--remove]`: list (or remove) worktrees left behind by subagents

If `stack-up` fails, see `.devenv/worktree-up.log`. A port that is already taken stops it with an error, change the slot in `devenv.local.nix`.


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

[debugpy](https://github.com/microsoft/debugpy) is configured to listen for connections on port {{cookiecutter.docker_vscode_debug_port}}.

### pdb in Docker

To use pdb you need to start the container with service-ports exposed instead of docker compose up. This will create a container called `<project_prefix>_python_run_1`

```
docker compose run --rm --service-ports python
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
docker compose run --rm python test
```


### How do I run custom manage.py commands?

To run manage.py commands in docker is pretty straightforward, instead of targetting you local machine you just target your `python` container.

- Example: Create migrations

```
docker compose exec python ./manage.py makemigrations
```

- Example: Run migrations

```
docker compose exec python ./manage.py migrate
```

We also have a manage.sh script to make running management commands easier.

```
./scripts/manage.sh makemigrations
```


### How do I add new python dependencies?

Use uv inside the container to add the dependency:

```
docker compose exec python uv add <package-name>
```

Or use the helper script:

```
scripts/uv.sh add <package-name>
```

This updates `pyproject.toml` and `uv.lock`. Then rebuild your container:

```
docker compose stop
docker compose up --build
```

For test-only dependencies: `scripts/uv.sh add --group test <package-name>`
For dev-only dependencies: `scripts/uv.sh add --group dev <package-name>`


### How do I install the application on the web server?

This project includes a provision script that sets up anything necessary to run the application (install db, add nginx/gunicorn conf).

```
ansible-playbook provision.yml -i stages/<stage>.yml
```

</details>


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

{% if cookiecutter.software_license != 'proprietary' %}
{{cookiecutter.project_name}} is released under the {{cookiecutter.software_license}} license.
{% else %}
{{cookiecutter.project_name}} is proprietary software. All rights reserved.
{% endif %}
