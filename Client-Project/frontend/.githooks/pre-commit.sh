#!/bin/sh

COMP_PATTERN="app/components"
CONT_PATTERN="app/containers"

git diff --name-only | if grep --quiet -e $COMP_PATTERN -e $CONT_PATTERN
then
    npm test && npm run eslint
fi