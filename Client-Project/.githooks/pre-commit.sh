#!/bin/sh

# Make sure black runs on touched files
docker-compose exec web black --exclude "/(\.eggs|\.git|\.hg|\.mypy_cache|\.nox|\.tox|\.venv|_build|buck-out|build|dist|migrations)/" ./ --check
