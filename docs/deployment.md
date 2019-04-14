# Deploying with Ansistrano

This project utilizes Continious Integration (CI) and Continious Deployment (CD) and is based on [Circle CI](https://circleci.com), the config can be find at `.circleci/config.yml`. Our deploy scripts are based on [ansistrano](https://github.com/ansistrano) (running [ansible](https://github.com/ansible/ansible)), the scripts are in the `deploy` directory.

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
