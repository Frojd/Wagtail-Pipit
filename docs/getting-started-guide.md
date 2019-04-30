# Getting Started Guide

This is a brief guide intended to get you up and running 
in just a few minutes

## Requirements
Make sure you have the following requirement:
- [Docker Compose](https://docs.docker.com/compose/)
- [cookiecutter](https://github.com/audreyr/cookiecutter)
- [node](https://nodejs.org/en/) (v10, the latest LTS version is recommended and also specified in the `.nvmrc` file)


## Initialize Project

Run the cookiecutter and fill out the questions asked by the interface:
```
cookiecutter https://github.com/Frojd/Wagtail-Boilerplate.git
```

Cookiecutter will ask for credentials which you may not have or need:
Don't worry about it and just leave the defaults for now.
You can update or remove those later.

It could look like this:
```
project_name [Company-Project]: Acme-Blog
project_slug [acme_blog]:
domain_prod [example.com]: blog.acme.com
domain_stage [stage.example.com]: stage-blog.acme.com
ssh_prod [devops@blog.acme.com]:
ssh_stage [devops@stage-blog.acme.com]:
db_name_prod [acme_blog]:
db_name_stage [acme_blog]:
s3_bucket_prod [s3.blog.acme.co]:
s3_bucket_stage [s3.stage-blog.acme.com]:
docker_web_port [8081]:
docker_db_port [5433]:
docker_vscode_debug_port [5678]:
aws_devops_iam_username [acme_blog_devops]:
version [0.1.0]:
Select software_license:
1 - MIT
2 - proprietary
Choose from 1, 2 (1, 2) [1]: 2
```

## Setting up the frontend

Unlike most Django stacks, our frontend is rendered via React rather than 
Django Template Language. So we also need to make sure that
Webpack is running, go to the `./frontend` folder in your newly created project
(named as `project_name` from the wizard) and get the frontend up and running:

```
cd Acme-Blog/frontend
npm i
npm run multiwatch
```

The `multiwatch` command will both serve a frontend development server where you can work with the
frontend decoupled from Django and built assets to your Django application.
This is great if you have dedicated frontend developers because they do not need to know
Django at all to do productive work.

Read more about the frontend stack in our
[frontend developer workflow guide](./frontend-developer-guide.md).


## Booting up Docker

The Django application will be served through Docker. To start it, run the following from the project root:
```
docker-compose up
```

When Docker is finished, your app should be up and running on the
`docker_web_port` specified in the wizard (`http://localhost:8081` in our example).

You can log in to the Wagtail-admin (`http://localhost:8081/cms`) or the
Django-admin (`http://localhost:8081/admin`) using the following credentials:
```
username: admin
password: admin
```

If you are not used to working in a docker environment here are a few tip
 to get you started:

### You want to run management commands from `within` the docker environment

For convenience we are providing a script for that, so instead of running the usual
`python manage.py` from the project root, you can run `./scripts/manage.sh`. i.e.:
```
./scripts/manage.sh makemigrations
./scripts/manage.sh migrate
```
If you rather want to work within a shell in the docker container, you can do so:
```
docker-compose exec web bash
```

### Installing requirements need to happen `within` the docker environment

Like for management commands, we provide a script to for this. When adding requirement you can install them like this:
```
./scripts/pip.sh install -r requirements/local.txt
```
If you prefer, you can start a shell in the container and go on as you are used to:

```
docker-compose exec web bash
```


## Other recommendations

### Git hooks, GitFlow and semantic versioning

We at Fröjd like [GitFlow](https://github.com/petervanderdoes/gitflow-avh) and [semantic versioning](https://semver.org/) a lot.

While this is optional, we do provide some nice git hooks and have tailored the bundled CI-chain for this.
Therefore, we recommend you to install [git flow](https://github.com/petervanderdoes/gitflow-avh) set it up like this:
```
$ git flow init
Initialized empty Git repository in /Users/roger/www/Acme-Blog/.git/
No branches exist yet. Base branches must be created now.
Branch name for production releases: [master]
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Bugfix branches? [bugfix/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? [] v
Hooks and filters directory? [/Users/roger/www/Acme-Blog/.git/hooks]
```

When git flow is initialized you can set up the git-hooks like this from the project root directory:
```
ln -nfs $PWD/.githooks/bump-version.sh .git/hooks/post-flow-release-start
ln -nfs $PWD/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
ln -nfs $PWD/.githooks/pre-push.sh .git/hooks/pre-push
ln -nfs $PWD/.githooks/pre-commit.sh .git/hooks/pre-commit
```

This will:
- Automatically keep the version-numbers in your source files in sync with the current release version
- Run the [Black](https://black.readthedocs.io/en/stable/) formatter on commit
- Run your test suite locally before pushing your commits, so that you catch errors before your boss see them failing on the CI :)


### Set up local SSL certificate

For us to support local certificates you need to install a tool called [mkcert](https://github.com/FiloSottile/mkcert) a long with a root certificate.

- Install mkcert
- Add root cert `mkcert -install`
- Create a cert for your project `mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem example.com.test`
- Add the command `runserver_ssl` to your docker container
Example:
```yml
services
  web:
    ...
    command: runserver_ssl
    ...
```
- Restart docker



## Troubleshooting

If you have any problem getting your project up and running.
Please let us know by filing an issue and we will help you out.

Reported issues gives us valuable insights on how we can improve the stack and documentation.
