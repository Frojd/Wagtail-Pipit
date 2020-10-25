#!/bin/sh

# Run the test suite before every push

# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done

docker-compose run python test --rm

exit $?
