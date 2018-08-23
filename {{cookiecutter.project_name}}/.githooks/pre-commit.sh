#!/bin/sh

# Make sure black runs on touched files
pyfiles=$(git diff --cached --name-only --diff-filter=ACM "*.py" | grep -v /migrations/)
for i in $pyfiles; do black "$i" --check || exit 1; done;
