#!/bin/sh

# Run pep8 validation on every commit (requires pep8 pip package)

git diff --cached | pycodestyle --diff
