# Setting up deployment on GitHub Actions

In this tutorial we'll explain how to successfully set up a Continuous Integration (CI) and Continuous Deployment (CD) pipeline using GitHub Actions.

## Requirements

- An understanding of what [CI](https://www.atlassian.com/continuous-delivery/continuous-integration) is
- An understanding of what [CD](https://www.atlassian.com/continuous-delivery/continuous-deployment) is
- An understanding of what [Ansible](https://www.ansible.com/overview/how-ansible-works) is
- An understanding of what a [Ansible Playbook](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html) is
- An understanding of what [Public Key Authentication](https://www.ssh.com/ssh/public-key-authentication) are
- A fully generated Pipit project
- Access to two separate environments for stage and production
- You have performed application provisioning on both your stage and production environments by running the ansible playbook `provision.yml`
- A GitHub account with your project repository hosted on GitHub

## Guide

### Generate SSH keys

- Start by generating a new ssh-key (without a passphrase) for your stage environment
- Run: `ssh-keygen -t ed25519 -C "ci@frojd.se"`
- When the "Enter file in which to save the key" prompt pops up, select a name for your key. I recommend naming it after the environment you wish to connect, such as `stage.example.com`, to makes it easier to identify which key belong where.
- On the next prompt ("Enter passphrase"), press Enter
- On the next prompt ("Enter passphrase again"), press Enter
- You now have two files:
    - `stage.myserver.com` (your private key)
    - `stage.myserver.com.pub` (your public key)
- Now repeat the steps above and generate a new set of key for production by following the same instructions we did for stage but with your production domain

### Create GitHub environments

GitHub [environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) let you scope secrets per deployment target. The deploy workflow references two environments: `staging` and `production`.

1. Go to your repository on GitHub
2. Navigate to **Settings > Environments**
3. Click **New environment**, name it `staging`, and click **Configure environment**
4. Click **New environment** again, name it `production`, and click **Configure environment**

### Add secrets

#### Environment secrets

Because secrets are scoped to an environment, you use the **same secret name** in both — GitHub will automatically provide the correct value based on which environment the job runs in.

**Staging** (Settings > Environments > staging > Environment secrets):
- `SSH_DEPLOY_KEY` — The content of your **stage** private key
    - (Mac) Copy to clipboard: `cat stage.myserver.com | pbcopy`

**Production** (Settings > Environments > production > Environment secrets):
- `SSH_DEPLOY_KEY` — The content of your **production** private key
    - (Mac) Copy to clipboard: `cat prod.myserver.com | pbcopy`

#### Repository secrets

These are shared across all environments and configured under **Settings > Secrets and variables > Actions**:

- `SENTRY_AUTH_TOKEN` — (Optional) Your Sentry authentication token
- `NEXT_PUBLIC_SENTRY_DSN` — (Optional) Your Sentry DSN

### Add public keys to your servers

- Send the public part of your key (`stage.myserver.com.pub`) to your hosting partner
    - Or if you manage the server yourself, add it to `~/.ssh/authorized_keys` on your server
- Do the same for your production public key

### Verify

- When this is done, push a commit to your repository to trigger the GitHub Actions workflow
- You can monitor the workflow progress under the "Actions" tab in your repository
- Done!

## CI configuration

The project uses two separate GitHub Actions workflows:

- **`ci.yml`** — Runs quality gates (lint + test) on all branches and pull requests
- **`deploy.yml`** — Builds and deploys on `develop` branch pushes, `v*` tags, and manual triggers

### CI workflow (`ci.yml`)
- Runs on all branches except `main` and `release/**`
- Also runs on pull requests
- Runs lint and test jobs for both frontend and backend in parallel

### Deploy workflow (`deploy.yml`)
- Pushes to the `develop` branch trigger a build and deploy to staging
- Pushing a tag prefixed with `v` triggers a build and deploy to production
- Manual deployments can be triggered via the "Run workflow" button in the Actions tab, with environment and git ref selection
- Each deploy job declares an `environment:` so GitHub automatically resolves the correct secrets and enforces any protection rules you configured

## Note

- Once you have verified that your build works as expected, for security sake, delete the keys from your local machine
