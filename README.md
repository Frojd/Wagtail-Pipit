# Wagtail-Boilerplate

This is a cookiecutter Django/Wagtail boilerplate that covers best practices and a docker configuration. Inspiration from [Cookiecutter Django](https://github.com/pydanny/cookiecutter-django).


## Features

- Django 2.1
- Wagtail 2.3
- Docker and Docker-compose support
- [12-Factor](https://12factor.net/) based
- React templates with SSR
- Settings primed for production
- Optional file storage through AWS S3
- Third part integrations:
    - Sentry
    - GTM
    - Browser Update
    - Circle CI
- Tests using [pytest-django](http://pytest-django.readthedocs.io/en/latest/)
- Deploy scripts using [ansistrano](https://github.com/ansistrano)
- Scripts for syncing data from remote to local machine
- ...and for syncing prod => stage


## Example

This repo includes a generated project, you can find it [here](./Client-Project)


## Usage

1. Install cookiecutter, there are several options:
    - `pip install cookiecutter`
    - `brew install cookiecutter`

2. Generate project:
```
cookiecutter https://github.com/Frojd/Wagtail-Boilerplate.git
```

3. Insert your custom vars:
```
project_name [Client-Project]: Example-Project
project_slug [example_project]:
author_name [You]:
email [you@example.com]:
description [A short description of the project.]: Example description.
domain_prod [example.com]:
domain_stage [stage.example.com]:
ssh_prod [user@prod-server]:
ssh_stage [user@stage-server]:
db_name_prod [prod_db]:
db_name_stage [stage_db]:
s3_bucket_prod [s3.example.com]:
s3_bucket_stage [s3.stage.example.com]:
docker_web_port [8081]:
docker_db_port [5433]:
aws_devops_iam_username [client_devops]:
version [0.1.0]: 1.0.0
Select software_license:
1 - MIT
2 - proprietary
Choose from 1, 2 [1]: 1
```

4. Done! You now have a ready django project.


## Versioning

This boilerplate uses [semantic versioning](http://semver.org/) and follow django's MAJOR and MINOR version numbers, PATCH has no connection to django version, but is something we use to indicate updates.


## Contributing

Want to contribute? Awesome. Just send a pull request.


## License

Fröjd Django Boilerplate is released under the [MIT License](http://www.opensource.org/licenses/MIT).
