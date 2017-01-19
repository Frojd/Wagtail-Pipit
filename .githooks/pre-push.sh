#!/bin/sh

# Run the test suite before every push

# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done


# Django tests
eval $(docker-machine env default)

TEST_CONTAINER="<project_prefix>_web_1"

if [ "$(docker ps | grep <project_prefix>_web_run_1)" ]; then
    TEST_CONTAINER="<project_prefix>_web_run_1"
fi

git diff --cached --name-only | if grep --quiet "src/"
then
    docker exec -i $TEST_CONTAINER python manage.py test --settings=core.settings.test --noinput
fi
