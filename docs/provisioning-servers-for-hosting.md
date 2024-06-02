# Provisioning webserver

In this guide we'll explain how to use the included provisioning script to install a Pipit generated application on a server.


## Requirements (webserver, aka ansible host)

The server should have these applications/packages installed:
- Linux (Ubuntu 20.04+ is preffered)
- Nginx
- uWSGI
- Python 3.11+
- PostgreSQL 12+
- PostGIS for PostgreSQL
- GDAL (required for PostGIS)
- Node 20+
- [PM2](https://pm2.io/)
- [psycopg2-binary](https://pypi.org/project/psycopg2-binary/) (this is required for the provision script that will create db and users)

Linux should have these users (with passwordless login using RSA keys):
- "root" - Used when provisioning web server
- "deploy" - Used for deployment

Configuration:
- Systemd jobs for Nginx, uWSGI and pm2
- Nginx configuration are stored at `/mnt/persist/nginx/conf.d/*`
- Node configuration are stored at `/mnt/persist/nodejs/*`
- Your web applications are stored at `/mnt/persist/www/*`
- The root user can access the psql shell without password

## Requirements (your computer, aka control node)

- A fully generated Pipit project
- Rsync installed
- A MacOS or Linux computer ([Ansible does not support Windows](http://blog.rolpdog.com/2020/03/why-no-ansible-controller-for-windows.html))
- Access to the webserver over ssh with both the "root" and "deploy" user

## Guide

- Begin by going to the deploy dir in your project and install [Ansible](https://www.ansible.com/)
    ```
    >>> cd deploy
    >>> python3 -m venv venv
    >>> . venv/bin/activate
    >>> pip install -r requirements.txt
    ```

- Make sure you can connect to the server by pinging it
    ```
    >>> ansible -i stages/stage.yml webservers -m ping
    stage1 | SUCCESS => {
        "ansible_facts": {
            "discovered_interpreter_python": "/usr/bin/python3"
        },
        "changed": false,
        "ping": "pong"
    }
    ```

- After this, we install [Ansistrano](https://ansistrano.com/):
    ```
    >>> ansible-galaxy install -r requirements.yml
    ```
- (Optional) If you want another database collation then sv_SE update `lc_collate` and lc_ctype` in provision.yml
- Now that we have everything installed, lets run the provisioning:
- For stage
    ```
    >>> ansible-playbook provision.yml -i stages/stage.yml
    ```
- For prod
    ```
    >>> ansible-playbook provision.yml -i stages/prod.yml
    ```
- This will script will run the necessary steps to make sure your application is ready to be deployed
- The next step is to run a deploy to sent our application to the server and start it
- For stage
    ```
    >>> ansible-playbook deploy.yml -i stages/stage.yml
    ```
- For prod
    ```
    >>> ansible-playbook deploy.yml -i stages/prod.yml
    ```
- Done!


## Troubleshooting

-  I'm having issues running the initial migrations: `Permission denied to create extension "postgis" HINT:  Must be superuser to create this extension`
    - Connect to your server as root/superuser
    - Run `psql` on the server
    - Open your db `\c mydb`
    - Run `CREATE EXTENSION IF NOT EXISTS postgis`

- I'm getting the error `Failed to import the required Python library` when running `Creates postgres database` when running playbook in `--check` mode
    - It's a known issue, because of this check mode is not supported for the provision playbook

## Note
- This script does not perform server provisioning, only application provisioning. But there are plenty of [guides on how to do this](https://clouding.io/hc/en-us/articles/360013788600-How-to-provision-Ubuntu-server-with-Ansible-scripts).
