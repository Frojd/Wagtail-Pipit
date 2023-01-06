# Setting up deployment on CircleCI

In this tutorial we'll explain how to successfully set up a Continious Integration (CI) and Continuous Deployment (CD) pipeline using Circle CI.

## Requirements

- An understanding of what [CI](https://www.atlassian.com/continuous-delivery/continuous-integration) is
- An understanding of what [CD](https://www.atlassian.com/continuous-delivery/continuous-deployment) is
- An understanding of what [Ansible](https://www.ansible.com/overview/how-ansible-works) is
- An understanding of what a [Ansible Playbook](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html) is
- An understanding of what [Public Key Authentication](https://www.ssh.com/ssh/public-key-authentication) are
- A fully generated Pipit project
- Access to two separate environments for stage and production
- You have performed application provisioning on both your stage and production environments by running the ansible playbook `provision.yml`
- A Circle CI account

## Guide

- Start by generating a new ssh-key (without a passphrase) for your stage environment
- Run: `ssh-keygen -t ed25519 -C "ci@frojd.se"`
- When the "Enter file in which to save the key" prompt pops up, select a name for your key. I recommend naming it after the environment you wish to connect, such as `stage.example.com`, to makes it easier to identify which key belong where.
- On the next prompt ("Enter passphrase"), press Enter
- On the next prompt ("Enter passphrase again"), press Enter
- You now have two files:
    - `stage.myserver.com` (your private key)
    - `stage.myserver.com.pub` (your public key)
- Now repeat the steps above and generate a new set of key for production by following the same instructions we did for stage but with your production domain

- Now that you have generated ssh keys for both stage and prod it is time to add your private key to Circle CI, so Circle CI can access your servers
- Login to [Circle CI](https://circleci.com/) and add your project repo
- Open your project settings in Circle CI by going to My repository / Project Settings / SSH Keys and then scoll down to "Additional SSH Keys")
- Press "Add an SSH Key"
- In the field "Hostname" supply the host in you wish to connect to (in this case `stage.example.com` and `example.com`)
- In the second field called "Private key", copy and paste the content within your private key here
    - (For Mac) Copy file content to clipboard: `cat stage.myserver.com | pbcopy`
- Press Add SSH Key to save and finialize the CI configuration
- Send the public part of your key (`stage.myserver.com.pub`) to your hosting partner
    - Or if you manage the server yourself, add it to `~/.ssh/authorized_users` on your server
    
- When this is done, run your Circle CI build by either doing a new commit to your repository or trigger a build from the Circle CI interface
- Done!

## CI configuration

- By default pushes to the `master` and `main` branches are ignored
- Pushes to the develop branch triggers a build, tests and deploy with the stage deployment
- Pushing a feature branch will trigger a build and run tests, but will not trigger deployment
- Pushing a tag prefixed with 'v' triggers a build, test and deploy with the production deployment
- Changes to any of the files in `.ciignore` will not trigger a build

## Note

- Once you have verified that your build works as expected, for security sake, delete the keys from your local machine
