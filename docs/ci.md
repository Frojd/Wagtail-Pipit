# Settings up continuous integration on CircleCI

This project utilizes Continious Integration (CI) and Continious Deployment (CD) and is based on [Circle CI](https://circleci.com), the config can be found at `.circleci/config.yml`. Our deploy scripts are based on [ansistrano](https://github.com/ansistrano) (running [ansible](https://github.com/ansible/ansible)), the scripts are in the `deploy` directory.

## Rules

The circle-config ignores the master branch.

Push to develop-branch is deployed to stage.

When pushing a tag prefixed with 'v.' it will be deployed to production. 

Read more about deployment in the [Deploying with Ansistrano](https://github.com/Frojd/Wagtail-Pipit/blob/master/docs/deployment.md) section.
