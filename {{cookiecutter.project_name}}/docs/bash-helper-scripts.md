# Bash helper scripts

./scripts contains a bunch of helpful scripts for handling common project tasks such as syncing content and dealing with the container.


## Syncscripts

- ``./scripts/prod_to_local.sh`` - sync prod database to local database
- ``./scripts/stage_to_local.sh`` - sync sync database to local database
- ``./scripts/example_prod_to_stage.sh`` - a starting point for a script syncing prod data to stage. 
- ``./scripts/restore_db.sh`` - Reset database
- ``./scripts/store_db.sh`` - Create database dump

## Shortcuts

- ``./scripts/manage.sh`` - shortcut for running manage.py commands in docker container 
