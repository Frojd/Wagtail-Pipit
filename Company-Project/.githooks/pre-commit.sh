#!/bin/sh

# Make sure python code are black formatted
docker-compose exec -T web black --exclude "/(\.eggs|\.git|\.hg|\.mypy_cache|\.nox|\.tox|\.venv|_build|buck-out|build|dist|migrations)/" ./ --check
